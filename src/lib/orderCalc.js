/** Límite de circulación en EU (lbs por pedido / embarque). */
export const MAX_CIRCULATION_LBS = 44000;

export function productWeightLbs(p) {
  return Number(p?.weightLbs) || 0;
}

export function lineWeightLbs(item, prods) {
  const p = prods.find((x) => x.sku === item.sku);
  const perCase = productWeightLbs(p);
  return (Number(item.quantity) || 0) * perCase;
}

export function orderWeightLbs(items, prods) {
  return (items || []).reduce((a, it) => a + lineWeightLbs(it, prods), 0);
}

export function weightSummary(items, prods) {
  const totalWeightLbs = orderWeightLbs(items, prods);
  const maxWeightLbs = MAX_CIRCULATION_LBS;
  const remainingLbs = maxWeightLbs - totalWeightLbs;
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
    weightMessage = `Faltan pesos en catálogo para ${missingSkus.length} SKU. Importa el catálogo con pesos (lbs/caja).`;
  } else if (totalWeightLbs > maxWeightLbs) {
    weightStatus = "over";
    const over = totalWeightLbs - maxWeightLbs;
    weightMessage = `Baja ${over.toLocaleString("en-US", { maximumFractionDigits: 0 })} lbs al cliente. Máximo EU: ${maxWeightLbs.toLocaleString("en-US")} lbs.`;
  } else if (totalWeightLbs > 0 && totalWeightLbs < maxWeightLbs * 0.9) {
    weightStatus = "under";
    weightMessage = `Puedes solicitar hasta ${remainingLbs.toLocaleString("en-US", { maximumFractionDigits: 0 })} lbs más de producto (cap. ${maxWeightLbs.toLocaleString("en-US")} lbs EU).`;
  } else if (totalWeightLbs > 0) {
    weightStatus = "ok";
    weightMessage = `Peso OK — ${((totalWeightLbs / maxWeightLbs) * 100).toFixed(1)}% del límite EU (${maxWeightLbs.toLocaleString("en-US")} lbs).`;
  } else {
    weightStatus = "unknown";
    weightMessage = "Sin peso calculado. Carga pesos en catálogo (lbs por caja).";
  }

  return {
    totalWeightLbs,
    maxWeightLbs,
    remainingLbs,
    weightPct: maxWeightLbs ? totalWeightLbs / maxWeightLbs : 0,
    weightStatus,
    weightMessage,
    missingSkus,
  };
}

export function enrichOrderResult(res, prods) {
  if (!res) return res;
  const orderItems = (res.orderItems || []).map((it) => ({
    ...it,
    weightLbs: lineWeightLbs(it, prods),
  }));
  const ws = weightSummary(orderItems, prods);
  return {
    ...res,
    orderItems,
    summary: { ...(res.summary || {}), ...ws },
  };
}
