import { Link } from "react-router-dom";

export default function UploadComplete() {
  return (
    <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-8">
      {/* Thank you message */}
      <div className="text-center mb-8">
        <h1
          className="text-6xl font-serif text-gray-800 mb-8"
          style={{ fontFamily: "Georgia, serif" }}>
          Hvala!
        </h1>

        <div className="mb-8">
          <p className="text-gray-800 text-xl leading-relaxed mb-4">
            Vaše slike će se prikazuju na ekranima!
          </p>
          <p className="text-gray-800 text-xl leading-relaxed">
            Hvala Vam što ste uljepšali naše slavlje!
          </p>
        </div>
      </div>

      {/* Names */}
      <div className="text-center mb-6">
        <h2
          className="text-4xl font-serif text-gray-800"
          style={{ fontFamily: "Georgia, serif" }}>
          Lidija & Kruno
        </h2>
      </div>

      {/* Date */}
      <div className="text-center mb-12">
        <p className="text-2xl text-gray-600 font-medium">18.06.2025.</p>
      </div>

      {/* Upload More Button */}
      <div className="text-center">
        <Link
          to="/upload"
          className="inline-block bg-white border-2 border-gray-800 text-gray-800 font-medium py-4 px-12 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-200 text-xl">
          Upload more
        </Link>
      </div>
    </div>
  );
}
