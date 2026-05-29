export const DEFAULT_MARGINS = {
  VELAS: 23,
  DETERGENTE: 6,
  BEBIDAS: 10,
  MIXTO: 15,
  OTRO: 0,
};

const LS_KEY = "mcs_margins";

export function loadMargins() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_MARGINS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MARGINS, ...parsed };
  } catch {
    return { ...DEFAULT_MARGINS };
  }
}

export function saveMargins(margins) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(margins));
  } catch {
    /* ignore */
  }
}

export function marginPctDecimal(category, margins = DEFAULT_MARGINS) {
  const cat = category || "OTRO";
  const pct = margins[cat] ?? margins.OTRO ?? 0;
  return (Number(pct) || 0) / 100;
}

/** Recalcula marginPct y profitUSD con la config actual. */
export function applyMarginsToSales(lines, margins = DEFAULT_MARGINS) {
  return (lines || []).map((line) => {
    const marginPct = marginPctDecimal(line.productCategory, margins);
    const amount = line.amountUSD || 0;
    return {
      ...line,
      marginPct,
      profitUSD: amount * marginPct,
    };
  });
}

export const MARGIN_LABELS = {
  VELAS: "Velas",
  DETERGENTE: "Detergente",
  BEBIDAS: "Bebidas",
  MIXTO: "Mixto",
  OTRO: "Otro",
};

export const EDITABLE_MARGIN_KEYS = ["VELAS", "DETERGENTE", "BEBIDAS", "MIXTO"];
