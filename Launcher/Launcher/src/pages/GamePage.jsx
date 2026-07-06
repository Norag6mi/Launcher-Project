import { useEffect, useState } from "react";
import gameService from "../services/gameService";
import installationService from "../services/installationService";
import GameCard from "../components/GameCard";
import { checkUpdate } from "../services/versionService";
import Navbar from "../components/Navbar";

// Keep your local UI logo
import logoMark from "../assets/ui/logo-mark.png";

// --- THE GOOGLE DRIVE HACK FUNCTION ---
const getDirectDriveUrl = (url) => {
    if (!url || !url.includes("drive.google.com/file/d/")) return url;
    const fileId = url.split("/file/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

function GamePage({ onLogout }) {
    const [games, setGames] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState(null);
    
    // --- CACHING STATE ---
    const [cachedIcons, setCachedIcons] = useState({});

    useEffect(() => {
        async function loadGames() {
            try {
                const data = await gameService.getGames();
                const mergedGames = await Promise.all(data.map(async(game) => {
                    const installInfo = installationService.getGameInstallation(game.id);
                    let updateInfo = null;
                    if(installInfo?.installed) {
                        try {
                            updateInfo = await checkUpdate(game.id, installInfo.version);
                        } catch(error) {
                            console.error(error);
                        }
                    }
                    return {...game, installInfo, updateInfo};
                }));
                
                setGames(mergedGames);
                if (mergedGames.length > 0) {
                    setSelectedGameId(mergedGames[0].id);
                }

                // --- TRIGGER ICON CACHING ---
                const iconMap = {};
                for (const game of mergedGames) {
                    if (game.icon_url) {
                        const directUrl = getDirectDriveUrl(game.icon_url);
                        // Tell Electron this is a .png file
                        const localPath = await window.electronAPI.getCachedAsset(directUrl, ".png");
                        iconMap[game.id] = localPath;
                    }
                }
                setCachedIcons(iconMap);

            } catch(error) {
                console.error(error);
            }
        }
        loadGames();
    }, []);

    function updateInstallState(gameId, metadata) {
        setGames(previousGames => previousGames.map(game => {
            if(game.id === gameId) return {...game, installInfo : metadata};
            return game;
        }));
    }

    function updateUninstallState(gameId) {
        setGames(previousGames => previousGames.map(game => {
            if(game.id === gameId) return {...game, installInfo:null};
            return game;
        }));
    }

    const activeGame = games.find(g => g.id === selectedGameId);

    return (
        <div className="launcher-layout">
            
            <div className="launcher-sidebar">
                <div className="sidebar-logo" style={{ background: "transparent" }}>
                    <img src={logoMark} alt="Logo" style={{ width: "40px", height: "40px" }} />
                </div>
                
                {games.map(game => {
                    const localIconPath = cachedIcons[game.id];
                    
                    return (
                        <div 
                            key={game.id}
                            className={`sidebar-game-icon ${selectedGameId === game.id ? 'active' : ''}`}
                            onClick={() => setSelectedGameId(game.id)}
                            title={game.title}
                            style={{ 
                                backgroundImage: localIconPath ? `url(${localIconPath})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {!localIconPath && game.title.charAt(0)}
                        </div>
                    );
                })}
            </div>

            <div className="launcher-main">
                <Navbar onLogout={onLogout} />
                
                {activeGame && (
                    <GameCard
                        key={activeGame.id}
                        game={activeGame}
                        onInstall={updateInstallState}
                        onUninstall={updateUninstallState}
                    />
                )}
            </div>
        </div>
    );
}

export default GamePage;