<template>
    <div
        v-if="entry"
        :class="{
            'file-entry--error': isError,
            'file-entry--disabled': disabled,
        }"
        class="file-entry"
    >
        <div class="file-entry__col file-entry__col--preview">
            <template v-if="isBrowsableImage && browsableImage">
                <img :src="browsableImage" alt="" class="file-entry__preview-image" />
            </template>

            <template v-else>
                <span class="file-entry__preview-image file-entry__preview-image--extension">{{ extension }}</span>
            </template>
        </div>

        <div class="file-entry__col file-entry__col--filename">
            <span v-tooltip="entry.name" class="file-entry__name">
                {{ entry.name }}
            </span>

            <span v-if="entry.errorMessage" v-tooltip="entry.errorMessage" class="file-entry__error-message">
                {{ entry.errorMessage | textOverflow(80) }}
            </span>
        </div>

        <div v-if="isSuccessful || isError" class="file-entry__col file-entry__col--action">
            <VButtonIcon
                v-if="!undeletable"
                v-tooltip="$t('uploader.removeFile')"
                :active="!disabled"
                color="red"
                iconSize="small"
                @click="remove"
            >
                <CloseSVG></CloseSVG>
            </VButtonIcon>
        </div>

        <div v-else class="file-entry__col file-entry__col--action">
            <VProgressRadial :progress="entry.progress" class="file-entry__progress-bar" hide-percent />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { last } from 'lodash';

import FileEntry from '@/plugins/Uploader/FileEntry';
import FileEntryStatus from '@/plugins/Uploader/FileEntryStatus';
import { isBrowsableImage } from '@/utils/Image';

// SVG
import CloseSVG from '@/assets/cross.svg';

// Components
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';
import VProgressRadial from './VProgressRadial.vue';

@Component({
    components: {
        CloseSVG,

        VButtonIcon,
        VProgressRadial,
    },
})
export default class VFileUploaderEntry extends Vue {
    @Prop({ type: Object, default: () => ({}), required: true })
    public entry!: FileEntry;

    @Prop({ type: Boolean, default: false })
    public disabled!: boolean;

    @Prop({ type: Boolean, default: false })
    public undeletable!: boolean;

    public get isError(): boolean {
        return this.entry.status === FileEntryStatus.ERROR;
    }

    public get isSuccessful(): boolean {
        return this.entry.status === FileEntryStatus.SUCCESSFUL;
    }

    public get extension() {
        if (this.entry?.name) {
            const extension = last(this.entry.name.split('.'));

            return extension;
        }

        return undefined;
    }

    public get isBrowsableImage() {
        return isBrowsableImage(this.entry.type) && (this.entry.file || this.entry.responseModel?.url);
    }

    public get browsableImage() {
        const img = this.entry.browsableImageData ?? this.entry.responseModel?.url;

        return this.isBrowsableImage ? img : undefined;
    }

    public remove() {
        if (!this.disabled && !this.undeletable) {
            this.$emit('remove', this.entry);
        }
    }

    public readerBrowsableImageData(entry: FileEntry) {
        if (entry.file) {
            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target) {
                    entry.browsableImageData = event.target.result;
                }
            };

            reader.readAsDataURL(entry.file);
        }
    }

    public tryRenderBrowsableImage() {
        if (this.isBrowsableImage) {
            this.readerBrowsableImageData(this.entry);
        }
    }

    public created() {
        this.tryRenderBrowsableImage();
    }
}
</script>
<style lang="scss">
:root {
    @include defineColor(--file-entry-background-error-color, $soft-red);
    @include defineColor(--file-entry-disabled-color, #f9f9f9);
}

.file-entry {
    position: relative;
    display: flex;
    padding: 0.25rem;
    border-radius: 0.5rem;

    &--error {
        border: 0.0625rem solid var(--color-red);

        & .file-entry__name {
            margin: 0.25rem 0 0.1875rem 0;
            color: var(--color-text-accent);
            font-size: 0.875rem;
            line-height: 1.2;
        }

        & .file-entry__col--filename {
            justify-content: flex-start;
        }
    }

    &--disabled {
        border: none;
        background-color: var(--file-entry-disabled-color);

        & .file-entry__name {
            color: var(--color-gray);
        }

        & .file-entry__preview-image--extension {
            background: var(--color-gray);
        }
    }

    &__col {
        display: flex;

        &--preview {
            max-width: 3.625rem;
            max-height: 3.625rem;
        }

        &--action {
            position: absolute;
            top: 0;
            right: 0;
        }

        &--filename {
            // Fix: fix bug with width when file name is too long.
            // Sets max-width for the filename.
            // 3.625rem = preview width;
            max-width: calc(100% - 3.625rem);
            padding-left: 0.875rem;
            flex-direction: column;
            justify-content: center;
        }
    }

    &__name {
        @include text-overflow-ellipsis;

        font: 400 1.125rem $font-family-body;
        padding-right: 1.875rem;
        color: var(--color-green);
        line-height: 3.625rem;
    }

    &__error-message {
        font-size: 0.875rem;
        line-height: 1.3;
        color: var(--color-red);
    }

    &__icon {
        display: block;
        width: 0.625rem;
        height: 0.625rem;

        &--red {
            fill: var(--color-red);
        }

        &--gray {
            fill: var(--color-gray);
        }
    }

    &__action {
        display: block;
        width: 0.625rem;
        height: 0.625rem;
        padding: 0.6875rem;
        box-sizing: content-box;
    }

    &__preview-image {
        width: 3.625rem;
        height: 3.625rem;
        border-radius: 0.5rem;
        object-fit: cover;

        &--extension {
            font: 400 1.125rem $font-family-body;
            color: var(--color-white);
            line-height: 3.625rem;
            text-align: center;
            text-transform: uppercase;
            user-select: none;

            display: inline-block;
            overflow: hidden;
            white-space: nowrap;

            background: var(--color-control-primary);
        }
    }

    &__progress-bar {
        width: 0.875rem;
        height: 0.875rem;
        margin: 0.5625rem;
    }
}
</style>
