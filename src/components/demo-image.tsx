import Image from "next/image";

type DemoImageProps = {
  src: string;
  alt: string;
  isDemo: boolean;
  eager?: boolean;
};

export function DemoImage({ src, alt, isDemo, eager = false }: DemoImageProps) {
  return (
    <div className="demo-image">
      <Image
        alt={alt}
        fill
        loading={eager ? "eager" : undefined}
        quality={90}
        sizes="(max-width: 760px) 100vw, 60vw"
        src={src}
      />
      {isDemo && <span className="demo-image-label">Foto de demostración</span>}
    </div>
  );
}