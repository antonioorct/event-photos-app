import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useUploadImage } from "@/hooks/api/mutations/images";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadMutation = useUploadImage();

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      setUploadError(null);

      try {
        await uploadMutation.mutateAsync(file);
        navigate("/upload/complete");
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Greška pri slanju fotografije. Pokušajte ponovo.");
        setIsUploading(false);
      }
    }
  };

  const handleGalleryClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="min-h-dvh bg-white flex flex-col items-center justify-center p-4 pb-24">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pošaljite fotografije
          </h1>
          <p className="text-gray-600">
            {isUploading ? "Šalje se fotografija..." : "Odaberite način slanja"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGalleryClick}
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg border-2 border-blue-700 shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{isUploading ? "Šalje se..." : "Pošaljite iz galerije"}</span>
          </button>

          <Link
            to="/upload-from-camera"
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg border-2 border-purple-700 shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
              isUploading ? "pointer-events-none opacity-50" : ""
            }`}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Snimite kamerom</span>
          </Link>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-center text-sm">{uploadError}</p>
          </div>
        )}
      </div>

      {/* Back Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex justify-center items-center bg-white text-black font-medium py-3 px-8 rounded-lg border-2 border-black hover:bg-gray-50 transition-colors duration-200 text-md w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Natrag na početnu
          </Link>
        </div>
      </div>
    </div>
  );
}
