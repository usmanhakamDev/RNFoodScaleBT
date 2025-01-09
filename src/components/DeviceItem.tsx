import React from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DeviceItemProps {
  device: any;
  connectionState?: 'disconnected' | 'connecting' | 'connected' | 'pairing';
  connect: (device: any) => void;
  disconnect: (device: any) => void;
}

const DeviceItem = ({
  device,
  connect,
  disconnect,
}: // connectionState = 'disconnected',
DeviceItemProps) => {
  const signalStrength = Math.min(Math.max((device?.rssi + 100) / 40, 0), 1);
  const signalBars = Math.ceil(signalStrength * 4);

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden"
      onPress={() => (device?.connected ? disconnect(device) : connect(device))}
      // disabled={
      //   connectionState === 'connecting' || connectionState === 'pairing'
      // }
    >
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold text-gray-800">
            {device?.name || 'Unknown Device'}
          </Text>
          <View className="flex-row mr-3">
            {[...Array(4)].map((_, i) => (
              <Icon
                key={i}
                name="signal"
                size={14}
                color={i < signalBars ? '#6366f1' : '#d1d5db'}
                style={{marginRight: 2}}
              />
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">RSSI: {device.rssi} dBm</Text>
          <TouchableOpacity
            className="flex-row bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
            onPress={() =>
              device?.connected ? disconnect(device) : connect(device)
            }>
            {device?.connectLoading && (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                className="pr-1"
              />
            )}
            <Text className="text-white">
              {device?.connected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeviceItem;
