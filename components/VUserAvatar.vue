<template>
    <div :style="avatarBackgroundStyles" :title="user && user.name" class="user-avatar">
        <span>{{ abbreviation }}</span>

        <img v-if="avatar && !isImageLoadFailed" :src="avatar" alt="user avatar" @error="handleImageLoadError" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Interfaces
import User from '@/ship/Models/User';
import UserService from '@/utils/UserService';

@Component
export default class VUserAvatar extends Vue {
    @Prop({ type: Object, default: null })
    public user!: User | null;

    public isImageLoadFailed = false;

    get abbreviation() {
        return UserService.getUserAbbreviation(this.user);
    }

    get avatar() {
        return this.user?.socialAvatar.avatar;
    }

    get hslGradus() {
        return this.user?.socialAvatar.hslGradus;
    }

    get avatarBackgroundStyles() {
        return {
            'background-color': this.hslGradus && `hsl(${this.hslGradus}, 68%, 77%)`,
        };
    }

    public handleImageLoadError() {
        this.isImageLoadFailed = true;
    }
}
</script>

<style lang="scss">
.user-avatar {
    @include image-frame;

    user-select: none;

    height: 1.75rem;
    aspect-ratio: 1 / 1;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    color: var(--color-tundora);
    font-weight: 400;
    font-size: 0.875rem;
    line-height: 1.4em;
}
</style>
