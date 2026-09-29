export const CHAPTERS = [
  { title:'The dead channel', location:'RECEPTION / 03:33 AM', entity:'void', story:'Your sister disappeared here in 1986. Tonight, a disconnected terminal printed her name. Camera 03 is still recording.', hint:'Select camera 03 and INSPECT the wheelchair. Something was left beneath it.' },
  { title:'The girl who watches', location:'WARD 13 / THE NURSERY', entity:'doll', story:'The ward has been sealed for forty years. The doll in the chair was facing the wall a moment ago. Now it is facing you.', hint:'Read the note on camera 02. The drawing tells you what to do when she moves.' },
  { title:'The last performance', location:'RECREATION HALL / NO AUDIENCE', entity:'clown', story:'A tune is playing through the ventilation shaft. The stage is empty. The applause is coming from inside the walls.', hint:'LISTEN to the three tones. Tune the receiver to their frequency.' },
  { title:'Your voice on the tape', location:'MORGUE / DRAWER 04', entity:'void', story:'The intercom says your name in your own voice. A body drawer opens an inch. The recording is dated tomorrow.', hint:'Inspect camera 04 for a name. Play the tape before opening the drawer.' },
  { title:'The thing without a shadow', location:'GENERATOR / SUBLEVEL 03', entity:'clown', story:'You have the fuse. You also have company. The emergency lights keep switching on behind you, one by one.', hint:'STATUS reveals the circuit order. Insert the recovered fuse, then restore the circuits.' },
  { title:'One more person leaving', location:'EXIT / OCCUPANCY: 02', entity:'doll', story:'The exit counts two people. You are alone. The tape is warm in your pocket. Whatever is on it wants to leave with you.', hint:'Open the exit. Decide what to do with the tape, and remember what the light reveals.' },
];
export const COMMANDS = ['CONNECT','HELP','HINT','STATUS','CAMERA','CAMERA_1','CAMERA_2','CAMERA_3','CAMERA_4','INSPECT','PLAY_TAPE','UNLOCK_0713','READ_NOTE','LOOK_AWAY','LISTEN','TUNE_666','HIDE','UNSEAL_MARA','DISCONNECT','INSERT_FUSE','RESTORE_213','OPEN_DOOR','LIGHTS_OFF','LIGHTS_ON','WHO_ARE_YOU','BURN_TAPE','ESCAPE','CLEAR','RETRY','RESET'];
const entry = (text, kind='normal') => ({text,kind});
export const initialState = () => ({started:false, chapter:0, phase:'STANDBY',power:86,door:false,dark:false,entity:false,camera:1,sequence:0,glitch:0,ending:null,scare:null,scareSerial:0,threat:null,hidden:false,flags:{},inventory:[],checkpoint:null,entries:[entry('ACHERON ARCHIVE / RECOVERED SESSION 0066','muted'),entry('Incoming connection from a terminal decommissioned in 1986.','warning'),entry('Operator identity: YOUR NAME IS ALREADY HERE.','danger')]});
function append(s,text,kind) {s.entries.push(entry(text,kind));s.entries=s.entries.slice(-100);}
function fright(s,entity,caption,variant='impact') {s.scareSerial++;s.scare={id:s.scareSerial,entity,caption,variant};s.entity=true;s.glitch++;}
function checkpoint(s) {s.checkpoint={chapter:s.chapter,power:s.power,inventory:[...s.inventory],flags:{...s.flags}};}
function advance(s) {
  s.chapter++;s.camera=1;s.hidden=false;s.threat=null;s.dark=false;s.phase='INVESTIGATION';s.power=Math.max(18,s.power-9);
  append(s,`CHAPTER ${s.chapter+1} / ${CHAPTERS[s.chapter].title.toUpperCase()}`,'input');append(s,CHAPTERS[s.chapter].story,'warning');checkpoint(s);
}
function hunt(s,entity,response,caption) {
  if(s.threat)return;
  s.threat={entity,response,remaining:10,protected:false};s.phase='HUNTED';s.hidden=false;
  fright(s,entity,caption,'approach');append(s,`${caption} ${response.replaceAll('_',' ')}. NOW.`,'danger');
}
export function tickGame(state) {
  if(!state.started||state.ending||!state.threat)return state;
  const s={...state,entries:[...state.entries],threat:{...state.threat},flags:{...state.flags},inventory:[...state.inventory]};
  s.threat.remaining--;
  if(s.threat.remaining<=0) {
    if(s.threat.protected){append(s,'The footsteps stop. Wait. One more breath. It is gone.','warning');advance(s);}
    else {s.ending='caught';s.phase='LOST';s.threat=null;fright(s,CHAPTERS[s.chapter].entity,'TOO LATE. IT KNOWS WHERE YOU ARE.');append(s,'SIGNAL LOST. Retry from the start of this chapter.','danger');}
  }
  return s;
}
export function getObjective(s) {
  if(!s.started)return 'Establish the connection';
  if(s.threat)return s.threat.protected?'Stay still. Do not make a sound.':`${s.threat.response.replaceAll('_',' ')} BEFORE IT REACHES YOU`;
  switch(s.chapter){
    case 0:return !s.inventory.includes('reel tape')?'Find the tape on camera 03':!s.flags.tapePlayed?'Play the recovered tape':'Unlock Ward 13 using the recorded code';
    case 1:return !s.flags.note?'Read the nursery note on camera 02':'Inspect the doll on camera 02';
    case 2:return !s.flags.tones?'Listen to the broken receiver':'Tune the receiver to the three tones';
    case 3:return !s.flags.name?'Read the tag on camera 04':!s.flags.warning?'Play the morgue recording':'Unseal the drawer using the name on its tag';
    case 4:return !s.flags.fuse?'Insert the ceramic fuse':'Restore the circuits in the correct order';
    default:return !s.door?'Release the final containment door':'Decide the fate of the tape. Attempt escape.';
  }
}
export function suggestedActions(s) {
  if(s.threat)return [s.threat.response];
  switch(s.chapter){
    case 0:return !s.inventory.includes('reel tape')?['INSPECT','HINT']:!s.flags.tapePlayed?['PLAY_TAPE','HINT']:['HINT'];
    case 1:return s.flags.note?['INSPECT','HINT']:['READ_NOTE','HINT'];
    case 2:return s.flags.tones?['HINT']:['LISTEN','HINT'];
    case 3:return !s.flags.name?['INSPECT','HINT']:!s.flags.warning?['PLAY_TAPE','HINT']:['HINT'];
    case 4:return !s.flags.fuse?['INSERT_FUSE','STATUS']:['STATUS','HINT'];
    default:return !s.door?['OPEN_DOOR','HINT']:['BURN_TAPE','LIGHTS_OFF','ESCAPE'];
  }
}
export function runCommand(state, raw) {
  const command=raw.trim().toUpperCase().replace(/\s+/g,'_');
  if(!command)return state;
  if(command==='RESET')return initialState();
  if(command==='RETRY'&&state.ending==='caught') {
    const s={...initialState(),...state.checkpoint,started:true,phase:'INVESTIGATION',checkpoint:state.checkpoint,scareSerial:state.scareSerial};
    s.flags={...s.flags};s.inventory=[...s.inventory];s.entries=[entry(`CHECKPOINT / CHAPTER ${s.chapter+1}`,'input'),entry(CHAPTERS[s.chapter].story,'warning')];return s;
  }
  if(command==='CLEAR')return {...state,entries:[]};
  const s={...state,entries:[...state.entries],flags:{...state.flags},inventory:[...state.inventory],threat:state.threat?{...state.threat}:null,sequence:state.sequence+1};
  const say=(t,k)=>append(s,t,k);
  say(`operator@acheron:~$ ${command}`,'input');
  if(state.ending){say('Session terminated. Use RETRY or RESET.','warning');return s;}
  if(!state.started&&command!=='CONNECT'){say('Establish the connection first.','warning');return s;}
  if(s.threat&&command===s.threat.response){s.threat.protected=true;s.hidden=true;if(command==='LIGHTS_OFF')s.dark=true;if(command==='LOOK_AWAY')s.camera=1;say('Do not move. You can hear it breathing.','warning');return s;}
  if(s.threat&&!['HELP','HINT','STATUS','CLEAR'].includes(command)){say(`No time. ${s.threat.response.replaceAll('_',' ')}!`,'danger');return s;}
  const camera=command.match(/^CAMERA_([1-4])$/);
  if(command==='CAMERA'||camera){s.camera=camera?Number(camera[1]):s.camera%4+1;say(`FEED 0${s.camera} / ${CHAPTERS[s.chapter].location}`);if(s.camera===3&&!s.flags.firstFace){s.flags.firstFace=true;fright(s,'void','THAT WAS NOT A REFLECTION.','peek');}return s;}
  switch(command){
    case 'CONNECT':if(s.started)break;s.started=true;s.phase='INVESTIGATION';say(CHAPTERS[0].story,'warning');checkpoint(s);break;
    case 'HELP':say('CAMERA 1–4 / INSPECT / PLAY_TAPE / READ_NOTE / LISTEN');say('Type discovered codes as UNLOCK_<code>, TUNE_<frequency>, UNSEAL_<name>, RESTORE_<order>.');say('HINT / STATUS / LIGHTS_OFF / LIGHTS_ON / OPEN_DOOR / ESCAPE');say('During a hunt, follow the emergency instruction before the countdown ends.');break;
    case 'HINT':say(s.threat?`Use ${s.threat.response}. Stay still until the countdown finishes.`:CHAPTERS[s.chapter].hint,'warning');if(s.chapter===0&&s.flags.tapePlayed)say('The tape says zero-seven-one-three. Type UNLOCK_0713.');if(s.chapter===2&&s.flags.tones)say('Three sixes. Type TUNE_666.');if(s.chapter===3&&s.flags.name&&s.flags.warning)say('Her name is MARA. Type UNSEAL_MARA. Be ready to DISCONNECT.');if(s.chapter===4&&s.flags.fuse)say('Circuit order: 2 → 1 → 3. Type RESTORE_213.');break;
    case 'STATUS':say(`POWER ${s.power}% / CHAPTER ${s.chapter+1} OF 6 / OCCUPANCY ${s.entity?'02':'01'}`);if(s.chapter===4){s.flags.circuits=true;say('MAINTENANCE LABEL: restore breaker 2, then 1, then 3.','warning');}else say(getObjective(s));break;
    case 'INSPECT':
      if(s.chapter===0&&s.camera===3){if(!s.inventory.includes('reel tape'))s.inventory.push('reel tape');say('Found: REEL TAPE. A fingernail scratched “PLAY ME” into its case.','warning');}
      else if(s.chapter===1&&s.camera===2){if(!s.flags.note){say('A note is folded into her hand. READ_NOTE before touching her.');break;}hunt(s,'doll','LOOK_AWAY','SHE MOVED WHEN YOU BLINKED.');}
      else if(s.chapter===3&&s.camera===4){s.flags.name=true;say('DRAWER 04 / MARA VALE / STATUS: STILL LISTENING.','warning');fright(s,'void','YOU HEAR YOUR OWN BREATH FROM THE DRAWER.','peek');}
      else say(`No evidence here. ${CHAPTERS[s.chapter].hint}`);break;
    case 'PLAY_TAPE':
      if(!s.inventory.includes('reel tape')){say('You need to find the reel first. Inspect camera 03.');break;}
      if(s.chapter===0){s.flags.tapePlayed=true;say('[tape hiss] “Ward thirteen. Zero. Seven. One. Three.”','warning');say('A second voice, much closer: “I can see you through the glass.”','danger');fright(s,'doll','SOMETHING IS STANDING BEHIND THE CAMERA.','peek');}
      else if(s.chapter===3){s.flags.warning=true;say('YOUR VOICE: “Whatever speaks after this, DISCONNECT the intercom. Do not answer me.”','danger');}
      else say(s.flags.burned?'The tape is ash. It cannot speak anymore.':'[tape hiss] “Do not let the light carry me out.”','warning');break;
    case 'UNLOCK_0713':if(s.chapter!==0||!s.flags.tapePlayed){say('Find and play the access recording first.');break;}advance(s);fright(s,'doll','WARD 13 IS OPEN. SHE IS AWAKE.','peek');break;
    case 'READ_NOTE':if(s.chapter!==1||s.camera!==2){say('The nursery note is on camera 02.');break;}s.flags.note=true;say('“She only moves when you stare. If her head turns, LOOK AWAY. Count ten heartbeats.”','warning');say('The ink is still wet. INSPECT the doll.');break;
    case 'LISTEN':if(s.chapter!==2){say('A slow scratching. It stops when you listen.','warning');break;}s.flags.tones=true;say('The receiver repeats three tones: SIX. SIX. SIX.','warning');say('Tune to 666. If the audience arrives, HIDE under the desk.');fright(s,'clown','THE LAUGHTER IS GETTING CLOSER.','peek');break;
    case 'TUNE_666':if(s.chapter!==2||!s.flags.tones){say('Listen to the receiver first.');break;}hunt(s,'clown','HIDE','THE PERFORMANCE IS FOR YOU.');break;
    case 'UNSEAL_MARA':if(s.chapter!==3||!s.flags.name||!s.flags.warning){say('Read the tag and listen to the morgue recording first.');break;}if(!s.inventory.includes('ceramic fuse'))s.inventory.push('ceramic fuse');hunt(s,'void','DISCONNECT','YOUR VOICE IS ASKING TO COME INSIDE.');break;
    case 'INSERT_FUSE':if(s.chapter!==4||!s.inventory.includes('ceramic fuse')){say('No compatible fuse. Search the morgue.');break;}s.flags.fuse=true;say('Fuse inserted. STATUS will show the breaker order.');break;
    case 'RESTORE_213':if(s.chapter!==4||!s.flags.fuse||!s.flags.circuits){say('Install the fuse and read the maintenance label with STATUS.');break;}s.power=52;hunt(s,'clown','LIGHTS_OFF','EVERY LIGHT BEHIND YOU JUST TURNED ON.');break;
    case 'OPEN_DOOR':if(s.chapter!==5){say(`Containment locked. Complete chapter ${s.chapter+1}: ${getObjective(s)}.`,'warning');break;}if(s.door){say('The door is already open. Something is waiting outside.');break;}s.door=true;s.phase='DOOR_UNLOCKED';say('EXIT OPEN. OCCUPANCY: TWO. You have not moved.','danger');fright(s,'doll','ONLY ONE OF YOU GETS TO LEAVE.','approach');break;
    case 'BURN_TAPE':if(s.chapter!==5||!s.door){say('Find the incinerator beside the open exit first.');break;}if(s.flags.burned){say('There is nothing left to burn.');break;}s.flags.burned=true;s.inventory=s.inventory.filter(i=>i!=='reel tape');s.inventory.push('ashes');say('Six voices scream together. Then silence. The occupancy counter falls to one.','danger');fright(s,'void','THE RECORDING WAS KEEPING THEM HERE.','impact');break;
    case 'LIGHTS_OFF':s.dark=true;s.entity=true;say('Lighting disconnected. Something keeps breathing after you stop.','warning');break;
    case 'LIGHTS_ON':s.dark=false;say('Emergency lighting restored.');break;
    case 'WHO_ARE_YOU':fright(s,CHAPTERS[s.chapter].entity,'I AM THE PART OF YOU THAT NEVER LEFT.');say('YOU SHOULD NOT HAVE ASKED.','danger');say('“Six rooms. Six people. You were the seventh.”','warning');break;
    case 'ESCAPE':if(s.chapter!==5||!s.door){say('Exit sealed. There are still rooms between you and the surface.','warning');break;}s.ending=!s.dark?'possessed':s.flags.burned?'released':'escaped';s.phase='TERMINATED';s.threat=null;if(s.ending==='possessed')fright(s,'clown','YOU BROUGHT IT HOME.');say(s.ending==='released'?'All six names vanish from the archive. You are finally alone.':s.ending==='escaped'?'You escaped. The tape is still warm.':'The exit counts one. You are not sure which one.','danger');break;
    case 'HIDE':case 'LOOK_AWAY':case 'DISCONNECT':say('Nothing is approaching. Yet.','warning');break;
    default:s.glitch++;say('Command rejected. Something in the walls answers instead.','danger');if(s.sequence%3===0)fright(s,CHAPTERS[s.chapter].entity,'IT HEARS EVERY MISTAKE.','peek');say('Type HELP or HINT.');
  }
  return s;
}
