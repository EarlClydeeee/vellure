import Link from 'next/link';
import { Mail } from 'lucide-react';
import { NavLink } from '@/components/store/NavLink';

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="bg-[#1a1a1a] px-4 py-12 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold">Ready to Get Our New Stuff?</h3>
            <p className="mt-1 text-sm text-white/70">
              Subscribe for updates and exclusive offers.
            </p>
          </div>
          <form className="flex w-full max-w-md gap-2 sm:w-auto">
            <input
              type="email"
              placeholder="Your email"
              className="h-11 flex-1 rounded-full border-0 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-full bg-white px-6 text-sm font-medium text-[#1a1a1a] transition-colors hover:bg-white/90"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="border-t bg-background px-4 py-12">
        <div className="container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-bold tracking-tight">Vellure</h3>
            <p className="text-sm text-muted-foreground">
              Premium products, curated for you.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">About</h4>
            <nav className="flex flex-col gap-2">
              <NavLink
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </NavLink>
              <NavLink
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Meet The Team
              </NavLink>
              <a
                href="mailto:hello@vellure.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </a>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="flex flex-col gap-2">
              <NavLink
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </NavLink>
              <span className="text-sm text-muted-foreground">Shipping</span>
              <span className="text-sm text-muted-foreground">Return</span>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="flex gap-3">
              {['X', 'Facebook', 'LinkedIn', 'Instagram'].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={label}
                >
                  {label[0]}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-12 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Vellure. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
