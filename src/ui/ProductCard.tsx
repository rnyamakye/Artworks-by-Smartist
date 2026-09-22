"use client";
import { ProductProps } from "../../type";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild
} from "@headlessui/react";

interface Props {
  item: ProductProps;
}

const ProductCard = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <div className="rounded-xl p-2 bg-white shadow-sm overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1">
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
                  <div className="mt-4">
                    {/* <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={close}
                    >
                      Got it, thanks!
                    </Button> */}
                  </div>
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
