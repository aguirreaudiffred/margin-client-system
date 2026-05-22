/** Conversión kg ↔ lbs (por caja). */
export const KG_TO_LBS = 2.2046226218;

export function lbsFromKg(kg) {
  return (Number(kg) || 0) * KG_TO_LBS;
}

export function kgFromLbs(lbs) {
  return (Number(lbs) || 0) / KG_TO_LBS;
}

/** Normaliza peso de catálogo: limpieza en kg, velas en lbs → guarda ambos. */
export function normalizeProductWeight(p) {
  const unit = String(p?.weightUnit || p?.weightNote || "lbs")
    .toLowerCase()
    .includes("kg")
    ? "kg"
    : "lbs";

  let weightKg = Number(p?.weightKg) || 0;
  let weightLbs = Number(p?.weightLbs) || 0;
  const raw = Number(p?.weight) || 0;

  if (raw > 0 && !weightKg && !weightLbs) {
    if (unit === "kg") {
      weightKg = raw;
      weightLbs = lbsFromKg(raw);
    } else {
      weightLbs = raw;
      weightKg = kgFromLbs(raw);
    }
  } else if (weightKg > 0 && !weightLbs) {
    weightLbs = lbsFromKg(weightKg);
  } else if (weightLbs > 0 && !weightKg) {
    weightKg = kgFromLbs(weightLbs);
  }

  return {
    ...p,
    weightKg,
    weightLbs,
    weightUnit: unit,
    weightNote: unit === "kg" ? "kg por caja" : "lbs por caja",
  };
}

export function productWeightLbs(p) {
  const n = normalizeProductWeight(p || {});
  return n.weightLbs;
}

export function productWeightKg(p) {
  const n = normalizeProductWeight(p || {});
  return n.weightKg;
}

export function fmtKg(n) {
  return `${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`;
}

export function fmtLbs(n) {
  return `${(n || 0).toLocaleString("en-US", { maximumFractionDigits: 1 })} lbs`;
}

export function fmtDualWeight(kg, lbs) {
  if (!kg && !lbs) return "—";
  return `${fmtKg(kg)} · ${fmtLbs(lbs)}`;
}
