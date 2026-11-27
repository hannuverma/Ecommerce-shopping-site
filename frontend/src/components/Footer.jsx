import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function Footer({ onSelectType }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3200);
  };

  return (
    <footer
      style={{
        backgroundColor: "#1b1917",
        color: "#f4efe6",
        paddingBlock: "clamp(3rem, 6vw, 5rem) 2rem",
      }}
    >
      <div className="section-container">
        <div className="footer-grid">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Maison Vélour
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(244, 239, 230, 0.65)",
                marginTop: "0.85rem",
                maxWidth: "32ch",
                lineHeight: 1.65,
              }}
            >
              Small-batch leather handbags and cloud-soft European down comforters. Curated for
              enduring elegance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent-brass)",
                marginBottom: "1rem",
              }}
            >
              Collections
            </div>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
                fontSize: "0.88rem",
              }}
            >
              <li>
                <button
                  type="button"
                  onClick={() => onSelectType("HANDBAG")}
                  className="link-underline"
                >
                  Italian Leather Handbags
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectType("COMFORTER")}
                  className="link-underline"
                >
                  Goose Down Comforters
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectType("ALL")}
                  className="link-underline"
                >
                  Complete Seasonal Archive
                </button>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--accent-brass)",
                marginBottom: "1rem",
              }}
            >
              Atelier Journal
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "rgba(244, 239, 230, 0.7)",
                marginBottom: "1rem",
              }}
            >
              Receive private invitations to seasonal leather drops and limited comforter editions.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="footer-newsletter-input"
              />
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                type="submit"
                aria-label="Subscribe"
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: subscribed ? "var(--accent-sage)" : "var(--accent-brass)",
                  color: "#1b1917",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background-color 0.25s ease",
                }}
              >
                {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1.5rem",
            fontSize: "0.78rem",
            color: "rgba(244, 239, 230, 0.5)",
            gap: "0.75rem",
          }}
        >
          <span>© 2026 Maison Vélour Atelier. All rights reserved.</span>
          <span>Handbags &amp; Comforters · Florence · Vienna</span>
        </div>
      </div>
    </footer>
  );
}
