import EncryptedStorage from 'react-native-encrypted-storage'
export const setPin = (pin: string) => EncryptedStorage.setItem('app_locker_pin', pin)
export const getPin = () => EncryptedStorage.getItem('app_locker_pin')


export const setLockedApps = async (apps: string[]) =>
  EncryptedStorage.setItem('locked_apps', JSON.stringify(apps))

export const getLockedApps = async (): Promise<string[]> => {
  const json = await EncryptedStorage.getItem('locked_apps')
  return json ? JSON.parse(json) : []
}