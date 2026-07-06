const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI",
    {
        downloadGame:(downloadUrl,savePath)=>
            ipcRenderer.invoke("download-game",
                {
                    downloadUrl,
                    savePath
                }
            ),
        onDownloadProgress:(callback)=>
        {
            ipcRenderer.on("download-progress", (_,progress)=>
                {
                    callback(progress);
                }
            );
        },
        extractGame:(zipPath)=> ipcRenderer.invoke("extract-game", zipPath),
        launchGame:(executablePath)=> ipcRenderer.invoke("launch-game", executablePath),
        selectInstallDirectory:()=> ipcRenderer.invoke("select-install-directory"),
        deleteDirectory:(path)=>
            ipcRenderer.invoke("delete-directory", path),

        getInstallations:()=> ipcRenderer.invoke("get-installations"),

        saveInstallation:(gameId, data)=> ipcRenderer.invoke("save-installation", gameId, data),

        removeInstallation:(gameId)=> ipcRenderer.invoke("remove-installation",gameId),

        // --- THE LOCAL ASSET CACHING ENGINE BRIDGE ---
        // Added extHint so React can tell Electron if it's an .mp4 or .png
        getCachedAsset: (url, extHint) => ipcRenderer.invoke("get-cached-asset", url, extHint)
    }
);