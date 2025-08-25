(function () {
  // ---- CONFIG ----
  var sourceControlId = 3333450; // e.g. 123456789
  var outContainerId  = "vb-out";
  // ----------------

  function lineShift(raw) {
    if (!raw || typeof raw !== "string") return "";

    // Insert <br> after any ",<digits>," pattern (end of a row)
    // Example: "... ,3,07-08-2025" -> "... ,3<br>07-08-2025"
    var s = raw.replace(/,(\d+),/g, ',$1<br>');

    // If the last row ends with ",<digits>" (no trailing comma), also add a <br>
    s = s.replace(/,(\d+)\s*$/g, ',$1<br>');

    // Optional: tidy start/end commas or whitespace
    return s.trim();
  }

  function init() {
    var engine = loader.getEngine();
    var doc = engine.getDocument();
    var src = doc.getElementById(sourceControlId);
    if (!src) return;

    function render() {
      var raw = src.getValue && src.getValue();
      var out = document.getElementById(outContainerId);
      if (out) out.innerHTML = lineShift(raw);
    }

    render();
    if (src.on) src.on('value-change', render);
  }

  window.addEventListener('load', init);

})();
