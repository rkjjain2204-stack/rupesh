import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, MessageCircle, CheckCircle2, AlertCircle, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { StoreConfig, Product } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface Props {
  config: StoreConfig;
  products: Product[];
  initialEnquiryProduct?: { name: string; packSize?: string } | null;
}

export const ContactSection: React.FC<Props> = ({ config, products, initialEnquiryProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'signature-masala' as 'signature-masala' | 'wholesale-bulk' | 'store-visit' | 'daily-grocery' | 'general',
    productInterest: '',
    packSize: '',
    message: '',
    consentGiven: false,
    honeypot: '', // anti-spam bot trap
  });

  const formLoadTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    formLoadTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (initialEnquiryProduct) {
      setFormData((prev) => ({
        ...prev,
        productInterest: initialEnquiryProduct.name,
        packSize: initialEnquiryProduct.packSize || '',
        message: `Namaste, I would like to enquire about ordering ${initialEnquiryProduct.name}${
          initialEnquiryProduct.packSize ? ` (${initialEnquiryProduct.packSize})` : ''
        }. Please confirm fresh batch availability and counter pickup or delivery.`,
      }));
    }
  }, [initialEnquiryProduct]);

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ id: string; name: string; phone: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Spam Prevention: Honeypot check
    if (formData.honeypot) {
      // Silently discard bot submission
      setSubmittedData({ id: 'ENQ-' + Date.now().toString(36).toUpperCase(), name: formData.name, phone: formData.phone });
      return;
    }

    // 2. Spam Prevention: Timestamp velocity check (under 1.5 seconds)
    const timeElapsed = Date.now() - formLoadTimeRef.current;
    if (timeElapsed < 1500) {
      setErrorMsg('Please review your enquiry before submitting.');
      return;
    }

    // 3. Name validation
    const trimmedName = formData.name.trim();
    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    // 4. Phone validation (clean Indian mobile or standard phone)
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
    const digitsOnly = cleanPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      setErrorMsg('Please enter a valid 10-digit mobile phone number for direct contact.');
      return;
    }

    // 5. Consent validation
    if (!formData.consentGiven) {
      setErrorMsg('Please tick the consent box to allow us to reply to your enquiry via WhatsApp or Phone.');
      return;
    }

    setLoading(true);

    const enquiryId = 'ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    const createdAt = new Date().toISOString();

    const payload = {
      id: enquiryId,
      name: trimmedName,
      phone: cleanPhone,
      email: formData.email.trim() || undefined,
      enquiryType: formData.enquiryType,
      productInterest: formData.productInterest || undefined,
      packSize: formData.packSize || undefined,
      message: formData.message.trim() || undefined,
      status: 'New' as const,
      consentGiven: true,
      createdAt,
    };

    try {
      // Persist directly to Firebase Firestore
      try {
        await setDoc(doc(db, 'enquiries', enquiryId), payload);
      } catch (firestoreErr) {
        // Log Firestore diagnostic error per skill guidelines, but don't prevent server fallback
        try {
          handleFirestoreError(firestoreErr, OperationType.CREATE, `enquiries/${enquiryId}`);
        } catch {
          // Handled and logged
        }
      }

      // Also persist to store server API for local backup & staff dashboard
      const serverRes = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
          phone: cleanPhone,
        }),
      });

      const serverData = await serverRes.json();

      if (serverRes.ok && serverData.success) {
        setSubmittedData({
          id: serverData.enquiryId || enquiryId,
          name: trimmedName,
          phone: cleanPhone,
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          enquiryType: 'signature-masala',
          productInterest: '',
          packSize: '',
          message: '',
          consentGiven: false,
          honeypot: '',
        });
      } else {
        setErrorMsg(serverData.error || 'Unable to submit enquiry right now. Please call or WhatsApp us directly.');
      }
    } catch (err) {
      setErrorMsg('Network error. You can also reach our shop counter directly via WhatsApp or phone.');
    } finally {
      setLoading(false);
    }
  };

  const defaultWhatsappMessage = `Namaste ${config.storeName}, I would like to enquire about ordering handcrafted masalas and store items.`;

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
            <span>Enquiries & Counter Orders</span>
            <span aria-hidden="true" className="text-[#D49B28]">·</span>
            <span>Direct Heritage Contact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826]">
            Bring Home Pure Handcrafted Flavours
          </h2>

          <p className="text-base text-[#57514A] leading-relaxed">
            Need fresh signature garam masala, customized wedding or catering packs, or store availability confirmation? Reach out directly by phone, WhatsApp, or submit your enquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Call & WhatsApp Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#143826]">
                  Instant Assistance & Orders
                </h3>
                <p className="text-xs text-[#57514A] mt-1 leading-relaxed">
                  Call our Durg shop counter during store hours or message on WhatsApp. We reply with batch readiness, weight customizations, and arrange immediate pickup or parcel dispatch.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* Click-to-call link with configurable phone */}
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F3EFEA] transition-all border border-[#E7E2D8] group shadow-xs"
                >
                  <div className="p-3 bg-[#143826] text-white rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-[#D49B28]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                      Telephone Hotline
                    </span>
                    <strong className="block text-base font-bold text-[#143826] font-mono">
                      {config.phone}
                    </strong>
                    <span className="text-[11px] text-[#57514A]">Direct shop counter assistance</span>
                  </div>
                </a>

                {/* WhatsApp Enquiry Link with configurable number */}
                <a
                  href={getWhatsAppUrl(config.whatsappNumber, defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#143826] text-white hover:bg-[#1B4332] transition-all shadow-md group"
                >
                  <div className="p-3 bg-white/10 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 text-[#D49B28]" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#FAF8F5]/70">
                      WhatsApp Instant Chat
                    </span>
                    <strong className="block text-base font-bold text-white flex items-center gap-1.5">
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </strong>
                    <span className="text-[11px] text-[#FAF8F5]/80">Send your spice or grocery list</span>
                  </div>
                </a>
              </div>

              {/* Operating hours reminder */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E7E2D8] flex items-start gap-3 text-xs text-[#57514A]">
                <Clock className="w-4 h-4 text-[#D49B28] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#143826] font-semibold">Store Counter Timings</strong>
                  <span>Mon – Sat: 9:30 AM – 8:30 PM | Sun: 10:00 AM – 3:00 PM</span>
                </div>
              </div>

              {/* Privacy & Zero-Spam Assurance */}
              <div className="pt-4 border-t border-[#E7E2D8] space-y-2 text-xs text-[#57514A]">
                <div className="flex items-center gap-2 font-semibold text-[#143826]">
                  <ShieldCheck className="w-4 h-4 text-[#C8942A]" />
                  <span>Privacy & Zero-Spam Guarantee</span>
                </div>
                <p className="text-[11px] text-[#78716C] leading-relaxed">
                  Your phone number and name are kept strictly confidential for customer order communication. We never sell contact information or send spam SMS.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E7E2D8] rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="font-serif text-xl font-bold text-[#143826]">
                  Submit an Enquiry or Custom Order
                </h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Leave your details and spice requirements below. Our team verifies stock availability and gets back to you promptly.
                </p>
              </div>

              {submittedData ? (
                <div className="p-8 bg-[#FAF8F5] border-2 border-[#143826]/30 rounded-2xl space-y-5 text-center">
                  <div className="w-14 h-14 bg-[#143826] text-[#D49B28] rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-xl font-bold text-[#143826]">
                      Enquiry Received with Thanks!
                    </h4>
                    <p className="text-xs text-[#57514A] max-w-md mx-auto leading-relaxed">
                      Namaste <strong>{submittedData.name}</strong>, your enquiry has been registered in our store management system.
                    </p>
                  </div>

                  <div className="inline-block px-4 py-2 bg-white rounded-lg border border-[#D9D3C7] shadow-2xs font-mono text-xs text-[#143826]">
                    Reference ID: <strong className="font-bold text-[#143826]">{submittedData.id}</strong>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={getWhatsAppUrl(
                        config.whatsappNumber,
                        `Namaste ${config.storeName}, I submitted enquiry ${submittedData.id}. Please confirm my order details.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#143826] hover:bg-[#1B4332] rounded-lg transition-colors shadow-xs w-full sm:w-auto"
                    >
                      <MessageCircle className="w-4 h-4 text-[#D49B28]" />
                      <span>Follow Up on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => setSubmittedData(null)}
                      className="text-xs font-semibold text-[#143826] hover:underline px-4 py-2"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2.5 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Honeypot field for spam prevention (invisible to humans) */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-hp">Leave this empty</label>
                    <input
                      id="website-hp"
                      type="text"
                      name="honeypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    />
                  </div>

                  {/* Customer Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#292524] mb-1">
                        Customer Name <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#292524] mb-1">
                        10-Digit Mobile Number <span className="text-red-700">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 8434336654"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917] transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Enquiry Type & Product Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#292524] mb-1">
                        Enquiry Type <span className="text-red-700">*</span>
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) =>
                          setFormData({ ...formData, enquiryType: e.target.value as any })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917] transition-colors"
                      >
                        <option value="signature-masala">Signature In-House Masalas</option>
                        <option value="wholesale-bulk">Bulk / Wedding / Catering Order</option>
                        <option value="daily-grocery">Daily Grocery & Staples</option>
                        <option value="store-visit">Store Timing & Location Visit</option>
                        <option value="general">General Question</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#292524] mb-1">
                        Specific Item (Optional)
                      </label>
                      <select
                        value={formData.productInterest}
                        onChange={(e) =>
                          setFormData({ ...formData, productInterest: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917] transition-colors"
                      >
                        <option value="">-- Choose masala or grocery --</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message / Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-[#292524] mb-1">
                      Message & Quantity Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Looking for 500g Signature Garam Masala and 200g Chai Masala. Please confirm if available for pickup this evening..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917] transition-colors"
                    />
                  </div>

                  {/* Explicit Consent Language */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#57514A]">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consentGiven}
                        onChange={(e) => setFormData({ ...formData, consentGiven: e.target.checked })}
                        className="mt-0.5 rounded text-[#143826] focus:ring-[#143826] border-[#D9D3C7]"
                      />
                      <span className="leading-relaxed">
                        I agree to be contacted by Jain Kirana Stores via phone or WhatsApp regarding this enquiry. We respect your privacy and never spam.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded-lg shadow-sm transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Saving Enquiry...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-[#D49B28]" />
                          <span>Submit Customer Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
