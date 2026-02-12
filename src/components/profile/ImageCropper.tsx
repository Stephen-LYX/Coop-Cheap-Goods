"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  imageSrc: string;
  aspect?: number;
  circularCrop?: boolean;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas;
}

export default function ImageCropper({
  imageSrc,
  aspect,
  circularCrop = false,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      imgRef.current = e.currentTarget;
      const { width, height } = e.currentTarget;

      // Set an initial centered crop
      const cropSize = aspect
        ? (() => {
            const imgAspect = width / height;
            if (imgAspect > aspect) {
              const cropHeight = height * 0.8;
              const cropWidth = cropHeight * aspect;
              return {
                width: (cropWidth / width) * 100,
                height: (cropHeight / height) * 100,
              };
            } else {
              const cropWidth = width * 0.8;
              const cropHeight = cropWidth / aspect;
              return {
                width: (cropWidth / width) * 100,
                height: (cropHeight / height) * 100,
              };
            }
          })()
        : { width: 80, height: 80 };

      const initialCrop: Crop = {
        unit: "%",
        x: (100 - cropSize.width) / 2,
        y: (100 - cropSize.height) / 2,
        width: cropSize.width,
        height: cropSize.height,
      };
      setCrop(initialCrop);
    },
    [aspect]
  );

  const handleConfirm = useCallback(() => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = getCroppedCanvas(imgRef.current, completedCrop);
    canvas.toBlob(
      (blob) => {
        if (blob) onCropComplete(blob);
      },
      "image/jpeg",
      0.92
    );
  }, [completedCrop, onCropComplete]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="max-h-[60vh] overflow-auto">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          circularCrop={circularCrop}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            className="max-w-full"
          />
        </ReactCrop>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={!completedCrop}
          className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Use This Photo
        </button>
      </div>
    </div>
  );
}
