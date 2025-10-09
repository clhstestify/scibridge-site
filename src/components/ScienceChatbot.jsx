import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

const cannedResponses = [
  {
    keywords: ['force', 'motion'],
    reply: 'A force is a push or pull. It can change an object\'s motion by speeding it up, slowing it down, or changing direction.'
  },
  {
    keywords: ['atom', 'particle'],
    reply: 'Atoms are very small particles. They have a nucleus with protons and neutrons, and electrons move around the nucleus.'
  },
  {
    keywords: ['ecosystem', 'food chain'],
    reply: 'An ecosystem is a community of living things and their environment. Energy flows from producers to consumers and then to decomposers.'
  },
  {
    keywords: ['climate', 'weather'],
    reply: 'Weather changes every day. Climate describes long-term patterns of weather in an area.'
  }
];

const getResponse = (message) => {
  const lower = message.toLowerCase();
  const match = cannedResponses.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
  if (match) {
    return match.reply;
  }
  return "I'm still learning. Try asking about force, atoms, ecosystems, or climate.";
};

const ScienceChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Ask me a science question in English. I will explain with simple words.'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input.trim() };
    const botMessage = { sender: 'bot', text: getResponse(input.trim()) };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Science Helper Chatbot</h3>
      <p className="mt-1 text-sm text-slate-600">Type a topic keyword and receive an easy English explanation.</p>
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              message.sender === 'bot'
                ? 'bg-brand-light/70 text-brand-dark'
                : 'ml-auto bg-slate-900 text-white'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Ask about force, atoms, ecosystems..."
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          Send
          <FiSend aria-hidden />
        </button>
      </form>
    </section>
  );
};

export default ScienceChatbot;
