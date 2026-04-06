import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { Plus, Target, TrendingUp, Wallet, Sparkles, AlertCircle } from 'lucide-react-native';
import { Policy, VaultStatus, Insight } from '@finvista/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const ProgressBar = ({ progress }: { progress: number }) => (
  <View style={styles.progressContainer}>
    <View style={[styles.progressFill, { width: `${Math.min(100, progress * 100)}%` }]} />
  </View>
);

const VaultScreen = () => {
  const { token } = useAuthStore();
  const [vault, setVault] = useState<VaultStatus | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [newPolicy, setNewPolicy] = useState({ name: '', targetAmount: '', category: 'Saving' });

  const fetchData = useCallback(async () => {
    try {
      const [vaultRes, policyRes] = await Promise.all([
        axios.get(`${API_URL}/policies/vault`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/policies`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setVault(vaultRes.data);
      setPolicies(policyRes.data);
    } catch (err) {
      console.error('Failed to fetch vault data', err);
    }
  }, [token]);

  const triggerAudit = async () => {
    setAuditing(true);
    try {
      const res = await axios.get(`${API_URL}/ai/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(res.data);
    } catch (err) {
      Alert.alert('Audit Failed', 'Gemini Auditor is currently resting.');
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleAddPolicy = async () => {
    if (!newPolicy.name || !newPolicy.targetAmount) return;
    try {
      await axios.post(`${API_URL}/policies`, {
        ...newPolicy,
        targetAmount: Number(newPolicy.targetAmount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalVisible(false);
      setNewPolicy({ name: '', targetAmount: '', category: 'Saving' });
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to create policy');
    }
  };

  return (
    <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>The Vault</Text>
        <Text style={styles.subtitle}>Liquidity & Strategic Targets</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroRow}>
          <Wallet color="#FFFFFF" size={24} />
          <Text style={styles.heroLabel}>Net Liquidity</Text>
        </View>
        <Text style={styles.heroAmount}>₹{vault?.netBalance.toLocaleString() || '0'}</Text>
        <View style={styles.statsRow}>
            <View>
                <Text style={styles.statLabel}>Total Income</Text>
                <Text style={styles.statValue}>₹{vault?.totalIncome.toLocaleString() || '0'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View>
                <Text style={styles.statLabel}>Total Expense</Text>
                <Text style={styles.statValue}>₹{vault?.totalExpense.toLocaleString() || '0'}</Text>
            </View>
        </View>
      </View>

      <View style={styles.auditorCard}>
        <View style={styles.auditorHeader}>
            <Sparkles color="#2ECC71" size={20} />
            <Text style={styles.auditorTitle}>Gemini Fiscal Auditor</Text>
        </View>
        <Text style={styles.auditorSubtitle}>Analyze spending patterns against your policies.</Text>
        <TouchableOpacity 
            style={[styles.auditBtn, auditing && { opacity: 0.7 }]} 
            onPress={triggerAudit}
            disabled={auditing}
        >
            <Text style={styles.auditBtnText}>{auditing ? 'Auditing...' : 'Trigger Gemini Audit'}</Text>
        </TouchableOpacity>

        {insights.length > 0 && (
            <View style={styles.insightList}>
                {insights.map((insight, idx) => (
                    <View key={idx} style={styles.insightItem}>
                        <View style={styles.insightHeader}>
                            <AlertCircle color="#2ECC71" size={16} />
                            <Text style={styles.insightTitle}>{insight.title}</Text>
                        </View>
                        <Text style={styles.insightDesc}>{insight.description}</Text>
                        <Text style={styles.insightRec}>Rec: {insight.recommendation}</Text>
                    </View>
                ))}
            </View>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saving Policies</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Plus color="#2ECC71" size={24} />
        </TouchableOpacity>
      </View>

      {policies.map((policy) => {
        const progress = vault && vault.netBalance > 0 ? Math.min(1, vault.netBalance / policy.targetAmount) : 0;
        return (
            <View key={policy.id} style={styles.policyCard}>
                <View style={styles.policyHeader}>
                    <View style={styles.policyIcon}>
                        <Target color="#3498DB" size={20} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.policyName}>{policy.name}</Text>
                        <Text style={styles.policyTarget}>Target: ₹{policy.targetAmount.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.policyPercent}>{Math.round(progress * 100)}%</Text>
                </View>
                <ProgressBar progress={progress} />
                <Text style={styles.policyCoverage}>
                    {vault && vault.netBalance >= policy.targetAmount 
                        ? 'Target fully covered by Vault' 
                        : `₹${(policy.targetAmount - (vault?.netBalance || 0)).toLocaleString()} remaining`}
                </Text>
            </View>
        )
      })}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Saving Policy</Text>
            <TextInput 
              style={styles.modalInput} 
              placeholder="Policy Name (e.g. New Laptop)" 
              value={newPolicy.name}
              onChangeText={text => setNewPolicy({...newPolicy, name: text})}
            />
            <TextInput 
              style={styles.modalInput} 
              placeholder="Target Amount (₹)" 
              keyboardType="numeric"
              value={newPolicy.targetAmount}
              onChangeText={text => setNewPolicy({...newPolicy, targetAmount: text})}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleAddPolicy}>
                <Text style={styles.confirmBtnText}>Create Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
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
  },
  heroCard: {
    backgroundColor: '#2ECC71',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    elevation: 0,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    fontSize: 14,
  },
  heroAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 16,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  policyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  policyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  policyTarget: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  policyPercent: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2ECC71',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#F2F4F4',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
  },
  policyCoverage: {
    fontSize: 11,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#D5DBDB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  cancelBtnText: {
    color: '#7F8C8D',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2ECC71',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  auditorCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E9F7EF',
  },
  auditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  auditorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2C3E50',
  },
  auditorSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 16,
    lineHeight: 18,
  },
  auditBtn: {
    backgroundColor: '#2ECC71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  auditBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  insightList: {
    marginTop: 20,
    gap: 12,
  },
  insightItem: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C3E50',
  },
  insightDesc: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  insightRec: {
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '700',
  }
});

export default VaultScreen;
