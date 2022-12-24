<template>
    <div class="header">
        <VHeaderLogo></VHeaderLogo>

        <slot></slot>

        <VHeaderProfile></VHeaderProfile>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

// Components
import VHeaderLogo from './VHeaderLogo.vue';
import VHeaderProfile from './VHeaderProfile.vue';

@Component({
    components: { VHeaderLogo, VHeaderProfile },
})
export default class VHeader extends Vue {}
</script>

<style lang="scss">
.header {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    border-bottom: 1px solid var(--color-border);

    position: relative;

    &__col {
        display: flex;
        padding: 0 1.5rem;
    }
}
</style>
