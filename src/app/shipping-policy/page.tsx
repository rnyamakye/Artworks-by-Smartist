import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function ShippingPolicy() {
  const { data } = await supabase.from("policies").select("*").eq("slug", "shipping-policy").single();

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-24 px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
        {data?.title || "Shipping Policy"}
      </h1>
      
      {data?.content ? (
        <div 
          className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base md:text-lg"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      ) : (
        <div className="text-gray-700 leading-relaxed text-base md:text-lg">
          <p>Policy not found.</p>
        </div>
      )}
    </div>
  );
}
