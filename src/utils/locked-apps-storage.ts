import EncryptedStorage from 'react-native-encrypted-storage'

// Save the list of apps the user wants to lock
export async function saveLockedApps(apps: string[]) {
    await EncryptedStorage.setItem('LOCKED_APPS', JSON.stringify(apps))
}

// Get the list of locked apps
export async function getLockedApps(): Promise<string[]> {
    const data = await EncryptedStorage.getItem('LOCKED_APPS')
    return data ? JSON.parse(data) : []
}
