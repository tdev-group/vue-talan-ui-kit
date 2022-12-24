import ICountedOption from '@/ship/Models/ICountedOption';

export default interface VTagOption<_Ty = unknown> extends ICountedOption<_Ty> {
    selected?: boolean;
}
