import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

type DemoImageProps = {
  src: string;
  alt: string;
  isDemo: boolean;
  eager?: boolean;
  locale?: Locale;
};

export function DemoImage({ src, alt, isDemo, eager = false, locale = "es" }: DemoImageProps) {
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
      {isDemo && <span className="demo-image-label">{ui[locale].demoPhoto}</span>}
    </div>
  );
}
