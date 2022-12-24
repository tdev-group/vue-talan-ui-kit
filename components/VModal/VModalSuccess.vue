<template>
    <VModalGeneral :name="modalName" :title="title" @before-open="beforeOpenHandler">
        <slot>
            <img class="vm-success__image" src="~@/assets/check-circle.png" />
        </slot>

        <template #actions>
            <VButton fluid @click="successClickHandler">{{ label }}</VButton>
        </template>
    </VModalGeneral>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

// Components
import VButton from '@/components/VButton/VButton.vue';
import VModalGeneral from './VModalGeneral.vue';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';

// Interfaces
import IModalEvent from '@/ship/Models/IModalEvent';
import { TranslateResult } from 'vue-i18n';

type IActionHandler = () => void | Promise<void>;

@Component({
    components: {
        VButton,
        VModalGeneral,
    },
})
export default class VModalSuccess extends Vue {
    @Prop({ type: String, default: ModalEnum.Confirm })
    public name!: string;

    readonly modalName = ModalEnum.Success;

    public title: TranslateResult = '';
    public label: TranslateResult = '';
    public successCallback: IActionHandler | null = null;

    public beforeOpenHandler(event: IModalEvent) {
        const { title, label, successCallback } = event.params ?? {};

        this.title = title ?? this.$t('page.modal.success.title');
        this.label = label ?? this.$t('great');
        this.successCallback = successCallback ?? null;
    }

    public successClickHandler() {
        if (this.successCallback) this.successCallback();
        this.$modal.hide(ModalEnum.Success);
    }
}
</script>

<style lang="scss">
.vm-success {
    &__image {
        width: 12rem;
        height: auto;
    }
}
</style>
