import Image from "next/image";

type DemoImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function DemoImage({ src, alt, priority = false }: DemoImageProps) {
  return (
    <div className="demo-image">
      <Image
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 760px) 100vw, 60vw"
        src={src}
      />
      <span className="demo-image-label">Foto de demostración</span>
    </div>
  );
}