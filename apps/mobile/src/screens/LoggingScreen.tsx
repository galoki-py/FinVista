import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Animated, Easing, ScrollView, Switch } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { Heart, Meh, Frown, Sparkles, AlertCircle, Info, ChevronDown } from 'lucide-react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const categories = [
  'Food & Chai',
  'Transport (Metro/Auto)',
  'Education & Copies',
  'Social & Hanging Out',
  'Personal Care',
  'Others'
];

const LoggingScreen = () => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Chai',
    description: '',
    reflection: '',
    emotion: 'Neutral' as 'Satisfied' | 'Neutral' | 'Regret',
    isEssential: false
  });
  const [isLogging, setIsLogging] = useState(false);
  const [progress] = useState(new Animated.Value(0));
  const [showReflection, setShowReflection] = useState(false);

  const handleIntentionalLog = () => {
    if (!formData.amount || isNaN(Number(formData.amount))) {
      Alert.alert('Invalid Amount', 'Please enter a valid numeric value.');
      return;
    }

    setIsLogging(true);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 400);

    setTimeout(async () => {
      clearInterval(interval);
      try {
        await axios.post(`${API_URL}/transactions`, {
          ...formData,
          amount: Number(formData.amount),
          type: 'expense'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Logged!', `Expense of ₹${formData.amount} saved intentionally.`);
        setFormData({
            amount: '',
            category: 'Food & Chai',
            description: '',
            reflection: '',
            emotion: 'Neutral',
            isEssential: false
        });
        setShowReflection(false);
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

  const emotions = [
    { id: 'Satisfied', icon: Heart, color: '#2ECC71' },
    { id: 'Neutral', icon: Meh, color: '#3498DB' },
    { id: 'Regret', icon: Frown, color: '#E74C3C' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log with Intent</Text>
      <Text style={styles.subtitle}>Pause. Breathe. Mindful Spending.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="0.00"
          keyboardType="numeric"
          value={formData.amount}
          onChangeText={(text) => setFormData({...formData, amount: text})}
          editable={!isLogging}
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryBtn,
                formData.category === cat && styles.categoryBtnActive
              ]}
              onPress={() => setFormData({...formData, category: cat})}
              disabled={isLogging}
            >
              <Text style={[
                styles.categoryText,
                formData.category === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
            style={styles.input}
            placeholder="What did you buy?"
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            editable={!isLogging}
        />

        <View style={styles.switchRow}>
            <View>
                <Text style={styles.switchLabel}>Essential Expense?</Text>
                <Text style={styles.switchSub}>Is this a "Need" vs "Want"?</Text>
            </View>
            <Switch 
                value={formData.isEssential}
                onValueChange={(val) => setFormData({...formData, isEssential: val})}
                trackColor={{ false: '#D5DBDB', true: '#2ECC71' }}
                disabled={isLogging}
            />
        </View>

        {!showReflection ? (
            <TouchableOpacity 
                style={styles.reflectBtn} 
                onPress={() => setShowReflection(true)}
                disabled={isLogging}
            >
                <Info color="#3498DB" size={16} />
                <Text style={styles.reflectBtnText}>Add Emotion & Reflection</Text>
            </TouchableOpacity>
        ) : (
            <View style={styles.reflectionArea}>
                <Text style={styles.label}>Post-Purchase Emotion</Text>
                <View style={styles.emotionGrid}>
                    {emotions.map((emo) => (
                        <TouchableOpacity
                            key={emo.id}
                            style={[
                                styles.emotionBtn,
                                formData.emotion === emo.id && { borderColor: emo.color, backgroundColor: `${emo.color}10` }
                            ]}
                            onPress={() => setFormData({...formData, emotion: emo.id as any})}
                            disabled={isLogging}
                        >
                            <emo.icon size={24} color={formData.emotion === emo.id ? emo.color : '#95A5A6'} />
                            <Text style={[styles.emotionText, formData.emotion === emo.id && { color: emo.color }]}>{emo.id}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Reflect: Why this spend?</Text>
                <TextInput
                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Did you really need it?"
                    multiline
                    value={formData.reflection}
                    onChangeText={(text) => setFormData({...formData, reflection: text})}
                    editable={!isLogging}
                />
            </View>
        )}

        <TouchableOpacity 
          style={styles.logBtn} 
          onPress={handleIntentionalLog}
          disabled={isLogging}
        >
          <Text style={styles.logBtnText}>Log with Intent</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />

      {isLogging && (
        <View style={styles.overlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.overlayTitle}>Weighting Intent...</Text>
            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.overlaySub}>This delay is intentional. Feel the spend.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D5DBDB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34495E',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2ECC71',
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F2F4F4',
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  categoryBtnActive: {
    backgroundColor: '#2ECC71',
    borderColor: '#2ECC71',
  },
  categoryText: {
    color: '#7F8C8D',
    fontWeight: '600',
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  input: {
      borderWidth: 1,
      borderColor: '#D5DBDB',
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
      backgroundColor: '#FDFEFE',
  },
  switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      padding: 12,
      backgroundColor: '#F8F9FA',
      borderRadius: 10,
  },
  switchLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: '#2C3E50',
  },
  switchSub: {
      fontSize: 11,
      color: '#7F8C8D',
  },
  reflectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#3498DB',
      marginBottom: 20,
  },
  reflectBtnText: {
      color: '#3498DB',
      fontWeight: '700',
  },
  reflectionArea: {
      marginBottom: 20,
      animation: 'fadeIn 0.3s ease',
  },
  emotionGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      gap: 10,
  },
  emotionBtn: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: '#D5DBDB',
      backgroundColor: '#FFFFFF',
  },
  emotionText: {
      fontSize: 10,
      fontWeight: '700',
      marginTop: 4,
      color: '#95A5A6',
  },
  logBtn: {
    backgroundColor: '#2C3E50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayCard: {
    width: '80%',
    alignItems: 'center',
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2ECC71',
    marginBottom: 20,
  },
  overlaySub: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 15,
    textAlign: 'center'
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#F2F4F4',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2ECC71',
  }
});

export default LoggingScreen;
