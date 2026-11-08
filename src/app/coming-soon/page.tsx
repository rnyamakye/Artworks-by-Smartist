import { ComingSoon } from "@/ui/ComingSoon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | Smartist Artworks",
  description: "Exciting new artworks, tutorials, and collector features are launching soon.",
};

export default function ComingSoonPage() {
  return (
    <ComingSoon
      title="Something Extraordinary is in the Works"
      subtitle="We are preparing an exclusive experience with new original artworks, exhibition updates, and store features. Stay tuned for the official launch!"
      badge="Coming Soon"
      showShopHighlights={true}
    />
  );
}

