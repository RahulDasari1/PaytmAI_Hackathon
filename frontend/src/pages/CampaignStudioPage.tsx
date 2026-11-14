import React, { useCallback, useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  Save, 
  Trash2, 
  Smartphone,
  ShieldCheck,
  Coffee,
  Users,
  ShoppingBag,
  Gift,
  Megaphone
} from 'lucide-react';
import { CampaignItem, Language } from '../types';
import { getT } from '../i18n';
import { api } from '../services/api';
import { PageHeader } from '../components/PageHeader';

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
  const offerType = 'COMBO_DEAL';
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [channel, setChannel] = useState<'WhatsApp' | 'SMS'>('WhatsApp');

  const [draft, setDraft] = useState<Partial<CampaignItem>>({});
  const [editableCopy, setEditableCopy] = useState<string>('');
  const [savedCampaigns, setSavedCampaigns] = useState<CampaignItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');
  const [savedLoadError, setSavedLoadError] = useState<boolean>(false);

  const loadSavedCampaigns = useCallback(async () => {
    try {
      const list = await api.getCampaigns();
      setSavedCampaigns(list);
      setSavedLoadError(false);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setSavedLoadError(true);
    }
  }, []);

  const generateDraft = useCallback(async () => {
    setLoading(true);
    setActionError('');
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
      setActionError('We could not prepare this sample message. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [objective, audience, offerType, selectedLang, channel]);

  useEffect(() => {
    void loadSavedCampaigns();
  }, [loadSavedCampaigns]);

  useEffect(() => {
    void generateDraft();
  }, [generateDraft]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editableCopy);
      setCopied(true);
      setActionError('');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Could not copy the offer message:', err);
      setActionError('We could not copy the message. Check browser clipboard permission and try again.');
    }
  };

  const handleSave = async () => {
    if (!draft || loading) return;
    setActionError('');
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
      setActionError('We could not save this demo draft. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    setActionError('');
    try {
      await api.deleteCampaign(id);
      loadSavedCampaigns();
    } catch (err) {
      console.error('Delete error:', err);
      setActionError('We could not delete this demo draft. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5 pb-3">
      <PageHeader
        eyebrow={language === 'hi' ? 'ग्राहकों से जुड़ें' : language === 'te' ? 'కస్టమర్లతో కలవండి' : 'A little note for your customers'}
        icon={Megaphone}
        title={t.createCampaignTitle}
        description={language === 'hi'
          ? 'एक आसान संदेश बनाएँ, पढ़ें और चाहें तो कॉपी करें। यह डेमो किसी को संदेश नहीं भेजता।'
          : language === 'te'
            ? 'సులభమైన సందేశాన్ని తయారు చేసి, చదివి, కావాలంటే కాపీ చేయండి. ఈ డెమో ఎవరికీ పంపదు.'
            : 'Write a friendly message, review it, and copy it if you like. This demo will not send it.'}
        action={
          <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#A6F4C5] bg-[#ECFDF3] px-3 text-xs font-bold text-[#027A48]">
            <ShieldCheck className="h-4 w-4 text-[#12B76A]" aria-hidden="true" />
            {language === 'hi' ? 'सिर्फ़ डेमो · नहीं भेजा जाएगा' : language === 'te' ? 'డెమో మాత్రమే · పంపబడదు' : 'Demo only · Not sent'}
          </span>
        }
      />
      {actionError && <p className="rounded-2xl border border-[#FECDCA] bg-[#FFF8F7] p-4 text-sm text-[#B42318]" role="alert">{actionError}</p>}

      {/* Main Studio: Form (Left) & Mobile Handset Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Guided Parameters (7 cols) */}
        <div className="space-y-5 rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6 lg:col-span-7">
          
          {/* Step 1: Objective */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-[#344054]">
                1. What would you like to do?
              </label>
              <span className="rounded-full bg-[#EAF8FF] px-2.5 py-1 text-[11px] font-bold text-[#006B9B]">Step 1 of 5</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
              { id: 'EVENING_FOOTFALL_BOOST', title: 'Invite evening shoppers', desc: 'Share a simple tea-time offer', icon: Coffee, style: 'bg-[#FFF3DB] text-[#A15C00]' },
              { id: 'WIN_BACK_INACTIVE', title: 'Welcome regulars back', desc: 'Share a friendly note with past shoppers', icon: Users, style: 'bg-[#EAF8FF] text-[#006B9B]' },
              { id: 'REPEAT_PURCHASES', title: 'Encourage weekend shopping', desc: 'Suggest useful items for the weekend', icon: ShoppingBag, style: 'bg-[#E7F8EF] text-[#027A48]' },
              { id: 'PRODUCT_PROMOTION', title: 'Share what is fresh', desc: 'Let nearby shoppers know what is new', icon: Gift, style: 'bg-[#F4EDFF] text-[#6941C6]' }
              ].map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setObjective(obj.id)}
                className={`relative flex min-h-24 items-start gap-3 overflow-hidden rounded-[20px] border p-3.5 text-left transition-all ${
                    objective === obj.id
                    ? 'border-[#89D5F2] bg-gradient-to-br from-[#F0FAFF] to-white text-[#002970] shadow-[0_10px_24px_-20px_rgba(0,41,112,0.75)] ring-1 ring-[#89D5F2]'
                    : 'border-[#E4EAF1] bg-gradient-to-br from-white to-[#F8FCFE] text-[#344054] hover:border-[#B9E6FE] hover:shadow-sm'
                  }`}
                >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${obj.style}`}>
                  <obj.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{obj.title}</span>
                  <span className="mt-1 block text-xs leading-snug text-[#667085]">{obj.desc}</span>
                </span>
                {objective === obj.id && <Check className="h-4 w-4 shrink-0 text-[#0087BD]" aria-label="Selected" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Audience & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#344054]">
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
              <label className="mb-1.5 block text-sm font-bold text-[#344054]">
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
            <label className="mb-1.5 block text-sm font-bold text-[#344054]">
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
              <label className="text-sm font-bold text-[#344054]">
                5. Review your message
              </label>
              <button
                type="button"
                onClick={() => void generateDraft()}
                disabled={loading}
                className="text-xs text-[#002970] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCw className="w-3 h-3" />
                <span>{loading ? 'Writing…' : 'Write another version'}</span>
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
          <div className="flex flex-wrap items-center gap-3 border-t border-[#E4EAF1] pt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#D5E3EB] bg-white px-4 text-sm font-bold text-[#344054] shadow-sm transition-all hover:border-[#9ECFE4] hover:bg-[#F8FCFE]"
            >
              {copied ? <Check className="w-4 h-4 text-[#12B76A]" /> : <Copy className="w-4 h-4 text-[#667085]" />}
              <span>{copied ? t.copiedToast : t.copyMessage}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={loading || !editableCopy.trim()}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#002970] to-[#008FC2] px-4 text-sm font-bold text-white shadow-[0_8px_18px_-12px_rgba(0,41,112,0.65)] transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div aria-busy={loading} className="relative flex h-[510px] w-full max-w-[305px] flex-col justify-between overflow-hidden rounded-[36px] border-4 border-slate-700 bg-[#10243A] p-2.5 shadow-2xl">
            
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
                    <span>Preview</span>
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
      <div className="rounded-[26px] border border-[#E4EAF1] bg-white p-5 shadow-[0_10px_28px_-24px_rgba(16,36,58,0.7)] sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#10243A]">
              Saved demo drafts
            </h2>
            <p className="text-xs text-[#667085]">
              These drafts are saved in this demo and are not sent to customers.
            </p>
          </div>
          <span className="rounded-full border border-[#B9E6FE] bg-[#EAF8FF] px-3 py-1.5 text-xs font-bold text-[#006B9B] tabular-nums">
            {savedCampaigns.length} {language === 'hi' ? 'ड्राफ्ट' : language === 'te' ? 'డ్రాఫ్ట్‌లు' : 'drafts'}
          </span>
        </div>

        {savedLoadError && <p className="mb-3 rounded-xl border border-[#FECDCA] bg-[#FFF8F7] p-3 text-sm text-[#B42318]" role="alert">We could not load your saved drafts. Please refresh and try again.</p>}
        {savedCampaigns.length === 0 && !savedLoadError ? (
          <div className="rounded-2xl border border-dashed border-[#CFE2EC] bg-[#F8FCFE] p-5 text-center text-sm text-[#667085]">
            Your saved message drafts will appear here.
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {savedCampaigns.map((cmp) => (
            <div key={cmp.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-[#E4EAF1] bg-gradient-to-br from-white to-[#F8FCFE] p-4 sm:flex-row sm:items-center">
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
        )}
      </div>

    </div>
  );
};
