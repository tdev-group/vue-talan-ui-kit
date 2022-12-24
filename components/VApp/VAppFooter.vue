<template>
    <footer class="app-footer">
        <div class="app-footer__row">
            <slot>
                <div class="app-footer__default">
                    <span class="text-lg">&copy;T.Dev, {{ new Date().getFullYear() }}</span>
                </div>
            </slot>
        </div>
    </footer>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    components: { },
})
export default class VAppFooter extends Vue {}
</script>

<style lang="scss">
.app-footer {
    width: 100%;
    height: $footer-height;
    background-color: var(--color-footer);

    z-index: $zindex-footer;
    position: absolute;
    bottom: -$footer-height;
    left: 0;

    &__row {
        display: flex;
        width: 100%;
        height: 100%;
        max-height: 100%;
        flex: 1 1 auto;
        align-self: center;
        position: relative;
    }

    &__default {
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
    }
}
</style>
