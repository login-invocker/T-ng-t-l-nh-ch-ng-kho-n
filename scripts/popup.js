function injectTheScript() {
  // document.getElementById('init').disabled = true;
  // Gets all tabs that have the specified properties, or all tabs if no properties are specified (in our case we choose current active tab)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // Injects JavaScript code into a page
      chrome.tabs.executeScript(tabs[0].id, {file: "scripts/utilities.js"});
  });
}

function setupData(){
  const loss1 = document.getElementById("loss1").value;
  const loss2 = document.getElementById("loss2").value;
  const loss3 = document.getElementById("loss3").value;
  const loss4 = document.getElementById("loss4").value;
  console.log($)

  // chrome.storage.sync.set({listMoneyMagic: [ 2, 4]}, function() {
  //   // console.log('Value is set to ' + loss1);
  // });
  chrome.storage.sync.set({key: [ loss1, loss2, loss3, loss4]}, function() {
    console.log('Value is set to ' + [ loss1, loss2, loss3, loss4]);
    // $.notify("Access granted", "success");
  });
}
// adding listener to your button in popup window
document.getElementById('init').addEventListener('click', injectTheScript);
document.getElementById('set-up').addEventListener('click', setupData);

// injectTheScript()
