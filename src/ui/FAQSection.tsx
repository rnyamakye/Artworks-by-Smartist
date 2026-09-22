"use client";
import React, { useState } from "react";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How can I purchase artwork from your site?",
    answer:
      "You can purchase artwork directly from our online shop. Simply add items to your cart and proceed to checkout."
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to many countries. Shipping fees and delivery times may vary."
  },
  {
    question: "Can I commission a custom pencil artwork?",
    answer:
      "Absolutely! Please contact us with your requirements and we’ll be happy to discuss your custom project."
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Please review our return policy for detailed information."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="md:w-[50rem] mx-auto mt-10">
      <h2 className="text-center text-xl font-semibold mb-6">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-200 bg-white ">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <button
              className="w-full text-left px-4 py-3 focus:outline-none flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  openIndex === idx
                    ? "rotate-180 duration-300 ease-in"
                    : "duration-300 ease-in"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === idx && (
              <div className="px-4 pb-3 text-gray-600 text-sm duration-300 ease-in max-w-xl ">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-500 mt-4">
        Can't find the answer you're looking for? Check our comprehensive FAQ
        section.
      </div>
      <div className="text-center mt-2">
        <Link
          href={"/faqs"}
          className="text-md hover:text-black text-gray-900 relative group overflow-hidden"
        >
          View All FAQs
          <span className="inline-flex w-full h-[1px] bg-black absolute bottom-0 left-0 transform -translate-x-[50%] scale-0 group-hover:translate-x-0 duration-300 group-hover:scale-100"></span>
        </Link>
      </div>
    </div>
  );
};

export default FAQSection;

