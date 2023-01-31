import * as S from "@fp-ts/schema/Schema";
import { CustomParameters } from "./CustomParameters";
import { Url } from "./Url";

const LtiMessageType = S.string;

export const LtiMessage = S.struct({
  type: LtiMessageType,
  target_link_uri: Url,
  // TODO: localization
  label: S.string,
  custom_parameters: CustomParameters,
});