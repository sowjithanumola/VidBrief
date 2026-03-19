/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { getTranscript } from './services/youtubeService';
import { generateSummary } from './services/geminiService';
import { Loader2, Copy, Download, Youtube, Sparkles, Zap, Brain, Clock, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const transcript = await getTranscript(url);
      const summaryText = await generateSummary(transcript.map((t: any) => t.text).join(' '));
      setSummary(summaryText);
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message || 'Failed to generate summary. Please check the URL and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950 -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-6xl md:text-7xl font-bold font-display tracking-tighter text-white mb-6">
            Master YouTube in <span className="text-emerald-400">Seconds</span>.
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Stop wasting hours on long videos. VidBrief turns any YouTube video into concise, actionable summaries instantly.
          </p>
          
          <div className="bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800 shadow-2xl max-w-2xl mx-auto backdrop-blur-sm">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube URL here..."
                className="flex-grow p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 py-4 bg-emerald-500 text-zinc-950 rounded-xl font-bold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-2 transition-all hover:scale-105"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Summarizing...' : 'Generate Brief'}
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold font-display text-center mb-16">Why VidBrief?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Get summaries in seconds, not hours." },
            { icon: Brain, title: "Smart AI", desc: "Powered by Gemini for deep insights." },
            { icon: Clock, title: "Save Time", desc: "Focus on what truly matters." }
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-lg">
              <f.icon className="text-emerald-400 mb-4" size={40} />
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-zinc-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto bg-zinc-900/50 rounded-3xl border border-zinc-800">
        <h2 className="text-4xl font-bold font-display text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {[
            { step: "01", title: "Paste URL", desc: "Copy and paste any YouTube video link." },
            { step: "02", title: "Generate", desc: "Our AI analyzes and summarizes the video." },
            { step: "03", title: "Brief & Export", desc: "Read your summary or export as PDF." }
          ].map((s, i) => (
            <div key={i} className="space-y-4">
              <div className="text-5xl font-bold text-emerald-500/20 font-display">{s.step}</div>
              <h3 className="text-2xl font-bold">{s.title}</h3>
              <p className="text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Result Section */}
      {summary && (
        <section className="py-20 px-4 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-3xl font-bold font-display text-white">Your Brief</h2>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(summary); alert('Copied!'); }} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"><Copy size={20} /></button>
                <button onClick={() => { const doc = new jsPDF(); doc.text(summary, 10, 10); doc.save('summary.pdf'); }} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"><Download size={20} /></button>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans text-lg">
              {summary}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
