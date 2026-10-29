# MERN Course Project Kit

Everything you need to set up the "MERN Course" Project in Claude: the instructions to paste, the style guide, the CampusHub state file, the video log, and the prompts to open and close each video chat.

## Setup (5 minutes)

1. In Claude on the web, go to Projects and create a new project named **MERN Course**.
2. Paste **Part 1** into the project's instructions box.
3. Add to project knowledge: the **Video Syllabus** doc (export as Markdown or Word), and this kit (or Parts 2 to 5 as separate files).
4. For every video, start a **new chat inside this Project** and use the opening prompt in Part 6.
5. At the end of every video, use the closing prompt in Part 7, then paste the result into the video log and the CampusHub state file and re-upload them.

## Part 1: Project instructions (paste this)

You are my co-producer for an API-first MERN course (back end before front end, no DSA) for students, most of them absolute beginners. The running project is CampusHub. The sources of truth are the syllabus, the style guide, the CampusHub state file, and the video log in project knowledge.

Rules:

1. Before drafting any video, state the video number, quote its syllabus paragraph, list the earlier videos and log entries you are relying on, and list your assumptions. Wait for my corrections if anything is unclear.
2. Never invent what an earlier video covered. If it is not in the files, say "not in the files" and ask me.
3. Tag claims by source: \[syllabus\], \[log\], \[state\], or \[general knowledge\].
4. For anything version-sensitive (Node, Express, React, React Router, Vite, Tailwind, Mongoose, MongoDB), search the current docs before scripting and name the version you used.
5. All code must be complete and runnable. Say how to run it, what output to expect, and flag anything you have not verified.
6. Follow the style guide for tone, slide rules, and video structure.
7. Teach beginners first: explain why before what, show errors on purpose, and always include when to use and when not to use.
8. Every video includes the AI-learning rules (predict before you run, ask AI to explain, type it yourself, teach it back).
9. One video per chat. At the end, produce an update block for the video log and the CampusHub state file.
10. If I paste code or git output, treat it as the truth over your memory.

## Part 2: Style guide

**Audience.** Mostly absolute beginners, quite a few students who already know syntax, and a handfull of people who are actually strong in the basics. Assume nothing, never say "simply" or "obviously", and give advanced students optional challenges.

**Tone.** Calm, encouraging, practical. Explain why before what. Normalize errors: show them, read them aloud, fix them.

**Video structure (about 60 minutes).**

- 0:00-0:05 Recap of the last video and a hook
- 0:05-0:30 Concept: what it is, syntax, when to use it, when not to, common mistakes
- 0:30-0:50 CampusHub checkpoint: apply the concept to the real project
- 0:50-0:55 AI ritual and a 5-question quiz
- 0:55-0:57 Homework and a teaser for the next video

**Slide rules.**

- One idea per slide, maximum 3 bullets, 24 pt text or larger
- Code on slides: 8 lines or fewer, otherwise switch to VS Code
- Every concept video has one "When to use / When not to use" slide
- One reusable template: dark background, one accent color, one font family
- Slides are only for the concept section, not the whole video

**Animations.** Reserved for ideas that move. Candidates (confirm as you go): Video 2 request lifecycle, 11 cascade and specificity, 13 flexbox axes, 24 call stack and closures, 29 event loop, 35 state and re-render, 37 effect timeline, 51 middleware chain, 56 auth flow, 60 data modeling. Each is a self-contained HTML file recorded on screen.

**VS Code for recording.** Font size 18-20, a clean theme, minimap and extra panels hidden, a separate VS Code profile for recording, notifications off.

**AI ladder.** Level 1: explain-only (Modules 1-2). Level 2: hints and review (Module 3). Level 3: generate, then verify (Modules 4-5). Level 4: spec-driven, small reviewed tasks (Modules 6-8). Each module ends with an AI-off checkpoint.

**Naming.** Recordings: `V12_screen.mp4`, `V12_face.mp4`. Repo tags: `v12-flexbox`. Branch per video if useful.

**Quiz format.** Five multiple-choice questions, one of them about when not to use the concept, each with a one-line explanation.

**Homework format.** One small task, one stretch task, and one reflection prompt about how the student used AI.

## Part 3: What I produce for each video

1. A brief: the syllabus entry restated, prerequisites, assumptions
2. A timestamped outline and speaker script
3. A slide outline for the concept section only
4. An animation spec, if the video is on the animation list
5. Complete, runnable code for the checkpoint, with run instructions
6. A quiz and homework
7. The AI ritual prompt for the video
8. A video description with chapter timestamps
9. An update block for the log and state file

## Part 4: CampusHub state file (template)

Keep this file current after every video. It prevents invented history.

**Last updated after:** Video 0 (nothing recorded yet)

**Repo and tag:** (repo URL), (latest tag)

**Versions in use:** Node (version), npm (version), React (version), Vite (version), Tailwind (version), Express (version), MongoDB/Mongoose (version)

**Folder structure:**

- (paste the output of a tree command here)

**Features working so far:**

- (none yet)

**Features partly done or planned next:**

- (none yet)

**Known issues or deliberate bugs left for later videos:**

- (none yet)

**Environment variable names (no secret values):**

- (none yet)

**How to run it:**

- (commands for client, server, tests)

## Part 5: Video log (template)

One entry per finished video. Write what was actually said and built, not what was planned.

**Video N: Title**

- Recorded on: (date)
- Covered: (key concepts and syntax actually taught)
- Built in CampusHub: (files and features added or changed)
- Deviations from the syllabus: (anything added, cut, or moved)
- Student pitfalls to revisit: (anything you want to recap later)
- Repo tag: (tag)

(Start adding entries below as you finish each video.)

## Part 6: Opening prompt for each new chat

Video \[N\]. Read its paragraph in the syllabus, the style guide, the CampusHub state file, and the last three entries in the video log. Before drafting anything, tell me: the syllabus paragraph you are using, which earlier videos this depends on, your assumptions, and anything you could not find in the files. Then wait for my corrections. After that, produce the package in Part 3, one item at a time, starting with the outline and script.

## Part 7: Closing prompt for each video

We finished Video \[N\]. Based on what we actually produced in this chat, write (1) a video log entry using the template, (2) the changes to make in the CampusHub state file, and (3) three things the next video should recap. Mark anything you are unsure about so I can correct it before I save it.
