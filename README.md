# glingus.space

Windows 98 style landing page, served by GitHub Pages at https://glingus.space.

## Editing

Everything you normally change is in **`index.html`**. Each window is one
`<section class="app">` block; the desktop icon, Start menu entry, title bar and
taskbar button are generated from it. The comment at the top of `index.html`
lists the options. Push to `main` and the site updates in about a minute.

- Window looks/controls: [98.css](https://jdan.github.io/98.css/) (MIT, vendored in `lib/`).
  Its docs page shows every control you can use inside a window.
- Desktop colour: `--desktop-bg` at the top of `desktop.css`.
- Icons: `icons/*.svg`. They are drawn as text pixel grids in
  `icons/make-icons.py`; edit a grid and run `python3 icons/make-icons.py icons`.
  Any other image works too: `data-icon="pics/thing.png"`.
- `desktop.js` is the window manager (drag, focus, minimize, maximize,
  taskbar, Start menu, clock). You shouldn't need to touch it.
