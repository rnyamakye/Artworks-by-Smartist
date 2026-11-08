"use client";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { SocialEmbed } from "@/ui/SocialEmbed";

interface ProductItem {
  _id?: number | string;
  id?: string;
  name?: string;
  images: string[];
  social_post_url?: string | null;
  [key: string]: any;
}

interface Props {
  item: ProductItem;
}

const ProductCard = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1">
      <div className="w-full h-60 relative group rounded-lg overflow-hidden">
        <img
          onClick={open}
          src={item?.images[0]}
          alt=""
          className="w-full h-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none rounded-lg" />
      </div>

      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-50 focus:outline-none"
          onClose={close}
        >
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full backdrop-blur-md items-center justify-center p-4 z-50">
              <TransitionChild
                enter="ease-in duration-300"
                enterFrom="opacity-0 transform-[scale(90%)]"
                enterTo="opacity-100 transform-[scale(100%)] "
                leave="ease-in duration-300 -translate-y-20"
                leaveFrom="opacity-100 transform-[scale(100%)] -translate-y-10"
                leaveTo="opacity-0 transform-[scale(50%)] -translate-y-10"
              >
                <DialogPanel className="w-full max-w-lg rounded-xl bg-black/10  z-50 p-6">
                  <div>
                    <img
                      src={item?.images[0]}
                      className="w-full object-cover rounded-lg h-full md:h-[500px] lg:h-[600px]"
                    />
                  </div>
                  {item?.social_post_url && (
                    <div className="mt-4">
                      <SocialEmbed url={item.social_post_url} />
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProductCard;
