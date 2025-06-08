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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading image...</div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading image</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/images"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            ← Nazad na galeriju
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {image.filename}
            </h1>
            <div className="flex justify-center">
              <img
                src={image.url}
                alt={image.filename}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
