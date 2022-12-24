<template>
    <VButtonIcon class="modal-close" color="dark" icon-size="small" @click="$emit('click')">
        <CloseSVG></CloseSVG>
    </VButtonIcon>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import CloseSVG from '@/assets/cross.svg';
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

@Component({
    components: {
        CloseSVG,
        VButtonIcon,
    },
})
export default class VModalClose extends Vue {}
</script>
<style lang="scss">
.modal-close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;

    &:focus {
        outline: none;
    }
}
</style>
