import {useState, useEffect} from 'react';
import {BleManager, Device} from 'react-native-ble-plx';
import {requestPermissions} from '../utils/permissions';
import {Alert, Platform} from 'react-native';

const bleManager = new BleManager();

const hasValidName = (device: Device): boolean => {
  return Boolean(device.name || device.localName);
};

export const useBleManager = (setError: (error: string | null) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [deviceConnectionStates, setDeviceConnectionStates] = useState<{
    [key: string]: 'disconnected' | 'connecting' | 'connected' | 'pairing';
  }>({});

  // Check if device is connected
  const checkDeviceConnection = async (device: Device) => {
    try {
      const isConnected = await device.isConnected();
      setDeviceConnectionStates(prev => ({
        ...prev,
        [device.id]: isConnected ? 'connected' : 'disconnected',
      }));
      return isConnected;
    } catch (error) {
      return false;
    }
  };

  const handlePairing = async (device: Device): Promise<boolean> => {
    return new Promise(resolve => {
      if (Platform.OS === 'ios') {
        // iOS handles pairing automatically
        resolve(true);
      } else {
        Alert.alert(
          'Pair Device',
          `Would you like to pair with ${
            device.name || device.localName || 'Unknown Device'
          }?`,
          [
            {
              text: 'Cancel',
              onPress: () => resolve(false),
              style: 'cancel',
            },
            {
              text: 'Pair',
              onPress: () => resolve(true),
            },
          ],
        );
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      bleManager.stopDeviceScan();
      setIsScanning(false);
      setError(null);

      // Check if already connected
      const isConnected = await checkDeviceConnection(device);
      if (isConnected) {
        setConnectedDevice(device);
        return;
      }

      // Show pairing prompt
      setDeviceConnectionStates(prev => ({
        ...prev,
        [device.id]: 'pairing',
      }));

      const shouldPair = await handlePairing(device);
      if (!shouldPair) {
        setDeviceConnectionStates(prev => ({
          ...prev,
          [device.id]: 'disconnected',
        }));
        return;
      }

      // Connect to device
      setDeviceConnectionStates(prev => ({
        ...prev,
        [device.id]: 'connecting',
      }));

      const connected = await bleManager.connectToDevice(device.id, {
        autoConnect: true,
      });
      // const connected = await device.connect();
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();
      setDeviceConnectionStates(prev => ({
        ...prev,
        [device.id]: 'connected',
      }));

      setConnectedDevice(discovered);
    } catch (error) {
      setDeviceConnectionStates(prev => ({
        ...prev,
        [device.id]: 'disconnected',
      }));
      setError(
        `Connection error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  useEffect(() => {
    return () => {
      bleManager.destroy();
    };
  }, []);

  const startScan = async () => {
    try {
      setError(null);
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        setError('Bluetooth permissions not granted');
        return;
      }

      setIsScanning(true);
      setDevices([]);

      bleManager.startDeviceScan(
        null,
        {allowDuplicates: false},
        (error, scannedDevice) => {
          if (error) {
            setError(`Scan error: ${error.message}`);
            setIsScanning(false);
            return;
          }

          if (scannedDevice && hasValidName(scannedDevice)) {
            setDevices(prevDevices => {
              if (!prevDevices.find(d => d.id === scannedDevice.id)) {
                return [...prevDevices, scannedDevice];
              }
              return prevDevices;
            });
          }
        },
      );

      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 15000);
    } catch (error) {
      setError(
        `Unexpected error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      setIsScanning(false);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        setError(null);
        await connectedDevice.cancelConnection();
        setDeviceConnectionStates(prev => ({
          ...prev,
          [connectedDevice.id]: 'disconnected',
        }));
        setConnectedDevice(null);
      } catch (error) {
        setError(
          `Disconnect error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  };

  return {
    isScanning,
    devices,
    connectedDevice,
    deviceConnectionStates,
    startScan,
    connectToDevice,
    disconnectDevice,
  };
};
