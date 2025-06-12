import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";
import { imagesApi } from "@/hooks/api/query-keys/images";
import { useState } from "react";

interface ImageDetail {
  key: string;
  url: string;
  filename: string;
}

export default function ImageDetail() {
  const { key } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["image", key],
    queryFn: () => apiClient.get<ImageDetail>(`/images/${key}`),
    enabled: !!key,
  });

  const { data: allImages } = useQuery(imagesApi.all);

  const extractFilename = (url: string) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace("images/", "");
  };

  const getCurrentImageIndex = () => {
    if (!allImages || !key) return -1;
    return allImages.findIndex((url) => extractFilename(url) === key);
  };

  const canNavigate = (direction: "prev" | "next") => {
    if (!allImages) return false;
    const currentIndex = getCurrentImageIndex();
    if (currentIndex === -1) return false;

    if (direction === "prev") return currentIndex > 0;
    return currentIndex < allImages.length - 1;
  };

  const navigateToImage = (direction: "prev" | "next") => {
    if (!allImages) return;

    const currentIndex = getCurrentImageIndex();
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex - 1;
      if (newIndex < 0) return;
    } else {
      newIndex = currentIndex + 1;
      if (newIndex >= allImages.length) return;
    }

    const newImageUrl = allImages[newIndex];
    const newFilename = extractFilename(newImageUrl);
    navigate(`/images/${newFilename}`);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;

    const maxOffset = 100;
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, diff));
    setSwipeOffset(clampedOffset);
  };

  const onTouchEnd = () => {
    if (!touchStart) return;

    const minSwipeDistance = 50;

    if (Math.abs(swipeOffset) > minSwipeDistance) {
      if (swipeOffset > 0 && canNavigate("prev")) {
        navigateToImage("prev");
      } else if (swipeOffset < 0 && canNavigate("next")) {
        navigateToImage("next");
      }
    }

    setSwipeOffset(0);
    setTouchStart(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-dvh bg-black">
        <div className="text-lg text-white">Loading image...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex justify-center items-center min-h-dvh bg-black">
        <div className="text-red-500">Error loading image</div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-dvh bg-black relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {/* Fullscreen Image */}
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: swipeOffset === 0 ? "transform 0.3s ease-out" : "none",
        }}>
        <img
          src={image.url}
          alt={image.filename}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* No more images indicator */}
      {swipeOffset !== 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {swipeOffset > 0 && !canNavigate("prev") && (
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              Prva slika
            </div>
          )}
          {swipeOffset < 0 && !canNavigate("next") && (
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              Zadnja slika
            </div>
          )}
        </div>
      )}

      {/* Back Button - Top Left */}
      <div className="absolute top-0 left-0 p-6 z-10">
        <button
          onClick={() => navigate("/images")}
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
      </div>
    </div>
  );
}
