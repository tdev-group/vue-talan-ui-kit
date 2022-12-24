<template>
    <div class="header__col header__col_logo">
        <div class="header__logo">
            <RouterLink :to="{ name: 'services' }" class="header__logo-src"></RouterLink>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class VHeaderLogo extends Vue {}
</script>
<style lang="scss">
.header {
    &__logo {
        display: flex;
        align-items: center;
    }

    &__logo-src {
        display: block;
        width: 4rem;
        height: 1.25rem;
        background: url(~@/assets/tpro-logo.svg?inline) center / contain no-repeat;
        z-index: 100;
    }
}
</style>
