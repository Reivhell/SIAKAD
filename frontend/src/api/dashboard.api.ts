import { apiClient } from './client';

export interface DashboardKpi {
  label: string;
  value: number;
  delta: string | null;
}

export interface DashboardSummary {
  role: string;
  activePeriod: string;
  periods: string[];
  kpis: DashboardKpi[];
  gpaTrend?: { name: string; gpa: number }[];
  facultyDistribution?: { name: string; count: number }[];
  gpaHistory?: { name: string; IPS: number; IPK: number }[];
  courses?: { id: string; code: string; name: string; sks: number; schedule: string; room: string }[];
  schedule?: { day: string; time: string; room: string; code: string; name: string; class: string }[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiClient.get<DashboardSummary>('/dashboard/summary');
}
