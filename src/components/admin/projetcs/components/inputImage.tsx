"use client"

import { urlToFile } from '@/lib/file';
import { useState, useRef, ChangeEvent } from 'react';

export function InputImage({
  onImageChange,
  initialValue = '',
}: {
  onImageChange: (file: File | null) => void;
  initialValue?: string;
}) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState(initialValue);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setImageUrl('');
      onImageChange(file);
    }
  };

  const handleUrlChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreview(null);
    setError(null);
    
    // Only process when URL is complete (optional)
    if (!url) {
      onImageChange(null);
      return;
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) {
      onImageChange(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Convert URL to File
      const file = await urlToFile(
        imageUrl,
        `downloaded-${Date.now()}.jpg`, // You can extract filename from URL if needed
        'image/jpeg' // Default mime type
      );
      
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageChange(file);
    } catch (err) {
      console.error('Error processing image URL:', err);
      setError('Failed to load image from URL. Please check the link and try again.');
      onImageChange(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex border rounded-md overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            inputMode === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setInputMode('upload')}
        >
          Upload Image
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            inputMode === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setInputMode('url')}
        >
          Image URL
        </button>
      </div>

      {/* Upload mode */}
      {inputMode === 'upload' && (
        <div className="space-y-2">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
          </div>
        </div>
      )}

      {/* URL mode */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={isLoading || !imageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Load'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Make sure the URL points directly to an image file
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {/* Preview */}
      {(preview || (inputMode === 'url' && imageUrl && !preview)) && (
        <div className="mt-4 relative">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-64 rounded-md border border-gray-200"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md border border-gray-200">
              <p className="text-gray-500">Click "Load" to preview image</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Remove image"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}