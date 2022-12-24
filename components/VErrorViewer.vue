<template>
    <div class="v-error-viewer">{{ message }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VErrorViewer extends Vue {
    @Prop({ type: String, required: true })
    public message!: string;
}
</script>

<style lang="scss">
.v-error-viewer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
