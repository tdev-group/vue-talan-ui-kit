<template>
    <div class="v-progress-line">
        <div :style="`width: ${percent}%`" class="v-progress-line__progress"></div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    components: {},
})
export default class VProgressLine extends Vue {
    @Prop({ type: Number, default: 0 })
    public percent!: number;
}
</script>

<style lang="scss">
.v-progress-line {
    width: 100%;
    height: 0.125rem;
    background: var(--color-border);

    &__progress {
        transition: all 0.3s ease;
        height: 100%;
        background: var(--color-control-primary);
        max-width: 100%;
    }
}
</style>
