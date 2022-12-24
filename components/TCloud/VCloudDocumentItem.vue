<template>
    <VCloudDirectoryItem :class="{ 'cloud-directory-item--loading': loading }" :title="fileName">
        <template #icon>
            <div v-if="fileExtension.length <= 3" :data-extension="fileExtension" class="cloud-document-item__icon">
                <FileEmptySVG />
            </div>

            <FileSVG v-else />
        </template>

        <template #label>
            {{ fileName }}
            <p
                v-if="entry && entry.errorMessage"
                v-tooltip="entry.errorMessage"
                class="cloud-document-item__error-text"
            >
                {{ entry.errorMessage }}
            </p>
        </template>

        <template v-if="loading && entry" #actions>
            <div v-if="!entry.errorMessage" class="cloud-document-item__progress-bar">
                <div :style="`width: ${entry.progress}%`" class="cloud-document-item__progress-bar-line"></div>
            </div>

            <VButtonIcon
                v-else
                active
                class="cloud-document-item__close-icon"
                color="red"
                @click="$emit('delete-item')"
            >
                <CrossSVG />
            </VButtonIcon>
        </template>
    </VCloudDirectoryItem>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getFileExtension } from '@/utils/Helper';
import FileEntry from '@/plugins/Uploader/FileEntry';

// Components
import VCloudDirectoryItem from '@/components/TCloud/VCloudDirectoryItem.vue';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

// SVG
import FileSVG from '@/assets/file-default.svg';
import FileEmptySVG from '@/assets/file-empty.svg';
import CrossSVG from '@/assets/cross.svg';

@Component({
    components: { VCloudDirectoryItem, VButtonIcon, FileSVG, FileEmptySVG, CrossSVG },
})
export default class VCloudDocumentItem extends Vue {
    @Prop({ type: String, required: true })
    public fileName!: string;

    @Prop({ type: Boolean, default: false })
    public loading!: boolean;

    @Prop({ type: Object, default: null })
    public entry!: FileEntry;

    get fileExtension() {
        return getFileExtension(this.fileName);
    }
}
</script>

<style lang="scss">
.cloud-document-item {
    &__icon {
        @extend %icon;
        position: relative;

        &::after {
            content: attr(data-extension);

            text-transform: uppercase;
            color: var(--color-white);
            font-size: 0.4375rem;
            font-weight: 400;

            position: absolute;
            left: 50%;
            bottom: 0.375rem;
            transform: translateX(-50%);
        }
    }

    &__progress-bar {
        width: 6.5625rem;
        height: 0.125rem;
        background: var(--color-border);
    }

    &__progress-bar-line {
        height: 100%;
        background: var(--color-control-primary);
    }

    &__error-text {
        @include text-overflow-ellipsis;
        display: block;

        color: var(--color-red);
        font-size: 0.75rem;
        line-height: 0.875rem;
        margin: 0;
    }
}
</style>
