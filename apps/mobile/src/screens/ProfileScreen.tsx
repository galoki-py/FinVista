import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    TextInput,
    Alert
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { 
    MapPin, 
    IndianRupee, 
    GraduationCap, 
    Target, 
    Plus, 
    Trash2, 
    ShieldCheck,
    TrendingUp,
    AlertCircle,
    LogOut
} from 'lucide-react-native';
import { Policy, VaultStatus } from '@finvista/types';

const ProfileScreen = () => {
    const { user, token, logout } = useAuthStore();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [vault, setVault] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewPolicy, setShowNewPolicy] = useState(false);
    const [newPolicy, setNewPolicy] = useState({ name: '', targetAmount: '10000', category: 'Savings' });

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

    const fetchData = useCallback(async () => {
        try {
            const [policyRes, vaultRes] = await Promise.all([
                axios.get(`${API_URL}/policies`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/policies/vault`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setPolicies(policyRes.data);
            setVault(vaultRes.data);
        } catch (err) {
            console.error('Failed to fetch profile data', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreatePolicy = async () => {
        if (!newPolicy.name) return Alert.alert('Error', 'Please enter a target name');
        try {
            await axios.post(`${API_URL}/policies`, {
                ...newPolicy,
                targetAmount: parseFloat(newPolicy.targetAmount)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowNewPolicy(false);
            setNewPolicy({ name: '', targetAmount: '10000', category: 'Savings' });
            fetchData();
        } catch (err) {
            console.error('Failed to create policy', err);
        }
    };

    const handleDeletePolicy = async (id: string) => {
        Alert.alert(
            'Delete Target',
            'Are you sure you want to delete this saving target?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/policies/${id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchData();
                        } catch (err) {
                            console.error('Failed to delete policy', err);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2ECC71" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.userName}>{user?.name}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badge, { backgroundColor: '#E8F8F5' }]}>
                            <Text style={[styles.badgeText, { color: '#27AE60' }]}>Rank: {user?.rank}</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#FDEDEC' }]}>
                            <Text style={[styles.badgeText, { color: '#E74C3C' }]}>Points: {user?.points}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Net Surplus Card */}
            <View style={styles.surplusCard}>
                <Text style={styles.surplusLabel}>Net Investable Surplus</Text>
                <Text style={styles.surplusValue}>₹{vault?.netBalance.toLocaleString()}</Text>
                <Text style={styles.surplusSub}>Available to fund your targets</Text>
            </View>

            {/* Foundation Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <ShieldCheck size={20} color="#2ECC71" />
                    <Text style={styles.cardTitle}>Profile Foundation</Text>
                </View>
                <View style={styles.foundationItem}>
                    <MapPin size={18} color="#BDC3C7" />
                    <View style={styles.foundationText}>
                        <Text style={styles.foundationLabel}>Location</Text>
                        <Text style={styles.foundationValue}>{user?.registrationStatus.location?.area}, {user?.registrationStatus.location?.city}</Text>
                    </View>
                </View>
                <View style={styles.foundationItem}>
                    <IndianRupee size={18} color="#BDC3C7" />
                    <View style={styles.foundationText}>
                        <Text style={styles.foundationLabel}>Monthly Earnings</Text>
                        <Text style={[styles.foundationValue, { color: '#2ECC71', fontSize: 18, fontWeight: '800' }]}>
                            ₹{user?.registrationStatus.monthlyEarnings?.toLocaleString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.foundationItem}>
                    <GraduationCap size={18} color="#BDC3C7" />
                    <View style={styles.foundationText}>
                        <Text style={styles.foundationLabel}>Knowledge Rating</Text>
                        <Text style={styles.foundationValue}>{user?.registrationStatus.financialKnowledgeRating}/5</Text>
                    </View>
                </View>
            </View>

            {/* Targets Section */}
            <View style={styles.card}>
                <View style={[styles.cardHeader, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Target size={20} color="#2ECC71" />
                        <Text style={styles.cardTitle}>Saving Targets</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowNewPolicy(!showNewPolicy)}>
                        <Plus size={20} color={showNewPolicy ? '#E74C3C' : '#2ECC71'} />
                    </TouchableOpacity>
                </View>

                {showNewPolicy && (
                    <View style={styles.newPolicyForm}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Target Name (e.g. New Phone)" 
                            value={newPolicy.name}
                            onChangeText={text => setNewPolicy({...newPolicy, name: text})}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Amount (₹)" 
                            value={newPolicy.targetAmount}
                            keyboardType="numeric"
                            onChangeText={text => setNewPolicy({...newPolicy, targetAmount: text})}
                        />
                        <TouchableOpacity style={styles.submitBtn} onPress={handleCreatePolicy}>
                            <Text style={styles.submitBtnText}>Establish Target</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {policies.length === 0 ? (
                    <View style={styles.emptyState}>
                        <AlertCircle size={30} color="#BDC3C7" />
                        <Text style={styles.emptyText}>No active saving targets</Text>
                    </View>
                ) : (
                    policies.map(policy => {
                        const progress = vault && vault.netBalance > 0 ? Math.min(1, vault.netBalance / policy.targetAmount) : 0;
                        return (
                            <View key={policy.id} style={styles.policyItem}>
                                <View style={styles.policyHeader}>
                                    <View style={styles.policyInfo}>
                                        <TrendingUp size={16} color="#2ECC71" />
                                        <View>
                                            <Text style={styles.policyName}>{policy.name}</Text>
                                            <Text style={styles.policyGoal}>Goal: ₹{policy.targetAmount.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity onPress={() => handleDeletePolicy(policy.id)}>
                                        <Trash2 size={16} color="#E74C3C" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.progressBar}>
                                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                                </View>
                                <View style={styles.policyFooter}>
                                    <Text style={styles.progressText}>{Math.round(progress * 100)}% coverage</Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <LogOut size={20} color="#E74C3C" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 25, paddingTop: 40, flexDirection: 'row', alignItems: 'center', gap: 20 },
    avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F2F8F5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white', elevation: 3 },
    avatarText: { fontSize: 28, fontWeight: '800', color: '#2ECC71' },
    userName: { fontSize: 22, fontWeight: '800', color: '#2C3E50' },
    userEmail: { fontSize: 13, color: '#7F8C8D', marginTop: 2 },
    badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 11, fontWeight: '700' },
    surplusCard: { backgroundColor: '#2ECC71', margin: 15, borderRadius: 20, padding: 20, elevation: 3 },
    surplusLabel: { color: 'white', fontSize: 12, opacity: 0.8, fontWeight: '600' },
    surplusValue: { color: 'white', fontSize: 28, fontWeight: '900', marginVertical: 5 },
    surplusSub: { color: 'white', fontSize: 11, opacity: 0.8 },
    card: { backgroundColor: 'white', margin: 15, borderRadius: 20, padding: 20, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    foundationItem: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
    foundationText: { flex: 1 },
    foundationLabel: { fontSize: 11, color: '#BDC3C7', fontWeight: '600' },
    foundationValue: { fontSize: 14, fontWeight: '700', color: '#2C3E50' },
    newPolicyForm: { backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, marginBottom: 20 },
    input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#D5DBDB', borderRadius: 10, padding: 12, marginBottom: 10 },
    submitBtn: { backgroundColor: '#2ECC71', padding: 12, borderRadius: 10, alignItems: 'center' },
    submitBtnText: { color: 'white', fontWeight: '800' },
    emptyState: { alignItems: 'center', padding: 20 },
    emptyText: { fontSize: 13, color: '#BDC3C7', marginTop: 5 },
    policyItem: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F2', paddingBottom: 15 },
    policyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    policyInfo: { flexDirection: 'row', gap: 10 },
    policyName: { fontSize: 15, fontWeight: '700', color: '#2C3E50' },
    policyGoal: { fontSize: 12, color: '#BDC3C7' },
    progressBar: { height: 6, backgroundColor: '#F8F9FA', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
    progressFill: { height: '100%', backgroundColor: '#2ECC71' },
    policyFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    progressText: { fontSize: 11, fontWeight: '700', color: '#2ECC71' },
    logoutBtn: { backgroundColor: 'white', margin: 15, padding: 15, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, elevation: 1 },
    logoutText: { color: '#E74C3C', fontWeight: '700', fontSize: 15 }
});

export default ProfileScreen;
