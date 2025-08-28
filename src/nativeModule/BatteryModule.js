import { NativeModules } from 'react-native';

const { BatteryModule } = NativeModules;

export async function getBatteryLevel() {
  try {
    const level = await BatteryModule.getBatteryLevel();
    console.log('Batarya Seviyesi:', level, '%');
    return level;
  } catch (e) {
    console.error('Batarya bilgisi alınamadı:', e);
  }
}
