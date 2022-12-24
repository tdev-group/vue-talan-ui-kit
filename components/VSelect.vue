<template>
    <div class="v-multi-select">
        <VMultiselect
            v-model="selected"
            :class="{ clearable: isClearable, error: error }"
            :multiple="multiple"
            :options="options"
            :placeholder="placeholder"
            v-bind="$attrs"
            @input="inputHandler"
        >
            <template v-if="subLabel" v-slot:option="{ option }">
                <span>{{ getCustomLabel(option, $attrs.label) }}</span>
                <span class="v-multi-select__subLabel">{{ getCustomLabel(option, subLabel) }}</span>
            </template>

            <template slot="noOptions">{{ $t('components.select.noOptions') }}</template>
            <template slot="noResult">{{ $t('components.select.noResult') }}</template>
        </VMultiselect>

        <VButtonIcon
            v-show="isClearable"
            active
            class="v-multi-select__clear"
            color="red"
            icon-size="small"
            @click="clearSelected"
        >
            <CrossSVG />
        </VButtonIcon>
    </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

// SVG
import CrossSVG from '@/assets/cross.svg';

// Components
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

// Utils
import { isEmpty, isEqual } from 'lodash';
import { addHorizontalScroll } from '@/utils/Helper';

@Component({
    inheritAttrs: false,
    components: {
        CrossSVG,
        VButtonIcon,
    },
})
export default class VSelect extends Vue {
    @Prop({ type: String, default: '' })
    public placeholder!: string;

    @Prop({ default: '' })
    public value!: unknown;

    @Prop({ type: Function, default: (value: unknown) => value })
    public reduce!: (value: unknown) => unknown;

    @Prop({ type: Array, default: () => [] })
    public options!: unknown[];

    @Prop({ type: Boolean, default: false })
    public disableClear!: boolean;

    @Prop({ type: Boolean, default: false })
    public multiple!: boolean;

    @Prop({ type: Boolean, default: false })
    public error!: boolean;

    @Prop({ type: String, default: '' })
    public subLabel!: string;

    public selected: unknown = null;

    get isSelected() {
        return !isEmpty(this.selected);
    }

    get isClearable() {
        return this.isSelected && !this.disableClear && !this.$attrs.disabled;
    }

    public clearSelected() {
        this.selected = this.multiple && Array.isArray(this.value) ? [] : null;
        this.$emit('input', this.selected);
    }

    public getOptionByValue(value: unknown) {
        const predicate = (x: unknown) => this.options.find((option) => isEqual(this.reduce(option), x));

        if (this.multiple && Array.isArray(value)) {
            return value.map(predicate);
        }
        return predicate(value);
    }

    @Emit('input')
    public inputHandler(value: unknown) {
        if (this.multiple && Array.isArray(value)) {
            return value.map((option) => this.reduce(option));
        }
        return this.reduce(value);
    }

    public getCustomLabel<T = object>(option: T, label: keyof T) {
        if (isEmpty(option)) return '';
        return label ? option[label] : label;
    }

    public created() {
        this.valueWatchHandler();
    }

    public mounted() {
        if (this.multiple) {
            addHorizontalScroll(this.$el.querySelector('.multiselect__tags-wrap')!, this);
        }
    }

    @Watch('value')
    public valueWatchHandler() {
        this.selected = this.getOptionByValue(this.value);
    }
}
</script>

<style lang="scss">
:root {
    @include defineColor(--v-multi-select-input-border-color, #e5e4e5);
}

.v-multi-select {
    display: flex;
    border-radius: 0.5rem;

    * {
        transition: all 0.2s;
    }

    &__clear {
        margin: auto 0 auto 0.5rem;
    }

    &__subLabel {
        font-size: 0.75rem;
        line-height: 0.875rem;
        color: var(--color-dusty-gray);
    }

    .multiselect {
        &__input,
        &__single,
        &__placeholder {
            margin: 0 !important;
            padding-left: 0.5rem;

            height: 100%;
            color: var(--color-tundora);
            font-size: 0.875rem;
            line-height: 2.75rem;

            text-overflow: clip;
            overflow: hidden;
            max-width: 100%;
        }

        &__tags {
            border: 1px solid var(--v-multi-select-input-border-color);
            border-radius: 0.5rem !important;
            height: 3rem;
            padding-top: 0 !important;
        }

        &__tags-wrap {
            display: flex;
            align-items: center;
            height: 100%;
            padding-left: 0.5rem;
            overflow-x: scroll;

            &::-webkit-scrollbar {
                height: 0;
            }
        }

        &__tag {
            background-color: var(--color-control-primary);

            font-size: 0.875rem;
            line-height: 1rem;

            padding: 0.25rem 1.5rem 0.25rem 0.5rem;
            margin: 0 0.25rem 0 0;

            height: 1.5rem;
            overflow: unset;
            text-overflow: unset;
        }

        &__tag-icon {
            line-height: 1.25rem;

            &::after {
                content: '✕';
                font-size: 0.5rem;
            }

            &:hover {
                background-color: inherit;
            }
        }

        &__content-wrapper {
            margin: 0.5rem 0;
            border-radius: 0.5rem;
            background: var(--color-tundora);
            color: var(--color-white);
            padding: 0.5rem 0;
            height: fit-content;
            min-width: 100%;
            overflow: hidden auto;
            max-width: 120%;
        }

        &__content {
            width: 100%;
        }

        &__element {
            margin: 0.5rem 0;

            &:hover {
                background: var(--color-control-primary);

                span {
                    color: var(--color-white);
                }
            }
        }

        &__option {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 0.25rem;
            max-width: 100%;

            height: auto !important;
            padding: 0.25rem 2rem 0.25rem 1rem !important;

            white-space: unset;
            word-break: break-word;

            &::after {
                width: 0.5rem !important;
                height: 0.2rem !important;
                min-height: unset !important;
            }

            &--highlight,
            &--selected {
                color: var(--color-white) !important;
                background: transparent !important;

                &::after {
                    content: '' !important;

                    color: var(--color-white) !important;
                    background: transparent !important;
                    right: -0.375rem !important;
                }
            }

            &--selected::after {
                display: block;

                padding: 0 !important;
                margin-right: 1.25rem;
                top: 50%;

                border-right: 1px solid var(--color-white);
                border-top: 1px solid var(--color-white);
                transform: translateY(-50%) rotate(135deg);
            }
        }

        &__select {
            top: 50%;
            transform: translateY(-50%);

            &::before {
                transition: all 0.15s;

                display: block;
                top: 0.625rem;
                margin: auto;

                width: 0.55rem;
                height: 0.55rem;

                border-color: var(--color-dusty-gray);
                border-right: 1px solid;
                border-top: 1px solid;
                border-bottom: none;
                border-left: none;
                transform: rotate(135deg);
                border-width: 1px;
            }
        }

        &__spinner {
            top: 50%;
            transform: translateY(-50%);
        }

        &--active .multiselect {
            &__tags {
                border-color: var(--color-control-active);
            }

            &__select {
                transform: translateY(-50%) !important;

                &::before {
                    top: 1rem;
                    border-right: none;
                    border-top: none;
                    border-left: 1px solid;
                    border-bottom: 1px solid;
                }
            }

            &__tags-wrap {
                display: none;
            }
        }

        &--disabled {
            border-radius: 0.5rem;
        }
    }

    .clearable.multiselect {
        max-width: calc(100% - 2rem);
    }

    .error .multiselect__tags {
        border-color: var(--color-red);
    }
}
</style>
