# ReachN

Employee brand platform: NFC business card, digital contact card, wallet pass, email signatures, virtual background, cover banner, and company campaign sharing.

`index.html` is a single file holding the marketing website and the product prototype, in English and Arabic. Open it in a browser; no server is needed. Add `?lang=ar` to open in Arabic.

## Editing

Edit the files in `src/`, then run `python3 build.py`. Use `python3 build.py --missing` to list English strings that have no Arabic entry in `src/ar.json`.

| File | Holds |
|---|---|
| `src/page.html` | All markup, in English |
| `src/ar.json` | Arabic text, keyed by the English string |
| `src/app.js` | Routing, language switch, prototype behaviour |
| `src/styles.css` | Styles, both themes, right-to-left rules |
| `artifact.html` | Same page as a fragment, for Claude artifacts |

## Routes

| Route | Page |
|---|---|
| `#/` | Website home |
| `#/features`, `#/business`, `#/enterprise`, `#/pricing`, `#/faq`, `#/demo` | Website pages |
| `#/app/login` | Login |
| `#/app/admin/employees` (also `brand`, `campaigns`, `linkedin`, `leads`, `analytics`, `integrations`, `orders`, `settings`) | HR super admin |
| `#/app/me/profile` (also `kit`, `campaigns`, `contacts`) | Employee portal |
| `#/app/card` | Public contact card |

All data is sample data. Pricing on the site is a draft.
