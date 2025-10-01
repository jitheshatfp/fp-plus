import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

// API Configuration
const API_CONFIG = {
  baseUrl: 'https://fitservice.fitnesspassport.com.au',
  siteToken: '8A83EF5E-FE23-F5C3-E45415265FAC5310', // Replace with actual token
  deviceToken: 'D6BE6E64-AA1C-4712-BD0426C8E995A462', // Replace with actual token
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

  useEffect(() => {
    checkNfcSupport();
    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

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
    barcode: string,
    validateOnly: boolean = false
  ): Promise<MemberVisitResponse> => {
    const params = new URLSearchParams({
      siteToken: API_CONFIG.siteToken,
      deviceToken: API_CONFIG.deviceToken,
      barcode: barcode,
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
      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Read NFC tag
      const tag = await NfcManager.getTag();
      console.log('NFC Tag detected:', tag);

      // Extract barcode/member ID from NFC tag
      let barcode = '';

      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;
        
        // Convert payload to string (removing language code if present)
        try {
          barcode = Ndef.text.decodePayload(new Uint8Array(payload));
        } catch (e) {
          console.log('Failed to decode as text, trying raw payload');
          // Fallback: convert bytes to string
          barcode = String.fromCharCode.apply(null, Array.from(new Uint8Array(payload)));
        }
      } else if (tag?.id) {
        // Fallback: use tag ID as barcode
        barcode = Array.from(tag.id)
          .map((byte: number) => byte.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase();
      }

      if (!barcode) {
        throw new Error('Could not read barcode from NFC tag');
      }

      console.log('Barcode extracted:', barcode);

      // First validate the member can access
      const validationResult = await registerMemberVisit(barcode, true);

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
          'Member is not allowed to access this facility',
          [{ text: 'OK' }]
        );
        return;
      }

      // If validation successful, register the visit
      const checkInResult = await registerMemberVisit(barcode, false);

      if (checkInResult.CANACCESS && !checkInResult.ERROR) {
        const message = `Check-in successful!\nMember ID: ${barcode}\nStatus: ${checkInResult.STATUS}`;
        setLastCheckIn(message);
        Alert.alert('Success', message, [{ text: 'OK' }]);
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
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Passport</Text>
        <Text style={styles.subtitle}>NFC Check-in</Text>
      </View>

      <View style={styles.content}>
        {!isNfcSupported ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              NFC is not supported on this device
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                {isScanning
                  ? 'Hold your NFC pass near the device...'
                  : 'Tap the button below and hold your NFC pass near the device'}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.scanButton,
                isScanning && styles.scanButtonActive,
              ]}
              onPress={readNfcTag}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <Text style={styles.scanButtonText}>Start NFC Scan</Text>
              )}
            </TouchableOpacity>

            {lastCheckIn && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Last Check-in:</Text>
                <Text style={styles.resultText}>{lastCheckIn}</Text>
              </View>
            )}
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          NFC Status: {isNfcSupported ? '✓ Supported' : '✗ Not Supported'}
        </Text>
        <Text style={styles.footerTextSmall}>
          Platform: {Platform.OS} | Version: 1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0ea5e9',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  instructionContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#374151',
    lineHeight: 24,
  },
  scanButton: {
    backgroundColor: '#0ea5e9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  scanButtonActive: {
    backgroundColor: '#0284c7',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultContainer: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorText: {
    fontSize: 16,
    color: '#991b1b',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  footerTextSmall: {
    fontSize: 12,
    color: '#9ca3af',
  },
});