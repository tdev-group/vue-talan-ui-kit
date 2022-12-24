<template>
    <ul class="v-breadcrumbs">
        <li v-for="(route, id) in routes" :key="id" class="v-breadcrumbs__item">
            <RouterLink :to="getRoute(route)" class="v-breadcrumbs__link">{{ getTitle(route) }}</RouterLink>

            <div class="v-breadcrumbs__icon">
                <AngleRightSVG></AngleRightSVG>
            </div>
        </li>

        <li v-if="currentRoute" class="v-breadcrumbs__item">
            <span class="v-breadcrumbs__link">{{ getTitle(currentRoute) }}</span>
        </li>
    </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// SVG
import AngleRightSVG from '@/assets/angle_right.svg';

// Components
import VButtonIcon from '@/components/VButton/VButtonIcon.vue';

// Interfaces
import { Location } from 'vue-router';

interface ILocation extends Location {
    label?: string;
}

// Utils
import PageService from '@/utils/PageService';
import { isInterface } from '@/utils/Helper';

@Component({
    components: {
        AngleRightSVG,
        VButtonIcon,
    },
})
export default class VBreadcrumbs extends Vue {
    @Prop({ type: Array, required: true })
    public routes!: ILocation[] | string[];

    @Prop({ type: [Object, String], default: null })
    public currentRoute!: ILocation | string;

    // accepts only names as string in routes array
    @Prop({ type: Boolean, default: false })
    public reduced!: boolean;

    public getRoute(route: ILocation | string): Location {
        return this.reduced ? { name: route as string } : (route as Location);
    }

    public getTitle(route: ILocation | string) {
        if (isInterface<ILocation>(route, ['label'])) return route.label;
        return PageService.getPageTitle(this.getRoute(route));
    }
}
</script>

<style lang="scss">
.v-breadcrumbs {
    display: flex;
    gap: 1rem;
    margin: 0;

    &__item {
        display: flex;
        align-items: center;
        gap: 0.25rem;

        color: var(--color-text-secondary);
    }

    &__link {
        font-size: 0.875rem;
        color: inherit;
    }

    &__icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1rem;
        height: 1rem;
        padding: 0 0.3rem;
    }

    // Utility classes
    &--margin-bottom {
        margin-bottom: 1.5rem;
    }
}
</style>
