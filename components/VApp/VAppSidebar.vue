<template>
    <aside :class="classes" class="app-sidebar">
        <slot></slot>
    </aside>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

@Component
export default class VAppSidebar extends Vue {
    @VModel({ type: Boolean, default: true })
    public visible!: boolean;

    @Prop({ type: String, default: 'medium' })
    public width!: 'mini' | 'narrow' | 'medium' | 'wide';

    @Prop({ type: Boolean, default: false })
    public topBordered!: boolean;

    // Places the sidebar on the right
    @Prop({ type: Boolean, default: false })
    public right!: boolean;

    get classes() {
        return [
            `app-sidebar--${this.width}`,
            {
                'app-sidebar--w0': !this.visible,
                'app-sidebar--top-bordered': this.topBordered,
                'app-sidebar--right': this.right,
            },
        ];
    }
}
</script>

<style lang="scss">
.app-sidebar {
    height: 100%;
    z-index: $zindex-sidebar;
    flex-shrink: 0;

    border: 0 solid var(--color-border);

    transition: width 0.3s ease;
    overflow: hidden auto;

    &--right {
        order: 10;
    }

    &--medium {
        width: 16rem;

        + main {
            width: calc(100% - 16rem);
        }
    }

    &--w0 {
        width: 0;
    }

    &--top-bordered {
        border-top-width: 1px;
    }
}
</style>
