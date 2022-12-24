import { Vue } from 'vue-property-decorator';

export interface ObserverField {
    valid: boolean;
    passed: boolean;
    required: boolean;
}

export type Observer = Vue & {
    validate: (args?: { silent?: boolean }) => Promise<boolean>;
    fields: { [key: string]: ObserverField };
};

export default Observer;
