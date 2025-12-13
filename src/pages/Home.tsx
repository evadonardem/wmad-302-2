import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="page-transition">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
