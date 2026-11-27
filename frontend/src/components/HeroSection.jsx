import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const lineVariants = {
  hidden: { y: "112%", opacity: 0, rotate: 1.5 },
  visible: (i) => ({
    y: "0%",
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.85,
      delay: 0.08 + i * 0.13,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function AnimatedCounter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${Math.round(latest)}${suffix}`);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(count, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, to, count]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function HeroSection({ onExploreType }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  const imgY = useTransform(smoothProgress, [0, 1], ["-5%", "6%"]);
  const imgScale = useTransform(smoothProgress, [0, 1], [1.1, 1.18]);
  const floatCardY = useTransform(smoothProgress, [0, 1], [0, -34]);

  // Subtle pointer 3D perspective tilt (desktop hover only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 140,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4.5, 4.5]), {
    stiffness: 140,
    damping: 20,
  });

  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="top" ref={heroRef} className="hero-section">
      {/* Ambient Radial Aura */}
      <div className="hero-ambient-orb ambient-drift" aria-hidden="true" />

      <div className="section-container hero-grid">
        {/* Editorial Typography */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hero-eyebrow"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="hero-eyebrow-rule"
            />
            <Sparkles size={13} />
            <span>Autumn / Winter Atelier Collection</span>
          </motion.div>

          <h1 className="hero-headline">
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                style={{ display: "block", transformOrigin: "left bottom" }}
                custom={0}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
              >
                Sculpted Leather.
              </motion.span>
            </span>
            <span style={{ display: "block", overflow: "hidden" }}>
              <motion.span
                style={{ display: "block", transformOrigin: "left bottom" }}
                custom={1}
                initial="hidden"
                animate="visible"
                variants={lineVariants}
              >
                <em>
                  Cloud-Soft
                  <svg
                    className="hero-em-underline"
                    viewBox="0 0 220 12"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M2 8.5C58 3 142 2.5 218 7.5"
                      stroke="var(--accent-brass)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.85 }}
                      transition={{ duration: 0.9, delay: 0.58, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                </em>{" "}
                Sanctuary.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="hero-copy"
          >
            Two distinct rituals of tactile luxury. Architectural Italian calfskin handbags for
            every day in motion, paired with 750-fill European goose down comforters engineered
            for restorative stillness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            className="hero-ctas"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onExploreType("HANDBAG")}
              className="btn-primary btn-sheen"
            >
              <span>Shop Handbags</span>
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onExploreType("COMFORTER")}
              className="btn-secondary"
            >
              <span>Shop Comforters</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="hero-stats"
          >
            <div>
              <div className="hero-stat-num tabular-nums">
                <AnimatedCounter to={750} suffix="+" />
              </div>
              <div className="hero-stat-label">RDS Goose Down Fill</div>
            </div>
            <div>
              <div className="hero-stat-num">Florence</div>
              <div className="hero-stat-label">Full-Grain Calfskin</div>
            </div>
            <div>
              <div className="hero-stat-num tabular-nums">
                <AnimatedCounter to={30} suffix=" Nights" />
              </div>
              <div className="hero-stat-label">Cloud Trial</div>
            </div>
          </motion.div>
        </div>

        {/* Parallax + Perspective Tilt Editorial Frame */}
        <div
          className="hero-visual-stage"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            style={{ rotateX, rotateY }}
            className="hero-visual-frame"
          >
            <motion.img
              style={{ y: imgY, scale: imgScale }}
              src="/images/hero-editorial.jpg"
              alt="Cognac leather handbag beside quilted goose-down comforter on travertine"
              className="hero-visual-img"
            />

            {/* Desktop Floating Pairing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: floatCardY }}
              className="hero-floating-card"
            >
              <div
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--accent-cognac)",
                  fontWeight: 600,
                  marginBottom: "0.2rem",
                }}
              >
                Curated Pairing
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 500 }}>
                Le Grand Solis Tote &amp; Nuage Ivory Down
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Crafted in small seasonal batches with natural materials.
              </div>
            </motion.div>

            {/* Mobile Sleek Corner Pill */}
            <div className="hero-mobile-pill">
              <Sparkles size={11} color="var(--accent-cognac)" />
              <span>Florentine Leather &amp; Goose Down</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
