<template functional>
    <div :class="[data.staticClass, data.class]" class="v-table-cell" v-bind="data.attrs">
        <slot></slot>
    </div>
</template>

<style lang="scss">
.v-table-cell {
    display: flex;
    align-items: center;

    color: inherit;
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.4em;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 1rem 0.5rem;

    overflow: hidden;

    &:last-child {
        padding-right: 1.5rem;
    }

    &:first-child {
        padding-left: 1.5rem;
    }

    .multiselect,
    .v-datepicker {
        margin-right: 1.5rem;
    }

    // Utility classes
    &--flex-center {
        justify-content: center;
    }

    &--flex-end {
        justify-content: flex-end;
    }

    &--gap-1 {
        gap: 1rem;
    }
}
</style>
