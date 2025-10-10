import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext.jsx';

const cannedResponses = [
  {
    keywords: ['force', 'motion'],
    key: 'force',
    fallback:
      "A force is a push or pull. It can change an object's motion by speeding it up, slowing it down, or changing direction."
  },
  {
    keywords: ['atom', 'particle'],
    key: 'atom',
    fallback:
      'Atoms are very small particles. They have a nucleus with protons and neutrons, and electrons move around the nucleus.'
  },
  {
    keywords: ['ecosystem', 'food chain'],
    key: 'ecosystem',
    fallback:
      'An ecosystem is a community of living things and their environment. Energy flows from producers to consumers and then to decomposers.'
  },
  {
    keywords: ['climate', 'weather'],
    key: 'climate',
    fallback: 'Weather changes every day. Climate describes long-term patterns of weather in an area.'
  }
];

const resolveResponse = (message) => {
  const lower = message.toLowerCase();
  return cannedResponses.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
};

const ScienceChatbot = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      key: 'chatbot.welcome',
      fallback: 'Hello! Ask me a science question in English. I will explain with simple words.'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const trimmed = input.trim();
    const userMessage = { sender: 'user', text: trimmed };
    const responseEntry = resolveResponse(trimmed);
    const botMessage = responseEntry
      ? {
          sender: 'bot',
          key: `chatbot.responses.${responseEntry.key}`,
          fallback: responseEntry.fallback
        }
      : {
          sender: 'bot',
          key: 'chatbot.responses.fallback',
          fallback: "I'm still learning. Try asking about force, atoms, ecosystems, or climate."
        };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-slate-800/70 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40">
      <h3 className="text-lg font-semibold text-white">{t('chatbot.title', 'Science Helper Chatbot')}</h3>
      <p className="mt-1 text-sm text-slate-300">
        {t('chatbot.description', 'Type a topic keyword and receive an easy English explanation.')}
      </p>
      <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              message.sender === 'bot'
                ? 'border border-brand/40 bg-brand/15 text-brand'
                : 'ml-auto border border-slate-700 bg-slate-800/80 text-slate-100'
            }`}
          >
            {'text' in message
              ? message.text
              : t(message.key, message.fallback)}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="flex-1 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          placeholder={t('chatbot.placeholder', 'Ask about force, atoms, ecosystems...')}
          aria-label="Chat message"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(56,189,248,0.25)] transition hover:bg-brand-dark"
        >
          {t('chatbot.send', 'Send')}
          <FiSend aria-hidden />
        </button>
      </form>
    </section>
  );
};

export default ScienceChatbot;
