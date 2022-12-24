import IOption from '@/ship/Models/IOption';

export default interface ICountedOption<_Ty = unknown> extends IOption<_Ty> {
    count?: number;
    isDisabled?: boolean;
}
