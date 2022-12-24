<template>
    <div :class="{ 'v-form-field--required': required }" class="v-form-field">
        <span v-if="label" class="v-form-field__label" :title="layoutLabel">{{ layoutLabel }}</span>

        <div :class="{ 'v-form-field__body--checkbox': checkbox }" class="v-form-field__body">
            <slot></slot>
        </div>

        <span v-show="errorText" class="v-form-field__errors">{{ errorText }}</span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VFormField extends Vue {
    @Prop({ type: String, default: '' })
    public label!: string;

    @Prop({ type: Boolean, default: false })
    public required!: boolean;

    @Prop({ type: String, default: '' })
    public errorText!: string;

    @Prop({ type: Boolean, default: false })
    public checkbox!: boolean;

    get layoutLabel() {
        return this.$te(this.label) ? this.$t(this.label) : this.label;
    }
}
</script>

<style lang="scss">
.v-form-field {
    $field: &;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    text-align: left;

    &__label {
        @include text-overflow-ellipsis();
        color: var(--color-text-secondary);
    }

    &__errors {
        color: var(--color-red);
    }

    &__body {
        &--checkbox {
            display: flex;
            gap: 0.625rem;
        }
    }

    &--required {
        #{$field}__label::after {
            content: ' *';
            color: var(--color-red);
            font-size: inherit;
        }
    }
}
</style>
