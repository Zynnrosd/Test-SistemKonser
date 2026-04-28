import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Ticket, Star, Sparkles, CalendarDays, PlayCircle, Mic2, Users2, Trophy } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../context/DataContext";
import { useRef } from "react";

export function LandingPage() {
  const { concerts } = useData();
  const featuredConcerts = concerts.slice(0, 3);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-foreground overflow-hidden font-sans">
      {/* Latar Belakang Enterprise (Lebih Bersih) */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-primary/5 to-transparent" />
      </motion.div>

      {/* Navbar Landing Page */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/80 backdrop-blur-md border border-border/50 rounded-2xl px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Concert<span className="text-primary">Hub</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-24">
        <motion.div
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto px-6 mb-32"
        >

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.1] mb-8"
          >
            Experience Live Music <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500">
              Like Never Before.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-medium"
          >
            The world's most trusted ticketing platform. Secure your spot at the biggest global tours with our seamless booking experience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Explore Events
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white border border-border text-foreground font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
              <PlayCircle className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Tickets Sold", val: "2M+", icon: Trophy },
              { label: "Active Events", val: "450+", icon: Mic2 },
              { label: "Happy Fans", val: "1.2M", icon: Users2 },
              { label: "Partner Venues", val: "85+", icon: CalendarDays },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-foreground mb-1">{s.val}</p>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Featured Lineup</h2>
              <p className="text-muted-foreground text-lg">Secure tickets to the most anticipated tours of the season.</p>
            </div>
            <Link to="/dashboard" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2 group">
              View All Events <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredConcerts.map((concert, i) => (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-2xl overflow-hidden shadow-md bg-white"
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={concert.image} alt={concert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-foreground text-xs font-bold">Trending</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs font-bold text-primary mb-1">{concert.artist}</p>
                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-1">{concert.title}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-xs mb-0.5">Starting At</p>
                        <p className="text-xl font-bold text-white">${concert.price}</p>
                      </div>
                      <Link
                        to={`/concert/${concert.id}`}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Enterprise CTA Showcase */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="p-16 md:p-24 rounded-3xl bg-slate-900 relative overflow-hidden text-center border border-slate-800 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">Ready for the Next Show?</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">Join millions of fans. Create an account to get access to exclusive presales, premium seating, and fast-track checkout.</p>
              <Link
                to="/register"
                className="inline-flex px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Create an Account
              </Link>
            </motion.div>
          </div>
        </div>
      </header>
    </div>
  );
}