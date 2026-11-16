# Pick up and go: SC26 Hall Wayfinder

Resume notes for the next working session (human or agent). Read this first, then the code.
Last updated: 2026-11-13, after commit `79edaa0`.

## What this is

A static, phone-first web app that draws walking routes between booths in the SC26 exhibit hall
(McCormick Place, Chicago, Halls F1/F2), plus a hidden party guide ("the Party Egg").
Made for the Abundant Frontier Institute (AFI), Booth 3723, which shares the booth with Omnibond.
People reach it from a QR code and NFC tag on a "Lost? We want to help" sign at Booth 3723, so it opens
with Booth 3723 as the starting point.

- **Live:** https://abundantfrontier.github.io/sc26-wayfinder/ (party page: `/parties.html`)
- **Repo:** https://github.com/abundantfrontier/sc26-wayfinder, `main` branch
- **Deploy:** pushing to `main` publishes through GitHub Pages in about 1 minute. There is no build step.
- **Event dates:** exhibits and parties run Sun Nov 15 to Wed Nov 18, 2026. The content is time-sensitive.

## Ground rules (from the owner)

1. **Mobile first, always.** Design and verify every change at a phone width (390×844) before anything else.
   Use touch targets of about 44 px or more, no sideways scrolling, and a small page size (conference Wi-Fi is slow).
2. **Commit or push only when asked.** The owner reviews (often on the local server), then says "commit and push".
   Pushing to `main` changes the live site immediately.
3. **Keep the Party Egg secret.** Don't mention `parties.html` in the README.
4. **Privacy:** the site is public. Leave out anything about the owner personally (hotel, own registration status, email).
5. Plain vanilla HTML/CSS/JS only. No frameworks, no build, no outside requests on page load
   (links the user taps to Google Maps or Calendar are fine).

## Files

| File | What it is |
|---|---|
| `index.html` | The wayfinder page: markup, all CSS (inline `<style>`), AFI logo as a base64 data URI, Open Graph tags, inline Chicago clock script. Loads `router.js` then `app.js`. |
| `app.js` | Wayfinder UI. Booth data is **embedded** as `BOOTH_ROWS` (rows of `[n, name, x0, y0, x1, y1]`), so there is no fetch. |
| `router.js` | Routing engine (A* on a grid). Works in the browser (`window.Wayfinder`) and Node (`module.exports`). |
| `booths.json` | **Source** booth data, `{booths:[{n,name,x0,y0,x1,y1,cx,cy}]}`, 600 booths. The page does NOT load it; see "Booth data" below. |
| `parties.html` | The Party Egg page. Self-contained: CSS, the party cards as static HTML, and an inline script that adds the buttons and the clock. |
| `party-egg.webp` | Still disco egg (240 px, 15 KB). Used as the home-page link icon and as the reduced-motion image. |
| `party-egg-dance.webp` | Animated dancing egg (240 px, 9 frames at 140 ms, 110 KB). Header of the party page. |
| `og-logo.png` | AFI logo for link previews and the README. |
| `docs/` | README screenshots (not loaded by the page). |
| `README.md` | Public project README. |

Source art: the owner's originals were `~/Downloads/Disco Egg Party Celebration.png` and
`~/Desktop/Disco Egg Dance Frames.gif`. They were converted with `sips`/`cwebp`/Pillow to the small WebP files above.

## How the wayfinder works

### Coordinates
Booth rectangles come from the official SC26 floor-plan DWG (parsed with LibreDWG). Units are **inches**,
with y increasing northward (CAD convention). The SVG flips y (`screenY = -y`). Feet = units / 12.

### Routing (`router.js`, `createRouter(booths)`)
1. A 30-inch grid over the whole sheet: `X0=3600, Y0=900, CS=30, NX=345, NY=425`. A cell is blocked if it falls under any booth rectangle.
2. `entrancesFor(booth)`: up to 20 candidate points in the aisle just outside the booth (S, N, W, E sides at offsets 60/120/180,
   then quarter points). If none work, it searches outward from the booth for the nearest free cell.
3. `findRoute(from, to)`: tries entrance pairs in order of their index sum. For each pair it runs
   4-directional A* (Manhattan heuristic, binary heap), then `simplify` (merge straight runs, then shortcut
   wherever there is a clear line of sight, sampled every 10 units). It prefers a route whose booth-centre connectors don't cross a third booth.
   It returns `{points, lengthFt, fromEntrance, toEntrance, aislePoints}`.
4. `makeDirections(points, from, to, booths)`: landmark directions. It drops the booth-centre↔entrance hops, folds legs under 25 ft
   into a neighbour (re-merging same-direction legs), and caps the result at 3 legs. A short doubling-back at the end is dropped, and "Arrive at …" is added.
   Each leg names the biggest booth **ahead** along it ("head toward Google Cloud"). Turns name the booth at the corner ("At nVent, turn right").
   Step 1 also says the map direction ("down the map"). Left/right turns come from the clockwise order of the leg directions.
   **Never use N/S/E/W words:** see "Compass and GPS" below.

This is a JavaScript port of an earlier `astar2.py`, which is not in this repo.

### UI (`app.js`)
- `init()` → `loadBooths()` (embedded rows) → builds `byNum` → two comboboxes (`buildPicker`) → `createRouter` → `buildMap()`.
- URL parameters `?from=<booth>&to=<booth>` preload a route (the share links use them). The start defaults to booth `3723`.
- `resolveBooth(text)` accepts a booth number, "Booth 123", or a name (an exact name match first, then a partial one; the largest booth wins).
  25 names have more than one booth (for example dNOC, DDN, Vertiv, Weka), so share links always use booth numbers.
- The map is one SVG: booth rects, number labels, landmark name labels (sized by booth area: `nm1/nm2/nm3`), a route layer, callouts.
  Zoom bands (`data-band="hall|mid|near"`) hide label tiers. Pan, pinch, wheel and double-tap use pointer events.
- `computeRoute()` fills the result card (distance, walking time at 150 ft/min, directions), draws the route, fits the view,
  and updates the URL with `history.replaceState`.
- Share: `navigator.share` → clipboard → prompt.

### Page order (`index.html` `<main>`)
Chicago clock pill → intro ("Lost in the exhibit hall?…") → Party Egg hint (egg icon links to `parties.html`) →
route form card → **map card** → result and directions card (hidden until a route exists) → Megathon panel. Then the footer with an
"How this app was created" toggle.

### Booth data: keep the two copies in sync
`booths.json` is the source of truth, but the page only uses `BOOTH_ROWS` in `app.js`.
**If you edit `booths.json`, regenerate `BOOTH_ROWS`**, for example:

```bash
python3 - <<'EOF'
import json, re
d = json.load(open('booths.json'))['booths']
rows = json.dumps([[b['n'], b['name'], b['x0'], b['y0'], b['x1'], b['y1']] for b in d], ensure_ascii=False, separators=(',', ':'))
s = open('app.js').read()
s = re.sub(r'var BOOTH_ROWS = \[\[.*?\]\];', lambda m: 'var BOOTH_ROWS = ' + rows + ';', s, count=1, flags=re.S)
open('app.js', 'w').write(s)
EOF
```

Then check the copies match (this should print `True`):

```bash
python3 -c "import json,re;d=json.load(open('booths.json'))['booths'];r=json.loads(re.search(r'var BOOTH_ROWS = (\[\[.*?\]\]);',open('app.js').read()).group(1));print([[b['n'],b['name'],b['x0'],b['y0'],b['x1'],b['y1']] for b in d]==r)"
```

## How the Party Egg page works (`parties.html`)

- **Look:** a "disco night" theme. CSS variables in `:root` (`--night`, `--magenta`, `--cyan`, `--gold`, `--violet`…), radial glows,
  gradient title, twinkling sparkles. Under `prefers-reduced-motion` the `<picture>` shows the still egg and the sparkles stop.
- **"Remember to always party responsibly"**: a gold banner near the top and again in the footer, also appended to every share
  message and calendar description. The owner asked for it; keep it.
- **Structure:** a `.day` section per day (`#sun #mon #tue #wed`, with a pinned day-jump bar), containing one `article.party` card per event.
- **Each card carries its data as attributes**, which the inline script reads:
  ```html
  <article class="party" id="beowulf"
           data-start="2026-11-16T21:00" data-end="2026-11-17T00:00"
           data-loc="WhirlyBall Chicago, 1825 W Webster Ave, Chicago"
           data-dir="WhirlyBall Chicago, 1825 W Webster Ave, Chicago">
    <h3>…title…</h3><p class="time">…</p>
    <dl><dt>Where</dt><dd>…</dd><dt>Host(s)</dt><dd>…</dd><dt>Get in</dt><dd>…</dd></dl>
    <span class="tag">…</span>
  </article>
  ```
  - `data-start`/`data-end` are **Chicago local** times. The script converts them to UTC with a fixed **UTC−6** (CST; SC26 week is after DST ends).
    For an event past midnight, use the next day's date in `data-end`.
  - `data-dir`: a Google Maps destination query, or `booth:<n>` for in-hall events (the button becomes "Walk there" and links to
    `index.html?from=3723&to=<n>`). Leave it out when the venue is unknown (the button shows a greyed-out "Venue TBA").
  - The `<dt>` labels must start with "Where", "Host" and "Get in"; the share and calendar text read them by name.
- **The script adds a row of buttons to each card:** Directions · Calendar (opens a row with "Apple / Outlook" `.ics` as a
  `data:` URI and "Google Calendar") · Share (`navigator.share`, else copy to clipboard). Share links point to `parties.html#<id>`,
  and `.party:target` highlights the card. There's also a "Share the party list" button at the top.
- **To add a party:** copy a card into the right day section, give it a unique `id` and set the data attributes. The buttons appear by themselves.
- **Where the content came from:** the party list was pasted in by the owner. When it was published: "near your hotel" was removed, Cisco's
  "Registration confirmed by Cisco email invite" became "By Cisco email invitation" plus an Invite-only tag, and entries without a URL
  were left as plain text (no links were made up).

## Chicago clock (both pages)
A `<p class="clock" id="chiClock" hidden>` element plus a small inline script just before `</body>`. It uses
`Intl.DateTimeFormat` with `timeZone:'America/Chicago'` and updates on the minute boundary. It stays hidden if Intl is missing.

## Run and verify

```bash
# local server (open from a phone on the same Wi-Fi at http://<mac-lan-ip>:8026/)
python3 -m http.server 8026 --bind 0.0.0.0

# routing smoke test: every booth reachable from 3723, plus the reference route
node -e "
const W=require('./router.js'),B=require('./booths.json').booths,r=W.createRouter(B);
const h=B.find(b=>b.n==='3723');const f=B.filter(b=>b!==h&&!r.findRoute(h,b)).map(b=>b.n);
console.log('unreachable:',f);console.log('3723->838 ft',r.findRoute(h,B.find(b=>b.n==='838')).lengthFt.toFixed(1));"
# expected: unreachable: []   3723->838 ft 615.8   (the README quotes ≈616 ft)
```

**Phone-width screenshots:** headless Chrome won't make a window narrower than about 500 px (`innerWidth` ends up 500 even with
`--window-size=390,…`), so a plain screenshot gets cropped and *looks* cut off. Instead, put the page in a 390 px-wide `<iframe>`
inside a wrapper page in the scratchpad, screenshot the wrapper with `--headless=old --allow-file-access-from-files`, and check that
`document.documentElement.scrollWidth <= 390` inside the frame.

**Before pushing:** run `node --check app.js router.js`, the routing smoke test, a phone-width look at both pages,
and (if booths changed) the `BOOTH_ROWS` sync check.

## Commits
The style used so far is a short imperative subject plus a body explaining why. The session's attribution trailer goes at the end
(the harness supplies it). After pushing, confirm the live page has the change, for example
`curl -s 'https://abundantfrontier.github.io/sc26-wayfinder/parties.html?v=1' | grep -c <marker>`.

## Compass and GPS (tested on site, Nov 16 2026 — rejected)
The owner took iPhone Compass app readings in the aisle running Omnibond (3723) → Google Cloud (3418) → Microsoft (3411), facing the
**same** direction (down the map) both times. They read 206° at 3723 and 22° at 3411, about 180° apart within roughly 100 ft. The hall's steel makes phone
magnetometers useless. GPS showed the same wrong position (the North Building) for 18 minutes. So the app has no compass or GPS
features, and the directions use landmarks instead of compass words. A gyroscope-based arrow (aim once at a named landmark, then track turns) was
considered and set aside by the owner. OpenStreetMap shows the West Building (Hall F) aligned to true north within about 1°.

## Known issues / backlog (not done)
- **Leg folding in `makeDirections`** adds a short leg's distance to its neighbour's heading, so the text can be slightly off
  (the map line is exact).
- **Swap** only re-routes when both fields are filled; `fromBooth` and `toBooth` can briefly be stale.
- **Tests are not in this repo.** The README describes Node and browser test suites, but they live in AFI's main source, not here
  (an `app.js` comment once pointed at `tests/`). Consider adding the smoke test above as `tests/route.test.js`.
- The booth data includes entries that aren't exhibitors ("Reserved" 6420, "Passport to Prizes" 156, SCC1–10 student cluster spots).
- The README's "~115 KB total" counts `index.html` + `app.js` + `router.js` only; it predates the clock and egg (now about 117 KB plus the 15 KB egg icon).
- **Not yet checked on real phones:** whether the `.ics` download goes into the iOS and Android calendar apps, and the share sheets on the live https site.
- Possible extras the owner hasn't asked for: highlight "happening now" or "next up" on the party page using the clock;
  hide parties that have ended after Nov 18.
