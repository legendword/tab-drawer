<template>
  <div class="app-container">
    <header>
      <div>Tab Drawer</div>
    </header>
    <main>
      <div class="windows-container">
        <div class="container-label">Saved Windows ({{ windows.length }})</div>
        <div class="windows">
          <div
            v-for="(window, ind) in windows"
            :key="ind"
            class="window"
            :class="{
              active: windowIndex == ind,
            }"
            @click="windowIndex = ind"
          >
            <div class="name">Window</div>
            <div class="text">{{ window.tabs.length }} Tabs</div>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div v-if="selectedWindow" class="window-details">
          <div class="window-header">
            <div class="window-name">Window</div>
            <div class="window-actions">
              <button @click="restoreWindow(windowIndex)">Restore</button>
              <button class="danger" @click="deleteWindow(windowIndex)">
                Delete
              </button>
            </div>
          </div>
          <div class="tabs-container">
            <div class="container-label">
              {{ selectedWindow.tabs.length }} Tabs
            </div>
            <div class="tabs">
              <div
                v-for="(tab, ind) in selectedWindow.tabs"
                :key="ind"
                class="tab"
              >
                <div class="name">{{ tab.title }}</div>
                <div class="text">{{ tab.url }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windows: [],

      windowIndex: -1,
    };
  },
  computed: {
    selectedWindow() {
      return this.windowIndex === -1 ? null : this.windows[this.windowIndex];
    },
  },
  created() {
    chrome.storage.local.get("windows", (result) => {
      var windows = result.windows ? result.windows : [];
      this.windows = windows;
      console.log(windows[0]);
    });
  },
};
</script>

<style lang="scss">
html,
body,
.app-container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.app-container {
  --color-primary: #3d6665;
  --color-highlight: #94bfbe;
  --color-secondary: #bb947e;
}

header {
  height: 40px;
  background-color: var(--color-secondary);
  color: #fff;
  padding: 10px min(30px, 10%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 10px 0px rgb(0 0 0 / 10%);
  font-size: 1.2rem;
}

main {
  display: flex;
  height: calc(100% - 60px);
}

.windows-container {
  width: 300px;
  border-right: 2px solid #eaeaea;
  box-shadow: 2px 0px 5px 0px rgb(0 0 0 / 10%);
  height: 100%;

  .container-label {
    padding: 20px;
  }
}

.main-container {
  flex: 1;
  height: 100%;
}

.window {
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #eaeaea;
  }

  &.active {
    background-color: var(--color-highlight);
    color: #fff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eaeaea;
  }

  .name {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .text {
    font-size: 1rem;
  }
}

.window-details {
  padding: 40px;

  .window-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .window-name {
    font-size: 1.8rem;
    font-weight: 500;
  }

  .window-actions button:not(:last-child) {
    margin-right: 10px;
  }
}

.tab {
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #eaeaea;
  }

  &.active {
    background-color: var(--color-highlight);
    color: #fff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eaeaea;
  }

  .name {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .text {
    font-size: 1rem;
  }
}

.container-label {
  color: gray;
}

button {
  font-size: 1rem;
  padding: 10px 20px;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  background-color: #fff;
  color: var(--color-primary);
  box-shadow: 0px 1px 4px 0px rgb(0 0 0 / 5%);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: var(--color-primary);
    color: #fff;
  }
}

button.danger {
  background-color: #fff;
  color: #c0392b;

  &:hover {
    background-color: #a63446;
    color: #fff;
  }
}
</style>
