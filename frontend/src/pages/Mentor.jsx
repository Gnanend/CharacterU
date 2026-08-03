import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export default function Mentor() {
  const [chat, setChat] = useState({ messages: [], dailyMotivationalMessage: '' });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/mentor');
      setChat(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e, customMsg = null) => {
    e?.preventDefault();
    const msgText = customMsg || input;
    if (!msgText.trim()) return;

    const newMsg = { role: 'user', content: msgText };
    setChat(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setInput('');
    setSending(true);

    try {
      const res = await axiosInstance.post('/mentor/message', { content: msgText });
      setChat(prev => ({ ...prev, messages: [...prev.messages, res.data.message] }));
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const suggestedPrompts = [
    "How can I improve my leadership skills?",
    "Help me build better discipline.",
    "Advice for time management?",
    "How can I improve communication?",
    "Give me some career advice."
  ];

  if (loading) return <div className="p-8 text-center text-slate-400">Loading AI Mentor...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Character Mentor</h1>
          <p className="text-slate-400 text-sm">Personalized guidance based on your progress</p>
        </div>
      </div>

      {chat.dailyMotivationalMessage && (
        <div className="bg-primary-900/20 border border-primary-500/30 p-4 rounded-xl mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
          <p className="text-primary-100 font-medium">{chat.dailyMotivationalMessage}</p>
        </div>
      )}

      <div className="flex-1 bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {chat.messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-dark-800' : 'bg-primary-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-400" /> : <Bot className="w-5 h-5 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-dark-800 text-slate-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-dark-800 rounded-2xl px-5 py-4 rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-dark-800 bg-dark-950/50">
          {chat.messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={(e) => sendMessage(e, prompt)}
                  className="text-xs bg-dark-800 hover:bg-dark-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-dark-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for advice..."
              disabled={sending}
              className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl transition-colors flex items-center gap-2 font-medium"
            >
              {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
