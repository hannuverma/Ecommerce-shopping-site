import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { resolveImageUrl } from "../api/client";

const FREE_SHIPPING_THRESHOLD = 250;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) {
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      onClearCart();
      setCheckedOut(false);
      onClose();
    }, 2400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="cart-drawer"
          >
            {/* Header */}
            <div
              style={{
                padding: "1.15rem 1.35rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.45rem", fontWeight: 400 }}>Your Shopping Bag</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  {items.reduce((acc, i) => acc + i.quantity, 0)} curated pieces
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                aria-label="Close bag"
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

            {/* Free Shipping Progress */}
            <div style={{ padding: "0.85rem 1.35rem", backgroundColor: "var(--bg-secondary)" }}>
              <div style={{ fontSize: "0.78rem", marginBottom: "0.45rem", color: "var(--text-primary)" }}>
                {remaining === 0 ? (
                  <span>
                    ✓ You have unlocked <strong>complimentary white-glove delivery</strong>
                  </span>
                ) : (
                  <span>
                    Add <strong className="tabular-nums">${remaining.toFixed(2)}</strong> more for
                    complimentary delivery
                  </span>
                )}
              </div>
              <div
                style={{
                  height: "5px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(27, 25, 23, 0.1)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    height: "100%",
                    backgroundColor:
                      remaining === 0 ? "var(--accent-sage)" : "var(--accent-cognac)",
                  }}
                />
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.15rem 1.35rem" }}>
              {checkedOut ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "1.5rem",
                  }}
                >
                  <svg
                    width="58"
                    height="58"
                    viewBox="0 0 58 58"
                    fill="none"
                    style={{ marginBottom: "1.1rem" }}
                  >
                    <motion.circle
                      cx="29"
                      cy="29"
                      r="26"
                      stroke="var(--accent-sage)"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.path
                      d="M18 30L25.5 37.5L40.5 22"
                      stroke="var(--accent-sage)"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </svg>
                  <h4 style={{ fontSize: "1.8rem", fontWeight: 400 }}>Order Confirmed</h4>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                    Thank you for choosing Maison Vélour. Our Florence &amp; bedding ateliers are
                    preparing your pieces.
                  </p>
                </motion.div>
              ) : items.length === 0 ? (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  <ShoppingBag
                    size={36}
                    strokeWidth={1.3}
                    style={{ marginBottom: "0.9rem", opacity: 0.55 }}
                  />
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.45rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    Your bag is currently empty
                  </p>
                  <p style={{ fontSize: "0.86rem", marginTop: "0.35rem", maxWidth: "28ch" }}>
                    Discover our Italian calfskin handbags and high-loft European down comforters.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <AnimatePresence initial={false}>
                    {items.map((item, idx) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 48 }}
                        transition={{
                          duration: 0.28,
                          delay: Math.min(idx * 0.04, 0.16),
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                          display: "flex",
                          gap: "0.9rem",
                          paddingBottom: "1rem",
                          borderBottom: "1px solid var(--border-subtle)",
                        }}
                      >
                        <img
                          src={resolveImageUrl(item.image) || "/images/bag-tote-cognac.jpg"}
                          alt={item.name}
                          style={{
                            width: "72px",
                            height: "88px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            backgroundColor: "var(--bg-card)",
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                            <h4 style={{ fontSize: "1rem", fontWeight: 500, lineHeight: 1.25 }}>
                              {item.name}
                            </h4>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              type="button"
                              onClick={() => onRemoveItem(item.key)}
                              style={{ color: "var(--text-muted)", padding: "2px", flexShrink: 0 }}
                              title="Remove item"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={15} />
                            </motion.button>
                          </div>

                          {item.variantLabel && (
                            <span
                              style={{
                                fontSize: "0.74rem",
                                color: "var(--text-secondary)",
                                marginTop: "0.2rem",
                              }}
                            >
                              {item.variantLabel}
                            </span>
                          )}

                          <div
                            style={{
                              marginTop: "auto",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingTop: "0.6rem",
                            }}
                          >
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "999px",
                                paddingInline: "0.35rem",
                              }}
                            >
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                onClick={() => onUpdateQty(item.key, item.quantity - 1)}
                                style={{ padding: "0.28rem" }}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </motion.button>
                              <span
                                className="tabular-nums"
                                style={{
                                  minWidth: "1.5rem",
                                  textAlign: "center",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                }}
                              >
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.8 }}
                                type="button"
                                onClick={() => onUpdateQty(item.key, item.quantity + 1)}
                                style={{ padding: "0.28rem" }}
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </motion.button>
                            </div>

                            <span className="tabular-nums" style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Checkout */}
            {items.length > 0 && !checkedOut && (
              <div
                style={{
                  padding: "1.15rem 1.35rem max(1.45rem, env(safe-area-inset-bottom))",
                  borderTop: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Subtotal</span>
                  <span className="tabular-nums" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  Taxes and bespoke gift-wrapping calculated at checkout.
                </p>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCheckout}
                  className="btn-primary btn-sheen"
                  style={{ width: "100%", justifyContent: "center", paddingBlock: "0.95rem" }}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
