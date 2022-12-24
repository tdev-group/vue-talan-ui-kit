<template>
    <VModalGeneral
        ref="modal"
        :name="name"
        :title="title"
        @before-open="beforeOpenHandler"
        @before-close="beforeCloseHandler"
        hide-close-icon
        :click-to-close="false"
    >
        <slot></slot>

        <template #actions>
            <VButton color="secondary" outlined @click="rejectHandler">{{ labelNegative }}</VButton>

            <VButton color="primary" :loading="isConfirmButtonLoading" @click="confirmHandler">
                {{ labelPositive }}
            </VButton>
        </template>
    </VModalGeneral>
</template>
<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';

// Components
import VButton from '@/components/VButton/VButton.vue';
import VModalGeneral from './VModalGeneral.vue';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';

// Interfaces
import IModalEvent from '@/ship/Models/IModalEvent';
type IActionHandler = () => void | Promise<void>;

@Component({
    components: {
        VButton,
        VModalGeneral,
    },
})
export default class VModalConfirm extends Vue {
    @Prop({ type: String, default: ModalEnum.Confirm })
    public name!: string;

    @Ref() readonly modal?: VModalGeneral;

    public isConfirmButtonLoading: boolean = false;

    public title = '';
    public onConfirm: null | IActionHandler = null;
    public onReject: null | IActionHandler = null;
    public onClose: null | IActionHandler = null;
    public labelPositive = '';
    public labelNegative = '';
    public hideOnAction = true;

    public beforeOpenHandler(event: IModalEvent) {
        const { title, onConfirm, onReject, labelPositive, labelNegative, hideOnAction, onClose } = event.params ?? {};

        this.title = title ?? '';
        this.onConfirm = onConfirm ?? null;
        this.onReject = onReject ?? null;
        this.onClose = onClose ?? null;
        this.labelPositive = labelPositive ?? this.$t('page.modal.answer.positive');
        this.labelNegative = labelNegative ?? this.$t('page.modal.answer.negative');
        this.hideOnAction = hideOnAction ?? true;
    }

    public beforeCloseHandler(event: IModalEvent) {
        if (this.onClose) this.onClose();
    }

    public async confirmHandler() {
        if (this.onConfirm) {
            this.isConfirmButtonLoading = true;

            try {
                await this.onConfirm();
            } catch (error) {
                this.$modal.show(ModalEnum.Error, { error });
            } finally {
                this.isConfirmButtonLoading = false;
            }
        }

        this.$bus.emit(`${ModalEnum.Confirm}-confirmed`);
        if (this.hideOnAction) this.modal?.hideModal();
    }

    public rejectHandler() {
        if (this.onReject) this.onReject();
        this.$bus.emit(`${ModalEnum.Confirm}-rejected`);
        if (this.hideOnAction) this.modal?.hideModal();
    }
}
</script>
