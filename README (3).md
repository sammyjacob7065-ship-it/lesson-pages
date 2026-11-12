# Lesson Pages

Students open a link, **watch the lesson video at the top**, and **answer the quiz under it**
(green/red feedback, hint, and a final score).

This repo is filled in **automatically** by the Movie Factory workflow. You do not edit anything here for a new lesson.

## How it works
1. You send a script to the Telegram bot. It has a `QUIZ:` block (or starts with `/Developer`).
2. The video is built.
3. The workflow saves `lessons/<lesson-name>.json` in this repo (the video link and the questions).
4. The bot sends you a link like `https://YOURNAME.github.io/lesson-pages/?lesson=<lesson-name>`.
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
- The repo must be **Public**, and GitHub Pages must be on (Settings, Pages, Branch main, Save). The workflow tries to switch it on for you.
- The first time, the link can take 1-2 minutes to start working.
- The GitHub token in n8n needs the **repo** permission.
- If the page cannot be published, the bot tells you why. The video is not affected.
