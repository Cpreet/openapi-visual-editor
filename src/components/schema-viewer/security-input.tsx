import { OpenAPIV3 } from "openapi-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { useMemo } from "react";

interface SecurityInputProps {
  scheme: string;
  securityScheme: OpenAPIV3.SecuritySchemeObject;
  securityCredentials: Record<string, string>;
  onSecurityCredentialChange: (scheme: string, value: string) => void;
}

function isOAuth2SecurityScheme(
  obj: OpenAPIV3.SecuritySchemeObject
): obj is OpenAPIV3.OAuth2SecurityScheme {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    obj.type === 'oauth2' &&
    'flows' in obj &&
    typeof (obj as OpenAPIV3.OAuth2SecurityScheme).flows === 'object'
  );
}

export const SecurityInput = ({
  scheme,
  securityScheme,
  securityCredentials,
  onSecurityCredentialChange,
}: SecurityInputProps) => {

  /* Declarations for OAuth2 flows */
  const oauth2Scheme = useMemo(() => {
    const seqObj = Object.fromEntries(Object
      .entries(securityScheme)
      .filter(([, seqObj]) => isOAuth2SecurityScheme(seqObj))
    )
    return seqObj
  }, [securityScheme]);
  const flows = oauth2Scheme.flows || {};

  const hasImplicitFlow = !!flows.implicit?.authorizationUrl;
  const hasPasswordFlow = !!flows.password?.tokenUrl;
  const hasClientCredentialsFlow = !!flows.clientCredentials?.tokenUrl;
  const hasAuthorizationCodeFlow = !!flows.authorizationCode?.authorizationUrl;
  switch (securityScheme.type) {
    case "http":
      if (securityScheme.scheme === "bearer") {
        return (
          <div className="flex items-center gap-2">
            <Input
              type="password"
              value={securityCredentials[scheme] || ""}
              onChange={(e) =>
                onSecurityCredentialChange(scheme, e.target.value)
              }
              placeholder="Enter bearer token"
              className="flex-1"
            />
          </div>
        );
      } else if (securityScheme.scheme === "basic") {
        return (
          <div className="flex items-center gap-2">
            <Input
              value={securityCredentials[scheme]?.split(":")[0] || ""}
              onChange={(e) => {
                const password =
                  securityCredentials[scheme]?.split(":")[1] || "";
                onSecurityCredentialChange(
                  scheme,
                  `${e.target.value}:${password}`
                );
              }}
              placeholder="Username"
              className="flex-1"
            />
            <Input
              type="password"
              value={securityCredentials[scheme]?.split(":")[1] || ""}
              onChange={(e) => {
                const username =
                  securityCredentials[scheme]?.split(":")[0] || "";
                onSecurityCredentialChange(
                  scheme,
                  `${username}:${e.target.value}`
                );
              }}
              placeholder="Password"
              className="flex-1"
            />
          </div>
        );
      }
      break;
    case "apiKey":
      return (
        <div className="flex items-center gap-2">
          <Input
            type="password"
            value={securityCredentials[scheme] || ""}
            onChange={(e) => onSecurityCredentialChange(scheme, e.target.value)}
            placeholder={`Enter ${securityScheme.name || "API key"}`}
            className="flex-1"
          />
        </div>
      );
    case "oauth2":
      return (
        <div className="space-y-4">
          {hasImplicitFlow && (
            <div className="space-y-2">
              <Label>Implicit Flow</Label>
              <Button
                className="w-full"
                onClick={() =>
                  window.open(flows.implicit?.authorizationUrl, "_blank")
                }
              >
                Connect with OAuth2
              </Button>
            </div>
          )}

          {hasPasswordFlow && (
            <div className="space-y-2">
              <Label>Password Flow</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Username"
                  className="mt-1"
                  onChange={(e) => {
                    const password =
                      securityCredentials[scheme]?.split(":")[1] || "";
                    onSecurityCredentialChange(
                      scheme,
                      `${e.target.value}:${password}`
                    );
                  }}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="mt-1"
                  onChange={(e) => {
                    const username =
                      securityCredentials[scheme]?.split(":")[0] || "";
                    onSecurityCredentialChange(
                      scheme,
                      `${username}:${e.target.value}`
                    );
                  }}
                />
                <Button className="w-full">
                  <LogIn className="size-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
          )}

          {hasClientCredentialsFlow && (
            <div className="space-y-2">
              <Label>Client Credentials Flow</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Client ID"
                  className="mt-1"
                  onChange={(e) => {
                    const secret =
                      securityCredentials[scheme]?.split(":")[1] || "";
                    onSecurityCredentialChange(
                      scheme,
                      `${e.target.value}:${secret}`
                    );
                  }}
                />
                <Input
                  type="password"
                  placeholder="Client Secret"
                  className="mt-1"
                  onChange={(e) => {
                    const id = securityCredentials[scheme]?.split(":")[0] || "";
                    onSecurityCredentialChange(
                      scheme,
                      `${id}:${e.target.value}`
                    );
                  }}
                />
                <Button className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Get Token
                </Button>
              </div>
            </div>
          )}

          {hasAuthorizationCodeFlow && (
            <div className="space-y-2">
              <Label>Authorization Code Flow</Label>
              <Button
                className="w-full"
                onClick={() =>
                  window.open(
                    flows.authorizationCode?.authorizationUrl,
                    "_blank"
                  )
                }
              >
                Connect with OAuth2
              </Button>
            </div>
          )}

          {securityCredentials[scheme] && (
            <div className="space-y-2">
              <Label>Current Token</Label>
              <Input
                type="password"
                value={securityCredentials[scheme]}
                onChange={(e) =>
                  onSecurityCredentialChange(scheme, e.target.value)
                }
                placeholder="OAuth2 token"
                className="mt-1"
              />
            </div>
          )}
        </div>
      );
    case "openIdConnect":
      return (
        <div className="flex items-center gap-2">
          <Input
            type="password"
            value={securityCredentials[scheme] || ""}
            onChange={(e) => onSecurityCredentialChange(scheme, e.target.value)}
            placeholder="Enter OpenID Connect token"
            className="flex-1"
          />
        </div>
      );
  }
  return null;
}
