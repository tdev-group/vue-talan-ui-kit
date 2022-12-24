<template>
    <VGridRow class="grid_justify-center grid-row__shutdown_padding-x">
        <VGridCol class="padding_right" sm-6 xs-12>
            <VGridRow class="grid-row__shutdown_padding-x grid-row_aling-center">
                <VGridCol xs-2>C:</VGridCol>

                <VGridCol xs-10>
                    <flat-pickr :config="todayConfig" :value="createdAt" class="date" disabled></flat-pickr>
                </VGridCol>
            </VGridRow>
        </VGridCol>

        <VGridCol class="padding_left" sm-6 xs-12>
            <VGridRow class="grid-row__shutdown_padding-x grid-row_aling-center">
                <VGridCol xs-2>До:</VGridCol>

                <VGridCol xs-10>
                    <flat-pickr
                        v-model="deadline"
                        :config="deadlineConfig"
                        class="date"
                        disabled
                        placeholder="Выберите дату"
                    ></flat-pickr>
                </VGridCol>
            </VGridRow>
        </VGridCol>
    </VGridRow>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Russian } from 'flatpickr/dist/l10n/ru.js';
import dateFormat from 'dateformat';

// Components
import { VGridCol, VGridRow } from 'vui';

@Component({
    components: {
        VGridCol,
        VGridRow,
    },
})
export default class VDateViewer extends Vue {
    @Prop({ type: Boolean, default: false })
    public focusDeadlineElement!: boolean;

    @Prop({ type: String, default: '' })
    public lastTime!: string;

    @Prop({ type: String, default: '' })
    public createdViolation!: string;

    @Prop({ type: String, default: '' })
    public createdAt!: string;

    @Prop({ type: String, default: '' })
    public deadline!: string;

    currentDate: string = '';

    todayConfig: object = {
        altFormat: 'd.m.Y',
        defaultDate: new Date(),
        altInput: true,
        locale: Russian,
        disableMobile: 'true',
    };

    deadlineConfig: object = {
        altFormat: 'd.m.Y',
        altInput: true,
        locale: Russian,
        disableMobile: 'true',
        onClose: [
            (dateStr: string) => {
                if (dateStr) {
                    const deadline: string = dateFormat(new Date(dateStr), 'yyyy-mm-dd');
                    const currentDate: string = dateFormat(new Date(), 'yyyy-mm-dd');
                    this.emit(deadline, currentDate);
                }
            },
        ],
    };

    emit(deadline: string, currentDate: string) {
        this.$emit('deadline', deadline);
        this.$emit('currentDate', currentDate);
    }
}
</script>
<style lang="scss">
@media (min-width: 576px) {
    .padding {
        &_right {
            padding-right: 5px;
        }

        &_left {
            padding-left: 5px;
        }
    }
}

.date {
    margin-bottom: 0;

    &:active,
    &:hover,
    &:focus {
        outline: none;
    }

    padding: 5px 10px;

    &_deadline {
        border: 1px solid red;
    }
}
</style>
