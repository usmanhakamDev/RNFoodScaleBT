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
import ConnectedDeviceBar from './components/ConnectedDeviceBar';
import {useBleManager} from './hooks/useBleManager';
import {NativeWindStyleSheet} from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    isScanning,
    devices,
    connectedDevice,
    startScan,
    connectToDevice,
    disconnectDevice,
    deviceConnectionStates,
  } = useBleManager(setError);

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
            onPress={connectToDevice}
            connectionState={deviceConnectionStates[item.id]}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 16}}
        className="flex-1"
      />

      {connectedDevice && (
        <ConnectedDeviceBar
          device={connectedDevice}
          onDisconnect={disconnectDevice}
        />
      )}
    </SafeAreaView>
  );
};

export default App;
