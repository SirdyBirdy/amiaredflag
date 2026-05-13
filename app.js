// -----------------------------------------
//  APP — amitheredflag.lol
//  Key change from previous version:
//  Ads are only pushed AFTER runDiagnosis()
//  completes. No inline adsbygoogle.push().
// -----------------------------------------

(function () {
  "use strict";

  // State
  const selected = new Set();
  let diagnosisRun = false;
  let adsInitialised = false;

  // DOM refs
  const flagList          = document.getElementById("flagList");
  const meterFill         = document.getElementById("meterFill");
  const scoreLabel        = document.getElementById("scoreLabel");
  const meterVerdict      = document.getElementById("meterVerdict");
  const diagnoseBtn       = document.getElementById("diagnoseBtn");
  const resultCard        = document.getElementById("resultCard");
  const therapySection    = document.getElementById("therapySection");
  const therapistGrid     = document.getElementById("therapistGrid");
  const shareSection      = document.getElementById("shareSection");
  const shareTextBox      = document.getElementById("shareTextBox");
  const adMid             = document.getElementById("adMid");
  const adBottom          = document.getElementById("adBottom");
  const badmintonSection  = document.getElementById("badmintonSection");
  const badmintonForm     = document.getElementById("badmintonForm");
  const badmintonThanks   = document.getElementById("badmintonThanks");
  const badmintonSubmit   = document.getElementById("badmintonSubmit");
  const toast             = document.getElementById("toast");
  const footerYear        = document.getElementById("footerYear");

  // ------------------------------------------
  // AD INIT — called once after result renders
  // ------------------------------------------
  function initAds() {
    if (adsInitialised) return;
    adsInitialised = true;

    if (adMid) {
      adMid.classList.remove("hidden");
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    }
    // Stagger second slot slightly
    setTimeout(function () {
      if (adBottom) {
        adBottom.classList.remove("hidden");
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      }
    }, 800);
  }

  // ------------------------------------------
  // INIT
  // ------------------------------------------
  function init() {
    if (footerYear) footerYear.textContent = new Date().getFullYear();
    renderFlags();
    bindEvents();
  }

  // ------------------------------------------
  // RENDER CHECKLIST
  // ------------------------------------------
  function renderFlags() {
    if (!flagList) return;
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

  // ------------------------------------------
  // TOGGLE FLAG
  // ------------------------------------------
  function toggleFlag(i, el) {
    var chk = document.getElementById("chk" + i);
    if (selected.has(i)) {
      selected.delete(i);
      el.classList.remove("selected");
      if (chk) chk.textContent = "";
    } else {
      selected.add(i);
      el.classList.add("selected");
      if (chk) chk.textContent = "\u2713";
    }
    updateMeter();
    if (diagnosisRun) runDiagnosis(false);
  }

  // ------------------------------------------
  // METER
  // ------------------------------------------
  function updateMeter() {
    var n   = selected.size;
    var pct = n === 0 ? 0 : Math.round((n / FLAGS.length) * 100);
    if (meterFill) meterFill.style.width = pct + "%";
    if (scoreLabel) scoreLabel.textContent = n + " / " + FLAGS.length + " selected";

    var label = METER_LABELS[0][2];
    for (var j = 0; j < METER_LABELS.length; j++) {
      if (n >= METER_LABELS[j][0] && n <= METER_LABELS[j][1]) {
        label = METER_LABELS[j][2];
        break;
      }
    }
    if (meterVerdict) meterVerdict.textContent = label;
  }

  // ------------------------------------------
  // RUN DIAGNOSIS
  // ------------------------------------------
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
    if (resultCard) {
      resultCard.className = "result-card " + verdict.zone;
      resultCard.classList.remove("hidden");
    }
    var titleEl = document.getElementById("resultTitle");
    var descEl  = document.getElementById("resultDesc");
    var ctaEl   = document.getElementById("resultCta");
    if (titleEl) titleEl.textContent = verdict.emoji + " " + verdict.title;
    if (descEl)  descEl.textContent  = verdict.desc;
    if (ctaEl)   ctaEl.textContent   = verdict.cta;

    // Badminton invite
    if (badmintonSection) {
      if (verdict.badminton) {
        badmintonSection.classList.remove("hidden");
      } else {
        badmintonSection.classList.add("hidden");
      }
    }

    // Therapist section
    if (n >= 7) {
      if (therapySection) therapySection.classList.remove("hidden");
      renderTherapists();
    } else {
      if (therapySection) therapySection.classList.add("hidden");
    }

    // Share section
    var msg = verdict.shareText(n);
    if (shareTextBox) shareTextBox.textContent = msg;
    window._shareMsg = msg;
    if (shareSection) shareSection.classList.remove("hidden");

    // *** Init ads now that content is visible ***
    initAds();

    if (scroll) {
      setTimeout(function () {
        if (resultCard) resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  // ------------------------------------------
  // RENDER THERAPIST CARDS
  // ------------------------------------------
  function renderTherapists() {
    if (!therapistGrid || therapistGrid.childElementCount > 0) return;
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

  // ------------------------------------------
  // SHARE
  // ------------------------------------------
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
      if (btn) {
        btn.textContent = "copied!";
        setTimeout(function () { btn.textContent = "copy text"; }, 2000);
      }
    }).catch(function () {
      showToast("couldn't copy, try manually");
    });
  }

  // ------------------------------------------
  // TOAST
  // ------------------------------------------
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }

  // ------------------------------------------
  // BIND EVENTS
  // ------------------------------------------
  function bindEvents() {
    if (diagnoseBtn) diagnoseBtn.addEventListener("click", function () { runDiagnosis(true); });

    var twBtn   = document.getElementById("btnTwitter");
    var waBtn   = document.getElementById("btnWhatsapp");
    var cpBtn   = document.getElementById("btnCopy");
    if (twBtn) twBtn.addEventListener("click", shareTwitter);
    if (waBtn) waBtn.addEventListener("click", shareWhatsapp);
    if (cpBtn) cpBtn.addEventListener("click", copyText);

    if (badmintonSubmit) badmintonSubmit.addEventListener("click", handleBadmintonSubmit);
  }

  // ------------------------------------------
  // BADMINTON FORM
  // ------------------------------------------
  function handleBadmintonSubmit() {
    var nameEl  = document.getElementById("bName");
    var emailEl = document.getElementById("bEmail");
    var levelEl = document.getElementById("bLevel");
    var noteEl  = document.getElementById("bNote");

    var name  = nameEl  ? nameEl.value.trim()  : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var level = levelEl ? levelEl.value        : "";
    var note  = noteEl  ? noteEl.value.trim()  : "";

    if (!name)                         { showToast("we need to know what to call you"); return; }
    if (!email || !email.includes("@")) { showToast("give us a real email, we promise not to be weird about it"); return; }
    if (!level)                        { showToast("skill level? be honest."); return; }

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
      if (badmintonForm)   badmintonForm.classList.add("hidden");
      if (badmintonThanks) {
        badmintonThanks.classList.remove("hidden");
        badmintonThanks.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      showToast("see you on the court \uD83C\uDFF8");
    })
    .catch(function () {
      if (badmintonForm)   badmintonForm.classList.add("hidden");
      if (badmintonThanks) badmintonThanks.classList.remove("hidden");
      showToast("see you on the court \uD83C\uDFF8");
    });
  }

  // ------------------------------------------
  // BOOT
  // ------------------------------------------
  document.addEventListener("DOMContentLoaded", init);

})();
