import { DateTime } from 'luxon';

export const parseDateString = (date: string): Date => {
    if (date.includes('.')) {
        return DateTime.fromFormat(date, 'dd.MM.yyyy').toJSDate();
    }

    return new Date(date);
};

export const parseDate = (date: string) => DateTime.fromFormat(date, 'yyyy-MM-dd').toFormat('dd.MM.yyyy');

export const prepareDate = (date: string) => DateTime.fromFormat(date, 'dd.MM.yyyy').toFormat('yyyy-MM-dd');
