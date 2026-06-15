# API Standards — Validation Checklist

- [ ] Protocol(s) named, with choose-between rule if more than one.
- [ ] URL structure example with prefix, version, resource, sub-resource.
- [ ] Status code table covers every verb the project uses.
- [ ] One response envelope, one error envelope — no second shape lurking.
- [ ] Stable error-code list present.
- [ ] Pagination shape decided (cursor vs offset).
- [ ] Versioning rule states what is breaking vs additive, plus deprecation window.
- [ ] Auth mechanism, header, token lifetime, refresh rule.
- [ ] Rate-limit budget + the response headers.
- [ ] Idempotency rule for state-creating writes.
- [ ] Source-of-truth spec path named (OpenAPI / proto / SDL).
- [ ] File size 8-15 KB.
- [ ] No `{{placeholders}}` left.
