export async function uninstallGame(path)
{

    return await window.electronAPI.deleteDirectory(path);
}