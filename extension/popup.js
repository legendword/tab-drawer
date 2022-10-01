function show(id) {
  document.getElementById(id).classList.remove('hidden');
}

function hide(id) {
  document.getElementById(id).classList.add('hidden');
}

function focusOn(id) {
  document.getElementById(id).focus();
}

var closeAfterSave = false;

document.getElementById('saveWindow').onclick = function () {
  closeAfterSave = false;
  show('overlay');
  show('save-dialog');
  focusOn('save-name');
};

document.getElementById('saveWindowAndClose').onclick = function () {
  closeAfterSave = true;
  show('overlay');
  show('save-dialog');
  focusOn('save-name');
};

document.getElementById('submitSaveWindow').onclick = function () {
  var name = document.getElementById('save-name').value || 'Unnamed Window';
  chrome.windows.getCurrent({
    populate: true
  }, function (currentWindow) {
    currentWindow.name = name;
    currentWindow.savedAt = new Date().getTime();
    chrome.storage.local.get('windows', function (result) {
      var windows = result.windows ? result.windows : [];
      windows.unshift(currentWindow);
      chrome.storage.local.set({
        windows: windows
      }, function () {
        if (closeAfterSave) {
          chrome.windows.remove(currentWindow.id);
        }
        else {
          window.close(); // closes the popup
        }
      });
    });
  });
};

document.getElementById('dashboard').onclick = function () {
  chrome.tabs.create({
    url: 'dashboard.html'
  });
};

document.getElementById('restoreWindow').onclick = function () {
  chrome.storage.local.get('windows', function (result) {
    var windows = result.windows ? result.windows : [];
    if (windows.length > 0) {
      document.getElementById('window-list').innerHTML = '';
      windows.forEach(function (theWindow) {
        var button = document.createElement('button');
        button.classList.add('block-button');
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
    } else {
      document.getElementById('window-list').innerHTML = '<p class="center">No saved windows</p>';
    }
    show('overlay');
    show('window-select');
  });
};

document.getElementById('cancelWindowSelect').onclick = function () {
  hide('window-select');
  hide('overlay');
};

document.getElementById('cancelSaveWindow').onclick = function () {
  hide('save-dialog');
  hide('overlay');
};
