import { RecommendationPriority } from "../../Domain/enums/RecommendationPriority";
import { RecommendationEffort } from "../../Domain/enums/RecommendationEffort";
import { RecommendationCategory } from "../../Domain/enums/RecommendationCategory";
import { RecommendationMetric } from "../../Domain/enums/RecommendationMetric";

const priorityValues: string[] = Object.values(RecommendationPriority);
const effortValues: string[] = Object.values(RecommendationEffort);
const categoryValues: string[] = Object.values(RecommendationCategory);
const metricValues: string[] = Object.values(RecommendationMetric);

export const RecommendationResponseSchema = {
  type: "array",
  description: "Security recommendations generated from RecommendationContextDto.",
  minItems: 1,
  maxItems: 12,
  items: {
    type: "object",
    additionalProperties: false,
    required: [
      "id",
      "title",
      "rationale",
      "priority",
      "effort",
      "category",
      "relatedMetrics",
      "suggestedActions"
    ],
    properties: {
      id: { type: "integer", minimum: 1 },
      title: { type: "string", minLength: 8, maxLength: 120 },
      rationale: {
        type: "string",
        minLength: 30,
        maxLength: 900,
        description:
          "Must be grounded in context evidence (latest vs avg7d, series trend, incidentsByCategory7d, score/maturity)."
      },
      priority: { type: "string", enum: priorityValues },
      effort: { type: "string", enum: effortValues },
      category: { type: "string", enum: categoryValues },
      relatedMetrics: {
        type: "array",
        minItems: 0,
        maxItems: 10,
        items: { type: "string", enum: metricValues }
      },
      suggestedActions: {
        type: "array",
        minItems: 1,
        maxItems: 10,
        items: { type: "string", minLength: 6, maxLength: 160 }
      }
    }
  }
} as const;
