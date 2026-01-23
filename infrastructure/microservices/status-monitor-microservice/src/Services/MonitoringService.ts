import axios from "axios";
import { Db } from "../Database/DbConnectionPool";
import { ServiceThreshold } from "../Domain/models/ServiceThreshold";
import { ServiceCheck } from "../Domain/models/ServiceCheck";
import { ServiceStatus } from "../Domain/enums/ServiceStatusEnum";

export async function runChecksOnce(): Promise<void> {
  const thresholdRepo = Db.getRepository(ServiceThreshold);
  const checkRepo = Db.getRepository(ServiceCheck);

  const services = await thresholdRepo.find();

  for (const s of services) {
    const start = Date.now();

    try {
        await axios.get(s.pingUrl, { timeout: s.timeoutMs });
        const responseTimeMs = Date.now() - start;

        await checkRepo.save({
            serviceName: s.serviceName,
            checkedAt: new Date(),
            status: ServiceStatus.UP,
            responseTimeMs,
            errorType: null,
        });
    } catch (err: any) {
        // axios timeout / conn refused / etc
        const errorType =
            err?.code === "ECONNABORTED"
            ? "timeout"
            : err?.code || "request_failed";

        await checkRepo.save({
            serviceName: s.serviceName,
            checkedAt: new Date(),
            status: ServiceStatus.DOWN,
            responseTimeMs: null,
            errorType,
        });
    }
  }

  console.log(`[StatusMonitor] runChecksOnce finished (${services.length} services)`);
}
