import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";

interface ImageDetail {
  key: string;
  url: string;
  filename: string;
}

export default function ImageDetail() {
  const { key } = useParams<{ key: string }>();

  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["image", key],
    queryFn: () => apiClient.get<ImageDetail>(`/images/${key}`),
    enabled: !!key,
  });

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
    <div className="w-full h-dvh bg-black relative overflow-hidden">
      {/* Fullscreen Image */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={image.url}
          alt={image.filename}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Back Button - Top Left */}
      <div className="absolute top-0 left-0 p-6 z-10">
        <Link
          to="/images"
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
        </Link>
      </div>
    </div>
  );
}
