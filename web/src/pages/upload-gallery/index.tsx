import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useUploadImage } from "@/hooks/api/mutations/images";

export default function UploadFromGallery() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const uploadMutation = useUploadImage();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFile) {
      return;
    }

    try {
      await uploadMutation.mutateAsync(selectedFile);
      navigate("/upload/complete");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            to="/upload"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            ← Natrag
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pošaljite iz galerije
          </h1>
          <p className="text-gray-600 mb-8">
            Odaberite fotografije iz vaše galerije
          </p>

          {!selectedFile ? (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div
                className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}>
                <div className="text-center cursor-pointer">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-lg text-gray-600 mb-2">
                    Povucite fotografiju ovdje ili kliknite za odabir
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF do 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Pregled fotografije
              </h3>
              <div className="mb-6">
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                />
              </div>
              <p className="text-gray-600 mb-6">
                Ime datoteke: {selectedFile.name}
              </p>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={uploadMutation.isPending}>
                  Odustani
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={uploadMutation.isPending}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
                  {uploadMutation.isPending ? "Šalje se..." : "Potvrdi"}
                </button>
              </div>

              {uploadMutation.isError && (
                <p className="text-red-500 mt-4">
                  Greška pri slanju fotografije. Pokušajte ponovo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
