import React, { useRef } from 'react';
import { toast } from 'react-toastify';

/**
 * ImageUpload — converts a local file to base64 and calls onChange(base64String)
 * Props:
 *   value     — current base64 string or URL
 *   onChange  — called with base64 string
 *   label     — optional label text
 */
export default function ImageUpload({ value, onChange, label = 'Image' }) {
    const inputRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.warning('Image must be under 5 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => onChange(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <div
                onClick={() => inputRef.current?.click()}
                className="relative group cursor-pointer rounded-xl border-2 border-dashed border-slate-700 hover:border-brand-500 transition-colors overflow-hidden"
                style={{ minHeight: 140 }}
            >
                {value ? (
                    <>
                        <img src={value} alt="preview" className="w-full h-40 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">🔄 Change Image</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500 gap-2">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="10" fill="#1e293b" />
                            <path d="M14 28l6-8 5 6.5 3.5-4.5L34 28H14z" fill="#475569" />
                            <circle cx="26" cy="15" r="3" fill="#64748b" />
                            <path d="M20 8v8M16 12h8" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <div className="text-center">
                            <div className="text-sm font-medium text-slate-400">Click to upload image</div>
                            <div className="text-xs text-slate-600 mt-0.5">PNG, JPG, WEBP up to 5MB</div>
                        </div>
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
    );
}
