import { PRODUCT_CATEGORIES } from "./salesImport.js";

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function startOfWeekISO(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x.toISOString().slice(0, 10);
}

export function filterSales(sales, { period = "all", poMonth, from, to, seller, client, category, zone } = {}) {
  const today = todayISO();
  const weekStart = startOfWeekISO();
  const monthStart = today.slice(0, 7) + "-01";

  return sales.filter((s) => {
    if (seller && seller !== "all") {
      const sn = normSeller(s.sellerName);
      if (seller === "Sin asignar" ? sn !== "Sin asignar" : sn !== seller) return false;
    }
    if (client && client !== "all" && s.client !== client) return false;
    if (category && category !== "all" && s.productCategory !== category) return false;
    if (zone && zone !== "all" && (s.zone || "Texas") !== zone) return false;

    if (poMonth && poMonth !== "all") {
      if (poMonthKey(s.poDate) !== poMonth) return false;
      return true;
    }

    if (!s.poDate) return period === "all";

    if (from && s.poDate < from) return false;
    if (to && s.poDate > to) return false;
    if (period === "today" && s.poDate !== today) return false;
    if (period === "week" && s.poDate < weekStart) return false;
    if (period === "month" && s.poDate < monthStart) return false;
    return true;
  });
}

function normSeller(n) {
  return String(n || "").trim() || "Sin asignar";
}

/** YYYY-MM from PO Date (Notion column). */
export function poMonthKey(poDate) {
  if (!poDate || typeof poDate !== "string") return null;
  const m = poDate.match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : null;
}

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function formatMonthLabel(yearMonth) {
  if (!yearMonth || yearMonth === "all") return "Todos los meses";
  const [y, mo] = yearMonth.split("-");
  const idx = parseInt(mo, 10) - 1;
  if (idx < 0 || idx > 11) return yearMonth;
  return `${MONTH_NAMES[idx]} ${y}`;
}

/** Unique months from poDate, newest first. */
export function listPoMonths(sales) {
  const set = new Set();
  for (const s of sales) {
    const k = poMonthKey(s.poDate);
    if (k) set.add(k);
  }
  return [...set].sort((a, b) => b.localeCompare(a));
}

export function filterSalesByPoMonth(sales, { seller = "all", month = "all" } = {}) {
  return sales.filter((s) => {
    if (seller && seller !== "all") {
      const sn = normSeller(s.sellerName);
      if (seller === "Sin asignar" ? sn !== "Sin asignar" : sn !== seller) return false;
    }
    if (month && month !== "all") {
      if (poMonthKey(s.poDate) !== month) return false;
    }
    return true;
  });
}

/** Monthly totals for one seller (by PO Date). */
export function summarizeSellerByMonth(sales, seller) {
  const filtered = filterSalesByPoMonth(sales, { seller, month: "all" });
  const byMonth = {};
  for (const s of filtered) {
    const k = poMonthKey(s.poDate) || "sin-fecha";
    if (!byMonth[k]) byMonth[k] = { month: k, revenue: 0, profit: 0, orders: 0 };
    byMonth[k].revenue += s.amountUSD || 0;
    byMonth[k].profit += s.profitUSD || 0;
    byMonth[k].orders += 1;
  }
  return Object.values(byMonth)
    .map((r) => ({
      ...r,
      revenue: +r.revenue.toFixed(2),
      profit: +r.profit.toFixed(2),
    }))
    .sort((a, b) => {
      if (a.month === "sin-fecha") return 1;
      if (b.month === "sin-fecha") return -1;
      return b.month.localeCompare(a.month);
    });
}

export function summarizeSales(sales) {
  const total = sales.reduce((a, s) => a + (s.amountUSD || 0), 0);
  const byClient = {};
  const bySeller = {};
  const byZone = {};
  const byCategory = {};
  const byDay = {};

  sales.forEach((s) => {
    const amt = s.amountUSD || 0;
    byClient[s.client] = (byClient[s.client] || 0) + amt;
    const sel = normSeller(s.sellerName);
    bySeller[sel] = (bySeller[sel] || 0) + amt;
    const z = s.zone || "Texas";
    byZone[z] = (byZone[z] || 0) + amt;
    byCategory[s.productCategory] = (byCategory[s.productCategory] || 0) + amt;
    const day = s.poDate || "sin-fecha";
    byDay[day] = (byDay[day] || 0) + amt;
  });

  const clients = Object.entries(byClient).map(([name, revenue]) => ({
    name,
    revenue: +revenue.toFixed(2),
    orders: sales.filter((s) => s.client === name).length,
  })).sort((a, b) => b.revenue - a.revenue);

  const sellers = Object.entries(bySeller).map(([name, revenue]) => ({
    name,
    revenue: +revenue.toFixed(2),
    orders: sales.filter((s) => normSeller(s.sellerName) === name).length,
  })).sort((a, b) => b.revenue - a.revenue);

  const zones = Object.entries(byZone).map(([name, revenue]) => ({
    name,
    revenue: +revenue.toFixed(2),
    orders: sales.filter((s) => (s.zone || "Texas") === name).length,
  })).sort((a, b) => b.revenue - a.revenue);

  const categories = PRODUCT_CATEGORIES.map((cat) => ({
    name: cat,
    revenue: +(byCategory[cat] || 0).toFixed(2),
    orders: sales.filter((s) => s.productCategory === cat).length,
  })).filter((c) => c.revenue > 0 || c.orders > 0);

  const days = Object.entries(byDay)
    .map(([day, revenue]) => ({ day, revenue: +revenue.toFixed(2) }))
    .sort((a, b) => a.day.localeCompare(b.day));

  return {
    total,
    orderCount: sales.length,
    clients,
    sellers,
    zones,
    categories,
    days,
    today: sales.filter((s) => s.poDate === todayISO()).reduce((a, s) => a + s.amountUSD, 0),
    week: sales.filter((s) => s.poDate >= startOfWeekISO()).reduce((a, s) => a + s.amountUSD, 0),
  };
}
