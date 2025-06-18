import { imagesApi } from "@/hooks/api/query-keys/images";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

class SlideshowQueue {
  private images: string[] = [];
  private queue: string[] = [];

  constructor(initialImages: string[] = []) {
    this.images = [...initialImages];
    this.queue = [...initialImages];
  }

  updateImages(newImages: string[]) {
    const newImageCount = newImages.length - this.images.length;
    const addedImages = newImages.slice(-newImageCount);
    this.queue.unshift(...addedImages);

    this.images = [...newImages];

    return;
  }

  next(): string | null {
    if (this.queue.length === 0) {
      if (this.images.length === 0) {
        return null;
      }
      this.queue = [...this.images];
    }

    return this.queue.shift() || null;
  }

  getCurrentImage(): string | null {
    if (this.queue.length === 0) {
      if (this.images.length === 0) {
        return null;
      }
      this.queue = [...this.images];
    }
    return this.queue[0] || null;
  }

  getNextImage(): string | null {
    return this.queue[1] || this.images[0] || null;
  }

  hasImages(): boolean {
    return this.images.length > 0;
  }

  getImageCount(): number {
    return this.images.length;
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
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Screen Wake Lock functionality
  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        console.log("Screen wake lock activated");
      }
    } catch (err) {
      console.error("Failed to activate screen wake lock:", err);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log("Screen wake lock released");
      } catch (err) {
        console.error("Failed to release screen wake lock:", err);
      }
    }
  };

  // Handle visibility change to re-request wake lock if needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        isStarted &&
        document.visibilityState === "visible" &&
        !wakeLockRef.current
      ) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isStarted]);

  // Clean up wake lock on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) {
      return;
    }
    console.log("Updating images", images);
    queueRef.current.updateImages(images.map((image) => image.url));
    if (!currentImage && queueRef.current.hasImages()) {
      const firstImage = queueRef.current.getCurrentImage();
      setCurrentImage(firstImage);
    }
  }, [images]);

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

  const startSlideshow = async () => {
    setIsStarted(true);
    await requestWakeLock(); // Request wake lock when starting slideshow
    if (queueRef.current.hasImages()) {
      const firstImage = queueRef.current.getCurrentImage();
      setCurrentImage(firstImage);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
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
          minHeight: "100dvh",
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
          minHeight: "100dvh",
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
          minHeight: "100dvh",
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
          minHeight: "100dvh",
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

  const nextImage = queueRef.current.getNextImage();

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
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
      {nextImage && nextImage !== currentImage && (
        <img
          src={nextImage}
          alt="Next slideshow image"
          style={{
            display: "none",
          }}
        />
      )}
    </div>
  );
}
