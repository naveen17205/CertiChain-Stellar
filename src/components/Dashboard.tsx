import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle,
  FileText,
  Filter,
  MoreVertical,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  serverTimestamp, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Certificate, Institution } from '../types';
import { generateCertificateId, issueCertificateOnStellar } from '../lib/stellar';

interface DashboardProps {
  institution: Institution;
  key?: string;
}

export default function Dashboard({ institution }: DashboardProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  
  // Form state
  const [newCert, setNewCert] = useState({
    studentName: '',
    courseName: '',
  });
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, [institution.id]);

  const fetchCertificates = async () => {
    try {
      const q = query(
        collection(db, 'certificates'), 
        where('institutionId', '==', institution.id)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data() as Certificate);
      setCertificates(data.sort((a, b) => b.issueDate?.seconds - a.issueDate?.seconds));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    try {
      const certId = generateCertificateId();
      
      // Step 1: Issue on Stellar
      const stellarHash = await issueCertificateOnStellar({
        id: certId,
        studentName: newCert.studentName,
        courseName: newCert.courseName,
        institutionName: institution.name
      });

      // Step 2: Save to Firestore
      const certData: Certificate = {
        id: certId,
        studentName: newCert.studentName,
        courseName: newCert.courseName,
        issueDate: serverTimestamp(),
        institutionId: institution.id,
        institutionName: institution.name,
        stellarTxHash: stellarHash,
        status: 'issued'
      };

      await setDoc(doc(db, 'certificates', certId), certData);
      
      setNewCert({ studentName: '', courseName: '' });
      setIsAdding(false);
      fetchCertificates();
    } catch (error) {
      console.error(error);
    } finally {
      setIssuing(false);
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.studentName.toLowerCase().includes(search.toLowerCase()) || 
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tight">Institutional Portal</h2>
          <p className="text-black/40 font-mono text-xs uppercase tracking-widest mt-1">
            {institution.name} • {institution.email}
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-fit"
        >
          <Plus size={20} /> Issue New Certificate
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Issued', value: certificates.length, icon: FileText, color: 'text-blue-600' },
          { label: 'Verified Checks', value: '1.2K', icon: Check, color: 'text-green-600' },
          { label: 'Active Network', value: 'Stellar', icon: Globe, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-black/10 rounded-3xl p-6 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-black/30 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black uppercase italic">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-black/10 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md text-black/40 focus-within:text-black">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
            <input 
              type="text" 
              placeholder="Search by student or certificate ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-black font-medium focus:text-white transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Filter size={20} />
            </button>
            <button className="p-3 bg-black/5 rounded-xl hover:bg-black/10 transition-colors">
              <Calendar size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-black/40 font-bold uppercase tracking-widest">
            Loading Registry...
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-black/20">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">No certificates found</h3>
            <p className="text-black/40">Start by issuing your first blockchain-verified credential.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/5 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">
                  <th className="px-8 py-6">Certificate ID</th>
                  <th className="px-8 py-6">Student Name</th>
                  <th className="px-8 py-6">Course / Degree</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="group hover:bg-black/5 transition-colors cursor-default">
                    <td className="px-8 py-6 font-mono text-sm font-bold">{cert.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-xs font-bold font-mono">
                          {cert.studentName.charAt(0)}
                        </div>
                        <span className="font-bold">{cert.studentName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-black/60 font-medium">{cert.courseName}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all" title="View details">
                          <ExternalLink size={16} />
                        </button>
                        <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all" title="Copy Hash">
                          <Copy size={16} />
                        </button>
                        <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#F5F5F0] w-full max-w-xl rounded-[40px] overflow-hidden relative shadow-2xl border border-black/10"
            >
              <div className="p-8 border-b border-black/10 flex justify-between items-center bg-white">
                <h3 className="text-2xl font-black uppercase italic tracking-tight">Issue Credential</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <form onSubmit={handleIssue} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 pl-2">Student Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                      <input 
                        required
                        type="text" 
                        value={newCert.studentName}
                        onChange={e => setNewCert({...newCert, studentName: e.target.value})}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 pl-2">Course or Degree</label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={20} />
                      <input 
                        required
                        type="text" 
                        value={newCert.courseName}
                        onChange={e => setNewCert({...newCert, courseName: e.target.value})}
                        placeholder="e.g. Master of Business Administration"
                        className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-black font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-black/5 p-6 rounded-3xl border border-black/5 flex items-start gap-4">
                  <div className="p-2 bg-black rounded-lg text-white">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Stellar Blockchain Issuance</h4>
                    <p className="text-xs text-black/40 leading-relaxed uppercase tracking-widest font-bold">
                      This certificate will be permanently etched on the Stellar public ledger. It cannot be edited or deleted once issued.
                    </p>
                  </div>
                </div>

                <button 
                  disabled={issuing}
                  type="submit"
                  className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {issuing ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Broadcasting to Stellar...
                    </>
                  ) : (
                    <>Sign & Issue Certificate</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Globe(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
