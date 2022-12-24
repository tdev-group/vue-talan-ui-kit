<template>
    <button :class="{ active: selected }" class="v-tag" type="button">
        {{ label }}
        <div v-if="count" class="v-tag__counter">{{ count }}</div>
    </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VTag extends Vue {
    @Prop({ type: [String, Number], default: '' })
    public label!: string | number;

    @Prop({ type: Boolean, default: false })
    public selected!: boolean;

    @Prop({ type: Number, default: 0 })
    public count!: number;
}
</script>

<style lang="scss">
.v-tag {
    cursor: pointer;
    user-select: none;

    display: flex;
    height: 1.75rem;
    align-items: center;

    padding: 0 0.75rem;

    font-size: 0.875rem;
    white-space: nowrap;

    color: var(--color-iron);
    background-color: inherit;

    border-radius: 0.5rem;
    border: 1px solid var(--color-dusty-gray);
    outline-color: var(--color-white);

    &__counter {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.0625rem;
        min-width: 1.0625rem;

        color: var(--color-white);
        font-weight: 500;
        font-size: 0.625rem;

        background-color: var(--color-silver);

        border-radius: 0.1875rem;
        padding: 0.1875rem 0.25rem;
        margin-left: 0.5rem;
    }

    &.active {
        color: var(--color-white);
        background-color: var(--color-control-primary);
        border-color: var(--color-control-primary);

        .v-tag__counter {
            color: var(--color-control-primary);
            background-color: var(--color-white);
        }
    }
}
</style>
