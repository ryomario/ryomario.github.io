"use client";

import { useState } from "react";
import * as RepoProjects_server from "@/db/repositories/RepoProjects.server";

export function UploadImagePreview() {
  const [file, setFile] = useState<File>()
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    path?: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(!file.type.startsWith("image/")) {
        setUploadStatus({
          success: false,
          message: "The selected file is not an image",
        });
        setPreview(null)
        return;
      }
      setFile(file)
      // Create preview for images
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await RepoProjects_server.uploadImagePreview(file);
      
      setUploadStatus({
        success: true,
        message: "File uploaded successfully!",
        path: result.path
      });
    } catch (error) {
      setUploadStatus({
        success: false,
        message: (error as Error).message || "Upload failed"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload a File</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">
            Choose a file
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        {preview && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-40 rounded-md border border-gray-200"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isUploading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload File"
          )}
        </button>
      </div>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${
          uploadStatus.success 
            ? "bg-green-50 text-green-800" 
            : "bg-red-50 text-red-800"
        }`}>
          <p className="text-sm">
            {uploadStatus.message}
            {uploadStatus.path && (
              <span className="block mt-1">
                Path: <span className="font-mono text-xs">{uploadStatus.path}</span>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}