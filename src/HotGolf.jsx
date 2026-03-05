import { useState, useEffect, useRef } from "react";

const LOCATIONS = {
  delhi: [
    { name: "Delhi Golf Club", area: "Dr Zakir Hussain Road, Central Delhi", tag: "DGC", bays: 4 },
    { name: "Qutab Golf Course", area: "Press Enclave Rd, Lado Sarai", tag: "QGC", bays: 4 },
    { name: "DDA Golf Course Dwarka", area: "Sector 19B, Dwarka", tag: "DWK", bays: 4 },
    { name: "Siri Fort Sports Complex", area: "August Kranti Marg, South Delhi", tag: "SFC", bays: 4 },
  ],
  gurugram: [
    { name: "Skyline Golf", area: "Baliawas, Gurugram", tag: "SKY", bays: 4 },
    { name: "Zen Golf", area: "SEZ Road, Alahawas", tag: "ZEN", bays: 4 },
    { name: "Hamoni Golf Camp", area: "Sector 23A, Gurugram", tag: "HMN", bays: 4 },
    { name: "DLF Golf & Country Club", area: "DLF Phase 5, Sector 42", tag: "DLF", bays: 4 },
    { name: "Ambience Golf Greens", area: "Ambience Island, NH-8", tag: "AMB", bays: 4 },
  ],
};

const PRICING = [
  { label: "Weekday Chill", time: "Mon–Thu · Before 5 PM", price: 499, note: "Per bay / hour" },
  { label: "Weekday Prime", time: "Mon–Thu · After 5 PM", price: 799, note: "Per bay / hour" },
  { label: "Weekend Day", time: "Fri–Sun · Before 5 PM", price: 999, note: "Per bay / hour" },
  { label: "Weekend Night", time: "Fri–Sun · After 5 PM", price: 1499, note: "Per bay / hour" },
];

const MENU_HIGHLIGHTS = [
  { name: "Tandoori Chicken Sliders", price: 349, tag: "Chef's Pick" },
  { name: "Truffle Loaded Fries", price: 299, tag: "Fan Favourite" },
  { name: "Classic Smash Burger", price: 399, tag: "" },
  { name: "Paneer Tikka Platter", price: 329, tag: "Veg" },
  { name: "Signature Craft Cocktails", price: 449, tag: "Bar" },
  { name: "Cold Brew & Shakes", price: 199, tag: "Non-Alc" },
];

const NAV_ITEMS = ["Experience", "Locations", "Pricing", "Events", "Food & Drinks", "Membership"];

// Animated counter
function Counter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = 0;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>;
}

// Fade in on scroll
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function HotGolf() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeCity, setActiveCity] = useState("delhi");
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    location: "", date: "", time: "", bayType: "regular", guests: 2,
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#0A0A0A", color: "#F5F5F0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Bebas+Neue&family=Space+Mono&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: #FF4D00; color: #0A0A0A; }
        
        .hot-gradient { background: linear-gradient(135deg, #FF4D00, #FF8C00, #FFB800); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hot-bg { background: linear-gradient(135deg, #FF4D00, #FF6A00); }
        .hot-border { border: 1px solid rgba(255, 77, 0, 0.3); }
        
        .nav-glass {
          background: ${scrolled ? "rgba(10, 10, 10, 0.92)" : "transparent"};
          backdrop-filter: ${scrolled ? "blur(20px)" : "none"};
          border-bottom: ${scrolled ? "1px solid rgba(255,77,0,0.1)" : "none"};
          transition: all 0.4s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF4D00, #FF6A00);
          color: #fff;
          border: none;
          padding: 14px 32px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,77,0,0.4); }

        .btn-outline {
          background: transparent;
          color: #F5F5F0;
          border: 1.5px solid rgba(255,77,0,0.5);
          padding: 14px 32px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }
        .btn-outline:hover { border-color: #FF4D00; background: rgba(255,77,0,0.08); }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.4s ease;
        }
        .card:hover { border-color: rgba(255,77,0,0.3); background: rgba(255,77,0,0.04); transform: translateY(-4px); }

        .location-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 28px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .location-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: linear-gradient(180deg, #FF4D00, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .location-card:hover { border-color: rgba(255,77,0,0.4); background: rgba(255,77,0,0.05); }
        .location-card:hover::before { opacity: 1; }

        .pricing-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 32px 28px;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
        }
        .pricing-card:hover { border-color: rgba(255,77,0,0.5); transform: translateY(-6px); }
        .pricing-popular {
          border-color: rgba(255,77,0,0.6) !important;
          background: rgba(255,77,0,0.06) !important;
        }

        .tab-btn {
          padding: 10px 28px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-bg {
          background: radial-gradient(ellipse at 20% 50%, rgba(255,77,0,0.12) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 20%, rgba(255,140,0,0.08) 0%, transparent 40%),
                      radial-gradient(ellipse at 50% 100%, rgba(255,77,0,0.05) 0%, transparent 30%);
        }

        .grid-overlay {
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .modal-content {
          background: #141414;
          border: 1px solid rgba(255,77,0,0.2);
          max-width: 520px;
          width: 100%;
          padding: 40px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        input, select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #F5F5F0;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border 0.3s ease;
        }
        input:focus, select:focus { border-color: #FF4D00; }
        select option { background: #141414; color: #F5F5F0; }

        .marquee {
          display: flex;
          animation: marquee 30s linear infinite;
          white-space: nowrap;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .float-anim {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .pulse-dot {
          width: 8px; height: 8px;
          background: #00FF88;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 48px !important; }
          .section-title { font-size: 36px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .hide-mobile { display: none !important; }
          .mobile-full { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="nav-glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 2 }}>
              <span className="hot-gradient">HOT</span><span style={{ color: "#F5F5F0" }}>GOLF</span>
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,77,0,0.6)", fontWeight: 600, marginTop: 8 }}>.IN</span>
          </div>

          <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {NAV_ITEMS.map((item) => (
              <span
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"))}
                style={{ fontSize: 13, fontWeight: 500, letterSpacing: 0.5, cursor: "pointer", color: "rgba(245,245,240,0.6)", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.target.style.color = "#FF4D00")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(245,245,240,0.6)")}
              >
                {item}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 13 }} onClick={() => setBookingModal(true)}>
              Book Now
            </button>
            <div
              className="hide-mobile"
              style={{ display: "none" }}
            />
            <div
              onClick={() => setMobileMenu(!mobileMenu)}
              style={{ display: "none", cursor: "pointer", padding: 8 }}
              className="show-mobile"
            >
              <div style={{ width: 24, height: 2, background: "#F5F5F0", marginBottom: 6 }} />
              <div style={{ width: 24, height: 2, background: "#F5F5F0", marginBottom: 6 }} />
              <div style={{ width: 18, height: 2, background: "#FF4D00" }} />
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero-bg grid-overlay" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "120px 32px 80px", position: "relative" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div className="pulse-dot" />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "rgba(245,245,240,0.5)", letterSpacing: 2, textTransform: "uppercase" }}>
                Now Open in Delhi NCR
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="hero-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 96, lineHeight: 0.95, letterSpacing: 2, maxWidth: 900 }}>
              <span style={{ color: "#F5F5F0" }}>SWING.</span><br />
              <span className="hot-gradient">SIP.</span><br />
              <span style={{ color: "#F5F5F0" }}>SOCIALISE.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p style={{ fontSize: 18, color: "rgba(245,245,240,0.55)", maxWidth: 520, lineHeight: 1.7, marginTop: 32, fontWeight: 400 }}>
              India's hottest golf entertainment experience. Smash drives, sip cocktails, and vibe with friends — no handicap required.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 15 }} onClick={() => setBookingModal(true)}>
                Book a Bay →
              </button>
              <button className="btn-outline" onClick={() => scrollTo("experience")}>
                Explore Experience
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={0.55}>
            <div style={{ display: "flex", gap: 48, marginTop: 80, flexWrap: "wrap" }}>
              {[
                { label: "Also available on", items: ["BookMyShow", "Huddle", "District by Zomato"] },
              ].map((g) => (
                <div key={g.label}>
                  <span style={{ fontSize: 11, color: "rgba(245,245,240,0.3)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>{g.label}</span>
                  <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                    {g.items.map((i) => (
                      <span key={i} style={{ fontSize: 13, color: "rgba(245,245,240,0.5)", padding: "6px 14px", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 500 }}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Decorative golf ball */}
        <div className="float-anim hide-mobile" style={{ position: "absolute", right: "8%", top: "30%", width: 280, height: 280, borderRadius: "50%", border: "1px solid rgba(255,77,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(255,77,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(255,77,0,0.2), rgba(255,77,0,0.05))" }} />
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", padding: "16px 0" }}>
        <div className="marquee">
          {Array(2).fill(null).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 48, paddingRight: 48 }}>
              {["GOLF ENTERTAINMENT", "COCKTAILS & CUISINE", "CORPORATE EVENTS", "BIRTHDAY PARTIES", "DATE NIGHT", "COACHING", "ARCADE GAMES", "LIVE MUSIC", "VIP BAYS", "GROUP HANGOUTS"].map((t) => (
                <span key={t + i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: 3, color: "rgba(245,245,240,0.12)" }}>
                  {t} <span style={{ color: "rgba(255,77,0,0.3)" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <section style={{ padding: "80px 32px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="stats-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
          {[
            { value: 9, suffix: "", label: "Locations across Delhi NCR" },
            { value: 36, suffix: "+", label: "Tech-enabled hitting bays" },
            { value: 4, suffix: "", label: "Bay types inc. VIP" },
            { value: 500, suffix: "+", prefix: "₹", label: "Starting per hour" },
          ].map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, lineHeight: 1 }}>
                  <span className="hot-gradient">
                    <Counter end={s.value} prefix={s.prefix || ""} suffix={s.suffix} />
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(245,245,240,0.4)", marginTop: 8, letterSpacing: 0.5 }}>{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>The Experience</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              NOT YOUR TYPICAL<br /><span className="hot-gradient">DRIVING RANGE</span>
            </h2>
          </FadeIn>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 64 }}>
            {[
              {
                icon: "🎯",
                title: "Smart Bays with Screens",
                desc: "Each bay is equipped with interactive screens tracking your shots in real-time. Compete with friends, play target games, or just watch your drives fly.",
              },
              {
                icon: "🍸",
                title: "Full Bar & Kitchen",
                desc: "From craft cocktails to tandoori sliders — order right from your bay. Our menu is built for sharing and our drinks are built for celebrating.",
              },
              {
                icon: "🎵",
                title: "Music & Vibes",
                desc: "Curated playlists, live DJ nights every weekend, and an atmosphere that makes you forget you're at a golf range. This is a party with purpose.",
              },
              {
                icon: "🏆",
                title: "Games & Competitions",
                desc: "Weekly tournaments, arcade challenges between swings, and leaderboard battles. Every visit is a chance to claim bragging rights.",
              },
              {
                icon: "👑",
                title: "VIP Bay Experience",
                desc: "Private enclosed bay with premium lounge seating, dedicated server, priority bookings, and exclusive F&B service. The ultimate flex.",
              },
              {
                icon: "🎓",
                title: "Pro Coaching",
                desc: "Certified golf pros available for 1-on-1 and group sessions. Whether you're a first-timer or fine-tuning your swing, we've got you.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="card" style={{ padding: 36, height: "100%" }}>
                  <span style={{ fontSize: 36 }}>{item.icon}</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: 1, marginTop: 20, color: "#F5F5F0" }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", lineHeight: 1.7, marginTop: 12 }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Bay Types */}
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 64 }}>
            <FadeIn>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: 48 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(245,245,240,0.3)", letterSpacing: 2 }}>STANDARD</span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginTop: 8 }}>REGULAR BAYS</h3>
                <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #FF4D00, transparent)", margin: "20px 0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {["Interactive screen with shot tracking", "Comfortable seating for up to 6", "Full menu & bar service", "Target games & leaderboards", "Club rental available"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "#FF4D00", fontSize: 14 }}>✦</span>
                      <span style={{ fontSize: 14, color: "rgba(245,245,240,0.55)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
                  <span className="hot-gradient">FROM ₹499</span>
                  <span style={{ fontSize: 14, color: "rgba(245,245,240,0.3)", fontFamily: "'DM Sans', sans-serif" }}> / hour</span>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div style={{ background: "rgba(255,77,0,0.04)", border: "1px solid rgba(255,77,0,0.25)", padding: 48, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 16, right: 16, background: "linear-gradient(135deg, #FF4D00, #FF6A00)", padding: "4px 14px", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  VIP
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,77,0,0.6)", letterSpacing: 2 }}>PREMIUM</span>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginTop: 8 }}>VIP BAY</h3>
                <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #FF4D00, transparent)", margin: "20px 0" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {["Private enclosed bay with curtain", "Premium lounge seating & sofas", "Dedicated personal server", "Priority booking & skip-the-line", "Exclusive VIP menu & bottle service", "Photo booth & party props", "Club rental included"].map((f) => (
                    <div key={f} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: "#FFB800", fontSize: 14 }}>✦</span>
                      <span style={{ fontSize: 14, color: "rgba(245,245,240,0.6)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 28, fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
                  <span className="hot-gradient">₹1,999</span>
                  <span style={{ fontSize: 14, color: "rgba(245,245,240,0.3)", fontFamily: "'DM Sans', sans-serif" }}> / hour · all days</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== LOCATIONS ===== */}
      <section id="locations" style={{ padding: "120px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>Locations</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              FIND YOUR <span className="hot-gradient">NEAREST BAY</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(245,245,240,0.4)", marginTop: 16, maxWidth: 500 }}>
              9 locations across Delhi & Gurugram, inside the city's best golf ranges. More coming soon.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div style={{ display: "flex", gap: 4, marginTop: 48, background: "rgba(255,255,255,0.03)", width: "fit-content" }}>
              {[
                { key: "delhi", label: "Delhi", count: 4 },
                { key: "gurugram", label: "Gurugram", count: 5 },
              ].map((c) => (
                <button
                  key={c.key}
                  className="tab-btn"
                  onClick={() => setActiveCity(c.key)}
                  style={{
                    background: activeCity === c.key ? "linear-gradient(135deg, #FF4D00, #FF6A00)" : "transparent",
                    color: activeCity === c.key ? "#fff" : "rgba(245,245,240,0.4)",
                  }}
                >
                  {c.label} <span style={{ opacity: 0.6 }}>({c.count})</span>
                </button>
              ))}
            </div>
          </FadeIn>

          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
            {LOCATIONS[activeCity].map((loc, i) => (
              <FadeIn key={loc.tag} delay={i * 0.08}>
                <div className="location-card" onClick={() => { setBookingForm({ ...bookingForm, location: loc.name }); setBookingModal(true); }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,77,0,0.5)", letterSpacing: 2 }}>{loc.tag}</span>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1, marginTop: 4 }}>{loc.name}</h3>
                      <p style={{ fontSize: 13, color: "rgba(245,245,240,0.35)", marginTop: 6 }}>{loc.area}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "rgba(245,245,240,0.25)", fontFamily: "'Space Mono', monospace" }}>{loc.bays} bays</span>
                      <span style={{ fontSize: 12, color: "#FF4D00", fontWeight: 600 }}>Book →</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>Pricing</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              EVERY HOUR IS <span className="hot-gradient">HAPPY HOUR</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(245,245,240,0.4)", marginTop: 16, maxWidth: 520 }}>
              Per bay pricing. Each bay fits up to 6 people — split the cost and multiply the fun. Club rental available at ₹199 per set.
            </p>
          </FadeIn>

          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 56 }}>
            {PRICING.map((p, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`pricing-card ${i === 3 ? "pricing-popular" : ""}`}>
                  {i === 3 && (
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #FF4D00, #FF6A00)", padding: "4px 16px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, marginTop: i === 3 ? 12 : 0, color: "#F5F5F0" }}>{p.label}</h3>
                  <p style={{ fontSize: 12, color: "rgba(245,245,240,0.3)", marginTop: 6, fontFamily: "'Space Mono', monospace" }}>{p.time}</p>
                  <div style={{ margin: "24px 0" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48 }} className="hot-gradient">₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(245,245,240,0.3)" }}>{p.note}</p>
                  <button className="btn-primary" style={{ width: "100%", marginTop: 24, padding: "12px" }} onClick={() => setBookingModal(true)}>
                    Book Now
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div style={{ marginTop: 32, background: "rgba(255,77,0,0.04)", border: "1px solid rgba(255,77,0,0.15)", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22 }}>VIP BAY — <span className="hot-gradient">₹1,999/HR</span></span>
                <span style={{ fontSize: 13, color: "rgba(245,245,240,0.35)", marginLeft: 16 }}>Flat rate · All days · All times</span>
              </div>
              <button className="btn-outline" style={{ padding: "10px 24px" }} onClick={() => setBookingModal(true)}>Book VIP →</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" style={{ padding: "120px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>Events</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              YOUR EVENT, <span className="hot-gradient">OUR RANGE</span>
            </h2>
          </FadeIn>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 56 }}>
            {[
              {
                title: "CORPORATE EVENTS",
                emoji: "🏢",
                desc: "Team building with a twist. Custom tournaments, branded bays, and full F&B packages for groups of 20–200+.",
                features: ["Custom scoring & leaderboards", "Branded bay signage", "Dedicated event manager", "Full catering packages"],
              },
              {
                title: "BIRTHDAY PARTIES",
                emoji: "🎂",
                desc: "Smash drives and cake. VIP bay, party props, photo booth, and a celebration they'll actually remember.",
                features: ["VIP bay with party setup", "Custom cake & F&B packages", "Photo booth & props", "Dedicated party host"],
              },
              {
                title: "DATE NIGHT",
                emoji: "🌙",
                desc: "Cocktails, competition, and chemistry. Book a bay for two and discover your new favourite date spot.",
                features: ["Couples bay with drinks", "Candlelit ambience option", "Prix-fixe dinner menu", "Complimentary round of golf"],
              },
            ].map((e, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="card" style={{ padding: 40, height: "100%", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 40 }}>{e.emoji}</span>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1, marginTop: 20 }}>{e.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(245,245,240,0.4)", lineHeight: 1.7, marginTop: 12, flex: 1 }}>{e.desc}</p>
                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                    {e.features.map((f) => (
                      <span key={f} style={{ fontSize: 13, color: "rgba(245,245,240,0.5)" }}>
                        <span style={{ color: "#FF4D00", marginRight: 8 }}>—</span>{f}
                      </span>
                    ))}
                  </div>
                  <button className="btn-outline" style={{ marginTop: 28, width: "100%" }}>Enquire Now</button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOD & DRINKS ===== */}
      <section id="food--drinks" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>Food & Drinks</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              FUEL YOUR <span className="hot-gradient">SWING</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(245,245,240,0.4)", marginTop: 16, maxWidth: 520 }}>
              Order from your bay. Our kitchen serves up shareable bites and our bar pours everything from craft cocktails to cold brews.
            </p>
          </FadeIn>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 56 }}>
            {MENU_HIGHLIGHTS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s", cursor: "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,77,0,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <div>
                    <h4 style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</h4>
                    {item.tag && (
                      <span style={{ fontSize: 11, color: "#FF4D00", fontWeight: 600, marginTop: 4, display: "inline-block", letterSpacing: 0.5 }}>{item.tag}</span>
                    )}
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, color: "rgba(245,245,240,0.5)" }}>₹{item.price}</span>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <p style={{ fontSize: 13, color: "rgba(245,245,240,0.25)", marginTop: 32, fontStyle: "italic" }}>
              Full menu available at each location. Prices may vary. Veg & Jain options available.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== MEMBERSHIP ===== */}
      <section id="membership" style={{ padding: "120px 32px", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <FadeIn>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF4D00", letterSpacing: 3, textTransform: "uppercase" }}>Membership</span>
            <h2 className="section-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, letterSpacing: 2, marginTop: 12, lineHeight: 1 }}>
              JOIN THE <span className="hot-gradient">HOT CLUB</span>
            </h2>
          </FadeIn>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 56 }}>
            {[
              {
                name: "STARTER",
                price: "FREE",
                sub: "Download the app",
                perks: ["Earn loyalty points on every visit", "Birthday month special offers", "Early access to events", "Digital scorecard & history"],
                cta: "Download App",
              },
              {
                name: "PRO",
                price: "₹2,999",
                sub: "per quarter",
                perks: ["Everything in Starter", "10% off all bay bookings", "1 free hour per month", "Priority weekend booking", "Exclusive member events", "Guest passes (2/month)"],
                cta: "Join Pro",
                featured: true,
              },
              {
                name: "LEGEND",
                price: "₹9,999",
                sub: "per quarter",
                perks: ["Everything in Pro", "25% off all bay bookings", "4 free VIP hours per month", "Complimentary coaching session", "Unlimited guest passes", "Private event access", "Dedicated concierge"],
                cta: "Join Legend",
              },
            ].map((m, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div
                  style={{
                    background: m.featured ? "rgba(255,77,0,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${m.featured ? "rgba(255,77,0,0.4)" : "rgba(255,255,255,0.06)"}`,
                    padding: 40,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {m.featured && (
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #FF4D00, #FF6A00)", padding: "4px 16px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                      BEST VALUE
                    </div>
                  )}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(245,245,240,0.3)", letterSpacing: 2 }}>{m.name}</span>
                  <div style={{ marginTop: 12 }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40 }} className="hot-gradient">{m.price}</span>
                    <span style={{ fontSize: 13, color: "rgba(245,245,240,0.3)", marginLeft: 8 }}>{m.sub}</span>
                  </div>
                  <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #FF4D00, transparent)", margin: "24px 0" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {m.perks.map((p) => (
                      <span key={p} style={{ fontSize: 13, color: "rgba(245,245,240,0.5)" }}>
                        <span style={{ color: "#FF4D00", marginRight: 10 }}>✦</span>{p}
                      </span>
                    ))}
                  </div>
                  <button className={m.featured ? "btn-primary" : "btn-outline"} style={{ width: "100%", marginTop: 28 }}>
                    {m.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(255,77,0,0.1) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, letterSpacing: 2, lineHeight: 1 }}>
              READY TO <span className="hot-gradient">GET HOT?</span>
            </h2>
            <p style={{ fontSize: 18, color: "rgba(245,245,240,0.45)", marginTop: 20, lineHeight: 1.7 }}>
              Book your bay, grab your crew, and find out why everyone's talking about HotGolf.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: "16px 40px" }} onClick={() => setBookingModal(true)}>
                Book a Bay →
              </button>
              <button className="btn-outline" style={{ fontSize: 16, padding: "16px 40px" }}>
                Download App
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "64px 32px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48 }}>
            <div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2 }}>
                <span className="hot-gradient">HOT</span>GOLF<span style={{ fontSize: 10, color: "rgba(255,77,0,0.5)", marginLeft: 2 }}>.IN</span>
              </span>
              <p style={{ fontSize: 14, color: "rgba(245,245,240,0.3)", marginTop: 16, lineHeight: 1.7, maxWidth: 300 }}>
                India's hottest golf entertainment experience. Swing, sip, and socialise at 9 locations across Delhi NCR.
              </p>
              <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
                {["Instagram", "Twitter", "YouTube"].map((s) => (
                  <span key={s} style={{ fontSize: 13, color: "rgba(245,245,240,0.3)", cursor: "pointer", transition: "color 0.3s" }}
                    onMouseEnter={(e) => (e.target.style.color = "#FF4D00")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(245,245,240,0.3)")}
                  >{s}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "rgba(245,245,240,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Explore</h4>
              {["Experience", "Locations", "Pricing", "Events", "Membership"].map((l) => (
                <p key={l} style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", marginBottom: 12, cursor: "pointer" }}
                  onClick={() => scrollTo(l.toLowerCase())}
                >{l}</p>
              ))}
            </div>

            <div>
              <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "rgba(245,245,240,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Company</h4>
              {["About Us", "Careers", "Franchise", "Press", "Contact"].map((l) => (
                <p key={l} style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", marginBottom: 12, cursor: "pointer" }}>{l}</p>
              ))}
            </div>

            <div>
              <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "rgba(245,245,240,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
              <p style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", marginBottom: 12 }}>hello@hotgolf.in</p>
              <p style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", marginBottom: 12 }}>+91 98XX XXX XXX</p>
              <p style={{ fontSize: 14, color: "rgba(245,245,240,0.45)", marginBottom: 12 }}>New Delhi, India</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 48, paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <span style={{ fontSize: 12, color: "rgba(245,245,240,0.2)" }}>© 2026 HotGolf India Pvt. Ltd. All rights reserved.</span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy Policy", "Terms of Service", "Refund Policy"].map((l) => (
                <span key={l} style={{ fontSize: 12, color: "rgba(245,245,240,0.2)", cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ===== BOOKING MODAL ===== */}
      {bookingModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setBookingModal(false); }}>
          <div className="modal-content">
            <button onClick={() => setBookingModal(false)} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", color: "rgba(245,245,240,0.4)", fontSize: 24, cursor: "pointer" }}>
              ×
            </button>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF4D00", letterSpacing: 2 }}>BOOK A BAY</span>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginTop: 8 }}>RESERVE YOUR <span className="hot-gradient">SPOT</span></h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32 }}>
              <div>
                <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>LOCATION</label>
                <select value={bookingForm.location} onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}>
                  <option value="">Select a location</option>
                  {[...LOCATIONS.delhi, ...LOCATIONS.gurugram].map((l) => (
                    <option key={l.tag} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>DATE</label>
                  <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>TIME</label>
                  <select value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}>
                    <option value="">Select time</option>
                    {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>BAY TYPE</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { key: "regular", label: "Regular Bay", price: "From ₹499/hr" },
                    { key: "vip", label: "VIP Bay", price: "₹1,999/hr" },
                  ].map((b) => (
                    <div
                      key={b.key}
                      onClick={() => setBookingForm({ ...bookingForm, bayType: b.key })}
                      style={{
                        padding: "16px",
                        border: `1.5px solid ${bookingForm.bayType === b.key ? "#FF4D00" : "rgba(255,255,255,0.08)"}`,
                        background: bookingForm.bayType === b.key ? "rgba(255,77,0,0.08)" : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.3s",
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{b.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(245,245,240,0.35)", marginTop: 4 }}>{b.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>NUMBER OF GUESTS</label>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <button
                    onClick={() => setBookingForm({ ...bookingForm, guests: Math.max(1, bookingForm.guests - 1) })}
                    style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#F5F5F0", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >−</button>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, minWidth: 40, textAlign: "center" }}>{bookingForm.guests}</span>
                  <button
                    onClick={() => setBookingForm({ ...bookingForm, guests: Math.min(6, bookingForm.guests + 1) })}
                    style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#F5F5F0", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >+</button>
                  <span style={{ fontSize: 12, color: "rgba(245,245,240,0.25)" }}>Max 6 per bay</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>YOUR NAME</label>
                <input type="text" placeholder="Enter your name" />
              </div>

              <div>
                <label style={{ fontSize: 12, color: "rgba(245,245,240,0.4)", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>

              <button className="btn-primary" style={{ width: "100%", marginTop: 8, padding: "16px", fontSize: 16 }}>
                Confirm Booking →
              </button>

              <p style={{ fontSize: 11, color: "rgba(245,245,240,0.2)", textAlign: "center" }}>
                You'll receive a confirmation via WhatsApp & SMS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
