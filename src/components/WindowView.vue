<template>
  <div class="window-view">
    <div class="window-header">
      <div class="window-name">
        {{ win.name ? win.name : "Unnamed Window" }}
      </div>
      <div class="window-actions">
        <button @click="restoreWindow">Restore Window</button>
        <button class="danger" @click="$emit('show-dialog', 'deleteWindow')">
          Delete Window
        </button>
      </div>
    </div>
    <div class="tabs-container">
      <div class="container-label">
        <div class="checkbox-container">
          <input
            type="checkbox"
            :checked="selectedTabs.length > 0"
            @change="toggleSelectAllTabs"
            ref="allCheckbox"
          />
          <label>{{ win.tabs.length }} Tabs</label>
          <button class="small" :disabled="selectedTabs.length === 0" @click="restoreSelectedTabs">Restore Selected</button>
          <button class="small danger" :disabled="selectedTabs.length === 0" @click="deleteSelectedTabs">Delete Selected</button>
        </div>
        <div>{{ formatTime(win.savedAt) }}</div>
      </div>
      <div class="tabs">
        <tab
          v-for="(tab, ind) in win.tabs"
          :key="ind"
          :tab="tab"
          :selected="selectedTabs.includes(tab.id)"
          @toggle-selected="toggleSelectTab(tab.id)"
          @delete="deleteTab(tab.id)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tab from "./Tab.vue";

export default {
  components: {
    Tab,
  },
  name: "window-view",
  props: {
    win: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedTabs: [],
    };
  },
  watch: {
    selectedTabs: {
      handler(selectedTabs) {
        if (selectedTabs.length > 0 && selectedTabs.length < this.win.tabs.length) {
          this.$refs.allCheckbox.indeterminate = true;
        } else {
          this.$refs.allCheckbox.indeterminate = false;
        }
      },
      deep: true,
    },
    win() {
      this.selectedTabs = [];
    },
  },
  methods: {
    restoreWindow() {
      chrome.windows.create({
        focused: true,
        state: this.win.state,
        type: this.win.type,
        url: this.win.tabs.map((tab) => tab.url),
      });
    },
    toggleSelectAllTabs() {
      if (this.selectedTabs.length === 0) {
        this.selectedTabs = this.win.tabs.map((tab) => tab.id);
      } else {
        this.selectedTabs = [];
      }
    },
    toggleSelectTab(tabId) {
      if (this.selectedTabs.includes(tabId)) {
        this.selectedTabs = this.selectedTabs.filter((id) => id != tabId);
      } else {
        this.selectedTabs.push(tabId);
      }
    },
    deleteTab(tabId) {
      const tabs = this.win.tabs.filter((tab) => tab.id != tabId);
      this.$emit("update-tabs", tabs);
    },
    restoreSelectedTabs() {
      const tabUrls = [];
      for (const tab of this.win.tabs) {
        if (this.selectedTabs.includes(tab.id)) {
          tabUrls.push(tab.url);
        }
      }
      chrome.windows.create({
        focused: true,
        url: tabUrls,
      });
    },
    deleteSelectedTabs() {
      const remainingTabs = this.win.tabs.filter((tab) => {
        return !this.selectedTabs.includes(tab.id);
      });
      this.$emit("update-tabs", remainingTabs);
    },
    formatTime(time) {
      return new Date(time).toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.window-view {
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

.tabs-container .container-label {
  display: flex;
  justify-content: space-between;
}
</style>