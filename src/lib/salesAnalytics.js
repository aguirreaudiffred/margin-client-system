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

export function filterSales(sales, { period = "all", from, to, seller, client, category, zone } = {}) {
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
