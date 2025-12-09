import { AlertDTO } from "../../models/alerts/AlertDTO";

export interface IAlertAPI {
  getAllAlerts(token: string): Promise<AlertDTO[]>;
  getAlertById(id: number, token: string): Promise<AlertDTO>;
}