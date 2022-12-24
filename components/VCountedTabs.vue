<template>
    <div :class="{ 'v-counted-tabs--spaced-around': spacedAround }" class="v-counted-tabs">
        <button
            v-for="(option, index) in options"
            :key="index"
            :class="{ 'v-counted-tabs__tab--active': option.value === selected }"
            :disabled="option.isDisabled"
            class="v-counted-tabs__tab"
            type="button"
            @click="selectValue(option.value)"
        >
            <span class="v-counted-tabs__tab-text">{{ option.label }}</span>
            <span v-show="option.count" class="v-counted-tabs__tab-counter">{{ option.count }}</span>
        </button>

        <div ref="slider" class="v-counted-tabs__slider"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, VModel, Vue, Watch } from 'vue-property-decorator';

// Interfaces
import ICountedOption from '@/ship/Models/ICountedOption';

@Component({
    components: {},
})
export default class VCountedTabs extends Vue {
    @Ref()
    public slider!: HTMLDivElement;

    @VModel({ type: [Object, Boolean, String, Number, Array], default: null })
    public selected!: ICountedOption['value'];

    @Prop({ type: Array, default: () => [] })
    public options!: ICountedOption[];

    @Prop({ type: Boolean, default: true })
    public spacedAround!: boolean;

    moveSlider() {
        const activeTab = this.$el.querySelector('.v-counted-tabs__tab--active') as HTMLDivElement;
        this.slider.style.width = `${activeTab.clientWidth}px`;
        this.slider.style.left = `${activeTab.offsetLeft}px`;
    }

    public selectValue(value: ICountedOption['value']) {
        this.selected = value;
    }

    @Watch('selected')
    public selectedChangeHandler() {
        this.$nextTick(() => this.moveSlider());
    }

    @Watch('options')
    public optionsChangeHandler() {
        this.$nextTick(() => this.moveSlider());
    }

    mounted() {
        this.moveSlider();
    }
}
</script>

<style lang="scss">
%transition {
    transition: all 0.3s ease-in-out;
}

.v-counted-tabs {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2rem;

    user-select: none;
    border-bottom: 1px solid var(--color-border);

    &__tab {
        $tab: &;
        @include reset-button;
        @extend %transition;

        padding-bottom: 0.5rem;

        display: flex;
        align-items: center;
        gap: 0.5rem;

        color: var(--color-text-tertiary);

        cursor: pointer;

        &--active {
            pointer-events: none;
            color: var(--color-control-primary);
        }

        &:not(&--active) {
            #{$tab}-counter {
                background-color: var(--color-silver);
            }
        }

        &:disabled {
            pointer-events: none;
        }
    }

    &__tab-text {
        font-size: 1.125rem;
    }

    &__tab-counter {
        @extend %message-count;
        @extend %transition;
    }

    &__slider {
        @extend %transition;

        position: absolute;
        bottom: -1px;

        height: 0.125rem;
        background-color: var(--color-control-primary);
        border-radius: 2.5rem;
    }

    &--spaced-around {
        margin-inline: -2rem;
        padding-inline: 2rem;
    }
}
</style>
