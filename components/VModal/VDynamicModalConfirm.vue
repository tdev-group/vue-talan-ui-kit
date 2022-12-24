<template>
    <VDynamicModalGeneral :title="title" :error="errorText" hide-close-icon @close="close(false)">
        <template #actions>
            <VButton :color="rejectButtonColor" outlined @click="close(false)">{{ labelNegative }}</VButton>

            <VButton :color="confirmButtonColor" :loading="isConfirmButtonLoading" @click="confirmHandler">{{
                labelPositive
            }}</VButton>
        </template>
    </VDynamicModalGeneral>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Services
import ErrorService from '@/utils/ErrorService';
import i18n from '@/plugins/VueI18n';

// Components
import VButton from '@/components/VButton/VButton.vue';
import VDynamicModalGeneral from './VDynamicModalGeneral.vue';

// Enums
import ButtonColorsEnum from '@/ship/Enums/ButtonColorsEnum';

// Interfaces
import { TranslateResult } from 'vue-i18n';

@Component({
    components: {
        VButton,
        VDynamicModalGeneral,
    },
})
export default class VDynamicModalConfirm extends Vue {
    @Prop({ type: String, required: true })
    public title!: TranslateResult;

    @Prop({ type: String, default: i18n.t('cancel') })
    public labelNegative!: TranslateResult;

    @Prop({ type: String, default: i18n.t('confirm') })
    public labelPositive!: TranslateResult;

    @Prop({ type: Boolean, default: false })
    public isDangerType!: boolean;

    @Prop({ type: Function, default: () => ({}) })
    public onConfirm!: () => void | Promise<any>;

    public isConfirmButtonLoading: boolean = false;
    public errorText: TranslateResult = '';

    get rejectButtonColor(): ButtonColorsEnum {
        return ButtonColorsEnum.Secondary;
    }

    get confirmButtonColor(): ButtonColorsEnum {
        return this.isDangerType ? ButtonColorsEnum.Red : ButtonColorsEnum.Primary;
    }

    public async confirmHandler() {
        this.isConfirmButtonLoading = true;
        this.errorText = '';

        try {
            await this.onConfirm();
            this.close(true);
        } catch (error) {
            this.errorText = ErrorService.errorMessage(error);
        } finally {
            this.isConfirmButtonLoading = false;
        }
    }

    public close(result = false) {
        this.$emit('close', result);
    }
}
</script>
