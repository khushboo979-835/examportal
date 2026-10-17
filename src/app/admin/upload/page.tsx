import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import MultiStepUpload from '@/components/admin/MultiStepUpload';

export default function AdminUploadPage() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 pb-16">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Upload & Publish Study Material
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            4-step wizard to register board categories, metadata, and upload private PDFs directly to Cloudflare R2 / AWS S3 storage.
          </p>
        </div>

        <MultiStepUpload />
      </div>
    </div>
  );
}
