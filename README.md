# The Haunted Terminal

An interactive analog horror game set beneath Acheron Research's abandoned hospital. Follow a missing sister's recording through six chapters, evade four different pursuits, and discover three endings.

## Run the web experience

Requires Node.js 20.19+ or 22.12+.

```powershell
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. For a production build, run `npm run build`, then `npm run preview`.

The React game includes a cinematic hospital scene, the supplied doll/clown/shadow-face photographs, sudden camera apparitions and full-screen scare sequences, evidence inventory, code puzzles, timed survival encounters, chapter checkpoints, and three story endings. Local audio synthesis supplies a low drone, breaths, knocks, heartbeat, and distinct scare impacts. Audio starts only after **Establish connection**; you can disable it on the intro screen or mute during play. Gentle effects and system reduced-motion settings are respected.

**Escape pauses the game**, including the pursuit timer and audio. Switching to another tab also pauses it. Use **HINT** whenever you are stuck. The highlighted action buttons work on mobile; clues provide the commands you need to type for puzzles.

The expanded six-chapter campaign is the **React web game**. The native Rive project below remains the original shorter GPU Canvas prototype with two endings; it has not been presented as implementing the new campaign.

## Run the native Rive experience

The actual Rive project is **`haunted-terminal/`**. It contains an editable RML artboard, seven narrative states, a view model, native keyboard/pointer handling in Luau, and **four working WGSL GPU Canvas passes**: CRT interference, drifting fog, spectral glow, and light flicker.

```powershell
npm run rive:verify
npm run rive:preview
```

The PowerShell launcher finds `rive` on PATH or at `%USERPROFILE%\.rive\bin\rive.exe`. Install the [Rive CLI](https://rive.app/docs/cli/overview) if neither exists.

Direct commands, with the CLI on PATH:

```powershell
rive haunted-terminal --verify
rive inspect haunted-terminal --summary
rive haunted-terminal --screenshot --advance=1s
rive haunted-terminal
```

Use the three controls beneath the room, or type commands and press Enter. The Escape and Restart controls are on the right. All major room elements are named RML shapes and nodes; ghost position, door opening, darkness, terminal text, and narrative transitions use data binding.

The browser game renders photographs with CSS composition. It **does not embed the unsigned Rive build** and its effects should not be described as Rive GPU Canvas. Native Rive is the CLI/GPU Canvas prototype for the challenge. Local scripted `.riv` builds must be signed before a web runtime can load them; see the [Rive publishing documentation](https://rive.app/docs/cli/overview) and `rive docs publishing`.

## Commands

| Command | Action |
| --- | --- |
| `HELP` | List available commands and a clue |
| `HINT` | Show a contextual clue and a puzzle command after evidence is found |
| `STATUS` | Inspect power, security, and the entity |
| `CAMERA` / `CAMERA_1` through `CAMERA_4` | Cycle or select a surveillance viewpoint |
| `INSPECT` / `READ_NOTE` / `PLAY_TAPE` / `LISTEN` | Collect evidence and reveal clues |
| `UNLOCK_<code>` / `TUNE_<frequency>` / `UNSEAL_<name>` / `RESTORE_<order>` | Solve evidence-based puzzles |
| `LOOK_AWAY` / `HIDE` / `DISCONNECT` / `LIGHTS_OFF` | React to the corresponding pursuit; stay still until it passes |
| `INSERT_FUSE` | Repair the generator after recovering the morgue fuse |
| `OPEN_DOOR` | Open the exit in the final chapter |
| `BURN_TAPE` | Decide the fate of the recording at the open exit |
| `LIGHTS_OFF` / `LIGHTS_ON` | Change lighting and reveal the eyes |
| `WHO_ARE_YOU` | Trigger the hidden possession sequence |
| `ESCAPE` | Attempt the ending; the door must be open |
| `CLEAR` | Clear the terminal log, keeping progress |
| `RESET` | Start a fresh session |
| `RETRY` | Return to the current chapter checkpoint after being caught |

In the React app, use Up/Down for command history and Tab to complete an unambiguous command. Spaces also work: `open door` becomes `OPEN_DOOR`.

<details><summary>Campaign walkthrough and ending spoilers</summary>

1. Reception: `CAMERA_3`, `INSPECT`, `PLAY_TAPE`, `UNLOCK_0713`.
2. Nursery: `CAMERA_2`, `READ_NOTE`, `INSPECT`, then `LOOK_AWAY` before the countdown ends. Wait for the footsteps to stop.
3. Performance: `LISTEN`, `TUNE_666`, then `HIDE`. Wait.
4. Morgue: `CAMERA_4`, `INSPECT`, `PLAY_TAPE`, `UNSEAL_MARA`, then `DISCONNECT`. Wait.
5. Generator: `INSERT_FUSE`, `STATUS`, `RESTORE_213`, then `LIGHTS_OFF`. Wait.
6. Exit: `OPEN_DOOR`. Burn the tape and turn off the lights before `ESCAPE` to free all six victims. Leave the tape intact in the darkness for the haunted escape. Leaving with the lights on lets the entity follow you.

Each pursuit lasts ten seconds. The correct action protects you; the remaining countdown is the tense wait for the entity to pass. Failure returns a checkpoint retry, not a forced replay of earlier chapters.

</details>

## Project map

```text
src/                      Six-chapter React game, sound synthesis, scene composition
public/horror/            Supplied threat images and generated hospital environment
haunted-terminal/
  scene.rml               Editable native scene and state machine
  terminal.luau           Native command parser and interaction controller
  effects.luau            GPU resources and rendering
  *.wgsl                  Four shaders used by the Rive build
  assets/                 Embedded open-source font
  build/                  Native .riv, screenshots, and diagnostic logs
shaders/                  Copies of the WGSL sources for convenient inspection
scripts/                  Launchers, authoring helper, browser/native checks
tests/                    Gameplay regression tests
artifacts/                Desktop/mobile captures and native test reports
docs/                     Challenge recording and manual refinement checklist
```

`node scripts/build-rive-scene.mjs` regenerates the RML and both shader locations. **It overwrites those generated files**; edit the generator for reproducible changes or edit `scene.rml` directly and stop regenerating it. Luau files are maintained separately.

## Verification

```powershell
npm test
npm run build
npm run rive:verify
node scripts/check-native.mjs
# With the web dev server running:
node scripts/browser-check.mjs
```

Browser checks use Playwright Chromium. If a compatible browser is not installed, run `npx playwright install chromium`. `RIVE_BIN` can override the native test runner's CLI location.

The project runs locally without a backend, API keys, or a Rive account. Sessions are deliberately ephemeral; refresh restarts the investigation. Nothing is published automatically. Rive Editor manual refinement, account signing/export, and the final submission recording remain separate human steps; see `docs/SUBMISSION.md`.

Image provenance and the exact environment-generation prompt are recorded in `docs/HORROR-ASSETS.md`. The supplied photographs retain their source contents. The generated environment is saved inside this project; there are no references to personal Desktop paths at runtime.
