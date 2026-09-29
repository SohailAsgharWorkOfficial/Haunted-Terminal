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
    let flicker=0.90+0.05*sin(p.time*3.7)+0.035*sin(p.time*8.3);
    let q=(v.uv-vec2f(0.46,0.18))*vec2f(1.1,0.7);
    let alpha=exp(-dot(q,q)*8.0)*0.09*flicker*(1.0-p.dark);
    return vec4f(vec3f(0.75,0.86,0.51)*alpha,alpha);
}
