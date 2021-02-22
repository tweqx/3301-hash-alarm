
// Waits for the page to be fully loaded, and sets the <code> tag content from the URL
document.addEventListener("DOMContentLoaded", () => {
  let info = document.getElementById("info");

  let params = (new URL(document.location)).searchParams;
  info.innerText = params.get("info");
});

