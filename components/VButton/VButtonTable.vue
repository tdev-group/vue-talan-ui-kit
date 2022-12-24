<template>
    <VButton class="v-button-table" :disabled="disabled" :active="active" :color="null" v-on="$listeners">
        <template #prepend>
            <span v-show="counter" class="v-button-table__counter">{{ counter }}</span>

            <component :is="iconComponent" v-if="iconComponent" class="v-button-table__icon" />
        </template>

        <slot></slot>
    </VButton>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { VueConstructor } from 'vue/types/umd';

// SVG
import PlusSVG from '@/assets/plus.svg';

// Components
import VButton from './VButton.vue';

@Component({
    components: { PlusSVG, VButton },
})
export default class VButtonTable extends Vue {
    @Prop({ type: Number, default: 0 })
    public counter!: number;

    @Prop({ type: Object, default: () => null })
    public iconComponent!: VueConstructor | null;

    @Prop({ type: Boolean, default: false })
    public disabled!: boolean;

    // Applies active style as it is focused.
    @Prop({ type: Boolean, default: false })
    public active!: boolean;
}
</script>
<style lang="scss">
.v-button-table {
    $button-table: &;

    padding: 0.625rem 1rem;
    min-height: 2.75rem;

    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5rem;

    border: 1px solid var(--color-border);

    @media (hover: hover) {
        &:hover {
            border-color: var(--color-alabaster);
            background: var(--color-alabaster);
        }
    }

    &:active,
    &:focus-visible,
    &.v-button--active {
        border-color: var(--color-control-primary);
    }

    &:disabled,
    &.v-button--disabled {
        color: var(--color-silver);

        #{$button-table}__icon {
            color: inherit;
        }
    }

    &__icon,
    &__counter {
        @extend %icon;
    }

    &__icon {
        color: var(--color-dusty-gray);
    }

    &__counter {
        border-radius: 50%;
        background-color: var(--color-border);
    }
}
</style>
