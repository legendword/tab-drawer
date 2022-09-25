chrome.storage.local.get('windows', function (result) {
  var windows = result.windows ? result.windows : [];
  console.log(windows);
});