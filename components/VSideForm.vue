<template>
    <aside :class="{ 'v-side-form__overlay--hidden': !showForm }" class="v-side-form__overlay" @click.self="close">
        <div :class="{ 'v-side-form--hidden': !showForm }" class="v-side-form">
            <slot>
                <div :class="headerClasses" class="v-side-form__header">
                    <slot name="header" :close="close"></slot>
                </div>

                <div :class="bodyClasses" class="v-side-form__body">
                    <slot name="body"></slot>
                </div>
            </slot>
        </div>
    </aside>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel, Vue } from 'vue-property-decorator';

type IClassesCSS = typeof HTMLElement.prototype.classList;

@Component({
    components: {},
})
export default class VSideForm extends Vue {
    @VModel({ type: Boolean, default: false, required: true })
    public showForm!: boolean;

    @Prop({ type: Array, default: () => [] })
    public headerClasses!: IClassesCSS;

    @Prop({ type: Array, default: () => [] })
    public bodyClasses!: IClassesCSS;

    @Emit('close')
    public close() {
        this.showForm = false;
    }
}
</script>

<style lang="scss">
.v-side-form {
    cursor: default;
    $form-width: 30rem;

    width: $form-width;
    display: flex;
    flex-direction: column;

    background-color: var(--color-white);
    transition: width 0.3s ease;

    overflow: hidden;

    * {
        font-family: $font-family-body;
    }

    &--hidden {
        width: 0;
    }

    &__header {
        height: fit-content;
        min-width: $form-width;
        background: var(--color-tundora);
    }

    &__body {
        display: flex;
        flex-direction: column;
        flex: 1 1 100%;
        overflow: auto;
        position: relative;

        min-width: $form-width;
    }

    &__overlay {
        cursor: pointer;

        position: fixed;
        top: 0;
        right: 0;
        z-index: 1020;

        height: 100%;
        width: 100%;

        background-color: rgba(52, 52, 52, 0.46);
        transition: background-color 0.2s ease-in-out;

        display: flex;
        justify-content: flex-end;

        &--hidden {
            background-color: inherit;
            cursor: unset;
            pointer-events: none;
        }
    }
}
</style>
