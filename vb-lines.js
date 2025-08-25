// Replace these with your actual field names/IDs:
const SOURCE_SELECTOR = 3333450;    // your hidden field
const TARGET_SELECTOR = 3333451;   // your long text field

function format(raw) {
  return (raw || '')
    .replace(/\s*,\s*/g, ',')                      // tidy commas/spaces
    .replace(/(?!^)(\d{2}-\d{2}-\d{4})/g, '\n$1')  // newline before each date (not the first)
    .trim();
}

function update() {
  const src = document.querySelector(SOURCE_SELECTOR);
  const dst = document.querySelector(TARGET_SELECTOR);
  if (!src || !dst) return;
  dst.value = format(src.value || src.textContent || '');
}

// run on load and whenever the source changes
document.addEventListener('DOMContentLoaded', update);
document.addEventListener('input', e => {
  if (e.target && e.target.matches(SOURCE_SELECTOR)) update();
});
