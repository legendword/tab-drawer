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
            <div class="name">
              {{ window.name ? window.name : "Unnamed Window" }}
            </div>
            <div class="text">{{ window.tabs.length }} Tabs</div>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div v-if="selectedWindow" class="window-details">
          <div class="window-header">
            <div class="window-name">
              {{ selectedWindow.name ? selectedWindow.name : "Unnamed Window" }}
            </div>
            <div class="window-actions">
              <button @click="restoreWindow(windowIndex)">Restore</button>
              <button class="danger" @click="activeDialog = 'deleteWindow'">
                Delete
              </button>
            </div>
          </div>
          <div class="tabs-container">
            <div class="container-label">
              <div>{{ selectedWindow.tabs.length }} Tabs</div>
              <div>{{ formatTime(selectedWindow.savedAt) }}</div>
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
    <div v-if="activeDialog" class="overlay" @click="activeDialog = null"></div>
    <div v-if="activeDialog == 'deleteWindow'" class="dialog">
      <div class="dialog-container">
        <div class="dialog-title">Delete Window</div>
        <div class="dialog-content">
          Are you sure you want to delete the window named
          {{ selectedWindow.name ? selectedWindow.name : "Unnamed Window" }}?
        </div>
        <div class="dialog-actions">
          <button @click="activeDialog = null">Cancel</button>
          <button class="danger" @click="deleteWindow(windowIndex)">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windows: [],
      windowIndex: -1,

      activeDialog: null,
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
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.windows?.newValue) {
        this.windows = changes.windows.newValue;
      }
    });
  },
  methods: {
    restoreWindow(index) {
      const windowToOpen = this.windows[index];
      chrome.windows.create({
        focused: true,
        state: windowToOpen.state,
        type: windowToOpen.type,
        url: windowToOpen.tabs.map((tab) => tab.url),
      });
    },
    deleteWindow(index) {
      this.activeDialog = null;
      this.windows.splice(index, 1);
      chrome.storage.local.set({ windows: this.windows });
      this.windowIndex = this.windows.length > index ? index : index - 1;
    },
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
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
  --color-primary: #5d9896;
  --color-highlight: #94bfbe;
  --color-secondary: #bb947e;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;

  .dialog-container {
    background-color: #fff;
    min-width: 600px;
    padding: 20px;
    border-radius: 5px;
  }

  .dialog-title {
    margin: 10px 0 20px 0;
    font-size: 1.3rem;
  }

  .dialog-content {
    margin: 20px 0;
    font-size: 1rem;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
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
  overflow: scroll;
}

.main-container {
  flex: 1;
  height: 100%;
  overflow: scroll;
}

.window {
  padding: 20px;
  cursor: pointer;
  border-top: 1px solid #eaeaea;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #eaeaea;
  }

  &.active {
    background-color: var(--color-highlight);
    color: #fff;
  }

  &:last-child {
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
  padding: 20px;
  color: gray;
}

.tabs-container .container-label {
  display: flex;
  justify-content: space-between;
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
