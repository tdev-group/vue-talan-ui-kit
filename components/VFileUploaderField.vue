<template>
    <div
        ref="dropzone"
        :class="{
            'file-uploader--active': entiresCount > 0,
            'file-uploader--disabled': disabled,
            'file-uploader--full': !allowDownload,
        }"
        class="file-uploader"
        @click="showUploadWindow"
        @dragover.prevent.stop="hoverHandler"
        @dragenter.prevent.stop="hoverHandler"
        @dragleave.prevent.stop="leaveHandler"
    >
        <template v-if="!entries.length">
            <div class="file-uploader__salutation">
                <span class="file-uploader__text file-uploader__text--mobile">
                    <button class="file-uploader__button file-uploader__button--green" type="button">
                        {{ $t('uploader.uploadFiles') }}
                    </button>
                </span>

                <span class="file-uploader__text file-uploader__text--desktop">
                    <template v-if="dragPlaceholder">{{ $t(dragPlaceholder) }}</template>

                    <br />

                    <button
                        v-if="selectPlaceholder"
                        class="file-uploader__button file-uploader__button--inline file-uploader__button--green"
                        type="button"
                    >
                        {{ $t(selectPlaceholder) }}
                    </button>
                </span>

                <span v-if="$slots.default" class="file-uploader__text file-uploader__text--description">
                    <slot></slot>
                </span>
            </div>
        </template>

        <template v-else>
            <div class="file-uploader__preview-list">
                <template v-for="(entry, index) in entries">
                    <div
                        :key="index"
                        :class="{ 'file-uploader__preview-item--fluid': !multiple || isFluid(index) }"
                        class="file-uploader__preview-item"
                        @click.stop
                    >
                        <VFileUploaderEntry
                            :disabled="disabled"
                            :entry="entry"
                            :undeletable="undeletable"
                            @remove="removeEntiry"
                        ></VFileUploaderEntry>
                    </div>
                </template>

                <!-- Show the upload-more button if element not disabled, the multiple is enable and available or require upload more files -->
                <template v-if="allowDownloadMore">
                    <span
                        :class="{ 'file-uploader__preview-item--fluid': entries.length % 2 === 0 }"
                        class="file-uploader__text file-uploader__preview-item file-uploader__preview-item--green file-uploader__preview-item--upload-more"
                    >
                        <!-- If required files is disabled (requiredFilesCount < 0) -->
                        <template v-if="requiredFilesCount < 0">
                            {{ $t('uploader.uploadMore') }}
                        </template>

                        <!-- If required files is enabled -->
                        <template v-else>
                            {{ $tc('uploader.uploadMoreNFiles', requiredFilesCount) }}
                        </template>
                    </span>
                </template>
            </div>
        </template>

        <input
            ref="input"
            :accept="accept"
            :multiple="multiple"
            class="file-upload__input"
            hidden
            type="file"
            @change="uploadHandler"
        />
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Interfaces
import { AxiosInstance } from 'axios';
import IFile from '@/ship/Models/IFile';
import FileEntry from '@/plugins/Uploader/FileEntry';
import FileEntryStatus from '@/plugins/Uploader/FileEntryStatus';
import IUploader from '@/plugins/Uploader/IUploader';
import Uploader from '@/plugins/Uploader/Uploader';
import DataTransferExtractor from '@/utils/DataTransferExtractor';
import Http from '@/ship/Http';

// Components
import VFileUploaderEntry from './VFileUploaderEntry.vue';

@Component({
    components: {
        VFileUploaderEntry,
    },
})
export default class VFileUploaderField extends Vue {
    @Prop({ type: [Array, Object], default: () => ({}) })
    public value!: IFile[];

    @Prop({ type: Boolean, default: false })
    public multiple!: boolean;

    @Prop({ type: Number, default: 10485760 /* 10MB */ })
    public maxSize!: number;

    @Prop({ type: Number, default: 10 })
    public maxFiles!: number;

    @Prop({ type: Number, default: -1 })
    public requiredFiles!: number;

    @Prop({ type: Function, default: Http })
    public instance!: AxiosInstance;

    @Prop({ type: String, default: '/temporary-file' })
    public endpoint!: string;

    @Prop({ type: String, default: 'file' })
    public fieldName!: string;

    @Prop({ type: String, default: '' })
    public accept!: string;

    @Prop({ type: Boolean, default: false })
    public disabled!: boolean;

    @Prop({ type: Boolean, default: false })
    public undeletable!: boolean;

    @Prop({ type: String, default: 'uploader.dragFilesHere' })
    public dragPlaceholder!: string;

    @Prop({ type: String, default: 'uploader.orSelectFiles' })
    public selectPlaceholder!: string;

    public entries: Array<FileEntry<IFile>> = [];
    public uploader: IUploader<IFile> | null = null;

    /**
     * Gets the number of entries.
     */
    public get entiresCount() {
        return this.entries.length;
    }

    /**
     * Gets the number of files required to upload.
     */
    public get requiredFilesCount() {
        return this.requiredFiles - this.entiresCount;
    }

    /**
     * Gets the real max number of files available for upload.
     */
    public get realMaxFiles() {
        return this.requiredFiles > 0 ? this.requiredFiles : this.maxFiles;
    }

    public get allowDownload() {
        return !this.disabled && this.entiresCount < this.realMaxFiles;
    }

    public get allowDownloadMore() {
        return !this.disabled && this.multiple && this.entiresCount < this.realMaxFiles;
    }

    public get isFluidLast() {
        return this.allowDownloadMore ? false : this.entries.length % 2 !== 0;
    }

    public hoverHandler() {
        if (this.$refs.dropzone) {
            const dropzone = this.$refs.dropzone as HTMLElement;

            // Adds a highlight effect.
            dropzone.classList.add('file-uploader--highlight');
            // Removes the leave effect.
            dropzone.classList.remove('file-uploader--leave');
        }
    }

    public leaveHandler() {
        if (this.$refs.dropzone) {
            const dropzone = this.$refs.dropzone as HTMLElement;

            // Sets the leave effect.
            dropzone.classList.add('file-uploader--leave');

            // Waits for 75ms and if the leave class exists
            // it means that the user leaves the dropzone,
            // and we can drop the highlight.
            setTimeout(() => {
                // If the leave effect is exists then drop highlight effect.
                if (dropzone.classList.contains('file-uploader--leave')) {
                    this.dropDropzoneHighlight(dropzone);
                }
            }, 75);
        }
    }

    public dropDropzoneHighlight(dropzone: HTMLElement) {
        dropzone.classList.remove('file-uploader--leave');
        dropzone.classList.remove('file-uploader--highlight');
    }

    public dropHandler(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        if (!event?.dataTransfer) {
            return;
        }

        const extractor = new DataTransferExtractor(event.dataTransfer);

        // Gets all files from event.
        const files = extractor.extractRootFiles();

        this.uploadFiles(files);

        if (this.$refs.dropzone) {
            const dropzone = this.$refs.dropzone as HTMLElement;

            this.dropDropzoneHighlight(dropzone);
        }
    }

    public removeEntiry(entry: FileEntry<IFile>) {
        const index = this.entries.indexOf(entry);

        if (index !== -1) {
            this.entries.splice(index, 1);

            this.$emit('entryRemoved', entry, this.entries);
            this.emitInputFiles();
        }
    }

    public uploadHandler() {
        if (this.$refs.input) {
            const input = this.$refs.input as HTMLInputElement;

            const files = input.files!;

            this.uploadFiles(files);

            // Resets the input value.
            input.value = '';
        }
    }

    public async uploadFiles(files: File | File[] | FileList) {
        if (this.entiresCount === this.realMaxFiles) {
            return;
        }

        const entries: FileEntry[] = this.createEntriesFromFiles(files);

        // Removes unnecessary files.
        if (this.entiresCount + entries.length > this.realMaxFiles) {
            // Gets count of files that should be removed.
            // For exemple: 10 - (0 + 12) = -2;
            // 2 items will be removed at the end of the entries.
            // For exemple: 10 - (6 + 8) = -4;
            // 4 items will be removed at the end of the entries.
            const count = this.realMaxFiles - (this.entiresCount + entries.length);

            entries.splice(count);
        }

        // If the multiple is enable then add the elements to the array, otherwise update value.
        if (this.multiple) {
            this.entries.push(...entries);
        } else {
            this.entries = entries;
        }

        if (!entries.length) {
            return;
        }

        this.$emit('uploadingStarted');
        const result = await this.uploader!.upload(entries);
        this.$emit('uploadingEnded', result);

        this.emitInputFiles();
    }

    public createEntriesFromFiles(files: File | File[] | FileList) {
        const entries: FileEntry[] = [];

        if (Array.isArray(files)) {
            for (const file of files) {
                entries.push(new FileEntry(file));
            }
        } else if (files instanceof FileList) {
            for (let index = 0; index < files.length; index++) {
                const file = files.item(index);

                if (file) {
                    entries.push(new FileEntry(file));
                }
            }
        } else {
            const file = files;

            entries.push(new FileEntry(file));
        }

        return entries;
    }

    public emitInputFiles() {
        const data = this.entries
            .filter((entry) => entry.status === FileEntryStatus.SUCCESSFUL)
            .map((entry) => entry.responseModel);

        this.$emit('input', data);
        this.$emit('change', data);
    }

    public showUploadWindow() {
        if (this.$refs.input && this.allowDownload) {
            (this.$refs.input as HTMLInputElement).click();
        }
    }

    public createDropzone() {
        if (this.$refs.dropzone) {
            const dropzone = this.$refs.dropzone as HTMLElement;

            dropzone.addEventListener('drop', this.dropHandler, false);
        }
    }

    public destroyDropzone() {
        if (this.$refs.dropzone) {
            const dropzone = this.$refs.dropzone as HTMLElement;

            dropzone.removeEventListener('drop', this.dropHandler, false);
        }
    }

    public setEntriesFromModel() {
        if (this.value?.length > 0) {
            this.entries = this.value.map((item) => ({
                size: item.size,
                name: item.name,
                type: item.MIMEType,
                progress: 100,
                status: FileEntryStatus.SUCCESSFUL,
                responseModel: item,
            }));
        }
    }

    public isFluid(index: number): boolean {
        return this.isFluidLast && this.entries.length - 1 === index;
    }

    public created() {
        this.uploader = new Uploader<IFile>({
            instance: this.instance,
            accept: this.accept,
            maxSize: this.maxSize,
            endpoint: this.endpoint,
            fieldName: this.fieldName,
        });

        this.setEntriesFromModel();
    }

    public mounted() {
        this.createDropzone();
    }

    public beforeDestroy() {
        this.destroyDropzone();
    }
}
</script>
<style lang="scss">
:root {
    @include defineColor(--file-uploader-disabled-color, #d0d0d0);
}

.file-uploader {
    width: 100%;
    padding: 0 0.75rem;
    min-height: 4.625rem;
    border: 0.0625rem dashed var(--color-control-primary);
    border-radius: 0.5rem;
    background-color: var(--color-white);
    cursor: pointer;

    &.error {
        border: 0.0625rem solid var(--color-red) !important;

        & .file-uploader__button--green {
            color: var(--color-red);
        }

        .file-uploader__preview-item {
            color: var(--color-red);
            border-color: var(--color-red);
        }
    }

    &--dragover {
        cursor: move;
    }

    &--active {
        border-style: solid;
    }

    &--disabled {
        pointer-events: none;
        border-color: var(--file-uploader-disabled-color);
    }

    &--full {
        cursor: default;
    }

    &--leave,
    &--highlight {
        border: 0.125rem solid var(--color-green);
    }

    &__text,
    &__button {
        font-size: 0.875rem;
        font-family: $font-family-body;
        color: var(--color-text-secondary);
    }

    &__text {
        line-height: 1.4;
        text-align: center;

        &--mobile {
            display: inline-block;

            @media (min-width: $grid-breakpoint-lg) {
                display: none;
            }
        }

        &--desktop {
            display: none;

            @media (min-width: $grid-breakpoint-lg) {
                display: inline-block;
            }
        }

        &--description {
            max-width: 19.375rem;
            padding-top: 0.3125rem;
            color: var(--color-gray);
            font: 400 0.8125rem $font-family-body;

            @media (min-width: $grid-breakpoint-lg) {
                padding-top: 0.375rem;
                font-size: 0.875rem;
            }
        }
    }

    &__button {
        @include reset-button;

        &--green {
            color: var(--color-control-primary);
        }

        &--inline {
            display: inline;
            padding: 0;
        }
    }

    &__salutation {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        min-height: 4.5rem;
        padding: 1.0625rem 0;
        align-items: center;
        justify-content: center;
    }

    &__preview-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.75rem;
    }

    &__preview-item {
        width: 100%;
        min-height: 4.125rem;
        margin-top: 0.75rem;
        cursor: initial;

        @media (min-width: $grid-breakpoint-md) {
            width: calc(50% - 0.375rem);

            &:nth-child(2n) {
                margin-left: 0.75rem;
            }
        }

        &--fluid {
            width: 100%;
        }

        &--green {
            color: var(--color-control-primary);
            border: 0.0625rem solid var(--color-control-primary);
        }

        &--red {
            color: var(--color-red);
            border: 0.0625rem solid var(--color-red);
        }

        &--upload-more {
            display: inline-block;
            text-align: center;
            line-height: 4rem;
            border-radius: 0.5rem;
            cursor: pointer;
        }
    }
}
</style>
