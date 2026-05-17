
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PackageBookingModal from "./PackageBookingModal.tsx";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   Color tokens  (mirrors Hero.tsx)
───────────────────────────────────────────── */
const C = {
  pink:     "#E75480",
  roseGold: "#D4AFB9",
  cream:    "#FDF6F0",
  gold:     "#D4AF37",
} as const;

/* ─────────────────────────────────────────────
   Package data
───────────────────────────────────────────── */
interface Package {
  id:          string;
  icon:        string;
  title:       string;
  tagline:     string;
  price:       string;   // formatted e.g. "4,999"
  services:    string[];
  featured:    boolean;
  accentColor: string;
  glowRgb:     string;   // "r,g,b"
}

const PACKAGES: Package[] = [
  {
    id:          "essential",
    icon:        "✦",
    title:       "Essential Glow",
    tagline:     "Your everyday ritual of radiance",
    // Hair Spa ₹2,200 + Nail Art ₹1,200 + Hair Styling ₹1,800 → ₹4,999
    price:       "4,999",
    services:    [
      "Hair Wash & Conditioning",
      "Mini Glow Facial",
      "Basic Makeup Application",
      "Nail Cleanup & Polish",
    ],
    featured:    false,
    accentColor: C.roseGold,
    glowRgb:     "212,175,185",
  },
  {
    id:          "bridal",
    icon:        "♛",
    title:       "Bridal Luxury",
    tagline:     "For the most important day of your life",
    // Bridal Makeup ₹8,500 + Hair Styling ₹1,800 + Luxury Facial ₹4,200 + Nail Art ₹1,200 + Saree Draping → ₹16,999
    price:       "16,999",
    services:    [
      "HD Bridal Makeup",
      "Luxury Hairstyling",
      "Saree Draping",
      "Luxury Facial",
      "Nail Art & Design",
    ],
    featured:    true,
    accentColor: C.pink,
    glowRgb:     "231,84,128",
  },
  {
    id:          "spa",
    icon:        "◈",
    title:       "Spa Escape",
    tagline:     "Surrender to total sensory restoration",
    // Spa Therapy ₹5,500 + Aromatherapy ₹2,800 → ₹7,999
    price:       "7,999",
    services:    [
      "Full Body Spa Therapy",
      "Aromatherapy Session",
      "Deep Head Massage",
      "Relaxation & Scalp Ritual",
    ],
    featured:    false,
    accentColor: C.gold,
    glowRgb:     "212,175,55",
  },
  {
    id:          "royal",
    icon:        "⟡",
    title:       "Royal Transformation",
    tagline:     "Complete opulence from head to soul",
    // Bridal Makeup ₹8,500 + Hair Coloring ₹3,500 + Keratin ₹6,500 + Spa ₹5,500 + Skin Treatment ₹3,800 → ₹24,999
    price:       "24,999",
    services:    [
      "Premium Bridal Makeup",
      "Hair Coloring & Toning",
      "Keratin Treatment",
      "Luxury Spa Therapy",
      "Advanced Skin Treatment",
      "Personalized Consultation",
    ],
    featured:    false,
    accentColor: C.cream,
    glowRgb:     "253,246,240",
  },
];

/* ═══════════════════════════════════════════════
   PARTICLE CANVAS  (identical engine to Hero.tsx)
═══════════════════════════════════════════════ */
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const resize = () => { cv.width=cv.offsetWidth; cv.height=cv.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const ctx = cv.getContext("2d")!;
    const COLS=[{r:231,g:84,b:128},{r:212,g:175,b:185},{r:212,g:175,b:55},{r:253,g:246,b:240}];
    type P={x:number;y:number;vx:number;vy:number;r:number;alpha:number;baseAlpha:number;color:{r:number;g:number;b:number};drift:number;driftOffset:number;t:number;fadeTopY:number};
    const pts:P[]=[];
    const spawn=(sy?:number)=>{
      const c=COLS[Math.floor(Math.random()*COLS.length)];
      const rnd=Math.random();
      const ftf=rnd<0.65?0.40+Math.random()*0.20:rnd<0.90?0.15+Math.random()*0.25:Math.random()*0.15;
      const ba=Math.random()*0.32+0.13;
      pts.push({x:Math.random()*cv.width,y:sy??cv.height+Math.random()*40,vx:(Math.random()-0.5)*0.5,vy:-(Math.random()*0.9+0.35),r:Math.random()*2.0+0.6,alpha:ba,baseAlpha:ba,color:c,drift:Math.random()*0.05+0.02,driftOffset:Math.random()*Math.PI*2,t:0,fadeTopY:cv.height*ftf});
    };
    for(let i=0;i<18;i++) spawn(Math.random()*(cv.height+200)-200);
    let fr=0,raf=0;
    const tick=()=>{
      raf=requestAnimationFrame(tick); ctx.clearRect(0,0,cv.width,cv.height);
      if(++fr%6===0&&Math.random()<0.65) spawn();
      for(let i=pts.length-1;i>=0;i--){
        const p=pts[i]; p.t+=0.04; p.x+=p.vx+Math.sin(p.t*p.drift+p.driftOffset)*0.6; p.y+=p.vy;
        const tr=cv.height-p.fadeTopY,dt=p.y-p.fadeTopY,fz=tr*0.35;
        p.alpha=dt<fz?p.baseAlpha*Math.max(0,dt/fz):p.baseAlpha;
        if(p.alpha<=0.006||p.y<p.fadeTopY-10){pts.splice(i,1);continue;}
        const {r,g,b}=p.color;
        const grd=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
        grd.addColorStop(0,`rgba(${r},${g},${b},${(p.alpha*0.8).toFixed(3)})`);
        grd.addColorStop(0.5,`rgba(${r},${g},${b},${(p.alpha*0.25).toFixed(3)})`);
        grd.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${Math.min(p.alpha*1.5,1).toFixed(3)})`;ctx.fill();
        if(p.r>1.6){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.t*0.7);ctx.globalAlpha=p.alpha*0.5;ctx.strokeStyle=`rgba(${r},${g},${b},1)`;ctx.lineWidth=0.6;for(let a=0;a<4;a++){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,p.r*2.8);ctx.stroke();ctx.rotate(Math.PI/2);}ctx.restore();}
      }
    };
    tick();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex:3}}/>;
}

/* ═══════════════════════════════════════════════
   PREMIUM BADGE
═══════════════════════════════════════════════ */
function PremiumBadge() {
  return (
    <div
      className="relative flex items-center gap-[5px] rounded-full px-[14px] py-[5px] overflow-hidden whitespace-nowrap"
      style={{
        background: "linear-gradient(135deg,#E75480 0%,#c0376a 55%,#E75480 100%)",
        backgroundSize:"200% 100%",
        boxShadow:  "0 0 22px rgba(231,84,128,0.62),0 2px 10px rgba(0,0,0,0.45)",
        color:      "#fff",
        fontFamily: "'Jost',sans-serif",
        fontSize:   "0.59rem",
        fontWeight: 600,
        letterSpacing:"0.17em",
        textTransform:"uppercase",
        animation:"badgeFloat 3.5s ease-in-out infinite",
      }}
    >
      <span className="absolute inset-0" style={{background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.24) 50%,transparent 70%)",animation:"shimmerSweep 2.4s linear infinite"}}/>
      <span className="relative z-10">✦ Most Popular ✦</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LUXURY DIVIDER
═══════════════════════════════════════════════ */
function LuxuryDivider({ color }: { color:string }) {
  return (
    <div className="flex items-center gap-3 my-[18px]">
      <div className="h-px flex-1" style={{background:`linear-gradient(to right,transparent,${color}44)`}}/>
      <span style={{color,fontSize:"0.42rem",opacity:0.8,letterSpacing:"4px"}}>✦ ✦ ✦</span>
      <div className="h-px flex-1" style={{background:`linear-gradient(to left,transparent,${color}44)`}}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SERVICE ROW
═══════════════════════════════════════════════ */
function ServiceItem({ label, accent }:{ label:string; accent:string }) {
  return (
    <div className="flex items-start gap-[9px]">
      <div
        className="flex-shrink-0 mt-[2px] rounded-full flex items-center justify-center"
        style={{width:16,height:16,background:`rgba(${accent === C.roseGold?"212,175,185":accent===C.pink?"231,84,128":accent===C.gold?"212,175,55":"253,246,240"},0.12)`,border:`1px solid ${accent}40`}}
      >
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <span style={{fontFamily:"'Jost',sans-serif",fontSize:"0.74rem",fontWeight:300,color:"rgba(253,246,240,0.62)",letterSpacing:"0.025em",lineHeight:1.45}}>
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PRICING CARD
   Key layout rules for equal heights:
     • motion.div  → display:flex, flexDirection:column  (grid cell)
     • inner wrap  → flex:1, display:flex, flexDirection:column
     • card body   → flex:1, display:flex, flexDirection:column
     • service list→ flex:1  (absorbs extra space)
     • CTA button  → always at bottom, no margin auto tricks needed
═══════════════════════════════════════════════ */
function PricingCard({ pkg, index, onChoose }:{ pkg:Package; index:number; onChoose:(pkg:Package)=>void }) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onEnter = () => {
    setHovered(true);
    if (cardRef.current)
      gsap.to(cardRef.current, { y:-9, scale:1.016, duration:0.42, ease:"power2.out" });
    if (shimmerRef.current)
      gsap.fromTo(shimmerRef.current,
        { x:"-115%", opacity:1 },
        { x:"115%",  opacity:1, duration:0.72, ease:"power1.inOut" }
      );
  };
  const onLeave = () => {
    setHovered(false);
    if (cardRef.current)
      gsap.to(cardRef.current, { y:0, scale:1, duration:0.48, ease:"power2.out" });
  };

  const ga = hovered ? (pkg.featured?"0.50":"0.32") : (pkg.featured?"0.26":"0.08");

  return (
    <motion.div
      initial={{ opacity:0, y:52 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, margin:"-60px" }}
      transition={{ duration:0.72, delay:index*0.11, ease:[0.22,1,0.36,1] }}
      /* flex column so this grid cell stretches to row height */
      style={{ display:"flex", flexDirection:"column" }}
    >
      {/* wrapper that holds the badge + card, fills cell height */}
      <div style={{ position:"relative", flex:1, display:"flex", flexDirection:"column" }}>

        {/* THE CARD — flex:1 fills wrapper */}
        <div
          ref={cardRef}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{
            flex:             1,
            display:          "flex",
            flexDirection:    "column",
            position:         "relative",
            overflow:         "visible",
            cursor:           "default",
            borderRadius:     "22px",
            background:       pkg.featured ? "rgba(30,10,18,0.90)" : "rgba(15,6,11,0.78)",
            backdropFilter:   "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border:           `1px solid rgba(${pkg.glowRgb},${pkg.featured?"0.42":"0.20"})`,
            boxShadow:        [
              "0 26px 68px rgba(0,0,0,0.55)",
              "inset 0 1px 0 rgba(255,255,255,0.042)",
              `0 0 52px rgba(${pkg.glowRgb},${ga})`,
            ].join(", "),
            transition:       "box-shadow 0.42s ease, border-color 0.35s ease",
            padding:          "32px 24px 24px",
          }}
        >
          {/* Badge floats above the card's top edge, centred */}
          {pkg.featured && (
            <div style={{ position:"absolute", top:-18, left:0, right:0, display:"flex", justifyContent:"center", zIndex:20, pointerEvents:"none" }}>
              <PremiumBadge />
            </div>
          )}
          {/* top accent bar */}
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:"2px",
            borderRadius:"22px 22px 0 0",
            background: pkg.featured
              ? `linear-gradient(90deg,transparent,${C.pink} 28%,${C.gold} 72%,transparent)`
              : `linear-gradient(90deg,transparent,rgba(${pkg.glowRgb},0.7) 50%,transparent)`,
            opacity: hovered ? 1 : 0.62,
            transition:"opacity 0.35s ease",
            pointerEvents:"none",
          }}/>

          {/* corner accent — top right */}
          <div style={{
            position:"absolute", top:13, right:13,
            width:28, height:28, pointerEvents:"none",
            borderTop:   `1px solid rgba(${pkg.glowRgb},0.25)`,
            borderRight: `1px solid rgba(${pkg.glowRgb},0.25)`,
            borderRadius:"0 7px 0 0",
          }}/>

          {/* shimmer sweep — clipped to card bounds via inner overflow:hidden wrapper */}
          <div style={{ position:"absolute", inset:0, borderRadius:"22px", overflow:"hidden", pointerEvents:"none", zIndex:10 }}>
            <div
              ref={shimmerRef}
              style={{
                position:"absolute", inset:0,
                background:`linear-gradient(105deg,transparent 28%,rgba(${pkg.glowRgb},0.11) 50%,transparent 72%)`,
                transform:"translateX(-115%)",
              }}
            />
          </div>

          {/* ── ICON ── */}
          <div style={{position:"relative", marginBottom:18}}>
            <div style={{
              display:"inline-flex", alignItems:"center", justifyContent:"center",
              width:46, height:46, borderRadius:13,
              background:`rgba(${pkg.glowRgb},0.10)`,
              border:`1px solid rgba(${pkg.glowRgb},0.30)`,
              fontSize:"1.35rem", color:pkg.accentColor, fontFamily:"serif",
              boxShadow:`0 0 ${hovered?20:9}px rgba(${pkg.glowRgb},0.32)`,
              transition:"box-shadow 0.38s ease",
            }}>
              {pkg.icon}
            </div>
            <div style={{
              position:"absolute", top:-3, left:-3, width:16, height:16,
              borderRadius:"50%", pointerEvents:"none",
              background:`radial-gradient(circle,rgba(${pkg.glowRgb},0.45) 0%,transparent 70%)`,
              filter:"blur(4px)",
              animation:`orbFloat ${4+index*0.7}s ease-in-out ${index*0.4}s infinite`,
            }}/>
          </div>

          {/* ── TITLE ── */}
          <h3 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"1.42rem", fontWeight:300, lineHeight:1.12,
            color:C.cream, letterSpacing:"-0.01em", marginBottom:4,
          }}>
            {pkg.title}
          </h3>

          {/* ── TAGLINE ── */}
          <p style={{
            fontFamily:"'Jost',sans-serif",
            fontSize:"0.68rem", fontWeight:300,
            color:`rgba(${pkg.glowRgb},0.82)`,
            letterSpacing:"0.045em", fontStyle:"italic",
          }}>
            {pkg.tagline}
          </p>

          <LuxuryDivider color={pkg.accentColor}/>

          {/* ── PRICE ── */}
          <div style={{display:"flex", alignItems:"flex-end", gap:3, marginBottom:20}}>
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"0.9rem", fontWeight:300,
              color:`rgba(${pkg.glowRgb},0.72)`,
              marginBottom:7, letterSpacing:"0.02em",
            }}>
              ₹
            </span>
            <span style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"2.7rem", fontWeight:300, lineHeight:1,
              background: pkg.featured
                ? `linear-gradient(135deg,${C.cream} 0%,${C.pink} 45%,${C.gold} 100%)`
                : `linear-gradient(135deg,${C.cream} 0%,${pkg.accentColor} 100%)`,
              WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent",
              backgroundClip:"text",
              letterSpacing:"-0.02em",
            }}>
              {pkg.price}
            </span>
            <span style={{
              fontFamily:"'Jost',sans-serif",
              fontSize:"0.62rem", fontWeight:300,
              color:"rgba(253,246,240,0.28)",
              marginBottom:7, letterSpacing:"0.06em",
            }}>
              /session
            </span>
          </div>

          {/* ── SERVICES — flex:1 grows to fill card height ── */}
          <div style={{flex:1, display:"flex", flexDirection:"column", gap:8, marginBottom:22}}>
            {pkg.services.map(s => (
              <ServiceItem key={s} label={s} accent={pkg.accentColor}/>
            ))}
          </div>

          {/* ── CTA — always at bottom ── */}
          <button
            onClick={() => onChoose(pkg)}
            style={{
              width:"100%", position:"relative", overflow:"hidden",
              borderRadius:13,
              padding:"12px 18px",
              background: pkg.featured
                ? `linear-gradient(135deg,${C.pink} 0%,#c0376a 100%)`
                : "transparent",
              border: pkg.featured ? "none" : `1px solid rgba(${pkg.glowRgb},0.36)`,
              color:  pkg.featured ? "#fff" : pkg.accentColor,
              fontFamily:"'Jost',sans-serif",
              fontSize:"0.72rem", fontWeight:500,
              letterSpacing:"0.13em", textTransform:"uppercase",
              cursor:"pointer",
              boxShadow: pkg.featured
                ? `0 5px 24px rgba(${pkg.glowRgb},${hovered?"0.50":"0.30"})`
                : "none",
              transition:"all 0.30s ease",
            }}
            onMouseEnter={e => {
              if (pkg.featured) {
                gsap.to(e.currentTarget, {scale:1.03, duration:0.23, ease:"power2.out"});
              } else {
                (e.currentTarget as HTMLButtonElement).style.background=`rgba(${pkg.glowRgb},0.10)`;
                (e.currentTarget as HTMLButtonElement).style.borderColor=`rgba(${pkg.glowRgb},0.62)`;
              }
            }}
            onMouseLeave={e => {
              if (pkg.featured) {
                gsap.to(e.currentTarget, {scale:1, duration:0.25, ease:"power2.out"});
              } else {
                (e.currentTarget as HTMLButtonElement).style.background="transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor=`rgba(${pkg.glowRgb},0.36)`;
              }
            }}
          >
            {pkg.featured && (
              <span style={{
                position:"absolute", inset:0, pointerEvents:"none",
                background:"linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%)",
                animation:"shimmerSweep 3s linear infinite",
              }}/>
            )}
            <span style={{position:"relative",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
              {pkg.featured ? "Book Your Bridal Day" : "Choose Package"}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════ */
export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const orb1Ref    = useRef<HTMLDivElement>(null);
  const orb2Ref    = useRef<HTMLDivElement>(null);
  const orb3Ref    = useRef<HTMLDivElement>(null);

  const isInView = useInView(sectionRef, { once:true, margin:"-100px" });

  /* ── Modal state ── */
  const [modalOpen,    setModalOpen]    = useState(false);
  const [chosenPackage, setChosenPackage] = useState<Package | null>(null);

  const handleChoose = (pkg: Package) => {
    setChosenPackage(pkg);
    setModalOpen(true);
  };

  const floatOrb = (el:HTMLDivElement|null, dur:number, dy:number, delay:number) => {
    if (!el) return;
    gsap.to(el, { y:dy, x:dy*0.35, scale:1.05, duration:dur, delay, ease:"sine.inOut", yoyo:true, repeat:-1 });
  };

  useEffect(()=>{
    const ctx=gsap.context(()=>{
      floatOrb(orb1Ref.current, 16,-28, 0);
      floatOrb(orb2Ref.current, 20, 20,-4);
      floatOrb(orb3Ref.current, 13,-14,-2);
    }, sectionRef);
    return ()=>ctx.revert();
  },[]);

  /* set initial hidden state immediately — GSAP owns this, no inline opacity:0 needed */
  useEffect(()=>{
    if (!headerRef.current) return;
    gsap.set(Array.from(headerRef.current.children), { y:22, opacity:0 });
  },[]);

  useEffect(()=>{
    if (!isInView||!headerRef.current) return;
    gsap.to(
      Array.from(headerRef.current.children),
      { y:0, opacity:1, duration:0.85, stagger:0.10, ease:"power3.out", delay:0.1 }
    );
  },[isInView]);

  useEffect(()=>{
    if (!isInView||!lineRef.current) return;
    gsap.fromTo(lineRef.current,
      { scaleX:0, opacity:0 },
      { scaleX:1, opacity:1, duration:1.4, ease:"power3.out", delay:0.52 }
    );
  },[isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:    "linear-gradient(160deg,#0d0810 0%,#140a12 30%,#0f0a0d 65%,#0d0c09 100%)",
        paddingTop:    "80px",
        paddingBottom: "100px",
      }}
    >
      {/* radial base tints */}
      <div className="absolute inset-0 pointer-events-none" style={{zIndex:0,background:`
        radial-gradient(ellipse 70% 55% at 15% 80%,rgba(231,84,128,0.09) 0%,transparent 60%),
        radial-gradient(ellipse 55% 65% at 88% 20%,rgba(212,175,185,0.07) 0%,transparent 58%),
        radial-gradient(ellipse 40% 40% at 50% 50%,rgba(212,175,55,0.04) 0%,transparent 65%)
      `}}/>

      {/* ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{zIndex:1}}>
        <div ref={orb1Ref} className="absolute rounded-full" style={{width:600,height:600,top:-180,left:"-8%",background:"radial-gradient(circle,rgba(231,84,128,0.16) 0%,rgba(231,84,128,0.04) 55%,transparent 76%)",filter:"blur(90px)",willChange:"transform",transform:"translateZ(0)"}}/>
        <div ref={orb2Ref} className="absolute rounded-full" style={{width:500,height:500,bottom:-150,right:"0%",background:"radial-gradient(circle,rgba(212,175,185,0.13) 0%,transparent 65%)",filter:"blur(85px)",willChange:"transform",transform:"translateZ(0)"}}/>
        <div ref={orb3Ref} className="absolute rounded-full" style={{width:340,height:340,top:"42%",right:"22%",background:"radial-gradient(circle,rgba(212,175,55,0.07) 0%,transparent 68%)",filter:"blur(65px)",willChange:"transform",transform:"translateZ(0)"}}/>
      </div>

      {/* grain overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{zIndex:2,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",opacity:0.4}}/>

      <ParticleCanvas/>

      {/* ── CONTENT ── */}
      <div className="relative w-full max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14" style={{zIndex:10}}>

        {/* HEADER */}
        <div ref={headerRef} className="text-center mb-[48px]">

          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-[6px]"
              style={{
                background:"rgba(231,84,128,0.10)",
                border:"1px solid rgba(231,84,128,0.30)",
                color:C.roseGold,
                fontFamily:"'Jost',sans-serif",
                fontSize:"0.66rem", fontWeight:500,
                letterSpacing:"0.18em", textTransform:"uppercase",
              }}
            >
              <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{background:C.pink,boxShadow:`0 0 7px ${C.pink}`,animation:"pulseGlowPink 2s ease-in-out infinite"}}/>
              Luxury Packages
            </div>
          </div>

          <h2
            className="mx-auto"
            style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"clamp(2.1rem,4.0vw,3.8rem)",
              fontWeight:300, lineHeight:1.1,
              letterSpacing:"-0.01em",
              color:C.cream, maxWidth:680,
            }}
          >
            Beauty Packages{" "}
            <em style={{
              fontStyle:"italic",
              background:`linear-gradient(135deg,${C.pink} 0%,${C.roseGold} 48%,${C.gold} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              Designed For Every Occasion
            </em>
          </h2>

          {/* shimmer underline */}
          <div style={{display:"flex",justifyContent:"center",marginTop:18,marginBottom:20}}>
            <div
              ref={lineRef}
              style={{
                width:190, height:"1px",
                transformOrigin:"center",
                background:`linear-gradient(90deg,transparent,${C.pink} 28%,${C.gold} 72%,transparent)`,
                boxShadow:"0 0 14px rgba(231,84,128,0.38)",
                opacity:0, transform:"scaleX(0)",
              }}
            />
          </div>

          <p style={{
            fontFamily:"'Jost',sans-serif",
            fontSize:"0.88rem", fontWeight:300, lineHeight:1.88,
            color:"rgba(253,246,240,0.48)",
            maxWidth:540, margin:"0 auto",
          }}>
            Choose from our carefully curated beauty and wellness experiences
            crafted to elevate your confidence, elegance, and glow.
          </p>
        </div>

        {/* ── GRID — 4 cols desktop, 2 tablet, 1 mobile
               items-stretch + flex children = all cards same height ── */}
        <div className="pricing-grid" style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:"20px",
          alignItems:"stretch",
        }}>
          {PACKAGES.map((pkg,i) => (
            <PricingCard key={pkg.id} pkg={pkg} index={i} onChoose={handleChoose}/>
          ))}
        </div>

        {/* footnote */}
        <motion.p
          initial={{opacity:0,y:16}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:0.8,delay:0.5}}
          style={{
            textAlign:"center", marginTop:52,
            fontFamily:"'Jost',sans-serif",
            fontSize:"0.68rem", fontWeight:300,
            letterSpacing:"0.09em",
            color:"rgba(253,246,240,0.22)",
          }}
        >
          All packages include complimentary consultation &amp; aftercare guidance.
          <span style={{margin:"0 12px",color:"rgba(212,175,55,0.36)"}}>✦</span>
          Custom packages available on request.
        </motion.p>
      </div>

      {/* ── PACKAGE BOOKING MODAL ── */}
      {chosenPackage && (
        <PackageBookingModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultPackage={chosenPackage.title}
          accentColor={chosenPackage.accentColor}
          glowRgb={chosenPackage.glowRgb}
        />
      )}

      {/* KEYFRAMES */}
      <style>{`
        @keyframes pulseGlowPink {
          0%,100% { box-shadow:0 0 7px #E75480; }
          50%      { box-shadow:0 0 14px #E75480,0 0 22px rgba(231,84,128,0.4); }
        }
        @keyframes badgeFloat {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(-5px); }
        }
        @keyframes shimmerSweep {
          0%   { transform:translateX(-115%); }
          100% { transform:translateX(115%); }
        }
        @keyframes orbFloat {
          0%,100% { transform:translateY(0px)   translateX(0px)   scale(1); }
          33%      { transform:translateY(-6px)  translateX(3px)   scale(1.04); }
          66%      { transform:translateY(4px)   translateX(-4px)  scale(0.97); }
        }

        /* ── Responsive breakpoints ── */
        @media (max-width: 1024px) {
          .pricing-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 580px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
