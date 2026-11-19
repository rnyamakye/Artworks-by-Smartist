"use client";
import { useState } from "react";
import { siteConfig } from "@/config";

const faqData = [
  {
    question: "How do I commission a custom portrait or artwork?",
    answer:
      "You can request a custom commission through our Commission page or via WhatsApp. Simply share your reference photos, preferred dimensions, and deadline to receive a personalized quote.",
  },
  {
    question: "What materials and paper do you use?",
    answer:
      "Every piece is hand-drawn using artist-grade graphite and charcoal pencils on heavyweight, acid-free archival Strathmore Bristol paper, sealed with UV-protective fixative.",
  },
  {
    question: "How long does a commissioned drawing take?",
    answer:
      "Depending on the subject complexity and size, commissioned portraits typically take between 1 to 3 weeks. You will receive progress updates and photos along the way.",
  },
  {
    question: "How is the finished artwork packaged and delivered?",
    answer:
      "Artwork is carefully layered with glassine paper, secured between rigid backing boards, and sealed in weatherproof packaging to guarantee safe delivery.",
  },
  {
    question: "Where can I watch your drawing tutorials?",
    answer:
      "Explore free step-by-step drawing lessons and speed-drawings on our Tutorials page, and follow our daily creative process on TikTok and Instagram.",
  },
  {
    question: "How can I get in touch directly?",
    answer:
      `You can reach out anytime via our Contact page, message us on WhatsApp (${siteConfig.whatsappNumber}), or email us directly at ${siteConfig.contactEmail}.`,
  },
];

const FAQs = () => {
  // Track which accordion items are open (by index)
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (openIndexes.includes(index)) {
      // Close it
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      // Open it
      setOpenIndexes([...openIndexes, index]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 lg:py-24 px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqData.map(({ question, answer }, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-gray-300"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-left text-base md:text-lg font-medium text-gray-900">{question}</span>
                <svg
                  className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`px-6 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden bg-white ${
                  isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="pt-2 text-sm md:text-base leading-relaxed border-t border-gray-100">
                  {answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-gray-600 mt-12 text-center text-lg">
        Didn’t find your answer?{" "}
        <a href="/contact" className="text-gray-900 font-medium underline hover:text-gray-700 transition-colors">
          Contact us
        </a>
        .
      </p>
    </div>
  );
};

export default FAQs;


