"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [isJustSubscribed, setIsJustSubscribed] = useState(false);

  useEffect(() => {
    // Check if the user has already subscribed during this session or previous sessions
    if (localStorage.getItem("newsletter_subscribed") === "true") {
      setIsSubscribed(true);
    }
    setInitialCheckDone(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Check if email already exists as requested by user
      const { data: existingSubscriber } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email)
        .single();

      if (existingSubscriber) {
        toast.error("This email is already subscribed!");
        setStatus("error");
        return;
      }

      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);

      if (insertError) {
        if (insertError.code === "23505") {
          toast.error("This email is already subscribed!");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        setStatus("error");
      } else {
        toast.success("Thanks for subscribing!");
        setStatus("success");
        setEmail("");
        
        // Save to local storage
        localStorage.setItem("newsletter_subscribed", "true");
        // Animate out by setting these flags
        setIsJustSubscribed(true);
        setIsSubscribed(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setStatus("error");
    }
  };

  if (!initialCheckDone) return null; // Avoid hydration flicker
  // If they were already subscribed from a previous session, just return null
  if (isSubscribed && !isJustSubscribed) return null;

  return (
    <div 
      className={`flex flex-col items-center md:items-start w-full max-w-sm transition-all duration-700 ease-in-out overflow-hidden ${
        isSubscribed ? "max-h-0 opacity-0 mt-0" : "max-h-40 opacity-100 mt-4"
      }`}
    >
      <form onSubmit={handleSubscribe} className="w-full flex items-center">
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "success"}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-gray-900 text-white px-4 py-2 rounded-r-md font-semibold hover:bg-gray-800 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
};
