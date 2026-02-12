"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import ImageCropper from "./ImageCropper";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
  type: "avatar" | "banner";
  currentImageUrl?: string | null;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploadModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  currentImageUrl,
}: ImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (selectedFile) URL.revokeObjectURL(selectedFile);
    setSelectedFile(null);
    setError(null);
    setIsDragging(false);
    dragCounter.current = 0;
    onClose();
  }, [selectedFile, onClose]);

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPEG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }
    if (selectedFile) URL.revokeObjectURL(selectedFile);
    setSelectedFile(URL.createObjectURL(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleCropComplete = (blob: Blob) => {
    const file = new File([blob], `${type}_cropped.jpg`, {
      type: "image/jpeg",
    });
    if (selectedFile) URL.revokeObjectURL(selectedFile);
    setSelectedFile(null);
    setError(null);
    onConfirm(file);
    onClose();
  };

  const handleCropCancel = () => {
    if (selectedFile) URL.revokeObjectURL(selectedFile);
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  const aspect = type === "avatar" ? 1 : 16 / 5;
  const circularCrop = type === "avatar";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === "avatar" ? "Update Profile Photo" : "Update Banner Image"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedFile ? (
            <ImageCropper
              imageSrc={selectedFile}
              aspect={aspect}
              circularCrop={circularCrop}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          ) : (
            <>
              {/* Current image preview */}
              {currentImageUrl && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Current image</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImageUrl}
                    alt="Current"
                    className={`mx-auto object-cover ${
                      type === "avatar"
                        ? "w-20 h-20 rounded-full"
                        : "w-full h-24 rounded-lg"
                    }`}
                  />
                </div>
              )}

              {/* Drop zone */}
              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  isDragging
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`p-3 rounded-full ${
                    isDragging ? "bg-gray-200" : "bg-gray-100"
                  }`}
                >
                  <Upload className="w-6 h-6 text-gray-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging
                      ? "Drop your image here"
                      : "Drag and drop an image, or click to browse"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG, WebP, GIF, or AVIF. Max 5MB.
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">
                  {error}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
