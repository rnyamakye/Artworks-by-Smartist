"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;
    setIsSubmitting(true);

    const formData = new FormData(form.current);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // Save to Supabase
      const { error: supabaseError } = await supabase
        .from("contact_messages")
        .insert([{ name, email, message }]);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      await emailjs.sendForm("service_x2u2tri", "template_atwkta1", form.current, {
        publicKey: "Q9Oc4bdc8IbQl5xEZ"
      });

      toast.success("Your message has been sent successfully!");
      form.current?.reset();
    } catch (error) {
      console.error("FAILED...", error);
      toast.error("Failed to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={form}
      onSubmit={sendEmail}
      className="space-y-5"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium text-sm mb-1" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
            name="name"
            type="text"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-medium text-sm mb-1" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
            name="email"
            type="email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium text-sm mb-1" htmlFor="message">
          Your Message
        </label>
        <textarea
          id="message"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-shadow"
          name="message"
          rows={5}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black transition-colors font-semibold flex items-center justify-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <svg
          className={`w-5 h-5 mr-2 ${isSubmitting ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          {isSubmitting ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          )}
        </svg>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;
