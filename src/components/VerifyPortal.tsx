import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  ChevronRight, 
  ExternalLink, 
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  Building2,
  BookOpen,
  User,
  Hash
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Certificate } from '../types';
import { verifyOnStellar } from '../lib/stellar';

export default function VerifyPortal() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [stellarInfo, setStellarInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setLoading(true);
    setError(null);
    setCertificate(null);
    setStellarInfo(null);
    setVerified(false);

    try {
      const docRef = doc(db, 'certificates', certId.trim().toUpperCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const certData = docSnap.data() as Certificate;
        setCertificate(certData);
        
        // Verify cross-chain on Stellar
        const stellarData = await verifyOnStellar(certData.stellarTxHash);
        setStellarInfo(stellarData);
        setVerified(true);
      } else {
        setError('Certificate ID not found in our registry. Please check the ID and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6">Verification Portal</h2>
        <p className="text-xl text-black/40 max-w-2xl mx-auto font-medium">
          Enter the unique Certificate ID printed on the document to verify its authenticity on the Stellar blockchain.
        </p>
      </motion.div>

      {/* Search Console */}
      <div className="max-w-3xl mx-auto mb-20">
        <form onSubmit={handleVerify} className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[40px] opacity-0 group-focus-within:opacity-10 transition-opacity blur-xl" />
          <div className="relative flex items-center p-3 bg-white border border-black/10 rounded-[32px] shadow-xl">
            <Search className="ml-6 text-black/20" size={28} />
            <input 
              type="text" 
              placeholder="Enter Certificate ID (e.g. CERT-A1B2C3D4E)" 
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="flex-1 bg-transparent px-6 py-4 text-xl font-bold uppercase tracking-wider outline-none placeholder:text-black/10"
            />
            <button 
              disabled={loading}
              type="submit"
              className="bg-black text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : 'Verify Now'}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 font-bold italic"
            >
              <ShieldAlert size={24} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result Display */}
      <AnimatePresence mode="wait">
        {certificate && verified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            {/* Left: Certificate Preview */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-black/10 rounded-[48px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="p-16 border-8 border-double border-black/5 m-4 rounded-[40px] flex flex-col justify-between min-h-[600px]">
                  <div className="flex justify-between items-start mb-20">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
                        <ShieldCheck size={40} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight uppercase">CertiChain</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">Blockchain Credentials</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">Authenticated By</p>
                      <p className="text-sm font-bold uppercase italic">{certificate.institutionName}</p>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-black/30 mb-4">Official Certificate of Achievement</p>
                      <h3 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
                        {certificate.studentName}
                      </h3>
                      <div className="h-1 w-24 bg-black" />
                    </div>

                    <p className="text-2xl font-medium text-black/60 max-w-xl leading-snug">
                      has successfully completed the requirements for <span className="text-black font-black italic">{certificate.courseName}</span> as prescribed by the university senate.
                    </p>
                  </div>

                  <div className="mt-20 pt-16 border-t border-black/5 flex justify-between items-end">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full w-fit border border-green-100">
                        <CheckCircle2 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified on Stellar Network</span>
                      </div>
                      <div className="font-mono text-[10px] text-black/30">
                        ISSUE DATE: {certificate.issueDate?.toDate().toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-24 bg-black/5 rounded-xl border border-black/5 flex items-center justify-center mb-4">
                        <div className="w-16 h-16 opacity-10">
                          {/* QR Mockup */}
                          <div className="grid grid-cols-4 gap-1">
                            {[...Array(16)].map((_, i) => (
                              <div key={i} className="w-full h-2 bg-black rounded-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] font-mono font-bold">{certificate.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:shadow-xl transition-all">
                  <Download size={20} /> Download PDF
                </button>
                <button className="bg-white border border-black/10 w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Printer size={24} />
                </button>
                <button className="bg-white border border-black/10 w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Copy size={24} />
                </button>
              </div>
            </div>

            {/* Right: Technical Metadata */}
            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-black/30 pl-4">Trust Metadata</h4>
              
              <div className="bg-white border border-black/10 rounded-[32px] p-8 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-black/40 mb-1">
                    <Hash size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Blockchain Hash</span>
                  </div>
                  <p className="font-mono text-[10px] break-all leading-relaxed p-4 bg-black/5 rounded-xl border border-black/5 text-black/60">
                    {certificate.stellarTxHash}
                  </p>
                  <a 
                    href={`https://stellar.expert/explorer/testnet/tx/${certificate.stellarTxHash}`}
                    target="_blank"
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1 hover:underline mt-2 cursor-pointer"
                  >
                    View on Stellar Expert <ExternalLink size={10} />
                  </a>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Network', value: 'Stellar Testnet', icon: Clock },
                    { label: 'Asset', value: 'XLM / Native', icon: ShieldCheck },
                    { label: 'Status', value: 'Immutable', icon: CheckCircle2 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                      <div className="flex items-center gap-3 text-black/40">
                        <item.icon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold uppercase italic">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                  <div className="flex gap-4">
                    <ShieldCheck className="text-green-600 flex-shrink-0" size={24} />
                    <div>
                      <h5 className="text-sm font-black uppercase italic tracking-tight text-green-700">Cryptography Valid</h5>
                      <p className="text-[10px] text-green-600/70 leading-relaxed font-medium mt-1">
                        The Merkle proof matches the on-chain metadata. This document has not been tampered with.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black text-white p-8 rounded-[32px] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <Building2 className="mb-4 text-white/40" size={32} />
                  <h5 className="text-xl font-bold uppercase italic leading-tight mb-2">Issued by DSCE University</h5>
                  <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest font-bold">
                    Accredited Institution with verified public signing key.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
