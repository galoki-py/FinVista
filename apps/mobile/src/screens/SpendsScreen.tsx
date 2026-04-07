import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { Sparkles, AlertCircle, Info, Zap, RefreshCcw, TrendingDown, TrendingUp, Wallet } from 'lucide-react-native';
import { SankeyData, Insight } from '@finvista/types';

const SpendsScreen = () => {
    const { token } = useAuthStore();
    const [data, setData] = useState<SankeyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [auditing, setAuditing] = useState(false);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

    const fetchSankey = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/sankey`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (err) {
            console.error('Failed to fetch Sankey data', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
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
            console.error('AI Audit failed', err);
            alert('Audit failed. Please try again.');
        } finally {
            setAuditing(false);
        }
    };

    useEffect(() => {
        fetchSankey();
    }, [fetchSankey]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchSankey();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2ECC71" />
                <Text style={styles.loadingText}>Calculating money flow...</Text>
            </View>
        );
    }

    const totalIncome = data?.links
        .filter(l => data.nodes[l.source].name === 'Income')
        .reduce((sum, l) => sum + l.value, 0) || 0;
    
    const totalExpenses = data?.links
        .filter(l => data.nodes[l.target].name !== 'Main Pool' && data.nodes[l.source].name === 'Main Pool')
        .reduce((sum, l) => sum + l.value, 0) || 0;

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2ECC71']} />}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Strategic Money Flow</Text>
                <Text style={styles.subtitle}>Insights into your intentional spending.</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { backgroundColor: '#E8F8F5' }]}>
                    <TrendingUp color="#2ECC71" size={20} />
                    <Text style={styles.summaryLabel}>Income</Text>
                    <Text style={[styles.summaryValue, { color: '#27AE60' }]}>₹{totalIncome}</Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: '#FDEDEC' }]}>
                    <TrendingDown color="#E74C3C" size={20} />
                    <Text style={styles.summaryLabel}>Spent</Text>
                    <Text style={[styles.summaryValue, { color: '#C0392B' }]}>₹{totalExpenses}</Text>
                </View>
            </View>

            {/* Main Visual Placeholder/Summary */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Wallet size={20} color="#2C3E50" />
                    <Text style={styles.cardTitle}>Current Status</Text>
                </View>
                {!data || data.nodes.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Info size={40} color="#BDC3C7" />
                        <Text style={styles.emptyText}>No Transaction Data Found</Text>
                        <Text style={styles.emptySubtext}>Log some spends to see your flow.</Text>
                    </View>
                ) : (
                    <View style={styles.flowList}>
                        {data.links.map((link, idx) => (
                            <View key={idx} style={styles.flowItem}>
                                <Text style={styles.nodeName}>{data.nodes[link.source].name}</Text>
                                <View style={styles.flowArrow}>
                                    <View style={styles.arrowLine} />
                                    <Text style={styles.flowValue}>₹{link.value}</Text>
                                </View>
                                <Text style={styles.nodeName}>{data.nodes[link.target].name}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Gemini Auditor */}
            <View style={[styles.card, styles.auditorCard]}>
                <View style={styles.auditorHeader}>
                    <View style={styles.auditorIconWrapper}>
                        <Sparkles size={24} color="#2ECC71" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.auditorTitle}>Gemini Fiscal Auditor</Text>
                        <Text style={styles.auditorSubtitle}>Instant analysis of your spending intent.</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[styles.auditButton, auditing && styles.disabledButton]}
                    onPress={triggerAudit}
                    disabled={auditing}
                >
                    {auditing ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <>
                            <Zap size={18} color="white" />
                            <Text style={styles.auditButtonText}>Trigger Gemini Audit</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Audit Results */}
            {insights.length > 0 && (
                <View style={styles.insightsSection}>
                    <Text style={styles.sectionTitle}>Audit Results</Text>
                    {insights.map((insight, idx) => (
                        <View key={idx} style={styles.insightCard}>
                            <Text style={styles.insightTitle}>{insight.title}</Text>
                            <Text style={styles.insightDesc}>{insight.description}</Text>
                            <View style={styles.recommendationBox}>
                                <AlertCircle size={16} color="#2ECC71" />
                                <Text style={styles.recommendationText}>Rec: {insight.recommendation}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            <View style={styles.footer}>
                <Info size={14} color="#BDC3C7" />
                <Text style={styles.footerText}>Insights based on your Active Saving Policies.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
    loadingText: { marginTop: 12, color: '#7F8C8D', fontWeight: '600' },
    header: { padding: 20, paddingTop: 30 },
    title: { fontSize: 24, fontWeight: '800', color: '#2C3E50' },
    subtitle: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
    summaryRow: { flexDirection: 'row', padding: 15, gap: 15 },
    summaryCard: { flex: 1, padding: 15, borderRadius: 16, alignItems: 'center' },
    summaryLabel: { fontSize: 12, color: '#7F8C8D', marginVertical: 4, fontWeight: '600' },
    summaryValue: { fontSize: 18, fontWeight: '800' },
    card: { backgroundColor: 'white', margin: 15, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    emptyState: { alignItems: 'center', padding: 30 },
    emptyText: { marginTop: 10, fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    emptySubtext: { fontSize: 13, color: '#BDC3C7', marginTop: 5 },
    flowList: { gap: 12 },
    flowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    nodeName: { fontSize: 13, fontWeight: '600', color: '#34495E', width: '30%' },
    flowArrow: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
    arrowLine: { height: 1, backgroundColor: '#D5DBDB', width: '100%' },
    flowValue: { fontSize: 11, color: '#7F8C8D', fontWeight: '700', position: 'absolute', top: -15 },
    auditorCard: { backgroundColor: '#F4FBF7', borderColor: '#D4EFDF', borderWidth: 1 },
    auditorHeader: { flexDirection: 'row', gap: 15, marginBottom: 20 },
    auditorIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 2 },
    auditorTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50' },
    auditorSubtitle: { fontSize: 12, color: '#7F8C8D' },
    auditButton: { backgroundColor: '#2ECC71', flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 },
    disabledButton: { opacity: 0.7 },
    auditButtonText: { color: 'white', fontWeight: '800', fontSize: 15 },
    insightsSection: { padding: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2C3E50', marginBottom: 15 },
    insightCard: { backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#2ECC71', elevation: 2 },
    insightTitle: { fontSize: 16, fontWeight: '800', color: '#2C3E50', marginBottom: 5 },
    insightDesc: { fontSize: 14, color: '#7F8C8D', lineHeight: 20, marginBottom: 15 },
    recommendationBox: { backgroundColor: '#F8F9FA', padding: 12, borderRadius: 8, flexDirection: 'row', gap: 10 },
    recommendationText: { flex: 1, fontSize: 13, color: '#27AE60', fontWeight: '700' },
    footer: { padding: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    footerText: { fontSize: 11, color: '#BDC3C7' }
});

export default SpendsScreen;
