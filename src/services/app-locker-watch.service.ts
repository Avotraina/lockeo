import { NativeModules, AppState } from 'react-native'
import { getLockedApps } from '../utils/locked-apps-storage'

const { UsageStatsModule } = NativeModules

let interval: NodeJS.Timer

export const startAppLockerWatcher = async (onLock: (pkg: string) => void) => {
  const lockedApps = await getLockedApps()
  interval = setInterval(async () => {
    try {
      const fgApp = await UsageStatsModule.getForegroundApp()
      if (lockedApps.includes(fgApp)) {
        onLock(fgApp)
      }
    } catch (e) {
      console.error(e)
    }
  }, 1000)
}

export const stopAppLockerWatcher = () => {
  if (interval) clearInterval(interval as any)
}
