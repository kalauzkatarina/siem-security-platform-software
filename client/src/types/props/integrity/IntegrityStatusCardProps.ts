import { IntegrityStatusDTO } from "../../../models/interity/IntegrityLogDTO";

export interface IntegrityStatusCardProps {
    status: IntegrityStatusDTO;
    onVerify: () => void;
    loading: boolean;
}