import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const rive = process.env.RIVE_BIN || `${process.env.USERPROFILE}/.rive/bin/rive.exe`;
mkdirSync('artifacts',{recursive:true});
function check(name, actions, expected) {
  const file=`artifacts/native-${name}.json`;
  execFileSync(rive,['haunted-terminal',`--data-dump=${file}`,'--advance=1s',...actions,'--advance=1s'],{stdio:'pipe',timeout:60000});
  const values=Object.fromEntries(JSON.parse(readFileSync(file,'utf8')).viewModel.properties.map(p=>[p.name,p.value]));
  for(const [key,value] of Object.entries(expected)) assert.equal(values[key],value,`${name}: ${key}`);
  console.log(`Native flow passed: ${name}`);
}
const door=['--pointer=click@150,675','--advance=1s'];
const lights=['--pointer=click@450,675','--advance=1s'];
const escape=['--pointer=click@1040,770'];
check('locked-exit',escape,{state:0});
check('silent-exit',[...door,...lights,...escape],{state:6,endingText:'YOU ESCAPED. / No light. No shadow. Nothing to follow.'});
check('possession',[...door,...escape],{state:5,scareOpacity:1});
check('reset',[...door,...escape,'--advance=1s','--pointer=click@1040,840'],{state:0,scareOpacity:0,endingText:''});
check('easter-egg',['--data=currentCommand=WHO_ARE_YOU'],{state:4});
check('camera',['--pointer=click@700,675'],{cameraText:'REC   CAM_02 / EAST CORRIDOR'});
check('keyboard-focus',['--key=enter'],{state:0});
