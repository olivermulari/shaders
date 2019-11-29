#ifdef GL_ES
precision mediump float;
#endif

// this remains the same
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 pos = 6.0 * gl_FragCoord.xy / u_resolution;

  for (int n = 1; n < 30; n++) {
    float i = float(n);
    pos += vec2(0.7 / i * sin(i * pos.y + u_time + 0.3) + 0.8, 0.4 / i * sin(i * pos.x + u_time + 0.3 * i) + 1.6);
  }

  pos += vec2(0.7 / sin(pos.y + u_time + 0.3) + 0.8, 0.4 / sin(pos.x + u_time + 0.3) + 1.6);

  vec3 color = vec3(0.5 * sin(pos.x) + 0.5, 0.5 * sin(pos.y) + 0.5, 0.5 * sin(pos.y+pos.x) + 0.5);


  gl_FragColor = vec4(color, 1.0);
}
