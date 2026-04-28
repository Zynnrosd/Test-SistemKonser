import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Ticket, Star, Sparkles, Music, CalendarDays, ShieldCheck } from "lucide-react";
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

  // Parallax effects
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Immersive Background Effects */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 pointer-events-none z-0 immersive-bg">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </motion.div>

      {/* Navbar overlay for Landing */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 glass shadow-none border-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConcertHub</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:scale-105 shadow-lg shadow-primary/20 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20">
        <motion.div 
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="flex flex-col items-center text-center max-w-5xl mx-auto px-6 mb-32 min-h-[70vh] justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 border-primary/20 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary/80">The next generation of live music</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl lg:text-[10rem] font-extrabold tracking-tighter leading-[0.95] mb-8"
          >
            Experience the <br />
            <span className="text-gradient">Magic of Live.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed font-medium"
          >
            Discover, book, and manage your concert experiences with a platform designed for the modern music lover. Immersive, seamless, and unforgettable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/login"
              className="group relative px-10 py-5 rounded-full bg-primary text-white font-semibold text-lg overflow-hidden flex items-center gap-3 shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all hover:scale-105"
            >
              <span className="relative z-10">Start Exploring</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Reveal Section - Featured */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trending Now</h2>
            <p className="text-muted-foreground font-medium">The most anticipated shows this month.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredConcerts.map((concert, i) => (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`card-premium rounded-[2.5rem] overflow-hidden ${
                  i === 1 ? "md:translate-y-12 shadow-2xl" : "shadow-xl"
                }`}
              >
                <div className="relative h-72">
                  <img src={concert.image} alt={concert.title} className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-lg">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-1 text-foreground">{concert.title}</h3>
                  <p className="text-primary text-base font-bold mb-6">{concert.artist}</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Starting from</p>
                      <span className="text-3xl font-extrabold text-foreground">${concert.price}</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white text-primary transition-all shadow-sm">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll Reveal Section - Features */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Music, title: "Curated Selection", desc: "Handpicked events tailored to your unique taste." },
              { icon: ShieldCheck, title: "Secure Booking", desc: "100% guaranteed authentic tickets with secure checkout." },
              { icon: CalendarDays, title: "Seamless Management", desc: "All your tickets in one beautifully designed place." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-[2.5rem] bg-white border border-border shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/20 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-extrabold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
