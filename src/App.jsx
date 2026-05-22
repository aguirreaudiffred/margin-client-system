import{useState,useRef,useEffect,useCallback}from"react";
import{BarChart,Bar,LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,Cell,PieChart,Pie,Legend}from"recharts";


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

export default function App(){
  const[tab,setTab]=useState("dash");
  const[prods,setProds]=useState([]);
  const[sellers,setSellers]=useState(SELLERS);
  const[orders,setOrders]=useState([]);
  const[dataLoad,setDataLoad]=useState(true);
  const[dataErr,setDataErr]=useState(null);
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
    (async()=>{
      setDataLoad(true);setDataErr(null);
      try{
        const base=import.meta.env.BASE_URL;
        const [pr,or]=await Promise.all([
          fetch(base+"data/products.json").then(r=>{if(!r.ok)throw new Error("products");return r.json();}),
          fetch(base+"data/orders.json").then(r=>{if(!r.ok)throw new Error("orders");return r.json();}),
        ]);
        setProds(pr);setOrders(or);
      }catch(e){setDataErr("No se pudieron cargar productos y pedidos.");}
      finally{setDataLoad(false);}
    })();
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

  if(dataLoad)return(<div className="app-loading"><span className="spin">↻</span>Cargando datos…</div>);
  if(dataErr)return(<div className="app-loading" style={{color:"#ff6060",padding:20,textAlign:"center"}}>{dataErr}</div>);

  return(
    <div style={{fontFamily:"'IBM Plex Mono',monospace",background:"#06060e",minHeight:"100vh",color:"#d8d4c8"}}>
      {/* HEADER */}
      <div style={{borderBottom:"1px solid #0e0e1c",display:"flex",alignItems:"stretch",justifyContent:"space-between",paddingRight:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"stretch",flexWrap:"nowrap",minWidth:0,flex:1}}>
          <div style={{padding:"11px 18px",flexShrink:0,borderRight:"1px solid #0e0e1c",display:"flex",flexDirection:"column",justifyContent:"center"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:900,lineHeight:1.2}}>
              <span style={{color:"#d8d4c8"}}>Margin & Client </span><span style={{color:"#f0a500"}}>System</span>
            </div>
            <div style={{fontSize:7,letterSpacing:3,color:"#181826",marginTop:1}}>FORMEXA USA LLC</div>
          </div>
          <nav style={{display:"flex",alignItems:"stretch",flexWrap:"nowrap",overflowX:"auto",WebkitOverflowScrolling:"touch",maxWidth:"100%"}}>
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
          <div className="slbl">Margin & Client System · Ene–May 2026</div>
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
