// A small, actual 3D renderer. Geometry, perspective, depth testing and lighting
// are handled in WebGL; no CDN or runtime library is required.
const VERTEX = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform vec2 uRotation;
uniform float uAspect;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
mat3 rotateX(float a) { float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c); }
mat3 rotateY(float a) { float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c); }
void main() {
  mat3 rotation=rotateX(uRotation.x)*rotateY(uRotation.y);
  vec3 p=rotation*aPosition;
  vNormal=rotation*aNormal;
  vPosition=p;
  p.y+=sin(uTime*.7)*.07;
  p.z+=6.5;
  gl_Position=vec4(p.x*2.05/uAspect,p.y*2.05,p.z*1.002-0.2002,p.z);
}`;
const FRAGMENT = `
precision mediump float;
uniform vec3 uColor;
uniform float uWire;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  float d=max(dot(normalize(vNormal),normalize(vec3(-.7,1.,-1.))),0.);
  float light=.22+floor(d*4.)/4.*.85;
  vec3 ink=uColor*light;
  ink+=vec3(.13,.1,.06)*pow(max(dot(normalize(vNormal),normalize(vec3(.2,.7,-1.))),0.),12.);
  gl_FragColor=vec4(mix(ink,mix(uColor,vec3(.92,.89,.81),.2)*.65,uWire),1.);
}`;

export function createCore(canvas, { onUnavailable, isPaused }) {
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { /* static fallback below */ }
  if (!gl) { onUnavailable(); return { frame() {}, setDomain() {}, reset() {}, available: false }; }
  function shader(type, source) {
    const item = gl.createShader(type);
    gl.shaderSource(item, source); gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) { gl.deleteShader(item); throw new Error('Unable to compile portfolio scene'); }
    return item;
  }
  let program;
  try {
    program = gl.createProgram();
    const vertex = shader(gl.VERTEX_SHADER, VERTEX), fragment = shader(gl.FRAGMENT_SHADER, FRAGMENT);
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Unable to link portfolio scene');
  } catch { onUnavailable(); return { frame() {}, setDomain() {}, reset() {}, available: false }; }
  gl.useProgram(program);
  gl.enable(gl.DEPTH_TEST);
  const uniforms = Object.fromEntries(['uRotation', 'uAspect', 'uTime', 'uColor', 'uWire'].map(key => [key, gl.getUniformLocation(program, key)]));
  const position = gl.getAttribLocation(program, 'aPosition'), normal = gl.getAttribLocation(program, 'aNormal');
  gl.enableVertexAttribArray(position); gl.enableVertexAttribArray(normal);
  const faces = [], lines = [];
  const addLine = (a,b) => { for (const p of [a,b]) lines.push(...p,0,1,0); };
  function octahedron(center, scale) {
    const vertices = [[0,1.55,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,-1.55,0]].map(p => p.map((v,i) => v*scale+center[i]));
    for (let i=1;i<=4;i++) {
      const next=i===4?1:i+1;
      for (const ids of [[0,next,i],[5,i,next]]) {
        const [a,b,c]=ids.map(j=>vertices[j]);
        const u=b.map((v,j)=>v-a[j]), v=c.map((v,j)=>v-a[j]);
        const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
        const length=Math.hypot(...n);
        for (const p of [a,b,c]) faces.push(...p,...n.map(x=>x/length));
        addLine(a,b);addLine(b,c);addLine(c,a);
      }
    }
  }
  octahedron([0,0,0],1);
  for (let i=0;i<6;i++) {
    const a=i/6*Math.PI*2;
    octahedron([Math.cos(a)*2.13,Math.sin(a*2)*.45,Math.sin(a)*2.13],.08+(i%2)*.035);
  }
  for (let ring=0;ring<3;ring++) {
    const radius=2.0+ring*.16, tilt=(ring-1)*.95;
    const point = a => [Math.cos(a)*radius,Math.sin(a)*radius*Math.sin(tilt),Math.sin(a)*radius*Math.cos(tilt)];
    for (let i=0;i<160;i++) {
      if (ring===2 && i%8>4) continue;
      addLine(point(i/160*Math.PI*2),point((i+1)/160*Math.PI*2));
    }
  }
  function buffer(data) { const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b; }
  const faceBuffer=buffer(faces), lineBuffer=buffer(lines);
  let width=1,height=1,active=true,dragging=false,lastX=0,lastY=0,rotateX=-.15,rotateY=.5,time=0,lastTime=0;
  let color=[.949,.294,.243],targetColor=[...color];
  function draw(data, count, mode, wire) {
    gl.bindBuffer(gl.ARRAY_BUFFER,data);
    gl.vertexAttribPointer(position,3,gl.FLOAT,false,24,0);gl.vertexAttribPointer(normal,3,gl.FLOAT,false,24,12);
    gl.uniform1f(uniforms.uWire,wire);gl.drawArrays(mode,0,count/6);
  }
  function frame(timestamp=lastTime, force=false) {
    if (!active || (!force && !visible)) {lastTime=timestamp;return;}
    const delta=Math.min((timestamp-lastTime)/1000,.04)||0;lastTime=timestamp;
    if (!isPaused() && !dragging) { time+=delta;rotateY+=delta*.18; }
    color=color.map((v,i)=>isPaused()?targetColor[i]:v+(targetColor[i]-v)*.07);
    gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform2f(uniforms.uRotation,rotateX,rotateY);
    gl.uniform1f(uniforms.uAspect,width/height);gl.uniform1f(uniforms.uTime,time);gl.uniform3fv(uniforms.uColor,color);
    gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);draw(faceBuffer,faces.length,gl.TRIANGLES,0);gl.disable(gl.POLYGON_OFFSET_FILL);
    draw(lineBuffer,lines.length,gl.LINES,1);
  }
  let visible=false;
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)frame(lastTime,true);});visibility.observe(canvas);
  const resize=new ResizeObserver(()=>{const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.75);width=Math.max(1,Math.round(box.width*dpr));height=Math.max(1,Math.round(box.height*dpr));canvas.width=width;canvas.height=height;frame(lastTime,true);});resize.observe(canvas);
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0 || e.pointerType==='touch')return;dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;rotateY+=(e.clientX-lastX)*.008;rotateX=Math.max(-1.3,Math.min(1.3,rotateX+(e.clientY-lastY)*.008));lastX=e.clientX;lastY=e.clientY;frame(lastTime,true);});
  const stop=()=>{dragging=false;canvas.classList.remove('dragging');};
  canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('lostpointercapture',stop);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();active=false;onUnavailable();});
  return {
    available:true,frame,
    setDomain(hex) { targetColor=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255);frame(lastTime,true); },
    reset() {rotateX=-.15;rotateY=.5;frame(lastTime,true);},
  };
}
