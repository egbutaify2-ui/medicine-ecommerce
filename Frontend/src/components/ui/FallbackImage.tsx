"use client";
import { useState } from "react";

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export function FallbackImage({ src, alt = "", fallbackSrc = "/images/medicine-placeholder.svg", onError, ...props }: Props) {
  const [hasFailed, setHasFailed] = useState(false);
  return (
    <img
      {...props}
      src={!hasFailed && src ? src : fallbackSrc}
      alt={alt}
      onError={(event) => {
        if (!hasFailed) setHasFailed(true);
        onError?.(event);
      }}
    />
  );
}
