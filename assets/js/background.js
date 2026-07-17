// Cinematic WebGL background - raw WebGL (no three.js). Fullscreen shader quad.

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i=0;i<5;i++){ v += a*snoise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5*uRes.xy) / uRes.y;
  float t = uTime * 0.05;

  vec2 q = vec2(fbm(p*1.3 + t), fbm(p*1.3 - t + 5.2));
  vec2 r = vec2(fbm(p*1.3 + q*1.4 + vec2(1.7,9.2) + t*0.6),
                fbm(p*1.3 + q*1.4 + vec2(8.3,2.8) - t*0.6));
  float f = fbm(p*1.3 + r*1.2);

  vec3 bg = vec3(0.02, 0.027, 0.039);
  vec3 accent = vec3(0.224, 1.0, 0.807);
  vec3 accent2 = vec3(0.302, 0.831, 1.0);
  vec3 col = bg;
  col = mix(col, accent*0.5, smoothstep(0.2, 0.9, f)*0.32);
  col = mix(col, accent2*0.5, smoothstep(0.3, 1.0, r.x)*0.12);

  float md = distance(uv, uMouse);
  col += accent * 0.10 * smoothstep(0.5, 0.0, md);

  float sweep = smoothstep(0.02, 0.0, abs(fract(uv.y*0.5 - uTime*0.03) - 0.5));
  col += accent * 0.015 * sweep;

  col -= 0.02 * sin(gl_FragCoord.y * 1.6);
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)) + uTime) * 43758.5453);
  col += (grain - 0.5) * 0.02;

  float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}`;

export function initBackground(canvas) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) { canvas.style.background = "#05070a"; return { destroy() {} }; }

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, "uRes");
  const uTime = gl.getUniformLocation(prog, "uTime");
  const uMouse = gl.getUniformLocation(prog, "uMouse");

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const onMove = (e) => { mouse.tx = e.clientX / window.innerWidth; mouse.ty = 1 - e.clientY / window.innerHeight; };
  window.addEventListener("pointermove", onMove);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.6);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener("resize", resize);
  resize();

  const start = performance.now();
  let raf = 0;
  function frame() {
    const t = (performance.now() - start) / 1000;
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, reduce ? 8.0 : t);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduce) raf = requestAnimationFrame(frame);
  }
  frame();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    },
  };
}
