import { Link } from "react-router-dom";

export default function Homepage() {
  return (
    <div className="h-dvh bg-gray-50 flex items-center justify-center text-center">
      <div className="w-full h-full bg-white flex flex-col items-center justify-center py-6 px-4">
        <div className="mb-auto pt-32 p-10 max-h-3/5">
          <img src="/assets/heart.png" alt="heart" className="h-full w-full" />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl text-gray-800 tracking-widest font-semibold">
            SAMO LJUBAV ♥
          </h2>
        </div>

        <div className="mb-2">
          <h1 className="text-[26px] font-bold">Lidija & Kruno Wedding</h1>
        </div>

        <div className="mb-6">
          <p className="text-lg font-bold">18.06.2025</p>
        </div>

        <div className="w-full">
          <Link
            to="/images"
            className="w-full flex justify-center items-center bg-black text-white font-semibold py-4 px-12 rounded-xl hover:bg-gray-800 transition-colors duration-200 text-lg">
            Take Photos
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
