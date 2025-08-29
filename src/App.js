import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  QrCode,
  Network,
  FileText,
  Search,
  MapPin,
  GitBranch,
  Database,
  ArrowRight,
  MessageSquare,
  Layers,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

/** === QUICK CONFIG === */
const prototypeLink = "#"; // paste deployed link here
const contactEmail = "team.trinetra@vitbhopal.edu.in"; // change if needed

/** === Minimal UI Primitives (Tailwind only) === */
const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </section>
);

const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm font-medium">
    {children}
  </span>
);

const Button = ({ as = "button", variant = "default", size = "md", href, children, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-all";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-11 px-5 text-base",
  };
  const variants = {
    default: "bg-foreground text-background hover:opacity-90",
    secondary: "border bg-background hover:bg-muted",
    ghost: "hover:bg-muted",
  };
  const className = `${base} ${sizes[size]} ${variants[variant]}`;
  const Comp = href ? "a" : as;
  return (
    <Comp href={href} {...props} className={className}>
      {children}
    </Comp>
  );
};

const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-background shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ className = "", children }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);
const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-4 text-sm text-muted-foreground ${className}`}>{children}</div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium">
    {children}
  </span>
);

const Separator = () => <div className="border-t" />;

/** Tabs (very small stateful implementation) */
const Tabs = ({ tabs, defaultKey }) => {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);
  const current = tabs.find((t) => t.key === active);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`h-9 rounded-md px-3 text-sm border ${
              active === t.key ? "bg-foreground text-background" : "bg-background hover:bg-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{current?.content}</div>
    </div>
  );
};

/** Accordion (simple, single-open) */
const Accordion = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="divide-y rounded-xl border">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left p-4 flex items-center justify-between"
            >
              <span className="font-medium">{it.title}</span>
              <span className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            {isOpen && <div className="p-4 pt-0 text-sm text-muted-foreground">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, children }) => (
  <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-center gap-3">
        <span className="rounded-2xl p-2 border">
          <Icon className="h-5 w-5" />
        </span>
        <CardTitle className="text-lg">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-0">{children}</CardContent>
  </Card>
);

/** === Page === */
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 grid place-content-center rounded-xl border">
              <Sparkles className="h-4 w-4" />
            </div>
            <a href="#home" className="font-semibold tracking-tight">
              TRINETRA FLOW
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" href={prototypeLink} target="_blank" rel="noreferrer">
              Open Prototype <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <Section id="home" className="py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              TRINETRA FLOW
            </motion.h1>
            <div className="mt-2 text-base text-muted-foreground font-medium">
              Prototype — Ideation Phase
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge>Bhopal Police Hackathon</Badge>
              <Pill>Team TRINETRA</Pill>
              <Pill>VIT BHOPAL UNIVERSITY</Pill>
              <Pill>Theme: Money-Laundering Pattern Detection</Pill>
              <Pill>Stage: Ideation Prototype</Pill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={prototypeLink} target="_blank" rel="noreferrer">
                Launch Prototype
              </Button>
              <Button variant="secondary" href="#demo">
                View 5-min Demo Script
              </Button>
            </div>
          </div>

          {/* Visual Mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-2xl border shadow-sm p-4 bg-background">
              <div className="text-sm text-muted-foreground mb-3">Ring View (mock)</div>
              <div className="aspect-[16/10] rounded-xl border grid place-content-center overflow-hidden">
                {/* Simple SVG Graph Mock */}
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  <defs>
                    <filter id="shadow">
                      <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
                    </filter>
                  </defs>
                  <g filter="url(#shadow)">
                    <circle cx="200" cy="120" r="28" fill="currentColor" opacity="0.08" />
                    <circle cx="200" cy="120" r="24" stroke="currentColor" fill="white" />
                    <text x="200" y="124" textAnchor="middle" fontSize="10">
                      Device
                    </text>
                    {[
                      [80, 60, "VPA A"],
                      [320, 60, "VPA B"],
                      [80, 190, "Acct X"],
                      [320, 190, "Acct Y"],
                      [200, 30, "Merchant"],
                      [200, 220, "Exit A"],
                    ].map(([x, y, label], i) => (
                      <g key={i}>
                        <circle cx={x} cy={y} r="20" stroke="currentColor" fill="white" />
                        <text x={x} y={y + 3} textAnchor="middle" fontSize="9">
                          {label}
                        </text>
                        <line x1="200" y1="120" x2={x} y2={y} stroke="currentColor" strokeDasharray="3 3" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Separator />

      {/* PROBLEM & SOLUTION */}
      <Section id="problem" className="py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>The Gap — Why Police Need This</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Banks only see their own ledgers; chats and QR images live outside banking systems.</p>
              <p>• Launderers recycle devices/SIMs across many UPI IDs and accounts; mule recruiting happens on WhatsApp/Telegram.</p>
              <p>• No quick, police-side tool turns phone artifacts + transactions into a who-paid-whom story tied to a person/device.</p>
            </CardContent>
          </Card>

          <Card id="solution">
            <CardHeader>
              <CardTitle>Our Answer — TRINETRA FLOW</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Pivot on the device (IMEI/SIM) and fuse chats, gallery artifacts, and UPI/IMPS/NEFT data into one graph.</p>
              <p>• Auto-flag mule rings with typology rules and anomaly scores.</p>
              <p>• Export a <em>court-ready</em> case pack with evidence snippets and recommended actions.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* FEATURES */}
      <Section id="features" className="py-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">What it does</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <FeatureCard icon={GitBranch} title="DeviceGraph (the spine)">
            Nodes for Device, SIM, Account, UPI, Person, Merchant; edges like <em>uses</em>, <em>controls</em>,
            <em> transacts_with</em>, <em>qr_decodes_to</em>. Backed by Neo4j + Postgres for auditable case tables.
          </FeatureCard>
          <FeatureCard icon={MessageSquare} title="Chat & Gallery TrailBuilder">
            Ingest WhatsApp/Telegram exports, Gallery (QRs, payment screenshots), optional SMS. Extract UPI deep links,
            decode QRs, OCR screenshots, parse SMS—attach to the graph.
          </FeatureCard>
          <FeatureCard icon={Network} title="Typology Rules + Anomaly Layer">
            Device-mule patterns (D1–D5), network fan-in/fan-out, round-tripping. Light anomaly score on degree,
            entropy, churn, night-hour skew.
          </FeatureCard>
          <FeatureCard icon={Search} title="Ops Dashboard (police-first)">
            Ring view, bursty timeline, geo heatmap, and reason-coded flags. Click a flag to see supporting evidence.
          </FeatureCard>
          <FeatureCard icon={QrCode} title="Field ‘QR Sweep’">
            Scan a shop’s UPI QR → backend checks links to flagged devices/merchants → <strong>Green / Amber / Red</strong> with reasons.
          </FeatureCard>
          <FeatureCard icon={FileText} title="Case Pack (PDF)">
            One-click PDF with summary, indicators hit, charts, extracted evidence (chat lines, QR decodes, screenshot hashes), and next-best actions.
          </FeatureCard>
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">How it works</h2>
        <Tabs
          defaultKey="steps"
          tabs={[
            {
              key: "steps",
              label: "Steps",
              content: (
                <div className="grid lg:grid-cols-4 gap-4">
                  {[
                    { icon: Smartphone, title: "Seize & Export", text: "WhatsApp/Telegram exports, gallery, and SMS CSV are prepared." },
                    { icon: Database, title: "Ingest & Extract", text: "Regex UPI links, QR decode, OCR, and SMS templating." },
                    { icon: GitBranch, title: "Graph Fuse", text: "Load nodes & edges into Neo4j; persist evidence in Postgres." },
                    { icon: ShieldCheck, title: "Flag & Report", text: "Run typologies, score anomalies, generate a case pack PDF." },
                  ].map((s, i) => (
                    <FeatureCard key={i} icon={s.icon} title={`${i + 1}. ${s.title}`}>
                      {s.text}
                    </FeatureCard>
                  ))}
                </div>
              ),
            },
            {
              key: "stack",
              label: "Tech Stack",
              content: (
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Core</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>
                        <strong>Backend:</strong> FastAPI, Python (pandas, scikit-learn)
                      </p>
                      <p>
                        <strong>Graph + DB:</strong> Neo4j (py2neo), Postgres
                      </p>
                      <p>
                        <strong>Extractors:</strong> pyzbar/zxing (QR), Tesseract (OCR)
                      </p>
                      <p>
                        <strong>Frontend:</strong> React + Cytoscape.js, Recharts, Leaflet
                      </p>
                      <p>
                        <strong>Infra:</strong> Docker Compose
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Design Tenets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p>• Police-first UX, minimal clicks</p>
                      <p>• Explainability: reason-coded alerts</p>
                      <p>• Auditability: every export is logged</p>
                      <p>• PII minimization for demo (hashed IDs)</p>
                    </CardContent>
                  </Card>
                </div>
              ),
            },
            {
              key: "governance",
              label: "Governance",
              content: (
                <Card>
                  <CardContent className="space-y-2 pt-6">
                    <p>• Role-based access; audit trail for every query/export.</p>
                    <p>• Case pack includes hash of inputs for chain-of-custody integrity.</p>
                    <p>• Outputs structured to fit PMLA/FIU-IND narratives (period, counterparties, amounts, indicators, actions).</p>
                  </CardContent>
                </Card>
              ),
            },
            {
              key: "risks",
              label: "Risks & Mitigation",
              content: (
                <Card>
                  <CardContent className="space-y-2 pt-6">
                    <p>
                      • <strong>Noisy OCR/QR</strong> → conservative heuristics, confidence scores, show evidence snippets.
                    </p>
                    <p>
                      • <strong>Android notification limits</strong> → rely on chat exports + gallery + SMS, not transient notifications.
                    </p>
                    <p>• <strong>Graph sprawl</strong> → scope MVP to seeded dataset; paginate expansions.</p>
                  </CardContent>
                </Card>
              ),
            },
          ]}
        />
      </Section>

      {/* MVP PLAN */}
      <Section id="mvp" className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">MVP — 2-Day Plan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Day 1</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Data & ETL simulators (txns, link tables, WhatsApp export, QR images, SMS CSV)</p>
              <p>• Graph model & loaders (Neo4j) + Postgres case/evidence tables</p>
              <p>• Extractors: UPI regex, QR decode, OCR, 6–8 SMS templates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Day 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>• Rules: D1–D5, fan-in/out, split-and-settle; compute features</p>
              <p>• Dashboard: graph, timeline, heatmap; case list with reason codes</p>
              <p>• Case Pack PDF + QR Sweep mini-app</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* DEMO SCRIPT */}
      <Section id="demo" className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">5-Minute Demo Script</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            "Search IMEI: seeded device → graph blooms (7 VPAs, 4 accounts, 2 merchants).",
            "Timeline: ~30× ₹4,900 UPI credits in 6 hours → two ₹1,45,000 IMPS to Exit-A/B.",
            "Flags: D1 (device farm), D3 (split-and-settle), fan-in; reasons shown inline.",
            "Evidence: show WhatsApp lines, decoded QR with VPA mismatch, OCR from fake receipt.",
            "Case Pack: 1-click PDF with visuals, evidence, and recommended actions.",
            "Field Check: scan market QR → Red (‘linked to flagged device + split-and-settle in 14 days’).",
          ].map((t, i) => (
            <FeatureCard key={i} icon={Layers} title={`Step ${i + 1}`}>
              {t}
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* IMPACT */}
      <Section id="impact" className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Impact & Benefits</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <FeatureCard icon={ShieldCheck} title="Police-side, not bank-bound">
            Break silos: bring chats/QRs/screenshots into the same money-trail view.
          </FeatureCard>
          <FeatureCard icon={Search} title="Faster, clearer investigations">
            From phone seizure → graph → flags → field scan → court-ready case pack.
          </FeatureCard>
          <FeatureCard icon={MapPin} title="Actionable hotspots">
            Geo heatmaps highlight mule-dense markets and night-owl clusters.
          </FeatureCard>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">FAQ</h2>
        <Accordion
          items={[
            {
              title: "Does this require rooted phones?",
              content:
                "No. MVP relies on exported chats, gallery, and SMS CSVs. Notification scraping is not required.",
            },
            {
              title: "Is it usable in court?",
              content:
                "The case pack logs sources, includes input hashes, and lists reason-coded indicators; it’s designed to fit PMLA/FIU-IND narratives.",
            },
            {
              title: "What about privacy?",
              content:
                "For the hackathon demo, identifiers are salted/hashed and access is role-based. Full deployments would follow agency policy.",
            },
          ]}
        />
      </Section>

      {/* CTA */}
      <Section className="py-16">
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <h3 className="text-2xl font-bold">Ready to see TRINETRA FLOW in action?</h3>
            <p className="mt-2 text-muted-foreground">
              Open the prototype or contact us for a guided walkthrough.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button size="lg" href={prototypeLink} target="_blank" rel="noreferrer">
                Open Prototype
              </Button>
              <Button variant="secondary" size="lg" href={`mailto:${contactEmail}`}>
                Email Team TRINETRA
              </Button>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Team TRINETRA — VIT Bhopal University</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#problem">
              Problem
            </a>
            <a className="hover:underline" href="#features">
              Features
            </a>
            <a className="hover:underline" href="#demo">
              Demo
            </a>
            <a className="hover:underline" href={`mailto:${contactEmail}`}>
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
