import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Zap, CheckCircle, Globe } from 'lucide-react';

interface HeroProps {
  onVerify: () => void;
  onLogin: () => void;
  isLoggedIn: boolean;
  key?: string;
}

export default function Hero({ onVerify, onLogin, isLoggedIn }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] border border-black/5 rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] border border-black/5 rounded-full pointer-events-none" />

      <section className="max-w-7xl mx-auto px-6 py-32 md:py-48 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live on Stellar Mainnet
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            TRUSTED<br />
            <span className="text-black/20">CREDENTIALS</span><br />
            FOREVER.
          </h1>
          <p className="text-xl text-black/60 max-w-lg mb-12 leading-relaxed">
            CertiChain is the world's most secure platform for issuing and verifying academic certificates using blockchain technology.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onVerify}
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-black/20 transition-all"
            >
              Verify a Certificate <ArrowRight size={20} />
            </motion.button>
            {!isLoggedIn && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onLogin}
                className="px-8 py-4 rounded-2xl font-bold border-2 border-black/10 hover:border-black/40 transition-all"
              >
                For Institutions
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square bg-white rounded-[40px] border border-black/10 shadow-2xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="h-full border-2 border-dashed border-black/10 rounded-[32px] p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck size={32} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-black/30 uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className="text-sm font-bold text-green-600 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <CheckCircle size={14} /> Verified
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black mb-2 uppercase italic tracking-tight">Johnathan Doe</h3>
                <p className="text-black/60 font-medium">B.Sc Computer Science</p>
                <p className="text-black/40 text-xs mt-1 uppercase tracking-widest">DSCE University • 2024</p>
              </div>

              <div className="pt-8 border-t border-black/5">
                <div className="flex justify-between items-end">
                  <div className="w-24 h-24 bg-black/5 rounded-lg border border-black/5 flex items-center justify-center">
                    <div className="w-16 h-16 grid grid-cols-4 gap-1 opacity-20">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="bg-black rounded-sm" />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-black/30 uppercase tracking-[0.2em] mb-1">Blockchain Hash</p>
                    <p className="text-[10px] font-mono text-black/60 break-all w-48 leading-tight">
                      e81a3d3c...a4b5c6d7e8f9a0b
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-black/5 max-w-[200px]"
          >
            <Zap className="text-yellow-500 mb-2" size={24} />
            <p className="text-sm font-bold leading-tight">Instant verification in milliseconds.</p>
          </motion.div>

          <motion.div
            animate={{ 
              y: [0, 10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-black/5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                <Globe size={20} />
              </div>
              <p className="text-sm font-bold">Stellar Network Powered</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-5xl font-black mb-2">100K+</h3>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Certificates Issued</p>
          </div>
          <div>
            <h3 className="text-5xl font-black mb-2">500+</h3>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Partner Institutions</p>
          </div>
          <div>
            <h3 className="text-5xl font-black mb-2">0.01s</h3>
            <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Avg. Verification Time</p>
          </div>
        </div>
      </section>
    </div>
  );
}
