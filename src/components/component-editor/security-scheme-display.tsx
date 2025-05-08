import { OpenAPIV3 } from "openapi-types";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface SecuritySchemeDisplayProps {
  securityScheme: OpenAPIV3.SecuritySchemeObject;
}

const SecuritySchemeDisplay = ({
  securityScheme,
}: SecuritySchemeDisplayProps) => {
  const renderOAuth2Flows = (
    flows: OpenAPIV3.OAuth2SecurityScheme["flows"]
  ) => {
    return (
      <div className="space-y-4">
        {flows.implicit && (
          <div>
            <div className="text-sm font-medium mb-2">Implicit Flow:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Authorization URL</Badge>
                <span className="text-sm">
                  {flows.implicit.authorizationUrl}
                </span>
              </div>
              {flows.implicit.scopes && (
                <div>
                  <div className="text-sm font-medium mb-1">Scopes:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(flows.implicit.scopes).map(
                      ([scope, description]) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="font-mono"
                        >
                          {scope}: {description}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {flows.password && (
          <div>
            <div className="text-sm font-medium mb-2">Password Flow:</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Token URL</Badge>
                <span className="text-sm">{flows.password.tokenUrl}</span>
              </div>
              {flows.password.scopes && (
                <div>
                  <div className="text-sm font-medium mb-1">Scopes:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(flows.password.scopes).map(
                      ([scope, description]) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="font-mono"
                        >
                          {scope}: {description}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {flows.clientCredentials && (
          <div>
            <div className="text-sm font-medium mb-2">
              Client Credentials Flow:
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Token URL</Badge>
                <span className="text-sm">
                  {flows.clientCredentials.tokenUrl}
                </span>
              </div>
              {flows.clientCredentials.scopes && (
                <div>
                  <div className="text-sm font-medium mb-1">Scopes:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(flows.clientCredentials.scopes).map(
                      ([scope, description]) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="font-mono"
                        >
                          {scope}: {description}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {flows.authorizationCode && (
          <div>
            <div className="text-sm font-medium mb-2">
              Authorization Code Flow:
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Authorization URL</Badge>
                <span className="text-sm">
                  {flows.authorizationCode.authorizationUrl}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Token URL</Badge>
                <span className="text-sm">
                  {flows.authorizationCode.tokenUrl}
                </span>
              </div>
              {flows.authorizationCode.scopes && (
                <div>
                  <div className="text-sm font-medium mb-1">Scopes:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(flows.authorizationCode.scopes).map(
                      ([scope, description]) => (
                        <Badge
                          key={scope}
                          variant="secondary"
                          className="font-mono"
                        >
                          {scope}: {description}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="outline">{securityScheme.type}</Badge>
          {securityScheme.description && (
            <span className="text-sm text-gray-500">
              {securityScheme.description}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {securityScheme.type === "apiKey" && (
            <>
              <div className="flex items-center gap-2">
                <Badge variant="outline">In</Badge>
                <span className="text-sm">{securityScheme.in}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Name</Badge>
                <span className="text-sm font-mono">{securityScheme.name}</span>
              </div>
            </>
          )}
          {securityScheme.type === "http" && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">Scheme</Badge>
              <span className="text-sm">{securityScheme.scheme}</span>
            </div>
          )}
          {securityScheme.type === "oauth2" &&
            securityScheme.flows &&
            renderOAuth2Flows(securityScheme.flows)}
          {securityScheme.type === "openIdConnect" && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">OpenID Connect URL</Badge>
              <a
                href={securityScheme.openIdConnectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {securityScheme.openIdConnectUrl}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySchemeDisplay;
