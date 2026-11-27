import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { resolveImageUrl } from "../api/client";

export default function ProductCard({
  product,
  index,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) {
  const variants = product.variants || [];
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [addedPulse, setAddedPulse] = useState(false);

  const activeVariant = variants[selectedVariantIdx] || null;
  const displayPrice = activeVariant?.effective_price || product.base_price || "0.00";
  const imageUrl =
    resolveImageUrl(product.primary_image) ||
    resolveImageUrl(product.images?.[0]?.image_url) ||
    (product.product_type === "COMFORTER"
      ? "/images/comforter-ivory-down.jpg"
      : "/images/bag-tote-cognac.jpg");

  // Deduplicate colors for swatches
  const uniqueColors = [];
  const seenColorNames = new Set();
  variants.forEach((v, idx) => {
    const colorName = v.color_detail?.name || v.color?.name;
    const hex = v.color_detail?.hex_code || v.color?.hex_code || "#A66D4F";
    if (colorName && !seenColorNames.has(colorName)) {
      seenColorNames.add(colorName);
      uniqueColors.push({ idx, name: colorName, hex });
    }
  });

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, activeVariant, 1);
    setAddedPulse(true);
    setTimeout(() => setAddedPulse(false), 1200);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="product-card group"
    >
      {/* Image Frame */}
      <div className="product-media" onClick={() => onQuickView(product)}>
        <motion.img
          src={imageUrl}
          alt={product.name}
          className="editorial-img-zoom"
          whileTap={{ scale: 0.985 }}
        />

        {/* Type Tag */}
        <div
          className="product-type-badge"
          style={{
            color:
              product.product_type === "COMFORTER"
                ? "var(--accent-sage)"
                : "var(--accent-cognac)",
          }}
        >
          {product.product_type_display ||
            (product.product_type === "COMFORTER" ? "Comforter" : "Handbag")}
        </div>

        {/* Wishlist Heart */}
        <motion.button
          whileTap={{ scale: 1.35 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label="Save to wishlist"
          className="product-wishlist-btn"
        >
          <Heart
            size={15}
            strokeWidth={1.8}
            fill={isWishlisted ? "var(--accent-cognac)" : "none"}
            color={isWishlisted ? "var(--accent-cognac)" : "var(--text-primary)"}
          />
        </motion.button>

        {/* Floating Quick Actions */}
        <div className="product-quick-bar">
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="quick-action-btn quick-action-ghost"
          >
            <Eye size={14} />
            <span className="quick-label-text">Quick View</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={handleQuickAdd}
            className="quick-action-btn quick-action-primary"
            style={{
              backgroundColor: addedPulse ? "var(--accent-sage)" : undefined,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {addedPulse ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <Check size={13} strokeWidth={2.4} />
                  <span>Added</span>
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <ShoppingBag size={13} />
                  <span>Add to Bag</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Product Card Body */}
      <div className="product-card-body">
        <div className="product-card-header">
          <div style={{ minWidth: 0 }}>
            <span className="product-card-category">
              {product.category?.name || "Atelier Edition"}
            </span>
            <h3 onClick={() => onQuickView(product)} className="product-card-title">
              {product.name}
            </h3>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayPrice}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="tabular-nums product-card-price"
            >
              ${Number(displayPrice).toFixed(0)}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Material / Warmth Metadata Line */}
        <p className="product-card-meta">
          {product.product_type === "COMFORTER"
            ? [
                product.warmth_rating,
                product.thread_count ? `${product.thread_count}TC` : null,
                product.material,
              ]
                .filter(Boolean)
                .join(" · ")
            : [product.material, product.closure_type].filter(Boolean).join(" · ")}
        </p>

        {/* Bottom Color Swatches & Variant Count */}
        <div className="product-card-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            {uniqueColors.map((col) => {
              const isSelected = selectedVariantIdx === col.idx;
              return (
                <motion.button
                  key={col.name}
                  type="button"
                  title={col.name}
                  aria-label={`Select color ${col.name}`}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setSelectedVariantIdx(col.idx)}
                  className="swatch-btn"
                >
                  {isSelected && (
                    <motion.span
                      layoutId={`swatch-ring-${product.id}`}
                      className="swatch-active-ring"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="swatch-dot" style={{ backgroundColor: col.hex }} />
                </motion.button>
              );
            })}
          </div>

          {variants.length > 0 && (
            <span className="product-variant-count">
              {variants.length} {variants.length === 1 ? "option" : "options"}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
