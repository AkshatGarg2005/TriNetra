import React, { useMemo, useRef, useState } from "react";
import { ShieldCheck, Smartphone, QrCode, FileText, Search, AlertTriangle, GitBranch, Download, MapPin, ListOrdered, Layers, Flag } from "lucide-react";
import { Section, Button, Card, CardContent, CardHeader, CardTitle, Badge, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Separator, Accordion, Tabs } from "../components/ui/primitives";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import CytoscapeComponent from "react-cytoscapejs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/* === Dummy demo data (no network calls) === */
const DEMO_CASE = {
  id: "CASE-001",
  title: "Seeded Device → Split-and-Settle",
  device: { imei: "359880441234567", sim: ["+91-98765-43210"], owner_name: "Rahul S (alias)" },
  vpAs: ["rahul.s@okaxis", "rs-collect@okhdfcbank", "shopmk@upi", "sai-kirana@paytm"],
  accounts: [{ bank: "HDFC", acct: "XXXX2345" }, { bank: "SBI", acct: "XXXX7788" }],
  merchants: [
    { name: "Sai Kirana", vpa: "sai-kirana@paytm", gst: "22ABCDE1234Z1Z1" },
    { name: "MK Mobiles", vpa: "shopmk@upi", gst: "22PQRSX6789Z9Z9" },
  ],
  hotspots: [
    { place: "Bittan Market", approx: "Arera Colony", intensity: 9 },
    { place: "Maharana Pratap Nagar", approx: "MP Nagar Zone-II", intensity: 7 },
    { place: "New Market", approx: "TT Nagar", intensity: 5 },
  ],
  transactions: [
    ...Array.from({ length: 30 }).map((_, i) => ({
      ts: new Date(2025, 0, 12, 21, 10 + i * 6).toISOString(),
      amt: 4900, from: `vpa${i}@upi`, to: "rahul.s@okaxis", ch: "UPI", geo: "Bhopal",
    })),
    { ts: new Date(2025, 0, 13, 3, 10).toISOString(), amt: 145000, from: "HDFC XXXX2345", to: "EXIT-A XXXX9292", ch: "IMPS", geo: "Bhopal" },
    { ts: new Date(2025, 0, 13, 3, 16).toISOString(), amt: 145000, from: "HDFC XXXX2345", to: "EXIT-B XXXX7711", ch: "IMPS", geo: "Bhopal" },
  ],
  flags: [
    { code: "D1", title: "Device-Mule Pattern", reason: "Single handset controls multiple VPAs/accounts with rapid SIM reuse.", severity: "High", evidence_refs: ["chat-1", "graph-1"] },
    { code: "D3", title: "Split-and-Settle", reason: "~30 small UPI inflows in 6 hours → two large IMPS exits within 10 minutes.", severity: "Critical", evidence_refs: ["timeline-1","txn-IMPS-1","txn-IMPS-2"] },
    { code: "FAN", title: "Fan-in to One Node", reason: ">20 distinct payers crediting the same VPA within a short window.", severity: "Medium", evidence_refs: ["timeline-1"] },
  ],
  evidence: {
    chats: [
      { id: "chat-1", app: "WhatsApp", snippet: "Boss, 4.9k each karo, ref send lena – settle raat me hoga.", sender: "+91-98xxxx210", ts: "2025-01-12T19:01:00" },
      { id: "chat-2", app: "Telegram", snippet: "Naya QR bhejo merchant ka, old link flag ho gaya.", sender: "@rk_ops", ts: "2025-01-12T20:12:00" },
    ],
    sms: [
      { id: "sms-1", text: "IMPS txn of INR 145000 from A/c XX2345 to A/c XX9292 on 13-01-2025 03:10", ts: "2025-01-13T03:10:00" },
      { id: "sms-2", text: "IMPS txn of INR 145000 from A/c XX2345 to A/c XX7711 on 13-01-2025 03:16", ts: "2025-01-13T03:16:00" },
    ],
    qr: [{ id: "qr-1", decode: "upi://pay?pa=sai-kirana@paytm&pn=SAI KIRANA&mc=5411", note: "QR used, but funds settle to HDFC XXXX2345 (device-linked)." }],
    files: [
      { id: "txn-IMPS-1", name: "Statement_Snip_1.png" },
      { id: "txn-IMPS-2", name: "Statement_Snip_2.png" },
      { id: "graph-1", name: "RingView.png" },
      { id: "timeline-1", name: "Timeline.png" },
    ],
  },
};

const currency = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtTime = (iso) => new Date(iso).toLocaleString();

export default function Prototype() {
  const [caseData] = useState(DEMO_CASE);
  const [vpaCheck, setVpaCheck] = useState("");
  const packRef = useRef(null);

  const graphElements = useMemo(() => buildGraph(caseData), [caseData]);
  const timelineData = useMemo(() => buildTimeline(caseData.transactions), [caseData]);
  const totals = useMemo(() => {
    const inflow = caseData.transactions.filter(t => t.ch === "UPI").reduce((s, t) => s + t.amt, 0);
    const outflow = caseData.transactions.filter(t => t.ch !== "UPI").reduce((s, t) => s + t.amt, 0);
    return { inflow, outflow, count: caseData.transactions.length };
  }, [caseData]);

  const handlePDF = async () => {
    if (!packRef.current) return;
    const canvas = await html2canvas(packRef.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
    if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    } else {
      // naive vertical slicing
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const full = canvas;
      const scale = pageWidth / imgProps.width;
      while (position < pdfHeight) {
        const temp = document.createElement("canvas");
        const slicePxHeight = Math.min(full.height - position / scale, pageHeight / scale);
        temp.width = full.width; temp.height = slicePxHeight;
        const ctx = temp.getContext("2d");
        ctx.drawImage(full, 0, -position / scale);
        const slice = temp.toDataURL("image/png");
        if (position > 0) pdf.addPage();
        pdf.addImage(slice, "PNG", 0, 0, pageWidth, (slicePxHeight * pageWidth) / full.width);
        position += pageHeight;
      }
    }
    pdf.save(`${caseData.id}_CasePack.pdf`);
  };

  const vpaResult = useMemo(() => {
    if (!vpaCheck.trim()) return null;
    const isKnown = caseData.vpAs.includes(vpaCheck.trim());
    return {
      text: isKnown ? "Linked to seeded device (High Risk)" : "No direct link in this case",
      color: isKnown ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700",
    };
  }, [vpaCheck, caseData.vpAs]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HEADER */}
      <header className="border-b sticky top-0 z-40 bg-white/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 grid place-content-center rounded-xl border"><ShieldCheck className="h-4 w-4"/></div>
            <span className="font-semibold tracking-tight">TRINETRA FLOW — Demo Prototype</span>
            <Badge className="ml-2">Ideation • Dummy Data Only</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handlePDF}><Download className="mr-2 h-4 w-4"/>Download Case Pack PDF</Button>
          </div>
        </div>
      </header>

      {/* BANNER */}
      <div className="bg-amber-50 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 text-sm text-amber-800 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4"/>
          <span><strong>Demo Notice:</strong> This interactive prototype uses pre-stored, fictional data only. No live banking or personal data is accessed.</span>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {/* CASE SUMMARY */}
        <div className="grid lg:grid-cols-4 gap-4">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5"/> {caseData.id}: {caseData.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3">
                <div className="rounded-xl border p-3">
                  <div className="text-xs">Device IMEI</div>
                  <div className="font-medium text-gray-900">{caseData.device.imei}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs">Owner (alias)</div>
                  <div className="font-medium text-gray-900">{caseData.device.owner_name}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs">UPI Inflow</div>
                  <div className="font-medium text-gray-900">{currency(totals.inflow)}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs">Non-UPI Outflow</div>
                  <div className="font-medium text-gray-900">{currency(totals.outflow)}</div>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Flag className="h-4 w-4"/> Indicators Hit</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {caseData.flags.map(f => (
                      <div key={f.code} className="flex items-start gap-2 text-sm">
                        <Badge variant={f.severity === "Critical" ? "destructive" : "secondary"}>{f.code}</Badge>
                        <div>
                          <div className="text-gray-900 font-medium">{f.title}</div>
                          <div className="text-muted-foreground">{f.reason}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ListOrdered className="h-4 w-4"/> Counterparties</CardTitle></CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <ul className="list-disc ml-4 space-y-1">
                      {caseData.vpAs.map(v => (<li key={v}><span className="text-gray-900">{v}</span> (VPA)</li>))}
                      {caseData.accounts.map(a => (<li key={a.acct}><span className="text-gray-900">{a.bank} {a.acct}</span> (Account)</li>))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4"/> Hotspots</CardTitle></CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <ul className="list-disc ml-4 space-y-1">
                      {caseData.hotspots.map(h => (<li key={h.place}><span className="text-gray-900">{h.place}</span> — {h.approx} (intensity {h.intensity}/10)</li>))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4"/> Field QR / VPA Check</CardTitle></CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-2">Type a VPA from a QR to check linkage in this case.</div>
              <Input placeholder="e.g. sai-kirana@paytm" value={vpaCheck} onChange={(e)=>setVpaCheck(e.target.value)} />
              {vpaResult && (<div className={`mt-3 rounded-lg px-3 py-2 text-sm border ${vpaResult.color}`}>{vpaResult.text}</div>)}
              <div className="mt-3 text-xs text-muted-foreground">Known VPAs in case: {caseData.vpAs.join(", ")}</div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6"/>

        {/* TABS */}
        <Tabs
          defaultKey="overview"
          tabs={[
            {
              key: "overview",
              label: "Overview",
              content: (
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4"/> What the system sees</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <p>• Device controls 4 VPAs and 2 bank accounts.</p>
                      <p>• High fan-in of ₹4,900 credits (structuring), followed by 2 large IMPS exits.</p>
                      <p>• Merchant QR decode mismatch: payment intent to merchant, settlement to device-linked account.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><GitBranch className="h-4 w-4"/> Recommended next actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <p>1) Freeze accounts {caseData.accounts.map(a => a.acct).join(", ")} pending inquiry.</p>
                      <p>2) Field sweep: verify VPAs at <em>Sai Kirana</em> & <em>MK Mobiles</em>.</p>
                      <p>3) Seek CCTV near hotspots during 18:00–24:00 on 12-Jan-2025.</p>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              key: "graph",
              label: "Graph",
              content: (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Entity Graph</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[420px]">
                      <CytoscapeComponent
                        elements={graphElements}
                        style={{ width: "100%", height: "100%" }}
                        layout={{ name: "cose", animate: false }}
                        cy={(cy)=>{
                          cy.fit();
                          cy.on('tap', 'node', (e)=> {
                            const d = e.target.data();
                            if (d && d.label) alert(`${d.type?.toUpperCase()}: ${d.label}`);
                          });
                        }}
                        stylesheet={[
                          { selector: 'node', style: { 'background-color': '#0ea5e9', label: 'data(label)', color: '#111827', 'text-valign': 'center', 'text-halign': 'center', 'font-size': 10, 'width': 28, 'height': 28 } },
                          { selector: 'edge', style: { width: 1, 'line-color': '#93c5fd', 'target-arrow-color': '#93c5fd', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
                          { selector: '.device', style: { 'background-color': '#34d399', 'width': 36, 'height': 36, 'font-weight': '700' } },
                        ]}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Tip: click nodes to view labels. Layout is static for demo.</div>
                  </CardContent>
                </Card>
              ),
            },
            {
              key: "timeline",
              label: "Timeline",
              content: (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Transaction Timeline</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <XAxis dataKey="t" tick={{ fontSize: 10 }} height={30}/>
                          <YAxis tick={{ fontSize: 10 }}/>
                          <Tooltip formatter={(v)=>currency(v)} labelFormatter={(l)=>l}/>
                          <Area type="monotone" dataKey="amt" stroke="#2563eb" fill="#93c5fd" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-[220px] mt-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={groupByChannel(caseData.transactions)}>
                          <XAxis dataKey="channel" tick={{ fontSize: 10 }}/>
                          <YAxis tick={{ fontSize: 10 }}/>
                          <Tooltip formatter={(v)=>currency(v)} />
                          <Bar dataKey="total" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ),
            },
            {
              key: "evidence",
              label: "Evidence",
              content: (
                <div className="grid lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base">Chat & SMS</CardTitle></CardHeader>
                    <CardContent>
                      <Accordion
                        multiple
                        items={[
                          ...caseData.evidence.chats.map((c) => ({
                            title: <div><div className="text-sm font-medium">{c.app} — {c.sender}</div><div className="text-xs text-muted-foreground">{fmtTime(c.ts)}</div></div>,
                            content: <span>“{c.snippet}”</span>,
                          })),
                          ...caseData.evidence.sms.map((s) => ({
                            title: <div><div className="text-sm font-medium">Bank SMS</div><div className="text-xs text-muted-foreground">{fmtTime(s.ts)}</div></div>,
                            content: s.text,
                          })),
                        ]}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><QrCode className="h-4 w-4"/> QR Decodes & Files</CardTitle></CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Detail</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {caseData.evidence.qr.map(q => (
                            <TableRow key={q.id}>
                              <TableCell>QR Decode</TableCell>
                              <TableCell>
                                <div className="text-xs"><span className="font-medium text-gray-900">{q.decode}</span></div>
                                <div className="text-xs text-muted-foreground">{q.note}</div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {caseData.evidence.files.map(f => (
                            <TableRow key={f.id}>
                              <TableCell>File</TableCell>
                              <TableCell className="text-xs">{f.name}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              key: "report",
              label: "Case Pack (Preview)",
              content: (
                <Card>
                  <CardHeader className="pb-2 flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4"/> Case Pack — Preview</CardTitle>
                    <Button size="sm" onClick={handlePDF}><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
                  </CardHeader>
                  <CardContent>
                    <div ref={packRef} className="bg-white p-5 border rounded-xl">
                      <div className="text-center">
                        <h2 className="text-xl font-bold">TRINETRA FLOW — Case Pack</h2>
                        <div className="text-sm text-muted-foreground">Demo / Dummy Data • Bhopal Police Hackathon</div>
                      </div>
                      <Separator className="my-4"/>
                      <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg border p-3">
                          <div className="font-medium text-gray-900 mb-1">Case Summary</div>
                          <div>Case ID: {caseData.id}</div>
                          <div>Title: {caseData.title}</div>
                          <div>Device IMEI: {caseData.device.imei}</div>
                          <div>Owner (alias): {caseData.device.owner_name}</div>
                          <div>UPI Inflow: {currency(totals.inflow)}</div>
                          <div>Non-UPI Outflow: {currency(totals.outflow)}</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="font-medium text-gray-900 mb-1">Indicators Triggered</div>
                          <ul className="list-disc ml-4">
                            {caseData.flags.map(f => (
                              <li key={f.code}><strong>{f.code}</strong> — {f.title}: {f.reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg border p-3 text-sm">
                        <div className="font-medium text-gray-900 mb-1">Top Evidence</div>
                        <ol className="list-decimal ml-4 space-y-1">
                          {caseData.evidence.chats.slice(0,1).map(c => (<li key={c.id}>Chat ({c.app}) @ {fmtTime(c.ts)} — “{c.snippet}”.</li>))}
                          {caseData.evidence.sms.map(s => (<li key={s.id}>SMS — {s.text}</li>))}
                          {caseData.evidence.qr.map(q => (<li key={q.id}>QR — {q.decode} ({q.note})</li>))}
                        </ol>
                      </div>
                      <div className="mt-3 text-xs text-muted-foreground">This PDF is generated from the demo UI. Inputs and outputs are fictional and for ideation only.</div>
                    </div>
                  </CardContent>
                </Card>
              ),
            },
          ]}
        />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Team TRINETRA — VIT Bhopal University</div>
          <div className="flex items-center gap-4">
            <span>Bhopal Police Hackathon</span>
            <span>Ideation Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Helpers */
function buildGraph(cs) {
  const nodes = [];
  const edges = [];
  nodes.push({
    data: { id: 'dev', label: `IMEI\n${cs.device.imei}`, type: 'device' },
    classes: 'device'
  });
  cs.device.sim.forEach((s, i) => {
    const id = `sim${i}`;
    nodes.push({ data: { id, label: s, type: 'sim' } });
    edges.push({ data: { id: `e_dev_${id}`, source: 'dev', target: id, label: 'uses' } });
  });
  cs.accounts.forEach((a, i) => {
    const id = `acct${i}`;
    nodes.push({ data: { id, label: `${a.bank}\n${a.acct}`, type: 'account' } });
    edges.push({ data: { id: `e_dev_${id}`, source: 'dev', target: id, label: 'controls' } });
  });
  cs.vpAs.forEach((v, i) => {
    const id = `vpa${i}`;
    nodes.push({ data: { id, label: v, type: 'vpa' } });
    edges.push({ data: { id: `e_dev_${id}`, source: 'dev', target: id, label: 'controls' } });
  });
  cs.merchants.forEach((m, i) => {
    const id = `mrc${i}`;
    nodes.push({ data: { id, label: `${m.name}\n${m.vpa}`, type: 'merchant' } });
    edges.push({ data: { id: `e_vpa_${id}`, source: `vpa${i+2}` ?? 'vpa0', target: id, label: 'pays' } });
  });
  nodes.push({ data: { id: 'exitA', label: 'EXIT-A\nXXXX9292', type: 'exit' } });
  nodes.push({ data: { id: 'exitB', label: 'EXIT-B\nXXXX7711', type: 'exit' } });
  edges.push({ data: { id: 'eA', source: 'acct0', target: 'exitA', label: 'IMPS' } });
  edges.push({ data: { id: 'eB', source: 'acct0', target: 'exitB', label: 'IMPS' } });
  return [...nodes, ...edges];
}

function buildTimeline(txns) {
  return txns.map(t => ({ t: new Date(t.ts).toLocaleString(), amt: t.amt }));
}

function groupByChannel(txns) {
  const m = new Map();
  for (const t of txns) m.set(t.ch, (m.get(t.ch) || 0) + t.amt);
  return Array.from(m.entries()).map(([channel, total]) => ({ channel, total }));
}
