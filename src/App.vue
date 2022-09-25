<template>
  <div>
    <header>
      <div>Tab Drawer</div>
    </header>
    <main>
      <div class="windows-container">
        <div>Saved Windows</div>
        <div class="windows">
          <div class="window">
            {{ windows.length }}
          </div>
        </div>
      </div>
      <div class="tabs-container">
        <div>Tabs</div>
        <div>Hi</div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windows: [],
    };
  },
  created() {
    chrome.storage.local.get("windows", (result) => {
      var windows = result.windows ? result.windows : [];
      this.windows = windows;
    });
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

header {
  height: 50px;
  background-color: #bb947e;
  color: #fff;
  padding: 10px min(30px, 10%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 10px 0px rgb(0 0 0 / 10%);
  font-size: 1.2rem;
}
</style>
