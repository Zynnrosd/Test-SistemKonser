import { Link } from "react-router";
import { Music2, Twitter, Instagram, Github, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-accent/30 overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6 inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                ConcertHub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-8">
              Experience the magic of live music. We curate the best events and provide a seamless, premium booking experience from start to finish.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Instagram className="w-4 h-4" />} href="#" />
              <SocialLink icon={<Github className="w-4 h-4" />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-bold mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><FooterLink href="/dashboard">Concerts</FooterLink></li>
              <li><FooterLink href="/favorites">Favorites</FooterLink></li>
              <li><FooterLink href="#">Venues</FooterLink></li>
              <li><FooterLink href="#">Artists</FooterLink></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><FooterLink href="#">About Us</FooterLink></li>
              <li><FooterLink href="#">Contact</FooterLink></li>
              <li><FooterLink href="#">Privacy Policy</FooterLink></li>
              <li><FooterLink href="#">Terms of Service</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} ConcertHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Designed with</span>
            <span className="text-primary animate-pulse">♥</span>
            <span>for music lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      href={href}
      className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent hover:border-primary/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all"
    >
      {icon}
    </motion.a>
  );
}

function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      to={href}
      className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group font-medium"
    >
      {children}
      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
    </Link>
  );
}
