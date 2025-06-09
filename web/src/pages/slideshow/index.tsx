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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: "20px",
          }}>
          Učitavanje fotografija...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            color: "#ef4444",
            fontSize: "20px",
          }}>
          Greška pri učitavanju fotografija
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: "20px",
          }}>
          Nema fotografija za prikaz
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}>
        <div
          style={{
            maxWidth: "448px",
            width: "100%",
            backgroundColor: "#1f1f1f",
            borderRadius: "8px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            padding: "32px",
          }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "32px",
            }}>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "8px",
              }}>
              Slideshow postavke
            </h1>
            <p
              style={{
                color: "#d1d5db",
              }}>
              Prilagodite postavke prije početka
            </p>
          </div>

          <div
            style={{
              marginBottom: "32px",
            }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#ffffff",
                marginBottom: "12px",
              }}>
              Trajanje razmaka između slika
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
              <input
                type="number"
                min="1"
                max="60"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                style={{
                  flex: "1",
                  padding: "8px 12px",
                  border: "1px solid #4b5563",
                  borderRadius: "6px",
                  outline: "none",
                  backgroundColor: "#374151",
                  color: "#ffffff",
                }}
              />
              <span
                style={{
                  color: "#d1d5db",
                  fontWeight: "500",
                }}>
                sekundi
              </span>
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                marginTop: "8px",
              }}>
              Standardno: 10 sekundi
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}>
            <button
              onClick={startSlideshow}
              style={{
                width: "100%",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontWeight: "600",
                padding: "12px 24px",
                borderRadius: "8px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }>
              Pokreni slideshow
            </button>

            <Link
              to="/"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                color: "#d1d5db",
                textDecoration: "none",
                transition: "color 0.2s",
              }}>
              ← Natrag na početnu
            </Link>
          </div>

          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              fontSize: "14px",
              color: "#9ca3af",
            }}>
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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <div
          style={{
            color: "#ffffff",
            fontSize: "20px",
          }}>
          Učitavanje fotografija...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <img
        src={currentImage}
        alt="Slideshow fotografija"
        style={{
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
