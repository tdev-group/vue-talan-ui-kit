<template>
    <VCloudDirectoryItem @dblclick="openFolder">
        <template #icon>
            <FolderSVG />
        </template>

        <template #label>{{ label }}</template>

        <template #actions>
            <VButtonIcon color="dark" icon-size="small" @click="openFolder">
                <AngleRightSVG />
            </VButtonIcon>
        </template>
    </VCloudDirectoryItem>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Components
import VCloudDirectoryItem from '@/components/TCloud/VCloudDirectoryItem.vue';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

// SVG
import AngleRightSVG from '@/assets/angle_right.svg';
import FolderSVG from '@/assets/folder.svg';

@Component({
    components: { VCloudDirectoryItem, VButtonIcon, AngleRightSVG, FolderSVG },
})
export default class VCloudFolderItem extends Vue {
    @Prop({ type: String, required: true })
    public label!: string;

    public openFolder() {
        this.$emit('open-folder');
    }
}
</script>
