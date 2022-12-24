<template>
    <modal class="modal" v-bind="modalProps" v-on="modalListeners">
        <VGridFlex class="grid-flex_fluid grid-flex_column">
            <VGridRow class="grid-row_padding-y modal__title">
                <span class="text text_md">{{ title }}</span>
            </VGridRow>

            <VGridRow class="grid-row_padding-y">
                <slot></slot>
            </VGridRow>
        </VGridFlex>
    </modal>
</template>
<script lang="ts">
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { VGridCol, VGridFlex, VGridRow } from 'vui';

// Mixins
import VModalMixin from '@/mixins/VModalMixin';

@Component({
    components: { VGridCol, VGridRow, VGridFlex },
})
class VModal extends VModalMixin {
    @Prop({ type: String, default: '' })
    public title!: string;
}

export default VModal;
</script>
<style lang="scss">
.v--modal-overlay .v--modal-box {
    overflow: visible !important;
}

.modal {
    &__title {
        display: flex;
        flex-wrap: nowrap;
        padding: 15px 20px 12px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        background: whitesmoke;
        align-items: center;
        justify-content: center;
    }

    &__button {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        padding: 5px 15px;

        &_hover {
            margin-top: -1px;

            &:hover {
                padding: 4px 15px;
                border-top: 1px solid var(--border-line);
                border-bottom: 1px solid var(--border-line);
            }
        }

        &_hover-only {
            margin-bottom: -1px;
            padding: 4px 15px;
            border-top: 1px solid var(--border-line);
            border-bottom: 1px solid var(--border-line);

            &:hover {
                z-index: 100;
                border-top: 1px solid var(--border-line-2);
                border-bottom: 1px solid var(--border-line-2);
            }
        }

        &_fluid {
            width: calc(100% + 30px);
            margin-left: -15px;
            margin-right: -15px;
        }
    }
}
</style>
