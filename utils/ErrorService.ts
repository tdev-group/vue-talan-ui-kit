import ModalEnum from '@/ship/Enums/ModalEnum';
import { mainBus } from '@/main';
import i18n from '@/plugins/VueI18n';
import { TranslateResult } from 'vue-i18n';
import { get, isFunction, isObject, isString } from 'lodash';
import { AxiosError } from 'axios';

type DefaultMessage = string | { name: string; params: any };

export default class ErrorService {
    public static errorMessage(error: any, defaultMessage?: DefaultMessage): TranslateResult {
        let name = '';
        // If an error from an API try to get a message for this error.
        name = get(error, 'response.data.title') ? `errors.${error.response.data.title}` : name;

        name = get(error, 'response.data.message') ? `validationErrors["${error.response.data.message}"]` : name;

        // If an error from the JS tries to get a message for this error.
        name = name || error?.message;

        if (name && i18n.te(name)) {
            return i18n.t(name);
        }

        // If the defaultMessage is string or object with name prop then tries to get an error message.
        if (isString(defaultMessage)) {
            return i18n.te(defaultMessage) ? i18n.t(defaultMessage) : defaultMessage;
        }

        if (isObject(defaultMessage) && i18n.te(defaultMessage.name)) {
            return i18n.t(defaultMessage.name, defaultMessage.params);
        }

        return i18n.t('errors.error');
    }

    public static handleApiError(error: unknown) {
        mainBus.$modal.show(ModalEnum.Error, { error });
    }

    /**
     * Allows the program not to break if the request was not successful
     *
     * @param request api request
     * @param reject response, if request has been failed
     */
    public static savedResponse<T = any, E = any>(request: () => Promise<T>, reject: E | ((error: AxiosError) => E)) {
        return request().catch((error) => (isFunction(reject) ? reject(error) : reject));
    }

    public static innerErrorMessages(error: any) {
        return Object.values(get(error, 'response.data.errors') ?? {}).flat();
    }
}
