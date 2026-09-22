import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type SearchBarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SearchBar = ({ isOpen, onClose }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg z-50 pt-5">
      <div className="max-w-2xl mx-4 md:mx-auto">
        <div className="relative flex items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories..."
            className="w-[60%] h-3 py-4 pl-4 pr-12 border-1 rounded-2xl border-gray-200 focus:border-none  text-lg bg-transparent"
          />
          <button
            onClick={onClose}
            className="relative  right-10 p-2 rounded-full"
          >
            <X className="h-4 w-4 hover:scale-120 duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
