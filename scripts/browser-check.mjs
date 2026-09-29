import { chromium } from '@playwright/test';
import { mkdirSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const installed=`${process.env.LOCALAPPDATA}/ms-playwright/chromium-1208/chrome-win64/chrome.exe`;
const browser=await chromium.launch({headless:true,...(existsSync(installed)?{executablePath:installed}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1080},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
mkdirSync('artifacts',{recursive:true});
try{
  await page.goto('http://127.0.0.1:5173',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Establish connection'}).waitFor();
  await page.screenshot({path:'artifacts/horror-intro.png',fullPage:true});
  await page.getByRole('button',{name:'Sound enabled',exact:true}).click();
  await page.getByRole('button',{name:'Establish connection'}).click();
  const input=page.getByRole('textbox',{name:'Terminal command'});
  async function command(value){await input.fill(value);await input.press('Enter');}
  async function waitChapter(n){await page.locator('.story-panel>.section-label').first().filter({hasText:`CHAPTER 0${n} / 06`}).waitFor({timeout:16000});}
  await page.screenshot({path:'artifacts/horror-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Camera 3',exact:true}).click();await command('INSPECT');await command('PLAY_TAPE');
  await input.fill('UNLOCK');await input.press('Tab');assert.equal(await input.inputValue(),'UNLOCK_0713');await input.press('Enter');await waitChapter(2);
  await input.press('ArrowUp');assert.equal(await input.inputValue(),'UNLOCK_0713');await input.fill('');
  await command('CAMERA_2');await command('READ_NOTE');await command('INSPECT');
  await page.waitForTimeout(1200);await page.screenshot({path:'artifacts/horror-doll-hunt.png',fullPage:true});
  await command('LOOK_AWAY');
  await page.getByRole('button',{name:/PAUSE/}).click();const seconds=await page.locator('.emergency-strip>b').textContent();await page.waitForTimeout(1600);assert.equal(await page.locator('.emergency-strip>b').textContent(),seconds,'Pause freezes threat countdown');await page.getByRole('button',{name:'Resume session'}).click();await waitChapter(3);
  await command('LISTEN');await command('TUNE_666');await command('HIDE');await waitChapter(4);
  await command('CAMERA_4');await command('INSPECT');await command('PLAY_TAPE');await command('UNSEAL_MARA');await command('DISCONNECT');await waitChapter(5);
  await command('INSERT_FUSE');await command('STATUS');await command('RESTORE_213');await command('LIGHTS_OFF');await waitChapter(6);
  await command('OPEN_DOOR');await command('BURN_TAPE');await command('LIGHTS_OFF');await command('ESCAPE');
  await page.getByRole('heading',{name:'For the first time, silence.'}).waitFor();await page.screenshot({path:'artifacts/horror-ending.png',fullPage:true});
  await page.getByRole('button',{name:'Start a new session'}).click();await page.getByRole('button',{name:'Establish connection'}).click();
  await command('CAMERA_3');await command('INSPECT');await command('PLAY_TAPE');await command('UNLOCK_0713');await command('CAMERA_2');await command('READ_NOTE');await command('INSPECT');
  await page.getByRole('heading',{name:'It found you.'}).waitFor({timeout:16000});await page.getByRole('button',{name:'Retry chapter 2'}).click();await waitChapter(2);
  await page.getByRole('button',{name:'Sound off',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Sound on',exact:true}).getAttribute('aria-pressed'),'true');await page.getByRole('button',{name:'Sound on',exact:true}).click();
  await page.getByRole('button',{name:'Full effects',exact:true}).click();await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/horror-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile does not overflow');
  assert.ok(await page.locator('.corridor-photo').evaluate(img=>img.complete&&img.naturalWidth>0),'Scene image loaded');
  assert.deepEqual(errors,[],'No browser runtime errors');
  console.log('Browser passed: six-chapter playthrough, release ending, death/checkpoint retry, pause timer, hints, input history/autocomplete, sound, gentle mode, mobile, image loading.');
}finally{await browser.close();}
