<template>
    <div :class="{ 'context-list--visible': visible }" class="context-list">
        <slot></slot>

        <div v-for="(item, index) in items" :key="index" class="context-list__item" @click="select(item)">
            {{ layout(item) }}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class VContextList extends Vue {
    @Prop({ type: Array, default: () => [], required: true })
    public items!: unknown;

    @Prop({ type: Function, default: (value: unknown) => value })
    public layout!: (value: unknown) => unknown;

    @Prop({ type: Function, default: (value: unknown) => value })
    public reduce!: (value: unknown) => unknown;

    public visible = false;

    select(value: unknown) {
        this.$emit('selected', this.reduce(value));
    }

    public show(x: number, y: number) {
        this.visible = true;
        this.setElementPosition(x, y);
    }

    public hide() {
        this.visible = false;
    }

    public setElementPosition(x: number, y: number) {
        const elementHeight = this.$el.clientHeight;
        const elementWidth = this.$el.clientWidth;

        const maxPositionX = window.innerWidth - elementWidth;
        const maxPositionY = window.innerHeight - elementHeight;

        y = y > maxPositionY ? maxPositionY : y;
        x = x > maxPositionX ? maxPositionX : x;

        (this.$el as HTMLElement).style.top = `${y}px`;
        (this.$el as HTMLElement).style.left = `${x}px`;
    }
}
</script>

<style lang="scss">
.context-list {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    display: flex;
    flex-direction: column;
    min-width: 12.5rem;
    max-height: 12.5rem;
    overflow-y: auto;

    padding: 1rem 0;

    background-color: var(--color-tundora);
    border-radius: 0.5rem;

    opacity: 0;
    pointer-events: none;

    &--visible {
        opacity: 1;
        pointer-events: unset;
    }

    &__item {
        cursor: pointer;
        display: flex;
        align-items: center;

        height: 1.75rem;
        padding: 1rem;
        font-size: 0.875rem;
        line-height: 1.4em;
        color: var(--color-white);

        user-select: none;

        &:hover {
            background: var(--color-control-primary);
        }
    }
}
</style>
