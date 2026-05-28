import { useMemo, useState } from "react";
import {
  filterSalesByPoMonth,
  formatMonthLabel,
  listPoMonths,
  summarizeSellerByMonth,
} from "../lib/salesAnalytics.js";

const fU = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

export default function ReportesPanel({ sales, sellers }) {
  const months = useMemo(() => listPoMonths(sales), [sales]);
  const [repSeller, setRepSeller] = useState(sellers[0]?.name || "all");
  const [repMonth, setRepMonth] = useState("all");

  const byMonth = useMemo(
    () => (repSeller && repSeller !== "all" ? summarizeSellerByMonth(sales, repSeller) : []),
    [sales, repSeller],
  );

  const monthRows = useMemo(
    () => filterSalesByPoMonth(sales, { seller: repSeller, month: repMonth }),
    [sales, repSeller, repMonth],
  );

  const totals = useMemo(() => {
    const revenue = monthRows.reduce((a, s) => a + (s.amountUSD || 0), 0);
    const profit = monthRows.reduce((a, s) => a + (s.profitUSD || 0), 0);
    return { revenue, profit, orders: monthRows.length };
  }, [monthRows]);

  return (
    <div className="fade">
      <div className="slbl">Reportes por vendedor · PO Date (Notion)</div>
      <p style={{ fontSize: 12, color: "var(--fx-muted)", marginBottom: 16, lineHeight: 1.5 }}>
        Selecciona un vendedor para ver sus pedidos por mes según la fecha <b>PO Date</b> del reporte Notion.
        Luego elige un mes (ej. Mayo) para ver el detalle y totales.
      </p>

      <div className="g2" style={{ marginBottom: 20 }}>
        <div>
          <div className="lbl">Vendedor</div>
          <select
            className="sel"
            value={repSeller}
            onChange={(e) => {
              setRepSeller(e.target.value);
              setRepMonth("all");
            }}
          >
            <option value="all">— Selecciona vendedor —</option>
            {sellers.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
            <option value="Sin asignar">Sin asignar</option>
          </select>
        </div>
        <div>
          <div className="lbl">Mes (PO Date)</div>
          <select
            className="sel"
            value={repMonth}
            disabled={repSeller === "all"}
            onChange={(e) => setRepMonth(e.target.value)}
          >
            <option value="all">Todos los meses (resumen)</option>
            {months.map((m) => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {repSeller === "all" ? (
        <div className="ni">Elige un vendedor para ver sus pedidos por mes.</div>
      ) : (
        <>
          {repMonth === "all" ? (
            <>
              <div className="g3" style={{ marginBottom: 18 }}>
                {byMonth.map((row) => (
                  <button
                    key={row.month}
                    type="button"
                    className={`month-pick ${repMonth === row.month ? "on" : ""}`}
                    onClick={() => setRepMonth(row.month === "sin-fecha" ? "all" : row.month)}
                  >
                    <div className="lbl" style={{ marginBottom: 4 }}>
                      {row.month === "sin-fecha" ? "Sin fecha PO" : formatMonthLabel(row.month)}
                    </div>
                    <div className="stat-green" style={{ fontSize: 20 }}>{fU(row.revenue)}</div>
                    <div style={{ fontSize: 11, color: "var(--fx-muted)", marginTop: 4 }}>
                      {row.orders} pedidos · Ganancia est. {fU(row.profit)}
                    </div>
                    {row.month !== "sin-fecha" ? (
                      <div style={{ fontSize: 10, color: "var(--fx-green)", marginTop: 8, fontWeight: 600 }}>
                        Ver detalle →
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
              {byMonth.length === 0 ? (
                <p style={{ color: "var(--fx-muted)", fontSize: 12 }}>Sin pedidos para este vendedor.</p>
              ) : null}
            </>
          ) : (
            <>
              <div className="g4" style={{ marginBottom: 18 }}>
                <div className="card">
                  <div className="lbl">Vendedor</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>{repSeller}</div>
                </div>
                <div className="card">
                  <div className="lbl">Mes</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, color: "var(--fx-green)" }}>
                    {formatMonthLabel(repMonth)}
                  </div>
                </div>
                <div className="card">
                  <div className="lbl">Venta total</div>
                  <div className="stat-green" style={{ fontSize: 22, marginTop: 6 }}>{fU(totals.revenue)}</div>
                </div>
                <div className="card">
                  <div className="lbl">Pedidos · Ganancia est.</div>
                  <div style={{ fontSize: 18, marginTop: 6 }}>
                    <span className="stat-green">{totals.orders}</span>
                    <span style={{ color: "var(--fx-muted)", fontSize: 12 }}> POs · </span>
                    <span className="stat-green">{fU(totals.profit)}</span>
                  </div>
                </div>
              </div>

              <button type="button" className="ghost" style={{ marginBottom: 12 }} onClick={() => setRepMonth("all")}>
                ← Volver a todos los meses
              </button>

              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>PO</th>
                      <th>PO Date</th>
                      <th>Cliente</th>
                      <th>Producto</th>
                      <th>Venta USD</th>
                      <th>%</th>
                      <th>Ganancia est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthRows
                      .slice()
                      .sort((a, b) => String(b.poDate || "").localeCompare(String(a.poDate || "")))
                      .map((s) => (
                        <tr key={s.id}>
                          <td style={{ color: "var(--fx-green)", fontWeight: 600 }}>{s.po || "—"}</td>
                          <td>{s.poDate || "—"}</td>
                          <td>{s.client}</td>
                          <td>{s.productCategory || "—"}</td>
                          <td className="stat-green">{fU(s.amountUSD)}</td>
                          <td>{((s.marginPct || 0) * 100).toFixed(0)}%</td>
                          <td className="stat-green">{fU(s.profitUSD || 0)}</td>
                        </tr>
                      ))}
                  </tbody>
                  {monthRows.length > 0 ? (
                    <tfoot>
                      <tr style={{ background: "var(--fx-green-light)", fontWeight: 700 }}>
                        <td colSpan={4}>Total {formatMonthLabel(repMonth)}</td>
                        <td className="stat-green">{fU(totals.revenue)}</td>
                        <td />
                        <td className="stat-green">{fU(totals.profit)}</td>
                      </tr>
                    </tfoot>
                  ) : null}
                </table>
              </div>
              {monthRows.length === 0 ? (
                <p style={{ marginTop: 12, color: "var(--fx-muted)", fontSize: 12 }}>
                  No hay pedidos de {repSeller} en {formatMonthLabel(repMonth)}.
                </p>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}
