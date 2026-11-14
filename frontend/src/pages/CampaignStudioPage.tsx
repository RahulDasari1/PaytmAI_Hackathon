import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Copy, 
  Check, 
  RotateCw, 
  Sparkles, 
  Save, 
  Trash2, 
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';
import { CampaignItem, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';

interface CampaignStudioPageProps {
  language: Language;
  presetContext?: any;
}

export const CampaignStudioPage: React.FC<CampaignStudioPageProps> = ({ language, presetContext }) => {
  const t = getT(language);

  const [objective, setObjective] = useState<string>(
    presetContext?.objective || 'EVENING_FOOTFALL_BOOST'
  );
  const [audience, setAudience] = useState<string>('Evening Footfall Shoppers (85 customers)');
  const [offerType, setOfferType] = useState<string>('COMBO_DEAL');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS'>('WhatsApp');

  const [draft, setDraft] = useState<Partial<CampaignItem>>({});
  const [editableCopy, setEditableCopy] = useState<string>('');
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadSavedCampaigns();
  }, []);

  useEffect(() => {
    generateDraft();
  }, [objective, audience, offerType, selectedLang, channel]);

  const loadSavedCampaigns = async () => {
    try {
      const list = await api.getCampaigns();
      setSavedCampaigns(list);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    }
  };

  const generateDraft = async () => {
    setLoading(true);
    try {
      const res = await api.generateCampaignDraft({
        objective,
        audience_segment: audience,
        offer_type: offerType,
        language: selectedLang,
        channel
      });
      setDraft(res);
      setEditableCopy(res.message_copy);
    } catch (err) {
      console.error('Draft generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      await api.saveCampaign({
        ...draft,
        message_copy: editableCopy,
        status: 'DRAFT'
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadSavedCampaigns();
    } catch (err) {
      console.error('Save campaign error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCampaign(id);
      loadSavedCampaigns();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Page Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E4EAF1] shadow-fintech-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#10243A] tracking-tight">
            {t.createCampaignTitle}
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Write a friendly message for customers. This demo will not send it.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />
            <span>Demo only · Nothing will be sent</span>
          </span>
        </div>
      </div>

      {/* Main Studio: Form (Left) & Mobile Handset Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Guided Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs space-y-5">
          
          {/* Step 1: Objective */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                1. What would you like to do?
              </label>
              <span className="text-[11px] text-[#002970] font-semibold">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'EVENING_FOOTFALL_BOOST', title: 'Invite evening shoppers', desc: 'Share a simple tea-time offer' },
                { id: 'WIN_BACK_INACTIVE', title: 'Welcome regulars back', desc: 'Send a friendly note to past customers' },
                { id: 'REPEAT_PURCHASES', title: 'Encourage weekend shopping', desc: 'Suggest useful items for the weekend' },
                { id: 'PRODUCT_PROMOTION', title: 'Share a fresh dairy offer', desc: 'Let nearby customers know what is fresh' }
              ].map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setObjective(obj.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    objective === obj.id
                      ? 'border-[#002970] bg-[#F0F9FF] text-[#002970] shadow-xs ring-1 ring-[#002970]'
                      : 'border-[#E4EAF1] hover:border-slate-300 bg-white text-[#344054]'
                  }`}
                >
                  <div className="text-xs font-bold">{obj.title}</div>
                  <div className="text-[11px] text-[#667085] mt-0.5 leading-snug">{obj.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Audience & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1.5">
                2. Who should see this?
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAF1] text-xs font-semibold text-[#10243A] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#00BAF2]"
              >
                <option value="Evening Footfall Shoppers (85 customers)">Evening shoppers · sample group</option>
                <option value="Inactive Regulars (Last 14+ Days) [35 customers]">Regulars who have not visited · sample group</option>
                <option value="All Neighborhood Shoppers (220 customers)">All nearby shoppers · sample group</option>
                <option value="Morning Dairy Regulars (40 customers)">Morning dairy shoppers · sample group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1.5">
                3. Message channel
              </label>
              <div className="flex rounded-xl bg-[#F2F4F7] p-1 border border-[#E4EAF1]">
                <button
                  type="button"
                  onClick={() => setChannel('WhatsApp')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    channel === 'WhatsApp' ? 'bg-[#002970] text-white shadow-xs' : 'text-[#667085]'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    channel === 'SMS' ? 'bg-[#002970] text-white shadow-xs' : 'text-[#667085]'
                  }`}
                >
                  SMS
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Language Selector */}
          <div>
            <label className="block text-xs font-bold text-[#667085] uppercase tracking-wider mb-1.5">
              4. Message language
            </label>
            <div className="flex gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'te', label: 'తెలుగు (Telugu)' }
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSelectedLang(l.code as Language)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedLang === l.code
                      ? 'border-[#002970] bg-[#EBF7FF] text-[#002970] ring-1 ring-[#002970]'
                      : 'border-[#E4EAF1] text-[#475467] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Editable Message Copy */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                5. Review your message
              </label>
              <button
                type="button"
                onClick={generateDraft}
                className="text-xs text-[#002970] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCw className="w-3 h-3" />
                <span>Write another version</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={editableCopy}
              onChange={(e) => setEditableCopy(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#E4EAF1] text-xs sm:text-sm leading-relaxed text-[#10243A] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#00BAF2]"
            />
            <div className="flex justify-between items-center text-[11px] text-[#667085] mt-1">
              <span>{editableCopy.length} characters</span>
              <span>This message is a sample</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl border border-[#E4EAF1] hover:border-slate-300 bg-white text-[#344054] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-fintech-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#12B76A]" /> : <Copy className="w-4 h-4 text-[#667085]" />}
              <span>{copied ? t.copiedToast : t.copyMessage}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-fintech-sm hover:opacity-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? "Draft saved · not sent" : "Save demo draft"}</span>
            </button>
          </div>

        </div>

        {/* Right Phone Mockup: Live Handset Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#F5F8FC] p-6 rounded-2xl border border-[#E4EAF1]">
          
          <div className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-[#98A2B3]" />
            <span>Message preview ({channel})</span>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[280px] sm:w-[305px] h-[510px] bg-[#10243A] rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-700 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Speaker notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-slate-800 rounded-full z-10 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-900 ml-auto mr-2"></span>
            </div>

            {/* Simulated Phone Screen */}
            <div className="w-full h-full bg-[#E5DDD5] rounded-[28px] overflow-hidden flex flex-col text-[#1D2939] pt-7 pb-3">
              
              {/* WhatsApp / SMS Header */}
              <div className="bg-[#075E54] text-white p-2.5 flex items-center gap-2 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  SGS
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    <span>Sharma General Store</span>
                  </div>
                  <div className="text-[9px] text-emerald-100">
                    Sample message · not sent
                  </div>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div className="flex-1 p-3 flex flex-col justify-end space-y-2">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm text-xs leading-relaxed max-w-[92%] border border-slate-200/50 animate-in fade-in">
                  <div className="font-bold text-[#002970] mb-1">
                    {draft.name || "Special Customer Announcement"}
                  </div>
                  <p className="whitespace-pre-line text-[#344054]">
                    {editableCopy}
                  </p>
                  <div className="text-[9px] text-[#98A2B3] text-right mt-1.5 flex items-center justify-end gap-1">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="text-center text-[10px] text-[#667085] font-medium px-2">
                  {draft.rationale}
                </div>
              </div>

              {/* Bottom preview banner */}
              <div className="bg-white p-1.5 rounded-xl mx-2 text-center text-[#667085] text-[10px] border border-slate-200">
                <span>Preview only · nothing is sent</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Persistent Saved Campaigns Section */}
      <div className="bg-white rounded-2xl p-6 border border-[#E4EAF1] shadow-fintech-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#10243A]">
              Saved demo drafts
            </h2>
            <p className="text-xs text-[#667085]">
              These drafts are saved in this demo and are not sent to customers.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF7FF] text-[#002970] border border-[#B9E6FE] tabular-nums">
            {savedCampaigns.length} Campaigns
          </span>
        </div>

        <div className="divide-y divide-[#F2F4F7]">
          {savedCampaigns.map((cmp) => (
            <div key={cmp.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#10243A]">{cmp.name}</h3>
                  <span className="rounded bg-[#FFF9EB] px-2 py-0.5 text-[10px] font-bold text-[#B54708] border border-[#FEF0C7]">
                    Saved draft
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#667085]">
                    [{cmp.language.toUpperCase()}]
                  </span>
                </div>
                <p className="text-[11px] text-[#475467] mt-1 line-clamp-1">
                  {cmp.message_copy}
                </p>
                <div className="text-[10px] text-[#667085] mt-1 flex items-center gap-2">
                  <span>Sample audience: {cmp.audience_segment} ({cmp.target_customer_count} people)</span>
                  <span>•</span>
                  <span>Timing: {cmp.suggested_timing}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setEditableCopy(cmp.message_copy);
                    setSelectedLang(cmp.language);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EBF7FF] hover:bg-[#D1E9FF] text-[#002970] text-xs font-bold transition-colors"
                >
                  Load in Studio
                </button>
                <button
                  onClick={() => handleDelete(cmp.id)}
                  className="p-1.5 text-[#98A2B3] hover:text-[#B42318] rounded-lg transition-colors"
                  title="Delete Campaign"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
