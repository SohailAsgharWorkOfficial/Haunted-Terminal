struct Params { time: f32, width: f32, height: f32, intensity: f32, mouseX: f32, mouseY: f32, dark: f32, entity: f32 };
@group(0) @binding(0) var<uniform> p: Params;
struct Varying { @builtin(position) position: vec4f, @location(0) uv: vec2f };
@vertex fn vs(@builtin(vertex_index) index: u32) -> Varying {
    var points = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
    var out: Varying; out.position = vec4f(points[index],0.0,1.0);
    out.uv = points[index] * vec2f(0.5,-0.5) + vec2f(0.5); return out;
}
fn hash(v: vec2f) -> f32 { return fract(sin(dot(v,vec2f(12.9898,78.233)))*43758.5453); }
fn noise(q: vec2f) -> f32 { let i=floor(q); let f=fract(q); let u=f*f*(3.0 - 2.0*f); return mix(mix(hash(i),hash(i+vec2f(1.0,0.0)),u.x),mix(hash(i+vec2f(0.0,1.0)),hash(i+vec2f(1.0)),u.x),u.y); }
@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let q=v.uv*vec2f(5.0,3.0)+vec2f(p.time*0.08,-p.time*0.025)+vec2f(p.mouseX*0.3,0.0);
    let density=noise(q)*0.6+noise(q*2.0)*0.3+noise(q*4.0)*0.1;
    let alpha=smoothstep(0.43,1.0,v.uv.y)*density*0.25;
    return vec4f(vec3f(0.43,0.56,0.38)*alpha,alpha);
}
