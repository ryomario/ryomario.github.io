"use client"

import { urlToFile } from '@/lib/file';
import { IProject } from '@/types/IProject';
import { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';

type ImageType = {
  file?: File
  preview?: string
}

export function InputImage({
  onImageChange,
  initialValue = [],
}: {
  onImageChange: (images: ImageType[]) => void;
  initialValue?: IProject['project_preview'];
}) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<ImageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback((...new_images: ImageType[]) => {
    setImages(oldImages => {
      const newImages = [
        ...oldImages,
      ]
      for (const new_image of new_images) {
        if(new_image.preview && oldImages.findIndex(img => img?.preview == new_image.preview) == -1) {
          newImages.push(new_image)
        }
      }
      return newImages
    })
  },[setImages])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const previewImages: ImageType[] = []
      for (const file of files) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        const previewImage: ImageType = {
          file,
          preview: previewUrl,
        }
        previewImages.push(previewImage)
      }
      addImages(...previewImages)
      setImageUrl('');
    }
  };

  const handleUrlChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setError(null);
    
    // Only process when URL is complete (optional)
    if (!url) {
      return;
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) {
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
      addImages({
        file,
        preview: previewUrl,
      })
    } catch (err) {
      console.error('Error processing image URL:', err);
      setError('Failed to load image from URL. Please check the link and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(old => {
      const newData = [...old]
      newData.splice(idx, 1)
      return newData
    })
    setError(null);
  };
  const loadInitialValue = useCallback(async () => {
    if(initialValue && initialValue.length > 0) {
      setIsLoading(true)
      setError(null)
      
      const initialImages: ImageType[] = []
      for(const preview of initialValue) {
        try {
          const file = await urlToFile(
            preview.preview_url,
            `downloaded-${Date.now()}.jpg`, // You can extract filename from URL if needed
            'image/jpeg' // Default mime type)
          )
          initialImages.push({
            file,
            preview: preview.preview_url,
          })
        } catch (error) {
          initialImages.push({})
          console.log('ini',error)
        }
      }
      setImages(initialImages)
      setIsLoading(false)
    }
  },[initialValue])

  useEffect(() => {
    loadInitialValue()
  },[initialValue])

  useEffect(() => {
    if(!isLoading){
      onImageChange(images)
    }
  },[images])

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
                multiple
                onChange={handleFileChange}
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

      {(images.length > 0 || (inputMode === 'url' && imageUrl)) && (
        <div className="mt-4 relative">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, idx) => (
              <div className='relative group' key={`image-preview-${idx}`}>
                <img
                  src={image.preview ?? '/images/placeholder-image.jpg'}
                  alt={`preview-${image.file?.name ?? "placeholder-image.jpg"}`}
                  className="w-full h-32 object-cover rounded-md border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
            ))}
            {(inputMode === 'url' && imageUrl) && (
              <div className='col-span-full relative group flex items-center justify-center w-full h-32 bg-gray-100 rounded-md border border-gray-200'>
                <p className="text-gray-500">Click "Load" to preview image</p>
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
        </div>
      )}
    </div>
  );
}