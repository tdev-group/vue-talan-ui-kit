<template>
    <div ref="wrapper" class="v-tags-group" :class="{ 'v-tags-group--scroll': addScroll }">
        <VTag
            v-for="(option, index) in options"
            :key="index"
            :count="option.count"
            :label="option.label"
            :selected="option.selected"
            class="v-tags-group__tag"
            @click.native="select(option)"
        ></VTag>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, VModel, Vue } from 'vue-property-decorator';

// Components
import VTag from '@/components/VTag.vue';

// Interfaces
import VTagOption from '@/ship/Models/VTagOption';

// Utils
import { addHorizontalScroll } from '@/utils/Helper';

@Component({
    components: { VTag },
})
export default class VTagsGroup extends Vue {
    @Ref()
    public wrapper!: HTMLElement;

    @VModel({ type: Array, default: () => [] })
    public options!: VTagOption[];

    @Prop({ type: Boolean, default: false })
    public multiple!: boolean;

    @Prop({ type: Boolean, default: false })
    public scrollOnMount!: boolean;

    @Prop({ type: Boolean, default: false })
    public addScroll!: boolean;

    public select(selectable: VTagOption) {
        if (!this.multiple) {
            this.options.forEach((option) => (option.selected = selectable === option ? option.selected : false));
        }

        selectable.selected = !selectable.selected;
        this.options = this.options.slice();
    }

    public scrollToEndAndBack() {
        if (!this.options.length) return;
        this.wrapper.scrollTo({ left: this.wrapper.scrollWidth, behavior: 'smooth' });
        setTimeout(() => this.wrapper.scrollTo({ left: 0, behavior: 'smooth' }), 400);
    }

    public mounted() {
        if (this.scrollOnMount) setTimeout(this.scrollToEndAndBack, 700);
        addHorizontalScroll(this.$el, this);
    }
}
</script>

<style lang="scss">
.v-tags-group {
    display: flex;

    &--scroll {
        overflow-x: auto;
        padding-bottom: 0.5rem;

        &::-webkit-scrollbar {
            height: 2px !important;

            &-track {
                background: var(--color-gray) !important;
            }

            &-thumb {
                background: var(--color-control-primary) !important;
            }
        }
    }

    &__tag {
        cursor: pointer;
        margin-right: 0.5rem;

        &:last-child {
            margin-right: 0;
        }
    }
}
</style>
