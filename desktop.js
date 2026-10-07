// Builds the desktop from the <section class="app"> / <a class="app"> blocks in
// index.html. You should not need to edit this file to change the content.

(() => {
  const desktop = document.getElementById('desktop');
  const tasks = document.querySelector('.taskbar-tasks');
  const startButton = document.querySelector('.start-button');
  const startMenu = document.querySelector('.start-menu');
  const startItems = document.querySelector('.start-menu-items');

  const iconSrc = name => (!name ? 'icons/computer.svg'
    : name.includes('/') || name.includes('.') ? name : `icons/${name}.svg`);

  const iconBar = document.createElement('div');
  iconBar.className = 'desktop-icons';
  desktop.prepend(iconBar);

  let topZ = 10;
  let cascade = 0;
  const windows = [];

  function setActive(win) {
    windows.forEach(w => {
      const on = w === win;
      w.el.classList.toggle('active', on);
      w.task.classList.toggle('active', on && !w.el.hidden);
    });
    if (win) win.el.style.zIndex = ++topZ;
  }

  function topVisible() {
    return windows.filter(w => !w.el.hidden)
      .sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0];
  }

  function open(win) {
    if (!win.placed) {
      const narrow = window.innerWidth <= 600;
      win.el.style.left = (narrow ? 4 : 110 + cascade * 26) + 'px';
      win.el.style.top = (narrow ? 8 + cascade * 20 : 20 + cascade * 26) + 'px';
      cascade = (cascade + 1) % 8;
      win.placed = true;
    }
    win.el.hidden = false;
    win.task.hidden = false;
    setActive(win);
  }

  function minimize(win) {
    win.el.hidden = true;
    setActive(topVisible());
  }

  function close(win) {
    win.el.hidden = true;
    win.task.hidden = true;
    win.el.classList.remove('maximized');
    setActive(topVisible());
  }

  function makeIcon(title, icon, onOpen) {
    const btn = document.createElement('a');
    btn.className = 'desktop-icon';
    btn.href = '#';
    btn.innerHTML = `<img src="${iconSrc(icon)}" alt=""><span></span>`;
    btn.querySelector('span').textContent = title;
    btn.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
      btn.classList.add('selected');
      // Phones have no double-click, so a single tap opens.
      if (matchMedia('(hover: none)').matches) onOpen();
    });
    btn.addEventListener('dblclick', e => { e.preventDefault(); onOpen(); });
    btn.addEventListener('keydown', e => { if (e.key === 'Enter') onOpen(); });
    iconBar.append(btn);

    const li = document.createElement('li');
    li.tabIndex = 0;
    li.innerHTML = `<img src="${iconSrc(icon)}" alt=""><span></span>`;
    li.querySelector('span').textContent = title;
    li.addEventListener('click', () => { toggleStart(false); onOpen(); });
    li.addEventListener('keydown', e => { if (e.key === 'Enter') li.click(); });
    startItems.append(li);
  }

  function makeWindow(section) {
    const title = section.dataset.title || 'Untitled';
    const icon = section.dataset.icon;

    const el = document.createElement('div');
    el.className = 'window desktop-window';
    el.hidden = true;
    el.style.width = (parseInt(section.dataset.width, 10) || 360) + 'px';
    el.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text"><img src="${iconSrc(icon)}" alt=""><span></span></div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>`;
    el.querySelector('.title-bar-text span').textContent = title;
    while (section.firstChild) el.append(section.firstChild);
    section.remove();
    desktop.append(el);

    const task = document.createElement('button');
    task.hidden = true;
    task.innerHTML = `<img src="${iconSrc(icon)}" alt=""><span></span>`;
    task.querySelector('span').textContent = title;
    tasks.append(task);

    const win = { el, task, placed: false };
    windows.push(win);

    const [minBtn, maxBtn, closeBtn] = el.querySelectorAll('.title-bar-controls button');
    minBtn.addEventListener('click', () => minimize(win));
    maxBtn.addEventListener('click', () => {
      const max = el.classList.toggle('maximized');
      maxBtn.setAttribute('aria-label', max ? 'Restore' : 'Maximize');
    });
    closeBtn.addEventListener('click', () => close(win));
    el.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => close(win)));
    el.addEventListener('pointerdown', () => setActive(win));
    task.addEventListener('click', () => {
      if (el.hidden) open(win);
      else if (el.classList.contains('active')) minimize(win);
      else setActive(win);
    });

    // Drag by the title bar.
    const bar = el.querySelector('.title-bar');
    bar.addEventListener('dblclick', e => { if (!e.target.closest('button')) maxBtn.click(); });
    bar.addEventListener('pointerdown', e => {
      if (e.target.closest('button') || el.classList.contains('maximized')) return;
      const dx = e.clientX - el.offsetLeft;
      const dy = e.clientY - el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      const move = ev => {
        const maxX = desktop.clientWidth - 40;
        const maxY = desktop.clientHeight - 20;
        el.style.left = Math.min(maxX, Math.max(-el.offsetWidth + 60, ev.clientX - dx)) + 'px';
        el.style.top = Math.min(maxY, Math.max(0, ev.clientY - dy)) + 'px';
      };
      const up = () => {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
    });

    makeIcon(title, icon, () => open(win));
    if (section.dataset.open === 'yes') open(win);
  }

  desktop.querySelectorAll(':scope > .app').forEach(node => {
    if (node.tagName === 'A') {
      const { title, icon } = node.dataset;
      const href = node.href;
      node.remove();
      makeIcon(title || href, icon, () => { window.location.href = href; });
    } else {
      makeWindow(node);
    }
  });

  // Start menu.
  function toggleStart(show = startMenu.hidden) {
    startMenu.hidden = !show;
    startButton.setAttribute('aria-expanded', String(show));
  }
  startButton.addEventListener('click', e => { e.stopPropagation(); toggleStart(); });
  document.addEventListener('pointerdown', e => {
    if (!startMenu.hidden && !startMenu.contains(e.target) && !startButton.contains(e.target)) toggleStart(false);
    if (!e.target.closest('.desktop-icon')) {
      document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    }
  });

  // Clock.
  const clock = document.querySelector('.clock');
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 10000);
})();
