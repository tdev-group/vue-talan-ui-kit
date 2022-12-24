import JSZip from 'jszip';
import Http from '@/ship/Http';

interface IDownloadableFile {
    name: string;
    url: string;
}

interface NamedBlob extends Blob {
    name: string;
}

export const downloadFiles = (files: IDownloadableFile[]) =>
    files.length === 1 ? downloadFile(files[0]) : getZip(files);

export const downloadFile = async (file: IDownloadableFile) => {
    const { data } = await Http.get(file.url, { responseType: 'blob' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(data);
    anchor.download = file.name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};

export const getZip = (files: IDownloadableFile[], filename: string = 'files') =>
    fetchBlobs(files)
        .then(pack)
        .then((zipFile) => getFileByURL(URL.createObjectURL(zipFile), filename));

export const getFileByURL = (url: string, filename?: string) => {
    const linkURL = document.createElement('a');
    linkURL.download = filename ?? url.substring(url.lastIndexOf('/') + 1, url.length);
    linkURL.href = url;
    document.body.appendChild(linkURL);
    linkURL.click();
    document.body.removeChild(linkURL);
};

const fetchBlobs = (files: IDownloadableFile[]) => {
    return Promise.all(
        files.map(({ url, name }, index) =>
            Http.get(url, { responseType: 'blob' })
                .then((resp) => resp.data)
                .then((blob) => {
                    // store the file name
                    (blob as NamedBlob).name = name;
                    return blob as NamedBlob;
                }),
        ),
    );
};

const pack = (blobs: NamedBlob[]) => {
    const zip = new JSZip();
    blobs.forEach((blob) => zip.file(blob.name, blob));
    return zip.generateAsync({ type: 'blob' });
};
