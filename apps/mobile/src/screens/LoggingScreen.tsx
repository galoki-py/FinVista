import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const LoggingScreen = () => {
  const { token } = useAuthStore();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [isLogging, setIsLogging] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  const categories = ['Food', 'Travel', 'Education', 'Entertainment', 'Health', 'General'];

  const handleIntentionalLog = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric value.');
      return;
    }

    setIsLogging(true);
    progress.setValue(0);

    // 2-second Reflection Delay
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Rhythmic Haptic Pulse
    const interval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 400);

    setTimeout(async () => {
      clearInterval(interval);
      try {
        await axios.post(`${API_URL}/transactions`, {
          amount: Number(amount),
          category,
          type: 'expense'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Logged!', `Expense of ₹${amount} saved intentionally.`);
        setAmount('');
      } catch (err) {
        Alert.alert('Error', 'Failed to log transaction.');
      } finally {
        setIsLogging(false);
      }
    }, 2000);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Intentional Logging</Text>
      <Text style={styles.subtitle}>Pause. Breathe. Log Your Spend.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          editable={!isLogging}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                category === cat && styles.categoryBtnActive
              ]}
              onPress={() => setCategory(cat)}
              disabled={isLogging}
            >
              <Text style={[
                styles.categoryText,
                category === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logBtn} 
          onPress={handleIntentionalLog}
          disabled={isLogging}
        >
          <Text style={styles.logBtnText}>Log Intentionally</Text>
        </TouchableOpacity>
      </View>

      {isLogging && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Weighting Transaction...</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.overlaySub}>This delay is intentional. Feel the spend.</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2ECC71',
    marginBottom: 24,
    textAlign: 'center',
    padding: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  categoryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EBF5FB',
    borderWidth: 1,
    borderColor: '#D4E6F1',
  },
  categoryBtnActive: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  categoryText: {
    color: '#3498DB',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  logBtn: {
    backgroundColor: '#2C3E50',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  logBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E9F7EF', // Solid Mint
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayCard: {
    width: '80%',
    textAlign: 'center',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#27AE60',
    marginBottom: 20,
  },
  overlaySub: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 10,
    textAlign: 'center'
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ECC71',
  }
});

export default LoggingScreen;
