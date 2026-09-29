struct Params { time: f32, width: f32, height: f32, intensity: f32, mouseX: f32, mouseY: f32, dark: f32, entity: f32 };
@group(0) @binding(0) var<uniform> p: Params;
struct Varying { @builtin(position) position: vec4f, @location(0) uv: vec2f };
@vertex fn vs(@builtin(vertex_index) index: u32) -> Varying {
    var points = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
    var out: Varying; out.position = vec4f(points[index],0.0,1.0);
    out.uv = points[index] * vec2f(0.5,-0.5) + vec2f(0.5); return out;
}
fn hash(v: vec2f) -> f32 { return fract(sin(dot(v,vec2f(12.9898,78.233)))*43758.5453); }
@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let scan = 0.045 + 0.04 * sin(v.uv.y * p.height * 2.3);
    let noise = hash(floor(v.uv * vec2f(p.width,p.height)) + floor(p.time*18.0));
    let tear = step(0.94,hash(vec2f(floor(v.uv.y*32.0),floor(p.time*12.0)))) * p.intensity;
    let edge = pow(clamp(length((v.uv - 0.5)*1.3),0.0,1.0),3.0)*0.3;
    let alpha = clamp(scan + noise*0.035 + edge + tear*0.28,0.0,0.7);
    return vec4f(vec3f(tear*0.35,tear*0.10,tear*0.17)*alpha,alpha);
}
