<template>
    <div :class="{ 'v-popped-alert--opened': isOpen }" class="v-popped-alert">
        <slot>{{ label }}</slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Utils
import { debounce } from 'lodash';

// Interfaces
import { TranslateResult } from 'vue-i18n';

@Component
export default class VPoppedAlert extends Vue {
    public label: string | TranslateResult = '';
    public isOpen = false;

    readonly debouncedClose = debounce(this.hide, 2000);

    public show(label: string | TranslateResult = '') {
        this.label = label;
        this.isOpen = true;
        this.debouncedClose();
    }

    public hide() {
        this.isOpen = false;
    }
}
</script>

<style lang="scss">
.v-popped-alert {
    padding: 1rem 3.5rem;
    max-width: 30rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background: var(--color-control-secondary);
    box-shadow: $shadow-default;
    border-radius: 0.5rem;

    color: var(--color-white);
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: center;

    position: absolute;
    left: 50%;
    bottom: 2.5rem;
    z-index: 100;

    opacity: 0;
    visibility: hidden;
    transform: translate(-50%, 2rem);
    transition: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &--opened {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, 0);
    }
}
</style>
