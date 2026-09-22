import Container from "@/ui/Container";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable caching for dynamic content

export default async function About() {
  const [{ data: aboutData }, { data: achievementsData }] = await Promise.all([
    supabase.from("about_page").select("*").limit(1).single(),
    supabase.from("achievements").select("*").order("created_at", { ascending: true })
  ]);

  return (
    <>
      <Container className="max-w-7xl mx-auto px-4 md:px-8 py-1 md:py-12 space-y-20">
        {/* Our Mission Section */}
        <section className="w-full mx-auto md:px-6 py-12">
          {/* Header */}
          <header className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
              {aboutData?.title || "About"}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Discover the story behind our passion for pencil artistry and our
              mission to inspire artists worldwide.
            </p>
          </header>

          {/* Large Image Placeholder */}
          <div className="bg-gray-200 rounded-xl w-full mx-auto mb-16 flex items-center justify-center h-80 md:h-[500px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Artist@work.jpg"
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                History
              </h2>
              {aboutData?.content ? (
                <div 
                  className="text-gray-600 mb-6 space-y-4 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: aboutData.content }}
                />
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Smartist is a humble artist who discovered a passion for
                    creativity early in life and has been dedicated to honing their
                    craft ever since.
                  </p>
                  <p className="text-gray-600 mb-4">
                    What began as a personal journey of self-expression has
                    blossomed into a heartfelt mission to inspire others through art
                    and storytelling.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Today, Smartist continues to create meaningful artwork, share
                    insights, and connect with a growing community of fellow artists
                    and enthusiasts.
                  </p>
                </>
              )}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Explore Blog
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Right Column - Image Placeholder */}
            <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/satisfied-costumer-3.jpg"
                alt=""
                className="w-full h-80 md:h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        </section>
        <section
          id="our-mission"
          className="bg-gray-50 rounded-lg p-10 text-center"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-4">
            Smartist's Mission
          </h2>
          <p className="max-w-3xl mx-auto text-gray-700 mb-10">
            As an artist, Smartist is dedicated to expressing emotions and
            stories through pencil art. His mission is to inspire creativity,
            continuously learn and improve his craft, and build meaningful
            connections with fellow artists and art lovers.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-12 max-w-5xl mx-auto">
            {/* Inspire Creativity */}
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full p-4 mb-3">
                {/* Paint palette icon */}
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <circle cx="8" cy="10" r="1" fill="currentColor" />
                  <circle cx="16" cy="10" r="1" fill="currentColor" />
                  <circle cx="10" cy="16" r="1" fill="currentColor" />
                  <circle cx="14" cy="16" r="1" fill="currentColor" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">
                Inspire Creativity
              </div>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Through his artwork, Smartist aims to spark imagination and
                encourage others to explore their own creative potential.
              </p>
            </div>

            {/* Pursue Growth */}
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full p-4 mb-3">
                {/* Book icon */}
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <path d="M8 4v16" stroke="currentColor" strokeWidth={2} />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Pursue Growth</div>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Constantly refining his skills and learning new techniques to
                evolve as an artist and storyteller.
              </p>
            </div>

            {/* Build Connections */}
            <div className="flex flex-col items-center flex-1">
              <div className="bg-gray-200 rounded-full p-4 mb-3">
                {/* Users icon */}
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                  <path
                    d="M2 20c0-4 8-6 10-6s10 2 10 6"
                    stroke="currentColor"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">
                Build Connections
              </div>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Creating meaningful relationships with fellow artists and art
                enthusiasts to share inspiration and support.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="w-full mx-auto md:px-8 py-16">
          <div className="w-full flex flex-col md:flex-row gap-8 items-center">
            {/* Image Placeholder */}
            <div className="flex-1 w-full">
              <div className="w-full bg-gray-200 rounded-xl flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/award-image.JPG"
                  alt="Smartist receiving award"
                  className="w-full h-80 rounded-xl md:h-[450px] object-cover object-top"
                />
              </div>
            </div>
            {/* Achievements List */}
            <div className="flex-1 w-full">
              <h2 className="text-2xl md:text-2xl md:text-3xl font-bold mb-4">
                Achievements
              </h2>
              <p className="text-gray-700 mb-6">
                Over the years, Smartist has grown from a passionate hobbyist to
                a celebrated artist, earning recognition both locally and
                internationally. Here are some of Smartist's proudest
                achievements:
              </p>
              <ul className="space-y-4">
                {achievementsData && achievementsData.length > 0 ? (
                  achievementsData.map((ach) => (
                    <li key={ach.id} className="flex items-start gap-2">
                      <span className="mt-1">
                        {/* Generic Award Icon */}
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} />
                          <path d="M8.5 14h7l-1.5 6-2-2-2 2-1.5-6z" stroke="currentColor" strokeWidth={2} />
                        </svg>
                      </span>
                      <div>
                        <span className="font-semibold">{ach.title}</span>
                        <br />
                        <span className="text-gray-600 text-sm">
                          {ach.description}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No achievements added yet.</li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}

