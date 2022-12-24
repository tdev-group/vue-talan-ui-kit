<template>
    <div class="v-textarea">
        <textarea
            v-model.trim="input"
            :maxlength="max"
            class="v-textarea__input"
            v-bind="{ ...$attrs, ...$props }"
            @keyup="handleKeyUp"
        />

        <div v-if="max" :class="{ 'v-textarea__counter--error': input?.length >= max }" class="v-textarea__counter">
            {{ input?.length ?? 0 }}/{{ max }}
        </div>

        <div class="v-textarea__interactions">
            <div class="v-textarea__attach" v-if="attach">
                <VButtonIcon
                    v-tooltip="{
                        content: $t('attach'),
                        placement: 'bottom',
                    }"
                    color="green"
                    @click="$emit('attach')"
                >
                    <AttachSVG />
                </VButtonIcon>
                <span v-if="attachCount">{{ attachCount }}</span>
            </div>

            <VButtonIcon
                v-if="selfSend"
                :class="{ 'v-textarea__button--active': input && input.length }"
                class="v-textarea__button"
                type="button"
                @click="send"
            >
                <ArrowBackSVG />
            </VButtonIcon>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

// SVG
import ArrowBackSVG from '@/assets/arrow_back.svg';
import AttachSVG from '@/assets/attach.svg';

// Components
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

@Component({
    inheritAttrs: false,
    components: { ArrowBackSVG, VButtonIcon, AttachSVG },
})
export default class VTextarea extends Vue {
    @VModel({ type: String, default: '' })
    public input!: string | null;

    @Prop({ type: Boolean, default: false })
    public selfSend!: boolean;

    @Prop({ type: Boolean, default: false })
    public attach!: boolean;

    @Prop({ type: Number, default: 0 })
    public attachCount!: number;

    @Prop({ type: Number })
    public max!: number;

    public send() {
        if (this.input?.length) this.$emit('send', this.input);
    }

    public handleKeyUp(event: KeyboardEvent) {
        // allow to send message on Ctrl + Enter keyup combination
        if (event.ctrlKey && event.key === 'Enter') this.send();
    }
}
</script>

<style lang="scss">
.v-textarea {
    position: relative;
    display: flex;
    flex-grow: 1;

    &__input {
        border: 1px solid var(--color-border);
        border-radius: 0.625rem;
        transition: border-color 0.2s ease;
        outline: none;
        resize: none;

        height: 5.5rem;
        width: 100%;
        max-width: 100%;

        padding: 1rem;

        background: var(--color-bg-main);

        font-size: 0.875rem;
        line-height: 1.4em;
        color: var(--color-tundora);

        &:focus-within {
            border-color: var(--color-control-active);
        }
    }

    &__button {
        border-radius: 50%;

        background-color: var(--color-control-inactive);

        svg {
            fill: var(--color-white);
            width: 0.75rem;
            transform: rotate(180deg);
        }

        &--active {
            outline: none;
            background-color: var(--color-control-primary);
        }
    }

    &__counter {
        position: absolute;
        right: 0;
        bottom: -1.125rem;

        font-size: 0.75rem;
        color: var(--color-gray);
        transition: color 0.15s;

        &--error {
            color: var(--color-red);
        }
    }

    &__interactions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        position: absolute;
        right: 0.75rem;
        bottom: 0.75rem;
    }

    &__attach {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        color: var(--color-thundora);

        span {
            @extend %message-count;
            padding: 0.1875rem 0.3125rem 0.125rem;
        }
    }
}
</style>
