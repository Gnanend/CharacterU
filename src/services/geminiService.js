const { GoogleGenAI } = require('@google/genai');

const SYSTEM_INSTRUCTION = `You are CharacterU AI Mentor.
CharacterU is a platform that develops leadership, ethics, discipline, communication skills, civic responsibility and personal growth.
Introduce yourself ONLY once when the user first greets you (e.g. "Hi, I am your CharacterU AI Mentor..."). Never repeat your introduction in later replies.
Maintain a natural, friendly, and professional conversation. Never sound robotic.
Remember previous conversation using the chat history provided.
Answer the user's actual question first.
Use the provided student context (Character Score, Courses, Check-ins) ONLY when it is directly relevant to the user's question or adds meaningful personalization. Do not arbitrarily list their stats if unprompted.
If the student asks about certificates, explain eligibility (80+ Character Score, 7 check-ins, 1 pledge).
If they ask unrelated questions, answer normally while maintaining your mentor personality.
Never invent student information. If information is unavailable, politely say so.
Keep normal answers concise (between 50–150 words) unless detailed answers are explicitly requested.
Never repeat the same sentence twice.`;

class GeminiService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  async initClient() {
    if (this.isInitialized) return true;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is missing. AI Mentor will run in simulated fallback mode.');
      return false;
    }

    try {
      this.client = new GoogleGenAI({ apiKey });
      
      // Fetch available models
      const modelsResponse = await this.client.models.list();
      const availableModels = [];
      
      for await (const item of modelsResponse) {
        if (item.supportedActions && item.supportedActions.includes('generateContent')) {
          availableModels.push(item.name.replace(/^models\//, ''));
        }
      }

      console.log('==========================================');
      console.log('Available Gemini Models:');
      availableModels.forEach(m => console.log(`- ${m}`));
      console.log('==========================================');

      this.availableModels = availableModels;

      const configuredModel = process.env.GEMINI_MODEL;
      if (configuredModel) {
        if (availableModels.includes(configuredModel)) {
          this.activeModel = configuredModel;
        } else {
          console.warn(`Warning: GEMINI_MODEL '${configuredModel}' is not returned by the API list.`);
          console.warn('Will try it anyway, but it may fail.');
          // Put it at the front of the list
          this.activeModel = configuredModel;
          if (!this.availableModels.includes(configuredModel)) {
             this.availableModels.unshift(configuredModel);
          }
        }
      } else {
        this.activeModel = availableModels[0];
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Gemini client:', error);
      return false;
    }
  }

  formatHistoryForGemini(messages) {
    return messages.map(msg => {
      // @google/genai format maps 'user' to 'user', and 'assistant' to 'model'
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return {
        role,
        parts: [{ text: msg.content }]
      };
    });
  }

  async generateResponse(studentContext, chatHistory, latestMessage) {
    const isReady = await this.initClient();
    if (!isReady) {
      console.log("Using Fallback: Simulated Response");
      return this.generateSimulatedResponse(studentContext, latestMessage);
    }

    try {
      console.log("Using Gemini LLM...");
      const {
        fullName,
        role,
        characterScore,
        checkIns,
        completedCourses,
        isEligible
      } = studentContext;

      // Construct context payload
      const contextPayload = `Context:
Name: ${fullName || 'Student'}
Role: ${role || 'Student'}
Character Score: ${characterScore || 0}
Check-ins: ${checkIns || 0}
Completed Courses: ${completedCourses || 0}
Certificate Eligible: ${isEligible ? 'Yes' : 'No'}

User Question:
${latestMessage}`;

      console.log("\nUser Message:\n" + latestMessage);
      console.log("\nPrompt Sent To Gemini:\n" + contextPayload);

      // chatHistory already contains the latest user message because we pushed it in the controller.
      // We must exclude it from the history array to prevent duplicate questions.
      const previousHistory = chatHistory.slice(0, -1).slice(-15);
      const formattedHistory = this.formatHistoryForGemini(previousHistory);

      if (!this.activeModel) {
        this.activeModel = this.availableModels[0];
      }

      // Order models: try activeModel first, then the rest
      let modelsToTry = this.availableModels.filter(m => m !== this.activeModel);
      modelsToTry.unshift(this.activeModel);

      let lastError = null;

      for (const modelName of modelsToTry) {
        console.log(`Trying model: ${modelName}`);

        try {
          const chat = this.client.chats.create({
            model: modelName,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
            history: formattedHistory
          });

          const response = await chat.sendMessage({ message: contextPayload });
          
          if (response && response.text) {
            console.log("\nGemini Response:\n" + response.text + "\n");
            if (this.activeModel !== modelName) {
              console.log(`Switched to: ${modelName}`);
              this.activeModel = modelName; // Cache working model
            }
            return response.text;
          } else {
            throw new Error("Invalid response structure from Gemini API");
          }
        } catch (error) {
          lastError = error;
          
          const status = error.status || error.code;
          const msg = error.message || '';
          
          const isUnavailable = 
            status === 404 || 
            status === 'NOT_FOUND' || 
            status === 400 || 
            status === 'FAILED_PRECONDITION' ||
            msg.includes('not found') || 
            msg.includes('no longer available') ||
            msg.includes('not supported');

          if (isUnavailable) {
            console.log(`Model unavailable: ${modelName} (${msg})`);
            continue; // Move to the next model
          }

          // If it's a real failure (network error, rate limit), do not try the next model.
          throw error;
        }
      }

      // If we exit the loop, all models failed
      console.error("==========================================");
      console.error('All supported Gemini models failed or were unavailable.');
      if (lastError) console.error("Last Error:", lastError.message);
      console.error("==========================================");
      throw lastError || new Error("No available Gemini models could generate a response.");

    } catch (error) {
      console.error("==========================================");
      console.error('Gemini API Error:');
      console.error(error);
      if (error.stack) console.error("Stack:", error.stack);
      console.error("==========================================");
      
      throw error;
    }
  }

  // Fallback if API key is not configured
  generateSimulatedResponse(context, message) {
    const msg = message.toLowerCase();
    const { characterScore, checkIns, completedCourses } = context;

    if (msg.match(/^(hi|hello|hey|greetings)/)) {
      return `Hello there! I see you currently have a Character Score of ${characterScore}. I'm your AI Mentor, here to guide you. What would you like to focus on today?`;
    }
    
    if (msg.includes('certificate')) {
      if (characterScore >= 80) return `You're doing excellent! With a score of ${characterScore}, you meet the character threshold for the certificate. Make sure you've also completed your required pledges and check-ins!`;
      return `To earn your blockchain certificate, you need to reach a Character Score of 80 (you are currently at ${characterScore}), complete at least 7 check-ins (you have ${checkIns}), and finish 1 pledge. Keep pushing forward!`;
    }

    return `That's a great question about personal growth. Remember that your character journey is unique. With a score of ${characterScore}, you're making steady progress. Let's break this down into actionable steps: 1) Identify the core obstacle, 2) Set a micro-goal, and 3) Stay consistent. How does that sound?`;
  }
}

module.exports = new GeminiService();
