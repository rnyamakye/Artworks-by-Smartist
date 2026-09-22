"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ProductProps } from "@/../type";
import Loading from "@/ui/Loading";
import Container from "@/ui/Container";
import ShopProductCard from "@/ui/ShopProductCard";

const Shop = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching data,", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div className="flex flex-col gap-10 md:py-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-gray-900">
                Artwork Shop
              </h1>
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                Purchase ready-made original artworks directly from our collection. Each piece is unique and ready to ship.
              </p>
              
              {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  No products available in the shop right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                  {products.map((item: ProductProps) => (
                    <ShopProductCard item={item} key={item?.id || item?._id} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Shop;
