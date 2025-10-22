import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { getPin } from '../storage/secure-store'

interface Props {
    onUnlock: () => void
}

export default function LockScreen({ onUnlock }: Props) {
    const [pin, setPin] = useState('')

    const checkPin = async () => {
        const storedPin = await getPin()
        if (!storedPin) {
            Alert.alert('No PIN set')
            return
        }
        if (pin === storedPin) {
            onUnlock()
            setPin('')
        } else {
            Alert.alert('Incorrect PIN')
            setPin('')
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter PIN</Text>
            <TextInput
                style={styles.input}
                keyboardType="number-pad"
                secureTextEntry
                value={pin}
                onChangeText={setPin}
                placeholder="PIN"
                placeholderTextColor="#aaa"
            />
            <Button title="Unlock" onPress={checkPin} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0b0b',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: { fontSize: 24, color: '#fff', marginBottom: 20 },
    input: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        color: '#fff',
    },
})



// import React, { useState } from 'react'
// import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
// import EncryptedStorage from 'react-native-encrypted-storage'
// import ReactNativeBiometrics from 'react-native-biometrics'


// export default function LockScreen({ navigation, route }: any) {
//     const [pin, setPin] = useState('')


//     const finishUnlock = () => {
//         navigation.goBack()
//     }


//     const tryUnlock = async () => {
//         const stored = await EncryptedStorage.getItem('app_locker_pin')
//         if (stored === pin) finishUnlock()
//     }


//     const tryBiometric = async () => {
//         const rnBiometrics = new ReactNativeBiometrics()
//         try {
//             const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm biometric' })
//             if (success) finishUnlock()
//         } catch (e) {
//             // ignore
//         }
//     }


//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Enter PIN to unlock</Text>
//             <TextInput value={pin} onChangeText={setPin} secureTextEntry keyboardType="number-pad" style={styles.input} />
//             <Button title="Unlock" onPress={tryUnlock} />
//             <View style={{ height: 8 }} />
//             <Button title="Use Biometric" onPress={tryBiometric} />
//         </View>
//     )
// }


// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
//     title: { color: 'white', fontSize: 20, marginBottom: 12 },
//     input: { width: 200, height: 44, backgroundColor: 'white', borderRadius: 8, marginBottom: 12, paddingHorizontal: 8 }
// })