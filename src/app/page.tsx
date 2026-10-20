import HeroSlider from "@/components/home/HeroSlider";
import FeatureBar from "@/components/home/FeatureBar";
import { FeaturedProducts, MobileApp, Newsletter, PromoBanners, ShopByCategory } from "@/components/home/HomeSections";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeatureBar />
      <ShopByCategory />
      <PromoBanners />
      <FeaturedProducts />
      <Newsletter />
      <MobileApp />
    </>
  );
}
