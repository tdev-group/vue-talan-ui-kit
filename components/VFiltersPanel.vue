<template>
    <div class="v-filters-panel">
        <template v-for="(element, index) in elements">
            <VButton
                v-if="element.type === FilterPanelElement.Clear"
                :key="index"
                class="v-filters-panel__clear"
                color="red"
                @click="clear"
            >
                <template #prepend>
                    <div class="v-filters-panel__clear-icon">
                        <CrossSVG />
                    </div>
                </template>

                {{ $t('clearAll') }}
            </VButton>

            <div v-else-if="element.type === FilterPanelElement.Save" :key="index" class="v-filters-panel__save">
                <VCheckbox id="saveSettings" v-model="saveSettings" name="saveSettings" @input="toggleSettingsSave" />
                <label for="saveSettings"> {{ $t('saveSettings') }}</label>
            </div>

            <div v-else-if="element.type === FilterPanelElement.Empty" :key="index"></div>

            <VFormField v-else :key="index" :label="element.label" :style="element.style">
                <component
                    :is="element.type"
                    v-model="filters[element.path]"
                    :placeholder="element.label"
                    class="v-filters-panel__item"
                    v-bind="element.bind"
                ></component>
            </VFormField>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue, Watch } from 'vue-property-decorator';

// Components
import VCheckbox from '@/components/VCheckbox.vue';
import VButton from '@/components/VButton/VButton.vue';
import VSelect from '@/components/VSelect.vue';
import VInput from '@/components/VInput.vue';
import VFormField from '@/components/VFormField.vue';

// SVG
import CrossSVG from '@/assets/cross.svg';

// Interfaces
import IDictionary from '@/ship/Models/IDictionary';

// Utils
import { clone } from 'lodash';
import { Filter, FilterElementSlot, FilterPanelSlotType } from '@/utils/Filter';

@Component({
    components: { VCheckbox, VButton, VSelect, VInput, VFormField, CrossSVG },
})
export default class VFiltersPanel extends Vue {
    @VModel({ type: Object, default: () => ({}) })
    public filters!: IDictionary;

    @Prop({ type: Array, default: () => [] })
    public elements!: FilterElementSlot[];

    @Prop({ type: String, required: true })
    public localStorageName!: string;

    FilterPanelElement = FilterPanelSlotType;

    public saveSettings = false;

    public clear() {
        const filters = {};
        this.elements.forEach((element) => {
            if (element instanceof Filter) this.$set(filters, element.path, clone(element.defaultValue));
        });
        this.filters = filters;
    }

    public toggleSettingsSave(value: boolean) {
        value ? this.saveFilters() : this.clearLocalStorage();
    }

    public saveFilters() {
        localStorage.setItem(this.localStorageName, JSON.stringify(this.filters));
    }

    public clearLocalStorage() {
        localStorage.removeItem(this.localStorageName);
    }

    public loadLocalStorage() {
        const rawData = localStorage.getItem(this.localStorageName);

        if (rawData) {
            this.saveSettings = true;
            this.filters = JSON.parse(rawData);
        } else {
            this.clear();
        }
    }

    @Watch('filters', { deep: true })
    filtersChangeHandler() {
        if (this.saveSettings) this.saveFilters();
    }

    public async created() {
        this.loadLocalStorage();
    }
}
</script>

<style lang="scss">
.v-filters-panel {
    display: grid;
    grid-template-columns: repeat(8, minmax(3.5rem, 1fr));
    gap: 0.75rem;
    align-items: end;
    padding: 1.5rem 1.5rem 1.125rem;

    background-color: var(--color-white);
    border-radius: 1.125rem;

    & > * {
        grid-column: span 2;
    }

    &__item {
        .multiselect__tags:hover,
        .v-input:hover {
            transition: box-shadow 0.2s ease-in-out;
            box-shadow: 0 1px 10px rgba(88, 88, 88, 0.15);
        }
    }

    &__save {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.375rem;

        color: var(--color-tundora);
        font-size: 0.875rem;
        line-height: 1rem;

        label {
            cursor: pointer;
            user-select: none;
        }
    }

    &__clear {
        height: 3rem;
        align-self: end;
    }

    &__clear-icon {
        line-height: 0;
        width: 1rem;
        height: 1rem;
        padding: 0.15625rem;
        stroke: var(--color-white);
    }
}
</style>
