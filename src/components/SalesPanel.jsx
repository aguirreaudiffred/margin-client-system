import { useState, useRef, useMemo } from "react";
import { readNotionSalesFile, mergeSales, PRODUCT_CATEGORIES } from "../lib/salesImport.js";
import { filterSales, summarizeSales } from "../lib/salesAnalytics.js";

const fU = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

const PERIODS = [
  ["today", "Hoy"],
  ["week", "Esta semana"],
  ["month", "Este mes"],
  ["all", "Todo"],
];

const VIEWS = [
  ["resumen", "Resumen"],
  ["cliente", "Por cliente"],
  ["vendedor", "Por vendedor"],
  ["zona", "Por zona"],
  ["producto", "Por producto"],
  ["actualizar", "Actualizar reporte"],
];

export default function SalesPanel({ sales, setSales, salesMeta, setSalesMeta, sellers, R }) {
  const [period, setPeriod] = useState("week");
  const [view, setView] = useState("resumen");
  const [fSeller, setFSeller] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [importMode, setImportMode] = useState("merge");
  const [importMsg, setImportMsg] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef();

  const filtered = useMemo(
    () => filterSales(sales, { period, seller: fSeller, category: fCat }),
    [sales, period, fSeller, fCat],
  );
  const sum = useMemo(() => summarizeSales(filtered), [filtered]);

  const handleImport = async (file) => {
    setImporting(true);
    setImportMsg(null);
    try {
      const { lines, errors } = await readNotionSalesFile(file, {
        reportLabel: file.name.replace(/\.(xlsx|xls)$/i, ""),
      });
      if (errors.length && !lines.length) {
        setImportMsg(errors.join(" "));
        return;
      }
      setSales((prev) => mergeSales(prev, lines, importMode));
      setSalesMeta({
        lastImport: new Date().toISOString(),
        reportLabel: file.name.replace(/\.(xlsx|xls|csv)$/i, ""),
        batchId: lines[0]?.batchId,
        rowCount: lines.length,
        mode: importMode,
      });
      setImportMsg(`✓ ${lines.length} ventas importadas (${importMode === "replace" ? "reemplazo total" : "fusionado por PO"})`);
      setView("resumen");
    } catch (e) {
      setImportMsg("Error: " + e.message);
    } finally {
      setImporting(false);
    }
  };

  const ChartShell = ({ h = 140, children }) =>
    R ? <R.ResponsiveContainer width="100%" height={h}>{children}</R.ResponsiveContainer> : <div className="chart-ph" style={{ height: h }} />;

  const { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } = R || {};

  return (
    <div className="fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <div className="slbl" style={{ marginBottom: 4 }}>Ventas · Reporte Notion</div>
          <div style={{ fontSize: 8.5, color: "#3a3a4a" }}>
            {salesMeta?.reportLabel ? `Último: ${salesMeta.reportLabel}` : "Sin reporte cargado"} · {sales.length} POs
            {salesMeta?.lastImport && ` · ${new Date(salesMeta.lastImport).toLocaleString("es-MX")}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PERIODS.map(([k, v]) => (
            <button key={k} className={`ghost ${period === k ? "on" : ""}`} style={period === k ? { borderColor: "#f0a500", color: "#f0a500" } : {}} onClick={() => setPeriod(k)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #0e0e1c", marginBottom: 14, display: "flex", flexWrap: "wrap" }}>
        {VIEWS.map(([k, v]) => (
          <button key={k} className={`rtab ${view === k ? "on" : ""}`} onClick={() => setView(k)}>
            {v}
          </button>
        ))}
      </div>

      {view !== "actualizar" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div>
            <div className="lbl">Vendedor</div>
            <select className="sel" style={{ width: "auto", minWidth: 160 }} value={fSeller} onChange={(e) => setFSeller(e.target.value)}>
              <option value="all">Todos</option>
              {[...new Set(sales.map((s) => s.sellerName).filter(Boolean))].sort().map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="Sin asignar">Sin asignar</option>
            </select>
          </div>
          <div>
            <div className="lbl">Producto</div>
            <select className="sel" style={{ width: "auto" }} value={fCat} onChange={(e) => setFCat(e.target.value)}>
              <option value="all">Todos</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {view === "actualizar" && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="slbl">Actualizar reporte semanal (lunes)</div>
          <p style={{ fontSize: 9, color: "#555", lineHeight: 1.5, marginBottom: 14 }}>
            Sube el Excel exportado de Notion (mismas columnas: Client, Amount, PO Date, Product, Sales Representative).
            Vendedores: <b>Luis Miguel Perez</b> y <b>Manuel Fernandez</b>.
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <label style={{ fontSize: 8.5, display: "flex", alignItems: "center", gap: 6 }}>
              <input type="radio" checked={importMode === "merge"} onChange={() => setImportMode("merge")} />
              Fusionar / actualizar por PO
            </label>
            <label style={{ fontSize: 8.5, display: "flex", alignItems: "center", gap: 6 }}>
              <input type="radio" checked={importMode === "replace"} onChange={() => setImportMode("replace")} />
              Reemplazar todas las ventas
            </label>
          </div>
          <button className="btn" disabled={importing} onClick={() => fileRef.current?.click()}>
            {importing ? "Importando…" : "📥 Subir reporte Notion (.xlsx)"}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) handleImport(e.target.files[0]); e.target.value = ""; }} />
          {importMsg && <div className={importMsg.startsWith("✓") ? "ng" : "nr"} style={{ marginTop: 12, fontSize: 8.5 }}>{importMsg}</div>}
          <div className="ni" style={{ marginTop: 14, fontSize: 8 }}>
            Paso 2 (próximo): conexión automática a Notion para agregar ventas sin subir archivo.
          </div>
        </div>
      )}

      {view === "resumen" && (
        <>
          <div className="g4" style={{ marginBottom: 16 }}>
            {[["HOY", fU(sum.today), "#f0a500"], ["ESTA SEMANA", fU(sum.week), "#00c896"], ["FILTRO ACTIVO", fU(sum.total), "#d8d4c8"], ["PEDIDOS", sum.orderCount, "#6c8dfa"]].map(([l, v, c]) => (
              <div key={l} className="card">
                <div className="lbl">{l}</div>
                <div style={{ fontSize: 20, color: c, marginTop: 6 }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{ marginBottom: 16 }}>
            <div className="card">
              <div className="lbl" style={{ marginBottom: 8 }}>Venta por día</div>
              {R && sum.days.length > 0 ? (
                <ChartShell h={150}>
                  <BarChart data={sum.days.filter((d) => d.day !== "sin-fecha")}>
                    <XAxis dataKey="day" tick={{ fill: "#3a3a4a", fontSize: 8 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => fU(v)} />
                    <Bar dataKey="revenue" fill="#f0a500" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ChartShell>
              ) : (
                <div style={{ fontSize: 8, color: "#333" }}>Sin datos</div>
              )}
            </div>
            <div className="card">
              <div className="lbl" style={{ marginBottom: 8 }}>Por tipo de producto</div>
              {R && sum.categories.length > 0 ? (
                <ChartShell h={150}>
                  <PieChart>
                    <Pie data={sum.categories} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={55} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 8 }}>
                      {sum.categories.map((_, i) => (
                        <Cell key={i} fill={["#f0a500", "#00c896", "#6c8dfa", "#c084fc", "#888"][i % 5]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => fU(v)} />
                  </PieChart>
                </ChartShell>
              ) : (
                <div style={{ fontSize: 8, color: "#333" }}>Sin datos</div>
              )}
            </div>
          </div>
          <div className="g2">
            <div className="card">
              <div className="lbl" style={{ marginBottom: 8 }}>Top clientes</div>
              {sum.clients.slice(0, 6).map((c, i) => (
                <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1c", fontSize: 9.5 }}>
                  <span style={{ color: "#888" }}>{i + 1}. {c.name}</span>
                  <span style={{ color: "#f0a500" }}>{fU(c.revenue)}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="lbl" style={{ marginBottom: 8 }}>Por vendedor</div>
              {sum.sellers.map((s) => (
                <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #0e0e1c", fontSize: 9.5 }}>
                  <span>{s.name}</span>
                  <span style={{ color: "#00c896" }}>{fU(s.revenue)} · {s.orders} PO</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {["cliente", "vendedor", "zona", "producto"].includes(view) && (
        <div className="ovfl" style={{ background: "#0d0d1c", border: "1px solid #181826" }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>{view === "cliente" ? "Cliente" : view === "vendedor" ? "Vendedor" : view === "zona" ? "Zona" : "Producto"}</th>
                <th>Pedidos</th>
                <th>Venta USD</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {(view === "cliente" ? sum.clients : view === "vendedor" ? sum.sellers : view === "zona" ? sum.zones : sum.categories).map((row) => (
                <tr key={row.name}>
                  <td style={{ fontSize: 10 }}>{row.name}</td>
                  <td>{row.orders}</td>
                  <td style={{ color: "#f0a500" }}>{fU(row.revenue)}</td>
                  <td style={{ color: "#555" }}>{sum.total > 0 ? ((row.revenue / sum.total) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
