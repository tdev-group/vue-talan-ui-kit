<template>
    <li>
        <slot :is-collapsed="isCollapsed" :toggle-collapse="toggleCollapse"></slot>
    </li>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class VAppSidebarNavigationListItem extends Vue {
    isCollapsed = false;

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
    }
}
</script>
