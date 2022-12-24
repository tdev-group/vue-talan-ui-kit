<template>
    <modal class="vm-t-cloud" v-bind="modalProps" v-on="modalListeners">
        <VModalClose v-if="!hideCloseIcon" @click="hideModal"></VModalClose>

        <header class="vm-t-cloud__header">
            <RouterLink :to="{ name: 'cloud' }" class="vm-t-cloud__header-logo">
                <VCloudLogoSVG class="vm-t-cloud__header-logo-icon" />
                <span class="vm-t-cloud__header-logo-title">{{ $t('components.tCloudModal.tCloudName') }}</span>
            </RouterLink>
        </header>

        <div class="vm-t-cloud__body">
            <div class="vm-t-cloud__body-nav">
                <VCloudBreadcrumbs
                    :directories="directoriesStack"
                    @to-root="openRootDirectory"
                    @to-directory="openDirectory"
                ></VCloudBreadcrumbs>

                <VCloudPickButton
                    v-if="documents.length && multiple"
                    :value="checkedDocuments.length"
                    @clear-all="uncheckAllDocuments"
                    @pick-all="checkAllDocuments"
                ></VCloudPickButton>
            </div>

            <div
                :class="{ 'vm-t-cloud__body-directories--loading': isDirectoriesLoading }"
                class="vm-t-cloud__body-directories"
            >
                <VCloudFolderItem
                    v-for="directory in sortedFolders"
                    :key="directory.id"
                    :label="directory.name"
                    @open-folder="openDirectory(directory.id)"
                ></VCloudFolderItem>

                <VCloudCheckDocumentItem
                    v-for="document in sortedDocuments"
                    :key="document.id"
                    v-model="document.checked"
                    :file="document"
                ></VCloudCheckDocumentItem>

                <template v-if="hasDirectoryUploadingFiles">
                    <VCloudDocumentItem
                        v-for="(entry, idx) in uploadingFiles.entries"
                        :key="idx"
                        :entry="entry"
                        :file-name="entry.name"
                        loading
                        @delete-item="handleDeleteUploadingItem(idx)"
                    ></VCloudDocumentItem>
                </template>
            </div>
        </div>

        <footer class="vm-t-cloud__footer">
            <div class="vm-t-cloud__footer-actions">
                <VButton
                    v-if="!disableUploading"
                    :disabled="!canUploadDocuments"
                    :loading="isDocumentLoading"
                    color="secondary"
                    outlined
                    tag="label"
                >
                    <slot name="uploadButtonLabel">{{ $t('components.tCloudModal.addFromComputer') }}</slot>
                    <input :accept="acceptExtension" hidden multiple type="file" @change="handleUpload" />
                </VButton>

                <VButton :disabled="!canDownloadDocuments" color="primary" @click="handleDownload">
                    <slot name="downloadButtonLabel">{{ $t('components.tCloudModal.loadIntoTable') }}</slot>
                </VButton>
            </div>

            <div v-show="footerErrors" class="vm-t-cloud__footer-errors">{{ footerErrors }}</div>
        </footer>
    </modal>
</template>
<script lang="ts">
import { Component, Emit, Prop } from 'vue-property-decorator';

// Utils
import { omit, without } from 'lodash';
import { getFileName } from '@/utils/Helper';
import naturalSort from 'javascript-natural-sort';

// Services
import TCloudService, { IDirectory, IDocument, IFolder, TCloudHttp } from '@/utils/TCloudService';
import Uploader from '@/plugins/Uploader/Uploader';
import FileEntry from '@/plugins/Uploader/FileEntry';

// Components
import VCloudBreadcrumbs from '@/components/TCloud/VCloudBreadcrumbs.vue';
import VCloudPickButton from '@/components/TCloud/VCloudPickButton.vue';
import VCloudFolderItem from '@/components/TCloud/VCloudFolderItem.vue';
import VCloudDocumentItem from '@/components/TCloud/VCloudDocumentItem.vue';
import VCloudCheckDocumentItem from '@/components/TCloud/VCloudCheckDocumentItem.vue';

import VModalClose from './VModalClose.vue';
import VButton from '@/components/VButton/VButton.vue';

// SVG
import VCloudLogoSVG from '@/assets/logo_cloud.svg';

// Mixins
import VModalMixin from '@/mixins/VModalMixin';

// Enums
import ModalEnum from '@/ship/Enums/ModalEnum';
import FileEntryStatus from '@/plugins/Uploader/FileEntryStatus';

type ICheckedDocument = IDocument & { checked: boolean };

@Component({
    components: {
        VCloudBreadcrumbs,
        VCloudPickButton,
        VCloudFolderItem,
        VCloudDocumentItem,
        VCloudCheckDocumentItem,

        VModalClose,
        VButton,

        VCloudLogoSVG,
    },
})
export default class VModalTCloud extends VModalMixin {
    @Prop({ type: String, default: ModalEnum.TCloud })
    declare name: string;

    @Prop({ type: Number, default: 618 })
    declare maxWidth: number;

    @Prop({ type: Boolean, default: false })
    public multiple!: boolean;

    @Prop({ type: String, default: 'application/pdf' })
    public acceptExtension!: string;

    @Prop({ type: Boolean, default: false })
    public disableUploading!: boolean;

    public isDirectoriesLoading: boolean = false;
    public isDocumentLoading: boolean = false;
    public footerErrors = '';

    public folders: IFolder[] = [];
    public documents: ICheckedDocument[] = [];
    public currentDirectory: IFolder | null = null;
    public directoriesStack: IFolder[] = [];

    public uploadingFiles: { entries: FileEntry[]; directoryId: string } | null = null;
    public uploadingErrors: FileEntry[] = [];

    stringSimilarity = require('string-similarity');

    get baseUploaderSetting() {
        return {
            instance: TCloudHttp,
            accept: this.acceptExtension,
            maxSize: 31457280, // ~30MB
            fieldName: 'file',
        };
    }

    get hasDirectoryUploadingFiles() {
        return Boolean(
            this.uploadingFiles &&
                this.uploadingFiles.entries.length &&
                this.uploadingFiles.directoryId === this.currentDirectory?.id,
        );
    }

    get checkedDocuments() {
        return this.documents.filter(({ checked }) => checked);
    }

    get isAllowedUpload() {
        return this.directoriesStack.some((directory) =>
            directory?.metadata?.some(({ key }) => key === 'TPro.Drawing.AllowUploadDocuments'),
        );
    }

    get canUploadDocuments() {
        return this.currentDirectory?.allowUploadDocuments && this.isAllowedUpload;
    }

    get canDownloadDocuments() {
        return this.checkedDocuments.length && (this.multiple || this.checkedDocuments.length === 1);
    }

    get sortedFolders() {
        return this.folders.sort((a, b) => naturalSort(a.name!.toLowerCase(), b.name!.toLowerCase()));
    }

    get sortedDocuments() {
        return this.documents.sort((a, b) => naturalSort(a.name!.toLowerCase(), b.name!.toLowerCase()));
    }

    public async openDirectory(id: string) {
        this.startDirectoriesLoading();
        const directory = await TCloudService.getDirectory(id).finally(this.stopDirectoriesLoading);

        localStorage.setItem('t.cloud-last-directory', id);

        if (directory) {
            this.updateDirectory(directory);
        } else {
            await this.openRootDirectory();
        }
    }

    public async openRootDirectory() {
        this.startDirectoriesLoading();
        const rootDirectory = await TCloudService.getRootDirectory().finally(this.stopDirectoriesLoading);

        localStorage.setItem('t.cloud-last-directory', '');

        if (rootDirectory) this.updateDirectory(rootDirectory);
    }

    public updateDirectory(directory: IDirectory) {
        this.folders = directory.childrenDirectories;
        this.currentDirectory = directory.directory;

        this.documents = directory.childrenDocuments.reduce((docs: ICheckedDocument[], document) => {
            if (this.isAllowedDocumentType(document)) {
                return [...docs, { ...document, checked: false }];
            }
            return docs;
        }, []);

        this.directoriesStack = directory.ancestors;
        if (this.currentDirectory) this.directoriesStack.push(this.currentDirectory);
    }

    public uncheckAllDocuments() {
        this.documents.forEach((document) => (document.checked = false));
    }

    public checkAllDocuments() {
        this.documents.forEach((document) => (document.checked = true));
    }

    public startDirectoriesLoading() {
        this.isDirectoriesLoading = true;
    }

    public stopDirectoriesLoading() {
        this.isDirectoriesLoading = false;
    }

    public async uploadNewVersion(documentId: string, entry: FileEntry) {
        const uploader = new Uploader<IDocument>({
            ...this.baseUploaderSetting,
            endpoint: `/v1/documents/${documentId}/versions`,
        });

        return this.processUploadResponses(await uploader.upload([entry]));
    }

    public async uploadEntries(directoryId: string, entries: FileEntry[]) {
        const uploader = new Uploader<IDocument>({
            ...this.baseUploaderSetting,
            endpoint: '/v1/documents',
            data: { parentDirectoryId: directoryId },
        });

        return this.processUploadResponses(await uploader.upload(entries));
    }

    public processUploadResponses(responses: FileEntry[]) {
        responses.forEach((response) => {
            if (response.status === FileEntryStatus.SUCCESSFUL) {
                this.documents.push({ ...response.responseModel, checked: true });
            } else {
                this.uploadingErrors.push(response);
            }
        });
    }

    public findSimilarDocument(fileName: string) {
        let result: { document: ICheckedDocument | null; rating: number } = { document: null, rating: 0 };

        for (const document of this.documents) {
            const rating = this.stringSimilarity.compareTwoStrings(
                document.version.document.name,
                getFileName(fileName),
            );
            if (rating === 1) return { document, rating };
            if (rating >= 0.9 && rating > result.rating) result = { document, rating };
        }

        return result.rating === 0 ? undefined : result;
    }

    public async offerUploadNewVersion(
        uploadEntry: FileEntry,
        similarDocument: ICheckedDocument,
        similarity: number,
        directoryId: string,
    ) {
        const uploadingPromise = new Promise((resolve) => {
            this.$bus.on(`${ModalEnum.Confirm}-confirmed`, async () => {
                this.documents = without(this.documents, similarDocument!);
                resolve(await this.uploadNewVersion(similarDocument!.id, uploadEntry));
            });
            this.$bus.on(`${ModalEnum.Confirm}-rejected`, async () =>
                resolve(await this.uploadEntries(directoryId, [uploadEntry])),
            );
        });

        this.$modal.show(ModalEnum.Confirm, {
            title: this.$t(`components.tCloudModal.upload${similarity === 1 ? 'New' : 'Similar'}Version`, {
                name: uploadEntry.name,
                similarName: similarDocument.name,
            }),
        });

        await uploadingPromise;

        this.$bus.off(`${ModalEnum.Confirm}-confirmed`);
        this.$bus.off(`${ModalEnum.Confirm}-rejected`);
    }

    public async handleUpload(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        const entries = Uploader.createEntriesFromFiles(input.files!);

        if (!entries.length || !this.currentDirectory) return;

        const directoryId = this.currentDirectory.id;
        this.uploadingFiles = { entries, directoryId };

        this.isDocumentLoading = true;

        for (const entry of entries) {
            const similarSearchResult = this.findSimilarDocument(entry.name);

            if (similarSearchResult?.document) {
                await this.offerUploadNewVersion(
                    entry,
                    similarSearchResult.document,
                    similarSearchResult.rating,
                    directoryId,
                );
            } else {
                await this.uploadEntries(directoryId, [entry]);
            }
            this.uploadingFiles.entries = without(this.uploadingFiles.entries, entry);
        }

        this.isDocumentLoading = false;
        input.value = '';

        if (this.uploadingErrors.length) {
            this.uploadingFiles.entries = this.uploadingErrors;
        } else {
            this.uploadingFiles = null;
        }
        this.uploadingErrors = [];
    }

    public handleDeleteUploadingItem(position: number) {
        this.uploadingFiles?.entries.splice(position, 1);
    }

    public isAllowedDocumentType(document: IDocument) {
        return this.acceptExtension === document.version.document.type;
    }

    @Emit('download')
    public handleDownload(): IDocument[] {
        const preparedDocuments: IDocument[] = this.checkedDocuments.map((document) => omit(document, ['checked']));

        this.hideModal();

        return preparedDocuments;
    }

    public async created() {
        const lastDirectory = localStorage.getItem('t.cloud-last-directory');
        lastDirectory ? this.openDirectory(lastDirectory) : this.openRootDirectory();
    }
}
</script>
<style lang="scss">
.vm-t-cloud {
    &__body {
        height: 29.25rem;
        display: flex;
        flex-direction: column;
    }

    &__body-nav {
        padding: 1rem 1.5rem;
        min-height: 4.875rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__body-directories {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        height: 100%;
        position: relative;
        padding: 0 1.5rem;
        overflow: auto;

        &--loading {
            filter: blur(1.5px);
            pointer-events: none;
        }
    }

    &__header {
        padding: 1.1875rem 1.5rem;
        border-bottom: 0.0625rem solid var(--color-border);
    }

    &__header-logo {
        display: inline-flex;
        align-items: flex-end;
        gap: 1rem;
    }

    &__header-logo-icon {
        width: 2.625rem;
        height: auto;
        fill: var(--color-white);
        margin: 0.25rem;
    }

    &__header-logo-title {
        font-weight: 500;
        font-size: 2rem;
        line-height: 1.1875;
        color: var(--color-text-primary);
    }

    &__footer {
        padding: 1.5rem;
        border-top: 0.0625rem solid var(--color-border);
    }

    &__footer-actions {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
        gap: 0.625rem;
    }

    &__footer-errors {
        pointer-events: initial;
        text-align: center;
        font-size: 0.75rem;
        line-height: 0.875rem;
        color: var(--color-red);
        margin-top: 1rem;
    }
}
</style>
