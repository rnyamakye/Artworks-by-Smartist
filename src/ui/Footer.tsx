import Link from "next/link";
import { NewsletterForm } from "@/ui/NewsletterForm";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-base">
      <div className="w-full max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-20">
          {/* Brand & Newsletter */}
          <div className="w-">
            <div className="flex items-center mb-2">
              {/* Pencil Icon */}
              <svg
                className="w-6 h-6 mr-2 text-gray-800"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M16.862 3.487a2.06 2.06 0 0 1 2.915 2.914L7.8 18.379a2 2 0 0 1-.878.51l-4.03 1.145a.5.5 0 0 1-.623-.624l1.144-4.03a2 2 0 0 1 .51-.878L16.862 3.487z" />
              </svg>
              <span className="font-bold text-xl text-gray-900">PencilArt</span>
            </div>
            <p className="text-gray-600 mb-4">
              Discover the beauty of pencil art through our blog, tutorials, and
              shop.
            </p>
            <div className="flex flex-col items-center md:items-start">
              <NewsletterForm />

              <div className="mt-6 flex items-center group">
                <Link
                  href="/commission"
                  className="font-semibold text-white text-sm  py-2 px-4 rounded-md bg-gray-900 group-hover:text-white transition duration-300 border-r hover:bg-gray-800"
                >
                  Commission yours
                </Link>
                <Link
                  href="/contact"
                  className=" text-gray-900 px-5 ml-3 py-2 rounded-md text-sm font-semibold bg-white group-hover:text-gray-900 transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold text-gray-900 mb-3">Quick Links</div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/shop">Shop</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="font-semibold text-gray-900 mb-3">Resources</div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link href="/tutorials">Tutorials</Link>
              </li>
              <li>
                <Link href="/artist-spotlights">Artist Spotlights</Link>
              </li>
              <li>
                <Link href="/art-supplies">Art Supplies Guide</Link>
              </li>
              <li>
                <Link href="/faq">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <div className="font-semibold text-gray-900 mb-3">Legal</div>
            <ul className="space-y-2 text-gray-700 mb-5">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-of-service">Terms of Service</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/return-policy">Return Policy</Link>
              </li>
            </ul>
            <div>
              <div className="font-semibold text-gray-900 mb-2">Follow Us</div>
              <div className="flex space-x-4 text-gray-500">
                {/* Facebook */}
                <Link
                  href="https://web.facebook.com/profile.php?id=100040140157602"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>

                {/* Instagram */}
                <Link
                  target="_blank"
                  href="https://www.instagram.com/an_mmanuel?igsh=MXViNWhzajhldTczYg%3D%3D&utm_source=qr"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </Link>
                {/* YouTube */}
                <Link target="_blank" href="" aria-label="YouTube">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};
