import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Role = 'Student' | 'Staff' | 'Coordinator' | 'On-call' | 'Leadership';
export type Lane = 'Red' | 'Orange' | 'Yellow' | 'Green';
export type CaseStatus = 'New' | 'In review' | 'Accepted' | 'Waiting on student' | 'Resolved';

export type Department = {
  id: string; name: string; group: string; domain: string; scopeTags: string[];
  hours: string; contact: string; wait: string;
};
export type Referral = {
  id: string; deptId: string; reason: string; evidence: string; confidence: number;
  status: 'Suggested' | 'Pending consent' | 'Accepted' | 'Rerouted' | 'Declined';
  formFields: string[]; sources: string[]; appointment?: string;
};
export type Bridge = { deptId: string; waitLabel: string; options: string[] };
export type TraceStep = { kind: string; name: string; purpose: string; input: string; output: string; duration: string };
export type AuditEntry = { action: string; actor: string; when: string; detail: string };
export type SupportCase = {
  id: string; alias: string; summary: string; lane: Lane; confidence: number; status: CaseStatus;
  createdAt: string; needs: string[]; referrals: Referral[]; bridge: Bridge; trace: TraceStep[];
  notes: string[]; audit: AuditEntry[];
};
export type Case = SupportCase;

export const departments: Department[] = [
  { id: 'fin-aid', name: 'Financial Aid & Emergency Grants', group: 'Money & housing', domain: 'financial', scopeTags: ['rent', 'food', 'tuition'], hours: 'Mon–Fri · 9:00–17:00', contact: 'aid@northstar.edu', wait: '2–3 business days' },
  { id: 'counseling', name: 'Counseling & Wellbeing', group: 'Care & health', domain: 'mental-health', scopeTags: ['sleep', 'stress', 'safety'], hours: 'Mon–Fri · 8:00–18:00', contact: 'wellbeing@northstar.edu', wait: '4–6 days' },
  { id: 'academic', name: 'Academic Success Centre', group: 'Learning', domain: 'academic', scopeTags: ['classes', 'study', 'assessment'], hours: 'Mon–Thu · 9:00–20:00', contact: 'success@northstar.edu', wait: '1–2 days' },
  { id: 'housing', name: 'Campus Housing Support', group: 'Money & housing', domain: 'housing', scopeTags: ['rent', 'lease', 'room'], hours: 'Daily · 10:00–16:00', contact: 'housing@northstar.edu', wait: '3–5 days' },
  { id: 'access', name: 'Accessibility & Inclusion', group: 'Learning', domain: 'accessibility', scopeTags: ['adjustments', 'access', 'learning'], hours: 'Mon–Fri · 9:00–16:00', contact: 'access@northstar.edu', wait: '5–7 days' },
  { id: 'careers', name: 'Careers & Work-Study', group: 'Work', domain: 'employment', scopeTags: ['work', 'job', 'income'], hours: 'Mon–Fri · 9:00–17:00', contact: 'careers@northstar.edu', wait: '2–4 days' },
  { id: 'health', name: 'Student Health Clinic', group: 'Care & health', domain: 'health', scopeTags: ['doctor', 'health', 'sleep'], hours: 'Mon–Fri · 8:30–17:00', contact: 'clinic@northstar.edu', wait: '1–3 days' },
  { id: 'international', name: 'International Student Desk', group: 'Belonging', domain: 'international', scopeTags: ['visa', 'international', 'documents'], hours: 'Mon–Fri · 9:00–16:30', contact: 'global@northstar.edu', wait: '2–5 days' },
  { id: 'advocacy', name: 'Student Advocacy Office', group: 'Belonging', domain: 'advocacy', scopeTags: ['appeal', 'conflict', 'rights'], hours: 'Mon–Fri · 10:00–16:00', contact: 'advocacy@northstar.edu', wait: '2–3 days' },
  { id: 'food', name: 'Campus Pantry & Food Support', group: 'Money & housing', domain: 'food', scopeTags: ['food', 'groceries', 'meal'], hours: 'Mon–Fri · 11:00–15:00', contact: 'pantry@northstar.edu', wait: 'Same day' },
  { id: 'disability', name: 'Disability Services', group: 'Learning', domain: 'disability', scopeTags: ['disability', 'adjustment', 'support'], hours: 'Mon–Fri · 9:00–16:00', contact: 'disability@northstar.edu', wait: '5–7 days' },
  { id: 'chaplaincy', name: 'Multi-faith & Community Care', group: 'Belonging', domain: 'community', scopeTags: ['belonging', 'community', 'identity'], hours: 'Mon–Fri · 9:00–17:00', contact: 'care@northstar.edu', wait: '1–2 days' },
];

const baseTrace: TraceStep[] = [
  { kind: 'safety', name: 'Safety pass', purpose: 'Checks whether immediate safety support is needed.', input: 'Student story', output: 'No immediate safety signal', duration: '38 ms' },
  { kind: 'triage', name: 'Needs map', purpose: 'Groups the story into support needs without diagnosing.', input: 'Story + selected chips', output: 'Financial · academic · wellbeing', duration: '71 ms' },
  { kind: 'routing', name: 'Evidence routing', purpose: 'Matches words in the story to scoped services.', input: 'Need map', output: '3 explainable referrals', duration: '54 ms' },
  { kind: 'confidence', name: 'Confidence check', purpose: 'Surfaces uncertainty for human review.', input: 'Route candidates', output: 'High · 0.91', duration: '19 ms' },
];

const ref = (id: string, deptId: string, reason: string, evidence: string, appointment?: string): Referral => ({
  id, deptId, reason, evidence, confidence: appointment ? 0.91 : 0.84, status: 'Pending consent',
  formFields: ['Preferred name', 'Best contact method', 'What would help first?'],
  sources: ['Student story', 'Northstar support directory · 2025'],
  appointment,
});

export const initialCases: SupportCase[] = [
  {
    id: 'SB-4821', alias: 'Aanya', summary: "Can't pay rent, failing two classes, and can't sleep.", lane: 'Orange', confidence: .91,
    status: 'In review', createdAt: 'Today · 10:42', needs: ['Rent pressure', 'Academic strain', 'Sleep & stress'],
    referrals: [ref('r-1', 'fin-aid', 'Emergency grant and rent support', '“can’t pay rent”'), ref('r-2', 'academic', 'A short-term study plan', '“failing two classes”', 'Tomorrow, 14:30'), ref('r-3', 'counseling', 'Wellbeing conversation about sleep', '“can’t sleep”')],
    bridge: { deptId: 'fin-aid', waitLabel: '2–3 business days', options: ['Emergency grant form', 'Food pantry today', 'Talk to a person now'] },
    trace: baseTrace, notes: ['Student asked not to be called before 17:00.'], audit: [{ action: 'Case created', actor: 'SupportBridge', when: 'Today · 10:42', detail: 'Student consented to share the selected referrals.' }],
  },
  {
    id: 'SB-4790', alias: 'M.', summary: 'Worried about a housing renewal deadline.', lane: 'Yellow', confidence: .88, status: 'Accepted', createdAt: 'Yesterday · 16:18',
    needs: ['Housing'], referrals: [ref('r-4', 'housing', 'Housing renewal guidance', '“renewal deadline”')], bridge: { deptId: 'housing', waitLabel: '3–5 days', options: ['Read renewal guide'] }, trace: baseTrace.slice(0, 3), notes: [], audit: [],
  },
  {
    id: 'SB-4762', alias: 'J.', summary: 'Needs an extension and is unsure who can approve it.', lane: 'Yellow', confidence: .79, status: 'Waiting on student', createdAt: 'Mon · 09:04',
    needs: ['Assessment support'], referrals: [ref('r-5', 'academic', 'Assessment extension guidance', '“extension”')], bridge: { deptId: 'academic', waitLabel: '1–2 days', options: ['Open extension guide'] }, trace: baseTrace.slice(0, 3), notes: [], audit: [],
  },
  {
    id: 'SB-4714', alias: 'R.', summary: 'Feels unsafe after a conflict in shared housing.', lane: 'Red', confidence: .96, status: 'Accepted', createdAt: 'Sun · 22:11',
    needs: ['Immediate safety', 'Housing'], referrals: [ref('r-6', 'advocacy', 'Immediate safety and advocacy', '“feels unsafe”')], bridge: { deptId: 'advocacy', waitLabel: 'Now', options: ['Call campus emergency'] }, trace: baseTrace.slice(0, 1), notes: ['On-call alert acknowledged.'], audit: [],
  },
  {
    id: 'SB-4688', alias: 'T.', summary: 'Looking for work-study hours next term.', lane: 'Orange', confidence: .86, status: 'New', createdAt: 'Sun · 12:30',
    needs: ['Work'], referrals: [ref('r-7', 'careers', 'Work-study matching', '“work-study”')], bridge: { deptId: 'careers', waitLabel: '2–4 days', options: ['Browse open roles'] }, trace: baseTrace.slice(0, 3), notes: [], audit: [],
  },
  {
    id: 'SB-4650', alias: 'S.', summary: 'Needs help but is not sure which office to contact.', lane: 'Green', confidence: .48, status: 'New', createdAt: 'Sat · 15:12',
    needs: ['Unclear'], referrals: [], bridge: { deptId: 'chaplaincy', waitLabel: '1–2 days', options: ['Talk to a person'] }, trace: baseTrace.slice(0, 2).concat([{ kind: 'confidence', name: 'Confidence check', purpose: 'Surfaces uncertainty for human review.', input: 'Unclear need', output: 'Low · 0.48', duration: '19 ms' }]), notes: [], audit: [],
  },
];

export type Alert = { id: string; caseId: string; status: 'Open' | 'Acknowledged'; reason: string; createdAt: string };

type AppState = {
  role: Role; setRole: (role: Role) => void; cases: SupportCase[]; alerts: Alert[];
  updateReferral: (caseId: string, referralId: string, status: Referral['status']) => void;
  addNote: (caseId: string, note: string, actor?: string) => void;
  reroute: (caseId: string, referralId: string, deptId: string, reason: string) => void;
  resolveCase: (caseId: string) => void; acknowledgeAlert: (alertId: string) => void; createAlert: (caseId: string, reason: string) => void;
  createCase: (summary: string, lane?: Lane) => SupportCase;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Student');
  const [cases, setCases] = useState<SupportCase[]>(initialCases);
  const [alerts, setAlerts] = useState<Alert[]>([{ id: 'AL-1008', caseId: 'SB-4714', status: 'Open', reason: 'Immediate safety signal in student story', createdAt: 'Today · 10:41' }]);
  const value = useMemo<AppState>(() => ({
    role, setRole, cases, alerts,
    updateReferral: (caseId, referralId, status) => setCases(prev => prev.map(c => c.id !== caseId ? c : ({ ...c, status: status === 'Accepted' ? 'Accepted' : c.status, referrals: c.referrals.map(r => r.id === referralId ? { ...r, status } : r), audit: [...c.audit, { action: `Referral ${status.toLowerCase()}`, actor: role, when: 'Just now', detail: `Referral ${referralId} updated in the shared tracker.` }] }))),
    addNote: (caseId, note, actor = role) => setCases(prev => prev.map(c => c.id !== caseId ? c : ({ ...c, notes: [...c.notes, note], audit: [...c.audit, { action: 'Note added', actor, when: 'Just now', detail: note }] }))),
    reroute: (caseId, referralId, deptId, reason) => setCases(prev => prev.map(c => c.id !== caseId ? c : ({ ...c, referrals: c.referrals.map(r => r.id === referralId ? { ...r, deptId, status: 'Rerouted' } : r), audit: [...c.audit, { action: 'Referral rerouted', actor: role, when: 'Just now', detail: reason }] }))),
    resolveCase: caseId => setCases(prev => prev.map(c => c.id !== caseId ? c : ({ ...c, status: 'Resolved', audit: [...c.audit, { action: 'Case resolved', actor: role, when: 'Just now', detail: 'Shared support plan marked complete.' }] }))),
    acknowledgeAlert: alertId => setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'Acknowledged' } : a)),
    createAlert: (caseId, reason) => setAlerts(prev => prev.some(alert => alert.caseId === caseId && alert.status === 'Open') ? prev : [...prev, { id: `AL-${Math.floor(1010 + Math.random() * 80)}`, caseId, status: 'Open', reason, createdAt: 'Just now' }]),
    createCase: (summary, lane = 'Orange') => {
      const created: SupportCase = { id: `SB-${Math.floor(4900 + Math.random() * 99)}`, alias: 'You', summary, lane, confidence: .9, status: 'In review', createdAt: 'Just now', needs: ['Support request'], referrals: [], bridge: { deptId: 'counseling', waitLabel: '4–6 days', options: ['Talk to a person'] }, trace: baseTrace, notes: [], audit: [{ action: 'Case created', actor: 'SupportBridge', when: 'Just now', detail: 'Student asked for support.' }] };
      setCases(prev => [created, ...prev]); return created;
    },
  }), [role, cases, alerts]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}

export function getDepartment(id: string) { return departments.find(d => d.id === id) ?? departments[0]; }