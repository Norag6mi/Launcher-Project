import { app, BrowserWindow, dialog } from "electron";
import { ipcMain } from "electron";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import https from "https";
import AdmZip from "adm-zip";
import { spawn } from "child_process";
import crypto from "crypto"; // Required for hashing the cache file names

import store from "./store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow()
{
    const mainWindow = new BrowserWindow(
        {
            width:1200,
            height:800,
            webPreferences:
            {
                preload:path.join(__dirname, "preload.cjs"),
                contextIsolation:true,
                nodeIntegration:false,
                webSecurity: false // <--- CRITICAL FIX: Allows React to load local file:/// paths
            }
        });
    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(()=>
{
    createWindow();
});

ipcMain.handle("download-game", async(event,data)=>
    {
        return new Promise((resolve,reject)=>{
                const directory = path.dirname(data.savePath);
                if(!fs.existsSync(directory))
                {
                    fs.mkdirSync(directory,{recursive:true}); 
                }
                const file = fs.createWriteStream(data.savePath);
                function downloadFile(url)
                {
                    https.get(url, response=>
                        {                            
                            if(response.statusCode >=300 && response.statusCode <400 && response.headers.location)
                            {
                                return downloadFile(response.headers.location);
                            }
                            const totalSize = parseInt(response.headers["content-length"]);
                            let downloaded=0;
                            response.on("data", chunk=>
                                {
                                    downloaded += chunk.length;
                                    const progress = Math.round(downloaded / totalSize * 100);
                                    event.sender.send("download-progress", progress);
                                }
                            );
                            response.pipe(file);
                            file.on("finish", ()=>
                                {
                                    file.close();
                                    resolve(true);
                                }
                            );
                        }
                    ).on("error", error=>
                        {
                            reject(error);
                        }
                    );
                }
                downloadFile(data.downloadUrl);
            }
        );
    }
);

ipcMain.handle("extract-game", async(event,zipPath)=>
    {
        try
        {
            const zip = new AdmZip(zipPath);
            const extractPath = path.dirname(zipPath);
            zip.extractAllTo(extractPath, true);
            fs.unlinkSync(zipPath);
            return true;
        }
        catch(error)
        {
            console.error(error);
            return false;
        }
    }
);

ipcMain.handle("launch-game", async(event, executablePath)=>
    {
        try
        {
            spawn(executablePath, [], {detached:true,stdio:"ignore"}).unref();
            return true;
        }
        catch(error)
        {
            console.error("Launch failed:", error);
            return false;
        }
    }
);

ipcMain.handle("select-install-directory", async()=>
    {
            const result = await dialog.showOpenDialog({properties:["openDirectory"]});
            if(result.canceled)
            {
                return null;
            }
            return result.filePaths[0];
        }
    );

    ipcMain.handle("delete-directory", async(event,directoryPath)=>
    {
        try
        {
            if(fs.existsSync(directoryPath))
            {
                fs.rmSync(directoryPath, {recursive:true, force:true});
            }
            return true;
        }
        catch(error)
        {
            console.error(error);
            return false;
        }
    }
);

ipcMain.handle("get-installations", async () =>
    {
        return store.get("games", {});
    }
);

ipcMain.handle("save-installation", async(event, gameId, data)=>
    {
        const games =store.get("games", {});
        games[String(gameId)] = data;
        store.set("games", games);
        return true;
    }
);

ipcMain.handle("remove-installation", async(event, gameId)=>
    {
        const games = store.get("games", {});
        delete games[String(gameId)];
        store.set("games", games);
        return true;
    }
);


// --- THE LOCAL ASSET CACHING ENGINE ---
const cachePath = path.join(app.getPath('userData'), 'asset_cache');
if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath, { recursive: true });
}

ipcMain.handle("get-cached-asset", async (event, fileUrl, extHint = ".png") => {
    if (!fileUrl) return null;

    // Create a safe filename using a hash of the URL, appending the extension hint
    const hash = crypto.createHash('md5').update(fileUrl).digest('hex');
    const localFilePath = path.join(cachePath, `${hash}${extHint}`);
    
    // CRITICAL FIX: Convert Windows backslashes (\) to browser-safe forward slashes (/)
    const browserSafePath = localFilePath.replace(/\\/g, '/');

    // If already downloaded, serve from hard drive instantly
    if (fs.existsSync(localFilePath)) {
        return `file:///${browserSafePath}`; 
    }

    // Otherwise, download it silently in the background
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(localFilePath);
        function downloadFile(url) {
            https.get(url, response => {
                // Handle Google Drive's redirects perfectly
                if(response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                    return downloadFile(response.headers.location);
                }
                
                response.pipe(file);
                file.on("finish", () => {
                    file.close();
                    resolve(`file:///${browserSafePath}`);
                });
            }).on("error", error => {
                console.error("Cache download failed:", error);
                fs.unlink(localFilePath, () => {}); // Delete corrupted files
                resolve(fileUrl); // Fallback to live web URL if it fails
            });
        }
        downloadFile(fileUrl);
    });
});