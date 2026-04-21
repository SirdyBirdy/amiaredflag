// ─────────────────────────────────────────
//  APP — amitheredflag.com
// ─────────────────────────────────────────

(function () {
  "use strict";

  // ── State ──────────────────────────────
  const selected = new Set();
  let diagnosisRun = false;

  // ── DOM refs ───────────────────────────
  const flagList      = document.getElementById("flagList");
  const meterFill     = document.getElementById("meterFill");
  const scoreLabel    = document.getElementById("scoreLabel");
  const meterVerdict  = document.getElementById("meterVerdict");
  const diagnoseBtn   = document.getElementById("diagnoseBtn");
  const resultCard    = document.getElementById("resultCard");
  const therapySection = document.getElementById("therapySection");
  const therapistGrid = document.getElementById("therapistGrid");
  const shareSection  = document.getElementById("shareSection");
  const shareTextBox  = document.getElementById("shareTextBox");
  const adMid         = document.getElementById("adMid");
  const toast         = document.getElementById("toast");
  const footerYear    = document.getElementById("footerYear");

  // ── Init ───────────────────────────────
  function init() {
    footerYear.textContent = new Date().getFullYear();
    renderFlags();
    bindEvents();
  }

  // ── Render checklist ───────────────────
  function renderFlags() {
    FLAGS.forEach((f, i) => {
      const div = document.createElement("div");
      div.className = "flag-card";
      div.dataset.index = i;
      div.innerHTML = `
        <div class="fc-check" id="chk${i}"></div>
        <div class="fc-text">
          <div class="fc-label">&ldquo;${f.text}&rdquo;</div>
          <span class="fc-tag">${f.tag}</span>
        </div>`;
      div.addEventListener("click", () => toggleFlag(i, div));
      flagList.appendChild(div);
    });
  }

  // ── Toggle a flag ──────────────────────
  function toggleFlag(i, el) {
    const chk = document.getElementById("chk" + i);
    if (selected.has(i)) {
      selected.delete(i);
      el.classList.remove("selected");
      chk.textContent = "";
    } else {
      selected.add(i);
      el.classList.add("selected");
      chk.textContent = "✓";
    }
    updateMeter();
    if (diagnosisRun) runDiagnosis(false);
  }

  // ── Update meter bar ───────────────────
  function updateMeter() {
    const n = selected.size;
    const pct = n === 0 ? 0 : Math.round((n / FLAGS.length) * 100);
    meterFill.style.width = pct + "%";
    scoreLabel.textContent = n + " / " + FLAGS.length + " selected";

    let label = METER_LABELS[0][2];
    for (const [lo, hi, txt] of METER_LABELS) {
      if (n >= lo && n <= hi) { label = txt; break; }
    }
    meterVerdict.textContent = label;
  }

  // ── Run full diagnosis ─────────────────
  function runDiagnosis(scroll = true) {
    diagnosisRun = true;
    const n = selected.size;
    const verdict = VERDICTS.find(v => n >= v.min && n <= v.max) || VERDICTS[VERDICTS.length - 1];

    // Result card
    resultCard.className = "result-card " + verdict.zone;
    document.getElementById("resultTitle").textContent = verdict.emoji + " " + verdict.title;
    document.getElementById("resultDesc").textContent  = verdict.desc;
    document.getElementById("resultCta").textContent   = verdict.cta;

    // Show mid ad
    adMid.classList.remove("hidden");

    // Therapists (7+ flags)
    if (n >= 7) {
      therapySection.classList.remove("hidden");
      renderTherapists();
    } else {
      therapySection.classList.add("hidden");
    }

    // Share section
    const msg = verdict.shareText(n);
    shareTextBox.textContent = msg;
    window._shareMsg = msg;
    shareSection.classList.remove("hidden");

    if (scroll) {
      setTimeout(() => resultCard.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }

  // ── Render therapist cards ─────────────
  function renderTherapists() {
    if (therapistGrid.childElementCount > 0) return;
    THERAPISTS.forEach(t => {
      const c = document.createElement("div");
      c.className = "therapist-card";
      c.innerHTML = `
        <div class="therapist-icon">${t.icon}</div>
        <div class="therapist-name">${t.name}</div>
        <div class="therapist-desc">${t.desc}</div>
        <a class="therapist-btn" href="${t.url}" target="_blank" rel="noopener">visit →</a>`;
      therapistGrid.appendChild(c);
    });
  }

  // ── Share helpers ──────────────────────
  function shareTwitter() {
    const text = encodeURIComponent(window._shareMsg || "am i the red flag? find out → amitheredflag.com");
    window.open("https://twitter.com/intent/tweet?text=" + text, "_blank");
  }

  function shareWhatsapp() {
    const text = encodeURIComponent(window._shareMsg || "am i the red flag? → amitheredflag.com");
    window.open("https://wa.me/?text=" + text, "_blank");
  }

  function copyText() {
    const txt = window._shareMsg || "amitheredflag.com";
    navigator.clipboard.writeText(txt).then(() => {
      showToast("copied to clipboard!");
      const btn = document.getElementById("btnCopy");
      btn.textContent = "copied!";
      setTimeout(() => btn.textContent = "copy text", 2000);
    }).catch(() => showToast("couldn't copy — try manually"));
  }

  // ── Toast ──────────────────────────────
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  // ── Bind events ────────────────────────
  function bindEvents() {
    diagnoseBtn.addEventListener("click", () => runDiagnosis(true));
    document.getElementById("btnTwitter").addEventListener("click", shareTwitter);
    document.getElementById("btnWhatsapp").addEventListener("click", shareWhatsapp);
    document.getElementById("btnCopy").addEventListener("click", copyText);
  }

  // ── Boot ───────────────────────────────
  document.addEventListener("DOMContentLoaded", init);

})();
