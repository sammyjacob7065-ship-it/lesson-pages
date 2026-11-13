# Lesson Pages

Students open a link, **watch the lesson video at the top**, and **answer the quiz under it**
(green/red feedback, hint, and a final score).

This repo is filled in **automatically** by the Movie Factory workflow. You do not edit anything here for a new lesson.

## How it works
1. You send a script to the Telegram bot. It has a `QUIZ:` block (or starts with `/Developer`).
2. The video is built.
3. The workflow saves `lessons/<lesson-name>.json` in this repo (the video link and the questions).
4. The bot sends you a link like `https://YOUR-NAME.vercel.app/?lesson=<lesson-name>` (your Vercel address).
5. You share that link with students, schools or clients. Add it to the YouTube description too.

## What is in this repo
| File | What it does |
|------|--------------|
| `index.html` | The lesson page (video on top, quiz under it, score at the end). One page for every lesson. |
| `lessons/*.json` | One file per lesson: its video link and questions. Made by the workflow. |
| `README.md` | This guide. |

## Write the quiz in the script
```
QUIZ:
Q1: How long should a cold email be?
A) Very long
B) Short and clear *
C) As long as possible
GOOD: Correct! Short and clear wins.
HINT: People read on their phones.

Q2: True or false: follow up after a few days.
ANSWER: True

NEXT LESSON: Ready for the next lesson!
```
- Any number of questions. Mark the right answer with `*` or write `ANSWER: B` (or `ANSWER: True`).
- `GOOD`, `HINT` and `NEXT LESSON` are optional.

## Make the video itself interactive (optional)
Start the script with `/Developer` and add `SCREEN:` and `STEPS:` lines. A real browser opens this page and films it:
`STEPS: answer wrong ; next ; answer all` or `click "Text"`, `type "Jacob" in "Name"`, `scroll down`, `wait 2s`.
A scene with a `SCREEN:` line becomes a live page. Without `/Developer`, only the scenes that have `SCREEN:` are live.

## If something does not work
- The repo `lesson-pages` can be Public or Private. Vercel shows the page; GitHub only stores it.
- Students never need GitHub: they only open the Vercel link.
- The first time, the link can take 1-2 minutes to start working.
- The GitHub token in n8n needs the **repo** permission.
- If the page cannot be published, the bot tells you why. The video is not affected.


## One-time Vercel setup (5 minutes, free)
1. Go to vercel.com and sign up with GitHub.
2. Add New, Project, pick the `lesson-pages` repo, Import.
3. Framework Preset: **Other**. Leave everything else empty. Click **Deploy**.
4. Copy your address (like `https://lesson-pages.vercel.app`).
5. In the n8n node "Assemble: Publish Lesson Page", paste it in the line `siteUrl` (already set to https://lesson-pages.vercel.app in the v84 workflow), Save.
6. After that, every new lesson is saved to the repo, and Vercel updates the page by itself in about 30 seconds.

Note: Vercel's free Hobby plan is for personal, non-commercial use. If this becomes a paid course, move the same repo to Cloudflare Pages or Netlify (also free), or upgrade Vercel.

## v88 features (all controlled by the script)

### Student page
- **Captions (CC button)** show in a black strip under the video, and a **Transcript** panel highlights the line being spoken. Tap a line to jump there. (The strip is not shown in the browser's full-screen mode.)
- **Bell** shows only when the script has `ANNOUNCEMENT:` lines. No lines = no bell.
  `ANNOUNCEMENT: Homework | Write three things you remember.` (tags: Homework, Next class, Important notice)
- **Ask the Teacher** chat answers only from the lesson. Switch off with `CHATBOT: off`.

### Staff introduction cards (any script)
`STAFF: Role | Name | photo link | optional line for the voice`
Each person gets a motion card after scene 1 (photo slides in, ring draws, name rises, position pops, soft whoosh). Without a photo link the card shows initials.

**Easiest way, straight from Telegram:** after `/newprompt`, send each person's **photo** to the bot with a caption:
`CEO | Engineer WILLIAMS` (position, then name; an optional 3rd part is what the voice should say).
The bot saves the picture and writes the `STAFF:` line for you, then replies "Staff photo saved". Send the script text before or after, then press Prompt Complete.
Tips: one photo per message (in an album only a captioned photo works); no caption = the bot asks you to send it again. You can also type your own `STAFF:` line with a public image link instead.

### Pass mark and report email (/Developer scripts)
```
REPORT_TO: boss@gmail.com
PASS_MARK: 100
COMPANY NAME: BrightCare Home
```
- The test only opens after the student watches the video (jumping to the end does not count).
- Below the pass mark: "Watch the video again", then retake. Attempts are counted.
- At or above it: a form asks for **name and email**, and the report goes to `REPORT_TO` (up to 3 addresses): every attempt (First 60%, Second 80%, Third 100%), overall score, attempts, pass/fail. Replying to the email goes to the student.
- The boss's address stays in Supabase. It is never put on the public page.
- `PASS_MARK` alone (no `REPORT_TO`) = the gate only, no form.

### One-time Vercel settings (Project, Settings, Environment Variables, then Redeploy)
| Name | Value |
|---|---|
| `GROQ_API_KEY` | your Groq key (for Ask the Teacher) |
| `SENDER_EMAIL` | the sender address verified in Brevo |
| `BREVO_API_KEY` | your Brevo API key (free account at brevo.com) |
| `SUPABASE_URL` | same as in n8n |
| `SUPABASE_KEY` | the same service key used in n8n |

Honest limits: scores are recorded by the page in the student's browser, so a very determined person could fake a report. For legal or paid certification, add a server-side exam later. Brevo free sends 300 emails a day. Vercel Hobby is non-commercial.
