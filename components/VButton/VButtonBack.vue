<template>
    <VGridRow
        :class="{
            'grid-row_aling-center': true,
            'grid-row_justify-end': isReverse,
        }"
    >
        <div class="button-back" v-on="$listeners">
            <KeyboardBackspaceSVG :class="{ 'button-back_reverse': isReverse }" />
            <div class="button-back__title">
                <slot></slot>
            </div>
        </div>
    </VGridRow>
</template>
<script lang="ts">
import Vue from 'vue';
import { VGridRow } from 'vui';
import Component from 'vue-class-component';
import KeyboardBackspaceSVG from '../../assets/keyboard_backspace-24px.svg';
import { Prop } from 'vue-property-decorator';

@Component({
    components: {
        VGridRow,
        KeyboardBackspaceSVG,
    },
})
export default class VButtonBack extends Vue {
    @Prop({ type: Boolean, default: false }) isReverse!: boolean;
}
</script>
<style lang="scss">
.button-back {
    display: flex;
    cursor: pointer;
    align-items: center;
    margin-bottom: 5px;

    &_reverse {
        transform: rotate(180deg);
        order: 2;
    }

    &__title {
        padding: 0 10px;
        font-size: 0.9rem;
        text-decoration: underline;
    }
}
</style>
