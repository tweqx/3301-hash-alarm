
function updateButton(enabled) {
  let button = document.getElementById("toggle-button");

  if (enabled)
    button.classList.add("toggled");
  else
    button.classList.remove("toggled");

  button.innerText = enabled ? "Disable" : "Enable";
}

const modes_desc = {
  // SHA-3 finalists, Whirlpool, SHA-3, SHA-512
  "min": "BLAKE-512, JH, Skein, Grøstl, Keccak3, Whirlpool, SHA-3, SHA-512, BLAKE2b",

  // Previous hashes + CubeHash, Streebog, FNV-1a, MD6, LSH
  "most": "BLAKE-512, JH, Skein, Grøstl, Keccak3, Whirlpool, SHA-3, SHA-512, BLAKE2b, CubeHash, Streebog, FNV-1a, MD6, LSH",

  // All hashes : Previous hashes + Old Whirlpool and FNV versions
  "all": "BLAKE-512, JH, Skein, Grøstl, Keccak3, Whirlpool/0/T, SHA-3, SHA-512, BLAKE2b, CubeHash, Streebog, FNV-0/1/1a, MD6, LSH"
};

function updateMode(mode) {
  document.getElementById("mode-selection").value = mode;

  document.getElementById("hashes-list").innerText = modes_desc[mode];
}

var config = {
  enabled: false,
  mode: "most"
};

document.addEventListener("DOMContentLoaded", async () => {
  // Loads config from storage
  let data = await browser.storage.local.get('config');
  if (data.config)
    config = data.config;
  else
    browser.storage.local.set({ 'config': config });

  // Updates the UI accordingly
  updateMode(config.mode);
  updateButton(config.enabled);

  // Callbacks for UI elements
  document.getElementById("mode-selection").addEventListener('change', ev => {
    config.mode = ev.target.value;

    updateMode(config.mode);
    browser.storage.local.set({ 'config': config });
  });
  document.getElementById("toggle-button").addEventListener('click', () => {
    config.enabled = !config.enabled;

    updateButton(config.enabled);
    browser.storage.local.set({ 'config': config });
  });
});
