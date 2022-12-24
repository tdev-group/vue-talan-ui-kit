<template>
    <div v-if="user" class="header__col_profile">
        <div v-if="isReportCatalog" class="user-desk__filter">
            <div class="user-desk">
                <div class="user-desk__filter-icon">
                    <img src="~@/assets/search_black_24dp.svg?inline" @click.stop="toggleFilter" />
                </div>
            </div>
            <div
                :class="{
                    'header-profile_mobile-hide': true,
                    'user-details__background': true,
                    'user-details__background_open': isFilter,
                }"
                @click="hideFilter"
            ></div>
            <PrescriptionFilter
                :class="{
                    'prescription-filter': true,
                    'prescription-filter_close': !isFilter,
                }"
                :hide-filter="hideFilter"
                isMobile
            />
        </div>

        <NotificationPanel />

        <div class="user-desk">
            <div class="user-desk__user-card" @click.stop="showDetails">
                <VUserAvatar :user="user" class="header-profile_desk-hide"></VUserAvatar>
                <img class="header-profile_mobile-hide" src="~@/assets/menu-24px.svg?inline" />
            </div>
            <div class="user-desk__user-details">
                <div
                    :class="{
                        'header-profile_mobile-hide': true,
                        'user-details__background': true,
                        'user-details__background_open': toggleDetailsStatus,
                    }"
                ></div>
                <VAccountDesk :hide-details="hideDetails" :toggle-details-status="toggleDetailsStatus" :user="user" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';

// Interfaces
import User from '@/ship/Models/User';

// Components
import { VAccountDesk } from '@/components/VAccount';
import VUserAvatar from '@/components/VUserAvatar.vue';
import NotificationPanel from '@/components/Notification/Notification.vue';
import PrescriptionFilter from '@/components/PrescriptionFilter/PrescriptionFilter.vue';

@Component({
    components: {
        VAccountDesk,
        VUserAvatar,
        NotificationPanel,
        PrescriptionFilter,
    },
})
export default class VHeaderProfile extends Vue {
    @State user!: User;

    toggleDetailsStatus: boolean = false;
    notificationOpened: boolean = false;
    isFilter: boolean = false;

    get isReportCatalog() {
        return this.$route.name === 'prescription.list';
    }

    created() {
        document.addEventListener('click', this.hideDetails);
    }

    destroyed() {
        document.removeEventListener('click', this.hideDetails);
    }

    toggleFilter() {
        this.isFilter = !this.isFilter;
    }

    hideFilter() {
        if (this.isFilter) {
            this.isFilter = !this.isFilter;
        }
    }

    showDetails() {
        this.toggleDetailsStatus = !this.toggleDetailsStatus;
    }

    hideDetails() {
        if (this.toggleDetailsStatus) {
            this.toggleDetailsStatus = false;
        }
    }
}
</script>
<style lang="scss">
@media (min-width: 961px) {
    .header-profile {
        &_mobile-hide {
            display: none;
        }
    }

    .user-desk {
        &__filter {
            display: none;
        }
    }
}

@media (max-width: 960px) {
    .header-profile {
        &_desk-hide {
            display: none;
        }
    }
}

.prescription-filter {
    height: 100%;
    width: 85%;
    top: 0;
    bottom: 0;
    left: 15%;
    z-index: 1000;
    transition: all 0.3s linear;

    &_close {
        left: 100%;
    }
}

.user-details {
    &__background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        visibility: hidden;
        background: rgba(0, 0, 0, 0);
        transition: all 0.3s linear;

        &_open {
            visibility: visible;
            background: rgba(0, 0, 0, 0.5);
        }
    }
}

.button__clear {
    cursor: pointer;
    border: none;
    background-color: lightblue;
    margin: 4px;
    box-shadow: 0px 3px 15px 10px rgba(0, 0, 0, 0.1);
    line-height: 2;
}

.header__col_profile {
    display: flex;
    padding: 0 24px;
    margin-left: auto;
    height: 100%;
}

.user-desk {
    display: flex;
    height: 100%;
    position: relative;
    align-items: center;

    &__filter-icon {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__user-card {
        padding: 0 0.5rem;
        display: flex;
        width: 100%;
        cursor: pointer;
    }
}

::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb {
    background: #ccc;
}

.buttons-without-paddings {
    justify-content: space-between;
    padding: 0;
}

.mask-read-button {
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;

    &:hover {
        cursor: pointer;
        background-color: #f1f1f1;
    }
}
</style>
