#!/bin/bash
set -e
cd "$(dirname "$0")/.."
FILE="/Users/alejandroaguirre/Downloads/Notion Reporte Semana 18-22 Mayo copy.xlsx"
node scripts/import-notion-sales.mjs "$FILE"
head -8 src/data/sales-seed.json
