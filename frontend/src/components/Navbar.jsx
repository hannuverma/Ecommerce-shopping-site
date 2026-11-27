import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, Heart, Menu, X, ArrowRight } from "lucide-react";

const NAV_ITEMS = [
  { id: "ALL", label: "Collection", sub: "01" },
  { id: "HANDBAG", label: "Handbags", sub: "02" },
  { id: "COMFORTER", label: "Comforters", sub: "03" },
  { id: "ATELIER", label: "Atelier", sub: "04" },
];

export default function Navbar({
  activeType,
  onSelectType,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAuth,
  onFocusSearch,
  user,
}) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("ALL");

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28);
  });

  // Lock body scroll when full-screen mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    setMobileMenuOpen(false);
    if (item.id === "ATELIER") {
      setTimeout(() => {
        document.getElementById("atelier")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      onSelectType(item.id);
      setTimeout(() => {
        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  };

  return (
    <>
      {/* Announcement Marquee */}
      <div className="announcement-bar">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} style={{ display: "flex" }}>
              <span className="announcement-item">
                Complimentary White-Glove Delivery Over $250 <span className="announcement-dot" />
              </span>
              <span className="announcement-item">
                Florentine Vegetable-Tanned Handbags <span className="announcement-dot" />
              </span>
              <span className="announcement-item">
                750-Fill Power RDS European Goose Down Comforters <span className="announcement-dot" />
              </span>
              <span className="announcement-item">
                30-Night Cloud Sleep Trial <span className="announcement-dot" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="section-container nav-inner">
          {/* Left Navigation (Desktop) */}
          <nav className="nav-links" aria-label="Primary Navigation">
            {NAV_ITEMS.map((item) => {
              const isSelected =
                item.id === "ATELIER"
                  ? activeNav === "ATELIER"
                  : activeType === item.id && activeNav !== "ATELIER";
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`nav-link-btn ${isSelected ? "active" : ""}`}
                >
                  {item.label}
                  {isSelected && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="nav-active-bar"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Left Mobile Menu Trigger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            className="icon-pill-btn mobile-menu-btn"
            aria-label="Open Navigation Menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={21} strokeWidth={1.7} />
          </motion.button>

          {/* Center Brand */}
          <a href="#top" className="brand-logo" onClick={() => setActiveNav("ALL")}>
            <span className="brand-title">Maison Vélour</span>
            <span className="brand-sub">Leather &amp; Down Atelier</span>
          </a>

          {/* Right Utility Actions */}
          <div className="nav-actions">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onFocusSearch}
              className="icon-pill-btn"
              aria-label="Search catalog"
              title="Search catalog"
            >
              <Search size={18} strokeWidth={1.7} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onOpenAuth}
              className="icon-pill-btn"
              aria-label="Account"
              title={user ? `Signed in as ${user.username || user.email}` : "Account"}
            >
              <User size={18} strokeWidth={1.7} />
              {user && (
                <span
                  className="user-name-text"
                  style={{
                    fontSize: "0.75rem",
                    maxWidth: "85px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.username || user.email.split("@")[0]}
                </span>
              )}
            </motion.button>

            <div
              className="icon-pill-btn wishlist-nav-btn"
              title="Saved items"
              style={{ cursor: "default" }}
            >
              <Heart
                size={18}
                strokeWidth={1.7}
                fill={wishlistCount > 0 ? "var(--accent-cognac)" : "none"}
                color={wishlistCount > 0 ? "var(--accent-cognac)" : "currentColor"}
              />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="tabular-nums"
                  style={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={onOpenCart}
              className="icon-pill-btn bag-pill-btn"
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={17} strokeWidth={1.8} />
              <motion.span
                key={cartCount}
                initial={{ scale: 0.75 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="tabular-nums bag-count-badge"
              >
                {cartCount}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Fullscreen Editorial Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-menu-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="mobile-menu-header">
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--accent-cognac)",
                  fontWeight: 600,
                }}
              >
                Atelier Menu
              </span>
              <span className="brand-title" style={{ fontSize: "1.15rem" }}>
                Maison Vélour
              </span>
              <motion.button
                whileTap={{ scale: 0.9, rotate: 90 }}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            <div className="mobile-menu-body">
              <div>
                {NAV_ITEMS.map((item, idx) => {
                  const isSelected =
                    item.id === "ATELIER"
                      ? activeNav === "ATELIER"
                      : activeType === item.id && activeNav !== "ATELIER";
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.08 + idx * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNavClick(item)}
                      className={`mobile-menu-link ${isSelected ? "active" : ""}`}
                    >
                      <span style={{ display: "flex", alignItems: "baseline", gap: "0.85rem" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.7rem",
                            letterSpacing: "0.14em",
                            color: "var(--text-muted)",
                          }}
                        >
                          {item.sub}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      <ArrowRight size={18} strokeWidth={1.6} />
                    </motion.button>
                  );
                })}
              </div>

              {/* Mobile Quick Utilities */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="mobile-menu-footer"
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.65rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    <User size={16} />
                    <span>{user ? user.username || "Member" : "Account"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onFocusSearch();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    <Search size={16} />
                    <span>Search Pieces</span>
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "0.8rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                    <Heart
                      size={15}
                      fill={wishlistCount > 0 ? "var(--accent-cognac)" : "none"}
                      color={wishlistCount > 0 ? "var(--accent-cognac)" : "currentColor"}
                    />
                    <span>Saved Wishlist</span>
                  </span>
                  <strong style={{ color: "var(--text-primary)" }}>{wishlistCount} pieces</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCart();
                  }}
                  className="btn-primary btn-sheen"
                  style={{ width: "100%", paddingBlock: "0.95rem" }}
                >
                  <ShoppingBag size={16} />
                  <span>Open Bag ({cartCount})</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
