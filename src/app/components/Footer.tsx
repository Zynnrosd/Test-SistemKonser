import { Link } from "react-router";
import { Music2, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-foreground tracking-tight">
                ConcertHub
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6 font-medium">
              The premier platform for live music discovery and secure ticketing. Experience seamless access to the world's most anticipated events.
            </p>
            <div className="flex gap-3">
              <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Instagram className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3.5">
              <li><FooterLink href="/dashboard">Browse Events</FooterLink></li>
              <li><FooterLink href="/favorites">Saved Concerts</FooterLink></li>
              <li><FooterLink href="#">Partner Venues</FooterLink></li>
              <li><FooterLink href="#">Artist Directory</FooterLink></li>
            </ul>
          </div>

          {/* Legal / Support */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-3.5">
              <li><FooterLink href="#">Help Center & FAQ</FooterLink></li>
              <li><FooterLink href="#">Contact Support</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © {currentYear} ConcertHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-colors shadow-sm"
    >
      {icon}
    </a>
  );
}

function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      to={href}
      className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center group font-medium"
    >
      {children}
      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}