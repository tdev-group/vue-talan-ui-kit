<template>
    <nav class="app-sidebar-navigation">
        <ul class="app-sidebar-navigation__list">
            <VAppSidebarNavigationListItem
                v-for="(link, idx) in linksList"
                :key="idx"
                v-slot="{ isCollapsed, toggleCollapse }"
            >
                <VAppSidebarNavigationLink
                    :link="link"
                    :collapsible="!!link.children"
                    :is-collapsed="isCollapsed"
                    @toggleCollapse="toggleCollapse"
                ></VAppSidebarNavigationLink>

                <ul
                    v-if="link.children"
                    v-show="!isCollapsed"
                    class="app-sidebar-navigation__list app-sidebar-navigation__list--sublist"
                >
                    <li v-for="(childLink, idx) in link.children" :key="idx">
                        <VAppSidebarNavigationLink :link="childLink" child></VAppSidebarNavigationLink>
                    </li>
                </ul>
            </VAppSidebarNavigationListItem>
        </ul>
    </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Components
import VAppSidebarNavigationLink from './VAppSidebarNavigationLink.vue';
import VAppSidebarNavigationListItem from './VAppSidebarNavigationListItem.vue';

// Interfaces
import AppSidebarNavigationLink from '@/ship/Models/AppSidebarNavigationLink';

@Component({
    components: {
        VAppSidebarNavigationLink,
        VAppSidebarNavigationListItem,
    },
})
export default class VAppSidebarNavigation extends Vue {
    @Prop({ type: Array, required: true })
    public linksList!: AppSidebarNavigationLink[];
}
</script>

<style lang="scss">
.app-sidebar-navigation {
    padding: 1.5rem 1.5rem;

    &__list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        align-items: stretch;
        margin: 0;

        &--sublist {
            margin-top: 0.25rem;
            padding-left: 1.5rem;
        }
    }
}
</style>
