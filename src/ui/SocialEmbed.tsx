"use client";
import { useEffect } from "react";

interface SocialEmbedProps {
  url: string;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) {
        return u.pathname.split("/shorts/")[1].split("/")[0];
      }
      return u.searchParams.get("v");
    }
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("?")[0];
    }
  } catch {
    // fall through
  }
  return null;
}

function loadScript(src: string, id: string): void {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.src = src;
  script.id = id;
  script.async = true;
  document.body.appendChild(script);
}

export function SocialEmbed({ url }: SocialEmbedProps) {
  if (!url) return null;

  // ── YouTube ──────────────────────────────────────────────────────────────
  const ytId = getYouTubeVideoId(url);
  if (ytId) {
    return (
      <div className="rounded-xl overflow-hidden my-4 aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  // ── TikTok ───────────────────────────────────────────────────────────────
  if (url.includes("tiktok.com")) {
    return <TikTokEmbed url={url} />;
  }

  // ── Instagram ────────────────────────────────────────────────────────────
  if (url.includes("instagram.com/p/") || url.includes("instagram.com/reel/")) {
    return <InstagramEmbed url={url} />;
  }

  // ── Twitter / X ──────────────────────────────────────────────────────────
  if (url.includes("twitter.com/") || url.includes("x.com/")) {
    return <TwitterEmbed url={url} />;
  }

  // ── Facebook ─────────────────────────────────────────────────────────────
  if (url.includes("facebook.com/")) {
    return <FacebookEmbed url={url} />;
  }

  // ── Generic fallback ─────────────────────────────────────────────────────
  return (
    <div className="rounded-xl overflow-hidden my-4">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 underline break-all text-sm"
      >
        🔗 {url}
      </a>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TikTokEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScript("https://www.tiktok.com/embed.js", "tiktok-embed-script");
  }, []);

  return (
    <div className="rounded-xl overflow-hidden my-4">
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id=""
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View on TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScript("//www.instagram.com/embed.js", "instagram-embed-script");
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.instgrm?.Embeds?.process();
    }
  }, []);

  return (
    <div className="rounded-xl overflow-hidden my-4">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: "540px", width: "100%" }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          View on Instagram
        </a>
      </blockquote>
    </div>
  );
}

function TwitterEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScript("https://platform.twitter.com/widgets.js", "twitter-widgets-script");
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.twttr?.widgets?.load();
    }
  }, []);

  return (
    <div className="rounded-xl overflow-hidden my-4">
      <blockquote className="twitter-tweet">
        <a href={url} target="_blank" rel="noopener noreferrer">
          View on Twitter / X
        </a>
      </blockquote>
    </div>
  );
}

function FacebookEmbed({ url }: { url: string }) {
  useEffect(() => {
    loadScript(
      "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0",
      "facebook-sdk-script"
    );
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.FB?.XFBML?.parse();
    }
  }, []);

  return (
    <div className="rounded-xl overflow-hidden my-4">
      <div
        className="fb-post"
        data-href={url}
        data-width="auto"
      />
    </div>
  );
}
