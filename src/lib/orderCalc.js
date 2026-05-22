import {
  productWeightKg,
  productWeightLbs,
  kgFromLbs,
  fmtKg,
  fmtLbs,
} from "./weightUnits.js";

/** Límite de circulación en EU (lbs por pedido / embarque). */
export const MAX_CIRCULATION_LBS = 44000;
export { fmtKg, fmtLbs };

export function lineWeightLbs(item, prods) {
  const p = prods.find((x) => x.sku === item.sku);
  const perCase = productWeightLbs(p);
  return (Number(item.quantity) || 0) * perCase;
}

export function lineWeightKg(item, prods) {
  const p = prods.find((x) => x.sku === item.sku);
  const perCase = productWeightKg(p);
  return (Number(item.quantity) || 0) * perCase;
}

export function orderWeightLbs(items, prods) {
  return (items || []).reduce((a, it) => a + lineWeightLbs(it, prods), 0);
}

export function orderWeightKg(items, prods) {
  return (items || []).reduce((a, it) => a + lineWeightKg(it, prods), 0);
}

export function weightSummary(items, prods) {
  const totalWeightLbs = orderWeightLbs(items, prods);
  const totalWeightKg = orderWeightKg(items, prods);
  const maxWeightLbs = MAX_CIRCULATION_LBS;
  const maxWeightKg = kgFromLbs(maxWeightLbs);
  const remainingLbs = maxWeightLbs - totalWeightLbs;
  const remainingKg = maxWeightKg - totalWeightKg;
  const missingSkus = [
    ...new Set(
      (items || [])
        .filter((it) => {
          const p = prods.find((x) => x.sku === it.sku);
          return !p || !productWeightLbs(p);
        })
        .map((it) => it.sku)
        .filter(Boolean),
    ),
  ];

  let weightStatus = "ok";
  let weightMessage = "";

  if (missingSkus.length) {
    weightStatus = "unknown";
    weightMessage = `Faltan pesos en catálogo para ${missingSkus.length} SKU. Importa Excel/CSV con peso y unidad (kg o lbs).`;
  } else if (totalWeightLbs > maxWeightLbs) {
    weightStatus = "over";
    const overLbs = totalWeightLbs - maxWeightLbs;
    const overKg = totalWeightKg - maxWeightKg;
    weightMessage = `Baja ${fmtKg(overKg)} (${fmtLbs(overLbs)}) al cliente. Máximo EU: ${fmtKg(maxWeightKg)} (${fmtLbs(maxWeightLbs)}).`;
  } else if (totalWeightLbs > 0 && totalWeightLbs < maxWeightLbs * 0.9) {
    weightStatus = "under";
    weightMessage = `Puedes agregar hasta ${fmtKg(remainingKg)} (${fmtLbs(remainingLbs)}) más de producto.`;
  } else if (totalWeightLbs > 0) {
    weightStatus = "ok";
    weightMessage = `Peso OK — ${fmtKg(totalWeightKg)} (${fmtLbs(totalWeightLbs)}) · ${((totalWeightLbs / maxWeightLbs) * 100).toFixed(1)}% del límite EU.`;
  } else {
    weightStatus = "unknown";
    weightMessage = "Sin peso calculado. Carga catálogo con kg (limpieza) o lbs (velas).";
  }

  return {
    totalWeightLbs,
    totalWeightKg,
    maxWeightLbs,
    maxWeightKg,
    remainingLbs,
    remainingKg,
    weightPct: maxWeightLbs ? totalWeightLbs / maxWeightLbs : 0,
    weightStatus,
    weightMessage,
    missingSkus,
  };
}

export function enrichOrderResult(res, prods) {
  if (!res) return res;
  const orderItems = (res.orderItems || []).map((it) => {
    const lbs = lineWeightLbs(it, prods);
    const kg = lineWeightKg(it, prods);
    return { ...it, weightLbs: lbs, weightKg: kg };
  });
  const ws = weightSummary(orderItems, prods);
  return {
    ...res,
    orderItems,
    summary: { ...(res.summary || {}), ...ws },
  };
}
