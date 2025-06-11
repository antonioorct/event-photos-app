import { Link } from "react-router-dom";

export default function UploadComplete() {
  return (
    <div className="w-full h-dvh bg-white flex flex-col items-center justify-center py-6 px-4">
      {/* Thank you message */}
      <div className="text-center mb-8 flex flex-col items-center justify-center h-full">
        <h1
          className="text-6xl font-serif text-gray-800 mb-8"
          style={{ fontFamily: "Times New Roman, serif" }}>
          Hvala!
        </h1>

        <div className="mb-8">
          <p className="text-gray-800 text-xl leading-relaxed mb-4">
            Vaše slike će se prikazati na ekranima!
          </p>
          <p className="text-gray-800 text-xl leading-relaxed">
            Hvala Vam što ste uljepšali naše slavlje!
          </p>
        </div>
      </div>

      <div className="text-center mb-2">
        <h1
          className="text-[26px] font-bold"
          style={{ fontFamily: "Montserrat, sans-serif" }}>
          Lidija&Kruno Wedding
        </h1>
      </div>

      {/* Date */}
      <div className="text-center mb-6">
        <p className="text-lg font-bold">18.06.2025</p>
      </div>

      <div className="text-center w-full">
        <Link
          to="/images"
          className="w-full flex justify-center items-center border-2 border-black text-black font-semibold py-4 px-12 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-lg mb-3">
          Povratak u galeriju
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
      {/* Upload Button */}
      <div className="text-center w-full">
        <Link
          to="/"
          className="w-full flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg">
          Upload More
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
