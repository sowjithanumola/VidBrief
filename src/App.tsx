/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { getTranscript } from './services/youtubeService';
import { generateSummary } from './services/geminiService';
import { Loader2, Copy, Download, Youtube } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const transcript = await getTranscript(url);
      const summaryText = await generateSummary(transcript.map((t: any) => t.text).join(' '));
      setSummary(summaryText);
    } catch (error) {
      console.error(error);
      alert('Failed to generate summary.');
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">VidBrief – YouTube Video Summarizer</h1>
      </header>
      
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-grow p-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Youtube />}
              Generate Summary
            </button>
          </div>
        </div>

        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700 space-y-6"
          >
            <div className="flex justify-end gap-2">
              <button onClick={copyToClipboard} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"><Copy size={20} /></button>
              <button onClick={exportPDF} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700"><Download size={20} /></button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {summary}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
