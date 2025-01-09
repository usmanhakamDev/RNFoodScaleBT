import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles/styles';

interface Peripheral {
  name: string;
  rssi: number;
  connected?: boolean;
}

const DeviceList = ({
  peripheral,
  connect,
  disconnect,
}: {
  peripheral: Peripheral;
  connect: (peripheral: Peripheral) => void;
  disconnect: (peripheral: Peripheral) => void;
}) => {
  const {name, rssi} = peripheral;
  return (
    <>
      {name && (
        <View style={styles.deviceContainer}>
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{name}</Text>
            <Text style={styles.deviceInfo}>RSSI: {rssi}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              peripheral?.connected
                ? disconnect(peripheral)
                : connect(peripheral)
            }
            style={styles.deviceButton}>
            <Text
              style={[
                styles.scanButtonText,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  fontWeight: 'bold',
                  fontSize: 16,
                },
              ]}>
              {peripheral?.connected ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default DeviceList;
