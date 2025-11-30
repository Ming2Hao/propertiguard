"use client";

import { useState } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle, Loader2, ShieldCheck, ArrowRight, FileCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze contract");
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Debug log
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menganalisis dokumen. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-sm font-medium mb-4 animate-fade-in-up">
          <ShieldCheck className="w-4 h-4" />
          <span>AI Legal Assistant v1.0</span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-100 tracking-tight leading-tight">
          Cek Kontrak Rumahmu <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Sebelum Terlambat
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Analisis risiko hukum dalam kontrak sewa/beli properti Anda secara instan dengan bantuan Artificial Intelligence.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto">
        {/* File Uploader */}
        <div className="bg-slate-900 rounded-3xl shadow-2xl shadow-black/50 border border-slate-800 p-1 mb-12 overflow-hidden">
          {!result && (
            <div
              className={`relative group rounded-[22px] border-2 border-dashed p-12 text-center transition-all duration-300 ease-in-out
                ${dragActive
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-slate-700 hover:border-blue-500 hover:bg-slate-800/50"
                }
                ${file ? "bg-blue-900/10 border-blue-500/50" : ""}
              `}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,image/*"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-6 relative z-10"
              >
                {file ? (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-lg border border-slate-700">
                      <FileCheck className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-xl text-slate-200 mb-1">{file.name}</p>
                      <p className="text-sm text-slate-400 font-medium bg-slate-800 px-3 py-1 rounded-full inline-block border border-slate-700">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      disabled={loading}
                      className="mt-8 group relative inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Menganalisis Dokumen...</span>
                        </>
                      ) : (
                        <>
                          <span>Analisis Sekarang</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-slate-700">
                      <Upload className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-slate-200">
                        Drag & drop file di sini
                      </p>
                      <p className="text-slate-400">
                        atau <span className="text-blue-400 font-bold hover:underline">klik untuk upload</span>
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 font-medium uppercase tracking-wide">
                      Mendukung PDF, JPG, PNG
                    </p>
                  </>
                )}
              </label>
            </div>
          )}

          {/* Loading State Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-[22px]">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-100 mb-2">Sedang Menganalisis</h3>
              <p className="text-slate-400 animate-pulse">AI sedang membaca detail kontrak Anda...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mx-8 mb-8 bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-start gap-4 text-red-200 animate-in slide-in-from-top-2">
              <div className="bg-red-900/30 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h4 className="font-semibold text-red-100">Error</h4>
                <p className="text-sm mt-1 text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">



            {/* Logic for handling different response formats */}
            {(() => {
              const risks = Array.isArray(result) ? result : result.risks || [];
              const hasAdvice = !!result.advice;
              const hasRisks = risks.length > 0;

              return (
                <>
                  {/* Safe State - No Risks Detected */}
                  {!hasRisks && !hasAdvice && (
                    <div className="bg-emerald-900/20 border border-emerald-900/50 rounded-2xl p-12 text-center animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-900/20">
                        <ShieldCheck className="w-12 h-12 text-emerald-400" />
                      </div>
                      <h2 className="font-display text-3xl font-bold text-emerald-100 mb-4">
                        Aman! Tidak Ditemukan Risiko
                      </h2>
                      <p className="text-emerald-200/70 text-lg max-w-xl mx-auto leading-relaxed">
                        Sistem tidak mendeteksi adanya klausul berbahaya atau indikasi penipuan dalam dokumen ini berdasarkan parameter yang ada.
                      </p>
                    </div>
                  )}

                  {/* Risks Grid */}
                  {hasRisks && (
                    <div>
                      <h2 className="font-display text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <div className="bg-orange-900/30 p-2 rounded-lg text-orange-400">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        Analisis Risiko
                      </h2>
                      <div className="grid gap-6">
                        {risks.map((risk, index) => (
                          <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${(risk.risk_level || risk.level) === "CRITICAL"
                                ? "bg-red-950/20 border-red-900/50 hover:border-red-700"
                                : (risk.risk_level || risk.level) === "HIGH"
                                  ? "bg-orange-950/20 border-orange-900/50 hover:border-orange-700"
                                  : "bg-yellow-950/20 border-yellow-900/50 hover:border-yellow-700"
                              }`}
                          >
                            {/* Decorative gradient background */}
                            <div className={`absolute inset-0 opacity-10 ${(risk.risk_level || risk.level) === "CRITICAL" ? "bg-gradient-to-br from-red-900 to-transparent" :
                                (risk.risk_level || risk.level) === "HIGH" ? "bg-gradient-to-br from-orange-900 to-transparent" :
                                  "bg-gradient-to-br from-yellow-900 to-transparent"
                              }`} />

                            <div className="relative p-6">
                              <div className="flex items-start justify-between mb-4 gap-4">
                                <h3 className={`font-display font-bold text-lg leading-tight ${(risk.risk_level || risk.level) === "CRITICAL" ? "text-red-200" :
                                    (risk.risk_level || risk.level) === "HIGH" ? "text-orange-200" :
                                      "text-yellow-200"
                                  }`}>
                                  {risk.pasal || risk.title}
                                </h3>
                                <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${(risk.risk_level || risk.level) === "CRITICAL"
                                    ? "bg-red-900/50 text-red-200 border-red-800"
                                    : (risk.risk_level || risk.level) === "HIGH"
                                      ? "bg-orange-900/50 text-orange-200 border-orange-800"
                                      : "bg-yellow-900/50 text-yellow-200 border-yellow-800"
                                  }`}>
                                  {risk.risk_level || risk.level}
                                </span>
                              </div>

                              {/* Original Text Quote */}
                              {risk.original_text && (
                                <div className="mb-4 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50 italic text-slate-400 text-sm leading-relaxed relative">
                                  <span className="absolute top-2 left-2 text-4xl text-slate-800 font-serif leading-none opacity-50">"</span>
                                  <span className="relative z-10 pl-4 block">
                                    {risk.original_text}
                                  </span>
                                </div>
                              )}

                              {/* Legal Reasoning */}
                              <div className="flex gap-3">
                                <div className={`mt-1 shrink-0 ${(risk.risk_level || risk.level) === "CRITICAL" ? "text-red-400" :
                                    (risk.risk_level || risk.level) === "HIGH" ? "text-orange-400" :
                                      "text-yellow-400"
                                  }`}>
                                  <ShieldCheck className="w-5 h-5" />
                                </div>
                                <p className={`text-base leading-relaxed ${(risk.risk_level || risk.level) === "CRITICAL" ? "text-red-100/90" :
                                    (risk.risk_level || risk.level) === "HIGH" ? "text-orange-100/90" :
                                      "text-yellow-100/90"
                                  }`}>
                                  {risk.legal_reasoning || risk.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advice/Analysis Section - Only show if advice exists */}
                  {hasAdvice && (
                    <div className="bg-slate-900 rounded-2xl border border-emerald-900/50 p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                      <h2 className="relative font-display text-2xl font-bold text-emerald-100 mb-6 flex items-center gap-3">
                        <div className="bg-emerald-900/30 p-2 rounded-lg text-emerald-400">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        Hasil Analisis
                      </h2>
                      <div className="relative text-emerald-100/90 leading-relaxed prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:text-emerald-50 prose-strong:text-emerald-200 prose-ul:my-4 prose-li:my-2">
                        <ReactMarkdown>
                          {result.advice}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            <div className="pt-8 text-center">
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="text-slate-500 hover:text-slate-300 font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Analisis Dokumen Lain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
