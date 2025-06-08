import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function ImagesList() {
  const { data: images, isLoading, error } = useQuery(imagesApi.all);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading images...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error loading images</div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No images found</div>
      </div>
    );
  }

  const extractFilename = (url: string) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.replace("images/", "");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Images Gallery</h1>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
          ← Nazad na početnu
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {images.map((imageUrl, index) => {
          const filename = extractFilename(imageUrl);
          return (
            <Link
              key={index}
              to={`/images/${filename}`}
              className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow block">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
