import { Repository } from "typeorm";
import { LogHash } from "../Domain/models/LogHash.js";
import { HashUtil } from "../Utils/HashUtil.js";

export class IntegrityService {
    constructor(private repository: Repository<LogHash>) {}

    // Za kontroler: Vraća listu sumnjivih
    public async getCompromisedEntries(): Promise<LogHash[]> {
        return await this.repository.find({ where: { isCompromised: true } });
    }

    // Za kontroler: Proverava ceo lanac
    public async verifyIntegrity(): Promise<boolean> {
        const chain = await this.repository.find({ order: { timestamp: "ASC" } });
        let isValid = true;
        for (let i = 1; i < chain.length; i++) {
            if (chain[i].previousHash !== chain[i - 1].currentHash) {
                chain[i].isCompromised = true;
                await this.repository.save(chain[i]);
                isValid = false;
            }
        }
        return isValid;
    }

    // Za kontroler: Brzi status
    public async isChainSecure(): Promise<boolean> {
        const count = await this.repository.count({ where: { isCompromised: true } });
        return count === 0;
    }

    // Za internu upotrebu: Čuvanje novog heša
    public async protectEvent(eventId: string, eventData: any): Promise<void> {
        const lastEntry = await this.repository.findOne({ where: {}, order: { timestamp: "DESC" } });
        const prevHash = lastEntry ? lastEntry.currentHash : "0".repeat(64);
        const newHash = HashUtil.calculateSHA256(HashUtil.createDataString(eventData, prevHash));

        const newEntry = new LogHash();
        newEntry.eventId = eventId;
        newEntry.previousHash = prevHash;
        newEntry.currentHash = newHash;
        newEntry.timestamp = new Date();
        newEntry.isCompromised = false;
        await this.repository.save(newEntry);
    }
}