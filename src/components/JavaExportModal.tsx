import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Copy,
  Check,
  X,
  FolderArchive,
  ExternalLink,
  Terminal,
  Database
} from 'lucide-react';
import { JAVA_PROJECT_FILES, downloadProjectZip } from '../utils/javaProjectFiles';

interface JavaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JavaExportModal: React.FC<JavaExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const activeFile = JAVA_PROJECT_FILES[selectedFileIdx] || JAVA_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadProjectZip();
    } catch (err) {
      alert('Failed to generate ZIP archive: ' + err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[88vh] rounded-3xl bg-[#090D1A] border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FolderArchive className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-white text-lg">
                  ARENA-X Java 21 + JavaFX Desktop Project Bundle
                </h3>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                  Ready for IntelliJ &amp; Eclipse
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete Maven repository with MySQL scripts, JDBC connection pooling, and tournament algorithms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Generating ZIP...' : 'Download Project .ZIP'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructions banner */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>
              Maven Run Command: <span className="font-mono-code text-emerald-400 font-bold">mvn clean compile javafx:run</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono-code text-[11px]">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target: MySQL 8.0 `arena_x_db`</span>
          </div>
        </div>

        {/* Body: Left file tree + Right code viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-72 bg-slate-950 border-r border-slate-800 overflow-y-auto p-3 space-y-1 select-none shrink-0">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Project Structure ({JAVA_PROJECT_FILES.length} Files)
            </div>

            {JAVA_PROJECT_FILES.map((file, idx) => {
              const isSelected = selectedFileIdx === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-2 border-emerald-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate font-mono-code text-[11px]">{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-[#050811] overflow-hidden">
            {/* File Path & Copy Toolbar */}
            <div className="px-5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs bg-slate-950/40">
              <span className="font-mono-code text-slate-400 text-[11px]">
                File: <span className="text-white font-bold">{activeFile.path}</span>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-5 font-mono-code text-xs text-slate-200 leading-relaxed selection:bg-emerald-500/30">
              <pre className="whitespace-pre-wrap">{activeFile.content}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
