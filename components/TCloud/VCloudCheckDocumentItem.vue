<template>
    <VCloudDirectoryItem :title="fileName" @click="toggleChecked">
        <template #icon>
            <div class="cloud-document-item__icon" :data-extension="extension">
                <component :is="extension ? 'FileEmptySVG' : 'FileSVG'" />
            </div>
        </template>

        <template #label>{{ fileName }}</template>

        <template #actions>
            <VCheckbox v-model="checked"></VCheckbox>
        </template>
    </VCloudDirectoryItem>
</template>
<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

// Components
import VCheckbox from '@/components/VCheckbox.vue';
import VCloudDirectoryItem from '@/components/TCloud/VCloudDirectoryItem.vue';

// SVG
import FileEmptySVG from '@/assets/file-empty.svg';
import FileSVG from '@/assets/file-default.svg';

// Interfaces
import { IDocument } from '@/utils/TCloudService';

@Component({
    components: { VCloudDirectoryItem, VCheckbox, FileEmptySVG, FileSVG },
})
export default class VCloudCheckDocumentItem extends Vue {
    @Prop({ type: Object, required: true })
    public file!: IDocument;

    @VModel({ type: Boolean, default: false })
    public checked!: boolean;

    public toggleChecked() {
        this.checked = !this.checked;
    }

    get fileName() {
        return this.file.version.document.fullName;
    }

    get extension() {
        return this.file.version.document.extension.replace(/\W/g, '');
    }
}
</script>

<style lang="scss"></style>
