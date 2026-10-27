// Visitor authentication is currently disabled.
// The login/signup UI is preserved below in comments and can be re-enabled when needed.
// Admin login remains active and separate at /8392-admin/login.

import { redirect } from "next/navigation";

export default function AuthPage() {
  // Visitors do not log in — redirect to home
  redirect("/");
}

/*
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Container from "@/ui/Container";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        router.push("/8392-admin");
      } else {
        router.push(redirectPath);
      }
    }
  }, [user, router, redirectPath]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Successfully logged in!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Successfully signed up!");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="py-20 flex justify-center items-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-gray-500 text-center mb-8">
            {isLogin ? "Sign in to access your orders and checkout." : "Sign up to start purchasing artworks."}
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none" />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-70 mt-4">
              {isLoading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-semibold text-gray-900 hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
*/
