<template>
    <RouterLink v-slot="{ href, navigate, isActive }" :to="link.to" custom>
        <VButton
            :color="isActive ? 'primary' : 'white'"
            :href="href"
            :class="child ? 'v-button--sidebar-child' : 'v-button--sidebar'"
            fluid
            tag="a"
            @click="navigate"
        >
            <template v-if="link.icon" #prepend>
                <component
                    class="app-sidebar-navigation-link__icon"
                    :class="{ 'app-sidebar-navigation-link__icon--child': child }"
                    :is="link.icon"
                ></component>
            </template>

            {{ $te(link.label) ? $t(link.label) : link.label }}

            <ChevronRightSVG
                v-if="collapsible"
                class="app-sidebar-navigation-link__chevron"
                :class="{ 'app-sidebar-navigation-link__chevron--collapsed': isCollapsed }"
                @click.stop.prevent="$emit('toggleCollapse')"
            ></ChevronRightSVG>
        </VButton>
    </RouterLink>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

// SVG
import ChevronRightSVG from '@/assets/chevron-right.svg';

// Components
import VButton from '@/components/VButton/VButton.vue';

// Interfaces
import AppSidebarNavigationLink from '@/ship/Models/AppSidebarNavigationLink';

@Component({
    components: {
        ChevronRightSVG,
        VButton,
    },
})
export default class VAppSidebarNavigationLink extends Vue {
    @Prop({ type: Object, required: true })
    public link!: AppSidebarNavigationLink;

    @Prop({ type: Boolean, default: false })
    public child!: boolean;

    @Prop({ type: Boolean, default: false })
    public collapsible!: boolean;

    @Prop({ type: Boolean, default: false })
    public isCollapsed!: boolean;
}
</script>

<style lang="scss">
.app-sidebar-navigation-link {
    &__icon {
        @extend %icon;

        &--child {
            width: 1rem;
            height: 1rem;
        }
    }

    &__chevron {
        @extend %icon;

        position: absolute;
        right: 0.75rem;
        transform: rotateZ(90deg);
        transition: 0.1s;

        &--collapsed {
            transform: rotateZ(0deg);
        }
    }
}
</style>
