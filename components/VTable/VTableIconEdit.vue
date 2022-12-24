<template>
    <VButtonIcon
        v-tooltip="{
            content: $t('edit'),
            placement: 'bottom',
        }"
        color="green"
        v-on="$listeners"
    >
        <EditSVG></EditSVG>
    </VButtonIcon>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import EditSVG from '@/assets/edit.svg';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

@Component({
    components: {
        EditSVG,
        VButtonIcon,
    },
})
export default class VTableIconEdit extends Vue {}
</script>
