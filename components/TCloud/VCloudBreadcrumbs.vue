<template>
    <div class="cloud-breadcrumbs">
        <VButtonIcon v-if="!isRootLevel" active color="dark" @click="handleBackArrowClick">
            <ArrowBackSVG />
        </VButtonIcon>

        <ul class="cloud-breadcrumbs__list">
            <li class="cloud-breadcrumbs__list-item">
                <button @click="$emit('to-root')">{{ $t('components.tCloudModal.homeDirectoryTitle') }}</button>
            </li>

            <li v-for="directory in directories" :key="directory.id" class="cloud-breadcrumbs__list-item">
                <button :title="directory.name" @click="$emit('to-directory', directory.id)">
                    {{ directory.name }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Interfaces
import { IFolder } from '@/utils/TCloudService';

// Components
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

// SVG
import ArrowBackSVG from '@/assets/arrow_left.svg';

@Component({
    components: { ArrowBackSVG, VButtonIcon },
})
export default class VCloudBreadcrumbs extends Vue {
    @Prop({ type: Array, default: () => [] })
    public directories!: IFolder[];

    get isRootLevel() {
        return !this.directories.length;
    }

    get isFirstDepthLevel() {
        return this.directories.length === 1;
    }

    public handleBackArrowClick() {
        if (this.isRootLevel) return;

        if (this.isFirstDepthLevel) return this.$emit('to-root');

        const prevDepthLevelDirection = this.directories[this.directories.length - 2];

        this.$emit('to-directory', prevDepthLevelDirection.id);
    }
}
</script>

<style lang="scss">
.cloud-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &__list {
        padding: 0;
        margin: 0;
        list-style: none;
    }

    &__list-item {
        display: contents;

        &:not(:first-child)::before {
            content: '/';
            display: inline-block;
            margin: 0;
        }

        > button {
            @include reset-button;
            @include text-overflow-ellipsis;

            max-width: 5.5rem;
            padding: 0.25rem;

            font-size: 0.75rem;
            color: var(--color-silver);

            &:hover,
            &:focus {
                color: var(--color-gray);
            }
        }
    }
}
</style>
