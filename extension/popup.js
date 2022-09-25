function saveWindow(close = false) {
  chrome.windows.getCurrent({
    populate: true
  }, function (window) {
    console.log(window);
    chrome.storage.local.get('windows', function (result) {
      var windows = result.windows ? result.windows : [];
      windows.push(window);
      chrome.storage.local.set({
        windows: windows
      }, function () {
        if (close) {
          chrome.windows.remove(window.id);
        }
      });
    });
  });
}

document.getElementById('saveWindow').onclick = function () {
  saveWindow(false);
};

document.getElementById('saveWindowAndClose').onclick = function () {
  saveWindow(true);
};

document.getElementById('dashboard').onclick = function () {
  chrome.tabs.create({
    url: 'dashboard.html'
  });
};