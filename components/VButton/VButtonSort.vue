<template>
    <div class="v-button-sort__wrapper">
        <VButtonSettings :active="showList" :tooltip="$t('sort')" class="v-button-sort" @click.native="toggleListShow">
            <SortSVG />
        </VButtonSettings>

        <VAcceptList
            v-show="showList"
            class="v-button-sort__list"
            :class="`v-button-sort__list--${position}`"
            @cancel="toggleListShow"
            @apply="apply"
        >
            <label v-for="(option, index) in options" :key="index" class="v-button-sort__option">
                <VRadioButton
                    :key="index + localValue"
                    :checked="option.value === localValue"
                    :name="`${_uid}-sorts`"
                    @click="select(option.value)"
                />
                {{ option.label }}
            </label>
        </VAcceptList>
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

// Components
import VButtonSettings from '@/components/VButton/VButtonSettings.vue';
import VAcceptList from '@/components/VAcceptList.vue';
import VRadioButton from '@/components/VRadioButton.vue';

// SVG
import SortSVG from '@/assets/sort.svg';

// Interfaces
import IOption from '@/ship/Models/IOption';

@Component({
    components: { VRadioButton, VAcceptList, VButtonSettings, SortSVG },
})
export default class VButtonSort extends Vue {
    @VModel({ type: [Object, Array, Number, String, Boolean] })
    public selected!: IOption['value'];

    @Prop({ type: Array, required: true })
    public options!: IOption[];

    @Prop({ type: String, default: 'left' })
    public position!: 'left' | 'right' | 'center';

    localValue: IOption['value'] | null = null;
    showList = false;

    public toggleListShow() {
        this.showList = !this.showList;
        if (this.showList) this.localValue = this.selected;
    }

    public select(value: IOption['value']) {
        this.localValue = value;
    }

    public apply() {
        this.selected = this.localValue;
        this.showList = false;
    }
}
</script>

<style lang="scss">
.v-button-sort {
    &__list {
        position: absolute;
        z-index: 100;
        top: 4rem;
        right: 0;

        &--left {
            right: 0;
        }

        &--right {
            left: 0;
        }

        &--center {
            transform: translateX(50%);
        }
    }

    &__wrapper {
        position: relative;
    }

    &__option {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        height: 2rem;
        padding-left: 1.125rem;

        color: var(--color-white);
        font-size: 0.875rem;
        line-height: 1.4em;

        cursor: pointer;

        &:hover {
            background: var(--color-control-primary);
        }
    }
}
</style>
