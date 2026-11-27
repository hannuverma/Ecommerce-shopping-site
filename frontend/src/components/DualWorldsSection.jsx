import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const WORLDS = [
  {
    type: "HANDBAG",
    tag: "Leathergoods Atelier",
    title: "Architectural Handbags",
    description:
      "Structured totes, half-moon crossbodies, and hand-glazed top-handle satchels in Italian calfskin.",
    image: "/images/bag-tote-cognac.jpg",
  },
  {
    type: "COMFORTER",
    tag: "Sleep Sanctuary",
    title: "Baffle-Box Comforters",
    description:
      "High-loft RDS European goose down & Belgian flax linen comforters tailored for weightless warmth.",
    image: "/images/comforter-ivory-down.jpg",
  },
];

export default function DualWorldsSection({ onSelectWorld }) {
  return (
    <section style={{ paddingBlock: "clamp(1.75rem, 5vw, 4rem)" }}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "0.85rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent-cognac)",
                fontWeight: 600,
              }}
            >
              Two Crafts · One Philosophy
            </span>
            <h2
              style={{
                fontSize: "clamp(1.85rem, 3.6vw, 2.85rem)",
                fontWeight: 400,
                marginTop: "0.25rem",
              }}
            >
              Curated Worlds
            </h2>
          </div>
          <p style={{ color: "var(--text-secondary)", maxWidth: "42ch", fontSize: "0.9rem" }}>
            Select a discipline below to filter our seasonal studio pieces by form, material, and craft.
          </p>
        </motion.div>

        <div className="dual-grid">
          {WORLDS.map((world, idx) => (
            <motion.div
              key={world.type}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx * 0.14, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -7 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelectWorld(world.type)}
              className="world-card group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectWorld(world.type);
                }
              }}
            >
              <img
                src={world.image}
                alt={world.title}
                className="editorial-img-zoom"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="world-card-overlay">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: "0.68rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "var(--accent-brass)",
                        fontWeight: 600,
                      }}
                    >
                      {world.tag}
                    </span>
                    <h3
                      style={{
                        fontSize: "clamp(1.45rem, 2.5vw, 2.25rem)",
                        fontWeight: 400,
                        marginTop: "0.2rem",
                        lineHeight: 1.15,
                      }}
                    >
                      {world.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.84rem",
                        color: "rgba(250, 247, 242, 0.84)",
                        maxWidth: "38ch",
                        marginTop: "0.35rem",
                        lineHeight: 1.45,
                      }}
                    >
                      {world.description}
                    </p>
                  </div>

                  <motion.div whileHover={{ scale: 1.12, rotate: 8 }} className="world-arrow-pill">
                    <ArrowUpRight size={19} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
