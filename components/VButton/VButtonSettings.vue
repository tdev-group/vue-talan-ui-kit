<template>
    <button
        v-tooltip="{
            content: tooltip,
            placement: 'bottom',
        }"
        :class="{ 'v-button-settings--active': active }"
        class="v-button-settings"
    >
        <slot>
            <SettingsSVG />
        </slot>

        <span v-show="count" class="v-button-settings__counter">
            {{ count }}
        </span>
    </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// SVG
import SettingsSVG from '@/assets/settings.svg';

@Component({
    components: { SettingsSVG },
})
export default class VButtonSettings extends Vue {
    @Prop({ type: Number, default: 0 })
    public count!: number;

    @Prop({ type: Boolean, default: false })
    public active!: boolean;

    @Prop({ type: String, default: '' })
    public tooltip!: boolean;
}
</script>

<style lang="scss">
.v-button-settings {
    position: relative;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    height: 3rem;
    width: fit-content;

    border: 1px solid var(--color-white);
    border-radius: 0.5rem;

    background: var(--color-white);
    color: var(--color-dusty-gray);

    cursor: pointer;
    transition: all 0.2s ease-in-out;

    svg {
        height: 1rem;
    }

    &:hover {
        border-color: var(--color-control-primary);
    }

    &--active {
        border-color: var(--color-control-primary);
    }

    &__counter {
        @extend %message-count;
    }
}
</style>
