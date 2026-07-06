const STORAGE_KEY = "installed_games";

const installationService = {

    getInstalledGames() {

        const data = localStorage.getItem(STORAGE_KEY);

        return data ? JSON.parse(data) : {};
    },

    saveInstalledGame(gameId, metadata) {

        const installedGames = this.getInstalledGames();
        installedGames[gameId] = metadata;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(installedGames));

    },

    getGameInstallation(gameId){

        const installedGames = this.getInstalledGames();

        return installedGames[gameId];

    },

    removeInstalledGame(gameId)
    {
        const installedGames = this.getInstalledGames();
        delete installedGames[gameId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(installedGames));
    }

};

export default installationService;