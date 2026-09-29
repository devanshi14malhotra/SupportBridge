import { ArrowRight, CalendarClock, Check, ChevronRight, Clock3, HeartHandshake, Info, Phone, ShieldAlert, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { useApp } from '@/data/mock';
import { BackLink, SectionIntro, TalkToPerson } from '@/components/shell';

function StudentFrame({ children }: { children: React.ReactNode }) {
  return <main className="sb-main">{children}</main>;
}

export function Welcome() {
  return <StudentFrame><section className="sb-hero fade-up">
    <div><div className="sb-eyebrow">Student support, without the repeat</div><h1 className="sb-title">Bring the whole story.<br /><span style={{ color: 'hsl(var(--primary))' }}>We’ll hold the thread.</span></h1><p className="sb-subtitle">SupportBridge listens for what is going on, explains where it fits, and helps you take the next step — with your say at every handoff.</p><div className="sb-actions" style={{ marginTop: 28 }}><Link href="/chat" className="sb-button sb-button-primary" data-testid="button-start-support">Start with your story <ArrowRight size={18} /></Link><TalkToPerson /></div><div className="sb-kicker" style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center' }}><ShieldAlert size={15} />Urgent or unsafe right now? <Link href="/crisis" style={{ color: 'hsl(var(--destructive))', fontWeight: 700 }} data-testid="link-crisis">Get immediate help</Link></div></div>
    <div className="sb-hero-art"><div className="sb-hero-orbit" /><p>One story · many doors · your consent</p></div>
  </section>
  <section className="sb-grid sb-grid-3 fade-up" style={{ animationDelay: '.1s' }}>
    <div className="sb-card"><div className="sb-eyebrow">01 · tell it once</div><h3 style={{ marginTop: 15 }}>Plain language, no perfect words</h3><p>Start with whatever is taking up the most room in your head. A person can join at any time.</p></div>
    <div className="sb-card"><div className="sb-eyebrow">02 · see the why</div><h3 style={{ marginTop: 15 }}>Recommendations you can question</h3><p>See the words and sources behind a suggested route before anything is shared.</p></div>
    <div className="sb-card"><div className="sb-eyebrow">03 · keep your say</div><h3 style={{ marginTop: 15 }}>Consent before connection</h3><p>Forms are prefilled for you to review. Nothing leaves this space until you choose it.</p></div>
  </section>
  <div className="sb-card sb-card-flat fade-up" style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}><div><strong>Need an answer, not a case?</strong><p style={{ margin: '4px 0 0' }}>Ask about a deadline, policy, or support option and we’ll point to a source.</p></div><Link href="/chat" className="sb-button sb-button-secondary" data-testid="link-ask-question">Ask a question <ChevronRight size={16} /></Link></div>
  </StudentFrame>;
}

type ChatMessage = { from: 'assistant' | 'student'; text: string; meta?: string };
export function Chat() {
  const [, navigate] = useLocation();
  const { createCase } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: 'assistant', text: 'I’m here. What is making things feel difficult today? You can write a sentence, a list, or just a few words.', meta: 'SupportBridge · listening' }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [suggestions, setSuggestions] = useState(false);
  const [consent, setConsent] = useState(false);
  const [info, setInfo] = useState(false);
  const scenario = "I can't pay rent, I'm failing two classes and I can't sleep";
  const send = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'student', text: value }]);
    const lower = value.toLowerCase();
    if (lower.includes('i want to die') || lower.includes('kill myself') || lower.includes('end my life')) {
      navigate('/crisis'); return;
    }
    if (lower.includes('ignore previous instructions')) {
      setMessages(prev => [...prev, { from: 'assistant', text: 'I can record that as part of your story, but I will not treat it as an instruction. What support would feel most useful right now?', meta: 'Data, not instruction' }]); return;
    }
    if (lower.includes('deadline') || lower.includes('hardship')) {
      setInfo(true);
      setMessages(prev => [...prev, { from: 'assistant', text: 'A hardship deadline extension may be available. I found a current answer in the Student Handbook, section 4.2. This is information only — no case was created.', meta: 'Green information · source checked' }]); return;
    }
    if (lower.includes('rent') || lower.includes('failing') || lower.includes('sleep') || value === scenario) {
      setStep(2); setSuggestions(true);
      setMessages(prev => [...prev, { from: 'assistant', text: 'Thank you for putting that into words. I’m hearing money pressure, academic strain, and sleep. I’ll show you why I’m suggesting each door, then you choose what to share.', meta: 'Safety pass complete · no immediate danger signal' }]);
      return;
    }
    if (step === 0) {
      setStep(1); setMessages(prev => [...prev, { from: 'assistant', text: 'Would you like to start with money, study, health, housing, or something else? You can also type the whole story.', meta: 'A small prompt, not a diagnosis' }]);
    } else {
      setMessages(prev => [...prev, { from: 'assistant', text: 'I’m not sure which office owns that yet. A person can help you find the right door without starting over.', meta: 'Human handoff available' }]);
    }
  };
  const confirm = () => setConsent(true);
  const finishConsent = () => { const created = createCase(scenario, 'Orange'); navigate(`/track/${created.id}`); };
  return <StudentFrame><div className="sb-chat-shell">
    <SectionIntro eyebrow="Private intake · step 1 of 3" title="Start anywhere." description="This is a supportive conversation, not a test. You can stop, edit, or ask for a person at any point."><TalkToPerson compact /></SectionIntro>
    <div className="sb-progress" aria-label={`Intake progress ${step === 2 ? 70 : 25}%`}><span style={{ width: `${step === 2 ? 70 : 25}%` }} /></div>
    <div className="sb-card" style={{ marginTop: 18 }}>
      <div className="sb-chat-window" aria-live="polite">{messages.map((message, index) => <div key={`${message.text}-${index}`} className={`sb-msg sb-msg-${message.from}`} data-testid={`message-${index}`}><small>{message.from === 'assistant' ? (message.meta ?? 'SupportBridge') : 'You'}</small>{message.text}</div>)}</div>
      {suggestions && !consent && <div className="fade-up" style={{ marginTop: 18 }}>
        <div className="sb-card sb-card-flat"><div className="sb-eyebrow">Triage lane · Orange</div><h3 style={{ marginTop: 10 }}>Three possible doors, held together</h3><p style={{ marginTop: 4 }}>Medium urgency because several pressures are stacking up. Confidence <b>91%</b> — you can correct this.</p>
          <div className="sb-grid" style={{ gap: 10, marginTop: 15 }}>{[['Money & housing', '“can’t pay rent”', 'Emergency grant + pantry'], ['Academic Success', '“failing two classes”', 'Short-term study plan'], ['Counseling & Wellbeing', '“can’t sleep”', 'A wellbeing conversation']].map(item => <div key={item[0]} className="sb-notice"><strong>{item[0]}</strong><span className="sb-kicker">Evidence: {item[1]} · {item[2]}</span></div>)}</div>
          <div className="sb-actions" style={{ marginTop: 18 }}><button className="sb-button sb-button-primary" onClick={confirm} data-testid="button-review-consent">Review and choose referrals <ArrowRight size={16} /></button><TalkToPerson compact /></div>
        </div>
      </div>}
      {consent && <div className="sb-card sb-success fade-up" style={{ marginTop: 18 }}><div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}><Check size={20} /><div><h3>Choose what to share</h3><p style={{ margin: '4px 0 15px' }}>These forms are filled from your story for you to review. Nothing is sent until you confirm.</p>{['Emergency grant · “can’t pay rent”', 'Academic Success · “failing two classes”', 'Wellbeing · “can’t sleep”'].map((label, index) => <label key={label} style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '10px 0', fontSize: 14 }}><input type="checkbox" defaultChecked={index !== 2} data-testid={`checkbox-referral-${index}`} />{label}</label>)}<button className="sb-button sb-button-primary" style={{ marginTop: 12 }} onClick={finishConsent} data-testid="button-confirm-referrals">Confirm and create my bridge <ArrowRight size={16} /></button></div></div></div>}
      <div style={{ marginTop: 22 }}><div className="sb-kicker" style={{ marginBottom: 10 }}>Try a quick start</div><div className="sb-actions">{[scenario, 'I need an answer about a hardship deadline', 'I want to talk to someone'].map(chip => <button key={chip} className="sb-chip" onClick={() => chip === 'I want to talk to someone' ? navigate('/person') : send(chip)} data-testid={`chip-${chip.slice(0, 10).replace(/\W/g, '')}`}>{chip}</button>)}</div></div>
      <form className="sb-composer" style={{ marginTop: 18 }} onSubmit={event => { event.preventDefault(); send(input); }}><input className="sb-input" value={input} onChange={event => setInput(event.target.value)} aria-label="Tell your story" placeholder="Write what is going on…" data-testid="input-chat-message" /><button className="sb-button sb-button-primary" type="submit" data-testid="button-send-message">Send <ArrowRight size={16} /></button></form>
      {info && <div className="sb-notice" style={{ marginTop: 14 }}><strong><Info size={15} style={{ verticalAlign: 'middle' }} /> Source tag · Student Handbook 4.2</strong><span className="sb-kicker">This answer did not create a case.</span></div>}
    </div>
  </div></StudentFrame>;
}

export function Crisis() {
  const { alerts, createAlert } = useApp();
  useEffect(() => { createAlert('SB-CRISIS', 'Student used an immediate safety phrase in chat.'); }, []);
  return <StudentFrame><div className="sb-chat-shell"><BackLink href="/chat" label="Return to chat" /><div className="sb-alert fade-up" style={{ marginTop: 24 }}><div className="sb-eyebrow" style={{ color: 'hsl(var(--destructive))' }}>Immediate support</div><h1 className="sb-title" style={{ fontSize: 'clamp(42px, 7vw, 72px)', marginTop: 15 }}>You do not have<br />to hold this alone.</h1><p className="sb-subtitle" style={{ color: 'hsl(var(--foreground))' }}>If you may hurt yourself or are in immediate danger, call local emergency services now or use one of the crisis lines below. If speaking is hard, show this screen to someone nearby.</p><div className="sb-actions" style={{ marginTop: 22 }}><a className="sb-button sb-button-danger" href="tel:112" data-testid="button-call-emergency"><Phone size={17} />Call local emergency services</a><Link className="sb-button sb-button-secondary" href="/person" data-testid="link-crisis-person"><UserRound size={17} />Request a person</Link></div></div>
    <div className="sb-grid sb-grid-2" style={{ marginTop: 18 }}><div className="sb-card"><div className="sb-eyebrow">India · available now</div><h2 style={{ marginTop: 12 }}>Tele-MANAS</h2><p>Free mental health support, 24 hours.</p><a href="tel:14416" className="sb-button sb-button-primary" data-testid="button-call-telemana"><Phone size={16} />14416</a></div><div className="sb-card"><div className="sb-eyebrow">India · crisis support</div><h2 style={{ marginTop: 12 }}>KIRAN</h2><p>Free support line for emotional distress.</p><a href="tel:18005990019" className="sb-button sb-button-primary" data-testid="button-call-kiran"><Phone size={16} />1800-599-0019</a></div></div>
    <div className="sb-card sb-card-flat" style={{ marginTop: 18 }}><strong>A discreet on-call alert has been created.</strong><p style={{ margin: '4px 0 0' }}>A trained responder can see that urgent support was requested. You do not need to explain everything again. {alerts.find(a => a.status === 'Open') ? 'The alert is waiting for acknowledgement.' : 'The alert has been acknowledged.'}</p></div>
  </div></StudentFrame>;
}

export function Tracker() {
  const [, params] = useRoute('/track/:caseId');
  const { cases } = useApp();
  const found = cases.find(c => c.id === params?.caseId) ?? cases[0];
  return <StudentFrame><div className="sb-chat-shell"><SectionIntro eyebrow={`Your bridge · ${found.id}`} title={`Hi ${found.alias}. Here’s the thread.`} description="You can see who has the next step, what you chose to share, and when a human has acted."><TalkToPerson compact /></SectionIntro><div className="sb-card sb-success" style={{ marginBottom: 18 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}><div><div className="sb-eyebrow">Current status</div><h2 style={{ marginTop: 10 }}>Support plan is moving</h2><p style={{ margin: '4px 0 0' }}>{found.summary}</p></div><span className="sb-pill lane-orange">Orange lane · {Math.round(found.confidence * 100)}% confidence</span></div></div>
    <div className="sb-grid sb-grid-2"><div className="sb-card"><div className="sb-eyebrow">Shared next steps</div><div className="sb-timeline" style={{ marginTop: 18 }}>{[{ title: 'Story received', detail: 'Safety pass completed · no immediate danger signal', done: true }, { title: 'Referrals chosen', detail: 'Your selected forms are ready for review', done: true }, { title: 'Academic Success', detail: 'Appointment tomorrow · 14:30', done: true }, { title: 'Financial Aid', detail: 'Estimated response in 2–3 business days', done: false }].map(item => <div className="sb-timeline-item" key={item.title}><div className="sb-timeline-line" style={{ '--dot': item.done ? 'hsl(var(--primary))' : 'hsl(var(--border))' } as React.CSSProperties} /><div><strong>{item.title}</strong><p style={{ margin: '4px 0 15px', fontSize: 13 }}>{item.detail}</p></div></div>)}</div></div><div className="sb-card"><div className="sb-eyebrow">Your bridge support</div><h2 style={{ marginTop: 12 }}>While you wait</h2><p>Waiting should not mean being left alone.</p><div className="sb-grid" style={{ gap: 10, marginTop: 16 }}>{found.bridge.options.map(option => <button className="sb-button sb-button-secondary" style={{ justifyContent: 'space-between' }} key={option} data-testid={`button-bridge-${option.slice(0, 8).replace(/\W/g, '')}`}>{option}<ChevronRight size={16} /></button>)}</div><hr className="sb-divider" /><div className="sb-kicker"><Clock3 size={14} style={{ verticalAlign: 'middle' }} /> Expected wait: {found.bridge.waitLabel}</div></div></div>
    <div className="sb-card" style={{ marginTop: 18 }}><div className="sb-eyebrow">What was shared</div><div className="sb-actions" style={{ marginTop: 14 }}>{found.needs.map(need => <span className="sb-pill lane-blue" key={need}>{need}</span>)}</div><p style={{ marginTop: 18 }}><ShieldAlert size={15} style={{ verticalAlign: 'middle' }} /> You can ask us to change a referral or stop sharing at any time.</p></div>
  </div></StudentFrame>;
}

export function Person() {
  const [sent, setSent] = useState(false);
  return <StudentFrame><div style={{ maxWidth: 760, margin: '0 auto' }}><BackLink href="/" label="Back to SupportBridge" /><div className="sb-card fade-up" style={{ marginTop: 24, padding: 'clamp(22px, 6vw, 48px)' }}>{!sent ? <><div className="sb-mark" style={{ marginBottom: 24 }}><HeartHandshake size={19} /></div><div className="sb-eyebrow">Human handoff</div><h1 className="sb-title" style={{ fontSize: 'clamp(40px, 7vw, 65px)' }}>A person can take it from here.</h1><p className="sb-subtitle">Leave a preferred way to reach you. We’ll share only this request with the support team — not the whole conversation unless you choose it.</p><div className="sb-grid sb-grid-2" style={{ marginTop: 25 }}><div className="sb-field"><label className="sb-label" htmlFor="person-name">Preferred name</label><input id="person-name" className="sb-input" placeholder="What should we call you?" data-testid="input-person-name" /></div><div className="sb-field"><label className="sb-label" htmlFor="person-contact">Email or phone</label><input id="person-contact" className="sb-input" placeholder="How can we reach you?" data-testid="input-person-contact" /></div></div><div className="sb-field"><label className="sb-label" htmlFor="person-window">Best time</label><select id="person-window" className="sb-select" data-testid="select-person-window"><option>Today · after 17:00</option><option>Tomorrow morning</option><option>Tomorrow afternoon</option></select></div><button className="sb-button sb-button-primary" onClick={() => setSent(true)} data-testid="button-request-person">Request a callback <CalendarClock size={17} /></button><p className="sb-kicker" style={{ marginTop: 15 }}>Typical response: within one working day.</p></> : <div className="sb-success"><Check size={26} /><h1 className="sb-title" style={{ fontSize: 50 }}>You’re on the list.</h1><p className="sb-subtitle">A support person will reach out in the window you chose. Your request reference is <span className="sb-mono">CB-204</span>.</p><Link href="/" className="sb-button sb-button-primary" data-testid="link-person-done">Return home <ArrowRight size={16} /></Link></div>}</div></div></StudentFrame>;
}