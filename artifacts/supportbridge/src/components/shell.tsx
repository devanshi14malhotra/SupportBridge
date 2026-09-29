import { Activity, ArrowRight, Bot, CircleHelp, FileText, HeartHandshake, ShieldCheck, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { useApp, type Role, type TraceStep } from '@/data/mock';

const roleRoutes: Record<Role, string> = {
  Student: '/',
  Staff: '/staff',
  Coordinator: '/coordinator',
  'On-call': '/oncall',
  Leadership: '/overview',
};

export function Header() {
  const { role, setRole } = useApp();
  const [, navigate] = useLocation();
  const [traceOpen, setTraceOpen] = useState(false);
  const traces: TraceStep[] = [
    { kind: 'privacy', name: 'Purpose boundary', purpose: 'Keeps support recommendations explainable and consent-aware.', input: 'Current view', output: 'Demo data only', duration: '12 ms' },
    { kind: 'safety', name: 'Safety pass', purpose: 'Prioritises urgent help before routing.', input: 'Student language', output: 'Ready', duration: '38 ms' },
    { kind: 'audit', name: 'Shared record', purpose: 'Lets people act without asking for the story again.', input: 'Case activity', output: 'Synced in memory', duration: '8 ms' },
  ];
  return (
    <>
      <header className="sb-header">
        <Link href="/" className="sb-brand" data-testid="link-brand">
          <span className="sb-mark"><HeartHandshake size={19} /></span>
          <span><strong>SupportBridge</strong><small>one story · shared care</small></span>
        </Link>
        <div className="sb-header-actions">
          <label className="sb-role" data-testid="control-role-switcher">
            <span className="sb-kicker">Viewing as</span>
            <select value={role} onChange={event => { const next = event.target.value as Role; setRole(next); navigate(roleRoutes[next]); }} aria-label="Demo role">
              <option>Student</option><option>Staff</option><option>Coordinator</option><option>On-call</option><option>Leadership</option>
            </select>
          </label>
          <button className="sb-icon-btn" onClick={() => setTraceOpen(true)} aria-label="Open trace drawer" data-testid="button-open-trace"><Activity size={18} /></button>
        </div>
      </header>
      {traceOpen && <><div className="sb-scrim" onClick={() => setTraceOpen(false)} aria-hidden="true" /><aside className="sb-trace-drawer" aria-label="Explainability trace">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
          <div><div className="sb-eyebrow">Explainability</div><h2 className="sb-display" style={{ fontSize: 31, margin: '10px 0 8px' }}>How this view arrived here</h2><p className="sb-kicker">A short, human-readable trail. No diagnosis. No hidden scoring.</p></div>
          <button className="sb-icon-btn" onClick={() => setTraceOpen(false)} aria-label="Close trace drawer" data-testid="button-close-trace"><X size={18} /></button>
        </div>
        <hr className="sb-divider" />
        {traces.map((trace, index) => <div className="sb-trace-step" key={trace.name}><div className="sb-mono" style={{ color: 'hsl(var(--primary))' }}>0{index + 1} · {trace.kind}</div><h4>{trace.name}</h4><p>{trace.purpose}</p><p style={{ marginTop: 7 }}><b>Input</b> {trace.input} → <b>Output</b> {trace.output} <span className="sb-mono">({trace.duration})</span></p></div>)}
        <div className="sb-notice"><strong>Consent is a gate</strong><span className="sb-kicker">No referral is sent to a department until the student chooses to share it.</span></div>
      </aside></>}
    </>
  );
}

export function Footer() {
  return <footer className="sb-footer"><span>SupportBridge is a demo companion for student support. If you are in immediate danger, contact local emergency services.</span><span>Demo with synthetic data</span></footer>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="sb-app"><Header />{children}<Footer /></div>;
}

export function TalkToPerson({ compact = false }: { compact?: boolean }) {
  return <Link href="/person" className={compact ? 'sb-button sb-button-quiet' : 'sb-button sb-button-secondary'} data-testid="link-talk-to-person"><CircleHelp size={17} />Talk to a person</Link>;
}

export function PortalNav() {
  const { role } = useApp();
  if (role === 'Student') return null;
  return <nav className="sb-nav-pills" aria-label="Portal sections">
    <Link href="/staff" data-testid="link-nav-staff"><FileText size={14} /> Inbox</Link>
    <Link href="/coordinator" data-testid="link-nav-coordinator"><ShieldCheck size={14} /> Review queue</Link>
    <Link href="/oncall" data-testid="link-nav-oncall"><Activity size={14} /> On-call</Link>
    <Link href="/overview" data-testid="link-nav-overview"><Bot size={14} /> Overview</Link>
  </nav>;
}

export function SectionIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap' }}>
    <div><div className="sb-eyebrow">{eyebrow}</div><h1 className="sb-title">{title}</h1><p className="sb-subtitle">{description}</p></div>{children && <div className="sb-actions">{children}</div>}
  </div>;
}

export function BackLink({ href, label = 'Back' }: { href: string; label?: string }) {
  return <Link href={href} className="sb-button sb-button-quiet" data-testid={`link-back-${href.replace(/\W/g, '')}`}><ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />{label}</Link>;
}