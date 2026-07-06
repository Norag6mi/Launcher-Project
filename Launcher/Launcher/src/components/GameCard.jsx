import installationService from "../services/installationService";
import directoryService from "../services/directoryService";
import { useState, useEffect } from "react";
import { getLatestVersion } from "../services/versionService";
import { downloadGame } from "../services/downloadService";
import { extractGame } from "../services/extractService";
import { launchGame } from "../services/launcherService";
import { uninstallGame } from "../services/uninstallService";
import ReleaseNotesModal from "./ReleaseNotesModal";

// --- THE GOOGLE DRIVE HACK FUNCTION ---
const getDirectDriveUrl = (url) => {
    if (!url || !url.includes("drive.google.com/file/d/")) return url;
    const fileId = url.split("/file/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

function GameCard({game, onInstall, onUninstall}) {
    const installInfo = game.installInfo;
    const installed = installInfo?.installed || false;
    const version = installInfo?.version || "Not Installed";

    const updateAvailable = game.updateInfo?.update_available || false;
    const latestVersion = game.updateInfo?.latest_version;

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    // --- CACHING STATE ---
    const [localVideoUrl, setLocalVideoUrl] = useState(null);

    // Ask Electron for the cached video whenever the game changes
    useEffect(() => {
        async function fetchLocalVideo() {
            if (game?.thumbnail_url) {
                const directUrl = getDirectDriveUrl(game.thumbnail_url);
                // Tell Electron this is an .mp4 file
                const localPath = await window.electronAPI.getCachedAsset(directUrl, ".mp4");
                setLocalVideoUrl(localPath);
            } else {
                setLocalVideoUrl(null);
            }
        }
        fetchLocalVideo();
    }, [game?.thumbnail_url]);

    async function handleInstall() {
        try {
            setErrorMessage("");
            setIsDownloading(true);
            const selectedPath = await directoryService.selectInstallDirectory(game.title);
            if(!selectedPath) {
                setIsDownloading(false);
                return;
            }
            const backendVersion = await getLatestVersion(game.id);
            await downloadGame(backendVersion.download_url, `${selectedPath}/${backendVersion.file_name}`, (progress) => {
                setDownloadProgress(progress);
            });
            await extractGame(`${selectedPath}/${backendVersion.file_name}`);
            const metadata = {installed:true, version: backendVersion.version, path:selectedPath, executable:backendVersion.executable_name};
            installationService.saveInstalledGame(game.id, metadata);
            onInstall(game.id, metadata);
        } catch(error) {
            console.error("Install failed:", error);
            setErrorMessage("Installation failed. Check your network and try again.");
        } finally {
            setIsDownloading(false);
        }
    }

    async function handlePlay() {
        setErrorMessage("");
        const executablePath = `${installInfo.path}/${installInfo.executable}`;
        await launchGame(executablePath);
    }

    async function handleUpdate() {
        try {
            setErrorMessage("");
            setIsDownloading(true);
            const backendVersion = await getLatestVersion(game.id);
            await downloadGame(backendVersion.download_url, `${installInfo.path}/${backendVersion.file_name}`, (progress) => {
                setDownloadProgress(progress);
            });
            await extractGame(`${installInfo.path}/${backendVersion.file_name}`);
            const metadata = {...installInfo, version: backendVersion.version, executable: backendVersion.executable_name};
            installationService.saveInstalledGame(game.id, metadata);
            onInstall(game.id, metadata);
        } catch(error) {
            console.error("Update failed:", error);
            setErrorMessage("Update failed. Check your network and try again.");
        } finally {
            setIsDownloading(false);
        }
    }

    async function handleUninstall() {
        setErrorMessage("");
        if(!window.confirm("Uninstall this game?")) return;
        await uninstallGame(installInfo.path);
        installationService.removeInstalledGame(game.id);
        onUninstall(game.id);
    }

    return (
        <>
            <div className="game-hero-view" style={{ backgroundColor: "#0a0a0c" }}>
                
                {/* Only render the video tag once we have the local file path */}
                {localVideoUrl && (
                    <video 
                        className="hero-video-bg"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        src={localVideoUrl} 
                    />
                )}

                <div className="hero-gradient"></div>
                
                <div className="game-content">
                    <h1 className="game-title-massive">{game.title}</h1>
                    <p className="game-desc">{game.description || "Become a legend. Master your abilities and outplay your opponents in an epic battle."}</p>
                    
                    {errorMessage && <p style={{color:"#eb0029", marginBottom: "15px"}}>{errorMessage}</p>}
                    
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <button 
                            className="massive-action-btn"
                            onClick={installed ? handlePlay : handleInstall}
                        >
                            {isDownloading 
                                ? `Downloading ${downloadProgress}%` 
                                : installed 
                                    ? "▶ Play" 
                                    : "⬇ Install"
                            }
                        </button>

                        <div style={{ display: "flex", gap: "10px" }}>
                            {installed && updateAvailable && !isDownloading && (
                                <button className="text-btn" onClick={handleUpdate} style={{ marginTop: 0, padding: "10px" }}>Update</button>
                            )}
                            
                            {installed && !isDownloading && (
                                <button className="text-btn" onClick={() => setShowNotes(true)} style={{ marginTop: 0, padding: "10px" }}>Patch Notes</button>
                            )}
                            
                            {installed && (
                                <button className="text-btn" onClick={handleUninstall} style={{ marginTop: 0, padding: "10px", color: "var(--text-secondary)" }}>Uninstall</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showNotes && (
                <ReleaseNotesModal
                    version={latestVersion || version}
                    releaseNotes={game.updateInfo?.release_notes}
                    onClose={() => setShowNotes(false)}
                />
            )}
        </>
    );
}

export default GameCard;