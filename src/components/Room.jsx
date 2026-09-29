import { useRef } from 'react';
import { CHAPTERS } from '../game.js';
export default function Room({state, calm, scare}) {
  const room=useRef(null);
  const chapter=CHAPTERS[state.chapter];
  const closeup=(state.chapter===1&&state.camera===2)||(state.chapter===2&&state.camera===3)||(state.chapter===3&&state.camera===4)||(state.chapter===5&&state.door);
  function track(e){if(calm)return;const r=e.currentTarget.getBoundingClientRect();room.current.style.setProperty('--mx',`${((e.clientX-r.left)/r.width-.5)*18}px`);room.current.style.setProperty('--my',`${((e.clientY-r.top)/r.height-.5)*12}px`);}
  return <div ref={room} onPointerMove={track} className={`room horror-room chapter-${state.chapter} camera-${state.camera} ${state.dark?'lights-out':''} ${state.hidden?'hiding':''} ${state.threat?'hunted':''}`} role="img" aria-label={`${chapter.location}. Camera ${state.camera}. ${state.hidden?'You are hiding.':state.entity?'A presence is watching.':''}`}>
    <img className="corridor-photo" src="/horror/corridor.png" alt="" fetchPriority="high"/>
    {closeup&&!state.hidden&&<img className={`resident resident-${chapter.entity}`} src={`/horror/${chapter.entity}.jpg`} alt=""/>}
    {state.chapter===0&&state.camera===3&&<span className="evidence-marker">⌖ EVIDENCE DETECTED<br/><small>INSPECT THE WHEELCHAIR</small></span>}
    {state.chapter===3&&state.camera===4&&<span className="evidence-marker morgue-tag">DRAWER 04 / MARA VALE<br/><small>STILL LISTENING</small></span>}
    {state.threat&&!state.hidden&&<img className="approaching-entity" style={{'--distance':1+(10-state.threat.remaining)*.12}} src={`/horror/${state.threat.entity}.jpg`} alt=""/>}
    <div className="fog fog-one"/><div className="room-vignette"/><div className="scanlines"/><div className="film-scratches"/>
    <div className="camera-caption"><span className="record-dot"/> REC <span>CAM_0{state.camera} / {chapter.location}</span></div>
    <div className="camera-corner top-left"/><div className="camera-corner top-right"/><div className="camera-corner bottom-left"/><div className="camera-corner bottom-right"/>
    <div className="room-bottom"><span>{state.threat?'MOTION DETECTED — DISTANCE CLOSING':'NO PERSONNEL AUTHORIZED ON THIS FLOOR'}</span><span>28.10.1986 / 03:33</span></div>
    {state.dark&&!state.hidden&&<div className="dark-eyes"><i/><i/></div>}
    {state.hidden&&<div className="hiding-veil"><div/><span>DON'T. MOVE.</span><small>{state.threat?.response==='DISCONNECT'?'INTERCOM DISCONNECTED. YOU CAN STILL HEAR IT.':'Something is breathing on the other side.'}</small></div>}
    {scare&&scare.variant==='peek'&&<div className="feed-apparition" key={scare.id}><img src={`/horror/${scare.entity}.jpg`} alt="A face suddenly appears in the camera"/><span>{scare.caption}</span></div>}
  </div>;
}
