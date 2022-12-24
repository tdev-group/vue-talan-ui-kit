import { IIncludedValue } from '@/ship/Values/ITransformedValue';
import User from '@/ship/Models/User';
import { TranslateResult } from 'vue-i18n';

export interface IChat {
    id: number;
    messages: IIncludedValue<IChatMessage[]>;
    users: IIncludedValue<User[]>;
    unreadedCount: number;
}

export interface IChatMessage {
    id: number;
    body: string;
    userId: number;
    type: string;
    createdAt: string;
}

export interface INormalizedChatMessage {
    author: User | undefined;
    name: string;
    body: string;
    date: string;
    isSelf: boolean;
}

export interface IChatPendingMessage {
    id?: number;
    body: string;
    error?: string | TranslateResult;
}

export interface IChatOptions {
    getEndpoint: string;
    sendEndpoint: string;
}
