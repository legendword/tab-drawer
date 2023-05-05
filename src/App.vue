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
            <!-- dynamic class -->
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
              <button class="danger" @click="DeleteSelected(windowIndex)">
                Delete Selected
              </button>
              <button class="danger" @click="activeDialog = 'deleteWindow'">
                Delete
              </button>
            </div>
          </div>
          <div class="tabs-container">
            <div class="container-label">
              <div>
                <input
                  type="checkbox"
                  id="checkboxTotal"
                  class="checkbox"
                  @click="checkAllTabs()"
                />
                <label for="checkboxTotal"
                  >{{ selectedWindow.tabs.length }} Tabs</label
                >
              </div>
              <div>{{ formatTime(selectedWindow.savedAt) }}</div>
            </div>
            <div class="tabs">
              <div
                v-for="(tab, ind) in selectedWindow.tabs"
                :key="ind"
                class="tab"
                :class="{
                  active: selectedTabIndex == ind,
                }"
                @click="selectedTabIndex = ind"
              >
                <div class="checkboxTab">
                  <input
                    type="checkbox"
                    id="checkbox"
                    class="checkbox"
                    @click="updateSelectedTabIndices(ind)"
                  />
                  <label class="tabInfo" for="checkbox">
                    <div class="name">{{ tab.title }}</div>
                    <div class="text">{{ tab.url }}</div>
                  </label>
                </div>

                <div>
                  <button
                    v-show="selectedTabIndex == ind"
                    @click="deleteTab(windowIndex, selectedTabIndex)"
                  >
                    Delete
                  </button>
                  <button
                    v-show="selectedTabIndex == ind"
                    @click="openTab(windowIndex, selectedTabIndex)"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <div
      v-show="activeDialog"
      class="overlay"
      @click="activeDialog = null"
    ></div>
    <div v-if="activeDialog == 'deleteWindow'" class="dialog">
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
</template>

<script>
export default {
  data() {
    return {
      windows: [],
      windowIndex: -1,

      activeDialog: null,

      selectedTabIndex: -1,

      selectedTabIndices: [],
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
      console.log(windows);
      if (windows.length > 0) {
        this.windowIndex = 0;
      }
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
    openTab(windowIndex, tabIndex) {
      const tabToOpen = this.windows[windowIndex].tabs[tabIndex];
      chrome.tabs.create({
        active: true,
        url: tabToOpen.url,
      });
    },
    deleteTab(windowIndex, tabIndex) {
      this.windows[windowIndex].tabs.splice(tabIndex, 1);
      chrome.storage.local.set({ tabs: this.windows[windowIndex].tabs });
      chrome.storage.local.set({ windows: this.windows });
      this.windowIndex = this.windows.length > index ? index : index - 1;
      this.selectedTabIndex = -1;
    },

    DeleteSelected(windowIndex) {
      const allTabs = this.windows[windowIndex].tabs;

      const tabsToDelete = allTabs.filter((index) =>
        this.selectedTabIndices.includes(index)
      );
      console.log(tabsToDelete);

      allTabs.splice(0, tabsToDelete.length);
    },

    checkAllTabs() {
      let ifChecked = document.querySelector("#checkboxTotal").checked;
      ifChecked = !ifChecked;
      const checkboxes = document.querySelectorAll("#checkbox");

      if (!ifChecked) {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = true;
        });
      } else {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    },
    updateSelectedTabIndices(ind) {
      if (this.selectedTabIndices.includes(ind)) {
        this.selectedTabIndices = this.selectedTabIndices.filter(
          (index) => index !== ind
        );
      } else {
        this.selectedTabIndices.push(ind);
      }
    },

    formatTime(time) {
      return new Date(time).toLocaleString();
    },

    selectTab() {
      console.log(this);
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  min-width: 600px;
  padding: 20px;
  border-radius: 5px;
  z-index: 11;

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
  display: flex;
  justify-content: space-between;
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

  .checkboxTab {
    display: inline-flex;
    align-items: flex-start;
  }

  .checkbox {
    display: block;
    margin-right: 10px;
  }
}

.checkbox {
  margin-right: 10px;
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
