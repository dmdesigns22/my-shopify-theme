(function () {
  const canvas = document.getElementById('rruga-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  // ── Shaders ──────────────────────────────────────────────────────────────

  const vert = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const frag = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;

    /* ---- 2-D Simplex noise (Ian McEwan / Ashima Arts) ---- */
    vec3 mod289v3(vec3 x){ return x - floor(x*(1./289.))*289.; }
    vec2 mod289v2(vec2 x){ return x - floor(x*(1./289.))*289.; }
    vec3 permute(vec3 x){ return mod289v3(((x*34.)+1.)*x); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289v2(i);
      vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.))
                              + i.x + vec3(0., i1.x, 1.));
      vec3 m = max(.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                              dot(x12.zw,x12.zw)), 0.);
      m = m*m; m = m*m;
      vec3 x  = 2.*fract(p*C.www) - 1.;
      vec3 h  = abs(x) - .5;
      vec3 ox = floor(x + .5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x *x0.x   + h.x *x0.y;
      g.yz = a0.yz*x12.xz + h.yz*x12.yw;
      return 130.*dot(m, g);
    }
    /* ------------------------------------------------------ */

    void main(){
      vec2 uv = gl_FragCoord.xy / u_res;
      /* Aspect-correct UV */
      uv.x *= u_res.x / u_res.y;

      float t = u_time * 0.12;

      /* Layered octaves for organic look */
      float n  = 0.0;
      n += 0.500 * snoise(uv * 1.8 + vec2( t,       t * 0.6));
      n += 0.250 * snoise(uv * 3.6 + vec2(-t * 0.8, t * 1.2));
      n += 0.125 * snoise(uv * 7.2 + vec2( t * 1.5,-t * 0.4));
      n += 0.063 * snoise(uv *14.4 + vec2(-t * 0.5, t * 0.9));
      n = n * 0.5 + 0.5;                   /* remap → [0, 1]  */

      /* Soft contrast curve, keep it dark for glass-over effect */
      n = smoothstep(0.25, 0.75, n);
      float brightness = n * 0.18 + 0.02;  /* range ~[0.02, 0.20] */

      gl_FragColor = vec4(vec3(brightness), 1.0);
    }
  `;

  // ── Compile ───────────────────────────────────────────────────────────────

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // ── Full-screen quad ──────────────────────────────────────────────────────

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),
    gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uRes  = gl.getUniformLocation(prog, 'u_res');

  // ── Resize ────────────────────────────────────────────────────────────────

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    /* Render at half resolution for performance, CSS scales it up */
    canvas.width  = Math.round(w * 0.5);
    canvas.height = Math.round(h * 0.5);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);

  // ── Loop ─────────────────────────────────────────────────────────────────

  let start = null;
  function frame(ts) {
    if (!start) start = ts;
    gl.uniform1f(uTime, (ts - start) * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
