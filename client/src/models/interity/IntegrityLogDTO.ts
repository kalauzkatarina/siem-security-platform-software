export interface IntegrityStatusDTO {
  status: 'secure' | 'compromised' | 'pending';
  lastVerified: string;
  totalLogsChecked: number;
  compromisedLogsCount: number;
}

export interface IntegrityReportDTO {
  isValid: boolean;
  tamperedEvents: string[]; 
  checkTimestamp: string;
}