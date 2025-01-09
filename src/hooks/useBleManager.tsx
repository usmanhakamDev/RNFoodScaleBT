import {useState, useEffect} from 'react';
import BleManager from 'react-native-ble-manager';
import {requestPermissions} from '../utils/permissions';

export const useBleManager = (setError: (error: string | null) => void) => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([]);

  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });

    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
    });

    let stopDiscoverListener = BleManager.onDiscoverPeripheral(
      (peripheral: any) => {
        if (peripheral.name) {
          peripherals.set(peripheral.id, peripheral);
          setDiscoveredDevices([...peripherals.values()]);
          console.log('onDiscoverPeripheral:', [...peripherals.values()]);
        }
      },
    );
    let stopConnectListener = BleManager.onConnectPeripheral(
      (peripheral: any) => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManager.onStopScan(() => {
      setIsScanning(false);
      console.log('scan stopped');
    });

    requestPermissions();

    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScan = async () => {
    if (!isScanning) {
      await BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
          setDiscoveredDevices([]);
        })
        .catch(error => {
          console.error(error);
          setError(error);
        });
    }
  };

  // pair with device first before connecting to it
  const connectToDevice = async (peripheral: any) => {
    const updatedDevices = discoveredDevices.map(device =>
      device.id === peripheral.id ? {...device, connectLoading: true} : device,
    );
    setDiscoveredDevices(updatedDevices);

    await BleManager.createBond(peripheral.id)
      .then(() => {
        const updatedDevices = discoveredDevices.map(device =>
          device.id === peripheral.id
            ? {...device, connected: true, connectLoading: false}
            : device,
        );
        setDiscoveredDevices(updatedDevices);
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
        const updatedDevices = discoveredDevices.map(device =>
          device.id === peripheral.id
            ? {...device, connectLoading: false}
            : device,
        );
        setDiscoveredDevices(updatedDevices);
        setError(
          `The device failed to connect with error ${JSON.stringify(
            peripheral,
          )}`,
        );
      });
  };

  // disconnect from device
  const disconnectDevice = async (peripheral: any) => {
    const updatedDevices = discoveredDevices.map(device =>
      device.id === peripheral.id ? {...device, connectLoading: true} : device,
    );
    setDiscoveredDevices(updatedDevices);

    await BleManager.removeBond(peripheral.id)
      .then(() => {
        const updatedDevices = discoveredDevices.map(device =>
          device.id === peripheral.id
            ? {...device, connected: false, connectLoading: false}
            : device,
        );
        setDiscoveredDevices(updatedDevices);
      })
      .catch(() => {
        console.log('fail to remove the bond');
        const updatedDevices = discoveredDevices.map(device =>
          device.id === peripheral.id
            ? {...device, connectLoading: false}
            : device,
        );
        setDiscoveredDevices(updatedDevices);
        setError('The device failed to remove the connection');
      });
  };

  return {
    isScanning,
    devices: discoveredDevices,
    startScan,
    connectToDevice,
    disconnectDevice,
  };
};
