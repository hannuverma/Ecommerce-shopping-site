import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";

const TYPE_TABS = [
  { id: "ALL", label: "All Pieces" },
  { id: "HANDBAG", label: "Handbags" },
  { id: "COMFORTER", label: "Comforters" },
];

export default function CatalogSection({
  products,
  categories,
  activeType,
  onSelectType,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  warmthFilter,
  onWarmthFilterChange,
  searchInputRef,
  loading,
  isLiveBackend,
  wishlist,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) {
  const hasFilters =
    activeType !== "ALL" ||
    selectedCategory !== "ALL" ||
    searchQuery !== "" ||
    warmthFilter !== "ALL";

  const clearAllFilters = () => {
    onSelectType("ALL");
    onSelectCategory("ALL");
    onSearchChange("");
    onWarmthFilterChange("ALL");
    onSortChange("featured");
  };

  return (
    <section id="catalog" style={{ paddingBlock: "clamp(2.25rem, 6vw, 5rem)" }}>
      <div className="section-container">
        {/* Header & Sliding Type Switcher */}
        <div className="catalog-header">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--accent-cognac)",
                fontWeight: 600,
                flexWrap: "wrap",
              }}
            >
              <span>The Atelier Archive</span>
              <span
                style={{
                  padding: "0.15rem 0.55rem",
                  borderRadius: "999px",
                  backgroundColor: isLiveBackend
                    ? "rgba(94, 107, 92, 0.14)"
                    : "rgba(166, 109, 79, 0.12)",
                  color: isLiveBackend ? "var(--accent-sage)" : "var(--accent-cognac)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                }}
              >
                {isLiveBackend ? "● Live API" : "● Curated Preview"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.85rem",
                flexWrap: "wrap",
                marginTop: "0.3rem",
              }}
            >
              <h2 style={{ fontSize: "clamp(1.95rem, 4vw, 3.1rem)", fontWeight: 400 }}>
                Seasonal Editions
              </h2>
              <AnimatePresence mode="wait">
                <motion.span
                  key={products.length}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {products.length} {products.length === 1 ? "piece" : "pieces"}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="type-tabs" role="tablist" aria-label="Product Type Filter">
            {TYPE_TABS.map((tab) => {
              const active = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectType(tab.id)}
                  className={`type-tab-btn ${active ? "active" : ""}`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalogTypePill"
                      className="type-tab-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="filter-toolbar"
        >
          <div className="search-input-wrap">
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "0.95rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
                pointerEvents: "none",
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search leather, down, totes..."
              className="search-input"
            />
            {searchQuery && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              >
                <X size={14} />
              </motion.button>
            )}
          </div>

          <div className="filter-selects-row">
            <div
              className="filter-label-inline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--text-secondary)",
                fontSize: "0.8rem",
              }}
            >
              <SlidersHorizontal size={14} />
              <span>Filter:</span>
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="select-pill"
              aria-label="Category Filter"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {activeType !== "HANDBAG" && (
              <select
                value={warmthFilter}
                onChange={(e) => onWarmthFilterChange(e.target.value)}
                className="select-pill"
                aria-label="Warmth Rating Filter"
              >
                <option value="ALL">Any Warmth</option>
                <option value="Lightweight">Lightweight / Summer</option>
                <option value="All-Season">All-Season</option>
                <option value="Heavyweight">Heavyweight / Winter</option>
              </select>
            )}

            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="select-pill"
              aria-label="Sort Products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>

            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={clearAllFilters}
                className="select-pill"
                style={{
                  color: "var(--accent-cognac)",
                  borderColor: "rgba(166, 109, 79, 0.3)",
                  fontWeight: 600,
                }}
              >
                Reset
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Loading Shimmer Skeleton Cards */}
        {loading ? (
          <div className="product-grid">
            {[0, 1, 2, 3, 4, 5].map((skeleton) => (
              <motion.div
                key={skeleton}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: skeleton * 0.05 }}
                className="product-card"
              >
                <div className="product-media skeleton-shimmer" />
                <div className="product-card-body">
                  <div
                    className="skeleton-shimmer"
                    style={{ height: "10px", width: "42%", borderRadius: "999px", marginBottom: "0.5rem" }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{ height: "18px", width: "85%", borderRadius: "6px", marginBottom: "0.45rem" }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{ height: "12px", width: "65%", borderRadius: "6px" }}
                  />
                  <div
                    className="product-card-footer"
                    style={{ paddingTop: "1rem", justifyContent: "flex-start", gap: "0.5rem" }}
                  >
                    <span
                      className="skeleton-shimmer"
                      style={{ width: "16px", height: "16px", borderRadius: "50%" }}
                    />
                    <span
                      className="skeleton-shimmer"
                      style={{ width: "16px", height: "16px", borderRadius: "50%" }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "clamp(2.5rem, 6vw, 4.5rem) 1.5rem",
              backgroundColor: "var(--bg-elevated)",
              borderRadius: "20px",
              border: "1px dashed var(--border-strong)",
            }}
          >
            <Sparkles
              size={28}
              style={{ marginInline: "auto", color: "var(--accent-cognac)", marginBottom: "0.85rem" }}
            />
            <h3 style={{ fontSize: "clamp(1.45rem, 3vw, 1.75rem)", fontWeight: 400 }}>
              No matching atelier pieces
            </h3>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.4rem", marginBottom: "1.4rem", fontSize: "0.9rem" }}>
              Try clearing your search query or viewing all handbags and comforters.
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={clearAllFilters}
              className="btn-primary btn-sheen"
            >
              View Complete Collection
            </motion.button>
          </motion.div>
        ) : (
          <motion.div layout className="product-grid">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
