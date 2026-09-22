"use client";
import ContactForm from "@/ui/ContactForm";
import React from "react";
import BusinessHours from "@/ui/BusinessHours";
import LocationMap from "@/ui/LocationMap";
import FAQSection from "@/ui/FAQSection";
import Container from "@/ui/Container";

const Contact = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-12 md:py-20 w-full">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about our artwork, tutorials, or products? We'd love to hear from you.
        </p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-24 mb-20">
        {/* Left Side: Contact Information */}
        <div className="lg:w-1/3 flex flex-col space-y-10">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start text-gray-700">
                <svg className="w-6 h-6 mr-4 text-gray-900 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Email Us</p>
                  <a href="mailto:smartmasterpiece7@gmail.com" className="hover:underline text-gray-600">
                    smartmasterpiece7@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start text-gray-700">
                <svg className="w-6 h-6 mr-4 text-gray-900 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <a href="tel:+233547348350" className="hover:underline text-gray-600">
                    (054) 734 8350
                  </a>
                </div>
              </div>

              <div className="flex items-start text-gray-700">
                <svg className="w-6 h-6 mr-4 text-gray-900 mt-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Visit Our Studio</p>
                  <p className="text-gray-600">Near Baba Yara Sports Stadium<br/>Amakom, Kumasi</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <BusinessHours />
          </div>

        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />
    </Container>
  );
};

export default Contact;

