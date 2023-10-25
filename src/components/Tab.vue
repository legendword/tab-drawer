<template>
  <div class="tab">
    <div class="checkbox-container">
      <input type="checkbox" :checked="selected" @change="toggleSelect" />
      <label class="tabInfo" for="checkbox">
        <div class="name">{{ tab.title }}</div>
        <div class="text">{{ tab.url }}</div>
      </label>
    </div>

    <div>
      <button v-show="selected" @click="openTab">Open</button>
      <button v-show="selected" class="danger" @click="deleteTab">
        Delete
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab",
  props: {
    tab: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    openTab() {
      chrome.tabs.create({
        active: true,
        url: this.tab.url,
      });
    },
    deleteTab() {
      this.$emit("delete");
    },
    toggleSelect() {
      this.$emit("toggle-selected");
    },
  },
};
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  cursor: pointer;
  border-top: 1px solid #eaeaea;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

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
</style>
