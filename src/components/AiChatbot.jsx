import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, MapPin, Star, ArrowRight, TrendingUp, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockHotels } from '../data/mockData';

const PROMPT_CHIPS = [
  '🏖️ Beachfront in Goa under ₹5,000',
  '🏔️ Snow-view lodges in Manali',
  '👑 Royal palaces in Rajasthan',
  '🌴 Ayurvedic retreats in Kerala',
  '📈 How does Dynamic Pricing work?'
];

export default function AiChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your SmartStay AI Concierge. Ask me for recommendations across Goa, Mumbai, Manali, Kerala, Rajasthan, Delhi, or Bengaluru, or ask how our real-time Dynamic Pricing engine works!',
      hotels: []
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(query);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600);
  };

  const generateAiResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Dynamic Pricing explanation intent
    if (q.includes('dynamic pricing') || q.includes('how does') || q.includes('price work') || q.includes('algorithm') || q.includes('rate')) {
      return {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'SmartStay uses a real-time Scikit-Learn Random Forest model that calculates fair room rates based on 7 live factors: current hotel occupancy %, local destination demand surges, seasonality, weekend multipliers, lead time to check-in, and guest ratings.\n\n💡 Pro Tip: Booking 14+ days in advance or traveling on Tuesday/Wednesday gives you the lowest dynamic rates!',
        hotels: []
      };
    }

    // 2. Search hotels by destination or keyword
    let matches = [];
    let detectedCity = '';

    if (q.includes('goa')) detectedCity = 'Goa';
    else if (q.includes('mumbai')) detectedCity = 'Mumbai';
    else if (q.includes('bengaluru') || q.includes('bangalore')) detectedCity = 'Bengaluru';
    else if (q.includes('delhi')) detectedCity = 'Delhi';
    else if (q.includes('rajasthan') || q.includes('jaipur') || q.includes('udaipur')) detectedCity = 'Jaipur';
    else if (q.includes('kerala') || q.includes('kochi') || q.includes('munnar') || q.includes('alleppey')) detectedCity = 'Kerala';
    else if (q.includes('manali') || q.includes('shimla') || q.includes('himachal')) detectedCity = 'Manali';

    if (detectedCity) {
      matches = mockHotels.filter((h) => h.location.city.toLowerCase() === detectedCity.toLowerCase());
    } else if (q.includes('beach') || q.includes('sea') || q.includes('ocean')) {
      matches = mockHotels.filter((h) => h.location.city === 'Goa' || h.name.toLowerCase().includes('beach') || h.name.toLowerCase().includes('sea'));
    } else if (q.includes('mountain') || q.includes('snow') || q.includes('hill')) {
      matches = mockHotels.filter((h) => h.location.city === 'Manali');
    } else if (q.includes('palace') || q.includes('heritage') || q.includes('royal')) {
      matches = mockHotels.filter((h) => h.location.city === 'Jaipur' || h.name.toLowerCase().includes('palace') || h.name.toLowerCase().includes('heritage'));
    } else if (q.includes('budget') || q.includes('under') || q.includes('cheap')) {
      matches = mockHotels.filter((h) => h.rooms.some((r) => r.basePrice <= 3500));
    } else {
      // Default: top rated hotels
      matches = mockHotels.filter((h) => h.rating >= 4.8);
    }

    // Filter by budget if specified
    if (q.includes('5000') || q.includes('5,000')) {
      matches = matches.filter((h) => h.rooms.some((r) => r.basePrice <= 5000));
    } else if (q.includes('3000') || q.includes('3,000')) {
      matches = matches.filter((h) => h.rooms.some((r) => r.basePrice <= 3000));
    }

    const topRecommendations = matches.slice(0, 3);

    let reply = `Here are my top recommended stays for you${detectedCity ? ` in ${detectedCity}` : ''}:`;
    if (topRecommendations.length === 0) {
      reply = `I searched our 70+ luxury properties across India! Here are our highest-rated retreats you might love:`;
      topRecommendations.push(...mockHotels.slice(0, 3));
    }

    return {
      id: Date.now().toString(),
      sender: 'ai',
      text: reply,
      hotels: topRecommendations
    };
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Open AI Concierge"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <Sparkles size={18} className="text-amber-400" />
            <span>AI Concierge</span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[580px] w-[380px] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md">
                <Bot size={22} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">SmartStay Concierge</h3>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">AI</span>
                </div>
                <p className="text-xs text-slate-400">Powered by ML Rate Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Close Chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'border border-slate-800 bg-slate-900/90 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Recommendation Mini-Cards */}
                {m.hotels && m.hotels.length > 0 && (
                  <div className="mt-3 w-full space-y-2.5">
                    {m.hotels.map((h) => {
                      const minPrice = Math.min(...(h.rooms || [{ basePrice: 3000 }]).map((r) => r.basePrice));
                      return (
                        <div
                          key={h._id || h.id}
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/hotels/${h._id || h.id}`);
                          }}
                          className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-2.5 transition hover:border-indigo-500 hover:bg-slate-850"
                        >
                          <img
                            src={h.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                            alt={h.name}
                            className="h-16 w-20 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                <MapPin size={11} className="text-indigo-400" />
                                {h.location?.city || h.city}
                              </span>
                              <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                                <Star size={11} fill="currentColor" /> {h.rating}
                              </span>
                            </div>
                            <h4 className="truncate text-xs font-bold text-white group-hover:text-indigo-400">
                              {h.name}
                            </h4>
                            <p className="mt-1 text-xs font-semibold text-emerald-400">
                              From ₹{minPrice.toLocaleString('en-IN')}{' '}
                              <span className="text-[10px] font-normal text-slate-400">/ night</span>
                            </p>
                          </div>
                          <ArrowRight size={15} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-indigo-400" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-3 text-slate-400">
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-slate-800/80 bg-slate-900/40 p-2.5">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSend(chip)}
                  className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-medium text-slate-300 transition hover:border-indigo-500 hover:bg-slate-800 hover:text-white"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for stays, cities, prices..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
