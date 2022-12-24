<template>
    <div
        :class="{ 'v-table--outlined': outlined, 'v-table--scrollable': scrollable }"
        class="v-table"
        @scroll="handleScroll"
    >
        <VTableRowEmpty v-if="loading" borderless>
            <VSpinner></VSpinner>
        </VTableRowEmpty>

        <slot v-else :onLeft="onLeft" :onTop="onTop"></slot>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Components
import VSpinner from '@/components/VSpinner.vue';
import VTableRowEmpty from '@/components/VTableRowEmpty.vue';

@Component({
    components: {
        VSpinner,
        VTableRowEmpty,
    },
})
export default class VTable extends Vue {
    @Prop({ type: Boolean, default: false })
    public outlined!: boolean;

    @Prop({ type: Boolean, default: false })
    public scrollable!: boolean;

    @Prop({ type: Boolean, default: false })
    public loading!: boolean;

    // Scroll position
    onLeft = true;
    onTop = true;

    handleScroll(event: Event) {
        const { target } = event;
        const { scrollLeft, scrollTop } = target as HTMLElement;
        this.onTop = scrollTop === 0;
        this.onLeft = scrollLeft === 0;
    }
}
</script>

<style lang="scss">
.v-table {
    @extend %table-styled-scroll;

    display: grid;
    position: relative;
    grid-template-columns: 1fr;

    border-radius: 1.125rem;
    overflow: hidden;

    & > {
        :first-child {
            border-radius: 1.125rem 1.125rem 0 0;
        }

        :last-child {
            border-radius: 0 0 1.125rem 1.125rem !important;
        }
    }

    &--outlined {
        border: 1px solid var(--color-border);
    }

    &--scrollable {
        @extend %table-styled-scroll;

        overflow: auto;
        padding-right: 1rem;
        margin-right: -1rem;
        padding-bottom: 1rem;
        margin-bottom: -1rem;
    }
}
</style>
