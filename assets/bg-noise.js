(function () {
  const canvas = document.getElementById('rruga-bg');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  const vert = `
    attribute vec2 a;
    void main(){gl_Position=vec4(a,0,1);}
  `;

  const frag = `
    precision mediump float;
    uniform float t;
    uniform vec2 r;

    float hash(vec2 p){
      return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
    }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.0-2.0*f);
      return mix(
        mix(hash(i),hash(i+vec2(1,0)),f.x),
        mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
    }

    void main(){
      vec2 uv=gl_FragCoord.xy/r;
      uv.x*=r.x/r.y;
      float n=noise(uv*2.0+t)*0.6+noise(uv*4.5-t*0.7)*0.4;
      n=smoothstep(0.3,0.7,n)*0.18+0.02;
      gl_FragColor=vec4(vec3(n),1.0);
    }
  `;

  function shader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

  const uT = gl.getUniformLocation(prog, 't');
  const uR = gl.getUniformLocation(prog, 'r');

  function resize() {
    canvas.width  = Math.round(window.innerWidth  * 0.4);
    canvas.height = Math.round(window.innerHeight * 0.4);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener('resize', resize);

  /* Cap at 30 fps — background doesn't need 60 */
  const interval = 1000 / 30;
  let last = 0, start = null;

  function frame(ts) {
    if (!start) start = ts;
    if (ts - last >= interval) {
      last = ts;
      gl.uniform1f(uT, (ts - start) * 0.001 * 0.12);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
