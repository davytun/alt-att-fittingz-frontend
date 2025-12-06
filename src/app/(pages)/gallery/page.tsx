"use client";

import { useStyleImagesCount } from "@/hooks/api/use-styles";
import { GalleryGrid } from "./gallery-grid";

export default function GalleryPage() {
  const { data: countData } = useStyleImagesCount();

  return (
    <div>
      <section className="relative overflow-hidden rounded-b-[3rem] bg-[#0F4C75] px-6 py-12 text-white shadow-sm md:px-12">
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-2xl font-bold md:text-3xl">Gallery</h1>
          {countData && (
            <div className="text-sm text-gray-600">
              <p className="text-sm uppercase tracking-[0.2em] text-white/80">
                <span className="font-semibold mr-2">{countData.count}</span>
                {countData.count === 1 ? "Inspiration" : "Inspirations"}
              </p>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute -right-16 -bottom-20 h-56 w-56 rounded-full bg-white/10 md:-right-6 md:-bottom-16" />
      </section>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <GalleryGrid />
      </div>
    </div>
  );
}
