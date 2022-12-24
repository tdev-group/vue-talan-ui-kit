<template>
    <div class="v-datepicker">
        <FlatPickr
            :key="key"
            v-model="date"
            :class="{ 'v-datepicker__input--error': error }"
            :config="config"
            :disabled="disabled"
            class="v-datepicker__input"
            v-bind="$attrs"
            @input="inputHandler"
        ></FlatPickr>

        <CalendarSVG :class="{ 'v-datepicker__input-icon--error': error }" class="v-datepicker__input-icon" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

// SVG
import CalendarSVG from '@/assets/calendar.svg';

// Interfaces
import { DateTime } from 'luxon';

@Component({
    components: { CalendarSVG },
})
export default class VDatePicker extends Vue {
    @VModel({ type: String, default: '' })
    public date!: string | null;

    @Prop({ type: String, default: '' })
    public max!: string;

    @Prop({ type: String, default: '' })
    public min!: string;

    @Prop({ type: Boolean, default: false })
    public disabled!: boolean;

    @Prop({ type: Boolean, default: false })
    public error!: boolean;

    public get config() {
        return {
            dateFormat: 'd.m.Y',
            locale: Russian,
            maxDate: this.max,
            minDate: this.min,
        };
    }

    // fix flatpickr reactivity: local value changing, when global value not apply this change
    public key: string | null = '';

    public inputHandler(value: string | null) {
        this.key = value;
    }

    public formatDate(record: string | null): string | null {
        if (!record) return record;

        return record.includes('.') ? record : DateTime.fromFormat(record, 'yyyy-MM-dd').toFormat('dd.MM.yyyy');
    }

    public created() {
        this.date = this.formatDate(this.date);
    }
}
</script>

<style lang="scss">
.v-datepicker {
    display: flex;
    width: 100%;
    position: relative;

    &__input {
        display: flex;
        width: 100%;
        height: 2.875rem !important;

        outline: none;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;

        font-size: 0.875rem;
        line-height: 1rem;
        color: var(--color-tundora);

        padding: 0 0 0 1rem;

        &::placeholder {
            font-size: 0.875rem;
        }

        &:disabled {
            pointer-events: none;
        }

        &--error {
            border-color: var(--color-red);
        }
    }

    &__input-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        right: 1rem;

        width: 1.125rem;
        height: 1.125rem;

        fill: var(--color-dusty-gray);

        pointer-events: none;

        &--error {
            fill: var(--color-red);
        }
    }
}
</style>
