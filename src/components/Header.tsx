import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HeaderProps {
  isScanning: boolean;
  onScanPress: () => void;
}

const Header = ({isScanning, onScanPress}: HeaderProps) => (
  <View className="p-4 bg-white shadow-sm">
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-2xl font-bold text-gray-800">BLE Scanner</Text>
        <Text className="text-sm text-gray-500 mt-1">Find nearby devices</Text>
      </View>
      <TouchableOpacity
        className={`flex-row rounded-full  p-3 ${
          isScanning ? 'bg-indigo-100' : 'bg-indigo-600'
        }`}
        onPress={onScanPress}
        disabled={isScanning}>
        <Icon
          name="bluetooth"
          size={24}
          color={isScanning ? '#6366f1' : '#ffffff'}
        />
        <Text className={`${isScanning ? 'text-[6366f1]' : 'text-white'}`}>
          Scan
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default Header;
