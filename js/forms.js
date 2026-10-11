/* =========================================================================
   AIAT — forms.js
   Every form on the site: <form data-form="enroll|camp|support|enquiry">
   - Validation with clear messages (field turns red, icon + text, focus
     moves to the first problem)
   - Sends to Formspree (endpoints in data/settings.js), with loading,
     success and failure states
   - "Send on WhatsApp" builds the same details into a WhatsApp message
   - Spam trap field (_gotcha) that people never see
   - Honest states: if a form isn't connected yet it says so. In preview
     mode (showSamples) it runs a demo and says nothing was sent.
   ========================================================================= */
(function () {
  "use strict";
  var util = AIAT.util, S = AIAT.settings;
  var TITLES = { enroll: "Class enrolment request", camp: "Winter camp registration", support: "Support request", enquiry: "General enquiry" };

  util.$$("form[data-form]").forEach(function (form) {
    var key = form.getAttribute("data-form");
    var endpoint = (S.formspree || {})[key] || "";
    var preview = !endpoint && S.showSamples;
    var offline = !endpoint && !S.showSamples;
    var submit = util.$("[type=submit]", form);
    var label = util.$("[data-submit-label]", form);
    var labelText = label ? label.textContent : "";
    var errBox = util.$("[data-form-error]", form);
    var errText = util.$("[data-form-error-text]", form);
    var okBox = util.$("[data-form-success]", form);
    var waBtn = util.$("[data-form-wa]", form);
    var notice = util.$("[data-form-notice]", form);
    var fields = util.$$(".field", form).filter(function (f) { return util.$("input, select, textarea", f); });
    var submitted = false;

    /* ---- Connection state ---------------------------------------------- */
    if (waBtn && !util.has(S.whatsapp)) waBtn.hidden = true;
    if (notice) {
      if (preview) {
        notice.querySelector("span").textContent = "Preview: this form is not connected yet, so nothing will be sent.";
        notice.hidden = false;
      } else if (offline) {
        notice.querySelector("span").textContent = util.has(S.whatsapp)
          ? "Online sending is being set up. Please use WhatsApp for now."
          : "Online sending is being set up. Please check back soon.";
        notice.hidden = false;
        submit.disabled = true;
      }
    }

    /* ---- Validation ---------------------------------------------------- */
    function check(f) {
      var input = util.$("input, select, textarea", f);
      var bad = !input.checkValidity();
      // Phone/WhatsApp numbers: at least 10 digits once filled in.
      if (!bad && input.type === "tel" && input.value) bad = input.value.replace(/\D/g, "").length < 10;
      f.classList.toggle("is-invalid", bad);
      input.setAttribute("aria-invalid", String(bad));
      return !bad;
    }
    function validate() {
      var first = null;
      fields.forEach(function (f) { if (!check(f) && !first) first = f; });
      if (first) {
        errText.textContent = "Please check the highlighted fields. Nothing has been sent yet.";
        errBox.hidden = false;
        util.$("input, select, textarea", first).focus();
        return false;
      }
      errBox.hidden = true;
      return true;
    }
    fields.forEach(function (f) {
      var input = util.$("input, select, textarea", f);
      input.addEventListener("blur", function () { if (submitted) check(f); });
      input.addEventListener("input", function () { if (f.classList.contains("is-invalid")) check(f); });
    });

    function busy(on) {
      submit.disabled = on;
      if (on) submit.setAttribute("aria-busy", "true"); else submit.removeAttribute("aria-busy");
      if (label) label.textContent = on ? "Sending…" : labelText;
    }
    function success() {
      okBox.hidden = false;
      form.reset();
      submitted = false;
      okBox.focus();
    }

    /* ---- Submit -------------------------------------------------------- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      submitted = true;
      okBox.hidden = true;
      if (!validate()) return;
      // Spam trap filled in: quietly pretend it worked.
      var trap = util.$('[name="_gotcha"]', form);
      if (trap && trap.value) { success(); return; }

      if (preview) {
        busy(true);
        setTimeout(function () { busy(false); success(); }, 900);
        return;
      }
      if (!endpoint) return;
      busy(true);
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () { busy(false); success(); })
        .catch(function () {
          busy(false);
          errText.textContent = "Sorry, your message did not send. Please check your connection and try again" +
            (util.has(S.whatsapp) ? ", or send it on WhatsApp." : ".");
          errBox.hidden = false;
          errBox.focus();
        });
    });

    /* ---- Send on WhatsApp ---------------------------------------------- */
    if (waBtn) waBtn.addEventListener("click", function () {
      submitted = true;
      if (!validate()) return;
      var lines = [TITLES[key] || "Message", ""];
      fields.forEach(function (f) {
        var input = util.$("input, select, textarea", f);
        if (!input.name || input.name.charAt(0) === "_") return;
        var value = input.tagName === "SELECT" ? input.options[input.selectedIndex].text : input.value;
        if (input.type === "radio") { var c = util.$("input:checked", f); value = c ? util.$('label[for="' + c.id + '"]', f).textContent : ""; }
        var lab = util.$(".field__label", f);
        if (value) lines.push((lab ? lab.firstChild.textContent.trim() : input.name) + ": " + value);
      });
      window.open(util.wa(lines.join("\n")), "_blank", "noopener");
    });
  });

  /* ---- Prefill links: e.g. "Support a student" opens the enquiry form --- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-prefill]");
    if (!a) return;
    var parts = a.getAttribute("data-prefill").split("=");
    var input = util.$(parts[0]);
    if (input) { input.value = parts.slice(1).join("="); setTimeout(function () { input.focus({ preventScroll: true }); }, 400); }
  });
})();
