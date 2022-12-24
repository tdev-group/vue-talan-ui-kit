import { TranslateResult } from 'vue-i18n';
import { RawLocation } from 'vue-router';
import { VueConstructor } from 'vue/types/umd';
import PermissionsEnum from '@/ship/Enums/PermissionsEnum';

export default interface AppSidebarNavigationLink {
    label: TranslateResult;
    to: RawLocation;
    icon?: VueConstructor;
    children?: Array<Exclude<AppSidebarNavigationLink, 'children'>>;

    permissions?: PermissionsEnum[];
}
