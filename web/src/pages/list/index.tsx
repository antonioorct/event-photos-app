import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUploadImage } from "@/hooks/api/mutations/images";

export default function ImagesList() {
  const { data: images, isLoading, error } = useQuery(imagesApi.all);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadImage();

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem(
      "imageListScrollPosition",
    );
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
      sessionStorage.removeItem("imageListScrollPosition");
    }
  }, []);

  const handleImageClick = (filename: string) => {
    sessionStorage.setItem(
      "imageListScrollPosition",
      window.scrollY.toString(),
    );
  };

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
        navigate("/upload/complete");
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Greška pri slanju fotografije. Pokušajte ponovo.");
        setIsUploading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center text-lg text-gray-800">
          Loading images...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center text-red-500">Error loading images</div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-8">No images found</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="inline-flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploading ? "Uploading..." : "Upload photos"}
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
          </button>
        </div>
      </div>
    );
  }

  const extractFilename = (url: string) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace("images/", "");
  };

  return (
    <div className="min-h-dvh bg-white pb-24">
      {/* Photo Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => {
            const filename = extractFilename(imageUrl);
            return (
              <Link
                key={index}
                to={`/images/${filename}`}
                onClick={() => handleImageClick(filename)}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sticky Upload Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-5">
        <div className="text-center w-full">
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="w-full flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploading ? "Uploading..." : "Upload photos"}
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
          </button>
        </div>
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
