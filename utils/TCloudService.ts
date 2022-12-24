import { createApiInstance } from '@/ship/Http';
import ErrorService from './ErrorService';
import ITransformedValue from '@/ship/Values/ITransformedValue';
import { toNumber } from 'lodash';

export interface IFolder {
    id: string;
    depth: number;
    name: string | null;
    authorId: string | null;
    parentId: string | null;
    skeletonEntityId: string | null;
    ancestorIds: string[];

    allowCreateDirectory: boolean;
    allowUploadDocuments: boolean;

    createdAt: string;
    updatedAt: string;

    metadata?: Array<{ key: string; value: string }>;
}

export interface IDocument {
    id: string;
    depth: number;
    name: string | null;
    authorId: string | null;
    parentId: string | null;
    ancestorIds: string[];

    agreed: boolean;
    disabled: boolean;
    downloadUri: string;

    version: IDocumentVersion;
    versions: IDocumentVersion[];

    createdAt: string;
    updatedAt: string;
}

export interface IDocumentVersion {
    index: number;
    isActive: boolean;

    document: IDocumentInfo;
    documentId: string;
    downloadUri: string;

    createdAt: string;
    updatedAt: string;
}

export interface IDocumentInfo {
    authorId: string | null;
    extension: string;
    fullName: string;
    name: string;
    size: number;
    type: string;
}

export interface IDirectory {
    ancestors: IFolder[];
    childrenDirectories: IFolder[];
    childrenDocuments: IDocument[];
    directory: IFolder | null;
}

export const TCloudHttp = createApiInstance(process.env.VUE_APP_CLOUD_URL ?? '', true);

export enum StampType {
    InProductionOfWorksStamp = 1,
}

// API Documentation: https://bim.talan.group/swagger/index.html

export class TCloudService {
    public static makeUrlLinkDownloadable(link: string) {
        return link.replace('/documents', '/v1/documents').replace(/download\/.+$/, 'download');
    }

    public static createFileUid({ id, version }: Pick<IDocument, 'id' | 'version'>) {
        return `${id}__${version.index}`;
    }

    public static parseFileUid(uid: string) {
        const [documentId, versionIndex] = uid.split('__');

        return { documentId, versionIndex: toNumber(versionIndex) };
    }

    public static getRootDirectory() {
        return ErrorService.savedResponse(
            async () => (await TCloudHttp.get<ITransformedValue<IDirectory>>('/v1/directories/root/fetch')).data.data,
            null,
        );
    }

    public static getDirectory(directoryId: string) {
        return ErrorService.savedResponse(
            async () =>
                (await TCloudHttp.get<ITransformedValue<IDirectory>>(`/v1/directories/${directoryId}/fetch`)).data.data,
            null,
        );
    }

    public static getDocument(documentId: string) {
        return ErrorService.savedResponse(
            async () => (await TCloudHttp.get<ITransformedValue<IDocument>>(`/v1/documents/${documentId}`)).data.data,
            null,
        );
    }

    public static putStampOnDocumentVersion(
        documentId: string,
        versionIndex: number,
        stampType = StampType.InProductionOfWorksStamp,
    ) {
        return TCloudHttp.put<ITransformedValue<IDocumentVersion>>(
            `/v1/documents/${documentId}/versions/${versionIndex}/stamp`,
            { type: stampType },
            { headers: { 'Content-Type': 'application/json' } },
        );
    }

    /**
     * Деактуализирует версию со штампом
     */
    public static deactualizeDocumentVersion(documentId: string, versionIndex: number) {
        return TCloudHttp.post(`/v1/documents/${documentId}/versions/${versionIndex}/destroy`);
    }

    public static headDocumentVersion(documentId: string, versionIndex: number) {
        return TCloudHttp.post<ITransformedValue<IDocument>>(
            `/v1/documents/${documentId}/versions/${versionIndex}/head`,
        );
    }

    /**
     * Блокирует возможность изменять документ
     */
    public static agreeDocument(documentId: string) {
        return TCloudHttp.post(`/v1/documents/${documentId}/agree`);
    }

    /**
     * Разблокирует возможность изменять документ
     */
    public static disagreeDocument(documentId: string) {
        return TCloudHttp.post(`/v1/documents/${documentId}/disagree`);
    }
}

export default TCloudService;
