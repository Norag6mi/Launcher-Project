export async function launchGame(executablePath)
{

    return await window.electronAPI.launchGame(executablePath);
}