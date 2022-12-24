<template>
    <component :is="tag" :class="classes" :disabled="blocked" :tabindex="-blocked" v-bind="$attrs" v-on="$listeners">
        <slot name="prepend">
            <VSpinner v-if="loading" class="v-button__spinner"></VSpinner>
        </slot>

        <span class="v-button__content">
            <slot></slot>
        </span>

        <slot name="append"></slot>
    </component>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Enums
import ButtonColorsEnum from '@/ship/Enums/ButtonColorsEnum';

// Components
import VSpinner from '@/components/VSpinner.vue';

@Component({
    inheritAttrs: false,
    components: { VSpinner },
})
export default class VButton extends Vue {
    @Prop({ type: [String, Object], default: ButtonColorsEnum.Primary })
    public color!: ButtonColorsEnum | null;

    // Makes the background transparent and applies a thin border
    @Prop({ type: Boolean, default: false })
    public outlined!: boolean;

    @Prop({ type: Boolean, default: false })
    public fluid!: boolean;

    @Prop({ type: Boolean, default: false })
    public disabled!: boolean;

    // Applies active style as it is focused.
    @Prop({ type: Boolean, default: false })
    public active!: boolean;

    @Prop({ type: Boolean, default: false })
    public loading!: boolean;

    // Makes the component small
    @Prop({ type: Boolean, default: false })
    public small!: boolean;

    // Specify a custom tag used on the root element.
    @Prop({ type: String, default: 'button' })
    public tag!: string;

    // Applies the dark theme variant to the component.
    @Prop({ type: Boolean, default: false })
    public dark!: boolean;

    // Applies the light theme variant to the component.
    @Prop({ type: Boolean, default: false })
    public light!: boolean;

    public get blocked() {
        return this.disabled || this.loading;
    }

    public get classes() {
        return [
            'v-button',
            this.color ? `v-button--${this.color}` : null,
            {
                'v-button--fluid': this.fluid,
                'v-button--disabled': this.blocked,
                'v-button--active': this.active,
                'v-button--small': this.small,
                'v-button--outlined': this.outlined,
                'v-button--loading': this.loading,
            },
        ];
    }
}
</script>
<style lang="scss">
$btn-border-radius: 0.5rem !default;
$btn-font-weight: 500 !default;
$btn-outline-border-width: 0.0625rem !default;

$btn-transition-duration: 0.15s !default;
$btn-transition-fn: ease-in-out !default;

@mixin get-solid-btn-styles($color) {
    color: var(--button-#{$color}-color);
    background: var(--button-#{$color}-bg-color);

    @media (hover: hover) {
        &:hover {
            background: var(--button-#{$color}-bg-hover-color);
        }
    }

    &:active,
    &:focus-visible,
    &.v-button--active {
        background: var(--button-#{$color}-bg-active-color);
    }

    &:disabled,
    &.v-button--disabled {
        background: var(--button-disabled-color);
    }
}

@mixin get-outlined-btn-styles($color) {
    color: var(--button-#{$color}-outlined-color);

    @if var(--button-#{$color}-border-color) {
        border-color: var(--button-#{$color}-border-color);
    }

    @media (hover: hover) {
        &:hover {
            background: var(--button-#{$color}-outlined-bg-hover-color);
        }
    }

    &:active,
    &:focus-visible,
    &.v-button--active {
        background: var(--button-#{$color}-outlined-bg-active-color);
    }

    &:disabled,
    &.v-button--disabled {
        color: var(--button-disabled-color);
    }
}

:root {
    @include defineColor(--button-disabled-color, #e5e4e5);

    // Primary button colors
    @include defineColor(--button-primary-color, $color-white);
    @include defineColor(--button-primary-bg-color, $color-control-primary);
    @include defineColor(--button-primary-bg-hover-color, #52c991);
    @include defineColor(--button-primary-bg-active-color, #199f60);

    @include defineColor(--button-primary-outlined-color, $color-control-primary);
    @include defineColor(--button-primary-outlined-bg-hover-color, #f3fcf8);
    @include defineColor(--button-primary-outlined-bg-active-color, #ddf0e8);

    // Red button colors
    @include defineColor(--button-red-color, $color-white);
    @include defineColor(--button-red-bg-color, $color-red);
    @include defineColor(--button-red-bg-hover-color, #ff5a22);
    @include defineColor(--button-red-bg-active-color, #d84412);

    @include defineColor(--button-red-outlined-color, $color-red);
    @include defineColor(--button-red-outlined-bg-hover-color, $color-white);
    @include defineColor(--button-red-outlined-bg-active-color, $color-white);

    // Secondary button colors
    @include defineColor(--button-secondary-color, $color-iron);
    @include defineColor(--button-secondary-bg-color, #646464);
    @include defineColor(--button-secondary-bg-hover-color, $color-gray);
    @include defineColor(--button-secondary-bg-active-color, darken($color-gray, 10%));

    @include defineColor(--button-secondary-outlined-color, $color-gray);
    @include defineColor(--button-secondary-outlined-bg-hover-color, #f7f7f7);
    @include defineColor(--button-secondary-outlined-bg-active-color, #ebebeb);

    // Danger button colors
    @include defineColor(--button-red-color, $color-white);
    @include defineColor(--button-red-bg-color, $color-red);
    @include defineColor(--button-red-bg-hover-color, #ff5a22);
    @include defineColor(--button-red-bg-active-color, #d84412);

    // Dark button colors
    @include defineColor(--button-dark-outlined-color, $color-tundora);
    @include defineColor(--button-dark-outlined-bg-hover-color, #f6f6f6);
    @include defineColor(--button-dark-outlined-bg-active-color, #ebebeb);

    // White button colors
    @include defineColor(--button-white-color, $color-text-primary);
    @include defineColor(--button-white-bg-color, $color-white);
    @include defineColor(--button-white-border-color, $color-border);
    @include defineColor(--button-white-bg-hover-color, $color-alabaster);
    @include defineColor(--button-white-bg-active-color, $color-alabaster);

    @include defineColor(--button-white-outlined-color, $color-tundora);
    @include defineColor(--button-white-outlined-bg-hover-color, $color-alabaster);
    @include defineColor(--button-white-outlined-bg-active-color, #ddf0e8);
}

.v-button {
    $button: &;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    gap: 0.5rem;

    border-radius: $btn-border-radius;
    background: transparent;

    font-weight: $btn-font-weight;
    font-family: inherit;
    text-decoration: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    color: var(--color-text-primary);
    fill: currentColor;

    outline: 0;
    border: none;
    cursor: pointer;
    position: relative;

    transition-duration: $btn-transition-duration;
    transition-property: background-color, transform, opacity, border-color;
    transition-timing-function: $btn-transition-fn;

    padding: 0.875rem 2rem;
    min-height: 3.0625rem;
    font-size: 1.125rem;
    line-height: 1.17;

    > * {
        flex-shrink: 0;
    }

    &--small {
        padding: 0.6875rem 2rem;
        min-height: 2.375rem;
        font-size: 0.875rem;
        line-height: 1.14;
    }

    &--primary:not(&--outlined) {
        @include get-solid-btn-styles('primary');
    }

    &--primary#{$button}--outlined {
        @include get-outlined-btn-styles('primary');
    }

    &--secondary:not(&--outlined) {
        @include get-solid-btn-styles('secondary');
    }

    &--secondary#{$button}--outlined {
        @include get-outlined-btn-styles('secondary');
    }

    &--dark#{$button}--outlined {
        @include get-outlined-btn-styles('dark');
    }

    &--red:not(&--outlined) {
        @include get-solid-btn-styles('red');
    }

    &--white:not(&--outlined) {
        @include get-solid-btn-styles('white');
    }

    &--white#{$button}--outlined {
        @include get-outlined-btn-styles('white');
    }

    &--fluid {
        width: 100%;
    }

    &--outlined {
        border: $btn-outline-border-width solid currentColor;
    }

    &__spinner {
        width: 1em;
        height: 1em;
        border-width: 0.15em;
        color: inherit;
    }

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
    }

    &:disabled,
    &--disabled {
        transition: none;
        pointer-events: none;
    }

    // Static classes
    &--sidebar {
        padding: 0.75rem;
        font-weight: 400;
        justify-content: start;
        text-align: left;
    }

    &--sidebar-child {
        @extend #{$button}--sidebar;
        font-size: 0.875rem;
    }
}
</style>
