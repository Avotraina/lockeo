// import React, { useEffect, useState, useMemo } from 'react'
// import {
//     View,
//     Text,
//     FlatList,
//     TextInput,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
// } from 'react-native'
// import { NativeModules } from 'react-native'
// import { getLockedApps, saveLockedApps } from '../utils/locked-apps-storage'
// import { setLockedApps } from '../storage/secure-store'

// const { InstalledAppsModule } = NativeModules

// interface AppInfo {
//     packageName: string
//     appName: string
//     icon: string
//     isSystemApp: boolean
// }

// export default function AppListScreen() {
//     const [apps, setApps] = useState<AppInfo[]>([])
//     const [lockedApps, setLockedApps] = useState<string[]>([])
//     const [search, setSearch] = useState('')
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const loadApps = async () => {
//             try {
//                 const list = await InstalledAppsModule.getApps()
//                 setApps(list)
//                 const locked = await getLockedApps()
//                 setLockedApps(locked)
//             } catch (e) {
//                 console.error('Failed to load apps', e)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadApps()
//     }, [])

//     const toggleLock = async (pkg: string) => {
//         let updated: string[]
//         if (lockedApps.includes(pkg)) {
//             updated = lockedApps.filter(p => p !== pkg)
//         } else {
//             updated = [...lockedApps, pkg]
//         }
//         setLockedApps(updated)
//         await saveLockedApps(updated)
//     }

//     const filteredApps = useMemo(() => {
//         const q = search.trim().toLowerCase()
//         if (!q) return apps
//         return apps.filter(
//             app =>
//                 app.appName.toLowerCase().includes(q) ||
//                 app.packageName.toLowerCase().includes(q),
//         )
//     }, [search, apps])

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" />
//                 <Text style={styles.loadingText}>Loading apps...</Text>
//             </View>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 placeholder="Search app..."
//                 value={search}
//                 onChangeText={setSearch}
//                 style={styles.searchInput}
//                 placeholderTextColor="#999"
//             />

//             <FlatList
//                 data={filteredApps}
//                 keyExtractor={item => item.packageName}
//                 renderItem={({ item }) => {
//                     const locked = lockedApps.includes(item.packageName)
//                     return (
//                         <TouchableOpacity
//                             style={styles.item}
//                             onPress={() => toggleLock(item.packageName)}
//                             // onPress={async () => {
//                             //     // const isLocked = await toggleLockApp(item.packageName)
//                             //     // optionally update local state to reflect UI
//                             //     // setLockedAppsState(prev =>
//                             //     //     isLocked ? [...prev, item.packageName] : prev.filter(p => p !== item.packageName)
//                             //     // )
//                             // }}
//                         >
//                             <Image
//                                 source={{ uri: `data:image/png;base64,${item.icon}` }}
//                                 style={styles.icon}
//                             />
//                             <Text style={styles.name}>{item.appName}</Text>
//                             <Text style={[styles.name, { marginLeft: 8 }]}>
//                                 {item.isSystemApp ? 'System' : 'Installed'}
//                             </Text>
//                             <Text style={[styles.name, { marginLeft: 'auto', color: locked ? 'red' : 'green' }]}>
//                                 {locked ? 'Locked' : 'Unlocked'}
//                             </Text>
//                         </TouchableOpacity>
//                     )
//                 }}
//             />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#0b0b0b', padding: 12 },
//     searchInput: {
//         backgroundColor: '#1c1c1c',
//         color: '#fff',
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         marginBottom: 10,
//     },
//     item: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: '#333',
//     },
//     icon: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
//     name: { color: '#fff', fontSize: 16 },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     loadingText: { color: '#aaa', marginTop: 10 },
// })




// /**
//  * Toggle lock status for a specific app
//  * @param packageName - package name of the app
//  * @returns boolean - true if now locked, false if unlocked
//  */
// export const toggleLockApp = async (packageName: string): Promise<boolean> => {
//     try {
//         const lockedApps = await getLockedApps()
//         let updatedLockedApps: string[]

//         if (lockedApps.includes(packageName)) {
//             // Unlock
//             updatedLockedApps = lockedApps.filter(pkg => pkg !== packageName)
//             await setLockedApps(updatedLockedApps)
//             return false
//         } else {
//             // Lock
//             updatedLockedApps = [...lockedApps, packageName]
//             await setLockedApps(updatedLockedApps)
//             return true
//         }
//     } catch (e) {
//         console.error('Failed to toggle lock', e)
//         return false
//     }
// }



import React, { useEffect, useState, useMemo } from 'react'
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import { NativeModules } from 'react-native'
import { SegmentedButtons } from 'react-native-paper'

const { InstalledAppsModule } = NativeModules

interface AppInfo {
    packageName: string
    appName: string
    icon: string // base64
    isSystemApp: boolean
}

export default function AppListScreen() {
    const [apps, setApps] = useState<AppInfo[]>([])
    const [search, setSearch] = useState('')
    const [segment, setSegment] = useState<'user' | 'system'>('user')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadApps = async () => {
            try {
                const list = await InstalledAppsModule.getApps()
                setApps(list)
            } catch (e) {
                console.error('Failed to load apps', e)
            } finally {
                setLoading(false)
            }
        }
        loadApps()
    }, [])

    const filteredApps = useMemo(() => {
        const q = search.trim().toLowerCase()
        return apps
            .filter(app => (segment === 'user' ? !app.isSystemApp : app.isSystemApp))
            .filter(app =>
                app.appName.toLowerCase().includes(q) ||
                app.packageName.toLowerCase().includes(q)
            )
    }, [search, apps, segment])

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading installed apps...</Text>
            </View>
        )
    }

    const renderAppItem = ({ item }: { item: AppInfo }) => (
        <TouchableOpacity style={styles.item}>
            <Image
                source={{ uri: `data:image/png;base64,${item.icon}` }}
                style={styles.icon}
            />
            <Text style={styles.name}>{item.appName}</Text>
            <Text style={[styles.name, item.isSystemApp && { color: '#aaa' }]}>
                {item.isSystemApp ? ' (System)' : ' (User)'}
            </Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <SegmentedButtons
                value={segment}
                onValueChange={setSegment}
                buttons={[
                    { value: 'user', label: 'User Apps' },
                    { value: 'system', label: 'System Apps' },
                ]}
                style={styles.segmented}
            />

            <TextInput
                placeholder="Search app..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholderTextColor="#999"
            />

            <FlatList
                data={filteredApps}
                keyExtractor={item => item.packageName}
                renderItem={renderAppItem}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No apps found</Text>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0b0b',
        padding: 12,
    },
    segmented: {
        marginBottom: 10,
    },
    searchInput: {
        backgroundColor: '#1c1c1c',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#333',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    name: {
        color: '#fff',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#aaa',
        marginTop: 10,
    },
    emptyText: {
        color: '#888',
    },
})






// import React, { useEffect, useState, useMemo } from 'react'
// import {
//     View,
//     Text,
//     FlatList,
//     TextInput,
//     Image,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
// } from 'react-native'
// import { NativeModules } from 'react-native'

// const { InstalledAppsModule } = NativeModules

// interface AppInfo {
//     packageName: string
//     appName: string
//     icon: string // base64
//     isSystemApp: boolean
// }

// export default function AppListScreen() {
//     const [apps, setApps] = useState<AppInfo[]>([])
//     const [search, setSearch] = useState('')
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         const loadApps = async () => {
//             try {
//                 const list = await InstalledAppsModule.getApps()
//                 setApps(list)
//             } catch (e) {
//                 console.error('Failed to load apps', e)
//             } finally {
//                 setLoading(false)
//             }
//         }
//         loadApps()
//     }, [])

//     const filteredApps = useMemo(() => {
//         const q = search.trim().toLowerCase()
//         if (!q) return apps
//         return apps.filter(app =>
//             app.appName.toLowerCase().includes(q) ||
//             app.packageName.toLowerCase().includes(q)
//         )
//     }, [search, apps])

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator size="large" />
//                 <Text style={styles.loadingText}>Loading installed apps...</Text>
//             </View>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             <TextInput
//                 placeholder="Search app..."
//                 value={search}
//                 onChangeText={setSearch}
//                 style={styles.searchInput}
//                 placeholderTextColor="#999"
//             />

//             <FlatList
//                 data={filteredApps}
//                 keyExtractor={item => item.packageName}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.item}>
//                         <Image
//                             source={{ uri: `data:image/png;base64,${item.icon}` }}
//                             style={styles.icon}
//                         />
//                         <Text style={styles.name}>{item.appName}</Text>
//                         <Text style={[styles.name, item.isSystemApp && { color: '#aaa' }]}>
//                             {item.isSystemApp ? ' (System)' : 'Installe'}
//                         </Text>
//                     </TouchableOpacity>
//                 )}
//                 ListEmptyComponent={
//                     <View style={styles.center}>
//                         <Text style={styles.emptyText}>No apps found</Text>
//                     </View>
//                 }
//             />
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#0b0b0b',
//         padding: 12,
//     },
//     searchInput: {
//         backgroundColor: '#1c1c1c',
//         color: '#fff',
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         marginBottom: 10,
//     },
//     item: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: '#333',
//     },
//     icon: {
//         width: 40,
//         height: 40,
//         borderRadius: 8,
//         marginRight: 12,
//     },
//     name: {
//         color: '#fff',
//         fontSize: 16,
//     },
//     center: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     loadingText: {
//         color: '#aaa',
//         marginTop: 10,
//     },
//     emptyText: {
//         color: '#888',
//     },
// })
