import { describe, expect, it } from "vitest";
import { buildOpenApiDocument, buildJsonSchemas } from "../src/openapi/generators";

import { schemaVersion } from "../src/version";

describe("OpenAPI generation", () => {
  it("genera documento con version de schema", () => {
    const doc = buildOpenApiDocument();
    expect(doc.info?.version).toBe(schemaVersion);
    expect(Object.keys(doc.paths ?? {})).toHaveLength(7);
  });

  it("produce json schemas serializables", () => {
    const schemas = buildJsonSchemas();
    expect(schemas).toHaveProperty("CreateMomentRequest");
  });
});
