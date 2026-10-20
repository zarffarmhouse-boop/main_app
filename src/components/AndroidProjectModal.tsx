import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../android/androidProjectFiles.ts';
import { X, Download, Copy, Check, Code, FileText, Smartphone } from 'lucide-react';
import JSZip from 'jszip';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[4]); // default Entities.kt or MainActivity
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add each file to the zip structure
      ANDROID_PROJECT_FILES.forEach((f) => {
        zip.file(`zarf-farmhouse-android/${f.path}`, f.content);
      });

      // Add readme
      zip.file(
        'zarf-farmhouse-android/README.md',
        `# Zarf Farmhouse Manager - Android Native App

Built with:
- Kotlin 2.0+
- Jetpack Compose & Material 3
- Room Database (Offline SQLite local persistence)
- Single-Activity Architecture
- Large UI for Senior Users (20sp+ text, 48dp+ tap targets)

## How to Run:
1. Open Android Studio Ladybug or newer.
2. Select "Open" and choose the extracted \`zarf-farmhouse-android\` folder.
3. Sync Gradle and run on device or emulator.
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'zarf-farmhouse-manager-android.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error creating ZIP:', err);
      alert('Failed to generate zip file');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="android-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-5xl shadow-2xl border-2 border-stone-300 dark:border-stone-700 flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#C62828] dark:bg-red-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-white" />
            <div>
              <h2 id="android-modal-title" className="text-2xl sm:text-3xl font-black">
                Native Android Kotlin Project
              </h2>
              <p className="text-red-100 text-base sm:text-lg">
                Room Database • Jetpack Compose • Material 3 • Ready to Install
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-black text-lg flex items-center gap-2 shadow-sm min-h-[48px] active:scale-95 disabled:opacity-50"
            >
              <Download className="w-6 h-6 text-[#C62828]" />
              <span>{isZipping ? 'Creating ZIP...' : 'Download Project ZIP'}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 text-white hover:bg-red-800 rounded-full min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>

        {/* Content split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File sidebar */}
          <div className="w-full md:w-80 bg-stone-100 dark:bg-stone-950 border-r border-stone-300 dark:border-stone-800 p-3 overflow-y-auto shrink-0">
            <h3 className="text-base font-bold text-stone-500 uppercase tracking-wider px-2 mb-2">
              Android Source Files
            </h3>
            <div className="space-y-1">
              {ANDROID_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-base transition-colors flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#C62828] text-white font-bold shadow-md'
                        : 'text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 font-medium'
                    }`}
                  >
                    <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-[#C62828] dark:text-red-400'}`} />
                    <div className="truncate">
                      <div className="truncate font-semibold">{file.name}</div>
                      <div className={`text-xs truncate ${isSelected ? 'text-red-100' : 'text-stone-500'}`}>
                        {file.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-stone-900 text-stone-100 overflow-hidden">
            <div className="px-4 py-3 bg-stone-950 border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-stone-300 font-mono text-base truncate">
                <Code className="w-5 h-5 text-red-400" />
                <span className="font-bold text-white">{selectedFile.path}</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-sm font-bold flex items-center gap-1.5 min-h-[40px]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <pre className="p-4 overflow-auto font-mono text-sm sm:text-base leading-relaxed flex-1 selection:bg-red-900">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 dark:bg-stone-950 border-t border-stone-300 dark:border-stone-800 flex justify-between items-center text-sm font-bold text-stone-600 dark:text-stone-400">
          <span>Fully compliant with Android 15 & Jetpack Compose BOM</span>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-300 dark:bg-stone-800 hover:bg-stone-400 text-stone-900 dark:text-white rounded-xl font-bold min-h-[44px]"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
