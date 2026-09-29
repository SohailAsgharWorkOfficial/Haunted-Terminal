import Icon from './Icon.jsx';
export default function Controls({ state, onCommand }) {
  const controls = [{icon:'door', label:state.door ? 'Door open' : 'Open door', cmd:'OPEN_DOOR', detail:'CONTAINMENT OVERRIDE'}, {icon:'bulb', label:state.dark ? 'Lights on' : 'Lights off', cmd:state.dark ? 'LIGHTS_ON' : 'LIGHTS_OFF', detail:'ROOM LIGHTING'}, {icon:'camera',label:'Switch camera',cmd:'CAMERA',detail:'SURVEILLANCE FEED'}];
  return <div className="quick-controls">{controls.map(c => <button key={c.icon} onClick={() => onCommand(c.cmd)} disabled={!!state.ending || (c.icon === 'door' && state.door)}><Icon name={c.icon}/><span>{c.label}<small>{c.detail}</small></span><span className="control-arrow">↗</span></button>)}</div>;
}
