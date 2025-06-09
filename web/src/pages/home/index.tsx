import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center"
      style={{
        backgroundImage:
          "radial-gradient(circle, #f3f4f6 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}>
      <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8">
        {/* Heart Icon */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-700">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </div>

        {/* Names */}
        <div className="text-center mb-6">
          <h1
            className="text-6xl font-serif text-gray-800"
            style={{ fontFamily: "Georgia, serif" }}>
            Lidija & Kruno
          </h1>
        </div>

        {/* Date */}
        <div className="text-center mb-12">
          <p className="text-3xl text-gray-600 font-medium">18.06.2025.</p>
        </div>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-gray-800 text-xl leading-relaxed">
            Dragi gosti ovdje možete uploadati Vaše slike.
            <br />
            Slike će se prikazivati na ekranima u sali.
          </p>
        </div>

        {/* Upload Button */}
        <div className="text-center mb-8">
          <Link
            to="/images"
            className="inline-block bg-white border-3 border-gray-800 text-gray-800 font-medium py-4 px-12 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-200 text-xl">
            Upload photos
          </Link>
        </div>

        {/* Bottom Text */}
        <div className="text-center">
          <p className="text-gray-500 text-lg">Najbolja slika dobiva poklon!</p>
        </div>
      </div>
    </div>
  );
}
