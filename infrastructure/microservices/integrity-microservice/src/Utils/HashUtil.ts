import * as crypto from 'crypto';

export class HashUtil {
    public static calculateSHA256(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    public static createDataString(eventData: any, previousHash: string): string {
        // Pretvaramo podatke u string i lepimo na prethodni hash
        return JSON.stringify(eventData) + previousHash;
    }
}