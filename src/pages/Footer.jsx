import { Cpu, Globe, MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--glass-border)",
        padding: "40px 8%",
        background: "var(--glass-navbar-bg)",
        color: "var(--text-secondary)",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "var(--color-primary)",
            }}
          />
          <span
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "0.5px",
            }}
          >
            Anshul AutoPilot
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
            className="hover:text-primary"
          >
            <Globe size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
            className="hover:text-primary"
          >
            <MessageSquare size={20} />
          </a>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          gap: "12px",
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} Anshul AutoPilot. All rights
          reserved.
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Cpu size={14} style={{ color: "var(--color-primary)" }} /> Powered
            by Anshul Dhiman developer
          </span>
          <span>v1.0 (Development Build)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
