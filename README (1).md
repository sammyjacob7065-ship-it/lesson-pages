# Lesson Pages

An interactive lesson page for the Movie Factory. The page shows a quiz with instant green/red feedback and a final score.
The video builder opens this page in a real browser, clicks the answers, and films it, so every lesson video has a live, interactive screen.

**You never edit this page for a new lesson.** The questions come from your script.

## What is in this repo
| File | What it does |
|------|--------------|
| `index.html` | The lesson page (video on top, quiz under it, score at the end). |
| `README.md` | This guide. |

## Use it in a video script
1. Send `/newprompt` to your Telegram bot.
2. Send your script. The first line is `/Developer`.
3. In scene 1 add the link to this repo, then the steps to film:

```
/Developer
TITLE: My Lesson
SCENE 1:
IMAGE: A clean lesson page with a quiz card, the whole page inside the frame.
SCREEN: https://github.com/YourName/lesson-pages
STEPS: wait 1s ; answer wrong ; next
NARRATION: Here is question one...
```
4. Put the quiz at the end of the script (format below).
5. Send `/complete`.

A scene with no `SCREEN:` keeps the screen of the scene before it, so what was clicked stays.

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
- Any number of questions.
- Mark the right answer with `*` after it, or write `ANSWER: B` (or `ANSWER: True`).
- `GOOD`, `HINT` and `NEXT LESSON` are optional.

## What you can write in STEPS
Separate steps with `;`

| Step | What the video shows |
|------|----------------------|
| `answer` | Cursor clicks the right answer (green) |
| `answer wrong` | Cursor clicks a wrong answer (red, hint shown, right answer in green) |
| `answer all` | Answers every remaining question, then the score screen |
| `next` | Clicks the Next button |
| `click "Text"` | Clicks a button or link with that text |
| `type "Jacob" in "Name"` | Types into a field |
| `scroll down` / `scroll up` / `scroll to "Text"` | Scrolls the page |
| `hover "Text"` | Moves the cursor there |
| `wait 2s` | Pauses |
| `zoom 125%` | Makes the page bigger |

## Add your own video above the quiz (optional)
Open `index.html` and find the line with `id="video"`. Put a YouTube embed link in `data-embed=""`, or an .mp4 link in `data-src=""`.

## Share the page with a client (optional)
Go to **Settings → Pages**, choose branch `main`, and tap Save. After a minute you get a live link like
`https://yourname.github.io/lesson-pages/`. Without the video builder the page shows its sample questions.
To show your own questions on that link, add a file `lessons/your-lesson.json` (see the example below) and open
`https://yourname.github.io/lesson-pages/?lesson=your-lesson`.

```json
{
  "title": "My Lesson",
  "nextLesson": "Ready for the next lesson!",
  "questions": [
    {"q": "Question?", "o": ["Option 1", "Option 2", "Option 3"], "a": 1, "good": "Correct!", "hint": "A hint."}
  ]
}
```
`a` is the right option, counting from 0.

## If something does not work
- The repo must be **Public**.
- The file must be named exactly `index.html`.
- If the page can't open, that scene keeps its normal picture. Open the GitHub Actions log and look for a line starting with `::warning::`.
- A site that blocks bots (not this page) may also fall back to the picture.
