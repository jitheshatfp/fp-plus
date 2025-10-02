import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_TOKEN_KEY = '@device_token';

export async function getOrCreateDeviceToken(): Promise<string> {
  const existingToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
  
  if (existingToken) {
    return existingToken;
  }
  
  const newToken = uuidv4();
  await AsyncStorage.setItem(DEVICE_TOKEN_KEY, newToken);
  
  return newToken;
}