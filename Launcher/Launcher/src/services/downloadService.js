export async function downloadGame(downloadUrl, savePath, onProgress)

{
    window.electronAPI.onDownloadProgress((progress)=>
        {
            onProgress(progress);
        }
    );

    return await window.electronAPI.downloadGame(downloadUrl, savePath);
}