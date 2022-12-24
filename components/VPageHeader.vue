<template>
    <div class="page-header" :class="{ 'page-header--without-margin': noMargin }">
        <slot>
            <h1 class="page-header__title">{{ $te(title) ? $t(title) : title }}</h1>
        </slot>

        <div class="page-header__actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VPageHeader extends Vue {
    @Prop({ type: String, default: '' })
    public title!: string;

    @Prop({ type: Boolean, default: false })
    public noMargin!: boolean;
}
</script>

<style lang="scss">
.page-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    margin-bottom: 1.5rem;
    min-height: 3.0625rem;

    &__title {
        color: var(--color-tundora);
        font-weight: 500;
        font-size: 2rem;
        line-height: 2.375rem;
        margin: 0;
    }

    &__actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        .v-search {
            width: 21.25rem;
        }
    }

    &--without-margin {
        margin: 0;
    }
}
</style>
