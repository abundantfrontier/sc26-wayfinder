/*
 * SC26 Wayfinder router — a faithful JavaScript port of astar2.py.
 *
 * Same scheme as the Python original: a 30-unit (30-inch) grid over the CAD
 * floor plan, booth rectangles as obstacles, A* search (4-directional,
 * Manhattan heuristic), collinear merge of the grid path, then line-of-sight
 * simplification sampled every <=10 units against the booth rectangles.
 * The only change from the Python is the grid bounds: astar2.py covered the
 * 3723<->838 crop (origin 4200,7600 / 240x140); this grid covers the full
 * sheet so every exhibitor — main halls F1/F2 and the exhibitor suites —
 * is reachable.
 *
 * Works in the browser (window.Wayfinder) and in Node (module.exports).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Wayfinder = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var X0 = 3600, Y0 = 900, CS = 30, NX = 345, NY = 425;

  function createRouter(booths) {
    var rects = booths.map(function (b) { return [b.x0, b.y0, b.x1, b.y1]; });

    // --- blocked grid, marked exactly as in astar2.py ---
    var blocked = new Uint8Array(NX * NY);
    rects.forEach(function (r) {
      var gx0 = Math.max(0, Math.floor((r[0] - X0) / CS));
      var gx1 = Math.min(NX - 1, Math.floor((r[2] - X0) / CS));
      var gy0 = Math.max(0, Math.floor((r[1] - Y0) / CS));
      var gy1 = Math.min(NY - 1, Math.floor((r[3] - Y0) / CS));
      for (var gy = gy0; gy <= gy1; gy++)
        for (var gx = gx0; gx <= gx1; gx++) blocked[gy * NX + gx] = 1;
    });

    function cellOf(x, y) {
      return [Math.floor((x - X0) / CS), Math.floor((y - Y0) / CS)];
    }
    function centerOf(gx, gy) {
      return [X0 + gx * CS + (CS >> 1), Y0 + gy * CS + (CS >> 1)];
    }
    function cellBlocked(gx, gy) {
      return gx < 0 || gy < 0 || gx >= NX || gy >= NY || blocked[gy * NX + gx] === 1;
    }
    function pointInAnyRect(x, y) {
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r[0] < x && x < r[2] && r[1] < y && y < r[3]) return true;
      }
      return false;
    }

    // --- A* over the grid (binary heap; ties broken by gx, then gy,
    //     mirroring Python heapq's (f, cell) tuple ordering) ---
    function astar(s, t) {
      var N = NX * NY;
      var cost = new Float64Array(N).fill(Infinity);
      var came = new Int32Array(N).fill(-1);
      var si = s[1] * NX + s[0], ti = t[1] * NX + t[0];
      cost[si] = 0;
      var heap = [[0, s[0], s[1]]];
      function less(a, b) {
        return a[0] < b[0] || (a[0] === b[0] && (a[1] < b[1] || (a[1] === b[1] && a[2] < b[2])));
      }
      function push(it) {
        heap.push(it);
        var i = heap.length - 1;
        while (i > 0) {
          var p = (i - 1) >> 1;
          if (less(heap[i], heap[p])) { var tmp = heap[i]; heap[i] = heap[p]; heap[p] = tmp; i = p; }
          else break;
        }
      }
      function pop() {
        var top = heap[0], last = heap.pop();
        if (heap.length) {
          heap[0] = last;
          var i = 0;
          for (;;) {
            var l = 2 * i + 1, r = l + 1, m = i;
            if (l < heap.length && less(heap[l], heap[m])) m = l;
            if (r < heap.length && less(heap[r], heap[m])) m = r;
            if (m === i) break;
            var tmp = heap[i]; heap[i] = heap[m]; heap[m] = tmp; i = m;
          }
        }
        return top;
      }
      function h(gx, gy) { return Math.abs(gx - t[0]) + Math.abs(gy - t[1]); }
      var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      var found = false;
      while (heap.length) {
        var cur = pop();
        var cgx = cur[1], cgy = cur[2], ci = cgy * NX + cgx;
        if (cgx === t[0] && cgy === t[1]) { found = true; break; }
        if (cur[0] > cost[ci] + h(cgx, cgy)) continue; // stale heap entry
        for (var d = 0; d < 4; d++) {
          var ngx = cgx + DIRS[d][0], ngy = cgy + DIRS[d][1];
          if (cellBlocked(ngx, ngy)) continue;
          var ni = ngy * NX + ngx, nc = cost[ci] + 1;
          if (nc < cost[ni]) {
            cost[ni] = nc; came[ni] = ci;
            push([nc + h(ngx, ngy), ngx, ngy]);
          }
        }
      }
      if (!found && cost[ti] === Infinity) return null;
      var path = [], ci2 = ti;
      while (ci2 !== -1) {
        path.push(centerOf(ci2 % NX, Math.floor(ci2 / NX)));
        if (ci2 === si) break;
        ci2 = came[ci2];
      }
      return path.reverse();
    }

    // --- line-of-sight check, ported from astar2.py clear() ---
    function segmentClear(p, q) {
      var steps = Math.floor(Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])) / 10) + 1;
      // bbox pre-filter (semantics identical; just faster)
      var minx = Math.min(p[0], q[0]), maxx = Math.max(p[0], q[0]);
      var miny = Math.min(p[1], q[1]), maxy = Math.max(p[1], q[1]);
      var cand = [];
      for (var i = 0; i < rects.length; i++) {
        var r = rects[i];
        if (r[2] >= minx && r[0] <= maxx && r[3] >= miny && r[1] <= maxy) cand.push(r);
      }
      for (var s = 0; s <= steps; s++) {
        var x = p[0] + (q[0] - p[0]) * s / steps;
        var y = p[1] + (q[1] - p[1]) * s / steps;
        for (var j = 0; j < cand.length; j++) {
          var rr = cand[j];
          if (rr[0] < x && x < rr[2] && rr[1] < y && y < rr[3]) return false;
        }
      }
      return true;
    }

    // --- collinear merge + LOS simplification, ported from astar2.py ---
    function simplify(path) {
      if (path.length <= 2) return path.slice();
      var merged = [path[0]];
      for (var i = 1; i < path.length - 1; i++) {
        var a = path[i - 1], b = path[i], c = path[i + 1];
        if ((b[0] - a[0]) * (c[1] - b[1]) !== (b[1] - a[1]) * (c[0] - b[0])) merged.push(b);
      }
      merged.push(path[path.length - 1]);
      var simp = [merged[0]], k = 0;
      while (k < merged.length - 1) {
        var j = merged.length - 1;
        while (j > k + 1 && !segmentClear(merged[k], merged[j])) j--;
        simp.push(merged[j]); k = j;
      }
      return simp;
    }

    // --- entrance points: spots in the aisle just outside a booth.
    //     astar2.py used the point 60 units south of each booth's centre-x;
    //     here we try south, north, west, east (midpoints at several
    //     offsets, then quarter points), keeping points that sit in a free
    //     grid cell and outside every booth. BFS fallback guarantees one. ---
    function entrancesFor(booth) {
      var out = [], seenCells = {};
      function tryPoint(x, y) {
        if (out.length >= 20) return;
        if (pointInAnyRect(x, y)) return;
        var c = cellOf(x, y);
        if (cellBlocked(c[0], c[1])) return;
        var key = c[1] * NX + c[0];
        if (seenCells[key]) return;
        seenCells[key] = 1;
        out.push([x, y]);
      }
      var cx = booth.cx, cy = booth.cy;
      var sides = [
        { bx: cx, by: booth.y0, dx: 0, dy: -1 },  // south
        { bx: cx, by: booth.y1, dx: 0, dy: 1 },   // north
        { bx: booth.x0, by: cy, dx: -1, dy: 0 },  // west
        { bx: booth.x1, by: cy, dx: 1, dy: 0 }    // east
      ];
      var offsets = [60, 120, 180];
      var si, oi, qi;
      for (si = 0; si < 4; si++)
        for (oi = 0; oi < offsets.length; oi++)
          tryPoint(sides[si].bx + sides[si].dx * offsets[oi], sides[si].by + sides[si].dy * offsets[oi]);
      // quarter points along each edge at offset 60
      var w = booth.x1 - booth.x0, hh = booth.y1 - booth.y0;
      var quarterPts = [
        [booth.x0 + w / 4, booth.y0 - 60], [booth.x0 + 3 * w / 4, booth.y0 - 60],
        [booth.x0 + w / 4, booth.y1 + 60], [booth.x0 + 3 * w / 4, booth.y1 + 60],
        [booth.x0 - 60, booth.y0 + hh / 4], [booth.x0 - 60, booth.y0 + 3 * hh / 4],
        [booth.x1 + 60, booth.y0 + hh / 4], [booth.x1 + 60, booth.y0 + 3 * hh / 4]
      ];
      for (qi = 0; qi < quarterPts.length; qi++) tryPoint(quarterPts[qi][0], quarterPts[qi][1]);
      if (!out.length) {
        // BFS outward from the booth's own cells to the nearest free cell.
        var visited = new Uint8Array(NX * NY), queue = [];
        var gx0 = Math.max(0, Math.floor((booth.x0 - X0) / CS)), gx1 = Math.min(NX - 1, Math.floor((booth.x1 - X0) / CS));
        var gy0 = Math.max(0, Math.floor((booth.y0 - Y0) / CS)), gy1 = Math.min(NY - 1, Math.floor((booth.y1 - Y0) / CS));
        for (var gy = gy0; gy <= gy1; gy++)
          for (var gx = gx0; gx <= gx1; gx++) { visited[gy * NX + gx] = 1; queue.push([gx, gy]); }
        var head = 0;
        while (head < queue.length && !out.length) {
          var cur = queue[head++];
          var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
          for (var d = 0; d < 4; d++) {
            var nx = cur[0] + DIRS[d][0], ny = cur[1] + DIRS[d][1];
            if (nx < 0 || ny < 0 || nx >= NX || ny >= NY) continue;
            var ni = ny * NX + nx;
            if (visited[ni]) continue;
            visited[ni] = 1;
            if (!blocked[ni]) { out.push(centerOf(nx, ny)); break; }
            queue.push([nx, ny]);
          }
        }
      }
      return out;
    }

    function pathLengthFt(points) {
      var units = 0;
      for (var i = 1; i < points.length; i++) {
        var dx = points[i][0] - points[i - 1][0], dy = points[i][1] - points[i - 1][1];
        units += Math.sqrt(dx * dx + dy * dy);
      }
      return units / 12;
    }

    // does segment p->q pass through any booth rect other than the ignored ones?
    function segCrosses(p, q, ignoreA, ignoreB) {
      var steps = Math.floor(Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1])) / 5) + 1;
      var minx = Math.min(p[0], q[0]), maxx = Math.max(p[0], q[0]);
      var miny = Math.min(p[1], q[1]), maxy = Math.max(p[1], q[1]);
      for (var s = 0; s <= steps; s++) {
        var x = p[0] + (q[0] - p[0]) * s / steps;
        var y = p[1] + (q[1] - p[1]) * s / steps;
        for (var i = 0; i < rects.length; i++) {
          if (i === ignoreA || i === ignoreB) continue;
          var r = rects[i];
          if (r[2] < minx || r[0] > maxx || r[3] < miny || r[1] > maxy) continue;
          if (r[0] < x && x < r[2] && r[1] < y && y < r[3]) return true;
        }
      }
      return false;
    }

    function findRoute(from, to) {
      if (from.n === to.n && from.x0 === to.x0 && from.y0 === to.y0) {
        return { points: [[from.cx, from.cy]], lengthFt: 0, fromEntrance: null, toEntrance: null };
      }
      var fi = booths.indexOf(from), ti = booths.indexOf(to);
      var fe = entrancesFor(from), te = entrancesFor(to);
      if (!fe.length || !te.length) return null;
      var pairs = [];
      for (var a = 0; a < fe.length; a++)
        for (var b = 0; b < te.length; b++) pairs.push([a + b, a, b]);
      pairs.sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
      var firstFound = null;
      for (var pi = 0; pi < pairs.length; pi++) {
        var f = fe[pairs[pi][1]], t = te[pairs[pi][2]];
        var gridPath = astar(cellOf(f[0], f[1]), cellOf(t[0], t[1]));
        if (gridPath) {
          var simp = simplify(gridPath);
          // Draw through the exact entrance points (on each booth's own
          // centreline), not just the entrance cells' centres: the short
          // centre->entrance connectors then stay inside the booth's own
          // slab instead of clipping a neighbour's corner.
          var full = [[from.cx, from.cy], f].concat(simp, [t, [to.cx, to.cy]]);
          var pts = [full[0]];
          for (var i = 1; i < full.length; i++)
            if (full[i][0] !== pts[pts.length - 1][0] || full[i][1] !== pts[pts.length - 1][1]) pts.push(full[i]);
          var route = { points: pts, lengthFt: pathLengthFt(pts), fromEntrance: f, toEntrance: t, aislePoints: simp };
          if (!firstFound) firstFound = route;
          // prefer a route whose two connectors cross no third-party booth
          if (!segCrosses(pts[0], pts[1], fi, ti) && !segCrosses(pts[pts.length - 2], pts[pts.length - 1], fi, ti)) {
            return route;
          }
        }
      }
      return firstFound;
    }

    return {
      findRoute: findRoute,
      entrancesFor: entrancesFor,
      segmentClear: segmentClear,
      pathLengthFt: pathLengthFt,
      grid: { X0: X0, Y0: Y0, CS: CS, NX: NX, NY: NY }
    };
  }

  // --- plain-language walking directions from a route's major turns ---
  // Phone compasses are unreliable inside the hall (readings taken on site
  // flipped ~180° within 100 ft), so the text names booths people can see
  // ("head toward Microsoft") plus the direction on the map, never N/S/E/W.
  var ORDER = ['north', 'east', 'south', 'west'];          // clockwise
  var ON_MAP = { north: 'up the map', south: 'down the map', east: 'to the right on the map', west: 'to the left on the map' };
  function dirName(dx, dy) {
    if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'east' : 'west';
    return dy > 0 ? 'north' : 'south';
  }
  function rectDist(b, x, y) {
    var ddx = Math.max(b.x0 - x, 0, x - b.x1), ddy = Math.max(b.y0 - y, 0, y - b.y1);
    return Math.sqrt(ddx * ddx + ddy * ddy);
  }
  function isLandmarkName(b) { return b.name && !/^reserved$/i.test(b.name.trim()); }
  function boothArea(b) { return (b.x1 - b.x0) * (b.y1 - b.y0); }

  // Biggest named booth beside the leg, favouring ones near its far end
  // (that's what you walk toward). Looks 20 ft past the end, too.
  function landmarkAlong(leg, booths, skip) {
    var len = Math.sqrt(leg.dx * leg.dx + leg.dy * leg.dy);
    if (!booths || len < 1) return null;
    var ux = leg.dx / len, uy = leg.dy / len, reach = len + 240;
    var best = null, bestScore = 0;
    for (var i = 0; i < booths.length; i++) {
      var b = booths[i];
      if (!isLandmarkName(b) || skip(b)) continue;
      // quick reject: booth far from the leg's bounding box
      var ex = leg.sx + ux * reach, ey = leg.sy + uy * reach;
      if (b.x1 < Math.min(leg.sx, ex) - 150 || b.x0 > Math.max(leg.sx, ex) + 150 ||
          b.y1 < Math.min(leg.sy, ey) - 150 || b.y0 > Math.max(leg.sy, ey) + 150) continue;
      var bestT = -1;
      for (var d = len * 0.3; d <= reach; d += 30) {
        if (rectDist(b, leg.sx + ux * d, leg.sy + uy * d) <= 100) bestT = d;
      }
      if (bestT < 0) continue;
      // must lie ahead, not beside where the leg starts
      var ahead = ((b.x0 + b.x1) / 2 - leg.sx) * ux + ((b.y0 + b.y1) / 2 - leg.sy) * uy;
      if (ahead < Math.min(len * 0.5, 240)) continue;
      var score = boothArea(b) * (0.5 + Math.min(bestT, len) / len);
      if (score > bestScore) { bestScore = score; best = b; }
    }
    return best;
  }
  // Biggest named booth right at a corner (within ~12 ft of it).
  function landmarkAt(x, y, booths, skip) {
    var best = null;
    for (var i = 0; i < (booths ? booths.length : 0); i++) {
      var b = booths[i];
      if (!isLandmarkName(b) || skip(b) || rectDist(b, x, y) > 150) continue;
      if (!best || boothArea(b) > boothArea(best)) best = b;
    }
    return best;
  }

  // quarterTurns: how many 90° clockwise turns the map is shown rotated by
  // (rounded), so "up the map" still matches what the person sees on screen.
  function makeDirections(points, from, to, booths, quarterTurns) {
    if (!points || points.length < 2) return [];
    var qt = (((quarterTurns | 0) % 4) + 4) % 4;
    function onMap(dir) { return ON_MAP[ORDER[(ORDER.indexOf(dir) + qt) % 4]]; }
    // the first and last hops just connect the booth centres to their
    // entrances; walking directions start and end at the aisle
    var isCentre = function (p, b) { return b && b.cx !== undefined && p[0] === b.cx && p[1] === b.cy; };
    if (points.length > 2 && isCentre(points[0], from)) points = points.slice(1);
    if (points.length > 2 && isCentre(points[points.length - 1], to)) points = points.slice(0, -1);
    var legs = [];
    for (var i = 1; i < points.length; i++) {
      var dx = points[i][0] - points[i - 1][0], dy = points[i][1] - points[i - 1][1];
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 12) continue; // ignore sub-foot jogs (booth-centre connectors)
      var dir = dirName(dx, dy);
      var last = legs[legs.length - 1];
      if (last && last.dir === dir) { last.len += len; last.dx += dx; last.dy += dy; }
      else legs.push({ dir: dir, len: len, dx: dx, dy: dy, sx: points[i - 1][0], sy: points[i - 1][1] });
    }
    if (!legs.length) return [];
    function absorb(into, from) {
      if (from.sx !== undefined && legs.indexOf(from) < legs.indexOf(into)) { into.sx = from.sx; into.sy = from.sy; }
      into.len += from.len; into.dx += from.dx; into.dy += from.dy;
    }
    function mergeSameDir() {
      for (var q = legs.length - 1; q > 0; q--) {
        if (legs[q].dir === legs[q - 1].dir) { absorb(legs[q - 1], legs[q]); legs.splice(q, 1); }
      }
    }
    // fold tiny legs (< 25 ft) into a neighbour so directions stay readable
    var changed = true;
    while (changed && legs.length > 1) {
      changed = false;
      for (var j = 0; j < legs.length; j++) {
        if (legs[j].len < 300) {
          absorb(legs[j === 0 ? 1 : j - 1], legs[j]);
          legs.splice(j, 1); changed = true; break;
        }
      }
      mergeSameDir();
    }
    // cap at 3 legs + arrival line = 4 steps
    while (legs.length > 3) {
      var si = 0, sl = Infinity;
      for (var k = 0; k < legs.length; k++) if (legs[k].len < sl) { sl = legs[k].len; si = k; }
      absorb(legs[si === 0 ? 1 : si - 1], legs[si]);
      legs.splice(si, 1);
      mergeSameDir();
    }
    // a short doubling-back at the very end is just the walk round to the
    // booth's entrance; "Arrive at …" covers it
    if (legs.length > 1) {
      var lastLeg = legs[legs.length - 1], prevLeg = legs[legs.length - 2];
      if (lastLeg.len < 720 && (ORDER.indexOf(lastLeg.dir) + 2) % 4 === ORDER.indexOf(prevLeg.dir)) legs.pop();
    }
    function ft(len) { return Math.max(5, Math.round(len / 12 / 5) * 5); }
    function label(b) { return (b.name ? b.name + ' (Booth ' + b.n + ')' : 'Booth ' + b.n); }
    function skip(b) {
      return b === from || b === to || (from.name && b.name === from.name) || (to.name && b.name === to.name);
    }
    var steps = [], prevMark = null;
    for (var m = 0; m < legs.length; m++) {
      var leg = legs[m], corner = null;
      if (m > 0) corner = (prevMark && rectDist(prevMark, leg.sx, leg.sy) <= 300) ? prevMark : landmarkAt(leg.sx, leg.sy, booths, skip);
      var mark = landmarkAlong(leg, booths, function (b) { return skip(b) || (corner && b.name === corner.name); });
      var toward = mark ? 'toward ' + mark.name + ' (' + onMap(leg.dir) + ')' : onMap(leg.dir);
      if (m === 0) {
        steps.push('From ' + label(from) + ', head ' + toward + ' — about ' + ft(leg.len) + ' ft.');
      } else {
        var diff = (ORDER.indexOf(leg.dir) - ORDER.indexOf(legs[m - 1].dir) + 4) % 4;
        var turn = diff === 1 ? 'turn right' : diff === 3 ? 'turn left' : diff === 2 ? 'turn around' : 'keep going';
        var lead = corner ? 'At ' + corner.name + ', ' + turn : turn.charAt(0).toUpperCase() + turn.slice(1);
        // after the first step the turn itself says which way; "turn right and
        // head left on the map" is true but confusing, so no map hint here
        steps.push(lead + (mark ? ' and head toward ' + mark.name : '') + ' — about ' + ft(leg.len) + ' ft.');
      }
      prevMark = mark;
    }
    steps.push('Arrive at ' + label(to) + '.');
    return steps.slice(0, 4);
  }

  return { createRouter: createRouter, makeDirections: makeDirections };
});
