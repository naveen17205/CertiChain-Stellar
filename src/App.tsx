/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  LogOut, 
  LayoutDashboard, 
  User,
  GraduationCap
} from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, loginWithGoogle, logout, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Institution } from './types';

// Components
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import VerifyPortal from './components/VerifyPortal';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'verify'>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const instDoc = await getDoc(doc(db, 'institutions', user.uid));
        if (instDoc.exists()) {
          setInstitution(instDoc.data() as Institution);
        } else {
          // New institution registration
          const newInst: Institution = {
            id: user.uid,
            name: user.displayName || 'New Institution',
            email: user.email || '',
          };
          await setDoc(doc(db, 'institutions', user.uid), newInst);
          setInstitution(newInst);
        }
      } else {
        setInstitution(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-black border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#F5F5F0]/80 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">CertiChain</span>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('verify')}
              className={`text-sm font-medium transition-colors hover:text-black ${activeTab === 'verify' ? 'text-black underline underline-offset-8' : 'text-black/40'}`}
            >
              Verification
            </button>
            {user && (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`text-sm font-medium transition-colors hover:text-black ${activeTab === 'dashboard' ? 'text-black underline underline-offset-8' : 'text-black/40'}`}
              >
                Dashboard
              </button>
            )}
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-black/10">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold">{institution?.name}</span>
                  <button onClick={logout} className="text-xs text-black/40 hover:text-red-500 transition-colors">Logout</button>
                </div>
                <img src={user.photoURL || ''} alt="Profile" className="w-10 h-10 rounded-full border border-black/10" />
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-all"
              >
                Institution Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <Hero key="home" onVerify={() => setActiveTab('verify')} onLogin={handleLogin} isLoggedIn={!!user} />
          )}
          {activeTab === 'verify' && (
            <VerifyPortal key="verify" />
          )}
          {activeTab === 'dashboard' && user && (
            <Dashboard key="dashboard" institution={institution!} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-black/10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-black" size={32} />
                <span className="text-2xl font-bold tracking-tight">CertiChain</span>
              </div>
              <p className="text-black/60 max-w-sm leading-relaxed">
                Immutable, secure, and instant certificate verification powered by Stellar Blockchain. Empowering institutions and students with trust.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-black/40 text-sm">
                <li><button onClick={() => setActiveTab('verify')} className="hover:text-black">Verify Status</button></li>
                <li><button onClick={handleLogin} className="hover:text-black">Institution Portal</button></li>
                <li><button className="hover:text-black">Developer API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-black/40 text-sm">
                <li><a href="#" className="hover:text-black">Twitter</a></li>
                <li><a href="#" className="hover:text-black">Discord</a></li>
                <li><a href="#" className="hover:text-black">Github</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-black/5 flex justify-between items-center text-xs text-black/30 font-mono">
            <span>© 2024 CERTICHAIN FOUNDATION</span>
            <span>POWERED BY STELLAR SOROBAN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

