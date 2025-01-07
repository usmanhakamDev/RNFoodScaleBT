import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DeviceItemProps {
  device: Device;
  onPress: (device: Device) => void;
  connectionState?: 'disconnected' | 'connecting' | 'connected' | 'pairing';
}

const DeviceItem = ({
  device,
  onPress,
  connectionState = 'disconnected',
}: DeviceItemProps) => {
  const signalStrength = Math.min(Math.max((device.rssi + 100) / 40, 0), 1);
  const signalBars = Math.ceil(signalStrength * 4);

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden"
      onPress={() => onPress(device)}
      disabled={
        connectionState === 'connecting' || connectionState === 'pairing'
      }>
      <View className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold text-gray-800">
            {device?.name || device?.localName || 'Unknown Device'}
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeviceItem;
