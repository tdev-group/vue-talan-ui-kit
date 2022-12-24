<template>
    <div :class="classes" :style="`grid-template-columns: ${template}`">
        <div
            v-if="$slots.leftHeader"
            :class="[`v-table-row--stage-${this.stage}`, { bordered: !onLeft }]"
            :style="`grid-template-columns: ${stickyLeftCellsTemplate};grid-column: 1/${leftHeaderCellsLength + 1}`"
            class="v-table-row__left-header"
            v-on="$listeners"
        >
            <slot name="leftHeader"></slot>
        </div>

        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VTableRow extends Vue {
    @Prop({ type: Boolean, default: false })
    public head!: boolean;

    @Prop({ type: Boolean, default: false })
    public stickyHead!: boolean;

    @Prop({ type: String, required: true })
    public template!: string;

    @Prop({ type: Boolean, default: false })
    public dark!: boolean;

    @Prop({ type: Boolean, default: false })
    public hovering!: boolean;

    @Prop({ type: Boolean, default: false })
    public autoHeight!: boolean;

    @Prop({ type: Boolean, default: false })
    public borderless!: boolean;

    @Prop({ type: Boolean, default: false })
    public onLeft!: boolean;

    @Prop({ type: Number, default: 1 })
    public stage!: number;

    get classes() {
        return [
            'v-table-row',
            {
                'v-table-row--head': this.head,
                'v-table-row--sticky-head': this.stickyHead,
                'v-table-row--dark': this.dark,
                'v-table-row--hovering': this.hovering,
                'v-table-row--height-auto': this.autoHeight,
                'v-table-row--borderless': this.borderless,
                [`v-table-row--stage-${this.stage}`]: this.leftHeaderCellsLength ? false : this.stage,
            },
        ];
    }

    get leftHeaderCellsLength() {
        return this.$slots?.leftHeader?.length ?? 0;
    }

    get stickyLeftCellsTemplate() {
        if (!this.leftHeaderCellsLength) return '';
        return this.template.split(' ').slice(0, this.leftHeaderCellsLength).join(' ');
    }
}
</script>

<style lang="scss">
.v-table-row {
    $row: &;

    display: grid;
    grid-template-rows: minmax(5rem, auto);

    border-top: 1px solid var(--color-border);

    color: var(--color-text-primary);
    fill: currentColor;
    background: var(--color-white);

    &--head {
        color: var(--color-gray);
        border-top: none;
        grid-template-rows: minmax(3.375rem, auto);
    }

    &--sticky-head {
        position: sticky;
        top: 0;
        border-bottom: 1px solid var(--color-border);
        z-index: 2;
    }

    &--dark {
        color: var(--color-white);
        background: var(--color-tundora);
    }

    &--height-auto {
        height: auto;
    }

    &--borderless {
        border: none;
    }

    &--hovering:hover {
        border-top-color: transparent;
        background: var(--color-semi-gray);
        cursor: pointer;

        #{$row}__left-header {
            background: var(--color-semi-gray);
        }
    }

    &__left-header {
        position: sticky;
        left: 0;
        display: grid;
        background-color: var(--color-white);
        z-index: 1;

        &.bordered {
            border-right: 1px solid var(--color-border);
        }
    }

    @for $i from 1 through 5 {
        $padding: $i * 1.5rem;

        &--stage-#{$i} > :first-child {
            padding-left: $padding !important;
        }
    }
}
</style>
