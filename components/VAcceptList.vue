<template>
    <div class="v-accept-list">
        <div class="v-accept-list__list">
            <slot></slot>
        </div>

        <div class="v-accept-list__actions">
            <VButton class="v-accept-list__action" color="secondary" @click="$emit('cancel')">
                {{ $t('page.designing.modal.abort') }}
            </VButton>

            <VButton class="v-accept-list__action" @click="$emit('apply')"
                >{{ $t('page.designing.modal.apply') }}
            </VButton>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import VButton from '@/components/VButton/VButton.vue';

@Component({
    components: { VButton },
})
export default class VAcceptList extends Vue {}
</script>

<style lang="scss">
.v-accept-list {
    display: flex;
    flex-direction: column;
    width: 17.5rem;
    padding-top: 0.75rem;
    background: var(--color-tundora);
    border-radius: 0.5rem;

    &__list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-height: 17.375rem;
        overflow: auto;
        margin-bottom: 1rem;

        &::-webkit-scrollbar {
            background-color: inherit !important;
            width: 4px !important;
        }

        &::-webkit-scrollbar-track {
            background-color: inherit !important;
        }

        & > * {
            flex-shrink: 0;
        }
    }

    &__actions {
        display: flex;
        gap: 0.75rem;
        border-top: 1px solid var(--color-dusty-gray);
        padding: 1rem;
    }

    &__action {
        padding: 0;
        flex-grow: 1;
        font-weight: 400;
        font-size: 0.875rem;
        line-height: 140%;
        min-height: unset;
        height: 2.375rem;
    }
}
</style>
