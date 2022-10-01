function saveWindow(close = false) {
  chrome.windows.getCurrent({
    populate: true
  }, function (currentWindow) {
    chrome.storage.local.get('windows', function (result) {
      var windows = result.windows ? result.windows : [];
      windows.push(currentWindow);
      chrome.storage.local.set({
        windows: windows
      }, function () {
        if (close) {
          chrome.windows.remove(currentWindow.id);
        }
        else {
          window.close(); // closes the popup
        }
      });
    });
  });
}

function show(id) {
  document.getElementById(id).style.display = 'block';
}

function hide(id) {
  document.getElementById(id).style.display = 'none';
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

document.getElementById('restoreWindow').onclick = function () {
  chrome.storage.local.get('windows', function (result) {
    var windows = result.windows ? result.windows : [];
    document.getElementById('window-list').innerHTML = '';
    windows.forEach(function (theWindow) {
      var button = document.createElement('button');
      button.innerHTML = theWindow.tabs.length + ' tabs';
      button.onclick = function () {
        chrome.windows.create({
          focused: true,
          state: theWindow.state,
          type: theWindow.type,
          url: theWindow.tabs.map(function (tab) {
            return tab.url;
          })
        }, function () {
          window.close();
        });
      };
      document.getElementById('window-list').appendChild(button);
    });
    show('overlay');
    show('window-select');
  });
}

document.getElementById('window-select-back').onclick = function () {
  hide('window-select');
  hide('overlay');
}
