import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const newClassName = twMerge(
    "flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-5",
    className
  );
  return <main className={newClassName}>{children}</main>;
};

export default Container;
