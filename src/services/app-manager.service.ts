import { NativeModules } from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
const { InstalledAppsModule } = NativeModules as any


const LOCKED_KEY = 'locked_apps'


export const getInstalledApps = async (): Promise<any[]> => {
    const list = await InstalledAppsModule.getApps()
    const stored = await EncryptedStorage.getItem(LOCKED_KEY)
    const locked = stored ? JSON.parse(stored) : {}


    return list.map((app: any) => ({
        ...app,
        locked: !!locked[app.packageName]
    }))
}


export const toggleLockForPackage = async (pkg: string) => {
    const stored = await EncryptedStorage.getItem(LOCKED_KEY)
    const locked = stored ? JSON.parse(stored) : {}
    locked[pkg] = !locked[pkg]
    await EncryptedStorage.setItem(LOCKED_KEY, JSON.stringify(locked))
}