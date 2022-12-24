<template>
    <div class="vm-general">
        <VModalClose v-if="!hideCloseIcon" @click="hideModal"></VModalClose>

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
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Components
import VModalClose from './VModalClose.vue';

@Component({
    components: {
        VModalClose,
    },
})
export default class VDynamicModalGeneral extends Vue {
    @Prop({ type: String, default: '' })
    public title!: string;

    @Prop({ type: String, default: '' })
    public description!: string;

    @Prop({ type: String, default: '' })
    public error!: string;

    @Prop({ type: Boolean, default: false })
    public hideCloseIcon!: boolean;

    hideModal() {
        this.$emit('close');
    }

    beforeDestroy() {
        this.hideModal();
    }
}
</script>
