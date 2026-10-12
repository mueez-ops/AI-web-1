/* ==========================================================================
   veil.js — "the lamp in the night"
   A WebGL layer of drifting dark smoke over the hero video. The pointer (or a
   finger) carries a lamp that lifts the darkness; the light fades slowly
   behind it, like a trail. With no pointer, a soft lamp drifts on its own.
   The video underneath is never resampled, so it keeps its full quality.
   Exposes window.Veil.start(canvas, section) → controller or null.
   ========================================================================== */
(function () {
  "use strict";

  var VERT = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

  // Dark veil = smoke noise; lamp lights = soft discs with a noisy rim.
  var FRAG = [
    "precision mediump float;",
    "uniform vec2 uRes; uniform float uTime; uniform float uIntro;",
    "uniform vec3 uL[24];",              // x, y (pixels), strength
    "float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);",
    "  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }",
    "float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n(p); p *= 2.03; a *= 0.5; } return v; }",
    "void main(){",
    "  vec2 uv = gl_FragCoord.xy / uRes;",
    "  float asp = uRes.x / uRes.y;",
    "  vec2 q = vec2(uv.x*asp, uv.y);",
    "  float smoke = fbm(q*2.2 + vec2(uTime*0.03, -uTime*0.05)) * 0.6 + fbm(q*5.0 - uTime*0.04) * 0.4;",
    "  float light = 0.0;",
    "  float r = 0.17 * min(1.0, 1.25 / asp + 0.35);",
    "  for (int i = 0; i < 24; i++){",
    "    vec3 L = uL[i]; if (L.z <= 0.001) continue;",
    "    vec2 d = (gl_FragCoord.xy - L.xy) / uRes.y;",
    "    float dist = length(d) + (smoke - 0.5) * 0.06;",
    "    light += L.z * smoothstep(r, r*0.15, dist);",
    "  }",
    "  light = clamp(light, 0.0, 1.0);",
    "  float vign = smoothstep(0.0, 0.55, uv.y) * 0.25 + 0.75;",            // a little heavier at the bottom for the title
    "  float veil = mix(0.58, 0.80, smoke) * (1.15 - 0.15*vign);",
    "  veil = mix(veil, 0.10, light * 0.92);",
    "  veil = max(veil, (1.0 - smoothstep(0.0, 0.32, uv.y)) * 0.55);",     // keep the title band readable
    "  veil = mix(1.0, veil, uIntro);",                                    // opens from full dark
    "  gl_FragColor = vec4(vec3(0.020, 0.075, 0.085) * veil, veil);   // the logo's deep teal",
    "}"
  ].join("\n");

  function compile(gl, type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { throw new Error(gl.getShaderInfoLog(s)); }
    return s;
  }

  function start(canvas, section) {
    var gl;
    try { gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false }); } catch (e) { gl = null; }
    if (!gl) return null;

    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch (e) { return null; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var uRes = gl.getUniformLocation(prog, "uRes");
    var uTime = gl.getUniformLocation(prog, "uTime");
    var uIntro = gl.getUniformLocation(prog, "uIntro");
    var uL = gl.getUniformLocation(prog, "uL");

    // The veil is soft, so it renders at reduced resolution (cheap on phones).
    var SCALE = 0.5, W = 0, H = 0;
    function resize() {
      var r = section.getBoundingClientRect();
      W = Math.max(2, Math.round(r.width * SCALE)); H = Math.max(2, Math.round(r.height * SCALE));
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener("resize", resize);

    // Light trail: a ring of points that fade over time.
    var N = 24, pts = [], head = 0, last = null, lastMove = -1e9, t0 = performance.now();
    for (var i = 0; i < N; i++) pts.push({ x: 0, y: 0, s: 0 });
    function add(x, y, s) {
      var p = pts[head]; p.x = x; p.y = y; p.s = s; head = (head + 1) % N;
    }
    function toCanvas(e) {
      var r = section.getBoundingClientRect();
      return { x: (e.clientX - r.left) * SCALE, y: (r.bottom - e.clientY) * SCALE };
    }
    function onMove(e) {
      var c = toCanvas(e);
      if (last && Math.hypot(c.x - last.x, c.y - last.y) < 6 * SCALE) return;
      add(c.x, c.y, 1); last = c; lastMove = performance.now();
      if (api.onFirstMove) { api.onFirstMove(); api.onFirstMove = null; }
    }
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerdown", onMove, { passive: true });

    var intro = 0, raf = 0, running = false, data = new Float32Array(N * 3);
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var t = (now - t0) / 1000;
      intro = Math.min(1, intro + 0.012);
      // Idle lamp: drifts slowly when nobody has moved for a while.
      if (now - lastMove > 2500) {
        var ix = W * (0.5 + 0.28 * Math.sin(t * 0.23)), iy = H * (0.58 + 0.12 * Math.sin(t * 0.37 + 1.3));
        if (!last || Math.hypot(ix - last.x, iy - last.y) > 4) { add(ix, iy, 0.85); last = { x: ix, y: iy }; }
      }
      for (var i = 0; i < N; i++) {
        pts[i].s *= 0.975;
        data[i * 3] = pts[i].x; data[i * 3 + 1] = pts[i].y; data[i * 3 + 2] = pts[i].s;
      }
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uIntro, intro);
      gl.uniform3fv(uL, data);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    var api = {
      onFirstMove: null,
      play: function () { if (!running) { running = true; raf = requestAnimationFrame(frame); } },
      pause: function () { running = false; cancelAnimationFrame(raf); },
      destroy: function () { api.pause(); window.removeEventListener("resize", resize); }
    };
    section.classList.add("has-veil");
    return api;
  }

  window.Veil = { start: start };
})();
