import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
import { useUploadImage } from "@/hooks/api/mutations/images";

export default function UploadFromCamera() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const camera = useRef<{
    takePhoto: () => string;
    switchCamera: () => "user" | "environment";
  }>(null);
  const navigate = useNavigate();

  const uploadMutation = useUploadImage();

  const openCamera = async () => {
    try {
      setCameraError(null);
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

  const captureImage = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();

      if (isFlipped) {
        // Create a canvas to flip the image
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          if (ctx) {
            // Flip horizontally
            ctx.scale(-1, 1);
            ctx.drawImage(img, -img.width, 0);

            const flippedPhoto = canvas.toDataURL("image/jpeg", 0.8);
            setCapturedImage(flippedPhoto);
          }
        };
        img.src = photo;
      } else {
        setCapturedImage(photo);
      }

      setIsCameraOpen(false);
    }
  };

  const switchCamera = () => {
    if (camera.current) {
      const newFacingMode = camera.current.switchCamera();
      setFacingMode(newFacingMode);
    }
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    openCamera();
  };

  const confirmUpload = async () => {
    if (!capturedImage) {
      return;
    }

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `kamera-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      await uploadMutation.mutateAsync(file);
      navigate("/upload/complete");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const cancelCapture = () => {
    setCapturedImage(null);
    closeCamera();
  };

  // Fullscreen camera interface
  if (isCameraOpen) {
    return (
      <div className="w-full h-screen bg-black relative overflow-hidden">
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

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
          {/* Back Button */}
          <button
            onClick={cancelCapture}
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
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
            className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all">
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
            className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-all shadow-lg flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {!capturedImage && (
          <div className="mb-8">
            <Link
              to="/upload"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              ← Natrag
            </Link>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Snimite kamerom
          </h1>

          {!capturedImage && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <p className="text-gray-600 mb-8">
                Snimite fotografiju direktno kamerom
              </p>

              {cameraError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {cameraError}
                </div>
              )}

              <button
                onClick={openCamera}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto">
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
                <span>Otvori kameru</span>
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Pregled fotografije
              </h3>
              <div className="mb-6">
                <img
                  src={capturedImage}
                  alt="Snimljena fotografija"
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-md"
                />
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={retakePhoto}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={uploadMutation.isPending}>
                  Ponovo snimite
                </button>
                <button
                  onClick={confirmUpload}
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
