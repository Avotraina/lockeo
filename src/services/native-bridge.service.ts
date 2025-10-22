import { NativeModules, Platform } from 'react-native'
const { UsageStatsModule, ForegroundServiceStarter } = NativeModules as any


export const getForegroundApp = async (): Promise<string | null> => {
    if (Platform.OS !== 'android') return null
    try {
        return await UsageStatsModule.getForegroundApp()
    } catch (e) {
        return null
    }
}


export const startWatcherService = () => {
    if (Platform.OS !== 'android') return
    try {
        ForegroundServiceStarter?.start()
    } catch (e) {
        // fallback: start via Intent on native side if necessary
    }
}