import React, { useState } from "react";

/* --- Tiny Tailwind-only primitives (no shadcn) --- */
export const Section = ({ id, className = "", children }) => (
  <section id={id} className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </section>
);

export const Button = ({ as = "button", variant = "default", size = "md", href, children, className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-all";
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-10 px-4", lg: "h-11 px-5 text-base" };
  const variants = {
    default: "bg-foreground text-background hover:opacity-90",
    secondary: "border bg-background hover:bg-muted",
    ghost: "hover:bg-muted",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const Comp = href ? "a" : as;
  return (
    <Comp href={href} {...props} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </Comp>
  );
};

export const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-background shadow-sm ${className}`}>{children}</div>
);
export const CardHeader = ({ className = "", children }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
);
export const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
export const CardContent = ({ className = "", children }) => (
  <div className={`p-4 text-sm text-muted-foreground ${className}`}>{children}</div>
);

export const Badge = ({ variant = "secondary", className = "", children }) => {
  const variants = {
    secondary: "border bg-muted text-foreground",
    destructive: "bg-red-100 text-red-700 border-red-200",
  };
  return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${variants[variant]} ${className}`}>{children}</span>;
};

export const Separator = ({ className = "" }) => <div className={`border-t ${className}`} />;

export const Pill = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm font-medium">
    {children}
  </span>
);

/* Tabs (simple stateful) */
export const Tabs = ({ tabs, defaultKey }) => {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);
  const current = tabs.find((t) => t.key === active);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`h-9 rounded-md px-3 text-sm border ${active === t.key ? "bg-foreground text-background" : "bg-background hover:bg-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{current?.content}</div>
    </div>
  );
};

/* Accordion (single or multiple via prop) */
export const Accordion = ({ items, multiple = false }) => {
  const [open, setOpen] = useState(multiple ? [] : null);
  const toggle = (i) => {
    if (multiple) {
      setOpen((arr) => (arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]));
    } else {
      setOpen(open === i ? null : i);
    }
  };
  const isOpen = (i) => (multiple ? open.includes(i) : open === i);

  return (
    <div className="divide-y rounded-xl border">
      {items.map((it, i) => (
        <div key={i}>
          <button onClick={() => toggle(i)} className="w-full text-left p-4 flex items-center justify-between">
            <span className="font-medium">{it.title}</span>
            <span className={`transition-transform ${isOpen(i) ? "rotate-180" : ""}`}>▾</span>
          </button>
          {isOpen(i) && <div className="p-4 pt-0 text-sm text-muted-foreground">{it.content}</div>}
        </div>
      ))}
    </div>
  );
};

/* Inputs + Table */
export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full h-10 px-3 rounded-md border outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

export const Table = ({ children }) => <div className="w-full overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
export const TableHeader = ({ children }) => <thead className="bg-muted/60">{children}</thead>;
export const TableBody = ({ children }) => <tbody>{children}</tbody>;
export const TableRow = ({ children }) => <tr className="border-b last:border-b-0">{children}</tr>;
export const TableHead = ({ children }) => <th className="text-left font-medium p-3">{children}</th>;
export const TableCell = ({ children }) => <td className="p-3 align-top">{children}</td>;
