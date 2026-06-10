---
'@giphy/react-components': patch
---

Replace `react-use` with internal hook implementations. This removes the unmaintained `react-use` dependency and with it the vulnerable transitive dependency `js-cookie@2.2.1` (cookie-attribute injection via per-instance prototype hijack in `assign()`), along with a dozen other unused transitive dependencies. No API changes.
