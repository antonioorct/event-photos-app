import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { ScrollRestoration, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useUploadImage } from "@/hooks/api/mutations/images";
import { ImageGallery } from "@/lib/ImageGallery";

export default function ImagesList() {
  const { data: images, isLoading, error } = useQuery(imagesApi.all);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
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
        navigate("/upload/complete");
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Greška pri slanju fotografije. Pokušajte ponovo.");
        setIsUploading(false);
      }
    }
  };

  const extractFilename = (url: string) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace("images/", "");
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

  const imagesArray = images.map((imageUrl, index) => ({
    id: `image-${index}`,
    alt: `Image ${index + 1}`,
    src: imageUrl,
  }));

  return (
    <>
      <ScrollRestoration />
      <div className="bg-white mb-24">
        <div className="px-4 py-4">
          <ImageGallery
            imagesInfoArray={imagesArray.map((image) => ({
              ...image,
              src: image.src.url,
              width: image.src.width || undefined,
              height: image.src.height || undefined,
            }))}
            columnCount={3}
            columnWidth={20}
            gapSize={7}
            lazy
            lazyFromIndex={-1}
          />
        </div>

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
    </>
  );
}
