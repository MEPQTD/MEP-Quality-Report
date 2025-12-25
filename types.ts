
export enum Discipline {
  MECHANICAL = 'Mechanical',
  ELECTRICAL = 'Electrical',
  PLUMBING = 'Plumbing',
  FIRE_PROTECTION = 'Fire Protection',
  HVAC = 'HVAC',
  GENERAL = 'General'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Observation {
  id: string;
  discipline: Discipline;
  location: string;
  description: string;
  correctiveAction: string;
  severity: Severity;
  photoUrl: string; // Back to single photoUrl to support "each photo has a comment"
}

export interface ReportMetadata {
  projectName: string;
  reportTitle: string;
  date: string;
  inspectorName: string;
  clientName: string;
  location: string;
}

export interface AppState {
  metadata: ReportMetadata;
  observations: Observation[];
}
