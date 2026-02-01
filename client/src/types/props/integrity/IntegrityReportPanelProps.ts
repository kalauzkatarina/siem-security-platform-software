import { IntegrityReportDTO } from "../../../models/interity/IntegrityLogDTO";

export interface IntegrityReportPanelProps { // Proveri da li piše 'export'
    report: IntegrityReportDTO;
    onClose: () => void;
}