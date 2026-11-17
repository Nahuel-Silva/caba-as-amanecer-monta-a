"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePanOnHover } from "@/components/use-pan-on-hover";
import { useUi } from "@/i18n/locale-context";

type GalleryImage = { src: string; alt: string; isDemo: boolean };

/** Con panOnHover, la tira de fotos se desliza siguiendo el mouse. */
export function PhotoGallery({ images, panOnHover = false }: { images: GalleryImage[]; panOnHover?: boolean }) {
  const ui = useUi();
  const t = ui.gallery;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);
  const followMouse = usePanOnHover<HTMLDivElement>();
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
      <div className="gallery-grid" onMouseMove={panOnHover ? followMouse : undefined}>
        {images.map((image, index) => (
          <button
            aria-label={t.enlarge(index + 1, image.isDemo)}
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
                quality={90}
                sizes="(max-width: 760px) 100vw, 40vw"
                src={image.src}
              />
              {image.isDemo && (
                <span aria-hidden="true" className="demo-image-label">
                  {ui.demoPhoto}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <dialog
          aria-label={t.dialog(images[activeIndex].isDemo)}
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
              aria-label={t.closeLabel}
              className="gallery-controls gallery-close"
              onClick={() => setActiveIndex(null)}
              type="button"
            >
              {t.close}
            </button>
            <div className="gallery-dialog-image">
              <Image
                alt={images[activeIndex].alt}
                fill
                quality={90}
                sizes="(max-width: 1148px) 100vw, 1100px"
                src={images[activeIndex].src}
              />
            </div>
            <div className="gallery-controls">
              <button onClick={() => move(-1)} type="button">
                {t.previous}
              </button>
              <span>
                {t.counter(activeIndex + 1, images.length, images[activeIndex].isDemo)}
              </span>
              <button onClick={() => move(1)} type="button">
                {t.next}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}