<template>
    <VGridRow class="grid_justify-center shutdown_padding-x">
        <VGridCol class="padding_right" sm-6 xs-12>
            <VGridRow class="grid-row_aling-center">
                <VGridCol xs-2>C:</VGridCol>

                <VGridCol xs-10>
                    <flat-pickr v-model="currentDate" :config="todayConfig" class="date" disabled></flat-pickr>
                </VGridCol>
            </VGridRow>
        </VGridCol>

        <VGridCol class="padding_left" sm-6 xs-12>
            <VGridRow class="grid-row_aling-center">
                <VGridCol xs-2>До:</VGridCol>

                <VGridCol xs-10>
                    <flat-pickr
                        :config="deadlineConfig"
                        :value="setDeadline"
                        class="date"
                        placeholder="Выберите дату"
                        @input="changeDeadline"
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
export default class VDate extends Vue {
    @Prop({ type: Boolean, default: false })
    public focusDeadlineElement!: boolean;

    @Prop({ type: String, default: '' })
    public lastTime!: string;

    @Prop({ type: String, default: '' })
    public deadline!: string;

    currentDate: string = '';
    deadlineLoc: string = '';

    todayConfig: object = {
        altFormat: 'd.m.Y',
        altInput: true,
        defaultDate: new Date(),
        locale: Russian,
        disableMobile: 'true',
    };

    deadlineConfig: object = {
        altFormat: 'd.m.Y',
        altInput: true,
        minDate: new Date().fp_incr(1),
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

    get setDeadline() {
        return this.deadline ? (this.deadlineLoc = this.deadline) : this.deadlineLoc;
    }

    emit(deadline: string, currentDate: string) {
        this.$emit('setSelectedDeadline', deadline);
        this.$emit('currentDate', currentDate);
    }

    changeDeadline(deadline: string) {
        this.deadlineLoc = deadline;
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

.shutdown {
    &_padding-x {
        padding-left: 0px !important;
        padding-right: 0px !important;
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
