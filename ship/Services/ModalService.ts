import IModalEvent from '@/ship/Models/IModalEvent';
import { mainBus } from '@/main';
import Vue, { ComponentOptions, AsyncComponent } from 'vue';

// Modals
import VDynamicModalConfirm from '@/components/VModal/VDynamicModalConfirm.vue';
import { TranslateResult } from 'vue-i18n';

interface ModalConfirmProps {
    title: TranslateResult;
    labelNegative?: TranslateResult;
    labelPositive?: TranslateResult;
    isDangerType?: boolean;
    onConfirm?: () => void | Promise<any>;
}

interface DynamicModalParams {
    component: typeof Vue | ComponentOptions<Vue> | AsyncComponent;
    componentProps?: Record<string, any>;
    modalProps?: Record<string, any>;
    modalEvents?: Record<string, any>;
}

export default class ModalService {
    public static dynamic<_Ty>({ component, componentProps, modalProps, modalEvents }: DynamicModalParams) {
        return new Promise<_Ty>((resolve) => {
            mainBus.$modal.show(component, componentProps, modalProps, {
                ...modalEvents,
                'before-close': (event: IModalEvent<_Ty>) => {
                    modalEvents?.['before-close'](event);
                    resolve(event.params);
                },
            });
        });
    }

    public static confirm(props: ModalConfirmProps, preventHide: boolean = false): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            mainBus.$modal.show(
                VDynamicModalConfirm,
                props,
                { clickToClose: false, maxWidth: 549 },
                {
                    'before-close': (event: IModalEvent<boolean>) => {
                        if (preventHide) event.cancel();
                        resolve(event.params);
                    },
                },
            );
        });
    }
}
