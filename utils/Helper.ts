import { camelCase, flow, last, pickBy, upperFirst } from 'lodash';
import Vue from 'vue';
import { DateTime } from 'luxon';

export const camelCaseFileName = (fileName: string) => {
    const name = last(fileName.split('/'));

    return camelCase(name!.replace(/(\.\/|\.js)/g, ''));
};
export const getFileExtension = (fileName: string) => fileName.split('.').pop();

export const getFileName = (fileName: string) => fileName.replace(/\.[^/.]+$/, '');

export const pascalCase = flow(camelCase, upperFirst);

export const between = (value: number, min: number, max: number): boolean => value >= min && value <= max;

export function generateHashId(prefix = ''): string {
    const hash = Math.random().toString(36).slice(2, 12);
    return `${prefix}${hash}`;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const hasSearch = (str: string, search: string) => str.toLowerCase().includes(search.toLowerCase().trim());

export const isElementScrolledToBottom = (el: Element) => el.clientHeight + Math.ceil(el.scrollTop) >= el.scrollHeight;

export const splitCaps = (str: string) =>
    str
        .replace(/([a-z])([A-Z]+)/g, (m, s1, s2) => s1 + ' ' + s2)
        .replace(/([A-Z]+)([A-Z][a-z])/g, (m, s1, s2) => s1 + ' ' + s2)
        .replace(/([A-Za-z]+)(\d+)/g, (m, s1, s2) => s1 + ' ' + s2);

export const camelToSnake = (str: string) =>
    splitCaps(str)
        .replace(/\W+/g, ' ')
        .split(/\s/)
        .map((word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
        .join('_');

export const snakeToCamel = (str: string) =>
    str.split('_').reduce((result, word, index) => {
        if (word === word.toUpperCase()) return result + word;
        return result + (index ? pascalCase(word) : camelCase(word));
    }, '');

export const getComponentFunctions = <T extends Vue>(component: T) => {
    return pickBy(component, (value, key) => typeof value === 'function' && /^[a-z]+/g.test(key));
};

const transformScroll = (event: Event) => {
    if (!(event instanceof WheelEvent) || !event.deltaY) return;
    const target = event.currentTarget as HTMLElement;

    target.scrollLeft += event.deltaY + event.deltaX;
    event.preventDefault();
};

export const addHorizontalScroll = (element: Element, vm: Vue) => {
    element.addEventListener('wheel', transformScroll);
    vm.$once('hook:destroyed', () => element.removeEventListener('wheel', transformScroll));
};

/**
 * Returns a random number between min and max
 */
export const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

// @ts-ignore
export const getEnumKeys = (obj: object) => Object.keys(obj).filter(isNaN);

// Dates
export const isDateOverdue = (deadlineDate: string, comparingDate?: string | null) => {
    const deadline = new Date(deadlineDate);
    deadline.setDate(deadline.getDate() + 1);
    const comparing = comparingDate ? new Date(comparingDate) : new Date();
    return comparing > deadline;
};

export const fromISODateString = (date?: string) => (date ? DateTime.fromISO(date).toLocal().toFormat('f') : '');

export const getCurrentDateString = () => DateTime.now().toFormat('dd.MM.yyyy');

export const compareByIsoDateDesc = (a: string, b: string) => {
    const dateA = DateTime.fromISO(a),
        dateB = DateTime.fromISO(b);

    if (dateA === dateB) return 0;
    return dateA < dateB ? 1 : -1;
};

// Types check
export const isInterface = <T>(object: any, requiredFields: string[]): object is T => {
    return requiredFields.every((field) => field in object);
};
