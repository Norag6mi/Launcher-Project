import apiClient from "../api/apiClient";

export async function getLatestVersion(gameId){

    const response = await apiClient.get(
        `/games/${gameId}/latest-version`
    );

    return response.data;
}

export async function checkUpdate(gameId, installedVersion)
{
    const response = await apiClient.get(`/games/${gameId}/check-update/${installedVersion}`);

    return response.data;
}