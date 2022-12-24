import { TranslateResult } from 'vue-i18n';

export default interface IOption<_Ty = unknown> {
    label: string | TranslateResult;
    value: _Ty;
}
