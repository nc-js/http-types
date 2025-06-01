# Changelog

## v0.1.4 (2025-05-31)
- Fix: Adds HTTP response field `Permissions-Policy` to type union `HttpForbiddenRequestField`.

## v0.1.3 (2025-04-26)
- Add author in LICENSE, fix minor issue in README.md

## v0.1.2 (2025-04-26)
### Features
- Adds the following type aliases for HTTP fields:
  - `HttpForbiddenResponseField`
  - `HttpRequestField`
  - `HttpResponseField`
- Adds the following HTTP fields from the WHATWG Fetch Standard:
  - `Sec-Purpose` field as type alias `HttpFieldSecPurpose`
- Adds the following HTTP fields from the WHATWG HTML Standard:
  - `Cross-Origin-Embedder-Policy-Report-Only` field as type alias  `HttpFieldCrossOriginEmbedderPolicyReportOnly`
  - `Cross-Origin-Opener-Policy-Report-Only` field as type alias `HttpFieldCrossOriginOpenerPolicyReportOnly`

## v0.1.1 (2025-04-26)
- Add small usage example in README.md

## v0.1.0 (2025-04-26)
- Initial release of package
