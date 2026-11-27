import { motion } from "framer-motion";
import { Award, Feather, Shield } from "lucide-react";

const PILLARS = [
  {
    icon: Shield,
    eyebrow: "Florentine Tannery",
    title: "Full-Grain Vegetable Leather",
    copy: "Each handbag is cut from single-origin Tuscan hides cured in chestnut tannins, developing a rich bespoke patina over decades of carry.",
  },
  {
    icon: Feather,
    eyebrow: "Ethical Sleep Craft",
    title: "RDS 750-Fill European Down",
    copy: "Our comforters pair independently audited white goose down with double-stitched baffle-box chambers so warmth stays even and weightless.",
  },
  {
    icon: Award,
    eyebrow: "30-Night Cloud Guarantee",
    title: "Lived-In Confidence",
    copy: "Sleep beneath our comforters for 30 nights or carry your handbag for 14 days—complimentary white-glove returns if it is not unforgettable.",
  },
];

export default function AtelierStorySection() {
  return (
    <section
      id="atelier"
      style={{
        backgroundColor: "var(--bg-secondary)",
        paddingBlock: "clamp(3rem, 7vw, 6rem)",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "640px",
            marginInline: "auto",
            marginBottom: "clamp(2rem, 5vw, 3.25rem)",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--accent-cognac)",
              fontWeight: 600,
            }}
          >
            The Maison Standard
          </span>
          <h2
            style={{
              fontSize: "clamp(1.85rem, 3.8vw, 3rem)",
              fontWeight: 400,
              marginTop: "0.35rem",
            }}
          >
            Crafted for Hand &amp; Haven
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: "56px",
              height: "1.5px",
              backgroundColor: "var(--accent-brass)",
              margin: "0.85rem auto",
              transformOrigin: "center",
            }}
          />
          <p style={{ color: "var(--text-secondary)", fontSize: "0.94rem", lineHeight: 1.65 }}>
            We dedicate ourselves to two tactile essentials—what accompanies you out into the world,
            and what welcomes you back to rest.
          </p>
        </motion.div>

        <div className="pillars-grid">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileTap={{ scale: 0.985 }}
                className="pillar-card"
              >
                <div className="pillar-icon-box">
                  <Icon size={21} strokeWidth={1.7} />
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {pillar.eyebrow}
                </span>
                <h3 style={{ fontSize: "clamp(1.3rem, 2.2vw, 1.5rem)", fontWeight: 400, marginTop: "0.3rem" }}>
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.87rem",
                    color: "var(--text-secondary)",
                    marginTop: "0.6rem",
                    lineHeight: 1.65,
                  }}
                >
                  {pillar.copy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
