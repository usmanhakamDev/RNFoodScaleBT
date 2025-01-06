import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Device} from 'react-native-ble-plx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface ConnectedDeviceBarProps {
  device: Device;
  onDisconnect: () => void;
}

const ConnectedDeviceBar = ({
  device,
  onDisconnect,
}: ConnectedDeviceBarProps) => (
  <View className="bg-indigo-600 p-4">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Icon name="bluetooth-connect" size={24} color="#ffffff" />
        <View className="ml-3">
          <Text className="text-white text-sm">Connected to</Text>
          <Text className="text-white font-semibold">
            {device.name || device.localName || 'Unknown Device'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-indigo-500 rounded-full p-2"
        onPress={onDisconnect}>
        <Icon name="bluetooth-off" size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  </View>
);

export default ConnectedDeviceBar;
