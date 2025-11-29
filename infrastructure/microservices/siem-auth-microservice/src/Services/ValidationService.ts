import { IValidationService } from '../Domain/services/IValidationService';
import { AuthTokenClaims } from '../Domain/types/AuthTokenClaims';
import { VerifyResult } from '../Domain/types/VerifyResult';

export type JWTValidationOptions = {
    secret?: string;
    sysAdminRoleId?: number;
}

export class ValidationService implements IValidationService {
    private secret: string;
    private sysAdminRoleId: number;

    constructor(secret: string, sysAdminRoleId?: number) {
        this.secret = secret;
        this.sysAdminRoleId = 1;
    }

    normalizeAuthHeader(header?: string): string | null {
        if(!header){
            return null;
        }

        const s = header.trim();
        if(!s){
            return null;
        }

        return s.toLowerCase().startsWith('Bearer') ? s.slice(6).trim() : s;
        // Bearer "token" ili samo "token"
    }
    
    verifyToken(token: string): Promise<VerifyResult> {
        throw new Error('Method not implemented.');
    }

    isSysAdminPayload(payload?: AuthTokenClaims, sysAdminRoleId?: number): boolean {
       if(!payload){
        return false;
       }

       let sysId = this.sysAdminRoleId;
       if(sysAdminRoleId !== undefined && sysAdminRoleId !== null){
        const parsed = Number(sysAdminRoleId);

        if(!Number.isNaN(parsed)){
            sysId = parsed;
        }
       }

       return payload.role === sysId;
    }

}