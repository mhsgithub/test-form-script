(function () {
  // ===== CONFIG =====
  var sourceControlId = 3333450;     // your hidden field ID
  var outContainerId  = "vb-out";    // <div id="vb-out"></div>
  var POLL_MS = 500;
  var POLL_MAX = 30; // ≈15s
  // ==================

  function log(outEl, msg) {
    var p = document.createElement('div');
    p.style.fontFamily = 'monospace';
    p.style.opacity = '0.8';
    p.textContent = msg;
    outEl.appendChild(p);
  }

  function splitRows(raw) {
    if (!raw || typeof raw !== "string") return [];
    var withBreaks = raw
      .replace(/,\s*(\d+)\s*,/g, ',$1\n')
      .replace(/,\s*(\d+)\s*$/g, ',$1\n');
    return withBreaks.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function renderLines(outEl, raw) {
    while (outEl.firstChild) outEl.removeChild(outEl.firstChild);
    if (!raw) { log(outEl, "No value yet"); return; }

    var lines = splitRows(raw);
    if (!lines.length) { log(outEl, "Parsed 0 rows"); return; }

    for (var i = 0; i < lines.length; i++) {
      var div = document.createElement('div');
      div.textContent = lines[i];
      outEl.appendChild(div);
    }
  }

  function initWhenReady() {
    if (!window.loader || !loader.getEngine) {
      setTimeout(initWhenReady, 200);
      return;
    }
    var engine = loader.getEngine();
    var doc = engine.getDocument();

    var src = doc.getElementById(sourceControlId);
    var out = document.getElementById(outContainerId);

    if (!out) { setTimeout(initWhenReady, 200); return; }
    if (!src) {
      out.textContent = "Could not find field ID " + sourceControlId + ". Check the Field ID.";
      return;
    }

    // Immediate render
    renderLines(out, src.getValue && src.getValue());

    // Poll until non-empty (covers late virtual DB fill)
    var tries = 0;
    var poll = setInterval(function () {
      var val = src.getValue && src.getValue();
      if (val && String(val).trim()) {
        renderLines(out, val);
        clearInterval(poll);
      } else if (++tries >= POLL_MAX) {
        log(out, "Gave up waiting after " + (POLL_MS * POLL_MAX) + "ms");
        clearInterval(poll);
      }
    }, POLL_MS);

    // Listen for changes if they fire
    if (src.on) {
      src.on('value-change', function () {
        renderLines(out, src.getValue && src.getValue());
      });
    }
  }

  window.addEventListener('load', initWhenReady);
})();
