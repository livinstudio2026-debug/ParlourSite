import type { GalleryItem } from "./galleryTypes";
import GalleryCard from "./GalleryCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArtisanBlowout    from "../../assets/gallery/ArtisanBlowout.jpg";
import BridalGlow        from "../../assets/gallery/BridalGlow.jpg";
import ColourAlchemy     from "../../assets/gallery/ColourAlchemy.jpg";
import CystalNails       from "../../assets/gallery/CystalNails.jpg";
import GoldenHour        from "../../assets/gallery/GoldenHour.jpg";
import LuminousBase      from "../../assets/gallery/LuminousBase.jpg";
import SereneSanctuary   from "../../assets/gallery/SereneSanctuary.jpg";
import SignatureFacial   from "../../assets/gallery/SignatureFacial.jpg";
import SilkRitual        from "../../assets/gallery/SilkRitual.jpg";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   PRE-WARM THE BROWSER CACHE
   Fire all 9 fetches the instant this module loads — well before
   the user reaches the gallery. By the time the stagger timer
   fires for each card the pixels are already decoded in memory.
───────────────────────────────────────────────────────────── */
const ALL_GALLERY_SRCS = [
  BridalGlow, SignatureFacial, ArtisanBlowout, SereneSanctuary,
  CystalNails, ColourAlchemy, LuminousBase, GoldenHour, SilkRitual,
];

if (typeof window !== "undefined") {
  ALL_GALLERY_SRCS.forEach((src) => {
    if (!document.querySelector(`link[href="${src}"]`)) {
      const link = document.createElement("link");
      link.rel  = "preload";
      link.as   = "image";
      link.href = src;
      document.head.appendChild(link);
    }
    const img = new Image();
    img.src = src;
    img.decode?.().catch(() => {});
  });
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1, imageUrl: BridalGlow,
    title: "Bridal Glow",
    description: "Luxury HD bridal transformation with flawless finish and ethereal radiance.",
    category: "Bridal Makeup", cta: "View Service", size: "tall",
  },
  {
    id: 2, imageUrl: SignatureFacial,
    title: "Signature Facial",
    description: "Deep-cleansing luxury facial with rare botanical extracts.",
    category: "Skincare", cta: "Discover More", size: "normal",
  },
  {
    id: 3, imageUrl: ArtisanBlowout,
    title: "Artisan Blowout",
    description: "Voluminous, silky styling crafted by our master hair artists.",
    category: "Hair Styling", cta: "Book Session", size: "normal",
  },
  {
    id: 4, imageUrl: SereneSanctuary,
    title: "Serene Sanctuary",
    description: "An immersive spa atmosphere designed for total sensory renewal.",
    category: "Spa Ambience", size: "wide",
  },
  {
    id: 5, imageUrl: CystalNails,
    title: "Crystal Nails",
    description: "Precision nail artistry with bespoke luxury gel and crystal accents.",
    category: "Nail Art", cta: "Explore Designs", size: "normal",
  },
  {
    id: 6, imageUrl: ColourAlchemy,
    title: "Colour Alchemy",
    description: "Bespoke hair colour crafted for your unique skin tone and vision.",
    category: "Hair Colour", cta: "View Gallery", size: "tall",
  },
  {
    id: 7, imageUrl: LuminousBase,
    title: "Luminous Base",
    description: "Flawless foundation artistry for glass-skin perfection.",
    category: "Makeup", cta: "Book Artist", size: "normal",
  },
  {
    id: 8, imageUrl: GoldenHour,
    title: "Golden Hour",
    description: "Warm-toned editorial looks bathed in cinematic beauty light.",
    category: "Editorial", size: "normal",
  },
  {
    id: 9, imageUrl: SilkRitual,
    title: "Silk Ritual",
    description: "Restorative keratin treatment for salon-smooth, frizz-free hair.",
    category: "Hair Treatment", cta: "Learn More", size: "wide",
  },
];

/* ─────────────────────────────────────────────────────────────
   STAGGER CONFIG
   Cards are visible immediately as skeletons.
   Each image reveals after BASE + index × STEP ms.
   9 cards: 0 → 1040 ms total. Feels like a quick cascade.
───────────────────────────────────────────────────────────── */
const REVEAL_STEP_MS = 130;
const REVEAL_BASE_MS = 0;
const revealDelay = (i: number) => REVEAL_BASE_MS + i * REVEAL_STEP_MS;

export default function GalleryGrid() {
  return (
    <div className="w-full">

      {/* ══════════ DESKTOP: 3-col asymmetric grid ══════════ */}
      <div
        className="hidden lg:grid gap-4"
        style={{
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "300px 240px 270px 290px",
        }}
      >
        <div className="h-full" style={{ gridColumn: "1",     gridRow: "1 / 3" }}>
          <GalleryCard item={GALLERY_ITEMS[0]} index={0} loadDelay={revealDelay(0)} />
        </div>
        <div className="h-full" style={{ gridColumn: "2",     gridRow: "1" }}>
          <GalleryCard item={GALLERY_ITEMS[1]} index={1} loadDelay={revealDelay(1)} />
        </div>
        <div className="h-full" style={{ gridColumn: "3",     gridRow: "1" }}>
          <GalleryCard item={GALLERY_ITEMS[2]} index={2} loadDelay={revealDelay(2)} />
        </div>
        <div className="h-full" style={{ gridColumn: "2 / 4", gridRow: "2" }}>
          <GalleryCard item={GALLERY_ITEMS[3]} index={3} loadDelay={revealDelay(3)} />
        </div>
        <div className="h-full" style={{ gridColumn: "1",     gridRow: "3" }}>
          <GalleryCard item={GALLERY_ITEMS[4]} index={4} loadDelay={revealDelay(4)} />
        </div>
        <div className="h-full" style={{ gridColumn: "2",     gridRow: "3" }}>
          <GalleryCard item={GALLERY_ITEMS[5]} index={5} loadDelay={revealDelay(5)} />
        </div>
        <div className="h-full" style={{ gridColumn: "3",     gridRow: "3 / 5" }}>
          <GalleryCard item={GALLERY_ITEMS[6]} index={6} loadDelay={revealDelay(6)} />
        </div>
        <div className="h-full" style={{ gridColumn: "1 / 3", gridRow: "4" }}>
          <GalleryCard item={GALLERY_ITEMS[7]} index={7} loadDelay={revealDelay(7)} />
        </div>
      </div>

      {/* ══════════ TABLET: 2-col grid ══════════ */}
      <div
        className="hidden sm:grid lg:hidden gap-4"
        style={{ gridTemplateColumns: "1fr 1fr" }}
      >
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[0]} index={0} loadDelay={revealDelay(0)} /></div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[1]} index={1} loadDelay={revealDelay(1)} /></div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[2]} index={2} loadDelay={revealDelay(2)} /></div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[3]} index={3} loadDelay={revealDelay(3)} /></div>
        <div style={{ gridColumn: "1 / 3", height: 240 }}>
          <GalleryCard item={GALLERY_ITEMS[4]} index={4} loadDelay={revealDelay(4)} />
        </div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[5]} index={5} loadDelay={revealDelay(5)} /></div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[6]} index={6} loadDelay={revealDelay(6)} /></div>
        <div style={{ gridColumn: "1 / 3", height: 240 }}>
          <GalleryCard item={GALLERY_ITEMS[7]} index={7} loadDelay={revealDelay(7)} />
        </div>
        <div style={{ height: 280 }}><GalleryCard item={GALLERY_ITEMS[8]} index={8} loadDelay={revealDelay(8)} /></div>
      </div>

      {/* ══════════ MOBILE: single-col stacked ══════════ */}
      <div className="flex flex-col gap-4 sm:hidden">
        {GALLERY_ITEMS.slice(0, 7).map((item, i) => (
          <div key={item.id} style={{ height: i === 0 || i === 3 ? 300 : 240 }}>
            <GalleryCard item={item} index={i} loadDelay={revealDelay(i)} />
          </div>
        ))}
      </div>

    </div>
  );
}
