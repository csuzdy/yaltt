import { useState } from "react";
import { Effect, Either, Option, ReadonlyArray, pipe } from "effect";
import { RequestError, RequestService } from "../../lib/api/request";
import { provideRequestService } from "../../lib/api/requestServiceImpl";
import { fetchToken } from "../../lib/token/fetchToken";
import { match } from "@yaltt/model";
import { Checkbox, Collapse, Form } from "react-daisyui";
import { useRemoteState } from "../../lib/remote/useRemoteState";
import { Launch } from "./Launch";
import {
  extractAgsEndpointClaim,
  extractContentItemsClaim,
  extractNamesRolesServiceClaim,
} from "lti-model";
import { LaunchCollapsible } from "./LaunchCollapsible";

export type TokenFetcherProps = {
  launch: Launch;
};

type TokenFetcherState = {
  scopes: Array<string>;
};

export const TokenFetcher = (props: TokenFetcherProps) => {
  const { launch } = props;

  const token = useRemoteState(fetchToken);

  // todo: get the scopes from the registration
  const scopesSupported =
    props.launch.registration.platform_configuration.scopes_supported;

  const [selectedScopes, setSelectedScopes] = useState(scopesSupported);

  const toggleScope = (scope: string) => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <LaunchCollapsible title="API Tokens">
      <div className="flex flex-col">
        <Form className="shadow bg-base-200 rounded-lg p-4">
          {scopesSupported.map((scope, i) => (
            <Form.Label
              key={scope}
              title={scope}
              className={(i === 0 ? "" : "border-t-2 ") + "border-neutral"}
            >
              <Checkbox
                checked={selectedScopes.includes(scope)}
                onChange={() => {
                  toggleScope(scope);
                }}
              />
            </Form.Label>
          ))}
        </Form>
        <button
          className="btn btn-neutral"
          disabled={token.data._tag === "loading"}
          onClick={() =>
            token.fetch(launch.app.id, launch.registration_id, selectedScopes)
          }
        >
          {token.data._tag === "loading" ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : null}
          Fetch API Token
        </button>
        {pipe(
          token.data,
          match({
            initial: () => <></>,
            loading: () => <></>,
            error: (e) => (
              <div className="max-w-lg w-max">
                <h6 className="mt-2">Error:</h6>
                <pre className="max-w-full">
                  {JSON.stringify(e.error, null, 2)}
                </pre>
              </div>
            ),
            loaded: (t) => {
              return (
                <div className="prose">
                  <div>
                    <h6 className="mt-2">Token</h6>
                    <pre
                      className="my-1 break-all text-pretty"
                      style={{ textWrap: "wrap" } as {}}
                    >
                      {t.value.access_token}
                    </pre>
                  </div>
                  {pipe(
                    [
                      pipe(
                        launch.id_token,
                        extractNamesRolesServiceClaim,
                        Option.map((a) => a.context_memberships_url),
                        Option.map(
                          renderServiceRequest(
                            "Names and Roles",
                            t.value.access_token
                          )
                        )
                      ),
                      pipe(
                        launch.id_token,
                        extractAgsEndpointClaim,
                        Option.flatMapNullable((a) => a.lineitem),
                        Option.map(
                          renderServiceRequest(
                            "AGS Line Item",
                            t.value.access_token
                          )
                        )
                      ),
                      pipe(
                        launch.id_token,
                        extractAgsEndpointClaim,
                        Option.flatMapNullable((a) => a.lineitems),
                        Option.map(
                          renderServiceRequest(
                            "AGS Line Items",
                            t.value.access_token
                          )
                        )
                      ),
                    ],
                    ReadonlyArray.filterMap((a) => a),
                    ReadonlyArray.match({
                      onEmpty: () => (
                        <>
                          Token:{" "}
                          <pre className="whitespace-normal break-all">
                            {t.value.access_token}
                          </pre>
                        </>
                      ),
                      onNonEmpty: (a) => a,
                    })
                  )}
                </div>
              );
            },
          })
        )}
      </div>
    </LaunchCollapsible>
  );
};

const renderServiceRequest = (name: string, token: string) => (url: string) => {
  return (
    <div>
      <h6 className="mt-2">{name}</h6>
      <pre className="my-1">{`curl \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer ${token}' \\
  ${url}`}</pre>
    </div>
  );
};
