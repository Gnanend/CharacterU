const MentorChat = require('../models/MentorChat');
const User = require('../models/User');
const Progress = require('../models/Progress');
const DailyCheckIn = require('../models/DailyCheckIn');
const ApiError = require('../utils/ApiError');
const geminiService = require('../services/geminiService');

exports.getChatHistory = async (req, res, next) => {
  try {
    let chat = await MentorChat.findOne({ user: req.user.id });
    if (!chat) {
      chat = await MentorChat.create({
        user: req.user.id,
        messages: [{ role: 'assistant', content: "Hello! I'm your AI Character Mentor. How can I help you grow today?" }]
      });
    }

    // Check if daily message needs update
    const today = new Date().setHours(0, 0, 0, 0);
    const lastUpdate = chat.lastMotivationalUpdate ? new Date(chat.lastMotivationalUpdate).setHours(0, 0, 0, 0) : 0;
    
    if (today > lastUpdate) {
      chat.dailyMotivationalMessage = "Every step forward counts. Keep building your character today!";
      chat.lastMotivationalUpdate = new Date();
      await chat.save();
    }

    res.status(200).json({ status: 'success', data: chat });
  } catch (error) {
    next(error);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) throw new ApiError(400, 'Message content is required');

    let chat = await MentorChat.findOne({ user: req.user.id });
    if (!chat) {
      chat = await MentorChat.create({ user: req.user.id, messages: [] });
    }

    // Append user message
    chat.messages.push({ role: 'user', content });

    // Gather context
    const checkIns = await DailyCheckIn.countDocuments({ user: req.user.id });
    const progressList = await Progress.find({ user: req.user.id });
    const completedCourses = progressList.filter(p => p.completionPercentage === 100).length;
    
    const isEligible = req.user.characterScore >= 80 && checkIns >= 7;

    const studentContext = {
      fullName: req.user.fullName,
      role: req.user.role,
      characterScore: req.user.characterScore,
      checkIns,
      completedCourses,
      isEligible
    };

    // Generate AI response using Gemini Service
    let aiResponseContent;
    try {
      aiResponseContent = await geminiService.generateResponse(studentContext, chat.messages, content);
    } catch (apiErr) {
      aiResponseContent = apiErr.message;
    }

    chat.messages.push({ role: 'assistant', content: aiResponseContent });
    await chat.save();

    res.status(200).json({ 
      status: 'success', 
      data: {
        message: { role: 'assistant', content: aiResponseContent },
        chat
      }
    });
  } catch (error) {
    next(error);
  }
};
