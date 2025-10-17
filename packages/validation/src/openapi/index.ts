import { buildOpenApiDocument } from "./generators";

const document = buildOpenApiDocument();
process.stdout.write(JSON.stringify(document, null, 2));
