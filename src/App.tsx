// App.tsx
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import TrustedBrands from "./components/TrustedBrands";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/Services/ServicesSection";
import TestimonialsSection from "./components/Testimonials/TestimonialsSection";
import GallerySection from "./components/Gallery/GallerySection";
import PricingSection from "./components/PricingSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import { PreloaderWrapper } from "./components/Preloader.tsx";


export default function App() {
  return (
    <PreloaderWrapper>
      <CustomCursor />
      <Navbar />

      <section id="home"         className="scroll-mt-20"><Hero /></section>
      <section id="brands"       className="scroll-mt-20"><TrustedBrands /></section>
      <section id="about"        className="scroll-mt-20"><AboutSection /></section>
      <section id="services"     className="scroll-mt-20"><ServicesSection /></section>
      <section id="gallery"      className="scroll-mt-20"><GallerySection /></section>
      <section id="pricing"      className="scroll-mt-20"><PricingSection /></section>
      <section id="testimonials" className="scroll-mt-20"><TestimonialsSection /></section>
      <section id="contact"      className="scroll-mt-20"><ContactSection /></section>

      <Footer />
    </PreloaderWrapper>
  );
}
