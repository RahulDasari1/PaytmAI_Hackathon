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
  MessageSquare,
  Smartphone,
  ShieldCheck,
  Globe2
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
        status: 'ACTIVE'
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
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {t.createCampaignTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, preview, and save targeted multilingual WhatsApp & SMS customer promotions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sandbox Mode (Draft Preview Only)</span>
          </span>
        </div>
      </div>

      {/* Main Studio: Form (Left) & Mobile Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          
          {/* Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Campaign Objective
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'EVENING_FOOTFALL_BOOST', title: 'Evening Footfall Boost', desc: 'Combats observed 24% dip in evening snacks' },
                { id: 'WIN_BACK_INACTIVE', title: 'Win-Back Lapsed Regulars', desc: 'Re-engage 35 inactive customers' },
                { id: 'REPEAT_PURCHASES', title: 'Weekend Basket Booster', desc: 'Incentivize bulk grocery orders' },
                { id: 'PRODUCT_PROMOTION', title: 'Fresh Dairy Promotion', desc: 'Morning push for perishable items' }
              ].map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setObjective(obj.id)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    objective === obj.id
                      ? 'border-[#0F2D6B] bg-sky-50/70 text-[#0F2D6B] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold">{obj.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{obj.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audience & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                2. Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-400"
              >
                <option value="Evening Footfall Shoppers (85 customers)">Evening Shoppers (85 customers)</option>
                <option value="Inactive Regulars (Last 14+ Days) [35 customers]">Inactive Regulars (35 customers)</option>
                <option value="All Neighborhood Shoppers (220 customers)">All Tracked Shoppers (220 customers)</option>
                <option value="Morning Dairy Regulars (40 customers)">Morning Dairy Regulars (40 customers)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                3. Delivery Channel
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setChannel('WhatsApp')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    channel === 'WhatsApp' ? 'bg-[#0F2D6B] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    channel === 'SMS' ? 'bg-[#0F2D6B] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  SMS
                </button>
              </div>
            </div>
          </div>

          {/* Language Selector for Campaign */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              4. Campaign Language (Copy & Tone)
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedLang === l.code
                      ? 'border-[#00BAF2] bg-sky-50 text-[#0F2D6B] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editable Copy Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                5. Generated Message Body (Editable)
              </label>
              <button
                type="button"
                onClick={generateDraft}
                className="text-xs text-[#0F2D6B] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCw className="w-3 h-3" />
                <span>Regenerate Copy</span>
              </button>
            </div>
            <textarea
              rows={5}
              value={editableCopy}
              onChange={(e) => setEditableCopy(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? t.copiedToast : t.copyMessage}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0F2D6B] to-[#00BAF2] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? "Draft Saved in Storage!" : t.saveDraft}</span>
            </button>
          </div>

        </div>

        {/* Right Phone Mockup: Live Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-100/70 p-6 rounded-3xl border border-slate-200">
          
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-slate-400" />
            <span>Mobile Handset Preview ({channel})</span>
          </div>

          {/* Smartphone Frame */}
          <div className="w-[280px] sm:w-[310px] h-[520px] bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Speaker notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-10 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-auto mr-2"></span>
            </div>

            {/* Simulated Phone Screen */}
            <div className="w-full h-full bg-[#E5DDD5] rounded-[32px] overflow-hidden flex flex-col text-slate-800 pt-8 pb-3">
              
              {/* WhatsApp / SMS Header */}
              <div className="bg-[#075E54] text-white p-3 flex items-center gap-2.5 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  SGS
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Sharma General Store</div>
                  <div className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span>Verified Merchant</span>
                  </div>
                </div>
              </div>

              {/* Chat Message Bubble */}
              <div className="flex-1 p-3 flex flex-col justify-end space-y-2">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm text-xs leading-relaxed max-w-[90%] border border-slate-200/40 animate-in fade-in">
                  <div className="font-bold text-[#0F2D6B] mb-1">
                    {draft.name || "Special Offer Announcement"}
                  </div>
                  <p className="whitespace-pre-line text-slate-700">
                    {editableCopy}
                  </p>
                  <div className="text-[9px] text-slate-400 text-right mt-1.5">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Delivered
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-medium">
                  {draft.rationale}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="bg-white p-2 rounded-xl mx-2 flex items-center text-slate-400 text-[11px] border border-slate-200">
                <span>Message preview only (Simulated)</span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Persistent Saved Campaigns Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Saved Marketing Campaigns (Persistent Demo Storage)
            </h2>
            <p className="text-xs text-slate-500">
              Campaigns stored in local SQLite demo database
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-[#0F2D6B]">
            {savedCampaigns.length} Campaigns
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {savedCampaigns.map((cmp) => (
            <div key={cmp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">{cmp.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cmp.status === 'ACTIVE' 
                      ? 'bg-emerald-100 text-emerald-800'
                      : cmp.status === 'DRAFT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {cmp.status}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    [{cmp.language.toUpperCase()}]
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {cmp.message_copy}
                </p>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                  <span>Audience: {cmp.audience_segment} ({cmp.target_customer_count} reach)</span>
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
                  className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0F2D6B] text-xs font-bold transition-colors"
                >
                  Load in Studio
                </button>
                <button
                  onClick={() => handleDelete(cmp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
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
