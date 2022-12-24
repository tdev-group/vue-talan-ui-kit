<template>
    <VModalGeneral :name="modalName" :title="title" :description="description" @before-open="beforeOpenHandler">
        <template #actions="{ hideModal }">
            <VButton color="secondary" outlined @click="hideModal">{{ cancelLabel }}</VButton>

            <VButton color="red" @click="acceptHandler">{{ acceptLabel }}</VButton>
        </template>
    </VModalGeneral>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Interfaces
import IModalEvent from '@/ship/Models/IModalEvent';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';

// Components
import VButton from '@/components/VButton/VButton.vue';
import VModalGeneral from './VModalGeneral.vue';

type IActionHandler = () => void | Promise<void>;

@Component({
    components: {
        VButton,
        VModalGeneral,
    },
})
export default class VModalDanger extends Vue {
    readonly modalName = ModalEnum.Danger;

    public title: string = '';
    public description: string = '';
    public onAccept: null | IActionHandler = null;
    public cancelLabel = '';
    public acceptLabel = '';
    public hideOnAction = true;

    public acceptHandler() {
        if (this.onAccept) this.onAccept();
        if (this.hideOnAction) this.$modal.hide(this.modalName);
    }

    public beforeOpenHandler(event: IModalEvent) {
        const { title, description, onAccept, cancelLabel, acceptLabel, hideOnAction } = event.params ?? {};

        this.title = title ?? '';
        this.description = description ?? '';
        this.onAccept = onAccept ?? null;
        this.cancelLabel = cancelLabel ?? this.$t('cancel');
        this.acceptLabel = acceptLabel ?? this.$t('accept');
        this.hideOnAction = hideOnAction ?? true;
    }
}
</script>
