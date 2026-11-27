import { useState, useEffect, useMemo, useRef } from "react";
import { MotionConfig, AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import "./App.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DualWorldsSection from "./components/DualWorldsSection";
import CatalogSection from "./components/CatalogSection";
import AtelierStorySection from "./components/AtelierStorySection";
import ProductModal from "./components/ProductModal";
import CartDrawer from "./components/CartDrawer";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";

import { storeApi, authApi } from "./api/client";
import { CURATED_PRODUCTS, CURATED_CATEGORIES } from "./data/curatedCatalog";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const [products, setProducts] = useState(CURATED_PRODUCTS);
  const [categories, setCategories] = useState(CURATED_CATEGORIES);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeType, setActiveType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [warmthFilter, setWarmthFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("featured");

  // Interactive UI States
  const [activeProduct, setActiveProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Persistent Cart & Wishlist
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("velour_cart") || "[]");
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("velour_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("velour_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("velour_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Load store catalog & check auth token on mount
  useEffect(() => {
    let active = true;

    async function loadStoreData() {
      try {
        const [prodData, catData] = await Promise.all([
          storeApi.getProducts(),
          storeApi.getCategories(),
        ]);

        const list = Array.isArray(prodData) ? prodData : prodData?.results || [];
        const cats = Array.isArray(catData) ? catData : catData?.results || [];

        if (active && list.length > 0) {
          setProducts(list);
          setIsLiveBackend(true);
        }
        if (active && cats.length > 0) {
          setCategories(cats);
        }
      } catch {
        // Gracefully remain on curated showcase if backend isn't running or empty
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadUser() {
      const token = localStorage.getItem("velour_access_token");
      if (!token) return;
      try {
        const profile = await authApi.whoami();
        if (active) setUser(profile);
      } catch {
        authApi.logout();
      }
    }

    loadStoreData();
    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 2600);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeType !== "ALL") {
      list = list.filter((p) => p.product_type === activeType);
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    if (warmthFilter !== "ALL") {
      list = list.filter((p) =>
        (p.warmth_rating || "").toLowerCase().includes(warmthFilter.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.fill_material?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, activeType, selectedCategory, warmthFilter, searchQuery, sortBy]);

  const handleOpenProduct = async (product) => {
    setActiveProduct(product);
    if (isLiveBackend) {
      try {
        const fullDetail = await storeApi.getProductDetail(product.id);
        setActiveProduct(fullDetail);
      } catch {
        // Keep initial product object if detail fetch fails
      }
    }
  };

  const handleAddToCart = (product, variant, quantity = 1) => {
    const variantId = variant?.id || "default";
    const key = `${product.id}__${variantId}`;
    const price = variant?.effective_price || product.base_price;
    const variantLabel = variant
      ? [variant.size_detail?.name, variant.color_detail?.name].filter(Boolean).join(" · ")
      : product.product_type === "COMFORTER"
      ? "Standard"
      : "Atelier Classic";
    const image = product.primary_image || product.images?.[0]?.image_url || "";

    setCart((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price,
          variantLabel,
          image,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} to your bag`);
  };

  const handleUpdateQty = (key, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleExploreType = (type) => {
    setActiveType(type);
    setSelectedCategory("ALL");
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFocusSearch = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => searchInputRef.current?.focus(), 420);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="page-shell">
        <motion.div className="scroll-progress-bar" style={{ scaleX }} aria-hidden="true" />

        <Navbar
          activeType={activeType}
          onSelectType={setActiveType}
          cartCount={cartCount}
          wishlistCount={wishlist.length}
          onOpenCart={() => setCartOpen(true)}
          onOpenAuth={() => setAuthOpen(true)}
          onFocusSearch={handleFocusSearch}
          user={user}
        />

        <main style={{ flex: 1 }}>
          <HeroSection onExploreType={handleExploreType} />

          <DualWorldsSection onSelectWorld={handleExploreType} />

          <CatalogSection
            products={filteredProducts}
            categories={categories}
            activeType={activeType}
            onSelectType={(type) => {
              setActiveType(type);
              if (type === "HANDBAG") setWarmthFilter("ALL");
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            warmthFilter={warmthFilter}
            onWarmthFilterChange={setWarmthFilter}
            searchInputRef={searchInputRef}
            loading={loading}
            isLiveBackend={isLiveBackend}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onQuickView={handleOpenProduct}
            onAddToCart={handleAddToCart}
          />

          <AtelierStorySection />
        </main>

        <Footer onSelectType={handleExploreType} />

        {/* Modals & Drawers */}
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCart([])}
        />

        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          user={user}
          onAuthSuccess={(profile) => {
            setUser(profile);
            showToast(`Signed in as ${profile.username || profile.email}`);
          }}
          onLogout={() => {
            authApi.logout();
            setUser(null);
            showToast("Signed out");
          }}
        />

        {/* Floating Luxury Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 24, scale: 0.92, x: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
              exit={{ opacity: 0, y: 16, scale: 0.92, x: "-50%" }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              style={{
                position: "fixed",
                bottom: "max(1.25rem, env(safe-area-inset-bottom))",
                left: "50%",
                zIndex: 80,
                maxWidth: "calc(100vw - 2rem)",
                overflow: "hidden",
                backgroundColor: "#1b1917",
                color: "#faf7f2",
                padding: "0.75rem 1.25rem",
                borderRadius: "999px",
                fontSize: "0.82rem",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                boxShadow: "0 16px 36px rgba(0,0,0,0.24)",
              }}
            >
              <Check size={15} color="var(--accent-brass)" style={{ flexShrink: 0 }} />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {toast}
              </span>
              <motion.span
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 2.6, ease: "linear" }}
                style={{
                  position: "absolute",
                  left: "14px",
                  right: "14px",
                  bottom: "2px",
                  height: "2px",
                  backgroundColor: "var(--accent-brass)",
                  opacity: 0.7,
                  transformOrigin: "left",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
