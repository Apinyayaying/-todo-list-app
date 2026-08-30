# To-Do List

A simple, responsive to-do list app built with plain HTML, CSS, and JavaScript — no frameworks, no build tools.
Tasks are saved in the browser using `localStorage`, so your list is still there when you come back.

🔗 **Live demo:** https://YOUR-USERNAME.github.io/todo-list-app/
*(replace YOUR-USERNAME with your actual GitHub username)*

## Features
- Add, complete, and delete tasks
- Optional due date per task, with a visual "overdue" warning if the date has passed
- Filter tasks by All / Active / Completed
- Progress bar showing % of tasks completed
- Empty-state message when there's nothing to show
- Smooth enter/exit animations when tasks are added or removed
- Data persists across page reloads via `localStorage`

## Tech stack
HTML5, CSS3, vanilla JavaScript (ES6+). No frameworks or external libraries.

## Project structure
```
index.html   # Page structure and form
style.css    # Layout, earth-tone theme, and animations
script.js    # App logic: state, rendering, localStorage
```

## Run it locally
No build step needed. Just clone the repo and open `index.html` in your browser:
```bash
git clone https://github.com/YOUR-USERNAME/todo-list-app.git
cd todo-list-app
```
Then double-click `index.html`, or open it with your browser directly.

## What I learned
Building this project helped me practice:
- DOM manipulation without a framework
- Managing application state as a plain JavaScript array
- Persisting data in the browser with the Web Storage API (`localStorage`)
- CSS animations tied to JavaScript-driven class changes
