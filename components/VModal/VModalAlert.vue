<template>
    <modal class="vm-alert" v-bind="modalProps" v-on="modalListeners">
        <VModalClose v-if="!hideCloseIcon" @click="hideModal"></VModalClose>

        <div class="vm-alert__wrapper">
            <h2 class="vm-alert__title">{{ title }}</h2>

            <p class="vm-alert__description">{{ description }}</p>

            <VButton class="vm-alert__action" fluid @click="actionCallback">{{ actionLabel }}</VButton>
        </div>
    </modal>
</template>
<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';

// Interfaces
import IModalEvent from '@/ship/Models/IModalEvent';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';

// Components
import VModalClose from './VModalClose.vue';
import VButton from '@/components/VButton/VButton.vue';

// Mixins
import VModalMixin from '@/mixins/VModalMixin';

@Component({
    components: {
        VModalClose,
        VButton,
    },
})
export default class VModalAlert extends VModalMixin {
    @Prop({ type: Boolean, default: true })
    declare hideCloseIcon: boolean;

    @Prop({ type: String, default: ModalEnum.Alert })
    declare name: string;

    @Prop({ type: Number, default: 528 })
    declare maxWidth: number;

    @Prop({ type: Boolean, default: false })
    declare clickToClose: boolean;

    public title: string = '';
    public description: string = '';
    public actionLabel = this.$t('page.modal.answer.confirm');
    public actionCallback = this.hideModal;

    @Emit('before-open')
    public beforeOpenHandler(event: IModalEvent) {
        const { title, description, actionLabel, actionCallback } = event.params ?? {};

        this.title = title ?? '';
        this.description = description ?? '';
        this.actionLabel = actionLabel ?? this.$t('page.modal.answer.confirm');
        this.actionCallback = actionCallback ?? this.hideModal;

        return event;
    }
}
</script>
<style lang="scss">
.vm-alert {
    &__wrapper {
        padding: 3rem 2.5rem;
        text-align: center;

        @media (min-width: $grid-breakpoint-sm) {
            padding: 3.75rem;
        }
    }

    &__title {
        padding: 0;
        font-weight: 500;
        font-size: 1.125rem;
        line-height: 1.3125rem;
        color: var(--color-tundora);
        margin: 0 0 1rem;

        @media (min-width: $grid-breakpoint-sm) {
            font-size: 1.5rem;
            line-height: 1.75rem;
        }
    }

    &__description {
        font-size: 0.875rem;
        line-height: 1.4;
        color: var(--color-gray);
        margin: 0 0 2rem;
        white-space: pre-wrap;

        @media (min-width: $grid-breakpoint-sm) {
            font-size: 1.125rem;
            line-height: 1.3125rem;
        }
    }
}
</style>
