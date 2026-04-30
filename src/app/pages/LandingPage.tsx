import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Ticket, Sparkles, CalendarDays, Mic2, Users2, Trophy, Search, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router";
import { useData } from "../context/DataContext";
import { useRef, useState, useEffect } from "react";
import { Footer } from "../components/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// Variants untuk Reveal Teks Per Kata
const quoteVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function LandingPage() {
  const { concerts } = useData();
  const visibleConcerts = concerts.filter(c => c.status !== "archived");
  const featuredConcerts = visibleConcerts.slice(0, 3);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const titleString = "Unlock the Ultimate Concert Experience.";
  const titleWords = titleString.split(" ");

  // Deteksi Scroll untuk Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 overflow-x-hidden">

      {/* Background Parallax */}
      <motion.div style={{ y: yBg }} className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-[10%] left-[10%] w-[100vw] h-[400px] bg-primary/10 blur-[160px] rounded-full" />
        <div className="absolute top-[10%] left-[50%] w-[100vw] h-[400px] bg-fuchsia-500/10 blur-[160px] rounded-full" />
      </motion.div>

      {/* Floating Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300">
        <motion.div
          animate={{
            width: isScrolled ? "90%" : "100%",
            maxWidth: isScrolled ? "1100px" : "1280px",
            y: isScrolled ? 10 : 0
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`mx-auto flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-500 ${isScrolled
            ? "bg-white/70 backdrop-blur-xl border-slate-200/60 shadow-lg shadow-slate-200/20"
            : "bg-transparent border-transparent"
            }`}
        >
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-500">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Concert<span className="text-primary">Hub</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">Sign In</Link>
            <Link to="/register" className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-300">
              Get Started
            </Link>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-40 pb-20 md:pt-48 md:pb-24 lg:pt-40 lg:pb-32 min-h-[80vh] flex items-center">
        <motion.div style={{ opacity: opacityHero }} className="flex flex-col items-center text-center max-w-6xl mx-auto px-6">

          <motion.h1
            variants={quoteVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05] mb-10 text-slate-900"
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                variants={wordVariants}
                style={{ display: "inline-block", marginRight: "0.25em" }}
                className="origin-center"
              >
                {word === "Ultimate" ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-fuchsia-500 pb-2">
                    Ultimate
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mb-14 font-medium leading-relaxed"
          >
            Access exclusive pre-sales, premium VIP seating, and instant digital entry for the world's most anticipated tours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl bg-primary text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              Explore Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-500" />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300"
            >
              <Zap className="w-5 h-5 text-primary" />
              View Features
            </button>
          </motion.div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <FeatureCard
            icon={<Search className="w-6 h-6" />}
            title="Smart Discovery"
            desc="AI-powered recommendations based on your favorite artists and genres."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Secure Booking"
            desc="Enterprise-grade encryption and anti-fraud systems for every transaction."
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Instant Entry"
            desc="No more paper tickets. Just scan your digital pass and enjoy the show."
          />
        </motion.div>
      </section>

      {/* Stats Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-24 md:mb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatBox label="Tickets Sold" value="2.4M" icon={<Trophy />} />
          <StatBox label="Active Events" value="500+" icon={<Mic2 />} />
          <StatBox label="Happy Fans" value="1.2M" icon={<Users2 />} />
          <StatBox label="Global Venues" value="120+" icon={<CalendarDays />} />
        </motion.div>
      </div>

      {/* Featured Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24 md:pb-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Featured Tours</h2>
            <p className="text-slate-500 text-lg font-medium">Don't miss out on this season's headliners.</p>
          </div>
          <Link to="/dashboard" className="group flex items-center gap-2 text-sm font-bold text-primary">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredConcerts.map((concert, i) => (
            <motion.div
              key={concert.id}
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 cursor-pointer"
            >
              <img src={concert.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute bottom-8 left-8 right-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">{concert.artist}</p>
                <h3 className="text-2xl font-bold text-white mb-6 leading-tight">{concert.title}</h3>
                <Link to={`/concerts/${concert.id}`} className="inline-flex items-center gap-2 text-white font-bold group/btn">
                  Get Tickets <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="relative z-50 bg-white border-t border-slate-200">
        <Footer />
      </div>

    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,1)", boxShadow: "0 20px 40px -15px rgba(0,0,0,0.05)" }}
      className="p-10 rounded-[2rem] border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-500"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StatBox({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <motion.div variants={itemVariants} className="text-center p-8 bg-transparent hover:bg-white/50 rounded-3xl transition-colors duration-500">
      <div className="text-primary mb-4 flex justify-center opacity-40">{icon}</div>
      <p className="text-4xl font-extrabold text-slate-900 mb-2">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
    </motion.div>
  );
}