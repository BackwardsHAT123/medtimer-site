// Med Timer site: the working demo card in the hero, and the walkthrough video.
(() => {
  const INTERVAL = 6 * 60 * 60 * 1000; // every 6 hours
  const card = document.querySelector(".demo");
  if (card) {
    const fill = card.querySelector(".fill");
    const time = document.getElementById("demo-time");
    const sub = document.getElementById("demo-sub");
    const take = document.getElementById("demo-take");
    const undo = document.getElementById("demo-undo");
    const note = document.getElementById("demo-note");
    let takenAt = null;
    let timer = null;

    const pad = (n) => String(n).padStart(2, "0");
    const clock = (d) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    function render() {
      if (takenAt === null) {
        card.dataset.state = "due";
        fill.style.strokeDashoffset = "0";
        time.textContent = "Due now";
        sub.textContent = "Overdue by 12 min";
        take.textContent = "Take";
        return;
      }
      const left = Math.max(0, takenAt + INTERVAL - Date.now());
      const s = Math.floor(left / 1000);
      card.dataset.state = "waiting";
      // Ring fills up as the next dose gets closer, like the app.
      fill.style.strokeDashoffset = String((left / INTERVAL) * 100);
      time.textContent = `${Math.floor(s / 3600)}h ${pad(Math.floor((s % 3600) / 60))}m ${pad(s % 60)}s`;
      sub.textContent = `Next dose at ${clock(new Date(takenAt + INTERVAL))}`;
    }

    take.addEventListener("click", () => {
      if (takenAt !== null) {
        note.textContent = "Not due yet. In the app, Med Timer asks before you take a dose early.";
        return;
      }
      takenAt = Date.now();
      undo.hidden = false;
      take.textContent = "Taken";
      note.textContent = `Ibuprofen taken at ${clock(new Date(takenAt))}. The app would remind you in 6 hours.`;
      render();
      timer = setInterval(render, 1000);
    });

    undo.addEventListener("click", () => {
      takenAt = null;
      clearInterval(timer);
      undo.hidden = true;
      note.textContent = "Undone. Tap Take to try again.";
      render();
      take.focus();
    });

    render();
  }

  // Play the walkthrough only while it's on screen; leave it paused for Reduce Motion.
  const video = document.getElementById("walk-video");
  if (video) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches || !("IntersectionObserver" in window)) {
      video.controls = true;
    } else {
      new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) video.play().catch(() => { video.controls = true; });
          else video.pause();
        }
      }, { threshold: 0.4 }).observe(video);
    }
  }
})();
