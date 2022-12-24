<template>
    <VModalGeneral :name="modalName" :title="title" @before-open="beforeOpenHandler">
        <template #description>
            <div v-for="(message, index) in errors" :key="index">{{ `${index + 1}. ${message}` }}</div>
        </template>

        <template #actions="{ hideModal }">
            <VButton fluid @click="hideModal">{{ $t('clear') }}</VButton>
        </template>
    </VModalGeneral>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Services
import ErrorService from '@/utils/ErrorService';

// Components
import VButton from '@/components/VButton/VButton.vue';
import VModalGeneral from './VModalGeneral.vue';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';

// Interfaces
import IModalEvent from '@/ship/Models/IModalEvent';

@Component({
    components: {
        VButton,
        VModalGeneral,
    },
})
export default class VModalError extends Vue {
    readonly modalName = ModalEnum.Error;

    public title: string = '';
    public errors: string[] = [];

    public beforeOpenHandler(event: IModalEvent) {
        const { error } = event.params ?? {};

        this.title = ErrorService.errorMessage(error).toString() ?? '';
        this.errors = ErrorService.innerErrorMessages(error) as string[];
    }
}
</script>
