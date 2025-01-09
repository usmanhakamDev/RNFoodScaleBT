import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
  View,
  Text,
} from 'react-native';
import Header from './components/Header';
import DeviceItem from './components/DeviceItem';
import {useBleManager} from './hooks/useBleManager';
import {NativeWindStyleSheet} from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const {isScanning, devices, startScan, connectToDevice, disconnectDevice} =
    useBleManager(setError);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Header isScanning={isScanning} onScanPress={startScan} />

      <View className="px-4 py-3">
        <Text className="text-lg font-semibold text-gray-700">
          Available Devices {devices.length > 0 && `(${devices.length})`}
        </Text>
        {isScanning && (
          <View className="flex-row items-center mt-2">
            <ActivityIndicator size="small" color="#6366f1" />
            <Text className="ml-2 text-indigo-600">
              Scanning for devices...
            </Text>
          </View>
        )}
      </View>

      {devices.length === 0 && !isScanning && (
        <View className="flex-1 justify-center items-center px-4">
          <View className="bg-gray-50 p-6 rounded-2xl w-full items-center">
            <Text className="text-gray-500 text-center mb-2">
              No devices found
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Tap the scan button to search for nearby Bluetooth devices
            </Text>
          </View>
        </View>
      )}

      <FlatList
        data={devices}
        renderItem={({item}) => (
          <DeviceItem
            device={item}
            connect={connectToDevice}
            disconnect={disconnectDevice}
            // connectionState={deviceConnectionStates[item.id]}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 16}}
        className="flex-1"
      />
    </SafeAreaView>
  );
};

// import {StatusBar, useColorScheme, TouchableOpacity} from 'react-native';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import DeviceList from './DeviceList';
// import {styles} from './styles/styles';

// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   // render list of bluetooth devices
//   return (
//     <SafeAreaView style={[backgroundStyle, styles.container]}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <View style={{pdadingHorizontal: 20}}>
//         <Text
//           style={[
//             styles.title,
//             {color: isDarkMode ? Colors.white : Colors.black},
//           ]}>
//           React Native BLE Manager Tutorial
//         </Text>
//         <TouchableOpacity
//           activeOpacity={0.5}
//           style={styles.scanButton}
//           onPress={startScan}>
//           <Text style={styles.scanButtonText}>
//             {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
//           </Text>
//         </TouchableOpacity>
//         <Text
//           style={[
//             styles.subtitle,
//             {color: isDarkMode ? Colors.white : Colors.black},
//           ]}>
//           Discovered Devices:
//         </Text>
//         {discoveredDevices.length > 0 ? (
//           <FlatList
//             data={discoveredDevices}
//             renderItem={({item}) => (
//               <DeviceList
//                 peripheral={item}
//                 connect={connectToPeripheral}
//                 disconnect={disconnectFromPeripheral}
//               />
//             )}
//             keyExtractor={item => item.id}
//           />
//         ) : (
//           <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

export default App;
