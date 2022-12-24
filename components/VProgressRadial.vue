<template>
    <span class="radial-progress">
        <span v-if="!hidePercent" :class="progressColor" class="radial-progress__text"> {{ percentTitle }}% </span>

        <slot></slot>

        <svg class="radial-progress__progress" viewBox="0 0 34 34">
            <circle class="radial-progress__meter" cx="17" cy="17" fill="transparent" r="16"></circle>

            <circle
                v-if="completed > 0"
                :class="progressColor"
                :stroke-dasharray="dasharray"
                class="radial-progress__value"
                cx="17"
                cy="17"
                fill="transparent"
                r="16"
                stroke-dashoffset="0"
            ></circle>
        </svg>
    </span>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// mixins
import VProgressMixin from '@/mixins/VProgressMixin';

@Component
export default class VProgressRadial extends VProgressMixin {
    @Prop({ type: Boolean, default: false })
    public hidePercent!: boolean;

    @Prop({ type: String, default: '' })
    public label!: string;

    public get dasharray() {
        return `${this.completed} ${100 - this.completed}`;
    }

    public get percentTitle() {
        const completed = Math.floor(this.completed);

        return !this.$isMobile && this.label ? `${this.label}${completed}` : completed;
    }
}
</script>
<style lang="scss">
.radial-progress {
    display: block;
    position: relative;
    width: 2.6875rem;
    height: 2.6875rem;

    @media (min-width: $grid-breakpoint-md) {
        width: 3.9375rem;
        height: 3.9375rem;
    }

    &__text {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-size: 0.625rem;
        font-weight: 600;
        color: var(--color-green);

        @media (min-width: $grid-breakpoint-md) {
            font-size: 0.9375rem;
        }
    }

    &__progress {
        transform: rotate(-90deg);
        display: block;
        width: 100%;
        height: 100%;
    }

    &__meter {
        stroke-width: 1;
        fill: none;
        stroke: var(--color-border);
    }

    &__value {
        stroke-width: 2;
        fill: none !important;
        stroke: var(--color-green);
        stroke-linecap: round;
    }
}
</style>
