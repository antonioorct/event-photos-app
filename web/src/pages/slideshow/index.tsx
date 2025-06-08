import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

class SlideshowQueue {
  private queue: string[] = [];
  private currentIndex: number = 0;
  private shownImages: Set<string> = new Set();

  constructor(initialImages: string[] = []) {
    this.queue = [...initialImages];
  }

  updateImages(newImages: string[]) {
    const unseenImages = newImages.filter((img) => !this.queue.includes(img));

    if (unseenImages.length === 0) {
      return false;
    }

    if (this.queue.length === 0) {
      this.queue = [...newImages];
      this.currentIndex = 0;
      return true;
    }

    const nextIndex = (this.currentIndex + 1) % this.queue.length;
    const beforeNext = this.queue.slice(0, nextIndex);
    const afterNext = this.queue.slice(nextIndex);

    this.queue = [...beforeNext, ...unseenImages, ...afterNext];

    return true;
  }

  next(): string | null {
    if (this.queue.length === 0) {
      return null;
    }

    const currentImage = this.queue[this.currentIndex];
    this.shownImages.add(currentImage);

    this.currentIndex = (this.currentIndex + 1) % this.queue.length;

    if (this.currentIndex === 0) {
      this.shownImages.clear();
    }

    return this.queue[this.currentIndex];
  }

  getCurrentImage(): string | null {
    if (this.queue.length === 0) {
      return null;
    }
    return this.queue[this.currentIndex];
  }

  hasImages(): boolean {
    return this.queue.length > 0;
  }

  getImageCount(): number {
    return this.queue.length;
  }
}

export default function Slideshow() {
  const {
    data: images,
    isLoading,
    error,
  } = useQuery({ ...imagesApi.all, refetchInterval: 5_000 });
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(10);
  const queueRef = useRef<SlideshowQueue>(new SlideshowQueue());

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }

    queueRef.current.updateImages(images);

    if (!currentImage && queueRef.current.hasImages()) {
      const firstImage = queueRef.current.getCurrentImage();
      setCurrentImage(firstImage);
    }
  }, [images, currentImage]);

  useEffect(() => {
    if (!isStarted || !queueRef.current.hasImages()) {
      return;
    }

    const timer = setInterval(() => {
      const nextImage = queueRef.current.next();
      setCurrentImage(nextImage);
    }, intervalSeconds * 1000);

    return () => clearInterval(timer);
  }, [isStarted, intervalSeconds]);

  const startSlideshow = () => {
    setIsStarted(true);
    if (queueRef.current.hasImages()) {
      const firstImage = queueRef.current.getCurrentImage();
      setCurrentImage(firstImage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje fotografija...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl">
          Greška pri učitavanju fotografija
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Nema fotografija za prikaz</div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Slideshow postavke
            </h1>
            <p className="text-gray-600">Prilagodite postavke prije početka</p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Trajanje razmaka između slika
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                max="60"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600 font-medium">sekundi</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Standardno: 10 sekundi</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={startSlideshow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors duration-200">
              Pokreni slideshow
            </button>

            <Link
              to="/"
              className="block w-full text-center text-gray-600 hover:text-gray-800 transition-colors duration-200">
              ← Natrag na početnu
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            {queueRef.current.getImageCount()}{" "}
            {queueRef.current.getImageCount() === 1
              ? "fotografija"
              : "fotografija"}{" "}
            za prikaz
          </div>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje fotografija...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <img
        src={currentImage}
        alt="Slideshow fotografija"
        className="h-full object-contain"
      />
    </div>
  );
}
