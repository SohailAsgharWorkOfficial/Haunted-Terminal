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
    let center=vec2f(0.655+(p.mouseX - 0.5)*0.042,0.457+sin(p.time*1.3)*0.019+(p.mouseY - 0.5)*0.03);
    let delta=(v.uv-center)*vec2f(1.8,1.0);
    let alpha=exp(-dot(delta,delta)*360.0)*p.entity*0.23;
    return vec4f(vec3f(0.50,0.82,0.68)*alpha,alpha);
}
