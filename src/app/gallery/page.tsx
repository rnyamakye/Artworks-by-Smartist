import { supabase } from "@/lib/supabase";
import GalleryClient, { Product } from "./GalleryClient";

export const revalidate = 0;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;

  let products: Product[] = [];
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      products = data;
    }
  } catch (err) {
    console.error("Error fetching gallery products on server:", err);
  }

  return (
    <GalleryClient
      initialProducts={products}
      initialCategory={resolvedParams?.category || "All"}
    />
  );
}
