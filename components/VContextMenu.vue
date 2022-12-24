<template>
    <div :class="{ 'copy-context--visible': visible }" class="copy-context">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="copy-context__item"
            @click.stop="invokeAction(item.action)"
        >
            {{ item.label }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Interfaces
import { TranslateResult } from 'vue-i18n';

export interface IContextMenuItem {
    label: string | TranslateResult;
    action: () => void;
}

@Component({
    components: {},
})
export default class VContextMenu extends Vue {
    @Prop({ type: Boolean, default: true })
    public hideOnAction!: boolean;

    public items: IContextMenuItem[] = [];
    public visible = true;

    public show(x: number, y: number, items: IContextMenuItem[]) {
        this.items = items;
        this.visible = true;
        this.setElementPosition(x, y);
    }

    public setElementPosition(x: number, y: number) {
        (this.$el as HTMLElement).style.top = `${y}px`;
        (this.$el as HTMLElement).style.left = `${x}px`;
    }

    public hide() {
        this.visible = false;
    }

    public invokeAction(action: IContextMenuItem['action']) {
        if (this.hideOnAction) this.hide();
        action();
    }
}
</script>

<style lang="scss">
.copy-context {
    @extend %dropdown;
    transition: unset;

    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;

    &--visible {
        @extend %dropdown--visible;
    }

    &__item {
        @extend %dropdown-item;
    }
}
</style>
