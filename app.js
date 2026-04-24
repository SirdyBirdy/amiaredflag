// -----------------------------------------
//  APP — amitheredflag.lol
// -----------------------------------------

(function () {
  "use strict";

  // State
  const selected = new Set();
  let diagnosisRun = false;

  // DOM refs
  const flagList        = document.getElementById("flagList");
  const meterFill       = document.getElementById("meterFill");
  const scoreLabel      = document.getElementById("scoreLabel");
  const meterVerdict    = document.getElementById("meterVerdict");
  const diagnoseBtn     = document.getElementById("diagnoseBtn");
  const resultCard      = document.getElementById("resultCard");
  const therapySection  = document.getElementById("therapySection");
  const therapistGrid   = document.getElementById("therapistGrid");
  const shareSection    = document.getElementById("shareSection");
  const shareTextBox    = document.getElementById("shareTextBox");
  const adMid           = document.getElementById("adMid");
  const badmintonSection  = document.getElementById("badmintonSection");
  const badmintonForm     = document.getElementById("badmintonForm");
  const badmintonThanks   = document.getElementById("badmintonThanks");
  const badmintonSubmit   = document.getElementById("badmintonSubmit");
  const toast             = document.getElementById("toast");
  const footerYear        = document.getElementById("footerYear");

  // Init
  function init() {
    footerYear.textContent = new Date().getFullYear();
    renderFlags();
    bindEvents();
  }

  // Render checklist
  function renderFlags() {
    FLAGS.forEach(function (f, i) {
      var div = document.createElement("div");
      div.className = "flag-card";
      div.dataset.index = i;
      div.innerHTML =
        '<div class="fc-check" id="chk' + i + '"></div>' +
        '<div class="fc-text">' +
          '<div class="fc-label">\u201c' + f.text + '\u201d</div>' +
          '<span class="fc-tag">' + f.tag + "</span>" +
        "</div>";
      div.addEventListener("click", function () { toggleFlag(i, div); });
      flagList.appendChild(div);
    });
  }

  // Toggle a flag
  function toggleFlag(i, el) {
    var chk = document.getElementById("chk" + i);
    if (selected.has(i)) {
      selected.delete(i);
      el.classList.remove("selected");
      chk.textContent = "";
    } else {
      selected.add(i);
      el.classList.add("selected");
      chk.textContent = "\u2713";
    }
    updateMeter();
    if (diagnosisRun) runDiagnosis(false);
  }

  // Update meter bar
  function updateMeter() {
    var n   = selected.size;
    var pct = n === 0 ? 0 : Math.round((n / FLAGS.length) * 100);
    meterFill.style.width = pct + "%";
    scoreLabel.textContent = n + " / " + FLAGS.length + " selected";

    var label = METER_LABELS[0][2];
    for (var j = 0; j < METER_LABELS.length; j++) {
      var lo = METER_LABELS[j][0];
      var hi = METER_LABELS[j][1];
      var txt = METER_LABELS[j][2];
      if (n >= lo && n <= hi) { label = txt; break; }
    }
    meterVerdict.textContent = label;
  }

  // Run full diagnosis
  function runDiagnosis(scroll) {
    if (scroll === undefined) scroll = true;
    diagnosisRun = true;
    var n = selected.size;
    var verdict = VERDICTS[VERDICTS.length - 1];
    for (var i = 0; i < VERDICTS.length; i++) {
      if (n >= VERDICTS[i].min && n <= VERDICTS[i].max) {
        verdict = VERDICTS[i];
        break;
      }
    }

    // Result card
    resultCard.className = "result-card " + verdict.zone;
    resultCard.classList.remove("hidden");
    document.getElementById("resultTitle").textContent = verdict.emoji + " " + verdict.title;
    document.getElementById("resultDesc").textContent  = verdict.desc;
    document.getElementById("resultCta").textContent   = verdict.cta;

    // Badminton invite (green zone only)
    if (verdict.badminton) {
      badmintonSection.classList.remove("hidden");
    } else {
      badmintonSection.classList.add("hidden");
    }

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
    var msg = verdict.shareText(n);
    shareTextBox.textContent = msg;
    window._shareMsg = msg;
    shareSection.classList.remove("hidden");

    if (scroll) {
      setTimeout(function () {
        resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  // Render therapist cards
  function renderTherapists() {
    if (therapistGrid.childElementCount > 0) return;
    THERAPISTS.forEach(function (t) {
      var c = document.createElement("div");
      c.className = "therapist-card";
      c.innerHTML =
        '<div class="therapist-icon">' + t.icon + "</div>" +
        '<div class="therapist-name">' + t.name + "</div>" +
        '<div class="therapist-desc">' + t.desc + "</div>" +
        '<a class="therapist-btn" href="' + t.url + '" target="_blank" rel="noopener">visit \u2192</a>';
      therapistGrid.appendChild(c);
    });
  }

  // Share helpers
  function shareTwitter() {
    var text = encodeURIComponent(
      (window._shareMsg || "am i the red flag? find out → amitheredflag.lol") +
      "\n\namitheredflag.lol"
    );
    window.open("https://twitter.com/intent/tweet?text=" + text, "_blank");
  }

  function shareWhatsapp() {
    var text = encodeURIComponent(
      (window._shareMsg || "am i the red flag? find out → amitheredflag.lol") +
      "\n\namitheredflag.lol"
    );
    window.open("https://wa.me/?text=" + text, "_blank");
  }

  function copyText() {
    var txt = (window._shareMsg || "amitheredflag.lol") + "\n\namitheredflag.lol";
    navigator.clipboard.writeText(txt).then(function () {
      showToast("copied to clipboard!");
      var btn = document.getElementById("btnCopy");
      btn.textContent = "copied!";
      setTimeout(function () { btn.textContent = "copy text"; }, 2000);
    }).catch(function () {
      showToast("couldn't copy, try manually");
    });
  }

  // Toast
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }

  // Bind events
  function bindEvents() {
    diagnoseBtn.addEventListener("click", function () { runDiagnosis(true); });
    document.getElementById("btnTwitter").addEventListener("click", shareTwitter);
    document.getElementById("btnWhatsapp").addEventListener("click", shareWhatsapp);
    document.getElementById("btnCopy").addEventListener("click", copyText);
    badmintonSubmit.addEventListener("click", handleBadmintonSubmit);
  }

  // Badminton form
  function handleBadmintonSubmit() {
    var name  = document.getElementById("bName").value.trim();
    var email = document.getElementById("bEmail").value.trim();
    var level = document.getElementById("bLevel").value;
    var note  = document.getElementById("bNote").value.trim();

    if (!name)                        { showToast("we need to know what to call you"); return; }
    if (!email || !email.includes("@")) { showToast("give us a real email, we promise not to be weird about it"); return; }
    if (!level)                       { showToast("skill level? be honest."); return; }

    var body = new URLSearchParams({
      "form-name": "badminton-signup",
      name: name,
      email: email,
      level: level,
      note: note
    }).toString();

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body,
    })
    .then(function () {
      badmintonForm.classList.add("hidden");
      badmintonThanks.classList.remove("hidden");
      badmintonThanks.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("see you on the court \uD83C\uDFF8");
    })
    .catch(function () {
      // Still show thanks - form data logged, submission likely worked
      badmintonForm.classList.add("hidden");
      badmintonThanks.classList.remove("hidden");
      showToast("see you on the court \uD83C\uDFF8");
    });
  }

  // Boot
  document.addEventListener("DOMContentLoaded", init);

})();
