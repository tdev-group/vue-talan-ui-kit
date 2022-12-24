<template>
    <modal class="vm-general" v-bind="modalProps" v-on="modalListeners">
        <VModalClose v-if="!hideCloseIcon" @click="hideModal"></VModalClose>

        <slot name="custom">
            <div class="vm-general__wrapper">
                <h2 v-if="title || $slots.title" class="vm-general__title">
                    <slot name="title">{{ title }}</slot>
                </h2>

                <p v-if="description || $slots.description" class="vm-general__description">
                    <slot name="description">{{ description }}</slot>
                </p>

                <slot></slot>

                <div v-if="$scopedSlots.actions" class="vm-general__actions">
                    <slot name="actions" :hideModal="hideModal"></slot>
                </div>

                <div v-show="error || $slots.errors" class="vm-general__errors">
                    <slot name="errors">{{ error }}</slot>
                </div>
            </div>
        </slot>
    </modal>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';

// Utils
import { generateHashId } from '@/utils/Helper';

// Components
import VModalClose from './VModalClose.vue';

// Mixins
import VModalMixin from '@/mixins/VModalMixin';

@Component({
    components: {
        VModalClose,
    },
})
export default class VModalGeneral extends VModalMixin {
    @Prop({ type: String, default: () => generateHashId('modal-') })
    declare name: string;

    @Prop({ type: Number, default: 528 })
    declare maxWidth: number;

    @Prop({ type: String, default: '' })
    public title!: string;

    @Prop({ type: String, default: '' })
    public description!: string;

    @Prop({ type: String, default: '' })
    public error!: string;
}
</script>
<style lang="scss">
.vm-general {
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
        margin: 0 0 2rem;

        @media (min-width: $grid-breakpoint-sm) {
            font-size: 1.5rem;
            line-height: 1.75rem;
        }
    }

    &__description {
        font-size: 0.875rem;
        line-height: 1.4;
        color: var(--color-gray);
        margin: -1rem 0 2rem;

        @media (min-width: $grid-breakpoint-sm) {
            font-size: 1.125rem;
            line-height: 1.3125rem;
        }
    }

    &__actions {
        display: grid;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        gap: 1.25rem;
        margin: 2rem 0 0 0;
    }

    &__errors {
        margin: 1rem auto 0;

        max-width: 92.5%;

        font-size: 0.75rem;
        line-height: 0.875rem;
        text-align: center;
        color: var(--color-text-error);
    }
}
</style>
