import { IIntegrityGatewayService } from "../../Domain/services/IIntegrityGatewayService";

export class IntegrityGatewayService implements IIntegrityGatewayService {
    private readonly apiUrl: string;

    constructor() {
        // Čitamo iz .env-a koji si malopre dopunila
        this.apiUrl = process.env.INTEGRITY_SERVICE_API || "http://localhost:3005/api/v1";
    }

    async getStatus(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/integrity/status`);
        return await response.json();
    }

    async getCompromised(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/integrity/compromised`);
        return await response.json();
    }

    async verify(): Promise<any> {
        const response = await fetch(`${this.apiUrl}/integrity/verify`, {
            method: 'POST'
        });
        return await response.json();
    }
}