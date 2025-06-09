import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function ImagesList() {
  const { data: images, isLoading, error } = useQuery(imagesApi.all);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-lg text-gray-800">
          Loading images...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-500">Error loading images</div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-8">No images found</div>
          <Link
            to="/upload"
            className="inline-block bg-gray-800 text-white font-medium py-3 px-8 rounded-full hover:bg-gray-700 transition-colors duration-200">
            Upload photos
          </Link>
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
    <div className="min-h-screen bg-white pb-24">
      {/* Photo Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => {
            const filename = extractFilename(imageUrl);
            return (
              <div
                key={index}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Upload Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <Link
            to="/upload"
            className="inline-block bg-gray-800 text-white font-medium py-4 px-12 rounded-full hover:bg-gray-700 transition-colors duration-200 text-lg">
            Upload photos
          </Link>
        </div>
      </div>
    </div>
  );
}
