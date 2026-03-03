export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  value: number;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: 'Prospect' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  assignee: string;
  probability: number;
  createdAt: string;
}

export interface SalesRep {
  id: string;
  name: string;
  role: string;
  avatar: string;
  baseRate: number;
  bonusRate: number;
  totalDeals: number;
  totalRevenue: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  deals: number;
  leads: number;
}

export const initialLeads: Lead[] = [
  { id: 'l1', name: 'Sarah Chen', email: 'sarah@techcorp.com', company: 'TechCorp', status: 'Qualified', value: 45000, createdAt: '2026-01-15' },
  { id: 'l2', name: 'James Wilson', email: 'james@innovate.io', company: 'Innovate.io', status: 'New', value: 28000, createdAt: '2026-02-01' },
  { id: 'l3', name: 'Maria Garcia', email: 'maria@globalfin.com', company: 'GlobalFin', status: 'Contacted', value: 72000, createdAt: '2026-01-20' },
  { id: 'l4', name: 'Robert Kim', email: 'robert@nexusai.com', company: 'NexusAI', status: 'Qualified', value: 95000, createdAt: '2026-02-10' },
  { id: 'l5', name: 'Emily Brown', email: 'emily@cloudscape.dev', company: 'Cloudscape', status: 'Lost', value: 31000, createdAt: '2026-01-05' },
  { id: 'l6', name: 'David Patel', email: 'david@datastream.co', company: 'DataStream', status: 'New', value: 58000, createdAt: '2026-02-18' },
  { id: 'l7', name: 'Lisa Thompson', email: 'lisa@securenet.io', company: 'SecureNet', status: 'Contacted', value: 120000, createdAt: '2026-02-05' },
  { id: 'l8', name: 'Alex Nguyen', email: 'alex@brightpath.com', company: 'BrightPath', status: 'Qualified', value: 67000, createdAt: '2026-01-28' },
  { id: 'l9', name: 'Rachel Foster', email: 'rachel@vaulttech.io', company: 'VaultTech', status: 'New', value: 42000, createdAt: '2026-02-22' },
  { id: 'l10', name: 'Michael Torres', email: 'michael@quantum.dev', company: 'QuantumDev', status: 'Contacted', value: 89000, createdAt: '2026-02-12' },
];

export const initialDeals: Deal[] = [
  { id: 'd1', title: 'TechCorp Enterprise License', company: 'TechCorp', value: 45000, stage: 'Negotiation', assignee: 'Alice Johnson', probability: 75, createdAt: '2026-01-15' },
  { id: 'd2', title: 'Innovate.io Starter Pack', company: 'Innovate.io', value: 28000, stage: 'Prospect', assignee: 'Bob Smith', probability: 20, createdAt: '2026-02-01' },
  { id: 'd3', title: 'GlobalFin Premium Suite', company: 'GlobalFin', value: 72000, stage: 'Proposal', assignee: 'Alice Johnson', probability: 50, createdAt: '2026-01-20' },
  { id: 'd4', title: 'NexusAI Platform Deal', company: 'NexusAI', value: 95000, stage: 'Closed Won', assignee: 'Carol Davis', probability: 100, createdAt: '2026-02-10' },
  { id: 'd5', title: 'Cloudscape Migration', company: 'Cloudscape', value: 31000, stage: 'Closed Lost', assignee: 'Bob Smith', probability: 0, createdAt: '2026-01-05' },
  { id: 'd6', title: 'DataStream Analytics', company: 'DataStream', value: 58000, stage: 'Prospect', assignee: 'Carol Davis', probability: 15, createdAt: '2026-02-18' },
  { id: 'd7', title: 'SecureNet Security Audit', company: 'SecureNet', value: 120000, stage: 'Proposal', assignee: 'Alice Johnson', probability: 60, createdAt: '2026-02-05' },
  { id: 'd8', title: 'BrightPath Consulting', company: 'BrightPath', value: 67000, stage: 'Negotiation', assignee: 'Bob Smith', probability: 80, createdAt: '2026-01-28' },
  { id: 'd9', title: 'VaultTech Infrastructure', company: 'VaultTech', value: 42000, stage: 'Prospect', assignee: 'Carol Davis', probability: 25, createdAt: '2026-02-22' },
  { id: 'd10', title: 'QuantumDev R&D License', company: 'QuantumDev', value: 89000, stage: 'Proposal', assignee: 'Alice Johnson', probability: 45, createdAt: '2026-02-12' },
];

export const salesReps: SalesRep[] = [
  { id: 'r1', name: 'Alice Johnson', role: 'Senior AE', avatar: 'AJ', baseRate: 0.08, bonusRate: 0.12, totalDeals: 4, totalRevenue: 326000 },
  { id: 'r2', name: 'Bob Smith', role: 'Account Executive', avatar: 'BS', baseRate: 0.06, bonusRate: 0.10, totalDeals: 3, totalRevenue: 126000 },
  { id: 'r3', name: 'Carol Davis', role: 'Senior AE', avatar: 'CD', baseRate: 0.08, bonusRate: 0.12, totalDeals: 3, totalRevenue: 195000 },
];

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Sep', revenue: 145000, deals: 8, leads: 22 },
  { month: 'Oct', revenue: 198000, deals: 12, leads: 28 },
  { month: 'Nov', revenue: 176000, deals: 10, leads: 25 },
  { month: 'Dec', revenue: 234000, deals: 15, leads: 31 },
  { month: 'Jan', revenue: 267000, deals: 14, leads: 35 },
  { month: 'Feb', revenue: 312000, deals: 18, leads: 42 },
];
