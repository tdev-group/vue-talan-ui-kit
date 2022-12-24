<template>
    <VTableRow auto-height template="1fr" v-bind="$attrs">
        <VTableCell>
            <div class="v-table-row-empty">
                <div class="v-table-row-empty__title-slot">
                    <slot>{{ $t('table.tableEmpty') }}</slot>
                </div>

                <div v-if="$slots.action" class="v-table-row-empty__action-slot">
                    <slot name="action"></slot>
                </div>
            </div>
        </VTableCell>
    </VTableRow>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import VTableRow from '@/components/VTableRow.vue';
import VTableCell from '@/components/VTableCell.vue';

@Component({
    inheritAttrs: false,
    components: {
        VTableRow,
        VTableCell,
    },
})
export default class VTableRowEmpty extends Vue {}
</script>

<style lang="scss">
.v-table-row-empty {
    width: 100%;
    padding: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;

    &__title-slot {
        font-size: 1.125rem;
        line-height: 1.17;
        text-align: center;
        color: var(--color-text-tertiary);
    }
}
</style>
