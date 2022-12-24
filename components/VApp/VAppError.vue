<template>
    <div class="app-error">
        {{ message }}
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class VAppError extends Vue {
    @Prop({ type: String, default: '' })
    public message!: string;
}
</script>

<style lang="scss">
.app-error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1.25rem;
}
</style>
