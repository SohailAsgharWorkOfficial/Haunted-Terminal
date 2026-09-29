# Challenge handoff

## What is implemented

- Native RML scene built and verified with Rive CLI 1.2.0.
- Editable named shapes for the room, CRT monitor, ghost, door, racks, controls, and labels.
- Seven narrative states: Idle, Investigation, GhostVisible, DoorOpening, Possessed, Jumpscare, Escape.
- View model binding for pointer tracking, room lighting, door scale, scene status, terminal text, and state transitions.
- Four live WGSL shaders rendered through Rive GPU Canvas.
- Native typed commands, clickable controls, secret command, and two endings.
- A separate responsive React game with six chapters, photographic threats, code puzzles, timed pursuits, checkpoint retries, three endings, keyboard history, and synthesized horror audio. These campaign features belong to the React game; the native Rive prototype remains the shorter two-ending experience described above.

## Manual Rive Editor pass (still to do)

These changes require a human/editor session. Do not claim they have already happened.

1. Transfer the native project into your Rive account or produce an editor archive using the installed CLI's authenticated workflow (`rive docs publishing`, `rive docs push`).
2. Refine ghost shape, facial expression, and hand-drawn details.
3. Tune warning-light animation curves and narrative transition timings.
4. Adjust color, typography, and the door's pivot/opening motion.
5. Review the two endings and darkness visibility in the editor.
6. Export/sign a release after saving those changes. Do not regenerate `scene.rml` over editor changes; pull into a separate copy first.

Local unsigned scripted `.riv` files are previewed with the native CLI. Signing requires a logged-in Rive account. `rive haunted-terminal --publish` signs a local runtime file; `--publish=web` publishes a page. Run publication commands only when ready to publish.

## Suggested 45-second recording

| Time | Footage |
| --- | --- |
| 0–4s | Native scene and title |
| 4–10s | `scene.rml`, WGSL source, and successful `rive:verify` |
| 10–18s | Move pointer; demonstrate delayed ghost motion and cameras |
| 18–25s | Show the fog, scanlines, glow, and light pass |
| 25–32s | Type `WHO_ARE_YOU` and show the response |
| 32–39s | Open the door, then escape with the lights on |
| 39–45s | Reset; end card naming the actual tools used |

Record the native CLI preview when presenting the GPU Canvas effects. The React companion is an alternate browser experience, not evidence that its CSS effects came from Rive.

## Honest submission draft

The Haunted Terminal is an interactive analog-horror experience built around a possessed research terminal. Users investigate a surveillance feed, type commands, reveal an entity, and choose between two endings. The native implementation uses Rive CLI and RML, Luau interaction logic, view model data binding, a seven-state narrative machine, and four custom WGSL effects rendered with GPU Canvas. A separate React companion provides a responsive browser version.

After actually completing the editor pass, add a specific sentence describing the refinements you made. Verify the current challenge rules and deadline before submitting; no social post, account upload, or public deployment has been performed by this project.
