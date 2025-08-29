import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, Smartphone, QrCode, Network, FileText, Search, MapPin, GitBranch, Database, MessageSquare, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, Button, Card, CardContent, CardHeader, CardTitle, Badge, Pill, Separator } from "../components/ui/primitives";

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

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 grid place-content-center rounded-xl border">
              <Sparkles className="h-4 w-4" />
            </div>
            <a href="#home" className="font-semibold tracking-tight">TRINETRA FLOW</a>
          </div>
          <div className="flex items-center gap-2">
            {/* Route to /prototype (no placeholder) */}
            <Button size="sm" as={Link} to="/prototype">
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
            <div className="mt-2 text-base text-muted-foreground font-medium">Prototype — Ideation Phase</div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge>Bhopal Police Hackathon</Badge>
              <Pill>Team TRINETRA</Pill>
              <Pill>VIT BHOPAL UNIVERSITY</Pill>
              <Pill>Theme: Money-Laundering Pattern Detection</Pill>
              <Pill>Stage: Ideation Prototype</Pill>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/prototype">Launch Prototype</Button>
              <Button variant="secondary" href="#demo">View 5-min Demo Script</Button>
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
                <svg viewBox="0 0 400 250" className="w-full h-full">
                  <defs>
                    <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2"/></filter>
                  </defs>
                  <g filter="url(#shadow)">
                    <circle cx="200" cy="120" r="28" fill="currentColor" opacity="0.08" />
                    <circle cx="200" cy="120" r="24" stroke="currentColor" fill="white" />
                    <text x="200" y="124" textAnchor="middle" fontSize="10">Device</text>
                    {[[80,60,'VPA A'],[320,60,'VPA B'],[80,190,'Acct X'],[320,190,'Acct Y'],[200,30,'Merchant'],[200,220,'Exit A']].map(([x,y,label],i)=> (
                      <g key={i}>
                        <circle cx={x} cy={y} r="20" stroke="currentColor" fill="white" />
                        <text x={x} y={y+3} textAnchor="middle" fontSize="9">{label}</text>
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
            <CardHeader><CardTitle>The Gap — Why Police Need This</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p>• Banks only see their own ledgers; chats and QR images live outside banking systems.</p>
              <p>• Launderers recycle devices/SIMs across many UPI IDs and accounts; mule recruiting happens on WhatsApp/Telegram.</p>
              <p>• No quick, police-side tool turns phone artifacts + transactions into a who-paid-whom story tied to a person/device.</p>
            </CardContent>
          </Card>

          <Card id="solution">
            <CardHeader><CardTitle>Our Answer — TRINETRA FLOW</CardTitle></CardHeader>
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
            Nodes for Device, SIM, Account, UPI, Person, Merchant; edges like <em>uses</em>, <em>controls</em>, <em>transacts_with</em>, <em>qr_decodes_to</em>. Backed by Neo4j + Postgres.
          </FeatureCard>
          <FeatureCard icon={MessageSquare} title="Chat & Gallery TrailBuilder">
            Ingest WhatsApp/Telegram exports, Gallery (QRs, payment screenshots), optional SMS. Extract UPI deep links, decode QRs, OCR screenshots, parse SMS—attach to the graph.
          </FeatureCard>
          <FeatureCard icon={Network} title="Typology Rules + Anomaly Layer">
            Device-mule patterns (D1–D5), network fan-in/fan-out, round-tripping. Light anomaly scoring.
          </FeatureCard>
          <FeatureCard icon={Search} title="Ops Dashboard (police-first)">
            Ring view, timeline, geo heatmap, and reason-coded flags with supporting evidence.
          </FeatureCard>
          <FeatureCard icon={QrCode} title="Field ‘QR Sweep’">
            Scan a shop’s UPI QR → backend checks links → <strong>Green / Amber / Red</strong>.
          </FeatureCard>
          <FeatureCard icon={FileText} title="Case Pack (PDF)">
            One-click PDF with summary, indicators, evidence, and next-best actions.
          </FeatureCard>
        </div>
      </Section>

      {/* DEMO + IMPACT + FOOTER trimmed for brevity from earlier page */}
      <Section id="demo" className="py-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">5-Minute Demo Script</h2>
        <div className="grid lg:grid-cols-3 gap-4">
          {[
            "Search IMEI: seeded device → graph blooms (7 VPAs, 4 accounts, 2 merchants).",
            "Timeline: ~30× ₹4,900 UPI credits → two ₹1,45,000 IMPS exits.",
            "Flags & Evidence: show lines, decodes, OCR, then export Case Pack.",
          ].map((t, i) => (
            <FeatureCard key={i} icon={Layers} title={`Step ${i + 1}`}>{t}</FeatureCard>
          ))}
        </div>
      </Section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Team TRINETRA — VIT Bhopal University</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#problem">Problem</a>
            <a className="hover:underline" href="#features">Features</a>
            <a className="hover:underline" href="#demo">Demo</a>
            <a className="hover:underline" href="mailto:team.trinetra@vitbhopal.edu.in">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
