<template functional>
    <div :class="[data.staticClass, data.class]" class="cloud-directory-item" v-bind="data.attrs" v-on="data.on">
        <div class="cloud-directory-item__icon-spot">
            <slot name="icon"></slot>
        </div>

        <div class="cloud-directory-item__label-spot">
            <slot name="label"></slot>
        </div>

        <div class="cloud-directory-item__actions-spot">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<style lang="scss">
.cloud-directory-item {
    height: 2.625rem;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;

    border-radius: 0.8125rem;

    &--disabled {
        pointer-events: none;
        filter: grayscale(1);
    }

    &--loading {
        .cloud-directory-item__icon-spot {
            filter: grayscale(1);
        }
    }

    &:hover,
    &:active {
        background: var(--color-alabaster);
    }

    &__icon-spot {
        width: 2.625rem;
        height: 2.625rem;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        color: var(--color-control-primary);

        > svg {
            width: 1.5rem;
        }
    }

    &__label-spot {
        @include text-overflow-ellipsis;

        color: var(--color-text-primary);
        font-size: 1.125rem;
        line-height: 1.17;
        padding-left: 0.5rem;
    }

    &__actions-spot {
        padding: 0.5rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-shrink: 0;
        gap: 0.5rem;
        margin: auto 0 auto auto;
    }
}
</style>
