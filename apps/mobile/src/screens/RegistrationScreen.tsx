import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { RegistrationData } from '@finvista/types';

const RegistrationScreen = () => {
  const { register } = useAuthStore();
  const [formData, setFormData] = useState<RegistrationData>({
    city: '',
    area: '',
    monthlyEarnings: 0,
    averageMonthlySpending: 0,
    savingPolicies: '',
    investmentTargets: 0,
    financialKnowledgeRating: 3
  });

  const handleSubmit = async () => {
    try {
      await register(formData);
    } catch (err) {
      Alert.alert('Registration Failed', 'Please check your inputs and try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Your profile</Text>
      <Text style={styles.subtitle}>Unlock your personal financial ecosystem</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Location (City & Area)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Area"
            value={formData.area}
            onChangeText={(text) => setFormData({ ...formData, area: text })}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Monthly Earnings (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 25000"
          keyboardType="numeric"
          value={formData.monthlyEarnings ? String(formData.monthlyEarnings) : ''}
          onChangeText={(text) => setFormData({ ...formData, monthlyEarnings: Number(text) })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Average Monthly Spending (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 15000"
          keyboardType="numeric"
          value={formData.averageMonthlySpending ? String(formData.averageMonthlySpending) : ''}
          onChangeText={(text) => setFormData({ ...formData, averageMonthlySpending: Number(text) })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current Saving Policies</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Cash-in-hand, FD"
          value={formData.savingPolicies}
          onChangeText={(text) => setFormData({ ...formData, savingPolicies: text })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Investment Target (Desired Amount ₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 100000"
          keyboardType="numeric"
          value={formData.investmentTargets ? String(formData.investmentTargets) : ''}
          onChangeText={(text) => setFormData({ ...formData, investmentTargets: Number(text) })}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Financial Knowledge (1-5)</Text>
        <TextInput
          style={styles.input}
          placeholder="Scale 1 to 5"
          keyboardType="numeric"
          value={String(formData.financialKnowledgeRating)}
          onChangeText={(text) => setFormData({ ...formData, financialKnowledgeRating: Math.min(5, Math.max(1, Number(text))) as any })}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Soft White
  },
  content: {
    padding: 30,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5DBDB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#2ECC71', // Mint-ish Green
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default RegistrationScreen;
