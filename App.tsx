/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { enableScreens } from 'react-native-screens';
enableScreens(true);

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import { AppState, Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { startWatcherService } from './src/services/native-bridge.service';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LockScreen from './src/screens/lock-screen';
import AppListScreen from './src/screens/app-list-screen';
import { PaperProvider } from 'react-native-paper';
import { startAppLockerWatcher, stopAppLockerWatcher } from './src/services/app-locker-watch.service';
// import { startWatcherService } from './services/nativeBridge'

const Stack = createNativeStackNavigator()

function App() {

  const [lockedApp, setLockedApp] = useState<string | null>(null)
  const [unlockedApps, setUnlockedApps] = useState<string[]>([])
  const [showAppList, setShowAppList] = useState(false)

  useEffect(() => {
    // Start the native foreground watcher service on Android
    if (Platform.OS === 'android') startWatcherService()
  }, [])

  // useEffect(() => { startAppLockerWatcher() }, [])


  // Start foreground app watcher
  useEffect(() => {
    startAppLockerWatcher((pkg: string) => {
      if (!unlockedApps.includes(pkg)) setLockedApp(pkg)
    })

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active' && lockedApp) {
        // App came to foreground, force lock screen
        setLockedApp(lockedApp)
      }
    })

    return () => {
      stopAppLockerWatcher()
      subscription.remove()
    }
  }, [lockedApp, unlockedApps])

  const onUnlock = () => {
    if (lockedApp) {
      setUnlockedApps([...unlockedApps, lockedApp])
      setLockedApp(null)
    }
  }

  if (lockedApp) {
    // Show PIN screen if current app is locked
    return <LockScreen onUnlock={onUnlock} />
  }

  if (showAppList) {
    return <AppListScreen />
  }

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={'red'} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='AppList'>
            <Stack.Screen name="AppList" component={AppListScreen} />
            <Stack.Screen name="Lock">
              {() => <LockScreen onUnlock={onUnlock} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
        {/* <AppContent /> */}
      </PaperProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
