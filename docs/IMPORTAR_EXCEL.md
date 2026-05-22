# Cómo dar de alta el catálogo desde Excel

## Paso 1 — Prepara tu Excel

Usa **una hoja** con encabezados en la **primera fila**.

### Limpieza (pesos en **kg**)

| SKU | Nombre | Categoria | Peso | Unidad | Lista_USD |
|-----|--------|-----------|------|--------|-----------|
| DET0008 | ARIEL REGULAR 250 GR | DETERGENTE | 12.5 | kg | 20.14 |

### Velas (pesos en **lbs**)

| SKU | Nombre | Categoria | Peso | Unidad | Lista_USD |
|-----|--------|-----------|------|--------|-----------|
| VEL5004 | VEL. 14 DIAS SANTA MUERTE | VELAS | 8.2 | lbs | 35.00 |

Columnas reconocidas (español o inglés):

- **SKU** — obligatorio (`SKU`, `Clave`, `Código`)
- **Nombre** — `Nombre`, `Producto`, `Descripción`
- **Categoria** — `Categoria`, `Category`
- **Peso** — `Peso`, `Weight` (número)
- **Unidad** — `Unidad`, `Unit` → `kg` o `lbs`
- También puedes usar columnas **`Peso_kg`** o **`Peso_lbs`** sin columna Unidad
- **Lista_USD**, **Costo_MXN** — opcionales

## Paso 2 — Guardar desde Excel

1. **Archivo → Guardar como**
2. Tipo: **CSV UTF-8 (delimitado por comas)** `.csv`  
   — o sube directo **`.xlsx`** (la app también lee Excel)

## Paso 3 — Importar en la app

1. Abre https://margin-client-system.vercel.app
2. Pestaña **Catálogo**
3. **Importar Excel/CSV** → elige tu archivo
4. Mensaje verde: cuántos SKUs se importaron

**Solo actualizar pesos** (sin cambiar nombres): botón **Solo pesos** con archivo mínimo:

```csv
SKU,Peso,Unidad
DET0008,12.5,kg
VEL5004,8.2,lbs
```

## Pedidos — kg y lbs

Al analizar un pedido, cada línea y el total muestran **kg y lbs** (conversión automática).

Límite EU: **44,000 lbs** (≈ **19,958 kg**).

## Plantillas

Copia y edita:

- `docs/templates/catalogo_limpieza_kg.csv`
- `docs/templates/catalogo_velas_lbs.csv`
