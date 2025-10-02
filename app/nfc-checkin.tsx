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
  
  // User session state
  const [userSession, setUserSession] = useState({
    deviceToken: '',
    memberBarcode: '26782701', // TODO: Get from your auth system
    memberName: 'Member Name',  // TODO: Get from your auth system
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
      memberBarcode: '26782701', // TODO: Replace with actual logged-in user
      memberName: 'Member Name',  // TODO: Replace with actual logged-in user
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
      siteToken: siteToken, // Read from NFC tag (facility location)
      deviceToken: userSession.deviceToken, // User's device identifier
      barcode: userSession.memberBarcode, // Logged-in member
      api: API_CONFIG.apiVersion,
      ...(validateOnly && { validateOnly: 'true' }),
    });

    const url = `${API_CONFIG.baseUrl}/memberVisit?${params.toString()}`;

    console.log('API Request URL:', url);

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

  const testApiCall = async (testSiteToken: string) => {
    try {
      Alert.alert('Testing', 'Testing API with demo site token...');
      
      // Test validation
      const validationResult = await registerMemberVisit(testSiteToken, true);
      
      if (validationResult.ERROR) {
        Alert.alert(
          'API Test - Access Denied',
          validationResult.ERRORMESSAGES.join('\n')
        );
        return;
      }

      if (!validationResult.CANACCESS) {
        Alert.alert(
          'API Test - Access Denied',
          'You are not allowed to access this facility'
        );
        return;
      }

      // If validation successful, register the visit
      const checkInResult = await registerMemberVisit(testSiteToken, false);

      if (checkInResult.CANACCESS && !checkInResult.ERROR) {
        const message = `API Test Success!\nSite Token: ${testSiteToken.substring(0, 20)}...\nStatus: ${checkInResult.STATUS}`;
        setLastCheckIn(message);
        Alert.alert('Success', message);
      }
    } catch (error: any) {
      Alert.alert('API Test Error', error.message);
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

      // Extract siteToken from NFC tag
      let siteToken = '';

      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;
        
        // Convert payload to string
        try {
          siteToken = Ndef.text.decodePayload(new Uint8Array(payload));
        } catch (e) {
          console.log('Failed to decode as text, trying raw payload');
          // Fallback: convert bytes to string
          const payloadArray = Array.from(new Uint8Array(payload));
          // Skip language code byte if present
          const startIndex = payloadArray[0] < 32 ? payloadArray[0] + 1 : 0;
          siteToken = String.fromCharCode.apply(null, payloadArray.slice(startIndex));
        }
      }

      // Clean up any whitespace
      siteToken = siteToken.trim();

      if (!siteToken) {
        throw new Error('Could not read site token from NFC tag');
      }

      console.log('Site token extracted:', siteToken);

      // First validate member can access this facility
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

      // If validation successful, register the visit
      const checkInResult = await registerMemberVisit(siteToken, false);

      if (checkInResult.CANACCESS && !checkInResult.ERROR) {
        const message = `Check-in successful!\nMember: ${userSession.memberName}\nStatus: ${checkInResult.STATUS}`;
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
        <Text style={styles.subtitle}>Facility Check-in</Text>
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
            <View style={styles.memberCard}>
              <Text style={styles.memberLabel}>Logged in as:</Text>
              <Text style={styles.memberName}>{userSession.memberName}</Text>
              <Text style={styles.memberId}>ID: {userSession.memberBarcode}</Text>
              <Text style={styles.deviceId}>
                Device: {userSession.deviceToken ? userSession.deviceToken.substring(0, 20) + '...' : 'Loading...'}
              </Text>
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                {isScanning
                  ? 'Hold your phone near the facility NFC tag...'
                  : 'Tap the button and scan the facility NFC tag to check in'}
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
                <Text style={styles.scanButtonText}>Scan Facility Tag</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testButton}
              onPress={() => testApiCall('8A83EF5E-FE23-F5C3-E45415265FAC5310')}
            >
              <Text style={styles.testButtonText}>Test API (Demo)</Text>
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
  memberCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  memberId: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 3,
  },
  deviceId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  instructionContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
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
  testButton: {
    backgroundColor: '#6b7280',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultContainer: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
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