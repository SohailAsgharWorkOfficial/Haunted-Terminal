// Deterministic authoring helper. Output remains normal, editable RML.
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
const directory = new URL('../haunted-terminal/', import.meta.url);
let id = 1000;
const next = () => `0:${id++}`;
const xml = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;').replaceAll('\n','&#10;');
const props = {state:101, ghostX:102, ghostY:103, entityOpacity:104, doorScale:105, darkOpacity:106, glitch:107, mouseX:108, mouseY:109, cameraShift:110, terminalText:111, currentInput:112, statusText:113, cameraText:114, currentCommand:115, endingText:116, scareOpacity:117};
const bind = (p,key) => `<DataBindContext sourcePathIds="0:40-0:${props[p]}" propertyKey="${key}"/>`;
function rect(name,x,y,w,h,color,extra='') {return `<Shape name="${name}" x="${x}" y="${y}">${extra}<Rectangle width="${w}" height="${h}" originX="0" originY="0"/><Fill><SolidColor colorValue="${color}"/></Fill></Shape>`;}
function ellipse(name,x,y,w,h,color) {return `<Shape name="${name}" x="${x}" y="${y}"><Ellipse width="${w}" height="${h}" originX="0.5" originY="0.5"/><Fill><SolidColor colorValue="${color}"/></Fill></Shape>`;}
function poly(name,points,color) {return `<Shape name="${name}"><PointsPath isClosed="true">${points.map(([x,y])=>`<StraightVertex x="${x}" y="${y}"/>`).join('')}</PointsPath><Fill><SolidColor colorValue="${color}"/></Fill></Shape>`;}
function text(name,x,y,size,value,color='FFA8B995',binding=null,width=800,height=30) {const style=next();return `<Text name="${name}" x="${x}" y="${y}" width="${width}" height="${height}" sizingValue="fixed" overflowValue="clipped"><TextStylePaint id="${style}" fontSize="${size}" fontAssetId="0:90"><Fill><SolidColor colorValue="${color}"/></Fill></TextStylePaint><TextValueRun styleId="${style}" text="${xml(value)}">${binding?bind(binding,268):''}</TextValueRun></Text>`;}
function effect(name) {return `<ScriptedDrawable name="GPU / ${name}" scriptAssetId="0:81"><ScriptInputString name="effectName" propertyValue="${name}"/><ScriptInputNumber name="width" propertyValue="840"/><ScriptInputNumber name="height" propertyValue="470"/></ScriptedDrawable>`;}
// Painter order is reversed at each group boundary: first declared paints on top.
const room=[];
room.push(rect('Back wall',0,0,840,470,'FF111B16'));
room.push(poly('Left wall',[[0,0],[135,60],[135,330],[0,440]],'FF18231B'));
room.push(poly('Right wall',[[840,0],[728,60],[728,330],[840,440]],'FF0B140F'));
room.push(poly('Floor',[[135,330],[728,330],[840,470],[0,470]],'FF121D15'));
for(let x=135;x<740;x+=120) room.push(rect('Wall seam',x,60,1,270,'FF2A392B'));
for(let y=365;y<470;y+=44) room.push(rect('Floor seam',0,y,840,1,'FF233020'));
room.push(rect('Upper conduit',140,110,580,6,'FF34422D'));
room.push(rect('Lower conduit',140,123,450,4,'FF293925'));
room.push(rect('Containment frame',619,150,110,190,'FF3A4732'));
room.push(rect('Unlit passage',625,155,98,185,'FF030805'));
room.push(`<Node name="Door hinge" x="625" y="155">${bind('doorScale',16)}${text('Door number',22,67,25,'07','FF899570',null,65,40)}${rect('Door handle',82,114,5,17,'FF95A47D')}${rect('Door panel inset',9,12,78,85,'FF19281C')}${rect('Steel door',0,0,98,184,'FF2F3D2A')}</Node>`);
room.push(text('Restricted sign',627,128,8,'RESTRICTED / 07','FFBF9770',null,130,15));
room.push(rect('Circuit box',160,166,85,112,'FF293426'));
for(let y=186;y<259;y+=10) room.push(rect('Circuit vent',170,y,64,2,'FF151F15'));
room.push(rect('Ceiling fixture',300,57,175,8,'FF647452'));
room.push(rect('Ceiling light',309,65,157,4,'FFC4DDA1'));
room.push(`<Node name="Tracking ghost">${bind('ghostX',13)}${bind('ghostY',14)}${bind('entityOpacity',18)}${ellipse('Left eye',-8,-15,5,10,'FFE0EFD0')}${ellipse('Right eye',10,-15,5,10,'FFE0EFD0')}${ellipse('Mouth',1,8,8,17,'FF07110B')}${poly('Spectral sheet',[[-28,60],[-26,-8],[-18,-35],[0,-46],[21,-29],[29,12],[31,64],[15,48],[0,66],[-13,49]],'668CAE94')}</Node>`);
room.push(poly('Desk top',[[130,336],[495,336],[546,361],[95,361]],'FF46503A'));
room.push(rect('Desk edge',95,361,451,11,'FF111A11'));
room.push(rect('Left desk leg',118,370,14,100,'FF283222'));room.push(rect('Right desk leg',510,370,14,100,'FF283222'));
room.push(rect('Monitor stand',267,299,45,30,'FF435139'));
room.push(poly('Monitor base',[[239,329],[336,329],[348,339],[227,339]],'FF4D5C40'));
room.push(rect('CRT housing',205,192,184,113,'FF556046'));
room.push(rect('CRT bezel',216,201,162,91,'FF17261A'));
room.push(rect('CRT phosphor',221,206,152,80,'FF293D26'));
room.push(text('CRT label',230,215,7,'ACHERON RESEARCH SYSTEMS','FFCADDA4',null,150,15));
room.push(text('CRT activity',230,236,7,'> SIGNAL FOUND\n> YOU ARE NOT ALONE.\n> _','FFB3CE94',null,147,48));
room.push(ellipse('Power LED',373,298,4,4,'FFCCE8A4'));
room.push(poly('Keyboard',[[226,343],[356,343],[373,355],[212,355]],'FF66754E'));
for(let y=346;y<355;y+=3) room.push(rect('Keys',224,y,130,1,'FF273D22'));
room.push(rect('Coffee mug',162,317,17,22,'FF858668'));
room.push(ellipse('Mouse',404,349,24,10,'FF5C6A45'));
room.push(rect('Rack housing',756,200,61,155,'FF0D170D'));
for(let y=211;y<350;y+=18){room.push(rect('Rack unit',762,y,47,13,'FF263A23'));room.push(ellipse('Rack LED',801,y+6,3,3,'FFADBA83'));}
const layers = [];
layers.push(rect('Page background',0,0,1280,900,'FF101510'));
layers.push(text('Division label',40,20,12,'A / ACHERON    —    ANOMALOUS SYSTEMS DIVISION','FFB9C99E'));
layers.push(rect('Header divider',40,56,1200,1,'FF34402C'));
layers.push(text('Experiment label',40,80,10,'EXPERIMENT NO. 0066   /   INTERACTIVE HORROR EXPERIENCE','FF9DB67C'));
layers.push(text('Title',38,99,43,'THE HAUNTED TERMINAL_','FFE0E6D5',null,1100,57));
layers.push(text('Subtitle',40,153,11,'An abandoned system. An open connection. Something on the other side.','FF8D9B7D'));
layers.push(`<Node name="Surveillance room" x="40" y="180">${effect('crt-glitch')}${effect('ghost-glow')}${rect('Lights off overlay',0,0,840,470,'FF000503',bind('darkOpacity',18))}${effect('fog')}${effect('candle-flicker')}<Node name="Camera pan">${bind('cameraShift',13)}${room.reverse().join('\n')}</Node></Node>`);
layers.push(`<Node name="Eyes in the darkness" x="40" y="180">${bind('darkOpacity',18)}<Node name="Eye tracking">${bind('ghostX',13)}${bind('ghostY',14)}${ellipse('Eye left',-8,-15,5,10,'FFD5ECC3')}${ellipse('Eye right',10,-15,5,10,'FFD5ECC3')}</Node></Node>`);
layers.push(`<Node name="Entity reveal" x="40" y="180">${bind('scareOpacity',18)}${ellipse('Void mouth',420,280,70,150,'FF020503')}${ellipse('Watching left',340,170,14,40,'FFE7B395')}${ellipse('Watching right',500,170,14,40,'FFE7B395')}${poly('Creature face',[[200,470],[240,170],[310,40],[420,0],[530,40],[600,170],[640,470]],'FF26382E')}${rect('End veil',0,0,840,470,'ED030805')}</Node>`);
layers.push(text('Camera label',60,197,10,'REC / CAM_01 — CONTROL ROOM','FFBCCCAB','cameraText'));
layers.push(text('Room footer',60,617,9,'SECTOR 07 / SUBLEVEL 03                                   28.10.1986 / 03:33:07','FF8A9D78'));
['OPEN DOOR','LIGHTS ON / OFF','SWITCH CAMERA'].forEach((label,i)=>{layers.push(rect(label+' button',40+i*280,652,278,50,'FF26301E'));layers.push(text(label,61+i*280,669,12,label+'  ↗','FFC5DCA2',null,255,23));});
layers.push(rect('Console background',40,720,840,149,'FF0A120C'));
layers.push(text('Command terminal header',58,731,9,'COMMAND TERMINAL / bash — local session','FF849C6D'));
layers.push(text('Terminal output',58,750,11,'HAUNTED SYSTEM OS v6.66 / ACHERON RESEARCH\nConnection established. You are not alone.\nType HELP, or click a control. Enter executes.','FFB4CA9A','terminalText',800,91));
layers.push(text('Command input',58,845,12,'> _','FFD0E3AF','currentInput',798,22));
layers.push(rect('Diagnostics card',900,180,340,521,'FF192216'));
layers.push(text('Diagnostics header',924,203,12,'SYSTEM DIAGNOSTICS','FFCCDBB7',null,295,30));
layers.push(rect('Diagnostics divider',924,244,292,1,'FF3C4A31'));
layers.push(text('Operating system',924,269,22,'HAUNTED OS','FFCFDABA',null,280,35));
layers.push(text('OS version',924,307,9,'VERSION 6.66.0 / BUILD 1986','FF8B9F71',null,280,24));
layers.push(text('Diagnostics values',924,363,12,'POWER                  43%\nSECURITY               OFFLINE\nCONTAINMENT            LOCKED\nENTITY                 DETECTED','FFB6C89D','statusText',300,105));
layers.push(`<Shape x="930" y="485" name="Warning indicator" id="0:200"><Ellipse width="8" height="8"/><Fill><SolidColor colorValue="FFC6906F"/></Fill></Shape>`);
layers.push(text('Warning label',944,477,10,'SOMETHING IS LISTENING.','FFD1B488',null,265,25));
layers.push(text('Operator note',924,533,18,'The last person who used\nthis terminal never\nlogged out.','FFADBDA0',null,285,100));
layers.push(text('Hint',924,637,10,'It can only follow what\nthe light reveals.','FF9BA87C',null,278,50));
layers.push(rect('Escape button',900,740,340,55,'FFB6CF8D'));layers.push(text('Escape',924,757,15,'ATTEMPT ESCAPE  →','FF152211',null,300,30));
layers.push(rect('Reset button',900,812,340,55,'FF293421'));layers.push(text('Reset',924,829,13,'RESTART SESSION  ↺','FFB9CEA0',null,300,25));
layers.push(text('Ending',58,580,17,'','FFE6D9B4','endingText',806,36));
const names=['Idle','Investigation','GhostVisible','DoorOpening','Possessed','Jumpscare','Escape'];
const transitions=names.map((_,i)=>`<StateTransition stateToId="0:${300+i}" duration="180"><TransitionViewModelCondition opValue="equal"><TransitionPropertyViewModelComparator><BindablePropertyNumber>${bind('state',636)}</BindablePropertyNumber></TransitionPropertyViewModelComparator><TransitionValueNumberComparator value="${i}"/></TransitionViewModelCondition></StateTransition>`).join('');
const machine=`<StateMachine name="Haunted System" id="0:7"><StateMachineLayer name="Narrative" id="0:8"><AnyState x="-200" y="-180">${transitions}</AnyState><ExitState x="1100" y="-180"/><EntryState x="-200" y="0"><StateTransition stateToId="0:300"/></EntryState>${names.map((_,i)=>`<AnimationState x="${i*170}" y="${i%2*160}" animationId="0:${400+i}" id="0:${300+i}">${i===0?'<FocusActionTarget targetId="0:12"/>':''}</AnimationState>`).join('')}</StateMachineLayer></StateMachine>`;
const animations=names.map((name,i)=>`<LinearAnimation name="${name}" id="0:${400+i}" fps="60" duration="120" loopValue="loop"><KeyedObject objectId="0:200"><KeyedProperty propertyKey="18"><KeyFrameDouble value="${i>=4?1:.3}" frame="0" interpolationType="linear"/><KeyFrameDouble value="1" frame="60" interpolationType="linear"/><KeyFrameDouble value="${i>=4?.5:.3}" frame="120" interpolationType="linear"/></KeyedProperty></KeyedObject></LinearAnimation>`).join('');
const defaults={state:0,ghostX:550,ghostY:215,entityOpacity:.09,doorScale:1,darkOpacity:0,glitch:0,mouseX:.5,mouseY:.5,cameraShift:0,terminalText:'HAUNTED SYSTEM OS v6.66 / ACHERON RESEARCH\nConnection established. You are not alone.\nType HELP, or click a control. Enter executes.',currentInput:'> _',statusText:'POWER                  43%\nSECURITY               OFFLINE\nCONTAINMENT            LOCKED\nENTITY                 DETECTED',cameraText:'REC   CAM_01 / CONTROL ROOM',currentCommand:'',endingText:'',scareOpacity:0};
const vm=`<ViewModel name="HauntedSystem" id="0:40" defaultInstanceId="0:41">${Object.entries(props).map(([p,n])=>`<ViewModelProperty${typeof defaults[p]==='number'?'Number':'String'} name="${p}" id="0:${n}"/>`).join('')}<ViewModelInstance name="Default" id="0:41" exports="true">${Object.entries(props).map(([p,n])=>`<ViewModelInstance${typeof defaults[p]==='number'?'Number':'String'} viewModelPropertyId="0:${n}" propertyValue="${xml(defaults[p])}"/>`).join('')}</ViewModelInstance></ViewModel>`;
const scene=`<Rive version="1" kind="fragment"><Artboard name="The Haunted Terminal" id="0:2" width="1280" height="900" clip="true" styleId="0:5" defaultStateMachineId="0:7" viewModelId="0:40" viewModelInstanceId="0:41"><LayoutComponentStyle id="0:5"/><LayoutComponent name="Native input" width="1280" height="900" styleId="0:11"><LayoutComponentStyle id="0:11" layoutWidthScaleType="1" layoutHeightScaleType="1" widthUnitsValue="3" heightUnitsValue="3"/><ScriptedLayout name="Terminal controller" id="0:12" scriptAssetId="0:80"><FocusData/></ScriptedLayout></LayoutComponent>${layers.reverse().join('\n')}${machine}${animations}</Artboard>${vm}<FontAsset file="assets/Inter.ttf" name="Inter" id="0:90"/><ScriptAsset file="terminal.luau" name="terminal" id="0:80"/><ScriptAsset file="effects.luau" name="effects" id="0:81"/></Rive>`;
writeFileSync(new URL('scene.rml',directory),scene.replaceAll('><','>\n<'));
const common=`struct Params { time: f32, width: f32, height: f32, intensity: f32, mouseX: f32, mouseY: f32, dark: f32, entity: f32 };
@group(0) @binding(0) var<uniform> p: Params;
struct Varying { @builtin(position) position: vec4f, @location(0) uv: vec2f };
@vertex fn vs(@builtin(vertex_index) index: u32) -> Varying {
    var points = array<vec2f, 3>(vec2f(-1.0,-1.0), vec2f(3.0,-1.0), vec2f(-1.0,3.0));
    var out: Varying; out.position = vec4f(points[index],0.0,1.0);
    out.uv = points[index] * vec2f(0.5,-0.5) + vec2f(0.5); return out;
}
fn hash(v: vec2f) -> f32 { return fract(sin(dot(v,vec2f(12.9898,78.233)))*43758.5453); }
`;
const shaders={
  'crt-glitch':`@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let scan = 0.045 + 0.04 * sin(v.uv.y * p.height * 2.3);
    let noise = hash(floor(v.uv * vec2f(p.width,p.height)) + floor(p.time*18.0));
    let tear = step(0.94,hash(vec2f(floor(v.uv.y*32.0),floor(p.time*12.0)))) * p.intensity;
    let edge = pow(clamp(length((v.uv - 0.5)*1.3),0.0,1.0),3.0)*0.3;
    let alpha = clamp(scan + noise*0.035 + edge + tear*0.28,0.0,0.7);
    return vec4f(vec3f(tear*0.35,tear*0.10,tear*0.17)*alpha,alpha);
}`,
  fog:`fn noise(q: vec2f) -> f32 { let i=floor(q); let f=fract(q); let u=f*f*(3.0 - 2.0*f); return mix(mix(hash(i),hash(i+vec2f(1.0,0.0)),u.x),mix(hash(i+vec2f(0.0,1.0)),hash(i+vec2f(1.0)),u.x),u.y); }
@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let q=v.uv*vec2f(5.0,3.0)+vec2f(p.time*0.08,-p.time*0.025)+vec2f(p.mouseX*0.3,0.0);
    let density=noise(q)*0.6+noise(q*2.0)*0.3+noise(q*4.0)*0.1;
    let alpha=smoothstep(0.43,1.0,v.uv.y)*density*0.25;
    return vec4f(vec3f(0.43,0.56,0.38)*alpha,alpha);
}`,
  'ghost-glow':`@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let center=vec2f(0.655+(p.mouseX - 0.5)*0.042,0.457+sin(p.time*1.3)*0.019+(p.mouseY - 0.5)*0.03);
    let delta=(v.uv-center)*vec2f(1.8,1.0);
    let alpha=exp(-dot(delta,delta)*360.0)*p.entity*0.23;
    return vec4f(vec3f(0.50,0.82,0.68)*alpha,alpha);
}`,
  'candle-flicker':`@fragment fn fs(v: Varying) -> @location(0) vec4f {
    let flicker=0.90+0.05*sin(p.time*3.7)+0.035*sin(p.time*8.3);
    let q=(v.uv-vec2f(0.46,0.18))*vec2f(1.1,0.7);
    let alpha=exp(-dot(q,q)*8.0)*0.09*flicker*(1.0-p.dark);
    return vec4f(vec3f(0.75,0.86,0.51)*alpha,alpha);
}`,
};
for(const [name,body] of Object.entries(shaders)) {
  writeFileSync(new URL(`${name}.wgsl`,directory),common+body+'\n');
  writeFileSync(new URL(`../shaders/${name}.wgsl`,directory),common+body+'\n');
}
console.log('Wrote editable RML scene and four WGSL passes. Run npm run rive:verify.');
