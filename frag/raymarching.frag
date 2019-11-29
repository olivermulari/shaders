#ifdef GL_ES
precision mediump float;
#endif

#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .01

// this remains the same
uniform vec2 u_resolution;
uniform float u_time;

/*
 * CHECKS CAMERA DISTANCE TO THE OBJECTS
 * Basically draws objects to the otherwise empty scene
 * takes a point inside
 */
float GetDist(vec3 p) {
  // you can add some translation
  vec4 sphere = vec4(1, 1, 1, .5);
  p = p + 1. * vec3(0,0.2*u_time, u_time);

  float dS = length(mod(p, 2.)-sphere.xyz)-sphere.w;

  // plane
  //float dP = p.y + 10.;
  //float d = min(dP, dS);
  return dS;
}

/*
 * Gets normal for any surface
 */
vec3 GetNormal(vec3 p) {
  vec2 e = vec2(.01, 0);
  float d = GetDist(p);
  vec3 n = d - vec3(
    GetDist(p-e.xyy),
    GetDist(p-e.yxy),
    GetDist(p-e.yyx)
  );

  return normalize(n);
}

/*
 * BASIC RAYMARCHING FUNCTION  
 */
float RayMarch(vec3 rayOrigin, vec3 rayDir) {
  float distOrigin = .0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = rayOrigin + distOrigin * rayDir;
    float distSurface = GetDist(p);
    distOrigin += distSurface;
    if (distSurface < SURF_DIST || distOrigin > MAX_DIST) break;
  }
  return distOrigin;
}

/*
 * CHEAP LIGHTING
 */
float GetLight(vec3 p) {
  vec3 lightPos = vec3(0, 3, 1);
  
  // cheap light movement
  //lightPos.xy += vec2(sin(u_time), cos(u_time)) * 2.;

  vec3 l = normalize(lightPos-p);
  vec3 n = GetNormal(p);

  float dif = clamp(dot(n, l), 0., 1.);
  return dif;
}


void main() {
  // a great uv for everything
  vec2 uv = (gl_FragCoord.xy - .5 * u_resolution.xy) / u_resolution.y;

  vec3 col = vec3(0);

  vec3 rayOrigin = vec3(0, 1, 0);
  vec3 rayDir = normalize(vec3(uv.x, uv.y, 1));

  float d = RayMarch(rayOrigin, rayDir);

  vec3 p = rayOrigin + rayDir * d;

  float dif = GetLight(p);

  col = vec3(dif);

  gl_FragColor = vec4(col, 1.0);
}
