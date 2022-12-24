import IDictionary from '@/ship/Models/IDictionary';

export default interface IModalEvent<_Ty = IDictionary> {
    name: string;
    state: string;
    ref: Element | null;
    cancel: () => void;
    params: _Ty;
}

export interface IModalEventFinished {
    name: string;
    ref: Element | null;
    state: string;
}
