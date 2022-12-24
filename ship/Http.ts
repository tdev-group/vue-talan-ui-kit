import axios, { AxiosInstance } from 'axios';
import applyCaseMiddleware, { ApplyCaseMiddlewareOptions } from 'axios-case-converter';
import { camelToSnake, snakeToCamel } from '@/utils/Helper';
import oidc from '../vue-oidc-client';
import store from '../store';
import i18n from '@/plugins/VueI18n';

const BASE_URL = process.env.VUE_APP_BASE_URL ?? '';

function createAxiosInstance(baseURL = BASE_URL, disableConvert: boolean = false): AxiosInstance {
    const axiosInstance = axios.create({ baseURL });

    const converterOption: ApplyCaseMiddlewareOptions = {
        preservedKeys: ['orderBy', 'sortedBy', 'searchJoin', 'searchFields'],
        caseFunctions: { snake: camelToSnake, camel: snakeToCamel },
    };
    const instance = disableConvert ? axiosInstance : applyCaseMiddleware(axiosInstance, converterOption);

    instance.defaults.headers.common.Accept = 'application/json';
    instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    return instance;
}

function useJwtAuthorization(instance: AxiosInstance) {
    instance.interceptors.request.use((request) => {
        request.headers!.authorization = 'Bearer ' + oidc.accessToken;

        return request;
    });

    instance.interceptors.response.use(undefined, (error) => {
        if (error && error.response && error.response.status === 401) {
            store.commit('SET_APPLICATION_ERROR', i18n.t('errors.tokenExpired'));
        }

        return Promise.reject(error);
    });

    return instance;
}

function createApiInstance(baseURL: string, disableConvert: boolean = false) {
    const client = createAxiosInstance(baseURL, disableConvert);

    useJwtAuthorization(client);

    return client;
}

export { createApiInstance, createAxiosInstance, useJwtAuthorization };
export default createApiInstance(BASE_URL);
