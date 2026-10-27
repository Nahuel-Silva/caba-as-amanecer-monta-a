"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GalleryImage = { src: string; alt: string; isDemo: boolean };

export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) {
        triggerRef.current?.focus();
        wasOpen.current = false;
      }
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) return;

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>(".gallery-close")?.focus();
    wasOpen.current = true;

    function moveWithArrowKeys(event: KeyboardEvent) {
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

    window.addEventListener("keydown", moveWithArrowKeys);
    return () => {
      window.removeEventListener("keydown", moveWithArrowKeys);
      if (dialog.open) dialog.close();
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen, images.length]);

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
            aria-label={`Ampliar foto${image.isDemo ? " de demostración" : ""} ${index + 1}`}
            className="gallery-item"
            key={image.src}
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActiveIndex(index);
            }}
            type="button"
          >
            <span className="demo-image">
              <Image
                alt={image.alt}
                fill
                sizes="(max-width: 760px) 100vw, 40vw"
                src={image.src}
              />
              {image.isDemo && (
                <span aria-hidden="true" className="demo-image-label">
                  Foto de demostración
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <dialog
          aria-label={`Galería${images[activeIndex].isDemo ? " de fotos de demostración" : " de fotos"}`}
          aria-modal="true"
          className="gallery-dialog"
          onClose={() => setActiveIndex(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
          ref={dialogRef}
        >
          <div className="gallery-dialog-content">
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
                sizes="(max-width: 1148px) 100vw, 1100px"
                src={images[activeIndex].src}
              />
            </div>
            <div className="gallery-controls">
              <button onClick={() => move(-1)} type="button">
                Anterior
              </button>
              <span>
                Foto{images[activeIndex].isDemo ? " de demostración" : ""} {activeIndex + 1} de {images.length}
              </span>
              <button onClick={() => move(1)} type="button">
                Siguiente
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}