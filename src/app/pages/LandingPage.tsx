import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Ticket, Star, Sparkles, Music, CalendarDays, ShieldCheck, PlayCircle, Mic2, Users2, Trophy } from "lucide-react";
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
  const scaleHero = useTransform(scrollYProgress, [0, 0.25], [1, 0.9]);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-foreground overflow-hidden font-sans">
      {/* Immersive Background */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 pointer-events-none z-0">
        {/* Generated Hero Image Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute top-0 left-0 w-full h-[100vh] bg-gradient-to-b from-primary/5 to-transparent" />
      </motion.div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass border-border/50 rounded-3xl px-8 py-4 shadow-2xl shadow-black/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/30">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Concert<span className="text-primary">Hub</span></span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
              Log In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 transition-all active:scale-95"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-44 pb-32">
        <motion.div 
          style={{ opacity: opacityHero, scale: scaleHero }}
          className="flex flex-col items-center text-center max-w-6xl mx-auto px-6 mb-40"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 mb-10 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Music Revolution</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-8xl md:text-[10rem] lg:text-[13rem] font-black tracking-[-0.04em] leading-[0.8] mb-12 uppercase italic"
          >
            Feel the <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">Rhythm.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-16 leading-relaxed font-bold tracking-tight"
          >
            Experience live music like never before. The most premium ticketing platform for the world's biggest artists.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link
              to="/dashboard"
              className="group px-12 py-6 rounded-[2rem] bg-primary text-white font-black text-lg flex items-center gap-4 shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all hover:scale-105 active:scale-95"
            >
              Explore Events
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="px-12 py-6 rounded-[2rem] bg-white border-2 border-border text-foreground font-black text-lg flex items-center gap-4 hover:bg-accent transition-all">
              <PlayCircle className="w-6 h-6" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-6 mb-56">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Tickets Sold", val: "2M+", icon: Trophy },
              { label: "Active Events", val: "450+", icon: Mic2 },
              { label: "Happy Fans", val: "1.2M", icon: Users2 },
              { label: "Venues", val: "85+", icon: CalendarDays },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm text-center"
              >
                <s.icon className="w-8 h-8 text-primary/40 mx-auto mb-4" />
                <p className="text-4xl font-black tracking-tighter mb-1">{s.val}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 uppercase italic">Featured <span className="text-primary">Lineup.</span></h2>
              <p className="text-muted-foreground font-bold text-lg">Don't miss out on the most anticipated tours of the season.</p>
            </div>
            <Link to="/dashboard" className="text-sm font-black uppercase tracking-[0.2em] text-primary hover:translate-x-2 transition-transform flex items-center gap-2 pb-2 border-b-2 border-primary/20">
              View All Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredConcerts.map((concert, i) => (
              <motion.div
                key={concert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="relative h-[32rem] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5">
                  <img src={concert.image} alt={concert.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                  
                  <div className="absolute top-8 right-8">
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-black uppercase tracking-widest">Trending</span>
                    </div>
                  </div>

                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-2">{concert.artist}</p>
                    <h3 className="text-3xl font-black text-white mb-6 tracking-tight uppercase italic">{concert.title}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">Starting At</p>
                        <p className="text-3xl font-black text-white tracking-tighter">${concert.price}</p>
                      </div>
                      <Link
                        to={`/concert/${concert.id}`}
                        className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xl active:scale-90"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brand Showcase */}
        <div className="max-w-7xl mx-auto px-6 pb-40">
           <div className="p-20 rounded-[4rem] bg-black relative overflow-hidden text-center">
              <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />
              <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px]" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 uppercase italic leading-none">Ready for the <br /> <span className="text-primary">Next Show?</span></h2>
                <p className="text-white/60 text-lg md:text-xl font-bold max-w-2xl mx-auto mb-12">Join millions of fans and get access to exclusive presales, premium seating, and unforgettable VIP experiences.</p>
                <Link
                  to="/register"
                  className="inline-flex px-14 py-6 rounded-full bg-white text-black font-black text-xl hover:scale-105 transition-all shadow-2xl"
                >
                  Join the Community
                </Link>
              </motion.div>
           </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-20 px-8 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">ConcertHub</span>
            </div>
            <p className="text-muted-foreground font-bold text-lg max-w-sm mb-10 leading-relaxed">The world's leading platform for live music discovery and premium ticketing experiences.</p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-accent border border-border" />)}
            </div>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-foreground mb-8">Platform</h4>
            <ul className="space-y-4 text-muted-foreground font-bold text-sm">
              <li><Link to="/dashboard" className="hover:text-primary">Explore</Link></li>
              <li><Link to="/my-tickets" className="hover:text-primary">My Tickets</Link></li>
              <li><Link to="/profile" className="hover:text-primary">Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black uppercase tracking-widest text-[10px] text-foreground mb-8">Support</h4>
            <ul className="space-y-4 text-muted-foreground font-bold text-sm">
              <li className="hover:text-primary cursor-pointer">Help Center</li>
              <li className="hover:text-primary cursor-pointer">Terms of Service</li>
              <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
