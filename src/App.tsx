/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { getTranscript } from './services/youtubeService';
import { generateSummary } from './services/geminiService';
import { Loader2, Copy, Download, Youtube, Sparkles } from 'lucide-react';
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
    } catch (error) {
      console.error(error);
      alert('Failed to generate summary. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(summary, 10, 10);
    doc.save('summary.pdf');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans">
      <header className="max-w-3xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-4">
          <img src="/public/logo.svg" alt="VidBrief Logo" className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tighter text-white mb-2">VidBrief</h1>
        <p className="text-zinc-400 text-lg">YouTube Video Summarizer</p>
      </header>
      
      <main className="max-w-3xl mx-auto space-y-8">
        <div className="bg-zinc-900 p-2 rounded-2xl border border-zinc-800 shadow-2xl">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-grow p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-4 bg-white text-zinc-950 rounded-xl font-bold hover:bg-zinc-200 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Summarizing...' : 'Generate'}
            </button>
          </div>
        </div>

        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Summary</h2>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"><Copy size={20} /></button>
                <button onClick={exportPDF} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"><Download size={20} /></button>
              </div>
            </div>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
