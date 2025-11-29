export type ActorType = 'user' | 'hacker' | 'server' | 'database' | 'dns' | 'router' | 'bot' | 'pendrive';

export type AttackCategory = 'Network' | 'Web' | 'Malware' | 'Social' | 'General';

export enum AttackID {
  PHISHING = 'PHISHING',
  RANSOMWARE = 'RANSOMWARE',
  DOS = 'DOS',
  MITM = 'MITM',
  SQL_INJECTION = 'SQL_INJECTION',
  XSS = 'XSS',
  ZERO_DAY = 'ZERO_DAY',
  DNS_SPOOFING = 'DNS_SPOOFING',
  CSRF = 'CSRF',
  SSRF = 'SSRF',
  BROKEN_AUTH = 'BROKEN_AUTH',
  IDOR = 'IDOR',
  DICTIONARY = 'DICTIONARY',
  CMD_INJECTION = 'CMD_INJECTION',
  BUFFER_OVERFLOW = 'BUFFER_OVERFLOW',
  DRIVE_BY_DOWNLOAD = 'DRIVE_BY_DOWNLOAD',
}

export interface Packet {
  id: string;
  from: ActorType;
  to: ActorType;
  label?: string;
  color?: string; // Tailwind color class e.g., 'bg-red-500'
  type: 'data' | 'malware' | 'request' | 'response' | 'key';
}

export interface Step {
  id: number;
  description: string;
  activePacket?: Packet;
  actorStates: Partial<Record<ActorType, {
    status: 'normal' | 'infected' | 'compromised' | 'offline' | 'active';
    label?: string;
  }>>;
}

export interface Position {
  top: string; // Percentage string e.g., "50%"
  left: string; // Percentage string e.g., "50%"
}

export interface ConnectionLine {
  from: ActorType;
  to: ActorType;
  label?: string;
  type?: 'solid' | 'dashed';
  color?: string; // e.g., 'stroke-slate-600'
  arrow?: boolean;
}

export interface ScenarioLayout {
  positions: Partial<Record<ActorType, Position>>;
  connections: ConnectionLine[];
}

export interface AttackScenario {
  id: AttackID;
  category: AttackCategory;
  title: string;
  shortDescription: string;
  actors: ActorType[];
  actorNames?: Partial<Record<ActorType, string>>;
  layout: ScenarioLayout;
  steps: Step[];
  prevention: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index
  explanation: string;
}