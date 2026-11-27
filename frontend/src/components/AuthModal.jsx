import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, UserCheck } from "lucide-react";
import { authApi } from "../api/client";

function AuthModalDialog({ onClose, user, onAuthSuccess, onLogout }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await authApi.register({ username, email, password });
      }
      await authApi.login(email, password);
      const profile = await authApi.whoami();
      onAuthSuccess(profile);
      onClose();
    } catch (err) {
      const msg =
        err.data?.detail ||
        err.data?.email?.[0] ||
        err.data?.password?.[0] ||
        err.message ||
        "Authentication failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
      aria-label="Atelier Membership"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 36 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 28 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="auth-modal-card"
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onClose}
          aria-label="Close membership dialog"
          style={{
            position: "absolute",
            top: "1.1rem",
            right: "1.1rem",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            backgroundColor: "var(--bg-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </motion.button>

        {user ? (
          <div style={{ textAlign: "center", paddingBlock: "1rem" }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "var(--bg-secondary)",
                marginInline: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <UserCheck size={24} color="var(--accent-cognac)" />
            </motion.div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 400 }}>
              Welcome, {user.username || "Atelier Member"}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              {user.email}
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="btn-secondary"
              style={{ marginTop: "1.75rem", width: "100%", justifyContent: "center" }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </motion.button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.4rem" }}>
              <span
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent-cognac)",
                  fontWeight: 600,
                }}
              >
                Maison Vélour Membership
              </span>
              <h3 style={{ fontSize: "1.9rem", fontWeight: 400, marginTop: "0.2rem" }}>
                {mode === "login" ? "Welcome Back" : "Join the Atelier"}
              </h3>
            </div>

            {/* Sliding Mode Switcher */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                padding: "4px",
                borderRadius: "999px",
                backgroundColor: "var(--bg-secondary)",
                marginBottom: "1.3rem",
              }}
            >
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setMode(tab);
                    setError("");
                  }}
                  style={{
                    position: "relative",
                    paddingBlock: "0.52rem",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: mode === tab ? "var(--bg-primary)" : "var(--text-secondary)",
                    zIndex: 1,
                  }}
                >
                  {mode === tab && (
                    <motion.span
                      layoutId="authTabPill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "999px",
                        backgroundColor: "var(--text-primary)",
                        zIndex: -1,
                      }}
                    />
                  )}
                  {tab === "login" ? "Sign In" : "Register"}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}
            >
              <AnimatePresence initial={false}>
                {mode === "register" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <label
                      style={{
                        fontSize: "0.76rem",
                        fontWeight: 600,
                        display: "block",
                        marginBottom: "0.3rem",
                      }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Elena Rostova"
                      className="search-input"
                      style={{ paddingLeft: "1rem" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="search-input"
                  style={{ paddingLeft: "1rem" }}
                />
              </div>

              <div>
                <label
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.3rem",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="search-input"
                  style={{ paddingLeft: "1rem" }}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: "0.8rem",
                    color: "#b54b4b",
                    backgroundColor: "rgba(181,75,75,0.08)",
                    padding: "0.6rem 0.85rem",
                    borderRadius: "10px",
                  }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="btn-primary btn-sheen"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.35rem" }}
              >
                {loading
                  ? "Authenticating..."
                  : mode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function AuthModal({ isOpen, onClose, user, onAuthSuccess, onLogout }) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <AuthModalDialog
          onClose={onClose}
          user={user}
          onAuthSuccess={onAuthSuccess}
          onLogout={onLogout}
        />
      )}
    </AnimatePresence>
  );
}
