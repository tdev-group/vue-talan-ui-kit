<template>
    <button :class="classes" type="button" v-on="$listeners">
        <slot></slot>
    </button>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VButtonIcon extends Vue {
    @Prop({ type: [String, Object], default: null })
    public color!: 'blue' | 'red' | 'green' | 'dark' | 'white' | null;

    // Always apply active state color
    @Prop({ type: Boolean, default: false })
    public active!: boolean;

    @Prop({ type: String, default: 'normal' })
    public iconSize!: 'small' | 'normal' | 'big';

    get classes() {
        return [
            'v-button-icon',
            `v-button-icon--${this.iconSize}`,
            this.color ? `v-button-icon--${this.color}` : null,
            {
                'v-button-icon--active': this.active,
            },
        ];
    }
}
</script>
<style lang="scss">
@mixin active($color) {
    &:hover,
    &:focus-visible,
    &.v-button-icon--active {
        color: $color;
        @content;
    }
}

.v-button-icon {
    @include reset-button;
    @extend %icon;

    color: var(--color-dusty-gray);
    fill: currentColor;

    position: relative;

    &--big {
        padding: 0.1rem;
    }

    &--normal {
        padding: 0.1875rem;
    }

    &--small {
        padding: 0.375rem;
    }

    $colors: (
        'blue': var(--color-blue),
        'red': var(--color-red),
        'green': var(--color-control-primary),
        'dark': var(--color-icon-primary),
        'white': var(--color-white),
    );

    @each $name, $color in $colors {
        &--#{$name} {
            @include active($color);
        }
    }

    > svg {
        width: 100%;
        max-height: 100%;
        height: auto;
    }
}
</style>
