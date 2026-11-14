import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Bot,
  User,
  X,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  urduText?: string;
  timestamp: string;
}

export const KisanVoiceAssistant: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { language, farmer, cropHistory, currentPlan } = useFarm();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Salam Kisan Bhai! I am your AgroSpace AI Agricultural Advisor. You can speak or type in English, Urdu (اردو), or Roman Urdu. How can I assist your farm today?',
      urduText: 'سلام کسان بھائی! میں آپ کا ایگرو اسپیس زرعی مشیر ہوں۔ آپ اردو، انگریزی یا رومن اردو میں بول کر یا لکھ کر سوال پوچھ سکتے ہیں۔',
      timestamp: 'Now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const voiceModeRef = useRef<'simple_voice' | 'default'>('default');

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ur-PK';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSendQuestion(transcript, voiceModeRef.current);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startVoiceRecording = (mode: 'simple_voice' | 'default' = 'simple_voice') => {
    setVoiceNotice(null);
    if (!recognitionRef.current) {
      setVoiceNotice('Voice recognition is not supported on this browser. You can type your question below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        voiceModeRef.current = mode;
        recognitionRef.current.lang = mode === 'simple_voice' || language === 'ur' ? 'ur-PK' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const speakText = (text: string, forceUrdu: boolean = false) => {
    if (!('speechSynthesis' in window) || !text) return;

    window.speechSynthesis.cancel();
    const hasUrduScript = /[\u0600-\u06FF]/.test(text);
    const useUrduVoice = forceUrdu || hasUrduScript;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = useUrduVoice ? 'ur-PK' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const urduVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ur'));
    if (useUrduVoice && urduVoice) {
      utterance.voice = urduVoice;
    }
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendQuestion = async (
    queryText?: string,
    mode: 'simple_voice' | 'default' = 'default'
  ) => {
    const query = (queryText || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: mode === 'simple_voice' ? 'ur' : language,
          mode,
          farmContext: {
            farmerName: farmer.name,
            village: farmer.location.village,
            soilType: farmer.soilType,
            waterSource: farmer.waterSource,
            lastCrop: cropHistory.lastCrop,
            plannedCrop: cropHistory.plannedCrop,
            recommendedCrop: currentPlan?.doPlantThis.crop,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && !data.error) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          urduText: data.urduText || undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMsg]);
        speakText(data.text, mode === 'simple_voice');
      } else {
        const errMsg: Message = {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: data.error || 'API Key lagao phir AI chalegi',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } catch {
      const errMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: 'API Key lagao phir AI chalegi',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const presets = [
    { label: 'Which crop after wheat?', urdu: 'گندم کے بعد کیا لگائیں؟', query: 'Which crop should I plant after wheat in Faisalabad?' },
    { label: 'How can I save water?', urdu: 'پانی کی بچت کیسے کریں؟', query: 'How can I save irrigation water on my farm in Punjab?' },
    { label: 'Why is Berseem recommended?', urdu: 'برسیم کیوں ضروری ہے؟', query: 'Why is Berseem clover recommended for my field soil?' },
    { label: 'Fertilizer for loamy soil', urdu: 'میرا مٹی کے لیے کھاد؟', query: 'What is the best organic and chemical fertilizer balance for loamy soil in Faisalabad?' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-emerald-900/10 shadow-xl overflow-hidden flex flex-col h-[650px] max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="p-4 bg-gradient-to-r from-[#123D2A] to-[#102A43] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#35A853] flex items-center justify-center text-[#123D2A] shadow font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-1.5">
              <span>Kisan Voice Assistant</span>
              <span className="text-[10px] bg-emerald-400 text-[#123D2A] font-bold px-1.5 py-0.5 rounded">
                AI Voice
              </span>
            </h3>
            <p className="text-[11px] text-emerald-200">
              Punjabi &amp; Pakistani Agricultural Intelligence • Urdu &amp; English
            </p>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Preset Quick Chips */}
      <div className="p-2.5 bg-[#F5F8F5] border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-gray-500 font-bold shrink-0 flex items-center gap-1 pl-1">
          <HelpCircle className="w-3 h-3 text-[#35A853]" />
          Quick Ask:
        </span>
        {presets.map((pr, idx) => (
          <button
            key={idx}
            onClick={() => handleSendQuestion(pr.query)}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 rounded-lg text-xs font-medium border border-gray-200 shrink-0 transition-colors shadow-2xs"
          >
            {language === 'ur' ? pr.urdu : pr.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-[#102A43] text-white'
                  : 'bg-[#35A853] text-white'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#123D2A] text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-emerald-900/10 rounded-tl-none'
              }`}
            >
              <p
                className="whitespace-pre-line"
                dir={/[\u0600-\u06FF]/.test(msg.text) ? 'rtl' : 'ltr'}
              >
                {msg.text}
              </p>
              {msg.urduText && (
                <p className="mt-2 pt-2 border-t border-emerald-100 font-urdu text-emerald-900 text-[13px] leading-loose text-right" dir="rtl">
                  {msg.urduText}
                </p>
              )}
              <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-gray-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <button
                    onClick={() => speakText(msg.text, false)}
                    className="hover:text-emerald-700 p-0.5 rounded"
                    title="Listen Voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-white p-3 rounded-2xl border border-emerald-100 w-fit">
            <Sparkles className="w-4 h-4 text-[#35A853] animate-spin" />
            <span>Kisan AI Assistant is consulting Faisalabad agronomy database...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Voice Controller */}
      <div className="p-3 bg-white border-t border-gray-200 space-y-2.5">
        {voiceNotice && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
            {voiceNotice}
          </div>
        )}

        {/* Big Urdu / Punjabi Voice Button */}
        <button
          type="button"
          onClick={() => startVoiceRecording('simple_voice')}
          className={`w-full py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-[#35A853] hover:bg-emerald-600 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isListening ? 'Sun Raha Hoon... Boliye (Stop)' : 'Bolo - Speak 🎤'}</span>
        </button>

        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendQuestion();
          }}
          className="flex items-center gap-2"
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={() => startVoiceRecording('simple_voice')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#E9F7EF] text-[#35A853] hover:bg-[#35A853] hover:text-white'
            }`}
            title="Press to Speak"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening... بولیں کسان بھائی...'
                : language === 'ur'
                ? 'سوال لکھیں یا مائیک دبائیں...'
                : 'Ask a question in English, Urdu or Roman Urdu...'
            }
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-xs text-gray-800 outline-none focus:ring-2 focus:ring-[#35A853]"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-11 h-11 rounded-2xl bg-[#123D2A] hover:bg-[#1b553b] disabled:opacity-50 text-white flex items-center justify-center shadow transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
