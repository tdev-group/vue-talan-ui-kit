<template>
    <VButton
        :class="{ 'cloud-pick-button--active': value }"
        :color="null"
        class="cloud-pick-button"
        small
        @click="handleClick"
    >
        <template #prepend>
            <div class="cloud-pick-button__icon-spot">
                <span v-if="value" class="cloud-pick-button__counter">{{ value }}</span>

                <CheckSVG v-else class="cloud-pick-button__icon" />
            </div>
        </template>

        <span v-if="value">{{ $t('components.tCloudModal.removeSelection') }}</span>
        <span v-else>{{ $t('components.tCloudModal.chooseAll') }}</span>
    </VButton>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Components
import VButton from '@/components/VButton/VButton.vue';

// SVG
import CheckSVG from '@/assets/check.svg';

@Component({
    components: { VButton, CheckSVG },
})
export default class VCloudPickButton extends Vue {
    @Prop({ type: Number, default: 0 })
    public value!: number;

    public handleClick() {
        this.$emit(this.value ? 'clear-all' : 'pick-all');
    }
}
</script>

<style lang="scss">
.cloud-pick-button {
    padding: 0.625rem 1rem;
    border: 0.0625rem solid var(--color-border);
    font-weight: 400;
    outline: revert;

    &--active {
        border-color: var(--color-control-primary);
    }

    &__icon-spot {
        @extend %icon;
    }

    &__icon {
        width: 0.875rem;
        height: auto;
        fill: var(--color-dusty-gray);
    }

    &__counter {
        @extend %icon;
        border-radius: 50%;
        background-color: var(--color-alabaster);
    }
}
</style>
