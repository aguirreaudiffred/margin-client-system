import { EDITABLE_MARGIN_KEYS, MARGIN_LABELS } from "../lib/marginConfig.js";

export default function MarginEditor({ margins, setMargins }) {
  const update = (key, raw) => {
    const n = parseFloat(String(raw).replace(",", "."));
    setMargins((prev) => ({
      ...prev,
      [key]: Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0,
    }));
  };

  return (
    <div className="card" style={{ marginBottom: 18 }}>
      <div className="slbl" style={{ marginBottom: 10 }}>Márgenes estimados (% sobre venta)</div>
      <p style={{ fontSize: 11, color: "var(--fx-muted)", marginBottom: 14, lineHeight: 1.45 }}>
        Ajusta los porcentajes y la ganancia estimada se recalcula al instante en todo el sistema.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {EDITABLE_MARGIN_KEYS.map((key) => (
          <label key={key} style={{ display: "block" }}>
            <span className="lbl">{MARGIN_LABELS[key]}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <input
                type="number"
                className="inp"
                min={0}
                max={100}
                step={0.5}
                value={margins[key] ?? 0}
                onChange={(e) => update(key, e.target.value)}
                style={{ width: "100%", fontWeight: 700, color: "var(--fx-green)" }}
              />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fx-muted)" }}>%</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
