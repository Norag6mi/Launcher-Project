async function selectInstallDirectory(gameTitle)
{
    const selectedDirectory = await window.electronAPI.selectInstallDirectory();
    if(!selectedDirectory)
    {
        return null;
    }

    return `${selectedDirectory}/${gameTitle}`;
}

export default {selectInstallDirectory};