import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { getOrCreateDeviceToken } from './utils/deviceToken';

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://fitservice.fitnesspassport.com.au',
  apiVersion: 'v2',
};

interface MemberVisitResponse {
  CANACCESS: boolean;
  STATUS: string;
  ERROR: boolean;
  ERRORMESSAGES: string[];
  SUSPENSIONS?: any[];
}

export default function NFCCheckIn() {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  
  const [userSession, setUserSession] = useState({
    deviceToken: '',
    memberBarcode: '26782701',
    memberName: 'Sarah Blaine',
  });

  useEffect(() => {
    checkNfcSupport();
    loadUserSession();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const loadUserSession = async () => {
    const deviceToken = await getOrCreateDeviceToken();
    setUserSession({
      deviceToken: deviceToken,
      memberBarcode: '26782701',
      memberName: 'Sarah Blaine',
    });
  };

  const checkNfcSupport = async () => {
    try {
      const supported = await NfcManager.isSupported();
      setIsNfcSupported(supported);
      if (supported) {
        await NfcManager.start();
      }
    } catch (error) {
      console.error('NFC initialization error:', error);
      setIsNfcSupported(false);
    }
  };

  const registerMemberVisit = async (
    siteToken: string,
    validateOnly: boolean = false
  ): Promise<MemberVisitResponse> => {
    const params = new URLSearchParams({
      siteToken: siteToken,
      deviceToken: userSession.deviceToken,
      barcode: userSession.memberBarcode,
      api: API_CONFIG.apiVersion,
      ...(validateOnly && { validateOnly: 'true' }),
    });

    const url = `${API_CONFIG.baseUrl}/memberVisit?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MemberVisitResponse = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  const readNfcTag = async () => {
    if (!isNfcSupported) {
      Alert.alert('Error', 'NFC is not supported on this device');
      return;
    }

    setIsScanning(true);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      let siteToken = '';

      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;
        
        try {
          siteToken = Ndef.text.decodePayload(new Uint8Array(payload));
        } catch (e) {
          const payloadArray = Array.from(new Uint8Array(payload));
          const startIndex = payloadArray[0] < 32 ? payloadArray[0] + 1 : 0;
          siteToken = String.fromCharCode.apply(null, payloadArray.slice(startIndex));
        }
      }

      siteToken = siteToken.trim();

      if (!siteToken) {
        throw new Error('Could not read site token from NFC tag');
      }

      const validationResult = await registerMemberVisit(siteToken, true);

      if (validationResult.ERROR) {
        Alert.alert(
          'Access Denied',
          validationResult.ERRORMESSAGES.join('\n'),
          [{ text: 'OK' }]
        );
        return;
      }

      if (!validationResult.CANACCESS) {
        Alert.alert(
          'Access Denied',
          'You are not allowed to access this facility',
          [{ text: 'OK' }]
        );
        return;
      }

      const checkInResult = await registerMemberVisit(siteToken, false);

      if (checkInResult.CANACCESS && !checkInResult.ERROR) {
        const message = `Check-in successful!\nMember: ${userSession.memberName}\nStatus: ${checkInResult.STATUS}`;
        setLastCheckIn(message);
        Alert.alert('✓ Checked In', message, [{ text: 'Done' }]);
      } else {
        Alert.alert(
          'Check-in Failed',
          checkInResult.ERRORMESSAGES.join('\n'),
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('NFC Reading Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to read NFC tag. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsScanning(false);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome,</Text>
          <Text style={styles.userName}>{userSession.memberName}</Text>
        </View>

        {!isNfcSupported ? (
          <View style={styles.card}>
            <View style={styles.errorState}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>
                NFC is not supported on this device
              </Text>
              <Text style={styles.errorSubtext}>
                Please use the barcode or QR code method to check in
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>📱</Text>
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={styles.cardTitle}>NFC Check-in</Text>
                  <Text style={styles.cardSubtitle}>
                    Quickly scan your NFC tag to check-in
                  </Text>
                </View>
              </View>

              {isScanning ? (
                <View style={styles.scanningContainer}>
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                    <ActivityIndicator size="large" color="#00BFA5" />
                  </View>
                  <Text style={styles.scanningText}>
                    Point your camera at the NFC tag to check-in
                  </Text>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsScanning(false);
                      NfcManager.cancelTechnologyRequest().catch(() => {});
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.scanButton}
                  onPress={readNfcTag}
                >
                  <Text style={styles.scanButtonText}>Tap to Scan NFC</Text>
                </TouchableOpacity>
              )}
            </View>

            {lastCheckIn && (
              <View style={styles.successCard}>
                <View style={styles.successIcon}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Checked in successfully!</Text>
                <Text style={styles.successSubtitle}>{lastCheckIn}</Text>
              </View>
            )}

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Member Details</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Primary Member ID:</Text>
                <Text style={styles.infoValue}>{userSession.memberBarcode}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member type:</Text>
                <Text style={styles.infoValue}>Adult</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Device ID:</Text>
                <Text style={styles.infoValueSmall}>
                  {userSession.deviceToken ? userSession.deviceToken.substring(0, 24) + '...' : 'Loading...'}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scanFrame: {
    width: 200,
    height: 200,
    backgroundColor: '#000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00BFA5',
    borderWidth: 3,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  scanningText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#00BFA5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00BFA5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoValueSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    maxWidth: 180,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  errorState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});