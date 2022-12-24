export default interface IFile {
    id: number;
    name: string;
    MIMEType: string;
    size: number;
    hidden?: boolean;
    url?: string | null;

    createdAt?: string;
    updatedAt?: string;
}
