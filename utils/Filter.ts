import { TranslateResult } from 'vue-i18n';
import IDictionary from '@/ship/Models/IDictionary';

export interface IFilter<_Ty = unknown> {
    label?: string | TranslateResult;
    path: string;
    defaultValue?: _Ty;
    type: FilterPanelSlotType;
    bind?: IDictionary;
    style?: string;
}

export enum FilterPanelSlotType {
    Clear = 'clear',
    Save = 'save',
    Empty = '',
    Select = 'VSelect',
    Input = 'VInput',
}

export type FilterElementSlot = Filter | Pick<IFilter, 'type'>;

export class Filter<_Ty = unknown> implements IFilter {
    public label: string | TranslateResult = '';
    public path = '';
    public defaultValue: _Ty | null = null;
    public bind = {};
    public type = FilterPanelSlotType.Empty;
    public style = '';

    public constructor(
        path: string,
        label: TranslateResult,
        defaultValue: _Ty,
        type: FilterPanelSlotType = FilterPanelSlotType.Select,
        bind: IDictionary = {},
        style: string = '',
    ) {
        this.path = path;
        this.label = label;
        this.defaultValue = defaultValue;
        this.type = type;
        this.bind = bind;
        this.style = style;
    }

    public static emptyElement() {
        return { type: FilterPanelSlotType.Empty };
    }

    public static clearButton() {
        return { type: FilterPanelSlotType.Clear };
    }

    public static saveButton() {
        return { type: FilterPanelSlotType.Save };
    }
}

export default Filter;
