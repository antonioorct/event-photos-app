import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useUploadImage } from "@/hooks/api/mutations/images";

export default function UploadComplete() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadImage();

  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadError(null);

      try {
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            await uploadMutation.mutateAsync(file);
          }
        }
        setIsUploading(false);
        setShowThanks(true);
        setTimeout(() => {
          setShowThanks(false);
        }, 5000);
        navigate("/upload/complete");
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Greška pri slanju fotografije. Pokušajte ponovo.");
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="w-full h-dvh bg-white flex flex-col items-center justify-center py-6 px-4">
      {/* Thank you message */}
      <div className="text-center mb-8 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-serif text-gray-800 mb-8">Hvala!</h1>

        <div className="mb-8">
          <p className="text-gray-800 text-xl leading-relaxed mb-4">
            Vaše slike će se prikazati na ekranima!
          </p>
          <p className="text-gray-800 text-xl leading-relaxed">
            Hvala Vam što ste uljepšali naše slavlje!
          </p>
        </div>
      </div>

      <div className="text-center mb-2">
        <h1
          className="text-[26px] font-bold"
          style={{ fontFamily: "Montserrat, sans-serif" }}>
          Lidija & Kruno Wedding
        </h1>
      </div>

      {/* Date */}
      <div className="text-center mb-6">
        <p className="text-lg font-bold">18.06.2025</p>
      </div>

      <div className="text-center w-full">
        <Link
          to="/images"
          className="w-full flex justify-center items-center border-2 border-black text-black font-semibold py-4 px-12 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg mb-3">
          Povratak u galeriju
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-4 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
      {/* Upload Button */}
      <div className="text-center w-full">
        <button
          onClick={handleUploadClick}
          disabled={isUploading || showThanks}
          className="w-full flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {isUploading
            ? "Uploading..."
            : showThanks
              ? "Hvala za slike!"
              : "Upload More"}
          {showThanks ? null : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-4 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {uploadError && (
        <div className="fixed top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 z-50">
          <p className="text-red-600 text-center text-sm">{uploadError}</p>
        </div>
      )}
    </div>
  );
}
