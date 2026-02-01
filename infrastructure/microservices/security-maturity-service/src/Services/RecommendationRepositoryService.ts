import { Repository, In } from "typeorm";
import { IRecommendationRepositoryService } from "../Domain/services/IRecommendationRepositoryService";
import { Recommendation } from "../Domain/types/Recommendation";
import { RecommendationSnapshot } from "../Domain/types/RecommendationSnapshot";
import { RecommendationEntity } from "../Domain/models/RecommendationEntity";
import { RecommendationSnapshot as RecommendationSnapshotEntity } from "../Domain/models/RecommendationSnapshot";

export class RecommendationRepositoryService implements IRecommendationRepositoryService {
  constructor(
    private readonly snapshotRepo: Repository<RecommendationSnapshotEntity>,
    private readonly recommendationRepo: Repository<RecommendationEntity>
  ) {}

  // -------------------------
  // Snapshot (IDs-only)
  // -------------------------

  public async getLatestSnapshot(): Promise<RecommendationSnapshot> {
    try {
      const entity = await this.snapshotRepo.findOne({
        where: {},
        order: { generatedAt: "DESC" }
      });

      if (!entity) {
        return this.sentinelSnapshot();
      }

      return {
        id: entity.id,
        generatedAtUtc: entity.generatedAt,
        recommendationIds: Array.isArray(entity.recommendationIds) ? entity.recommendationIds : []
      };
    } catch (e) {
      console.error("[RecommendationRepositoryService] getLatestSnapshot failed.", String(e));
      return this.sentinelSnapshot();
    }
  }

  public async saveSnapshot(snapshot: RecommendationSnapshot): Promise<void> {
    try {
      const entity = this.snapshotRepo.create({
        generatedAt: snapshot.generatedAtUtc,
        recommendationIds: snapshot.recommendationIds
      });

      await this.snapshotRepo.save(entity);
    } catch (e) {
      console.error("[RecommendationRepositoryService] saveSnapshot failed.", String(e));
    }
  }

  // -------------------------
  // Recommendations (rows)
  // -------------------------

  public async saveRecommendations(recommendations: Recommendation[]): Promise<number[]> {
    try {
      if (recommendations.length === 0) return [];

      const now = new Date();

      const entities: RecommendationEntity[] = recommendations.map(r => {
        const e = new RecommendationEntity();
        e.title = r.title;
        e.rationale = r.rationale;
        e.priority = r.priority;
        e.effort = r.effort;
        e.category = r.category;
        e.relatedMetrics = r.relatedMetrics;
        e.suggestedActions = r.suggestedActions;
        e.createdAt = now;
        return e;
      });

      const saved = await this.recommendationRepo.save(entities);

      const ids: number[] = [];
      for (const s of saved) {
        if (Number.isFinite(s.id)) {
          ids.push(s.id);
        }
      }

      return ids;
    } catch (e) {
      console.error("[RecommendationRepositoryService] saveRecommendations failed.", String(e));
      return [];
    }
  }

  public async getRecommendationsByIds(ids: number[]): Promise<Recommendation[]> {
    try {
      if (ids.length === 0) return [];

      const rows = await this.recommendationRepo.find({
        where: { id: In(ids) }
      });

      if (!Array.isArray(rows) || rows.length === 0) return [];

      const byId = new Map<number, Recommendation>();
      for (const r of rows) {
        byId.set(r.id, {
          id: r.id,
          title: r.title,
          rationale: r.rationale,
          priority: r.priority,
          effort: r.effort,
          category: r.category,
          relatedMetrics: Array.isArray(r.relatedMetrics) ? r.relatedMetrics : [],
          suggestedActions: Array.isArray(r.suggestedActions) ? r.suggestedActions : []
        });
      }

      const ordered: Recommendation[] = [];
      for (const id of ids) {
        const rec = byId.get(id);
        if (rec) ordered.push(rec);
      }

      return ordered;
    } catch (e) {
      console.error("[RecommendationRepositoryService] getRecommendationsByIds failed.", String(e));
      return [];
    }
  }

  private sentinelSnapshot(): RecommendationSnapshot {
    return {
      id: -1,
      generatedAtUtc: new Date(0),
      recommendationIds: []
    };
  }
}
