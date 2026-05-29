import { useState, useRef, useMemo } from "react";
import { readNotionSalesFile, mergeSales, PRODUCT_CATEGORIES } from "../lib/salesImport.js";
import { fetchNotionSales } from "../lib/notionSync.js";
import { filterSales, summarizeSales, listPoMonths, formatMonthLabel } from "../lib/salesAnalytics.js";

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
  ["pos", "POs"],
  ["cliente", "Por cliente"],
  ["vendedor", "Por vendedor"],
  ["zona", "Por zona"],
  ["producto", "Por producto"],
  ["actualizar", "Actualizar reporte"],
];

export default function SalesPanel({ sales, setSales, salesMeta, setSalesMeta, sellers, R }) {
  const [period, setPeriod] = useState("all");
  const [poMonth, setPoMonth] = useState("all");
  const availableMonths = useMemo(() => listPoMonths(sales), [sales]);
  const [view, setView] = useState("resumen");
  const [fSeller, setFSeller] = useState("all");
  const [fCat, setFCat] = useState("all");
  const [importMode, setImportMode] = useState("merge");
  const [importMsg, setImportMsg] = useState(null);
  const [importing, setImporting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileRef = useRef();

  const filtered = useMemo(
    () => filterSales(sales, { period, poMonth, seller: fSeller, category: fCat }),
    [sales, period, poMonth, fSeller, fCat],
  );
  const sum = useMemo(() => summarizeSales(filtered), [filtered]);
  const totalProfit = useMemo(() => filtered.reduce((a, s) => a + (s.profitUSD || 0), 0), [filtered]);
  const profitPct = sum.total > 0 ? totalProfit / sum.total : 0;
  const periodEmpty = sales.length > 0 && filtered.length === 0;

  const handleNotionSync = async () => {
    setSyncing(true);
    setImportMsg(null);
    try {
      const data = await fetchNotionSales();
      const lines = data.lines;
      setSales((prev) => mergeSales(prev, lines, importMode));
      setSalesMeta({
        lastImport: new Date().toISOString(),
        reportLabel: "Notion API",
        batchId: lines[0]?.batchId,
        rowCount: lines.length,
        mode: importMode,
        source: "notion-api",
      });
      setImportMsg(`✓ ${lines.length} ventas desde Notion API (${importMode === "replace" ? "reemplazo" : "fusionado"})`);
      setView("resumen");
    } catch (e) {
      setImportMsg(
        e.message +
          ". En GitHub Pages sube el Excel; la API vive en Vercel con NOTION_TOKEN y NOTION_DATABASE_ID.",
      );
    } finally {
      setSyncing(false);
    }
  };

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
          <div style={{ fontSize: 8.5, color: "var(--fx-muted)" }}>
            {salesMeta?.reportLabel ? `Último: ${salesMeta.reportLabel}` : "Sin reporte cargado"} · {sales.length} POs
            {salesMeta?.lastImport && ` · ${new Date(salesMeta.lastImport).toLocaleString("es-MX")}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-end" }}>
          {PERIODS.map(([k, v]) => (
            <button
              key={k}
              className={`ghost ${period === k && poMonth === "all" ? "on" : ""}`}
              onClick={() => {
                setPeriod(k);
                setPoMonth("all");
              }}
            >
              {v}
            </button>
          ))}
          <div style={{ minWidth: 160 }}>
            <div className="lbl">Mes (PO Date)</div>
            <select
              className="sel"
              value={poMonth}
              onChange={(e) => {
                setPoMonth(e.target.value);
                if (e.target.value !== "all") setPeriod("all");
              }}
              style={{ width: "100%" }}
            >
              <option value="all">Todos los meses</option>
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ borderBottom: "1px solid #0e0e1c", marginBottom: 14, display: "flex", flexWrap: "wrap" }}>
        {VIEWS.map(([k, v]) => (
          <button key={k} className={`rtab ${view === k ? "on" : ""}`} onClick={() => setView(k)}>
            {v}
          </button>
        ))}
      </div>

      {periodEmpty && (
        <div className="ni" style={{ marginBottom: 12, fontSize: 8.5, lineHeight: 1.5 }}>
          Hay <b>{sales.length} POs</b> cargados, pero ninguno coincide con el filtro
          {poMonth !== "all" ? (
            <> de <b>{formatMonthLabel(poMonth)}</b></>
          ) : (
            <> (<b>{PERIODS.find(([k]) => k === period)?.[1] || period}</b>)</>
          )}
          . Prueba{" "}
          <button type="button" className="ghost" style={{ padding: "2px 8px", fontSize: 8 }} onClick={() => { setPeriod("all"); setPoMonth("all"); }}>
            Todo
          </button>{" "}
          o elige otro mes en el selector <b>Mes (PO Date)</b>.
        </div>
      )}

      {view !== "actualizar" && (
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div>
            <div className="lbl">Vendedor</div>
            <select className="sel" style={{ width: "auto", minWidth: 160 }} value={fSeller} onChange={(e) => setFSeller(e.target.value)}>
              <option value="all">Todos</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
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
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn" disabled={importing} onClick={() => fileRef.current?.click()}>
              {importing ? "Importando…" : "📥 Subir reporte Notion (.xlsx)"}
            </button>
            <button className="btn" style={{ background: "#1a1a2e", borderColor: "#6c8dfa", color: "#6c8dfa" }} disabled={syncing || importing} onClick={handleNotionSync}>
              {syncing ? "Sincronizando…" : "⟳ Sincronizar desde Notion API"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { if (e.target.files[0]) handleImport(e.target.files[0]); e.target.value = ""; }} />
          {importMsg && <div className={importMsg.startsWith("✓") ? "ng" : "nr"} style={{ marginTop: 12, fontSize: 8.5 }}>{importMsg}</div>}
          <div className="ni" style={{ marginTop: 14, fontSize: 8, lineHeight: 1.5 }}>
            <b>API automática:</b> en Vercel → Settings → Environment Variables: <code>NOTION_TOKEN</code>, <code>NOTION_DATABASE_ID</code> (ID de la base del reporte).
            La app en GitHub Pages puede usar <code>VITE_NOTION_SYNC_URL=https://margin-client-system.vercel.app/api/notion-sync</code> al hacer build.
          </div>
        </div>
      )}

      {view === "resumen" && (
        <>
          <div className="g4" style={{ marginBottom: 16 }}>
            {[["HOY", fU(sum.today), "var(--fx-green)"], ["ESTA SEMANA", fU(sum.week), "var(--fx-green-dark)"], ["VENTA", fU(sum.total), "var(--fx-text)"], ["GANANCIA EST.", `${fU(totalProfit)} · ${(profitPct * 100).toFixed(1)}%`, "var(--fx-red)"]].map(([l, v, c]) => (
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
                    <Bar dataKey="revenue" fill="#00843d" radius={[3, 3, 0, 0]} />
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
                        <Cell key={i} fill={["#00843d", "#006b31", "#c8102e", "#5c6670", "#888"][i % 5]} />
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

      {view === "pos" && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>PO</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Tipo</th>
                <th>Venta USD</th>
                <th>%</th>
                <th>Ganancia est.</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .slice()
                .sort((a, b) => String(b.poDate || "").localeCompare(String(a.poDate || "")))
                .map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--fx-green)", fontSize: 9, fontWeight: 600 }}>{s.po || "—"}</td>
                    <td style={{ color: "var(--fx-muted)", fontSize: 9 }}>{s.poDate || "—"}</td>
                    <td style={{ fontSize: 10 }}>{s.client}</td>
                    <td style={{ fontSize: 10 }}>{s.sellerName || "Sin asignar"}</td>
                    <td style={{ color: "var(--fx-green-dark)", fontSize: 9 }}>{s.productCategory || "—"}</td>
                    <td className="stat-green">{fU(s.amountUSD)}</td>
                    <td style={{ color: "var(--fx-muted)" }}>{((s.marginPct || 0) * 100).toFixed(0)}%</td>
                    <td className="stat-green">{fU(s.profitUSD || 0)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {["cliente", "vendedor", "zona", "producto"].includes(view) && (
        <div className="tbl-wrap">
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
