<template>
    <label :class="{ active: search }" class="v-search">
        <VSpinner v-if="loading" class="v-search__spinner"></VSpinner>

        <SearchSVG v-else class="v-search__icon-search"></SearchSVG>

        <VInput
            v-model="inputValue"
            :placeholder="placeholder"
            :borderless="borderless"
            class="v-search__input"
            type="text"
            v-bind="$attrs"
            v-on="listeners"
        ></VInput>

        <VButtonIcon
            v-show="search"
            active
            class="v-search__button-clear"
            color="dark"
            icon-size="small"
            @click="clearSearch"
        >
            <CrossSVG></CrossSVG>
        </VButtonIcon>
    </label>
</template>

<script lang="ts">
import VueI18n from 'vue-i18n';
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';
import i18n from '@/plugins/VueI18n';

// SVG
import SearchSVG from '@/assets/search.svg';
import CrossSVG from '@/assets/cross.svg';

// Components
import VInput from '@/components/VInput.vue';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';
import VSpinner from '@/components/VSpinner.vue';

@Component({
    inheritAttrs: false,
    components: {
        SearchSVG,
        CrossSVG,

        VInput,
        VButtonIcon,
        VSpinner,
    },
})
export default class VSearch extends Vue {
    @VModel({ type: String })
    public search!: string;

    @Prop({ type: String, default: i18n.t('components.search.placeholder') })
    public placeholder!: string | VueI18n.TranslateResult;

    @Prop({ type: Boolean, default: false })
    public loading!: boolean;

    @Prop({ type: Boolean, default: true })
    public borderless!: boolean;

    public inputValue = '';

    get listeners() {
        return { ...this.$listeners, input: this.inputHandler };
    }

    public created() {
        this.inputValue = this.search;
    }

    public clearSearch() {
        this.inputValue = this.search = '';
    }

    public inputHandler() {
        this.search = this.inputValue;
    }
}
</script>

<style lang="scss">
.v-search {
    display: flex;
    flex: 1 1 100%;
    position: relative;
    height: fit-content;

    &__input {
        .v-input {
            padding-left: 3.125rem;
            padding-right: 3.125rem;
        }
    }

    &__spinner {
        position: absolute;
        left: 1.1875rem;
        top: 0;
        bottom: 0;
        margin: auto 0;

        font-size: 55%;
    }

    &__icon-search {
        position: absolute;
        left: 1.1875rem;
        top: 0;
        bottom: 0;
        margin: auto 0;
        z-index: 1;

        width: 1.25rem;
        height: 1.25rem;

        fill: var(--color-silver);
    }

    &__button-clear {
        position: absolute;
        right: 1rem;
        top: 0;
        bottom: 0;
        margin: auto 0;
    }
}
</style>
