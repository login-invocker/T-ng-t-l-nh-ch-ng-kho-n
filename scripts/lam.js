function injectTheScript() {
  // Gets all tabs that have the specified properties, or all tabs if no properties are specified (in our case we choose current active tab)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Injects JavaScript code into a page
      chrome.tabs.executeScript(tabs[0].id, {file: "scripts/utilities.js"});
  });
}
// adding listener to your button in popup window
// document.getElementById('press').addEventListener('click', injectTheScript);
injectTheScript()
