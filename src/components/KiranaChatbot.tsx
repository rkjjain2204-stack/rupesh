import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { StoreConfig } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  config: StoreConfig;
  onNavigateToContact?: () => void;
}

const QUICK_QUESTIONS = [
  'What is in your Signature Garam Masala?',
  'How to brew the Chai / Kadha Masala?',
  'What are your Durg store timings?',
  'Is your Haldi powder pure with zero color?',
];

export const KiranaChatbot: React.FC<Props> = ({ config, onNavigateToContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: `Namaste! Welcome to Jain Kirana Stores (Dhimar Para, Brahman Para, Durg). I am your spice and store guide. How can I help you today with our handcrafted 16-spice Garam Masala, Chai Kadha Masala, pure Salem Haldi, or store directions?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText: string = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: nextMessages.slice(0, -1),
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: "Namaste! Our shop counter in Durg is ready to assist you. Please feel free to call us at " + config.phone + " or message directly on WhatsApp!",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "Namaste! For immediate assistance during store hours, please call our counter at " + config.phone + " or tap below to chat on WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#143826] text-white rounded-full shadow-xl hover:bg-[#1B4332] transition-all transform hover:-translate-y-0.5 border border-[#D49B28]/40 group"
          aria-label="Open Durg Spice Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#D49B28] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D49B28] rounded-full animate-ping opacity-75"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D49B28] rounded-full"></span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] font-semibold tracking-wider uppercase text-[#D49B28]">
              Jain Kirana
            </span>
            <span className="block text-xs font-bold text-white">
              Ask Spice Assistant
            </span>
          </div>
        </button>
      )}

      {/* Expanded Multi-turn Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[410px] h-[560px] max-h-[85vh] bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E7E2D8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#143826] text-white flex items-center justify-between shrink-0 border-b border-[#D49B28]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center border border-[#D49B28]/40 text-[#D49B28]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif text-sm font-bold text-white">
                    Spice & Store Assistant
                  </h4>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[11px] text-[#FAF8F5]/75">
                  Dhimar Para, Brahman Para, Durg · 20+ Years Heritage
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-[#1C1917]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#143826] text-white rounded-tr-xs'
                      : 'bg-white border border-[#E7E2D8] text-[#292524] rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="bg-white border border-[#E7E2D8] rounded-2xl rounded-tl-xs p-3 shadow-2xs flex items-center gap-2 text-[#78716C] text-xs">
                  <span className="w-2 h-2 bg-[#D49B28] rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-[#D49B28] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-[#D49B28] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] ml-1">Consulting spice recipe knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips (shown when few messages) */}
          {messages.length <= 4 && (
            <div className="px-4 py-2 border-t border-[#E7E2D8] bg-white flex flex-wrap gap-1.5 shrink-0">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#143826] bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#D9D3C7] rounded-full transition-colors text-left truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Quick Counter Contact CTA Bar */}
          <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#E7E2D8] flex items-center justify-between text-[11px] text-[#57514A] shrink-0">
            <span className="font-semibold text-[#143826]">Ready to place an order?</span>
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppUrl(config.whatsappNumber, "Namaste Jain Kirana Stores, I want to order spices.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#143826] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#D49B28]" />
                <span>WhatsApp</span>
              </a>
              <span className="text-[#D9D3C7]">|</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigateToContact) {
                    onNavigateToContact();
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="font-semibold text-[#143826] hover:underline"
              >
                Enquiry Form
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#E7E2D8] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about masalas, prices, storage..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-xl focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-[#143826] text-white rounded-xl hover:bg-[#1B4332] transition-colors disabled:opacity-40 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-[#D49B28]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
