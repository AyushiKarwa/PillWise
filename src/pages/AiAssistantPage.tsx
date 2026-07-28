import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { SymptomCard } from '../components/SymptomCard';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { FormattedAiText } from '../components/FormattedAiText';
import {
  Bot,
  Send,
  Pill,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ChatMessage } from '../types';

export const AiAssistantPage: React.FC = () => {
  const { medicines, evaluateSymptoms, showToast } = useCabinet();

  const [selectedTag, setSelectedTag] = useState<string>('');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Hello! I am PillWise, your AI Medicine Cabinet Assistant. I can help you understand your home medicines, evaluate symptoms against your cabinet stock, or answer general healthcare storage and dosage questions.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsgId = 'msg-' + Date.now();
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActionMedicine: selectedTag || undefined
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          selectedMedicine: selectedTag
        })
      }).then((r) => r.json());

      if (res.success) {
        const aiMsg: ChatMessage = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        showToast('AI response error', 'error');
      }
    } catch (err) {
      showToast('Error communicating with AI assistant', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionType: string) => {
    if (!selectedTag) return;
    let query = '';
    if (actionType === 'uses') query = `What is ${selectedTag} commonly used for?`;
    else if (actionType === 'sideEffects') query = `What are common side effects and precautions of ${selectedTag}?`;
    else if (actionType === 'storage') query = `How should ${selectedTag} be safely stored at home?`;
    else if (actionType === 'alternatives') query = `What are common alternatives to ${selectedTag}?`;
    else if (actionType === 'expiry') query = `Check expiry guidelines and safety for ${selectedTag}.`;
    else if (actionType === 'interactions') query = `Can I safely take ${selectedTag} with other cabinet medicines?`;

    handleSendMessage(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in pb-12">
      <BackButtonHeader title="AI Assistant" subtitle="PillWise Smart Guidance" />

      {/* Header & Disclaimer Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-800">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">PillWise AI Assistant</h1>
              <p className="text-xs text-emerald-200">Cabinet-Aware Educational Healthcare Guide</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/20 text-emerald-300 text-xs font-semibold rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            Gemini Powered
          </span>
        </div>

        {/* Safety Disclaimer Warning */}
        <div className="mt-4 p-3 bg-white/10 rounded-2xl border border-white/10 text-xs text-emerald-100 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Important Safety Note:</strong> PillWise AI provides educational guidance based on your cabinet stock. It does NOT diagnose diseases, prescribe medication, or act as a doctor.
          </p>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden flex flex-col h-[650px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none space-y-2'
                }`}
              >
                {msg.quickActionMedicine && (
                  <span className="inline-block px-2 py-0.5 bg-white/20 text-white rounded-md text-[10px] font-bold mb-1">
                    Tag: {msg.quickActionMedicine}
                  </span>
                )}
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <FormattedAiText text={msg.text || ''} />
                )}
                <p
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-500 italic">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <span>PillWise AI is reviewing cabinet inventory and generating guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Picker: "My Medicines" Pills */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-emerald-600" />
              My Medicines Quick Tags:
            </span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="text-[11px] text-rose-600 hover:underline font-semibold"
              >
                Clear Tag [{selectedTag}]
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {medicines.map((m) => (
              <button
                key={m._id}
                onClick={() => setSelectedTag(m.name)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-colors border ${
                  selectedTag === m.name
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                [{m.name}]
              </button>
            ))}
          </div>

          {/* Quick Action Buttons when a medicine is selected */}
          {selectedTag && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-teal-800">Actions for [{selectedTag}]:</span>
              <button
                onClick={() => handleQuickAction('uses')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                What is it used for?
              </button>
              <button
                onClick={() => handleQuickAction('sideEffects')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                Side Effects
              </button>
              <button
                onClick={() => handleQuickAction('storage')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                Storage
              </button>
              <button
                onClick={() => handleQuickAction('alternatives')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                Alternatives
              </button>
              <button
                onClick={() => handleQuickAction('expiry')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                Check Expiry
              </button>
              <button
                onClick={() => handleQuickAction('interactions')}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg text-[11px] font-medium"
              >
                Drug Interactions
              </button>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              selectedTag
                ? `Ask anything about [${selectedTag}]...`
                : 'Type your healthcare question or symptom...'
            }
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-emerald-500 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl shadow-sm transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
