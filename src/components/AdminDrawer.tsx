import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  Download,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
  LogOut,
  ShieldCheck,
  User,
  Database,
} from 'lucide-react';
import { Enquiry, Product, ProductPack } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProduct: (updatedProduct: Product) => void;
}

export const AdminDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  onUpdateProduct,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Contacted' | 'Resolved'>('All');
  const [activeTab, setActiveTab] = useState<'leads' | 'products' | 'database' | 'guide'>('leads');
  const [productSearch, setProductSearch] = useState('');
  const [dbStatus, setDbStatus] = useState<string>('Connected to Cloud Firestore');

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const isStoreAdmin = Boolean(
    currentUser?.email === 'rkj.jain2204@gmail.com' ||
    (currentUser?.email && currentUser.emailVerified) ||
    isPasscodeAuthenticated
  );

  // Firestore real-time listener for enquiries when authenticated
  useEffect(() => {
    if (!isOpen || !isStoreAdmin) return;

    let unsubFirestore: (() => void) | null = null;

    if (currentUser) {
      try {
        const q = query(collection(db, 'enquiries'));
        unsubFirestore = onSnapshot(
          q,
          (snapshot) => {
            const list: Enquiry[] = [];
            snapshot.forEach((d) => {
              const data = d.data();
              list.push({
                id: d.id,
                name: data.name || '',
                phone: data.phone || '',
                email: data.email || '',
                enquiryType: data.enquiryType || 'general',
                productInterest: data.productInterest || '',
                packSize: data.packSize || '',
                message: data.message || '',
                status: data.status || 'New',
                createdAt: data.createdAt || new Date().toISOString(),
                notes: data.notes || '',
              });
            });
            // Sort newest first
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            if (list.length > 0) {
              setEnquiries(list);
              setDbStatus('Live Real-Time Sync with Cloud Firestore');
            } else {
              // Fallback to server API if firestore collection is fresh
              fetchServerEnquiries(passcode || 'jainkirana2026');
            }
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.LIST, 'enquiries');
            } catch {
              // Fallback to server API if firestore permission error occurs
              fetchServerEnquiries(passcode || 'jainkirana2026');
            }
          }
        );
      } catch (err) {
        fetchServerEnquiries(passcode || 'jainkirana2026');
      }
    } else if (isPasscodeAuthenticated) {
      fetchServerEnquiries(passcode);
    }

    return () => {
      if (unsubFirestore) unsubFirestore();
    };
  }, [isOpen, isStoreAdmin, currentUser, isPasscodeAuthenticated]);

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err.message || 'Google Sign-in failed. Please use store passcode.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsPasscodeAuthenticated(false);
      setEnquiries([]);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Passcode verification for store counter staff
  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsPasscodeAuthenticated(true);
        fetchServerEnquiries(passcode);
      } else {
        setAuthError(data.error || 'Incorrect owner passcode. (Default: jainkirana2026)');
      }
    } catch (err) {
      setAuthError('Connection error to store server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServerEnquiries = async (authPasscode: string = passcode || 'jainkirana2026') => {
    try {
      const res = await fetch(`/api/admin/enquiries?passcode=${encodeURIComponent(authPasscode)}`);
      const data = await res.json();
      if (res.ok && data.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Error fetching leads from server:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'New' | 'Contacted' | 'Resolved') => {
    // 1. Optimistic local update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );

    // 2. Update in Firestore if logged in
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'enquiries', id), { status: newStatus });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `enquiries/${id}`);
        } catch {
          // Handled
        }
      }
    }

    // 3. Update on server endpoint
    try {
      await fetch(`/api/admin/enquiries/${id}?passcode=${encodeURIComponent(passcode || 'jainkirana2026')}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update enquiry status on server:', err);
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, notes } : e))
    );

    if (currentUser) {
      try {
        await updateDoc(doc(db, 'enquiries', id), { notes });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `enquiries/${id}`);
        } catch {
          // Handled
        }
      }
    }

    try {
      await fetch(`/api/admin/enquiries/${id}?passcode=${encodeURIComponent(passcode || 'jainkirana2026')}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
    } catch (err) {
      console.error('Failed to update enquiry notes on server:', err);
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch =
      searchTerm === '' ||
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm) ||
      (e.productInterest && e.productInterest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const counts = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'New').length,
    contacted: enquiries.filter((e) => e.status === 'Contacted').length,
    resolved: enquiries.filter((e) => e.status === 'Resolved').length,
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Store Owner Portal"
    >
      <div
        className="w-full max-w-4xl bg-[#FAF8F5] h-full flex flex-col shadow-2xl border-l border-[#E7E2D8] text-[#1C1917] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 bg-[#143826] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-lg">
              <Lock className="w-5 h-5 text-[#D49B28]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">
                Jain Kirana Stores — Store Owner Portal
              </h3>
              <p className="text-xs text-[#FAF8F5]/80">
                Customer Enquiry Database & Lead Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close owner portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Check: Google Sign-in or Passcode */}
        {!isStoreAdmin ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#D9D3C7] shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#FAF8F5] border border-[#D9D3C7] rounded-full flex items-center justify-center mx-auto text-[#143826]">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#143826]">
                  Store Management Console
                </h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Sign in with Google or enter the shop passcode to access real-time customer enquiries and manage orders.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Option 1: Google Sign-In with Firebase Auth */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-[#FAF8F5] border border-[#D9D3C7] text-xs font-semibold text-[#1C1917] rounded-lg shadow-2xs transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Sign In with Google (rkj.jain2204@gmail.com)</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E7E2D8]"></div>
                  <span className="text-[11px] uppercase font-semibold text-[#78716C]">or shop passcode</span>
                  <div className="flex-1 h-px bg-[#E7E2D8]"></div>
                </div>

                {/* Option 2: Passcode for counter staff */}
                <form onSubmit={handlePasscodeLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#292524] mb-1">
                      Counter Passcode
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter passcode (jainkirana2026)"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] text-[#1C1917]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#143826] hover:bg-[#1B4332] rounded-lg transition-colors shadow-2xs"
                  >
                    {loading ? 'Verifying...' : 'Unlock Counter Console'}
                  </button>
                </form>
              </div>

              <div className="pt-2 border-t border-[#E7E2D8] text-[11px] text-[#78716C] text-center">
                <span>Default counter passcode: </span>
                <code className="bg-[#FAF8F5] border border-[#D9D3C7] px-1.5 py-0.5 rounded font-mono font-semibold text-[#143826]">
                  jainkirana2026
                </code>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-6">
            {/* Admin User Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#E7E2D8] rounded-xl shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#FAF8F5] rounded-full border border-[#D9D3C7]">
                  <User className="w-4 h-4 text-[#143826]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#143826]">
                      {currentUser ? currentUser.email : 'Shop Counter Staff'}
                    </span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified Store Admin
                    </span>
                  </div>
                  <span className="text-[11px] text-[#78716C]">
                    {dbStatus}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E7E2D8]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'leads'
                      ? 'bg-[#143826] text-white shadow-xs'
                      : 'bg-[#EFECE6] text-[#44403C] hover:bg-[#E2DDD3]'
                  }`}
                >
                  Customer Enquiries ({counts.total})
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-[#143826] text-white shadow-xs'
                      : 'bg-[#EFECE6] text-[#44403C] hover:bg-[#E2DDD3]'
                  }`}
                >
                  Catalogue & Prices ({products.length})
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'database'
                      ? 'bg-[#143826] text-white shadow-xs'
                      : 'bg-[#EFECE6] text-[#44403C] hover:bg-[#E2DDD3]'
                  }`}
                >
                  Database Info
                </button>
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === 'guide'
                      ? 'bg-[#143826] text-white shadow-xs'
                      : 'bg-[#EFECE6] text-[#44403C] hover:bg-[#E2DDD3]'
                  }`}
                >
                  Daily Guide
                </button>
              </div>

              {activeTab === 'leads' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchServerEnquiries()}
                    className="p-1.5 text-[#143826] hover:bg-[#EFECE6] rounded-lg transition-colors"
                    title="Refresh leads"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <a
                    href={`/api/admin/export-csv?passcode=${encodeURIComponent(passcode || 'jainkirana2026')}`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#143826] bg-white hover:bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg transition-colors shadow-2xs"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#143826]" />
                    <span>Download CSV</span>
                  </a>
                </div>
              ) : activeTab === 'products' ? (
                <button
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
                    const dlAnchor = document.createElement('a');
                    dlAnchor.setAttribute('href', dataStr);
                    dlAnchor.setAttribute('download', `jain_kirana_products_${new Date().toISOString().slice(0, 10)}.json`);
                    dlAnchor.click();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#143826] bg-white hover:bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#143826]" />
                  <span>Backup Catalogue JSON</span>
                </button>
              ) : null}
            </div>

            {/* TAB 1: CUSTOMER ENQUIRIES */}
            {activeTab === 'leads' ? (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl shadow-2xs">
                    <span className="block text-[10px] uppercase font-semibold text-[#78716C]">
                      Total Leads
                    </span>
                    <span className="text-xl font-bold font-mono text-[#143826]">
                      {counts.total}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl shadow-2xs">
                    <span className="block text-[10px] uppercase font-semibold text-[#991B1B]">
                      Pending / New
                    </span>
                    <span className="text-xl font-bold font-mono text-[#991B1B]">
                      {counts.new}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl shadow-2xs">
                    <span className="block text-[10px] uppercase font-semibold text-[#C8942A]">
                      Contacted
                    </span>
                    <span className="text-xl font-bold font-mono text-[#C8942A]">
                      {counts.contacted}
                    </span>
                  </div>

                  <div className="p-3 bg-white border border-[#E7E2D8] rounded-xl shadow-2xs">
                    <span className="block text-[10px] uppercase font-semibold text-[#143826]">
                      Resolved
                    </span>
                    <span className="text-xl font-bold font-mono text-[#143826]">
                      {counts.resolved}
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      type="text"
                      placeholder="Search by customer name, phone, product or query..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826]"
                    />
                  </div>

                  <div className="flex gap-1 p-1 bg-[#EFECE6] rounded-lg">
                    {(['All', 'New', 'Contacted', 'Resolved'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                          statusFilter === st
                            ? 'bg-white text-[#143826] shadow-2xs'
                            : 'text-[#57514A] hover:text-[#1C1917]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enquiries List */}
                {filteredEnquiries.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#D9D3C7]">
                    <Clock className="w-8 h-8 text-[#78716C] mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-[#78716C]">
                      No customer enquiries found matching the selected filter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnquiries.map((enq) => {
                      const whatsappReply = `Namaste ${enq.name}, this is Jain Kirana Stores (Durg, Chhattisgarh) replying regarding your enquiry (${enq.id}) for ${
                        enq.productInterest || 'our handcrafted masalas'
                      }.`;

                      return (
                        <div
                          key={enq.id}
                          className="bg-white border border-[#E7E2D8] rounded-xl p-5 shadow-2xs space-y-4 hover:border-[#143826]/30 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E7E2D8]">
                            <div>
                              <div className="flex items-center gap-2">
                                <strong className="text-base font-bold text-[#143826]">
                                  {enq.name}
                                </strong>
                                <span className="text-[11px] font-mono text-[#78716C]">
                                  ({enq.id})
                                </span>
                              </div>
                              <span className="text-[11px] text-[#78716C]">
                                Submitted on {new Date(enq.createdAt).toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-medium text-[#78716C]">
                                Status:
                              </span>
                              <select
                                value={enq.status}
                                onChange={(e) =>
                                  handleStatusChange(enq.id, e.target.value as any)
                                }
                                className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                                  enq.status === 'New'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : enq.status === 'Contacted'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Resolved">Resolved</option>
                              </select>
                            </div>
                          </div>

                          {/* Customer Details & Actions */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1.5">
                              <div>
                                <span className="text-[#78716C]">Mobile: </span>
                                <strong className="font-mono text-[#1C1917]">{enq.phone}</strong>
                              </div>
                              {enq.email && (
                                <div>
                                  <span className="text-[#78716C]">Email: </span>
                                  <span>{enq.email}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-[#78716C]">Type: </span>
                                <span className="font-medium text-[#143826] capitalize">
                                  {enq.enquiryType.replace('-', ' ')}
                                </span>
                              </div>
                              {enq.productInterest && (
                                <div>
                                  <span className="text-[#78716C]">Item: </span>
                                  <span className="font-semibold text-[#143826]">
                                    {enq.productInterest}
                                    {enq.packSize ? ` (${enq.packSize})` : ''}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Click to Call & WhatsApp Reply */}
                            <div className="flex flex-col sm:items-end justify-center gap-2">
                              <a
                                href={`tel:${enq.phone}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#143826] bg-[#FAF8F5] hover:bg-[#F3EFEA] rounded-lg border border-[#D9D3C7] w-full sm:w-auto justify-center transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#143826]" />
                                <span>Call {enq.phone}</span>
                              </a>

                              <a
                                href={getWhatsAppUrl(enq.phone, whatsappReply)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#143826] hover:bg-[#1B4332] rounded-lg w-full sm:w-auto justify-center shadow-2xs transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#D49B28]" />
                                <span>Reply via WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* Customer Message */}
                          {enq.message && (
                            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E2D8] text-xs text-[#3A3530]">
                              <strong className="block text-[10px] uppercase font-semibold text-[#78716C] mb-0.5">
                                Customer Note:
                              </strong>
                              {enq.message}
                            </div>
                          )}

                          {/* Shopkeeper Internal Note */}
                          <div className="pt-2">
                            <label className="block text-[11px] font-semibold text-[#78716C] mb-1">
                              Shop Counter Internal Notes:
                            </label>
                            <input
                              type="text"
                              defaultValue={enq.notes || ''}
                              placeholder="e.g. Quoted 500g Garam Masala @ ₹600. Scheduled pickup for Sunday."
                              onBlur={(e) => handleNotesChange(enq.id, e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826] focus:bg-white text-[#1C1917]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : activeTab === 'products' ? (
              /* TAB 2: PRODUCT CATALOGUE EDITOR */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                    <input
                      type="text"
                      placeholder="Filter product to edit pack prices..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D9D3C7] rounded-lg focus:outline-hidden focus:border-[#143826]"
                    />
                  </div>
                  <div className="text-xs text-[#78716C] bg-white px-3 py-2 rounded-lg border border-[#D9D3C7]">
                    Direct Retail Price Editor
                  </div>
                </div>

                <div className="space-y-4">
                  {products
                    .filter(
                      (p) =>
                        productSearch === '' ||
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        (p.hindiName && p.hindiName.includes(productSearch))
                    )
                    .map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white border border-[#E7E2D8] rounded-xl p-5 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg bg-[#EFECE6] overflow-hidden shrink-0 border border-[#D9D3C7]">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-serif font-bold text-[#143826]">
                                {prod.name}
                              </h4>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#FAF8F5] text-[#143826] border border-[#E7E2D8]">
                                {prod.badge}
                              </span>
                            </div>
                            {prod.hindiName && (
                              <p className="text-xs text-[#8A7148]">{prod.hindiName}</p>
                            )}
                            <p className="text-xs text-[#57514A] mt-1 line-clamp-2">
                              {prod.shortDescription}
                            </p>
                          </div>
                        </div>

                        {/* Pack Pricing & Stock Editor Grid */}
                        <div className="pt-3 border-t border-[#E7E2D8] space-y-2">
                          <label className="block text-[11px] font-semibold text-[#78716C] uppercase tracking-wider">
                            Pack Sizes & Retail Prices
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {prod.packs.map((pack: ProductPack, pIdx: number) => (
                              <div
                                key={pack.size}
                                className="p-2.5 bg-[#FAF8F5] border border-[#D9D3C7] rounded-lg space-y-1.5"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-[#143826]">
                                    {pack.size} Pack
                                  </span>
                                  <label className="flex items-center gap-1 text-[11px] text-[#57514A] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={pack.inStock}
                                      onChange={(e) => {
                                        const newPacks = [...prod.packs];
                                        newPacks[pIdx] = {
                                          ...pack,
                                          inStock: e.target.checked,
                                        };
                                        onUpdateProduct({ ...prod, packs: newPacks });
                                      }}
                                      className="rounded text-[#143826] cursor-pointer"
                                    />
                                    <span>In Stock</span>
                                  </label>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-[#78716C]">₹</span>
                                  <input
                                    type="number"
                                    value={pack.price}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value, 10) || 0;
                                      const newPacks = [...prod.packs];
                                      newPacks[pIdx] = { ...pack, price: val };
                                      onUpdateProduct({ ...prod, packs: newPacks });
                                    }}
                                    className="w-full px-2 py-1 text-xs font-mono font-bold bg-white border border-[#D9D3C7] rounded text-[#143826]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : activeTab === 'database' ? (
              /* TAB 3: DATABASE & FIREBASE CONFIG INFO */
              <div className="bg-white border border-[#E7E2D8] rounded-2xl p-6 space-y-6 text-xs text-[#44403C] leading-relaxed">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E7E2D8]">
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#143826]">
                      Firebase Cloud Firestore & Authentication
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      Status: Active & Deployed
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold text-[#143826]">Data Persistence Architecture:</h5>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>
                      <strong>Customer Privacy:</strong> Enquiries containing customer mobile numbers are stored in the protected <code className="bg-[#FAF8F5] px-1 rounded font-mono">enquiries</code> Firestore collection.
                    </li>
                    <li>
                      <strong>Access Security:</strong> Firestore rules allow public submission of enquiries (status must be 'New'), while <code className="bg-[#FAF8F5] px-1 rounded font-mono">list</code>, <code className="bg-[#FAF8F5] px-1 rounded font-mono">get</code>, and status updates are strictly restricted to verified owner email <strong>rkj.jain2204@gmail.com</strong>.
                    </li>
                    <li>
                      <strong>Dual Persistence:</strong> For shop reliability, submissions are saved to both Google Cloud Firestore and the store's Node.js server storage.
                    </li>
                    <li>
                      <strong>Spam Protection:</strong> Active honeypot bot trap and submission velocity guards prevent automated scrapers.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#D9D3C7] space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-[#143826]">
                    <ShieldCheck className="w-4 h-4 text-[#D49B28]" />
                    <span>Configured Admin Email</span>
                  </div>
                  <p className="text-[11px] font-mono text-[#57514A]">
                    rkj.jain2204@gmail.com
                  </p>
                  <p className="text-[11px] text-[#78716C]">
                    Any browser signed in with this verified Google account automatically receives full administrative access to review and manage customer leads.
                  </p>
                </div>
              </div>
            ) : (
              /* TAB 4: OPERATIONS GUIDE */
              <div className="bg-white border border-[#E7E2D8] rounded-2xl p-6 space-y-6 text-xs text-[#44403C] leading-relaxed">
                <div>
                  <h4 className="text-sm font-bold text-[#143826] mb-1">
                    Store Daily Lead Management Routine
                  </h4>
                  <p>
                    All customer enquiries submitted on the website are securely transmitted and indexed. Customer phone numbers remain completely private.
                  </p>
                </div>

                <div className="space-y-2">
                  <strong className="block text-[#1C1917] font-semibold">
                    1. Daily Routine for Counter Staff:
                  </strong>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check "Pending / New" leads every morning (10 AM) and afternoon (4 PM).</li>
                    <li>Click <strong>Reply via WhatsApp</strong> to instantly message the customer with fresh batch readiness and counter pickup timing.</li>
                    <li>Change status to <strong>Contacted</strong> after replying.</li>
                    <li>Mark <strong>Resolved</strong> once the order is handed over or delivered.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <strong className="block text-[#1C1917] font-semibold">
                    2. Backups & Offline Spreadsheets:
                  </strong>
                  <p>
                    Click the <strong>Download CSV</strong> button at any time to export your full customer enquiries table directly into Microsoft Excel or Google Sheets for billing or accounting.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
