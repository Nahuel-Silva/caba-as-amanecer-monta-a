"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type GalleryImage = { src: string; alt: string };

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? null : (index + 1) % images.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null ? null : (index - 1 + images.length) % images.length,
        );
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeIndex, images.length]);

  function move(direction: number) {
    setActiveIndex((index) =>
      index === null ? null : (index + direction + images.length) % images.length,
    );
  }

  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <button
            aria-label={`Ampliar foto de demostración ${index + 1}`}
            className="gallery-item"
            key={image.src}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <span className="demo-image">
              <Image
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 760px) 100vw, 40vw"
                src={image.src}
              />
              <span className="demo-image-label">Foto de demostración</span>
            </span>
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <div
          aria-label="Galería de fotos de demostración"
          aria-modal="true"
          className="gallery-dialog"
          onClick={() => setActiveIndex(null)}
          role="dialog"
        >
          <div className="gallery-dialog-content" onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Cerrar galería"
              className="gallery-controls gallery-close"
              onClick={() => setActiveIndex(null)}
              type="button"
            >
              Cerrar
            </button>
            <div className="gallery-dialog-image">
              <Image
                alt={images[activeIndex].alt}
                fill
                priority
                sizes="100vw"
                src={images[activeIndex].src}
              />
            </div>
            <div className="gallery-controls">
              <button onClick={() => move(-1)} type="button">
                Anterior
              </button>
              <span>
                Foto de demostración {activeIndex + 1} de {images.length}
              </span>
              <button onClick={() => move(1)} type="button">
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}