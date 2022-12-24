<template>
    <div
        :class="{
            'button-close': true,
            'button-close_justify-center': isCenter,
            'button-close_justify-end': isEnd,
        }"
    >
        <CloseSVG :height="height" :width="width" class="button-close__image" @click="action" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import CloseSVG from '@/assets/close.svg';
import { Prop } from 'vue-property-decorator';

@Component({
    components: {
        CloseSVG,
    },
})
export default class VButtonClose extends Vue {
    @Prop({ type: String, default: '24px' }) width!: string;
    @Prop({ type: String, default: '24px' }) height!: string;
    @Prop({ type: Boolean, default: false }) isCenter!: boolean;
    @Prop({ type: Boolean, default: false }) isEnd!: boolean;
    @Prop({
        type: Function,
        default: () => {
            return;
        },
    })
    action!: () => void;
}
</script>
<style lang="scss">
.button-close {
    display: flex;
    width: 100%;
    padding: 10px 15px 5px;

    &_justify-center {
        justify-content: center;
    }

    &_justify-end {
        justify-content: flex-end;
    }

    &__image {
        cursor: pointer;
    }
}
</style>
