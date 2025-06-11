import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function ImagesList() {
  const { data: images, isLoading, error } = useQuery(imagesApi.all);

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
          <Link
            to="/upload"
            className="inline-flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg">
            Upload photos
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
          <Link
            to="/upload"
            className="w-full flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg">
            Upload photos
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
      </div>
    </div>
  );
}
