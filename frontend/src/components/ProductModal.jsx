import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check, ChevronDown, ShieldCheck, Truck } from "lucide-react";
import { resolveImageUrl } from "../api/client";

function ProductModalDialog({ product, onClose, onAddToCart }) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState("specs");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const variants = product.variants || [];
  const activeVariant = variants[selectedVariantIdx] || null;
  const price = activeVariant?.effective_price || product.base_price || "0.00";
  const imageUrl =
    resolveImageUrl(product.primary_image) ||
    resolveImageUrl(product.images?.[0]?.image_url) ||
    (product.product_type === "COMFORTER"
      ? "/images/comforter-ivory-down.jpg"
      : "/images/bag-tote-cognac.jpg");

  const handleAdd = () => {
    onAddToCart(product, activeVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 42 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 36 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="detail-modal-card"
      >
        <div className="sheet-handle-pill" aria-hidden="true" />

        {/* Close Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 20,
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "rgba(250, 247, 242, 0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} />
        </motion.button>

        {/* Left / Top Visual Column */}
        <div className="detail-modal-visual">
          <img src={imageUrl} alt={product.name} />
        </div>

        {/* Right / Bottom Info & Variant Controls */}
        <div className="detail-modal-content">
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--accent-cognac)",
              fontWeight: 600,
            }}
          >
            {product.product_type === "COMFORTER" ? "Bedding Sanctuary" : "Leathergoods"} ·{" "}
            {product.category?.name || "Atelier"}
          </span>

          <h2
            style={{
              fontSize: "clamp(1.6rem, 2.6vw, 2.35rem)",
              fontWeight: 400,
              marginTop: "0.35rem",
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </h2>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={price}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="tabular-nums"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                marginTop: "0.65rem",
                color: "var(--text-primary)",
              }}
            >
              ${Number(price).toFixed(2)}
            </motion.div>
          </AnimatePresence>

          <p
            style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: "0.9rem",
              lineHeight: 1.65,
            }}
          >
            {product.description}
          </p>

          {/* Variant / Option Selector */}
          {variants.length > 0 && (
            <div style={{ marginTop: "1.4rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.78rem",
                  marginBottom: "0.6rem",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Select {product.product_type === "COMFORTER" ? "Size & Finish" : "Color & Size"}
                </span>
                {activeVariant && (
                  <span
                    style={{
                      color: activeVariant.stock > 0 ? "var(--accent-sage)" : "#b54b4b",
                      fontWeight: 500,
                    }}
                  >
                    {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : "Sold out"}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
                {variants.map((v, idx) => {
                  const selected = idx === selectedVariantIdx;
                  const colorName = v.color_detail?.name || "Classic";
                  const sizeName = v.size_detail?.name || "Standard";
                  const hex = v.color_detail?.hex_code || "#A66D4F";

                  return (
                    <motion.button
                      key={v.id}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setSelectedVariantIdx(idx)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.9rem",
                        borderRadius: "999px",
                        border: selected
                          ? "1.5px solid var(--text-primary)"
                          : "1px solid var(--border-strong)",
                        backgroundColor: selected ? "var(--text-primary)" : "transparent",
                        color: selected ? "var(--bg-primary)" : "var(--text-primary)",
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: hex,
                          border: "1px solid rgba(255,255,255,0.45)",
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        {sizeName} · {colorName}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Bag */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.6rem", alignItems: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid var(--border-strong)",
                borderRadius: "999px",
                height: "48px",
                paddingInline: "0.45rem",
                flexShrink: 0,
              }}
            >
              <motion.button
                whileTap={{ scale: 0.82 }}
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "0.45rem" }}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </motion.button>
              <span className="tabular-nums" style={{ minWidth: "1.75rem", textAlign: "center", fontWeight: 600 }}>
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.82 }}
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{ padding: "0.45rem" }}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAdd}
              className="btn-primary btn-sheen"
              style={{
                flex: 1,
                justifyContent: "center",
                height: "48px",
                paddingInline: "1rem",
                backgroundColor: addedSuccess ? "var(--accent-sage)" : undefined,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {addedSuccess ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
                  >
                    <Check size={16} />
                    <span>Added to Bag</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                  >
                    Add — ${(Number(price) * quantity).toFixed(2)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Trust Perks */}
          <div className="trust-perks-row">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <Truck size={15} /> Complimentary shipping over $250
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
              <ShieldCheck size={15} /> Authenticity guaranteed
            </span>
          </div>

          {/* Accordions for Specs & Care */}
          <div style={{ marginTop: "0.85rem" }}>
            {[
              {
                id: "specs",
                title:
                  product.product_type === "COMFORTER"
                    ? "Fill & Construction Specs"
                    : "Dimensions & Hardware",
                content:
                  product.product_type === "COMFORTER"
                    ? [
                        product.material && `Shell: ${product.material}`,
                        product.fill_material && `Fill: ${product.fill_material}`,
                        product.warmth_rating && `Warmth Rating: ${product.warmth_rating}`,
                        product.thread_count && `Thread Count: ${product.thread_count} TC`,
                      ]
                        .filter(Boolean)
                        .join(" • ")
                    : [
                        product.material && `Material: ${product.material}`,
                        product.dimensions && `Dimensions: ${product.dimensions}`,
                        product.closure_type && `Closure: ${product.closure_type}`,
                      ]
                        .filter(Boolean)
                        .join(" • "),
              },
              {
                id: "care",
                title: "Atelier Care Instructions",
                content:
                  product.care_instructions || "Handle with care using gentle natural cleaners.",
              },
            ].map((acc) => {
              const isOpen = openAccordion === acc.id;
              return (
                <div key={acc.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingBlock: "0.85rem",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      textAlign: "left",
                    }}
                  >
                    <span>{acc.title}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: "hidden" }}
                      >
                        <p
                          style={{
                            fontSize: "0.84rem",
                            color: "var(--text-secondary)",
                            paddingBottom: "1rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {acc.content || "Details crafted to studio standards."}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProductModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    if (!product) return undefined;
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
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <ProductModalDialog
          key={product.id}
          product={product}
          onClose={onClose}
          onAddToCart={onAddToCart}
        />
      )}
    </AnimatePresence>
  );
}
