"use client";
import { ProductProps } from "../../type";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Props {
  item: ProductProps;
}

const ShopProductCard = ({ item }: Props) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="rounded-xl p-3 bg-white shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="w-full h-48 relative group rounded-lg overflow-hidden bg-gray-100">
        <img
          src={item?.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!item.is_stock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 mt-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-3 line-clamp-2">{item.overview || item.category}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="font-bold text-lg text-gray-900">
            ${item.regular_price?.toFixed(2)}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!item.is_stock}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;
