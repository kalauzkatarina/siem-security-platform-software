export interface IIntegrityGatewayService {
    getStatus(): Promise<any>;
    getCompromised(): Promise<any>;
    verify(): Promise<any>;
}