import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useUploadImage } from "@/hooks/api/mutations/images";

export default function UploadFromCamera() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const camera = useRef<{
    takePhoto: () => string;
    switchCamera: () => "user" | "environment";
  }>(null);
  const navigate = useNavigate();

  const uploadMutation = useUploadImage();

  // Automatically open camera when component mounts
  useEffect(() => {
    openCamera();
  }, []);

  const openCamera = async () => {
    try {
      setCameraError(null);
      setUploadError(null);
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Camera permission error:", error);
      setCameraError(
        "Dozvola za kameru je potrebna. Molimo dozvolite pristup kameri i pokušajte ponovo.",
      );
    }
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const captureImage = async () => {
    if (camera.current && !isUploading) {
      setIsUploading(true);
      const photo = camera.current.takePhoto();

      try {
        let finalPhoto = photo;

        if (isFlipped) {
          // Create a canvas to flip the image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();

          await new Promise((resolve) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;

              if (ctx) {
                // Flip horizontally
                ctx.scale(-1, 1);
                ctx.drawImage(img, -img.width, 0);
                finalPhoto = canvas.toDataURL("image/jpeg", 1);
              }
              resolve(void 0);
            };
            img.src = photo;
          });
        }

        // Convert to file and upload immediately
        const response = await fetch(finalPhoto);
        const blob = await response.blob();
        const file = new File([blob], `kamera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        await uploadMutation.mutateAsync(file);
        navigate("/upload/complete");
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadError("Greška pri slanju fotografije. Pokušajte ponovo.");
        setIsUploading(false);
      }
    }
  };

  const switchCamera = () => {
    if (camera.current && !isUploading) {
      const newFacingMode = camera.current.switchCamera();
      setFacingMode(newFacingMode);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const cancelCapture = () => {
    setIsCameraOpen(false);
    navigate("/upload");
  };

  // Show error state if camera fails to open
  if (cameraError && !isCameraOpen) {
    return (
      <div className="min-h-dvh bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <Link
              to="/upload"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              ← Natrag
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Problem s kamerom
            </h1>
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {cameraError}
            </div>
            <button
              onClick={openCamera}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors">
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fullscreen camera interface
  return (
    <div className="w-full h-dvh bg-black relative overflow-hidden">
      {/* Camera View */}
      <div className="w-full h-full">
        <div className={`w-full h-full ${isFlipped ? "scale-x-[-1]" : ""}`}>
          <Camera
            ref={camera}
            aspectRatio="cover"
            facingMode={facingMode}
            errorMessages={{
              noCameraAccessible:
                "Kamera nije dostupna. Molimo spojite kameru ili pokušajte drugi pregljednik.",
              permissionDenied:
                "Dozvola odbijena. Molimo osvježite stranicu i dajte dozvolu za kameru.",
              switchCamera:
                "Nije moguće prebaciti kameru jer je dostupna samo jedna.",
              canvas: "Canvas nije podržan.",
            }}
          />
        </div>
      </div>

      {/* Upload Status Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-semibold">Šalje se fotografija...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {uploadError && (
        <div className="absolute top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg z-20">
          <p className="text-center">{uploadError}</p>
        </div>
      )}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
        {/* Back Button */}
        <button
          onClick={cancelCapture}
          disabled={isUploading}
          className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all disabled:opacity-50">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Swap Camera Button */}
        <button
          onClick={switchCamera}
          disabled={isUploading}
          className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all disabled:opacity-50">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M17 2l4 4-4 4M3 6h18M7 22l-4-4 4-4M21 18H3" />
          </svg>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-8 z-10">
        {/* Capture Button */}
        <button
          onClick={captureImage}
          disabled={isUploading}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div>
        </button>
      </div>
    </div>
  );
}
