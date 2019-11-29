// this remains the same
uniform vec2 u_resolution;
uniform float u_time;

void mainImage(){
	vec3 c;
	float l,z=u_time;
	for(int i=0;i<3;i++) {
		vec2 uv,p=gl_FragCoord.xy/u_resolution.xy;
		uv=p;
		p-=.5;
		p.x*=u_resolution.x/u_resolution.y;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
	gl_FragColor=vec4(c/l,u_time);
}