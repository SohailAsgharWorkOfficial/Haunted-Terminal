// Local synthesis only. Every voice runs through one bounded master gain.
export function createHorrorAudio() {
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return null;
  const ctx=new Ctx();
  const master=ctx.createGain();master.gain.value=.22;
  const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-15;compressor.ratio.value=10;master.connect(compressor);compressor.connect(ctx.destination);
  const drone=ctx.createOscillator();drone.type='sine';drone.frequency.value=43;
  const droneGain=ctx.createGain();droneGain.gain.value=.085;drone.connect(droneGain);droneGain.connect(master);drone.start();
  const noise=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.7;
  function tone(freq,duration,volume,type='sine',delay=0){const t=ctx.currentTime+delay;const osc=ctx.createOscillator();const gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,t);osc.frequency.exponentialRampToValueAtTime(Math.max(20,freq*.5),t+duration);gain.gain.setValueAtTime(.001,t);gain.gain.linearRampToValueAtTime(volume,t+.012);gain.gain.exponentialRampToValueAtTime(.001,t+duration);osc.connect(gain);gain.connect(master);osc.start(t);osc.stop(t+duration+.03);osc.onended=()=>{osc.disconnect();gain.disconnect();};}
  function breath(volume=.12,duration=.8,frequency=700){const source=ctx.createBufferSource();source.buffer=noise;const filter=ctx.createBiquadFilter();filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=2;const gain=ctx.createGain();gain.gain.setValueAtTime(.001,ctx.currentTime);gain.gain.linearRampToValueAtTime(volume,ctx.currentTime+.07);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);source.connect(filter);filter.connect(gain);gain.connect(master);source.start();source.stop(ctx.currentTime+duration);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};}
  return {resume:()=>ctx.resume(),pause:()=>ctx.suspend(),close:()=>ctx.close(),heartbeat(){tone(65,.19,.18);tone(52,.22,.11,'sine',.23);},knock(){tone(100,.18,.15,'triangle');tone(85,.2,.11,'triangle',.45);},scare(entity,calm){const v=calm?.12:.3;breath(v,1.1,entity==='clown'?1400:750);tone(entity==='doll'?490:entity==='clown'?110:65,.85,v,'sawtooth');tone(43,1.4,.23);},whisper(){breath(.09,1.3,450);}};
}
