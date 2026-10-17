'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Loader2,
  Lock,
  Eye
} from 'lucide-react';
import { mockCategories, mockBoards, mockSubjects } from '@/lib/mock-db';
import { Medium, MaterialType, CategoryLevel } from '@/types';
import { slugify } from '@/lib/utils';

export default function MultiStepUpload() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Category & Board & Subject
  const [selectedLevel, setSelectedLevel] = useState<CategoryLevel>('COMPETITIVE');
  const [selectedBoardId, setSelectedBoardId] = useState<string>('exam-bpsc');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('sub-bpsc-bihar');

  // Step 2: Metadata & SEO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [medium, setMedium] = useState<Medium>('HINDI');
  const [materialType, setMaterialType] = useState<MaterialType>('NOTES');
  const [price, setPrice] = useState('149');
  const [discountedPrice, setDiscountedPrice] = useState('79');
  const [tags, setTags] = useState('BPSC, Bihar Special, 70th CCE, Topper Notes');
  const [pageCount, setPageCount] = useState('120');
  const [authorName, setAuthorName] = useState('State Ranker Faculty');

  // Step 3: Files & S3 Presigned Upload
  const [fullPdfFile, setFullPdfFile] = useState<File | null>(null);
  const [previewPdfFile, setPreviewPdfFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedKeys, setUploadedKeys] = useState<{ fileKey: string; previewKey?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 4: Publish Status
  const [isPublishedSuccess, setIsPublishedSuccess] = useState(false);

  // Filter boards based on selected category level
  const filteredBoards = mockBoards.filter((b) => {
    const cat = mockCategories.find((c) => c.id === b.categoryId);
    return cat?.level === selectedLevel;
  });

  const filteredSubjects = mockSubjects.filter((s) => s.boardOrExamId === selectedBoardId);

  // Handle direct client-side S3/R2 presigned upload
  const handleUploadFiles = async () => {
    if (!fullPdfFile) {
      setError('Please select the full PDF study document.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(15);

    try {
      // 1. Request presigned URL for Full PDF
      const res = await fetch('/api/storage/presign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: fullPdfFile.name,
          fileType: fullPdfFile.type || 'application/pdf',
          folder: 'materials',
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to get upload signature');

      setUploadProgress(40);

      // 2. Direct PUT to S3 / Cloudflare R2 presigned URL
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fullPdfFile.type || 'application/pdf' },
        body: fullPdfFile,
      });

      setUploadProgress(70);

      let previewKey = null;
      // Optional: upload preview PDF if provided
      if (previewPdfFile) {
        const previewRes = await fetch('/api/storage/presign-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: previewPdfFile.name,
            fileType: previewPdfFile.type || 'application/pdf',
            folder: 'previews',
          }),
        });
        const previewData = await previewRes.json();
        if (previewData.success) {
          await fetch(previewData.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': previewPdfFile.type || 'application/pdf' },
            body: previewPdfFile,
          });
          previewKey = previewData.fileKey;
        }
      }

      setUploadProgress(90);

      // 3. Register Product Record in Database
      const createRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          discountedPrice: discountedPrice ? Number(discountedPrice) : null,
          fileKey: data.fileKey,
          previewKey,
          pageCount: Number(pageCount),
          fileSize: fullPdfFile.size,
          medium,
          materialType,
          tags: tags.split(',').map((t) => t.trim()),
          authorName,
          subjectId: selectedSubjectId || 'sub-bpsc-bihar',
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error || 'Database save failed');

      setUploadProgress(100);
      setUploadedKeys({ fileKey: data.fileKey, previewKey });
      setIsPublishedSuccess(true);
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Upload pipeline encountered an error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      
      {/* Step Indicators */}
      <div className="bg-slate-900 text-white px-6 py-5 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Product Upload Engine</h2>
            <p className="text-xs text-slate-400">Direct S3/R2 presigned pipeline with zero server bandwidth load</p>
          </div>
          <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
            Step {step} of 4
          </span>
        </div>

        {/* Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {['1. Stream & Board', '2. Metadata & SEO', '3. PDF Vault Upload', '4. Complete'].map((label, idx) => (
            <div key={idx} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step > idx + 1
                    ? 'bg-emerald-500'
                    : step === idx + 1
                    ? 'bg-blue-500'
                    : 'bg-slate-700'
                }`}
              />
              <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: CATEGORY & BOARD */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Academic Category Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'School Boards (K-12)', value: 'K12' },
                  { label: 'Competitive Exams', value: 'COMPETITIVE' },
                  { label: 'Graduation & Tech', value: 'HIGHER_ED' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(cat.value as CategoryLevel);
                      const b = mockBoards.find((board) => {
                        const c = mockCategories.find((cItem) => cItem.id === board.categoryId);
                        return c?.level === cat.value;
                      });
                      if (b) setSelectedBoardId(b.id);
                    }}
                    className={`p-4 rounded-2xl border text-left font-bold text-xs transition-all ${
                      selectedLevel === cat.value
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select Target Board or Examination
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredBoards.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBoardId(b.id);
                      const sub = mockSubjects.find((s) => s.boardOrExamId === b.id);
                      if (sub) setSelectedSubjectId(sub.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedBoardId === b.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-extrabold text-xs">{b.name} ({b.code})</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{b.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Select Subject / Paper
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-500 outline-hidden"
              >
                {filteredSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.classLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
              >
                Next: Enter Metadata <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: METADATA & SEO */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Product Title (SEO Optimized)</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. BPSC 70th CCE: Bihar Special Complete History & GK Topper Notes"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed chapter coverage, solved question count, formula sheets included..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medium</label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value as Medium)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="HINDI">हिन्दी माध्यम (Hindi)</option>
                  <option value="ENGLISH">English Medium</option>
                  <option value="BILINGUAL">Bilingual (Hinglish)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Material Type</label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as MaterialType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="NOTES">Handwritten Notes</option>
                  <option value="PYQ">10-Year Solved PYQs</option>
                  <option value="FORMULA_SHEET">Formula Sheet & Mind Maps</option>
                  <option value="MODEL_PAPER">Model Solved Papers</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author / Faculty</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discounted Offer (₹)</label>
                <input
                  type="number"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Page Count</label>
                <input
                  type="number"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Search Matching Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="BPSC, 70th CCE, Bihar Special, Toppers Notes"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!title) {
                    setError('Please enter a product title');
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2"
              >
                Next: Attach Files <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: UPLOAD TO PRIVATE S3/R2 STORAGE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-600" /> 1. Full PDF Document (Private Storage Vault)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFullPdfFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <UploadCloud className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-800">
                  {fullPdfFile ? fullPdfFile.name : 'Click to browse or drop Master PDF file'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  PDF format only (Max 50 MB) • Never exposed directly to public URLs
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-600" /> 2. Sample Preview PDF (Optional 2-3 Pages)
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-50/50 cursor-pointer relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPreviewPdfFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="text-xs font-semibold text-slate-700">
                  {previewPdfFile ? previewPdfFile.name : 'Click to upload custom 2-3 sample preview (or leave empty for auto-generation)'}
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex justify-between text-xs font-bold text-blue-800">
                  <span>Uploading directly to S3/R2 storage vault...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                disabled={isUploading || !fullPdfFile}
                onClick={handleUploadFiles}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Vault...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" /> Launch & Publish Study Material
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && isPublishedSuccess && (
          <div className="text-center py-8 space-y-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Study Material Successfully Published!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The PDF has been securely uploaded to your private storage vault with dynamic anti-piracy watermarking enabled.
            </p>

            <div className="pt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setStep(1);
                  setTitle('');
                  setFullPdfFile(null);
                  setIsPublishedSuccess(false);
                }}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Upload Another PDF
              </button>
              <button
                onClick={() => router.push('/explore')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                View in Marketplace
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
