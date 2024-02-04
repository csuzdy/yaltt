import * as fetch from "node-fetch";
import * as S from "@effect/schema/Schema";

import { pipe, Effect, Option, Either, Context } from "effect";

export type FetchError = {
  tag: "fetch_error";
  reason: unknown;
};
export type FetchJsonParseError = {
  tag: "fetch_json_parse_error";
  url: string;
  status: number;
  body: unknown;
  reason: unknown;
};

export type FetchStatusError = {
  tag: "fetch_status_error";
  url: string;
  status: number;
  body: unknown;
};

export interface FetchService {
  fetch: (
    url: URL | fetch.RequestInfo,
    init?: fetch.RequestInit
  ) => Effect.Effect<never, FetchError, fetch.Response>;
}

export const FetchService = Context.Tag<FetchService>();

export const Fetch = {
  get: (url: URL | string, init?: fetch.RequestInit) => {
    return FetchService.pipe(
      Effect.flatMap((fs) => fs.fetch(url, init)),
      Effect.flatMap((resp) =>
        pipe(
          Effect.tryPromise(() => resp.json()),
          Effect.mapError(
            (e): FetchJsonParseError => ({
              tag: "fetch_json_parse_error",
              url: url.toString(),
              status: resp.status,
              body: resp.body,
              reason: e,
            })
          )
        )
      )
    );
  },
  post: (url: URL | string, body?: unknown, init?: fetch.RequestInit) => {
    return FetchService.pipe(
      Effect.flatMap((fs) =>
        fs.fetch(url, {
          ...init,
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            ...init?.headers,
          },
          method: "POST",
        })
      ),
      Effect.flatMap((resp) => {
        const foo = pipe(
          Effect.succeed(resp),
          Effect.bindTo("resp"),
          Effect.bind("respText", ({ resp }) =>
            pipe(
              Effect.tryPromise(() => resp.text()),
              Effect.mapError(
                (err): FetchError => ({
                  tag: "fetch_error",
                  reason: err,
                })
              )
            )
          ),
          Effect.filterOrFail(
            ({ resp }) => resp.status >= 200 && resp.status < 300,
            ({ resp, respText }) =>
              ({
                tag: "fetch_status_error",
                status: resp.status,
                body: respText,
                url: url.toString(),
              } as FetchStatusError)
          ),
          Effect.flatMap(({ respText }) =>
            pipe(
              Effect.try(() => JSON.parse(respText)),
              Effect.mapError(
                (e): FetchJsonParseError => ({
                  tag: "fetch_json_parse_error",
                  url: url.toString(),
                  status: resp.status,
                  body: respText,
                  reason: e,
                })
              )
            )
          )
        );
        return foo;
      })
    );
  },
};
