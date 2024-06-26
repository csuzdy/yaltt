import * as S from "@effect/schema/Schema";
import { ActivityProgress } from "./ActivityProgress";
import { GradingProgress } from "./GradingProgress";
import { UserId } from "../user/UserId";
import { Submission } from "./Submission";

export const Score = S.struct({
  timestamp: S.DateFromString,
  scoreGiven: S.optional(S.number),
  scoreMaximum: S.optional(S.number),
  comment: S.optional(S.string),
  activityProgress: S.enums(ActivityProgress),
  gradingProgress: S.enums(GradingProgress),
  userId: UserId,
  scoringUserId: S.optional(UserId),
  submission: S.optional(Submission),
});

export type Score = S.Schema.To<typeof Score>;
