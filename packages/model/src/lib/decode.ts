import { Effect, pipe } from "effect";
import * as S from "@effect/schema/Schema";
import { ParseError } from "@effect/schema/ParseResult";

export interface DecodeError {
  _tag: "decode_error";
  actual: unknown;
  error: ParseError;
}

export const decode = <A>(schema: S.Schema<A, unknown>) =>
  Effect.flatMap(
    (data: unknown): Effect.Effect<A, DecodeError, never> =>
      pipe(
        data,
        S.decode(schema),
        Effect.mapError(
          (error): DecodeError => ({
            _tag: "decode_error",
            error,
            actual: data,
          })
        )
      )
  );

export const decodeOption =
  <A>(schema: S.Schema<A, unknown>) =>
  (data: unknown) =>
    pipe(data, S.decodeOption(schema));

export const decodeEither =
  <A>(schema: S.Schema<A, unknown>) =>
  (data: unknown) =>
    pipe(
      data,
      S.decodeEither(schema),
      Effect.mapError(
        (error): DecodeError => ({
          _tag: "decode_error",
          error,
          actual: data,
        })
      )
    );
