<template>
    <VButtonIcon
        v-tooltip="{
            content: $t('delete'),
            placement: 'bottom',
        }"
        color="red"
        v-on="$listeners"
    >
        <TrashSVG></TrashSVG>
    </VButtonIcon>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import TrashSVG from '@/assets/trash.svg';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

@Component({
    components: {
        TrashSVG,
        VButtonIcon,
    },
})
export default class VTableIconDelete extends Vue {}
</script>
