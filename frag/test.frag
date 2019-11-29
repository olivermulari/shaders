#ifdef GL_ES
precision mediump float;
#endif

// this remains the same
uniform vec2 u_resolution;
uniform float u_time;

float rectShape(vec2 pos, vec2 scale) {
  scale = vec2(0.5) - scale * 0.5;
  vec2 shaper = vec2(step(scale.x, pos.x), step(scale.y, pos.y));
  shaper *= vec2(step(scale.x, 1.0 - pos.x), step(scale.y, 1.0 - pos.y));
  return shaper.x * shaper.y;
}

void main() {
  vec2 pos = gl_FragCoord.xy / u_resolution;
  //gl_FragColor = vec4(pos - vec2(-0.5), 1, 1.0);

  vec2 translate = vec2(sin(u_time/2.), cos(u_time));

  float rect = rectShape(pos + translate*0.5, vec2(0.3, 0.3));

  gl_FragColor = vec4(rect, pos, 1.0);
}
