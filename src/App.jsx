import{useState,useRef,useEffect,useCallback}from"react";
import{BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,Cell,PieChart,Pie,Legend}from"recharts";

const P=[{"id":"p1","sku":"DET0004","name":"ARIEL C/DOWNY 1.5 KG C/12 PZS","listPriceUSD":40.37,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p2","sku":"DET0005","name":"ARIEL C/DOWNY 750 GR C/12 PZS","listPriceUSD":20.2,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p3","sku":"DET0008","name":"ARIEL REGULAR 250 GR C/36 PZS","listPriceUSD":20.14,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p4","sku":"DET0009","name":"ARIEL REGULAR 5 KG C/4 PZS","listPriceUSD":41.0,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p5","sku":"DET0010","name":"ARIEL REGULAR 500 GR C/18 PZS","listPriceUSD":20.14,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p6","sku":"DET0011","name":"ARIEL REGULAR 850 GR C/10 PZS","listPriceUSD":17.9,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p7","sku":"DET0014","name":"ARIEL PWD REGBAG 4KG C/4 PZS","listPriceUSD":35.5,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p8","sku":"DET0002","name":"LIQ ACE UNO P TODO 2.8LT C/4 PZS","listPriceUSD":19.0,"category":"DETERGENTE","brand":"ACE","costMXN":0,"lastUpdated":null},{"id":"p9","sku":"DET1001","name":"LIQ ACE UNO P TODO 8000ML C/2 PZS","listPriceUSD":12.97,"category":"DETERGENTE","brand":"ACE","costMXN":0,"lastUpdated":null},{"id":"p10","sku":"DET0003","name":"LIQ ACE UNO P TODO 800ML C/9 PZS","listPriceUSD":11.66,"category":"DETERGENTE","brand":"ACE","costMXN":0,"lastUpdated":null},{"id":"p11","sku":"DET1002","name":"LIQ ARIEL DOBLE PODER 8000ML C/2 PZS","listPriceUSD":14.23,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p12","sku":"DET0006","name":"LIQ ARIEL REVITCOLOR 2.8LT C/4 PZS","listPriceUSD":22.5,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p13","sku":"DET0007","name":"LIQ ARIEL REVITCOLOR 800ML C/9 PZS","listPriceUSD":12.74,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p14","sku":"DET1004","name":"LIQ ARIEL REVITCOLOR 8500ML C/2 PZS","listPriceUSD":15.0,"category":"DETERGENTE","brand":"ARIEL","costMXN":0,"lastUpdated":null},{"id":"p15","sku":"DET0016","name":"LIQ PERSIL CLR 4.65 LT C/4 PZS","listPriceUSD":39.62,"category":"DETERGENTE","brand":"PERSIL","costMXN":0,"lastUpdated":null},{"id":"p16","sku":"DET0017","name":"LIQ PERSIL CLR 6.64 LT C/3 PZS","listPriceUSD":40.96,"category":"DETERGENTE","brand":"PERSIL","costMXN":0,"lastUpdated":null},{"id":"p17","sku":"DET0019","name":"LIQ PERSIL REGULAR 4.65 LT C/4 PZS","listPriceUSD":39.62,"category":"DETERGENTE","brand":"PERSIL","costMXN":0,"lastUpdated":null},{"id":"p18","sku":"DET0020","name":"LIQ PERSIL REGULAR 6.64 LT C/3 PZS","listPriceUSD":40.96,"category":"DETERGENTE","brand":"PERSIL","costMXN":0,"lastUpdated":null},{"id":"p19","sku":"DET0033","name":"SALVO LIMON LIQUIDO 640 ML C/12","listPriceUSD":19.95,"category":"DETERGENTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p20","sku":"SUA0001","name":"DOWNY AMANECER 2.8L C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p21","sku":"SUA0002","name":"DOWNY AMANECER 730 ML C/9 PZS","listPriceUSD":11.0,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p22","sku":"SUA0003","name":"DOWNY ELEGANCE 2.6 LT C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p23","sku":"SUA0004","name":"DOWNY ELEGANCE 750 ML C/9 PZS","listPriceUSD":12.75,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p24","sku":"SUA0005","name":"DOWNY FLORAL 2.8 LT C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p25","sku":"SUA0006","name":"DOWNY FLORAL 360 ML C/12 PZS","listPriceUSD":8.75,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p26","sku":"SUA0007","name":"DOWNY INTENSE FLORAL 730 ML C/9 PZS","listPriceUSD":11.0,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p27","sku":"SUA0008","name":"DOWNY PASSION 2.6 LT C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p28","sku":"SUA0009","name":"DOWNY PASSION 750 ML C/9 PZS","listPriceUSD":13.0,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p29","sku":"SUA0010","name":"DOWNY PUREZA SILVESTRE 2.8 LT C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p30","sku":"SUA0011","name":"DOWNY ROMANCE 2.6 LT C/6 PZS","listPriceUSD":28.43,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p31","sku":"SUA0012","name":"DOWNY ROMANCE 750 ML C/9 PZS","listPriceUSD":13.0,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p32","sku":"SUA0013","name":"DOWNY SUAVE Y GENTIL 2800ML C/6PZ","listPriceUSD":30.48,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p33","sku":"SUA0030","name":"DOWNY PUREZA SILVESTRE 730 ML C/9 PZS","listPriceUSD":11.0,"category":"SUAVIZANTE","brand":"DOWNY","costMXN":0,"lastUpdated":null},{"id":"p34","sku":"SUA0014","name":"SUAVITEL ANOCH 850 ML C/12 PZS","listPriceUSD":14.35,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p35","sku":"SUA0015","name":"SUAVITEL ANOCH COMPLETE 700 ML C/12 PZS","listPriceUSD":14.35,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p36","sku":"SUA0016","name":"SUAVITEL AQUA COMPLETE 2.8 LT C/4 PZS","listPriceUSD":15.0,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p37","sku":"SUA0017","name":"SUAVITEL BABY ANTIBAC 850 ML C/12 PZS","listPriceUSD":14.2,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p38","sku":"SUA0018","name":"SUAVITEL COMPLETE PRIVA 700 ML C/12 PZS","listPriceUSD":14.2,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p39","sku":"SUA0019","name":"SUAVITEL CUIDADO DIARIO 8.5 LT C/2 PZS","listPriceUSD":18.0,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p40","sku":"SUA0020","name":"SUAVITEL CUI SUP MANZANA 740 ML C/16 PZS","listPriceUSD":14.11,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p41","sku":"SUA0021","name":"SUAVITEL FRESCA PRIM 2.8 LT C/4 PZS","listPriceUSD":22.45,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p42","sku":"SUA0022","name":"SUAVITEL FRESCA PRIM 3 LT C/4 PZS","listPriceUSD":19.91,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p43","sku":"SUA0023","name":"SUAVITEL FRESCA PRIM 450 ML C/12 PZS","listPriceUSD":9.18,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p44","sku":"SUA0024","name":"SUAVITEL FRESCA PRIM 850 ML C/12 PZS","listPriceUSD":14.2,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p45","sku":"SUA0025","name":"SUAVITEL SOL 3 LT C/4 PZS","listPriceUSD":19.91,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p46","sku":"SUA0026","name":"SUAVITEL SOL 450 ML C/12 PZS","listPriceUSD":8.5,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p47","sku":"SUA0027","name":"SUAVITEL SOL 850 ML C/12 PZS","listPriceUSD":14.72,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p48","sku":"SUA0028","name":"SUAVITEL SOL COMPLETE 700 ML C/12 PZS","listPriceUSD":14.75,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p49","sku":"SUA0031","name":"SUAVITEL PRIMAVERAL REG 1L C/12 PZS","listPriceUSD":14.83,"category":"SUAVIZANTE","brand":"SUAVITEL","costMXN":0,"lastUpdated":null},{"id":"p50","sku":"JLT0001","name":"JAB LIQ AXION LIMON 1.4L C/6 PZS","listPriceUSD":18.28,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p51","sku":"JLT0002","name":"JAB LIQ AXION LIMON 400 ML C/15","listPriceUSD":12.27,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p52","sku":"JLT0013","name":"JAB LIQ AXION LIMON 400ML C/12 PZS","listPriceUSD":12.27,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p53","sku":"JLT0003","name":"JAB LIQ AXION LIMON 640ML C/12 PZS","listPriceUSD":16.5,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p54","sku":"JLT0004","name":"JAB LIQ AXION LIMON 900ML C/12 PZS","listPriceUSD":27.0,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p55","sku":"JLT0008","name":"JAB LIQ SALVO LIMON 1.4L C/9 PZS","listPriceUSD":32.82,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p56","sku":"JLT0009","name":"JAB LIQ SALVO LIMON 300 ML C/12 PZS","listPriceUSD":9.96,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p57","sku":"JLT0015","name":"JAB LIQ SALVO LIMON 300 ML C/14 PZS","listPriceUSD":10.42,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p58","sku":"JLT0006","name":"JAB LIQ SALVO LIMON 500ML C/10 PZS","listPriceUSD":13.02,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p59","sku":"JLT0010","name":"JAB LIQ SALVO LIMON 750ML C/12 PZS","listPriceUSD":24.56,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p60","sku":"JLT0007","name":"JAB LIQ SALVO LIMON 900 ML C/12 PZS","listPriceUSD":27.5,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p61","sku":"JLT0012","name":"JAB LIQ SALVO PWR CLEAN 2.6L C/6 PZS","listPriceUSD":36.67,"category":"LAVATRASTE","brand":"SALVO","costMXN":0,"lastUpdated":null},{"id":"p62","sku":"JLT0016","name":"JAB POLVO AXION LIMON 720G C/18 PZS","listPriceUSD":35.96,"category":"LAVATRASTE","brand":"AXION","costMXN":0,"lastUpdated":null},{"id":"p63","sku":"ACC0002","name":"SAVILE AC ALM VIT Y SAB 700ML C/12 PZS","listPriceUSD":23.98,"category":"ACONDICIONADOR","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p64","sku":"ACC0001","name":"SAVILE AC COLAG Y SAB 700ML C/12 PZS","listPriceUSD":23.98,"category":"ACONDICIONADOR","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p65","sku":"SHA0001","name":"SAVILE SH ACEI DE ARG 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p66","sku":"SHA0002","name":"SAVILE SH ACEI DE COCO 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p67","sku":"SHA0003","name":"SAVILE SH AGUACATE 2EN1 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p68","sku":"SHA0004","name":"SAVILE SH ALMENDRA 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p69","sku":"SHA0005","name":"SAVILE SH BIOTINA 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p70","sku":"SHA0006","name":"SAVILE SH CELULAS MADRE 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p71","sku":"SHA0007","name":"SAVILE SH CHILE 2EN1 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p72","sku":"SHA0008","name":"SAVILE SH COLAGENO 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p73","sku":"SHA0009","name":"SAVILE SH LISO DESLU KERA 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p74","sku":"SHA0010","name":"SAVILE SH MIEL 2EN1 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p75","sku":"SHA0011","name":"SAVILE SH NOPAL 2EN1 700ML C/12 PZS","listPriceUSD":23.98,"category":"SHAMPOO","brand":"SAVILE","costMXN":0,"lastUpdated":null},{"id":"p76","sku":"CRP0001","name":"SEDAL CREMA P ANTINUDOS 300ML C/12 PZS","listPriceUSD":28.75,"category":"CREMA PEINAR","brand":"SEDAL","costMXN":0,"lastUpdated":null},{"id":"p77","sku":"CRP0002","name":"SEDAL CREMA P LISO PERF 300ML C/12 PZS","listPriceUSD":28.75,"category":"CREMA PEINAR","brand":"SEDAL","costMXN":0,"lastUpdated":null},{"id":"p78","sku":"CRP0003","name":"SEDAL CREMA P REST INST 300ML C/12 PZS","listPriceUSD":28.75,"category":"CREMA PEINAR","brand":"SEDAL","costMXN":0,"lastUpdated":null},{"id":"p79","sku":"CRP0004","name":"SEDAL CREMA P RIZOS DEF 300ML C/12 PZS","listPriceUSD":28.22,"category":"CREMA PEINAR","brand":"SEDAL","costMXN":0,"lastUpdated":null},{"id":"p80","sku":"SHA0012","name":"SEDAL SH CERAMIDAS 300ML C/12 PZS","listPriceUSD":28.22,"category":"SHAMPOO","brand":"SEDAL","costMXN":0,"lastUpdated":null},{"id":"p81","sku":"SHA0013","name":"SEDAL SH LISO PERFECTO 300ML C/12 PZS","listPriceUSD":28.75,"category":"SHAMPOO","brand":"SEDAL","costMXN":0,"lastUpdated":null}];
const O=[{"id":"ei4t0s","date":"26/01/2026","client":"2 FRONTERAS LLC","month":"Ene","monthIndex":0,"folio":"","sellerId":"s1","sellerName":"Carlos Mendoza","zone":"Texas","confirmedAt":"26/01/2026","exchangeRate":17.15,"items":[{"sku":"DET0008","productName":"ARIEL REGULAR 250 GR C/36","quantity":119.0,"clientPriceUSD":22.48,"listPriceUSD":20.14,"costUSD":0,"marginUSD":22.48,"marginPct":1,"alert":false},{"sku":"DET0010","productName":"ARIEL REGULAR 500 GR C/18","quantity":119.0,"clientPriceUSD":22.05,"listPriceUSD":20.14,"costUSD":0,"marginUSD":22.05,"marginPct":1,"alert":false},{"sku":"DET0021","productName":"ARIEL REGULAR 850 GR C/11","quantity":239.0,"clientPriceUSD":19.93,"listPriceUSD":19.93,"costUSD":0,"marginUSD":19.93,"marginPct":1,"alert":false},{"sku":"DET0033","productName":"SALVO LIMON LIQUIDO 640 ML","quantity":131.0,"clientPriceUSD":20.75,"listPriceUSD":19.95,"costUSD":0,"marginUSD":20.75,"marginPct":1,"alert":false},{"sku":"JLT0006","productName":"JAB LIQ SALVO LIMON 500ML","quantity":159.0,"clientPriceUSD":12.43,"listPriceUSD":13.02,"costUSD":0,"marginUSD":12.43,"marginPct":1,"alert":false},{"sku":"JLT0015","productName":"JAB LIQ SALVO LIMON 300 ML","quantity":129.0,"clientPriceUSD":11.7,"listPriceUSD":10.42,"costUSD":0,"marginUSD":11.7,"marginPct":1,"alert":false},{"sku":"SUA0003","productName":"DOWNY ELEGANCE 2.6 LT C/6","quantity":53.0,"clientPriceUSD":29.34,"listPriceUSD":28.43,"costUSD":0,"marginUSD":29.34,"marginPct":1,"alert":false},{"sku":"SUA0004","productName":"DOWNY ELEGANCE 750 ML","quantity":143.0,"clientPriceUSD":13.47,"listPriceUSD":12.75,"costUSD":0,"marginUSD":13.47,"marginPct":1,"alert":false},{"sku":"SUA0007","productName":"DOWNY INTENSE FLORAL 730","quantity":143.0,"clientPriceUSD":12.91,"listPriceUSD":11.0,"costUSD":0,"marginUSD":12.91,"marginPct":1,"alert":false},{"sku":"SUA0009","productName":"DOWNY PASSION 750 ML C/9","quantity":145.0,"clientPriceUSD":14.79,"listPriceUSD":13.0,"costUSD":0,"marginUSD":14.79,"marginPct":1,"alert":false},{"sku":"SUA0012","productName":"DOWNY ROMANCE 750 ML C/9","quantity":141.0,"clientPriceUSD":14.79,"listPriceUSD":13.0,"costUSD":0,"marginUSD":14.79,"marginPct":1,"alert":false},{"sku":"SUA0014","productName":"SUAVITEL ANOCH 850 ML C/12","quantity":89.0,"clientPriceUSD":15.06,"listPriceUSD":14.35,"costUSD":0,"marginUSD":15.06,"marginPct":1,"alert":false},{"sku":"SUA0018","productName":"SUAVITEL COMPLETE","quantity":119.0,"clientPriceUSD":15.29,"listPriceUSD":14.2,"costUSD":0,"marginUSD":15.29,"marginPct":1,"alert":false},{"sku":"SUA0024","productName":"SUAVITEL FRESCA PRIM 850","quantity":89.0,"clientPriceUSD":14.28,"listPriceUSD":14.2,"costUSD":0,"marginUSD":14.28,"marginPct":1,"alert":false},{"sku":"SUA0026","productName":"SUAVITEL SOL 450 ML C/12","quantity":151.0,"clientPriceUSD":9.06,"listPriceUSD":8.5,"costUSD":0,"marginUSD":9.06,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":31622.39,"totalCostUSD":0,"totalMarginUSD":31622.39,"totalMarginPct":1,"hasAlerts":false}},{"id":"ggdasx","date":"12/02/2026","client":"MEX-MORE","month":"Feb","monthIndex":1,"folio":"PO 1006","sellerId":"s2","sellerName":"Laura Vega","zone":"Texas","confirmedAt":"12/02/2026","exchangeRate":17.15,"items":[{"sku":"750221712204-7","productName":"VEL. ORO BRILUX ANGEL DE","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239803-6","productName":"VEL. BRILUX VIRGEN DE G.","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750619620350-6","productName":"VEL. IL/STELLA BLANCO","quantity":100.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"78106000084","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0069","productName":"VEL. BRILUX VIRGEN DE G.","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0363","productName":"VEL. IL/STELLA NEGRA LISA","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL0370","productName":"VEL. IL/STELLA 7 AMARILLA","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL0401","productName":"VEL. IL/STELLA 7 COLORES","quantity":50.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL2436","productName":"VEL. AMERICANA SANTA","quantity":50.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL3340","productName":"VEL. IL/STELLA SAN JUDAS","quantity":200.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL5004","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":32.0,"clientPriceUSD":36.2,"listPriceUSD":36.2,"costUSD":0,"marginUSD":36.2,"marginPct":1,"alert":false},{"sku":"VEL5006","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":16.0,"clientPriceUSD":31.0,"listPriceUSD":31.0,"costUSD":0,"marginUSD":31.0,"marginPct":1,"alert":false},{"sku":"VEL5016","productName":"VEL. 14 DIAS BLANCA LISA C/6","quantity":80.0,"clientPriceUSD":29.8,"listPriceUSD":29.8,"costUSD":0,"marginUSD":29.8,"marginPct":1,"alert":false},{"sku":"VEL5040","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":16.0,"clientPriceUSD":31.0,"listPriceUSD":31.0,"costUSD":0,"marginUSD":31.0,"marginPct":1,"alert":false},{"sku":"VEL5042","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5065","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":16.0,"clientPriceUSD":31.0,"listPriceUSD":31.0,"costUSD":0,"marginUSD":31.0,"marginPct":1,"alert":false},{"sku":"VEL5103","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":320.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5104","productName":"VEL. 14 DIAS SAN J TADEO.","quantity":320.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5106","productName":"VEL. 14 DIAS SAG CORAZON","quantity":48.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5128","productName":"VEL. 14 DIAS AROMA","quantity":16.0,"clientPriceUSD":32.7,"listPriceUSD":32.7,"costUSD":0,"marginUSD":32.7,"marginPct":1,"alert":false},{"sku":"VEL5129","productName":"VEL. 14 DIAS AROMA COCO","quantity":16.0,"clientPriceUSD":32.7,"listPriceUSD":32.7,"costUSD":0,"marginUSD":32.7,"marginPct":1,"alert":false},{"sku":"VEL6001","productName":"VEL. IL/STELLA DUAL","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL6041","productName":"VEL. IL/STELLA JESUS ET","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7367","productName":"VEL. ORO BRILUX SAN","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7372","productName":"VEL. ORO BRILUX VIRGEN DE","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7599","productName":"VEL. 395 PARAF SANTA","quantity":50.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":43137.53,"totalCostUSD":0,"totalMarginUSD":43137.53,"totalMarginPct":1,"hasAlerts":false}},{"id":"wmwf5a","date":"25/02/2026","client":"BODEGA GUZMAN","month":"Feb","monthIndex":1,"folio":"F  4","sellerId":"s1","sellerName":"Carlos Mendoza","zone":"Texas","confirmedAt":"25/02/2026","exchangeRate":17.15,"items":[{"sku":"BEB0001","productName":"BEBIDA SUEROX COCO 630ML","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0002","productName":"BEBIDA SUEROX FRESA","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0002","productName":"BEBIDA SUEROX FRESA","quantity":255.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0003","productName":"BEBIDA SUEROX HOR 630ML","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0004","productName":"BEBIDA SUEROX LIMA-LIMON","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0005","productName":"BEBIDA SUEROX MORA 630ML","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0006","productName":"BEBIDA SUEROX MANZANA","quantity":144.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0007","productName":"BEBIDA SUEROX PON 630ML","quantity":288.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0008","productName":"BEBIDA SUEROX UVA 630ML","quantity":144.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false},{"sku":"BEB0009","productName":"BEBIDA SUEROX NAR-MANDA","quantity":144.0,"clientPriceUSD":14.9,"listPriceUSD":14.9,"costUSD":0,"marginUSD":14.9,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":35983.5,"totalCostUSD":0,"totalMarginUSD":35983.5,"totalMarginPct":1,"hasAlerts":false}},{"id":"u7uvyt","date":"09/03/2026","client":"FRONTERA IMPORTS","month":"Mar","monthIndex":2,"folio":"","sellerId":"s3","sellerName":"Roberto Solis","zone":"Texas","confirmedAt":"09/03/2026","exchangeRate":17.15,"items":[{"sku":"DET0008","productName":"ARIEL REGULAR 250 GR C/36","quantity":720.0,"clientPriceUSD":19.74,"listPriceUSD":20.14,"costUSD":0,"marginUSD":19.74,"marginPct":1,"alert":false},{"sku":"750221712204-7","productName":"VEL. ORO BRILUX ANGEL DE","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750221712204-7","productName":"VEL. ORO BRILUX ANGEL DE","quantity":10.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239803-6","productName":"VEL. BRILUX VIRGEN DE G.","quantity":200.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"7503002398043","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":200.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"7503002398043","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239805-0","productName":"VEL. 395 BRILUX SAGRADO","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239805-0","productName":"VEL. 395 BRILUX SAGRADO","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0010","productName":"VEL. 395 BRILUX V. DE","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0348","productName":"VEL. IL/STELLA VERDE LISA","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0349","productName":"VEL. IL/STELLA ROJA LISA","quantity":10.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2205","productName":"VEL. 395 BRILUX SAN MIGUEL","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3249","productName":"VEL. 105 PARAF 7 COLORES","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL4041","productName":"VEL. 395 BRILUX NINO JESUS","quantity":10.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL4201","productName":"VEL. CLASICA V. DE","quantity":99.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4202","productName":"VEL. CLASICA SAN JUDAS","quantity":198.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4203","productName":"VEL. CLASICA S. CORAZON","quantity":48.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4204","productName":"VEL. CLASICA BLANCA LISA","quantity":99.0,"clientPriceUSD":12.86,"listPriceUSD":12.86,"costUSD":0,"marginUSD":12.86,"marginPct":1,"alert":false},{"sku":"VEL4205","productName":"VEL. CLASICA NINO JESUS","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4210","productName":"VEL. CLASICA SAN MIGUEL","quantity":12.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4212","productName":"VEL. CLASICA JUSTO JUEZ","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4242","productName":"VEL. CLASICA S. MARTIN","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4243","productName":"VEL. CLASICA ANGEL DE LG","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4244","productName":"VEL. CLASICA NINO DE","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL4245","productName":"VEL. CLASICA SAG. COR. DE","quantity":24.0,"clientPriceUSD":14.0,"listPriceUSD":14.0,"costUSD":0,"marginUSD":14.0,"marginPct":1,"alert":false},{"sku":"VEL7367","productName":"VEL. ORO BRILUX SAN","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7922","productName":"VEL. 395 BRILUX  SAG. CORA.","quantity":10.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL9801","productName":"VEL. 395 BRILUX V. DE SN","quantity":10.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL9806","productName":"VEL. 395 BRILUX SAN MARTIN","quantity":15.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":31121.49,"totalCostUSD":0,"totalMarginUSD":31121.49,"totalMarginPct":1,"hasAlerts":false}},{"id":"7c1iou","date":"13/03/2026","client":"LA TORTILLERIA","month":"Mar","monthIndex":2,"folio":"","sellerId":"s4","sellerName":"Patricia Ríos","zone":"Texas","confirmedAt":"13/03/2026","exchangeRate":17.15,"items":[{"sku":"DET0003","productName":"LIQ ACE UNO P TODO 800ML","quantity":120.0,"clientPriceUSD":12.16,"listPriceUSD":11.66,"costUSD":0,"marginUSD":12.16,"marginPct":1,"alert":false},{"sku":"DET0005","productName":"ARIEL PARAISO FLORAL 750","quantity":252.0,"clientPriceUSD":20.1,"listPriceUSD":20.2,"costUSD":0,"marginUSD":20.1,"marginPct":1,"alert":false},{"sku":"DET0007","productName":"LIQ ARIEL REVITCOLOR","quantity":240.0,"clientPriceUSD":13.25,"listPriceUSD":12.74,"costUSD":0,"marginUSD":13.25,"marginPct":1,"alert":false},{"sku":"DET0008","productName":"ARIEL REGULAR 250 GR C/36","quantity":84.0,"clientPriceUSD":20.36,"listPriceUSD":20.14,"costUSD":0,"marginUSD":20.36,"marginPct":1,"alert":false},{"sku":"DET0010","productName":"ARIEL REGULAR 500 GR C/18","quantity":252.0,"clientPriceUSD":19.62,"listPriceUSD":20.14,"costUSD":0,"marginUSD":19.62,"marginPct":1,"alert":false},{"sku":"DET0014","productName":"ARIEL PWD REGBAG 4KG C/4","quantity":100.0,"clientPriceUSD":36.88,"listPriceUSD":35.5,"costUSD":0,"marginUSD":36.88,"marginPct":1,"alert":false},{"sku":"DET0021","productName":"ARIEL REGULAR 850 GR C/11","quantity":84.0,"clientPriceUSD":18.48,"listPriceUSD":18.48,"costUSD":0,"marginUSD":18.48,"marginPct":1,"alert":false},{"sku":"JLT0019","productName":"JAB LIQ AXION LIMON 2.8L C/4","quantity":78.0,"clientPriceUSD":19.55,"listPriceUSD":19.55,"costUSD":0,"marginUSD":19.55,"marginPct":1,"alert":false},{"sku":"SUA0006","productName":"DOWNY FLORAL 360 ML C/12","quantity":120.0,"clientPriceUSD":8.97,"listPriceUSD":8.75,"costUSD":0,"marginUSD":8.97,"marginPct":1,"alert":false},{"sku":"SUA0014","productName":"SUAVITEL ANOCH 850 ML C/12","quantity":75.0,"clientPriceUSD":14.56,"listPriceUSD":14.35,"costUSD":0,"marginUSD":14.56,"marginPct":1,"alert":false},{"sku":"SUA0015","productName":"SUAVITEL ANOCHCOMPLETE","quantity":60.0,"clientPriceUSD":14.53,"listPriceUSD":14.35,"costUSD":0,"marginUSD":14.53,"marginPct":1,"alert":false},{"sku":"SUA0016","productName":"SUAVITEL AQUA COMPLETE","quantity":112.0,"clientPriceUSD":22.9,"listPriceUSD":15.0,"costUSD":0,"marginUSD":22.9,"marginPct":1,"alert":false},{"sku":"SUA0027","productName":"SUAVITEL SOL 850 ML C/12","quantity":60.0,"clientPriceUSD":14.72,"listPriceUSD":14.72,"costUSD":0,"marginUSD":14.72,"marginPct":1,"alert":false},{"sku":"SUA0028","productName":"SUAVITEL SOL COMPLETE 700","quantity":60.0,"clientPriceUSD":15.29,"listPriceUSD":14.75,"costUSD":0,"marginUSD":15.29,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":30529.7,"totalCostUSD":0,"totalMarginUSD":30529.7,"totalMarginPct":1,"hasAlerts":false}},{"id":"o7u6u3","date":"25/03/2026","client":"BODEGA GUZMAN","month":"Mar","monthIndex":2,"folio":"","sellerId":"s1","sellerName":"Carlos Mendoza","zone":"Texas","confirmedAt":"25/03/2026","exchangeRate":17.15,"items":[{"sku":"DET0002","productName":"LIQ ACE UNO P TODO 2.8LT","quantity":60.0,"clientPriceUSD":20.8,"listPriceUSD":19.0,"costUSD":0,"marginUSD":20.8,"marginPct":1,"alert":false},{"sku":"DET0004","productName":"ARIEL PARAISO FLORAL 1.5","quantity":50.0,"clientPriceUSD":42.53,"listPriceUSD":40.37,"costUSD":0,"marginUSD":42.53,"marginPct":1,"alert":false},{"sku":"DET0005","productName":"ARIEL PARAISO FLORAL 750","quantity":105.0,"clientPriceUSD":19.61,"listPriceUSD":20.2,"costUSD":0,"marginUSD":19.61,"marginPct":1,"alert":false},{"sku":"DET0006","productName":"LIQ ARIEL REVITCOLOR 2.8LT","quantity":60.0,"clientPriceUSD":24.03,"listPriceUSD":22.5,"costUSD":0,"marginUSD":24.03,"marginPct":1,"alert":false},{"sku":"DET0009","productName":"ARIEL REGULAR 5 KG C/4 PZS","quantity":360.0,"clientPriceUSD":39.0,"listPriceUSD":41.0,"costUSD":0,"marginUSD":39.0,"marginPct":1,"alert":false},{"sku":"DET0033","productName":"SALVO LIMON LIQUIDO 640 ML","quantity":90.0,"clientPriceUSD":18.7,"listPriceUSD":19.95,"costUSD":0,"marginUSD":18.7,"marginPct":1,"alert":false},{"sku":"JLT0001","productName":"JAB LIQ AXION LIMON 1.4L C/6","quantity":50.0,"clientPriceUSD":15.24,"listPriceUSD":18.28,"costUSD":0,"marginUSD":15.24,"marginPct":1,"alert":false},{"sku":"JLT0003","productName":"JAB LIQ AXION LIMON 640ML","quantity":90.0,"clientPriceUSD":16.92,"listPriceUSD":16.5,"costUSD":0,"marginUSD":16.92,"marginPct":1,"alert":false},{"sku":"JLT0005","productName":"JAB LIQ SALVO LIMON 1.2L","quantity":45.0,"clientPriceUSD":32.33,"listPriceUSD":32.33,"costUSD":0,"marginUSD":32.33,"marginPct":1,"alert":false},{"sku":"JLT0007","productName":"JAB LIQ SALVO LIMON 900 ML","quantity":100.0,"clientPriceUSD":28.75,"listPriceUSD":27.5,"costUSD":0,"marginUSD":28.75,"marginPct":1,"alert":false},{"sku":"JLT0019","productName":"JAB LIQ AXION LIMON 2.8L C/4","quantity":60.0,"clientPriceUSD":19.07,"listPriceUSD":19.07,"costUSD":0,"marginUSD":19.07,"marginPct":1,"alert":false},{"sku":"SUA0002","productName":"DOWNY AMANECER 730 ML","quantity":30.0,"clientPriceUSD":11.62,"listPriceUSD":11.0,"costUSD":0,"marginUSD":11.62,"marginPct":1,"alert":false},{"sku":"SUA0009","productName":"DOWNY PASSION 750 ML C/9","quantity":30.0,"clientPriceUSD":13.92,"listPriceUSD":13.0,"costUSD":0,"marginUSD":13.92,"marginPct":1,"alert":false},{"sku":"SUA0012","productName":"DOWNY ROMANCE 750 ML C/9","quantity":30.0,"clientPriceUSD":13.92,"listPriceUSD":13.0,"costUSD":0,"marginUSD":13.92,"marginPct":1,"alert":false},{"sku":"SUA0013","productName":"DOWNY SUAVE Y GENTIL","quantity":45.0,"clientPriceUSD":30.48,"listPriceUSD":30.48,"costUSD":0,"marginUSD":30.48,"marginPct":1,"alert":false},{"sku":"SUA0014","productName":"SUAVITEL ANOCH 850 ML C/12","quantity":30.0,"clientPriceUSD":14.2,"listPriceUSD":14.35,"costUSD":0,"marginUSD":14.2,"marginPct":1,"alert":false},{"sku":"SUA0017","productName":"SUAVITEL BABY ANTIBAC 850","quantity":30.0,"clientPriceUSD":14.2,"listPriceUSD":14.2,"costUSD":0,"marginUSD":14.2,"marginPct":1,"alert":false},{"sku":"SUA0018","productName":"SUAVITEL COMPLETE","quantity":30.0,"clientPriceUSD":14.18,"listPriceUSD":14.2,"costUSD":0,"marginUSD":14.18,"marginPct":1,"alert":false},{"sku":"SUA0024","productName":"SUAVITEL FRESCA PRIM 850","quantity":30.0,"clientPriceUSD":14.2,"listPriceUSD":14.2,"costUSD":0,"marginUSD":14.2,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":34616.0,"totalCostUSD":0,"totalMarginUSD":34616.0,"totalMarginPct":1,"hasAlerts":false}},{"id":"nqcptd","date":"30/03/2026","client":"MEX-MORE","month":"Mar","monthIndex":2,"folio":"","sellerId":"s2","sellerName":"Laura Vega","zone":"Texas","confirmedAt":"30/03/2026","exchangeRate":17.15,"items":[{"sku":"750221712204-7","productName":"VEL. ORO BRILUX ANGEL DE","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239803-6","productName":"VEL. BRILUX VIRGEN DE G.","quantity":200.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"7503002398043","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750619620350-6","productName":"VEL. IL/STELLA BLANCO","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"78106000084","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0010","productName":"VEL. 395 BRILUX V. DE","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0070","productName":"VEL. 395 BRILUX SAG","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0370","productName":"VEL. IL/STELLA 7 AMARILLA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2201","productName":"VEL. 395 BRILUX SANTA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2203","productName":"VEL. 395 BRILUX NINO","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2205","productName":"VEL. 395 BRILUX SAN MIGUEL","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2207","productName":"VEL. 395 BRILUX ESPIRITU","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3148","productName":"VEL. 395 PARAF SANTA","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3149","productName":"VEL. 395 PARAF SANTA","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3157","productName":"VEL. 395 PARAF SANTA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL4119","productName":"VEL. 395 BRILUX SANTA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL5004","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":80.0,"clientPriceUSD":35.0,"listPriceUSD":35.0,"costUSD":0,"marginUSD":35.0,"marginPct":1,"alert":false},{"sku":"VEL5013","productName":"VEL. 14 DIAS 7 COLORES LISA","quantity":80.0,"clientPriceUSD":35.0,"listPriceUSD":35.0,"costUSD":0,"marginUSD":35.0,"marginPct":1,"alert":false},{"sku":"VEL5016","productName":"VEL. 14 DIAS BLANCA LISA C/6","quantity":160.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5041","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5042","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5103","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5104","productName":"VEL. 14 DIAS SAN J TADEO.","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5106","productName":"VEL. 14 DIAS SAG CORAZON","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5107","productName":"VEL. 14 DIAS ORO SAN","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5110","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5128","productName":"VEL. 14 DIAS AROMA","quantity":16.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5129","productName":"VEL. 14 DIAS AROMA COCO","quantity":16.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL7367","productName":"VEL. ORO BRILUX SAN","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7368","productName":"VEL. ORO BRILUX SANTA","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL7599","productName":"VEL. 395 PARAF SANTA","quantity":100.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL8705","productName":"VEL. 395 BRILUX HOLY","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL8723","productName":"VEL. 395 BRILUX RUEGO Y","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":44662.72,"totalCostUSD":0,"totalMarginUSD":44662.72,"totalMarginPct":1,"hasAlerts":false}},{"id":"durw3n","date":"01/04/2026","client":"MEX-MORE","month":"Abr","monthIndex":3,"folio":"","sellerId":"s2","sellerName":"Laura Vega","zone":"Texas","confirmedAt":"01/04/2026","exchangeRate":17.15,"items":[{"sku":"750300239803-6","productName":"VEL. BRILUX VIRGEN DE G.","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"7503002398043","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":200.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239805-0","productName":"VEL. 395 BRILUX SAGRADO","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750619620350-6","productName":"VEL. IL/STELLA BLANCO","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"78106000084","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0348","productName":"VEL. IL/STELLA VERDE LISA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0349","productName":"VEL. IL/STELLA ROJA LISA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0369","productName":"VEL. IL/STELLA ROSA LISA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0398","productName":"VEL. IL/STELLA BLUE LISA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0425","productName":"VEL. IL/STELLA MORADA LISA","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3249","productName":"VEL. 105 PARAF 7 COLORES","quantity":100.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL5004","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":80.0,"clientPriceUSD":35.0,"listPriceUSD":35.0,"costUSD":0,"marginUSD":35.0,"marginPct":1,"alert":false},{"sku":"VEL5006","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":48.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5013","productName":"VEL. 14 DIAS 7 COLORES LISA","quantity":80.0,"clientPriceUSD":35.0,"listPriceUSD":35.0,"costUSD":0,"marginUSD":35.0,"marginPct":1,"alert":false},{"sku":"VEL5040","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5041","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5042","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5065","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":32.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5088","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5091","productName":"VEL. 14 DIAS JUSTO JUEZ","quantity":32.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5103","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":160.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5104","productName":"VEL. 14 DIAS SAN J TADEO.","quantity":160.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5108","productName":"VEL. 14 DIAS SAN BENITO","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5110","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5130","productName":"VEL. 14 DIAS AROMA  HONEY","quantity":32.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5146","productName":"VEL. 14 DIAS AROMA ROSAS","quantity":16.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5148","productName":"VEL. 14 DIAS AROMA HERBAL","quantity":16.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL7558","productName":"VEL. 14 DIAS AROMA 33","quantity":32.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL8664","productName":"VEL. 395 BRILUX V. DE GUAD","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":49058.63,"totalCostUSD":0,"totalMarginUSD":49058.63,"totalMarginPct":1,"hasAlerts":false}},{"id":"r0bvf2","date":"17/04/2026","client":"BODEGA GUZMAN","month":"Abr","monthIndex":3,"folio":"","sellerId":"s1","sellerName":"Carlos Mendoza","zone":"Texas","confirmedAt":"17/04/2026","exchangeRate":17.15,"items":[{"sku":"DET0009","productName":"ARIEL REGULAR 5 KG C/4 PZS","quantity":315.0,"clientPriceUSD":39.0,"listPriceUSD":41.0,"costUSD":0,"marginUSD":39.0,"marginPct":1,"alert":false},{"sku":"SUA0016","productName":"SUAVITEL AQUA COMPLETE","quantity":60.0,"clientPriceUSD":22.34,"listPriceUSD":15.0,"costUSD":0,"marginUSD":22.34,"marginPct":1,"alert":false},{"sku":"SUA0022","productName":"SUAVITEL FRESCA PRIM 3 LT","quantity":60.0,"clientPriceUSD":22.45,"listPriceUSD":19.91,"costUSD":0,"marginUSD":22.45,"marginPct":1,"alert":false},{"sku":"SUA0025","productName":"SUAVITEL SOL 3 LT C/4 PZS S","quantity":60.0,"clientPriceUSD":22.01,"listPriceUSD":19.91,"costUSD":0,"marginUSD":22.01,"marginPct":1,"alert":false},{"sku":"SUA0028","productName":"SUAVITEL SOL COMPLETE 700","quantity":30.0,"clientPriceUSD":14.92,"listPriceUSD":14.75,"costUSD":0,"marginUSD":14.92,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":16740.6,"totalCostUSD":0,"totalMarginUSD":16740.6,"totalMarginPct":1,"hasAlerts":false}},{"id":"rte4pb","date":"23/04/2026","client":"LA TORTILLERIA","month":"Abr","monthIndex":3,"folio":"","sellerId":"s4","sellerName":"Patricia Ríos","zone":"Texas","confirmedAt":"23/04/2026","exchangeRate":17.15,"items":[{"sku":"DET0004","productName":"ARIEL PARAISO FLORAL 1.5","quantity":300.0,"clientPriceUSD":43.1,"listPriceUSD":40.37,"costUSD":0,"marginUSD":43.1,"marginPct":1,"alert":false},{"sku":"DET0008","productName":"ARIEL REGULAR 250 GR C/36","quantity":168.0,"clientPriceUSD":20.36,"listPriceUSD":20.14,"costUSD":0,"marginUSD":20.36,"marginPct":1,"alert":false},{"sku":"DET0010","productName":"ARIEL REGULAR 500 GR C/18","quantity":168.0,"clientPriceUSD":19.62,"listPriceUSD":20.14,"costUSD":0,"marginUSD":19.62,"marginPct":1,"alert":false},{"sku":"DET0044","productName":"LIQ ARIEL EXPERT 2.8LT C/4","quantity":120.0,"clientPriceUSD":24.63,"listPriceUSD":24.63,"costUSD":0,"marginUSD":24.63,"marginPct":1,"alert":false},{"sku":"DET0045","productName":"LIQ ACE 8.5L 1 PZA","quantity":132.0,"clientPriceUSD":16.29,"listPriceUSD":16.29,"costUSD":0,"marginUSD":16.29,"marginPct":1,"alert":false},{"sku":"SUA0005","productName":"DOWNY FLORAL 2.8 LT C/6","quantity":144.0,"clientPriceUSD":29.67,"listPriceUSD":28.43,"costUSD":0,"marginUSD":29.67,"marginPct":1,"alert":false},{"sku":"SUA0024","productName":"SUAVITEL FRESCA PRIM 850","quantity":225.0,"clientPriceUSD":14.56,"listPriceUSD":14.2,"costUSD":0,"marginUSD":14.56,"marginPct":1,"alert":false},{"sku":"SUA0025","productName":"SUAVITEL SOL 3 LT C/4 PZS S","quantity":112.0,"clientPriceUSD":22.28,"listPriceUSD":19.91,"costUSD":0,"marginUSD":22.28,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":34796.36,"totalCostUSD":0,"totalMarginUSD":34796.36,"totalMarginPct":1,"hasAlerts":false}},{"id":"ocwjkf","date":"28/04/2026","client":"MEX-MORE","month":"Abr","monthIndex":3,"folio":"","sellerId":"s2","sellerName":"Laura Vega","zone":"Texas","confirmedAt":"28/04/2026","exchangeRate":17.15,"items":[{"sku":"DET0003","productName":"LIQ ACE UNO P TODO 800ML","quantity":360.0,"clientPriceUSD":11.86,"listPriceUSD":11.66,"costUSD":0,"marginUSD":11.86,"marginPct":1,"alert":false},{"sku":"DET0005","productName":"ARIEL PARAISO FLORAL 750","quantity":252.0,"clientPriceUSD":19.61,"listPriceUSD":20.2,"costUSD":0,"marginUSD":19.61,"marginPct":1,"alert":false},{"sku":"DET0007","productName":"LIQ ARIEL REVITCOLOR","quantity":324.0,"clientPriceUSD":12.93,"listPriceUSD":12.74,"costUSD":0,"marginUSD":12.93,"marginPct":1,"alert":false},{"sku":"DET0009","productName":"ARIEL REGULAR 5 KG C/4 PZS","quantity":100.0,"clientPriceUSD":43.0,"listPriceUSD":41.0,"costUSD":0,"marginUSD":43.0,"marginPct":1,"alert":false},{"sku":"DET0051","productName":"ARIEL REVITACOLOR 4KG C/4","quantity":60.0,"clientPriceUSD":35.98,"listPriceUSD":35.98,"costUSD":0,"marginUSD":35.98,"marginPct":1,"alert":false},{"sku":"JLT0005","productName":"JAB LIQ SALVO LIMON 1.2L","quantity":120.0,"clientPriceUSD":32.33,"listPriceUSD":32.33,"costUSD":0,"marginUSD":32.33,"marginPct":1,"alert":false},{"sku":"JLT0009","productName":"JAB LIQ SALVO LIMON 300 ML","quantity":120.0,"clientPriceUSD":10.42,"listPriceUSD":9.96,"costUSD":0,"marginUSD":10.42,"marginPct":1,"alert":false},{"sku":"SUA0006","productName":"DOWNY FLORAL 360 ML C/12","quantity":600.0,"clientPriceUSD":8.75,"listPriceUSD":8.75,"costUSD":0,"marginUSD":8.75,"marginPct":1,"alert":false},{"sku":"SUA0015","productName":"SUAVITEL ANOCHCOMPLETE","quantity":150.0,"clientPriceUSD":14.18,"listPriceUSD":14.35,"costUSD":0,"marginUSD":14.18,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":32366.44,"totalCostUSD":0,"totalMarginUSD":32366.44,"totalMarginPct":1,"hasAlerts":false}},{"id":"iwp3zm","date":"29/04/2026","client":"MEX-MORE","month":"Abr","monthIndex":3,"folio":"","sellerId":"s2","sellerName":"Laura Vega","zone":"Texas","confirmedAt":"29/04/2026","exchangeRate":17.15,"items":[{"sku":"750221712204-7","productName":"VEL. ORO BRILUX ANGEL DE","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"750300239803-6","productName":"VEL. BRILUX VIRGEN DE G.","quantity":400.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"7503002398043","productName":"VEL. 395 BRILUX SAN JUDAS","quantity":400.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL0010","productName":"VEL. 395 BRILUX V. DE","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL2200","productName":"VEL. 395 BRILUX SAN JOSE B.","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL3121","productName":"VEL. 395 PARAF SAN JUDAS","quantity":25.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL3127","productName":"VEL. 105 PARAF LISO AMARILL","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3128","productName":"VEL. 105 PARAF LISO AZUL","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3129","productName":"VEL. 395 PARAF LISO BLANCO","quantity":100.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3132","productName":"VEL. 105 PARAF LISO MORAD","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3134","productName":"VEL. 105 PARAF LISO NEGRO","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3135","productName":"VEL. 105 PARAF LISO ROJA","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3136","productName":"VEL. 105 PARAF LISO ROSA","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3137","productName":"VEL. 105 PARAF LISO VERDE","quantity":25.0,"clientPriceUSD":13.4,"listPriceUSD":13.4,"costUSD":0,"marginUSD":13.4,"marginPct":1,"alert":false},{"sku":"VEL3249","productName":"VEL. 105 PARAF 7 COLORES","quantity":100.0,"clientPriceUSD":15.0,"listPriceUSD":15.0,"costUSD":0,"marginUSD":15.0,"marginPct":1,"alert":false},{"sku":"VEL5040","productName":"VEL. 14 DIAS SANTA MUERTE","quantity":80.0,"clientPriceUSD":31.0,"listPriceUSD":31.0,"costUSD":0,"marginUSD":31.0,"marginPct":1,"alert":false},{"sku":"VEL5088","productName":"VEL. 14 DIAS SAN JUDAS","quantity":80.0,"clientPriceUSD":30.6,"listPriceUSD":30.6,"costUSD":0,"marginUSD":30.6,"marginPct":1,"alert":false},{"sku":"VEL5103","productName":"VEL. 14 DIAS VIRGEN DE G.","quantity":160.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5104","productName":"VEL. 14 DIAS SAN J TADEO.","quantity":160.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5105","productName":"VEL. 14 DIAS NINO JESUS","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5106","productName":"VEL. 14 DIAS SAG CORAZON","quantity":80.0,"clientPriceUSD":32.86,"listPriceUSD":32.86,"costUSD":0,"marginUSD":32.86,"marginPct":1,"alert":false},{"sku":"VEL5129","productName":"VEL. 14 DIAS AROMA COCO","quantity":16.0,"clientPriceUSD":32.7,"listPriceUSD":32.7,"costUSD":0,"marginUSD":32.7,"marginPct":1,"alert":false},{"sku":"VEL5146","productName":"VEL. 14 DIAS AROMA ROSAS","quantity":16.0,"clientPriceUSD":32.7,"listPriceUSD":32.7,"costUSD":0,"marginUSD":32.7,"marginPct":1,"alert":false},{"sku":"VEL5148","productName":"VEL. 14 DIAS AROMA HERBAL","quantity":16.0,"clientPriceUSD":32.7,"listPriceUSD":32.7,"costUSD":0,"marginUSD":32.7,"marginPct":1,"alert":false},{"sku":"VEL7863","productName":"VEL. 395 BRILUX JESUS CRUZI","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL8664","productName":"VEL. 395 BRILUX V. DE GUAD","quantity":100.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL8711","productName":"VEL. BRILUX JESUS EN TI","quantity":50.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL8788","productName":"VEL. 395 BRILUX JUAN PABLO","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL8866","productName":"VEL. 395 BRILUX GRAN","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL9828","productName":"VEL. 395 BRILUX 7 POWERS","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false},{"sku":"VEL9829","productName":"VEL. 395 BRILUX JUSTO JUEZ","quantity":25.0,"clientPriceUSD":10.71,"listPriceUSD":10.71,"costUSD":0,"marginUSD":10.71,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":41485.65,"totalCostUSD":0,"totalMarginUSD":41485.65,"totalMarginPct":1,"hasAlerts":false}},{"id":"6j9v5e","date":"11/05/2026","client":"FRONTERA IMPORTS","month":"May","monthIndex":4,"folio":"","sellerId":"s3","sellerName":"Roberto Solis","zone":"Texas","confirmedAt":"11/05/2026","exchangeRate":17.15,"items":[{"sku":"SUA0019","productName":"SUAVITEL CUIDADO DIARIO","quantity":560.0,"clientPriceUSD":17.15,"listPriceUSD":18.0,"costUSD":0,"marginUSD":17.15,"marginPct":1,"alert":false}],"summary":{"totalRevenueUSD":9604.0,"totalCostUSD":0,"totalMarginUSD":9604.0,"totalMarginPct":1,"hasAlerts":false}}];

const fU=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n||0);
const fM=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(n||0);
const pct=n=>`${((n||0)*100).toFixed(1)}%`;
const uid=()=>Math.random().toString(36).slice(2,8);
const C=["#f0a500","#00c896","#6c8dfa","#ff6b6b","#c084fc","#38bdf8","#fb923c","#a3e635"];
const mc=m=>m>0.25?"#00c896":m>0.15?"#f0a500":"#ff3c3c";
const ML=["Ene","Feb","Mar","Abr","May","Jun"];
const MN=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const ZN=["Texas","California","Florida","Arizona","New Mexico","Nevada"];
const XR_API="https://api.frankfurter.app/latest?from=USD&to=MXN";

const SELLERS=[
  {id:"s1",name:"Carlos Mendoza",zone:"Texas",email:"c.mendoza@formexa.mx",av:"CM"},
  {id:"s2",name:"Laura Vega",zone:"Texas",email:"l.vega@formexa.mx",av:"LV"},
  {id:"s3",name:"Roberto Solis",zone:"Texas",email:"r.solis@formexa.mx",av:"RS"},
  {id:"s4",name:"Patricia Ríos",zone:"Texas",email:"p.rios@formexa.mx",av:"PR"},
];

async function callClaude(prompt,pdf_b64=null){
  const content=pdf_b64
    ?[{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdf_b64}},{type:"text",text:prompt}]
    :prompt;
  const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY||"";
  const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:3000,messages:[{role:"user",content}]})});
  const d=await r.json();
  return d.content?.find(b=>b.type==="text")?.text||"{}";
}

const Tip=({active,payload,label})=>{
  if(!active||!payload?.length)return null;
  return(<div style={{background:"#14141f",border:"1px solid #252535",padding:"8px 12px",fontSize:9.5}}>
    <div style={{color:"#555",marginBottom:3}}>{label}</div>
    {payload.map((p,i)=><div key={i} style={{color:p.color||"#f0a500"}}>{p.name}: {p.value>100?fU(p.value):`${p.value}%`}</div>)}
  </div>);
};

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:#f0a500}
.fade{animation:fi .3s ease}@keyframes fi{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.tab{background:none;border:none;color:#3a3a4a;font-family:inherit;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;padding:12px 13px;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;white-space:nowrap}
.tab.on{color:#f0a500;border-bottom-color:#f0a500}.tab:hover{color:#bbb}
.card{background:#0d0d1c;border:1px solid #181826;padding:18px;position:relative;overflow:hidden}
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#f0a500,transparent)}
.btn{background:#f0a500;color:#06060e;border:none;padding:9px 20px;font-family:inherit;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;font-weight:700;cursor:pointer;transition:all .15s;white-space:nowrap}
.btn:hover{background:#ffb800}.btn:disabled{background:#181826;color:#333;cursor:not-allowed}
.btng{background:#00c896;color:#06060e;border:none;padding:9px 20px;font-family:inherit;font-size:8.5px;letter-spacing:2px;text-transform:uppercase;font-weight:700;cursor:pointer;white-space:nowrap}
.btng:hover{background:#00dfaa}.btng:disabled{background:#181826;color:#333;cursor:not-allowed}
.ghost{background:none;border:1px solid #1e1e2e;color:#555;padding:7px 14px;font-family:inherit;font-size:8.5px;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .15s;white-space:nowrap}
.ghost:hover{border-color:#f0a500;color:#f0a500}
.inp{background:#09091a;border:1px solid #181826;color:#dedad0;padding:8px 12px;font-family:inherit;font-size:11px;width:100%;outline:none;transition:border .15s}
.inp:focus{border-color:#f0a500}
.sel{background:#09091a;border:1px solid #181826;color:#dedad0;padding:8px 12px;font-family:inherit;font-size:11px;width:100%;outline:none;cursor:pointer}
.lbl{font-size:7.5px;color:#3a3a4a;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:5px}
.slbl{font-size:7.5px;color:#f0a500;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}
.pill{display:inline-block;padding:2px 8px;font-size:7.5px;font-weight:600}
.pr{background:rgba(255,60,60,.12);color:#ff6060}.pg{background:rgba(0,200,150,.12);color:#00c896}
.py{background:rgba(240,165,0,.12);color:#f0a500}.pb{background:rgba(108,141,250,.12);color:#6c8dfa}
.drop{border:2px dashed #181826;padding:28px;text-align:center;cursor:pointer;transition:all .15s}
.drop.ov,.drop:hover{border-color:#f0a500;background:rgba(240,165,0,.03)}
.tbl{width:100%;border-collapse:collapse;font-size:10.5px}
.tbl th{color:#3a3a4a;font-size:7.5px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;text-align:left;border-bottom:1px solid #0e0e1c;white-space:nowrap}
.tbl td{padding:9px 12px;border-bottom:1px solid #09091a;vertical-align:middle}
.tbl tr:hover td{background:rgba(255,255,255,.008)}
.ra{background:rgba(255,60,60,.05);border-left:3px solid #ff3c3c}
.ro{border-left:3px solid #00c896}.rw{background:rgba(240,165,0,.05);border-left:3px solid #f0a500}
.mb{background:#0e0e1e;height:4px;border-radius:2px}.mf{height:4px;border-radius:2px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:900px){.g4{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.g4{grid-template-columns:1fr}.g3{grid-template-columns:1fr}.g2{grid-template-columns:1fr}}
.ava{border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;color:#06060e}
.spin{animation:sp 1s linear infinite;display:inline-block}@keyframes sp{to{transform:rotate(360deg)}}
.mbg{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px}
.mdl{background:#0d0d1c;border:1px solid #252535;padding:24px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto}
.mdlw{background:#0d0d1c;border:1px solid #252535;padding:24px;max-width:900px;width:100%;max-height:92vh;overflow-y:auto}
.ovfl{overflow-x:auto}
.chip{display:inline-flex;align-items:center;background:#0d0d1c;border:1px solid #181826;padding:3px 9px;font-size:8.5px;color:#555;white-space:nowrap}
.rtab{background:none;border:none;color:#3a3a4a;font-family:inherit;font-size:7.5px;letter-spacing:2px;text-transform:uppercase;padding:7px 12px;cursor:pointer;border-bottom:2px solid transparent;transition:all .15s}
.rtab.on{color:#f0a500;border-bottom-color:#f0a500}.rtab:hover{color:#bbb}
.rcard{background:#0d0d1c;border:1px solid #181826;padding:14px}
.ni{background:rgba(240,165,0,.05);border:1px solid rgba(240,165,0,.18);padding:11px 14px;font-size:9.5px;color:#a07800}
.ng{background:rgba(0,200,150,.05);border:1px solid rgba(0,200,150,.18);padding:11px 14px;font-size:9.5px;color:#00a070}
.nr{background:rgba(255,60,60,.05);border:1px solid rgba(255,60,60,.18);padding:11px 14px;font-size:9.5px;color:#cc4040}
.nb{background:rgba(108,141,250,.05);border:1px solid rgba(108,141,250,.18);padding:11px 14px;font-size:9.5px;color:#5070d0}
.dn{background:rgba(255,60,60,.12);color:#ff6060;padding:1px 7px;font-size:8.5px;font-weight:700}
.up{background:rgba(0,200,150,.12);color:#00c896;padding:1px 7px;font-size:8.5px;font-weight:700}
.nw{background:rgba(108,141,250,.12);color:#6c8dfa;padding:1px 7px;font-size:8.5px;font-weight:700}
`;

export default function App(){
  const[tab,setTab]=useState("dash");
  const[prods,setProds]=useState(P);
  const[sellers,setSellers]=useState(SELLERS);
  const[orders,setOrders]=useState(O);
  const[xr,setXr]=useState(17.15);
  const[xrLoad,setXrLoad]=useState(false);
  const[xrDate,setXrDate]=useState(null);
  // pedido
  const[oRes,setORes]=useState(null);
  const[oLoad,setOLoad]=useState(false);
  const[oErr,setOErr]=useState(null);
  const[drag,setDrag]=useState(false);
  const[txt,setTxt]=useState("");
  const fRef=useRef();
  // confirm
  const[showC,setShowC]=useState(false);
  const[cData,setCData]=useState({sellerId:"",client:"",zone:""});
  // costos
  const[cdrag,setCdrag]=useState(false);
  const[cLoad,setCLoad]=useState(false);
  const[cRes,setCRes]=useState(null);
  const[cErr,setCErr]=useState(null);
  const[cRev,setCRev]=useState([]);
  const[cOk,setCOk]=useState(false);
  const cfRef=useRef();
  // catalog
  const[eProd,setEProd]=useState(null);
  const[showAP,setShowAP]=useState(false);
  const[nProd,setNProd]=useState({sku:"",name:"",costMXN:"",listPriceUSD:"",category:"",brand:""});
  const[catSrch,setCatSrch]=useState("");
  const[catCat,setCatCat]=useState("all");
  // sellers
  const[showAS,setShowAS]=useState(false);
  const[nSell,setNSell]=useState({name:"",zone:"",email:""});
  // reports
  const[rf,setRf]=useState({seller:"all",month:"all"});
  const[rv,setRv]=useState("overview");
  const[selO,setSelO]=useState(null);

  useEffect(()=>{
    (async()=>{setXrLoad(true);try{const r=await fetch(XR_API);const d=await r.json();if(d.rates?.MXN){setXr(parseFloat(d.rates.MXN.toFixed(4)));setXrDate(new Date());}}catch(e){}finally{setXrLoad(false);}})();
  },[]);

  useEffect(()=>{
    if(cData.sellerId){const s=sellers.find(x=>x.id===cData.sellerId);if(s)setCData(d=>({...d,zone:s.zone}));}
  },[cData.sellerId]);

  const totalRev=orders.reduce((a,o)=>a+o.summary.totalRevenueUSD,0);
  const costsN=prods.filter(p=>p.costMXN>0).length;

  const filt=orders.filter(o=>{
    if(rf.seller!=="all"&&o.sellerId!==rf.seller)return false;
    if(rf.month!=="all"&&o.month!==rf.month)return false;
    return true;
  });
  const rRev=filt.reduce((a,o)=>a+o.summary.totalRevenueUSD,0);
  const rMar=filt.reduce((a,o)=>a+o.summary.totalMarginUSD,0);

  const byM=ML.map(m=>{const mo=filt.filter(o=>o.month===m);const rev=mo.reduce((a,o)=>a+o.summary.totalRevenueUSD,0);return{month:m,revenue:+rev.toFixed(0)};});
  const byC=[...new Set(filt.map(o=>o.client))].map(c=>{const co=filt.filter(o=>o.client===c);return{name:c,revenue:+co.reduce((a,o)=>a+o.summary.totalRevenueUSD,0).toFixed(0),orders:co.length};}).sort((a,b)=>b.revenue-a.revenue);
  const byS=sellers.map(s=>{const so=filt.filter(o=>o.sellerId===s.id);const rev=so.reduce((a,o)=>a+o.summary.totalRevenueUSD,0);return{name:s.name.split(" ")[0],fullName:s.name,revenue:+rev.toFixed(0),orders:so.length};}).filter(s=>s.orders>0);
  const skuMap={};
  filt.forEach(o=>o.items.forEach(it=>{if(!skuMap[it.sku])skuMap[it.sku]={sku:it.sku,name:it.productName,rev:0,qty:0};skuMap[it.sku].rev+=(it.clientPriceUSD||0)*it.quantity;skuMap[it.sku].qty+=it.quantity;}));
  const bySku=Object.values(skuMap).sort((a,b)=>b.rev-a.rev);

  // analyze order
  const doAnalyze=async(input)=>{
    setOErr(null);setORes(null);setOLoad(true);
    try{
      const pl=prods.map(p=>`${p.sku}|${p.name}|lista:$${p.listPriceUSD}|costo:$${p.costMXN}MXN`).join("\n");
      const prompt=`Sistema márgenes Formexa USA. TC:1 USD=${xr} MXN.
CATALOGO:
${pl}
PEDIDO:
${input}
SOLO JSON:
{"orderItems":[{"sku":"","productName":"","matchedProduct":"","quantity":1,"clientPriceUSD":0,"listPriceUSD":0,"costMXN":0,"costUSD":0,"marginUSD":0,"marginPct":0,"alert":false}],"summary":{"totalRevenueUSD":0,"totalCostUSD":0,"totalMarginUSD":0,"totalMarginPct":0,"hasAlerts":false,"recommendation":""},"unmatched":[]}`;
      const raw=await callClaude(prompt);
      setORes(JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,"").trim()));
    }catch(e){setOErr("Error: "+e.message);}finally{setOLoad(false);}
  };

  const handleFileDrop=useCallback(async(file)=>{
    let t=file.name.endsWith(".pdf")?`[PDF:${file.name}]`:await file.text();
    if(txt)t=txt+"\n"+t;
    await doAnalyze(t||txt);
  },[prods,xr,txt]);

  const confirmOrder=()=>{
    if(!cData.sellerId||!cData.client)return;
    const s=sellers.find(x=>x.id===cData.sellerId);
    const now=new Date();
    setOrders(prev=>[{id:uid(),sellerId:s.id,sellerName:s.name,zone:cData.zone||s.zone,client:cData.client,month:MN[now.getMonth()],monthIndex:now.getMonth(),folio:"",confirmedAt:now.toLocaleDateString("es-MX"),exchangeRate:xr,items:oRes.orderItems||[],summary:oRes.summary},...prev]);
    setShowC(false);setORes(null);setTxt("");setCData({sellerId:"",client:"",zone:""});setTab("hist");
  };

  const handleCostFile=useCallback(async(file)=>{
    if(!file.name.endsWith(".pdf")){setCErr("Solo PDF Alpha");return;}
    setCErr(null);setCRes(null);setCOk(false);setCLoad(true);
    try{
      const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
      const pl=prods.map(p=>`${p.sku}|${p.name}`).join("\n");
      const prompt=`Extrae costos del reporte Alpha ERP "Reporte de compras netas por producto".
Formato: CLAVE + DESCRIPCION, luego líneas con fecha DD/MM/AAAA y costo unitario.
REGLA: toma SOLO la línea con fecha MÁS RECIENTE por producto.
CATALOGO: ${pl}
SOLO JSON: {"extractedProducts":[{"reportSku":"","reportName":"","category":"","mostRecentDate":"","mostRecentCostMXN":0,"supplier":"","matchedSku":null,"matchConfidence":"high|medium|low|none","isNew":false}],"totalProducts":0}`;
      const raw=await callClaude(prompt,b64);
      const result=JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,"").trim());
      setCRes(result);
      setCRev((result.extractedProducts||[]).map(ep=>{
        const cur=prods.find(p=>p.sku===ep.matchedSku);
        const prev=cur?.costMXN||null;
        const diff=prev&&prev>0?((ep.mostRecentCostMXN-prev)/prev):null;
        return{...ep,prevCost:prev,editedCost:ep.mostRecentCostMXN,diff,include:ep.matchConfidence!=="none",newListPriceUSD:""};
      }));
    }catch(e){setCErr("Error: "+e.message);}finally{setCLoad(false);}
  },[prods]);

  const applyCosts=()=>{
    const upd=cRev.filter(r=>r.include&&r.matchedSku&&!r.isNew);
    const add=cRev.filter(r=>r.addNew&&r.isNew&&r.newListPriceUSD);
    setProds(prev=>{
      let a=[...prev];
      upd.forEach(r=>{a=a.map(p=>p.sku===r.matchedSku?{...p,costMXN:r.editedCost,lastUpdated:r.mostRecentDate}:p);});
      add.forEach(r=>{a.push({id:uid(),sku:r.reportSku,name:r.reportName,costMXN:r.editedCost,listPriceUSD:parseFloat(r.newListPriceUSD)||0,category:r.category,brand:"",lastUpdated:r.mostRecentDate});});
      return a;
    });
    setCOk(true);
  };

  const exportCSV=()=>{
    const rows=filt.map(o=>({Fecha:o.confirmedAt,Cliente:o.client,Vendedor:o.sellerName,Venta_USD:o.summary.totalRevenueUSD.toFixed(2),Facturas:o.items.length,TC:o.exchangeRate}));
    if(!rows.length)return;
    const k=Object.keys(rows[0]);
    const csv=[k.join(","),...rows.map(r=>k.map(x=>`"${r[x]}"`).join(","))].join("\n");
    const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,"+encodeURIComponent(csv);a.download="formexa_reporte.csv";a.click();
  };

  const cats=[...new Set(prods.map(p=>p.category))].sort();
  const pFilt=prods.filter(p=>{
    if(catCat!=="all"&&p.category!==catCat)return false;
    if(catSrch&&!p.name.toLowerCase().includes(catSrch.toLowerCase())&&!p.sku.toLowerCase().includes(catSrch.toLowerCase()))return false;
    return true;
  });

  const TABS=[["dash","Dashboard"],["costos","Cargar Costos"],["pedido","Nuevo Pedido"],["hist","Facturas"],["rep","Reportes"],["cat","Catálogo"],["vend","Equipo"]];

  return(
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:"#06060e",minHeight:"100vh",color:"#d8d4c8"}}>
      <style>{CSS}</style>

      {/* HEADER */}
      <div style={{borderBottom:"1px solid #0e0e1c",display:"flex",alignItems:"stretch",justifyContent:"space-between",paddingRight:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"stretch",flexWrap:"wrap"}}>
          <div style={{padding:"11px 18px",borderRight:"1px solid #0e0e1c",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:900,lineHeight:1.2}}>
              <span style={{color:"#d8d4c8"}}>Margin & Client </span><span style={{color:"#f0a500"}}>Sistem</span>
            </div>
            <div style={{fontSize:7,letterSpacing:3,color:"#181826",marginTop:1}}>FORMEXA USA LLC</div>
          </div>
          <nav style={{display:"flex",alignItems:"stretch",flexWrap:"wrap"}}>
            {TABS.map(([k,v])=><button key={k} className={`tab ${tab===k?"on":""}`} onClick={()=>setTab(k)}>{v}</button>)}
          </nav>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {costsN===0&&<div style={{fontSize:7.5,color:"#f0a500",padding:"3px 9px",background:"rgba(240,165,0,.08)",border:"1px solid rgba(240,165,0,.2)"}}>⚠ Sin costos</div>}
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:7,color:"#252535",letterSpacing:2}}>USD/MXN</div>
            <div style={{fontSize:15,color:"#f0a500",fontWeight:600,lineHeight:1.1}}>{xr.toFixed(4)}</div>
            {xrDate&&<div style={{fontSize:7,color:"#181826"}}>{xrDate.toLocaleTimeString("es-MX")}</div>}
          </div>
          <button className="ghost" style={{padding:"5px 9px"}} onClick={async()=>{setXrLoad(true);try{const r=await fetch(XR_API);const d=await r.json();if(d.rates?.MXN){setXr(parseFloat(d.rates.MXN.toFixed(4)));setXrDate(new Date());}}catch(e){}finally{setXrLoad(false);}}} disabled={xrLoad}>
            {xrLoad?<span className="spin">↻</span>:"↻"}
          </button>
        </div>
      </div>

      <div style={{padding:"22px 20px",maxWidth:1300,margin:"0 auto"}}>

        {/* DASHBOARD */}
        {tab==="dash"&&<div className="fade">
          <div className="slbl">Margin & Client Sistem · Ene–May 2026</div>
          {costsN===0&&<div className="ni" style={{marginBottom:16,display:"flex",gap:10,alignItems:"center"}}>
            <span>💡</span>
            <div>Carga el PDF de compras Alpha para ver márgenes reales. <button className="ghost" style={{padding:"2px 9px",fontSize:7.5,marginLeft:8}} onClick={()=>setTab("costos")}>Cargar →</button></div>
          </div>}
          <div className="g4" style={{marginBottom:18}}>
            {[["FACTURACIÓN",fU(totalRev),"#d8d4c8","hist"],["CLIENTES",`${new Set(orders.map(o=>o.client)).size}`,"#6c8dfa","hist"],["FACTURAS",orders.length,"#f0a500","hist"],["CATÁLOGO",`${prods.length} SKUs`,"#00c896","cat"]].map(([l,v,c,t])=>(
              <div key={l} className="card" style={{cursor:"pointer"}} onClick={()=>setTab(t)}>
                <div className="lbl">{l}</div>
                <div style={{fontSize:22,color:c,fontWeight:300,marginTop:5}}>{v}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{marginBottom:16}}>
            <div className="card">
              <div className="lbl" style={{marginBottom:10}}>Facturación Mensual (USD)</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={byM} barSize={22}>
                  <XAxis dataKey="month" tick={{fill:"#3a3a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis hide/><Tooltip content={<Tip/>}/>
                  <Bar dataKey="revenue" name="Venta" radius={[3,3,0,0]}>{byM.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="lbl" style={{marginBottom:10}}>Venta por Cliente</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={byC.slice(0,5)} barSize={18} layout="vertical">
                  <XAxis type="number" hide/><YAxis dataKey="name" type="category" tick={{fill:"#555",fontSize:8.5}} width={110} axisLine={false} tickLine={false}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="revenue" name="Venta" radius={[0,3,3,0]}>{byC.slice(0,5).map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="g2">
            <div>
              <div className="slbl">Top Clientes</div>
              <div style={{background:"#0d0d1c",border:"1px solid #181826"}}>
                {byC.slice(0,5).map((c,i)=>(
                  <div key={c.name} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<4?"1px solid #090914":"none"}}>
                    <div style={{width:16,fontSize:11,color:i===0?"#f0a500":"#222"}}>{i===0?"★":i+1}</div>
                    <div className="ava" style={{width:26,height:26,fontSize:9,background:C[i%C.length]}}>{c.name[0]}</div>
                    <div style={{flex:1}}><div style={{fontSize:10.5}}>{c.name}</div><div style={{fontSize:7.5,color:"#3a3a4a"}}>{c.orders} facturas</div></div>
                    <div style={{fontSize:10.5,color:"#f0a500"}}>{fU(c.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="slbl">Últimas Facturas</div>
              <div style={{background:"#0d0d1c",border:"1px solid #181826"}}>
                {orders.slice(0,5).map((o,i)=>(
                  <div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:i<4?"1px solid #090914":"none",cursor:"pointer"}} onClick={()=>setSelO(o)}>
                    <div><div style={{fontSize:10.5}}>{o.client}</div><div style={{fontSize:7.5,color:"#3a3a4a"}}>{o.confirmedAt} · {o.sellerName.split(" ")[0]}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:10.5,color:"#f0a500"}}>{fU(o.summary.totalRevenueUSD)}</div><div style={{fontSize:7.5,color:"#3a3a4a"}}>{o.items.length} SKUs</div></div>
                  </div>
                ))}
                <div style={{padding:"9px 14px",borderTop:"1px solid #090914"}}>
                  <button className="ghost" style={{width:"100%",fontSize:7.5}} onClick={()=>setTab("hist")}>Ver todas →</button>
                </div>
              </div>
            </div>
          </div>
        </div>}

        {/* CARGAR COSTOS */}
        {tab==="costos"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
            <div><div className="slbl" style={{marginBottom:3}}>Cargar Reporte de Compras</div><div style={{fontSize:9.5,color:"#444"}}>PDF mensual · Sistema Alpha / Formexa MX</div></div>
            {cRes&&!cOk&&<div style={{display:"flex",gap:8}}><button className="ghost" onClick={()=>{setCRes(null);setCRev([]);setCErr(null);}}>Descartar</button><button className="btng" onClick={applyCosts}>✓ Aplicar {cRev.filter(r=>r.include).length} actualizaciones</button></div>}
          </div>
          {!cRes&&!cLoad&&<div className="nb" style={{marginBottom:14}}>
            <b>Flujo mensual:</b> 1. Exporta PDF de compras Alpha → 2. Sube aquí → 3. La IA toma el costo más reciente por SKU → 4. Revisas y confirmas
          </div>}
          {!cRes&&!cLoad&&<div className={`drop ${cdrag?"ov":""}`} style={{marginBottom:14}}
            onDragOver={e=>{e.preventDefault();setCdrag(true)}} onDragLeave={()=>setCdrag(false)}
            onDrop={e=>{e.preventDefault();setCdrag(false);const f=e.dataTransfer.files[0];if(f)handleCostFile(f)}}
            onClick={()=>cfRef.current?.click()}>
            <input ref={cfRef} type="file" style={{display:"none"}} accept=".pdf" onChange={e=>{if(e.target.files[0])handleCostFile(e.target.files[0]);}}/>
            <div style={{fontSize:22,marginBottom:7}}>📄</div>
            <div style={{fontSize:10.5,color:"#555",marginBottom:3}}>Drop reporte de compras (PDF Alpha)</div>
            <div style={{fontSize:7.5,color:"#2a2a38",letterSpacing:1}}>SOLO PDF · SISTEMA ALPHA</div>
          </div>}
          {cErr&&<div className="nr" style={{marginBottom:12}}>{cErr}</div>}
          {cLoad&&<div style={{textAlign:"center",padding:44,color:"#f0a500"}}><div className="spin" style={{fontSize:24}}>⟳</div><div style={{fontSize:7.5,letterSpacing:3,marginTop:10}}>LEYENDO · IDENTIFICANDO SKUs · EXTRAYENDO COSTOS RECIENTES</div></div>}
          {cOk&&<div className="ng" style={{marginBottom:14}}><b>✓ Costos actualizados.</b> <button className="ghost" style={{marginLeft:10,fontSize:7.5}} onClick={()=>{setCRes(null);setCRev([]);setCOk(false);}}>Cargar otro</button></div>}
          {cRes&&!cOk&&<div className="fade">
            <div style={{display:"flex",gap:12,marginBottom:12,flexWrap:"wrap"}}>
              {[["LEÍDOS",cRes.totalProducts||cRev.length,"#d8d4c8"],["ACTUALIZACIONES",cRev.filter(r=>r.include&&!r.isNew).length,"#f0a500"],["NUEVOS",cRev.filter(r=>r.isNew).length,"#6c8dfa"],["SIN MATCH",cRev.filter(r=>r.matchConfidence==="none").length,"#ff6060"]].map(([l,v,c])=>(
                <div key={l} className="rcard" style={{flex:1,minWidth:100}}><div className="lbl">{l}</div><div style={{fontSize:20,color:c,fontWeight:300,marginTop:3}}>{v}</div></div>
              ))}
            </div>
            <div className="ni" style={{marginBottom:10,fontSize:8.5}}>Revisa y edita si es necesario. TC actual: {xr.toFixed(2)} MXN/USD</div>
            <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826",marginBottom:12}}>
              <table className="tbl">
                <thead><tr><th>✓</th><th>Clave</th><th>Producto</th><th>Match</th><th>Fecha</th><th>Anterior MXN</th><th>Nuevo MXN</th><th>Var.</th><th>USD</th></tr></thead>
                <tbody>{cRev.map((row,i)=>(
                  <tr key={i} className={row.isNew?"rw":row.matchConfidence==="none"?"ra":"ro"}>
                    <td><input type="checkbox" checked={row.include} onChange={e=>setCRev(p=>p.map((r,j)=>j===i?{...r,include:e.target.checked}:r))} style={{accentColor:"#f0a500"}}/></td>
                    <td style={{color:"#f0a500",fontSize:9}}>{row.reportSku}</td>
                    <td style={{maxWidth:160,fontSize:10}}>{row.reportName}</td>
                    <td>{row.isNew?<span className="nw">NUEVO</span>:row.matchedSku?<span style={{fontSize:8.5,color:"#00c896"}}>{row.matchedSku}</span>:<span className="pill pr">—</span>}</td>
                    <td style={{color:"#555",fontSize:8.5}}>{row.mostRecentDate}</td>
                    <td style={{color:"#666",fontSize:9}}>{row.prevCost>0?fM(row.prevCost):"—"}</td>
                    <td><input type="number" className="inp" style={{width:80,fontSize:10}} value={row.editedCost} onChange={e=>setCRev(p=>p.map((r,j)=>j===i?{...r,editedCost:parseFloat(e.target.value)||0}:r))}/></td>
                    <td>{row.diff>0?<span className="dn">+{(row.diff*100).toFixed(1)}%</span>:row.diff<0?<span className="up">{(row.diff*100).toFixed(1)}%</span>:<span>—</span>}</td>
                    <td style={{color:"#777",fontSize:9}}>{fU(row.editedCost/xr)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
              <button className="ghost" onClick={()=>{setCRes(null);setCRev([]);}}>Descartar</button>
              <button className="btng" onClick={applyCosts}>✓ Aplicar {cRev.filter(r=>r.include).length}</button>
            </div>
          </div>}
        </div>}

        {/* NUEVO PEDIDO */}
        {tab==="pedido"&&<div className="fade">
          <div className="slbl">Analizar Pedido de Cliente</div>
          <div className={`drop ${drag?"ov":""}`} style={{marginBottom:14}}
            onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handleFileDrop(f)}}
            onClick={()=>fRef.current?.click()}>
            <input ref={fRef} type="file" style={{display:"none"}} accept=".xlsx,.pdf,.csv,.txt" onChange={e=>{if(e.target.files[0])handleFileDrop(e.target.files[0]);}}/>
            <div style={{fontSize:22,marginBottom:6}}>📂</div>
            <div style={{fontSize:10.5,color:"#555",marginBottom:3}}>Drop del pedido del cliente</div>
            <div style={{fontSize:7.5,color:"#2a2a38",letterSpacing:1}}>PDF · EXCEL · CSV · TXT</div>
          </div>
          <div style={{marginBottom:12}}>
            <div className="lbl">O pega el texto del pedido</div>
            <textarea className="inp" rows={5} style={{resize:"vertical"}} placeholder={"DET0008 x 120 cajas @ $20.00 USD\nSUA0019 x 560 cajas @ $17.15 USD\nJLT0003 x 90 cajas @ $16.50 USD"} value={txt} onChange={e=>setTxt(e.target.value)}/>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:18}}>
            <button className="btn" onClick={()=>doAnalyze(txt)} disabled={oLoad||!txt.trim()}>{oLoad?<span><span className="spin">⟳</span> Analizando…</span>:"▶ Analizar"}</button>
            {oRes&&<button className="ghost" onClick={()=>{setORes(null);setTxt("");}}>Limpiar</button>}
          </div>
          {oErr&&<div className="nr" style={{marginBottom:12}}>{oErr}</div>}
          {oLoad&&<div style={{textAlign:"center",padding:40,color:"#f0a500"}}><div className="spin" style={{fontSize:22}}>⟳</div><div style={{fontSize:7.5,letterSpacing:3,marginTop:10}}>ANALIZANDO · CRUZANDO CATÁLOGO FORMEXA</div></div>}
          {oRes&&!oLoad&&<div className="fade">
            {oRes.summary?.hasAlerts&&<div className="nr" style={{marginBottom:12,display:"flex",gap:10,alignItems:"center"}}><span>⚠️</span><div><b>HAY PRODUCTOS CON MARGEN BAJO</b><div style={{fontSize:8.5,marginTop:2}}>{oRes.summary.recommendation}</div></div></div>}
            <div className="g4" style={{marginBottom:14}}>
              {[["VENTA",fU(oRes.summary?.totalRevenueUSD),"#d8d4c8"],["COSTO",fU(oRes.summary?.totalCostUSD),"#444"],["GANANCIA",fU(oRes.summary?.totalMarginUSD),(oRes.summary?.totalMarginUSD||0)>0?"#00c896":"#ff3c3c"],["MARGEN",pct(oRes.summary?.totalMarginPct),mc(oRes.summary?.totalMarginPct||0)]].map(([l,v,c])=>(
                <div key={l} className="rcard"><div className="lbl">{l}</div><div style={{fontSize:18,color:c,fontWeight:300,marginTop:4}}>{v}</div></div>
              ))}
            </div>
            <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826",marginBottom:14}}>
              <table className="tbl">
                <thead><tr><th>Producto</th><th>SKU</th><th>Qty</th><th>Precio</th><th>Lista</th><th>Costo</th><th>Ganancia/u</th><th>Margen</th></tr></thead>
                <tbody>{(oRes.orderItems||[]).map((it,i)=>(
                  <tr key={i} className={it.alert?(it.marginPct<0?"ra":"rw"):"ro"}>
                    <td style={{fontSize:10}}>{it.productName}{it.matchedProduct&&it.matchedProduct!==it.productName&&<div style={{fontSize:7.5,color:"#3a3a4a"}}>→{it.matchedProduct}</div>}</td>
                    <td style={{color:"#f0a500",fontSize:9}}>{it.sku||"—"}</td>
                    <td>{it.quantity}</td>
                    <td style={{color:it.clientPriceUSD<(it.costUSD||0)?"#ff6060":"#d8d4c8"}}>{fU(it.clientPriceUSD)}</td>
                    <td style={{color:"#444"}}>{fU(it.listPriceUSD)}</td>
                    <td style={{color:"#333"}}>{it.costUSD>0?fU(it.costUSD):"—"}</td>
                    <td style={{color:it.marginUSD>0?"#00c896":"#ff3c3c"}}>{it.costUSD>0?fU(it.marginUSD):"—"}</td>
                    <td><div style={{display:"flex",alignItems:"center",gap:6}}><div className="mb" style={{width:40}}><div className="mf" style={{width:`${Math.max(0,Math.min(100,(it.marginPct||0)*100))}%`,background:mc(it.marginPct)}}/></div><span style={{fontSize:9,color:mc(it.marginPct)}}>{pct(it.marginPct)}</span></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn" onClick={()=>setShowC(true)}>✓ Confirmar y Asignar</button></div>
          </div>}
        </div>}

        {/* FACTURAS */}
        {tab==="hist"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
            <div className="slbl" style={{marginBottom:0}}>Historial de Facturas · {filt.length} registros</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <select className="sel" style={{width:"auto"}} value={rf.seller} onChange={e=>setRf(f=>({...f,seller:e.target.value}))}>
                <option value="all">Todos los vendedores</option>
                {sellers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select className="sel" style={{width:"auto"}} value={rf.month} onChange={e=>setRf(f=>({...f,month:e.target.value}))}>
                <option value="all">Todos los meses</option>
                {ML.map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826"}}>
            <table className="tbl">
              <thead><tr><th>Fecha</th><th>Cliente</th><th>Vendedor</th><th>Folio</th><th>Venta USD</th><th>SKUs</th><th>TC</th><th></th></tr></thead>
              <tbody>{filt.map(o=>(
                <tr key={o.id} style={{cursor:"pointer"}} onClick={()=>setSelO(o)}>
                  <td style={{color:"#444",fontSize:9}}>{o.confirmedAt}</td>
                  <td style={{fontSize:10.5,fontWeight:500}}>{o.client}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div className="ava" style={{width:22,height:22,fontSize:8,background:C[sellers.findIndex(s=>s.id===o.sellerId)%C.length]||"#f0a500"}}>{sellers.find(s=>s.id===o.sellerId)?.av||"?"}</div>
                      <span style={{fontSize:10}}>{o.sellerName.split(" ")[0]}</span>
                    </div>
                  </td>
                  <td style={{color:"#3a3a4a",fontSize:9}}>{o.folio||"—"}</td>
                  <td style={{color:"#f0a500",fontWeight:500}}>{fU(o.summary.totalRevenueUSD)}</td>
                  <td style={{color:"#555"}}>{o.items.length}</td>
                  <td style={{color:"#252535",fontSize:9}}>{o.exchangeRate}</td>
                  <td><button className="ghost" style={{padding:"3px 9px",fontSize:7.5}} onClick={e=>{e.stopPropagation();setSelO(o);}}>Ver</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {/* REPORTES */}
        {tab==="rep"&&<div className="fade">
          <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"flex-end"}}>
            {[[rf.seller,"seller",sellers.map(s=>({v:s.id,l:s.name.split(" ")[0]})),"Vendedor"],[rf.month,"month",ML.map(m=>({v:m,l:m})),"Mes"]].map(([val,key,opts,label])=>(
              <div key={key}><div className="lbl">{label}</div>
                <select className="sel" style={{width:"auto",minWidth:110}} value={val} onChange={e=>setRf(f=>({...f,[key]:e.target.value}))}>
                  <option value="all">Todos</option>{opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
            <button className="btn" onClick={exportCSV}>↓ CSV</button>
            <button className="ghost" onClick={()=>setRf({seller:"all",month:"all"})}>Reset</button>
          </div>
          <div className="g4" style={{marginBottom:16}}>
            {[["VENTA",fU(rRev),"#d8d4c8"],["GANANCIA",fU(rMar),"#00c896"],["MARGEN",pct(rRev>0?rMar/rRev:0),mc(rRev>0?rMar/rRev:0)],["FACTURAS",filt.length,"#f0a500"]].map(([l,v,c])=>(
              <div key={l} className="card"><div className="lbl">{l}</div><div style={{fontSize:19,color:c,fontWeight:300,marginTop:4}}>{v}</div></div>
            ))}
          </div>
          {costsN===0&&<div className="ni" style={{marginBottom:12,fontSize:8.5}}>⚠ Márgenes estimados — carga PDF de compras para rentabilidad real.</div>}
          <div style={{borderBottom:"1px solid #0e0e1c",marginBottom:14,display:"flex",flexWrap:"wrap"}}>
            {[["overview","Resumen"],["clientes","Clientes"],["vendedores","Vendedores"],["sku","SKU"],["trend","Tendencia"]].map(([k,v])=>(
              <button key={k} className={`rtab ${rv===k?"on":""}`} onClick={()=>setRv(k)}>{v}</button>
            ))}
          </div>

          {rv==="overview"&&<div className="fade g2" style={{gap:12}}>
            <div className="card"><div className="lbl" style={{marginBottom:9}}>Venta Mensual</div>
              <ResponsiveContainer width="100%" height={155}><BarChart data={byM} barSize={22}>
                <XAxis dataKey="month" tick={{fill:"#3a3a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis hide/><Tooltip content={<Tip/>}/>
                <Bar dataKey="revenue" name="Venta" radius={[3,3,0,0]}>{byM.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
            <div className="card"><div className="lbl" style={{marginBottom:9}}>Por Cliente</div>
              <ResponsiveContainer width="100%" height={155}><PieChart>
                <Pie data={byC} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={60} label={({name,percent})=>`${name.split(" ")[0]} ${(percent*100).toFixed(0)}%`} style={{fontSize:8}}>
                  {byC.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}
                </Pie><Tooltip formatter={v=>fU(v)}/>
              </PieChart></ResponsiveContainer>
            </div>
            <div className="card"><div className="lbl" style={{marginBottom:9}}>Top SKUs Vendidos</div>
              <ResponsiveContainer width="100%" height={155}><BarChart data={bySku.slice(0,6)} barSize={14} layout="vertical">
                <XAxis type="number" hide/><YAxis dataKey="sku" type="category" tick={{fill:"#666",fontSize:8.5}} width={65} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="rev" name="Venta" radius={[0,3,3,0]}>{bySku.slice(0,6).map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
            <div className="card"><div className="lbl" style={{marginBottom:9}}>Tendencia</div>
              <ResponsiveContainer width="100%" height={155}><LineChart data={byM}>
                <XAxis dataKey="month" tick={{fill:"#3a3a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis hide/><Tooltip content={<Tip/>}/>
                <Line dataKey="revenue" name="Venta" stroke="#f0a500" strokeWidth={2} dot={{fill:"#f0a500",r:3}}/>
              </LineChart></ResponsiveContainer>
            </div>
          </div>}

          {rv==="clientes"&&<div className="fade">
            <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826"}}>
              <table className="tbl"><thead><tr><th>#</th><th>Cliente</th><th>Facturas</th><th>Venta Total</th></tr></thead>
                <tbody>{byC.map((c,i)=>(
                  <tr key={c.name}>
                    <td style={{color:C[i%C.length],fontSize:12}}>{i===0?"★":i+1}</td>
                    <td style={{display:"flex",alignItems:"center",gap:8,fontSize:10.5}}><div className="ava" style={{width:24,height:24,fontSize:8.5,background:C[i%C.length]}}>{c.name[0]}</div>{c.name}</td>
                    <td>{c.orders}</td>
                    <td style={{color:"#f0a500"}}>{fU(c.revenue)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>}

          {rv==="vendedores"&&<div className="fade">
            <div className="card" style={{marginBottom:12}}>
              <div className="lbl" style={{marginBottom:9}}>Venta por Vendedor</div>
              <ResponsiveContainer width="100%" height={160}><BarChart data={byS} barSize={24} layout="vertical">
                <XAxis type="number" hide/><YAxis dataKey="name" type="category" tick={{fill:"#666",fontSize:9.5}} width={65} axisLine={false} tickLine={false}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="revenue" name="Venta" radius={[0,3,3,0]}>{byS.map((_,i)=><Cell key={i} fill={C[i%C.length]}/>)}</Bar>
              </BarChart></ResponsiveContainer>
            </div>
            <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826"}}>
              <table className="tbl"><thead><tr><th>Vendedor</th><th>Facturas</th><th>Venta</th><th>#</th></tr></thead>
                <tbody>{[...byS].sort((a,b)=>b.revenue-a.revenue).map((s,i)=>(
                  <tr key={s.name}>
                    <td style={{display:"flex",alignItems:"center",gap:8}}><div className="ava" style={{width:24,height:24,fontSize:8.5,background:C[i%C.length]}}>{s.name[0]}</div>{s.fullName}</td>
                    <td>{s.orders}</td><td style={{color:"#f0a500"}}>{fU(s.revenue)}</td>
                    <td style={{color:C[i%C.length],fontSize:12}}>{i===0?"★":i+1}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>}

          {rv==="sku"&&<div className="fade">
            <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826"}}>
              <table className="tbl"><thead><tr><th>SKU</th><th>Producto</th><th>Cajas</th><th>Venta</th></tr></thead>
                <tbody>{bySku.map(s=>(
                  <tr key={s.sku}>
                    <td style={{color:"#f0a500",fontSize:9}}>{s.sku}</td>
                    <td style={{fontSize:10}}>{s.name}</td>
                    <td>{s.qty}</td><td>{fU(s.rev)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>}

          {rv==="trend"&&<div className="fade">
            <div className="card"><div className="lbl" style={{marginBottom:9}}>Venta por Vendedor / Mes</div>
              <ResponsiveContainer width="100%" height={200}><LineChart data={ML.map(m=>{const row={month:m};sellers.forEach(s=>{row[s.name.split(" ")[0]]=+orders.filter(o=>o.month===m&&o.sellerId===s.id).reduce((a,o)=>a+o.summary.totalRevenueUSD,0).toFixed(0)});return row;})}>
                <XAxis dataKey="month" tick={{fill:"#3a3a4a",fontSize:9}} axisLine={false} tickLine={false}/>
                <YAxis hide/><Tooltip content={<Tip/>}/><Legend wrapperStyle={{fontSize:8.5,color:"#555"}}/>
                {sellers.map((s,i)=><Line key={s.id} dataKey={s.name.split(" ")[0]} stroke={C[i%C.length]} strokeWidth={1.5} dot={{r:2}}/>)}
              </LineChart></ResponsiveContainer>
            </div>
          </div>}
        </div>}

        {/* CATÁLOGO */}
        {tab==="cat"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
            <div className="slbl" style={{marginBottom:0}}>Catálogo · {prods.length} SKUs (ABR 2026)</div>
            <div style={{display:"flex",gap:8}}><button className="ghost" onClick={()=>setTab("costos")}>↑ Costos</button><button className="btn" onClick={()=>setShowAP(!showAP)}>{showAP?"Cancelar":"+ Agregar"}</button></div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            <input className="inp" style={{maxWidth:240}} placeholder="SKU o nombre…" value={catSrch} onChange={e=>setCatSrch(e.target.value)}/>
            <select className="sel" style={{width:"auto"}} value={catCat} onChange={e=>setCatCat(e.target.value)}>
              <option value="all">Todas las categorías</option>{cats.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{fontSize:8.5,color:"#3a3a4a",alignSelf:"center"}}>{pFilt.length} productos · {costsN} con costo</span>
          </div>
          {showAP&&<div style={{background:"#0d0d1c",border:"1px solid #f0a500",padding:16,marginBottom:12}} className="fade">
            <div className="slbl">Nuevo Producto</div>
            <div className="g3" style={{gap:10,marginBottom:10}}>
              {[["SKU","sku"],["Nombre","name"],["Categoría","category"],["Marca","brand"]].map(([l,k])=>(
                <div key={k}><div className="lbl">{l}</div><input className="inp" value={nProd[k]} onChange={e=>setNProd({...nProd,[k]:e.target.value})}/></div>
              ))}
              <div><div className="lbl">Costo MXN</div><input className="inp" type="number" value={nProd.costMXN} onChange={e=>setNProd({...nProd,costMXN:e.target.value})}/></div>
              <div><div className="lbl">Lista USD</div><input className="inp" type="number" value={nProd.listPriceUSD} onChange={e=>setNProd({...nProd,listPriceUSD:e.target.value})}/></div>
            </div>
            <button className="btn" onClick={()=>{if(!nProd.sku||!nProd.name)return;setProds(p=>[...p,{...nProd,id:uid(),costMXN:parseFloat(nProd.costMXN)||0,listPriceUSD:parseFloat(nProd.listPriceUSD)||0}]);setNProd({sku:"",name:"",costMXN:"",listPriceUSD:"",category:"",brand:""});setShowAP(false);}}>Guardar</button>
          </div>}
          <div className="ovfl" style={{background:"#0d0d1c",border:"1px solid #181826"}}>
            <table className="tbl">
              <thead><tr><th>SKU</th><th>Producto</th><th>Cat.</th><th>Marca</th><th>Costo MXN</th><th>Costo USD</th><th>Lista USD</th><th>Actualizado</th><th>Margen</th><th></th></tr></thead>
              <tbody>{pFilt.map(p=>{
                const cu=p.costMXN>0?p.costMXN/xr:null;
                const m=cu!=null?(p.listPriceUSD-cu)/p.listPriceUSD:null;
                const ed=eProd?.id===p.id;
                return(<tr key={p.id} className={m!=null?(m<0?"ra":m<0.15?"rw":""):""}>
                  <td style={{color:"#f0a500",fontSize:9}}>{ed?<input className="inp" style={{width:75}} value={eProd.sku} onChange={e=>setEProd({...eProd,sku:e.target.value})}/>:p.sku}</td>
                  <td style={{fontSize:10}}>{ed?<input className="inp" value={eProd.name} onChange={e=>setEProd({...eProd,name:e.target.value})}/>:p.name}</td>
                  <td style={{color:"#3a3a4a",fontSize:8.5}}>{p.category}</td>
                  <td style={{color:"#252535",fontSize:8.5}}>{p.brand}</td>
                  <td style={{color:p.costMXN>0?"#d8d4c8":"#252535"}}>{ed?<input className="inp" type="number" style={{width:85}} value={eProd.costMXN} onChange={e=>setEProd({...eProd,costMXN:parseFloat(e.target.value)})}/>:p.costMXN>0?fM(p.costMXN):<span style={{fontSize:8}}>Pendiente</span>}</td>
                  <td style={{color:"#333",fontSize:9}}>{cu?fU(cu):"—"}</td>
                  <td>{ed?<input className="inp" type="number" style={{width:75}} value={eProd.listPriceUSD} onChange={e=>setEProd({...eProd,listPriceUSD:parseFloat(e.target.value)})}/>:fU(p.listPriceUSD)}</td>
                  <td style={{color:"#252535",fontSize:8.5}}>{p.lastUpdated||"—"}</td>
                  <td>{m!=null?<div style={{display:"flex",alignItems:"center",gap:6}}><div className="mb" style={{width:40}}><div className="mf" style={{width:`${Math.max(0,Math.min(100,m*100))}%`,background:mc(m)}}/></div><span style={{fontSize:9,color:mc(m)}}>{pct(m)}</span></div>:<span style={{color:"#252535",fontSize:8}}>—</span>}</td>
                  <td>{ed?<div style={{display:"flex",gap:5}}><button className="btn" style={{padding:"3px 8px",fontSize:7.5}} onClick={()=>{setProds(ps=>ps.map(x=>x.id===eProd.id?eProd:x));setEProd(null);}}>✓</button><button className="ghost" style={{padding:"3px 8px"}} onClick={()=>setEProd(null)}>✕</button></div>:<button className="ghost" style={{padding:"3px 9px",fontSize:7.5}} onClick={()=>setEProd({...p})}>Editar</button>}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </div>}

        {/* EQUIPO */}
        {tab==="vend"&&<div className="fade">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div className="slbl" style={{marginBottom:0}}>Equipo de Ventas</div>
            <button className="btn" onClick={()=>setShowAS(!showAS)}>{showAS?"Cancelar":"+ Agregar"}</button>
          </div>
          {showAS&&<div style={{background:"#0d0d1c",border:"1px solid #f0a500",padding:16,marginBottom:12}} className="fade">
            <div className="slbl">Nuevo Vendedor</div>
            <div className="g3" style={{gap:10,marginBottom:10}}>
              <div><div className="lbl">Nombre</div><input className="inp" value={nSell.name} onChange={e=>setNSell({...nSell,name:e.target.value})}/></div>
              <div><div className="lbl">Zona</div><select className="sel" value={nSell.zone} onChange={e=>setNSell({...nSell,zone:e.target.value})}><option value="">Selecciona…</option>{ZN.map(z=><option key={z} value={z}>{z}</option>)}</select></div>
              <div><div className="lbl">Email</div><input className="inp" type="email" value={nSell.email} onChange={e=>setNSell({...nSell,email:e.target.value})}/></div>
            </div>
            <button className="btn" onClick={()=>{if(!nSell.name||!nSell.zone)return;const av=nSell.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);setSellers(s=>[...s,{...nSell,id:uid(),av}]);setNSell({name:"",zone:"",email:""});setShowAS(false);}}>Guardar</button>
          </div>}
          <div className="g3">
            {sellers.map((s,i)=>{
              const so=orders.filter(o=>o.sellerId===s.id);
              const rev=so.reduce((a,o)=>a+o.summary.totalRevenueUSD,0);
              const cls=[...new Set(so.map(o=>o.client))];
              const trend=ML.slice(0,5).map(m=>({month:m,v:+so.filter(o=>o.month===m).reduce((a,o)=>a+o.summary.totalRevenueUSD,0).toFixed(0)}));
              return(<div key={s.id} className="card">
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <div className="ava" style={{width:38,height:38,fontSize:12,background:C[i%C.length]}}>{s.av}</div>
                  <div><div style={{fontSize:12}}>{s.name}</div><div style={{fontSize:7.5,color:"#3a3a4a",marginTop:2}}>{s.email}</div></div>
                </div>
                <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
                  <span className="chip">📍 {s.zone}</span>
                  <span className="chip">{so.length} facturas</span>
                  <span className="chip">{cls.length} clientes</span>
                </div>
                <div className="g2" style={{gap:8,marginBottom:12}}>
                  <div className="rcard"><div style={{fontSize:7.5,color:"#3a3a4a",marginBottom:3}}>VENTA TOTAL</div><div style={{fontSize:13,color:"#f0a500"}}>{fU(rev)}</div></div>
                  <div className="rcard"><div style={{fontSize:7.5,color:"#3a3a4a",marginBottom:3}}>CLIENTES</div><div style={{fontSize:11,color:"#6c8dfa"}}>{cls.slice(0,2).join(", ")}</div></div>
                </div>
                <div style={{fontSize:7.5,color:"#181826",marginBottom:5}}>TREND</div>
                <ResponsiveContainer width="100%" height={40}><LineChart data={trend}><Line dataKey="v" stroke={C[i%C.length]} strokeWidth={1.5} dot={false}/></LineChart></ResponsiveContainer>
              </div>);
            })}
          </div>
        </div>}

      </div>

      {/* MODAL: Confirmar */}
      {showC&&<div className="mbg" onClick={()=>setShowC(false)}>
        <div className="mdl fade" onClick={e=>e.stopPropagation()}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"#f0a500",marginBottom:4}}>Confirmar Pedido</div>
          <div style={{fontSize:8,color:"#3a3a4a",marginBottom:14}}>Asigna el pedido a un vendedor</div>
          <div className="g2" style={{gap:8,marginBottom:14}}>
            <div className="rcard"><div className="lbl">Venta</div><div style={{fontSize:16,color:"#f0a500"}}>{fU(oRes?.summary?.totalRevenueUSD)}</div></div>
            <div className="rcard"><div className="lbl">Ganancia</div><div style={{fontSize:16,color:"#00c896"}}>{fU(oRes?.summary?.totalMarginUSD)}</div></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:14}}>
            <div><div className="lbl">Cliente</div><input className="inp" placeholder="Ej. MEX-MORE" value={cData.client} onChange={e=>setCData(d=>({...d,client:e.target.value}))}/></div>
            <div><div className="lbl">Vendedor</div>
              <select className="sel" value={cData.sellerId} onChange={e=>setCData(d=>({...d,sellerId:e.target.value}))}>
                <option value="">Selecciona…</option>{sellers.map(s=><option key={s.id} value={s.id}>{s.name} — {s.zone}</option>)}
              </select>
            </div>
            {cData.sellerId&&<div className="fade"><div className="lbl">Zona</div>
              <select className="sel" value={cData.zone} onChange={e=>setCData(d=>({...d,zone:e.target.value}))}>
                {ZN.map(z=><option key={z} value={z}>{z}</option>)}
              </select>
              <div style={{fontSize:7.5,color:"#181826",marginTop:3}}>✓ Auto-detectada · editable</div>
            </div>}
          </div>
          {oRes?.summary?.hasAlerts&&<div className="nr" style={{marginBottom:10,fontSize:8.5}}>⚠️ Productos con margen bajo — ¿confirmar de todas formas?</div>}
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button className="ghost" onClick={()=>setShowC(false)}>Cancelar</button>
            <button className="btn" onClick={confirmOrder} disabled={!cData.sellerId||!cData.client}>✓ Confirmar</button>
          </div>
        </div>
      </div>}

      {/* MODAL: Detalle factura */}
      {selO&&<div className="mbg" onClick={()=>setSelO(null)}>
        <div className="mdlw fade" onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:"#f0a500"}}>{selO.client}</div>
              <div style={{fontSize:7.5,color:"#3a3a4a",marginTop:3}}>{selO.confirmedAt} · {selO.folio||"Sin folio"} · {selO.sellerName} · TC:{selO.exchangeRate}</div>
            </div>
            <button className="ghost" style={{padding:"3px 9px"}} onClick={()=>setSelO(null)}>✕</button>
          </div>
          <div className="g4" style={{gap:8,marginBottom:12}}>
            {[["Venta",fU(selO.summary.totalRevenueUSD),"#d8d4c8"],["Costo",fU(selO.summary.totalCostUSD),"#444"],["Ganancia",fU(selO.summary.totalMarginUSD),"#00c896"],["SKUs",selO.items.length,"#f0a500"]].map(([l,v,c])=>(
              <div key={l} className="rcard"><div className="lbl">{l}</div><div style={{fontSize:14,color:c}}>{v}</div></div>
            ))}
          </div>
          <div className="ovfl">
            <table className="tbl">
              <thead><tr><th>SKU</th><th>Producto</th><th>Cajas</th><th>Precio USD</th><th>Total</th></tr></thead>
              <tbody>{selO.items.map((it,i)=>(
                <tr key={i}>
                  <td style={{color:"#f0a500",fontSize:9}}>{it.sku}</td>
                  <td style={{fontSize:10}}>{it.productName}</td>
                  <td>{it.quantity}</td>
                  <td style={{color:"#d8d4c8"}}>{fU(it.clientPriceUSD)}</td>
                  <td style={{color:"#f0a500"}}>{fU(it.clientPriceUSD*it.quantity)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>}
    </div>
  );
}
