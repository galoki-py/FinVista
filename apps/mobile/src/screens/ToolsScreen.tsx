import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Dimensions
} from 'react-native';
import {
    TrendingUp,
    Banknote,
    Flame,
    ArrowRightLeft,
    BarChart3,
    ChevronRight,
    X
} from 'lucide-react-native';
import * as finUtils from '../utils/finance-utils';

const { width } = Dimensions.get('window');

const ToolsScreen = () => {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    // Common state for inputs
    const [p, setP] = useState('5000');
    const [r, setR] = useState('12');
    const [n, setN] = useState('10');
    const [extra, setExtra] = useState('5000');
    const [inflation, setInflation] = useState('6');

    const toolCategories = [
        {
            name: 'Investment',
            icon: TrendingUp,
            color: '#2ECC71',
            tools: [
                { id: 'sip', name: 'SIP Calculator', description: 'Wealth building through monthly investments' },
                { id: 'lumpsum', name: 'Lumpsum Return', description: 'One-time investment return calculation' },
                { id: 'stepup', name: 'Step-Up SIP', description: 'Impact of annual SIP increments' }
            ]
        },
        {
            name: 'Loan',
            icon: Banknote,
            color: '#E74C3C',
            tools: [
                { id: 'emi', name: 'Standard EMI', description: 'For Home, Car, or Personal loans' },
                { id: 'prepayment', name: 'Loan Prepayment', description: 'Interest savings with extra payments' }
            ]
        },
        {
            name: 'Planning',
            icon: Flame,
            color: '#F39C12',
            tools: [
                { id: 'fire', name: 'FIRE Calculator', description: 'Corpus needed to retire early' },
                { id: 'inflation', name: 'Inflation Impact', description: 'Future value of today\'s money' }
            ]
        }
    ];

    const results = useMemo(() => {
        if (!selectedTool) return null;
        const P = parseFloat(p) || 0;
        const R = parseFloat(r) || 0;
        const N = parseFloat(n) || 0;
        const EXTRA = parseFloat(extra) || 0;
        const INF = parseFloat(inflation) || 0;

        switch (selectedTool) {
            case 'sip': return finUtils.calculateSIP(P, R, N);
            case 'lumpsum': return finUtils.calculateLumpsum(P, R, N);
            case 'stepup': return finUtils.calculateStepUpSIP(P, EXTRA, R, N);
            case 'emi': return finUtils.calculateEMI(P, R, N);
            case 'prepayment': return finUtils.calculatePrepaymentSavings(P, R, N, EXTRA);
            case 'fire': return finUtils.calculateFIRE(P, R || 4);
            case 'inflation': return finUtils.calculateInflation(P, INF, N);
            default: return null;
        }
    }, [selectedTool, p, r, n, extra, inflation]);

    const renderInput = (label: string, value: string, setter: (v: string) => void, placeholder: string) => (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={setter}
                keyboardType="numeric"
                placeholder={placeholder}
            />
        </View>
    );

    const renderCalculator = () => {
        const tool = toolCategories.flatMap(c => c.tools).find(t => t.id === selectedTool);
        if (!tool) return null;

        return (
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{tool.name}</Text>
                    <TouchableOpacity onPress={() => setSelectedTool(null)}>
                        <X color="#2C3E50" size={24} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.inputSection}>
                        {(selectedTool === 'sip' || selectedTool === 'lumpsum' || selectedTool === 'stepup' || selectedTool === 'emi' || selectedTool === 'prepayment' || selectedTool === 'inflation') &&
                            renderInput(selectedTool === 'emi' || selectedTool === 'prepayment' ? 'Principal Amount (₹)' : 'Investment Amount (₹)', p, setP, '5000')}

                        {(selectedTool !== 'fire' && selectedTool !== 'inflation') &&
                            renderInput('Interest Rate (%)', r, setR, '12')}

                        {(selectedTool !== 'fire') &&
                            renderInput('Time Period (Years)', n, setN, '10')}

                        {selectedTool === 'stepup' &&
                            renderInput('Annual Step-Up (%)', extra, setExtra, '10')}

                        {selectedTool === 'prepayment' &&
                            renderInput('Extra Monthly Payment (₹)', extra, setExtra, '5000')}

                        {selectedTool === 'fire' && (
                            <>
                                {renderInput('Monthly Expenses (₹)', p, setP, '50000')}
                                {renderInput('Safe Withdrawal Rate (%)', r, setR, '4')}
                            </>
                        )}

                        {selectedTool === 'inflation' &&
                            renderInput('Inflation Rate (%)', inflation, setInflation, '6')}
                    </View>

                    {results && (
                        <View style={styles.resultsCard}>
                            <View style={styles.resultsHeader}>
                                <BarChart3 size={18} color="#2ECC71" />
                                <Text style={styles.resultsTitle}>Projections</Text>
                            </View>

                            {(selectedTool === 'sip' || selectedTool === 'lumpsum' || selectedTool === 'stepup') && (
                                <>
                                    <View style={styles.mainResult}>
                                        <Text style={styles.resultLabel}>Maturity Value</Text>
                                        <Text style={styles.resultValueText}>₹{(results as any).maturityValue?.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.resultGrid}>
                                        <View>
                                            <Text style={styles.subLabel}>Invested</Text>
                                            <Text style={styles.subValue}>₹{(results as any).totalInvestment?.toLocaleString()}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.subLabel}>Returns</Text>
                                            <Text style={[styles.subValue, { color: '#2ECC71' }]}>₹{(results as any).estimatedReturns?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                </>
                            )}

                            {selectedTool === 'emi' && (
                                <>
                                    <View style={styles.mainResult}>
                                        <Text style={styles.resultLabel}>Monthly EMI</Text>
                                        <Text style={[styles.resultValueText, { color: '#E74C3C' }]}>₹{(results as any).emi?.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.resultGrid}>
                                        <View>
                                            <Text style={styles.subLabel}>Principal</Text>
                                            <Text style={styles.subValue}>₹{parseFloat(p).toLocaleString()}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.subLabel}>Total Interest</Text>
                                            <Text style={[styles.subValue, { color: '#E74C3C' }]}>₹{(results as any).totalInterest?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                </>
                            )}

                            {selectedTool === 'prepayment' && (
                                <>
                                    <View style={[styles.mainResult, { backgroundColor: '#EBF5FB', padding: 15, borderRadius: 12 }]}>
                                        <Text style={styles.resultLabel}>Interest Saved</Text>
                                        <Text style={styles.resultValueText}>₹{(results as any).interestSaved?.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.comparisonRow}>
                                        <View style={styles.compareItem}>
                                            <Text style={styles.subLabel}>Original</Text>
                                            <Text style={styles.subValue}>{(results as any).originalTenureMonths} Mo</Text>
                                        </View>
                                        <ArrowRightLeft size={16} color="#BDC3C7" />
                                        <View style={styles.compareItem}>
                                            <Text style={[styles.subLabel, { color: '#2ECC71' }]}>New</Text>
                                            <Text style={[styles.subValue, { fontWeight: '800' }]}>{(results as any).newTenureMonths} Mo</Text>
                                        </View>
                                    </View>
                                </>
                            )}

                            {selectedTool === 'fire' && (
                                <>
                                    <View style={styles.mainResult}>
                                        <Text style={styles.resultLabel}>Target FIRE Corpus</Text>
                                        <Text style={[styles.resultValueText, { color: '#F39C12' }]}>
                                            ₹{((results as any).targetCorpus / 10000000).toFixed(2)} Cr
                                        </Text>
                                        <Text style={[styles.subLabel, { marginTop: 5 }]}>₹{(results as any).targetCorpus?.toLocaleString()}</Text>
                                    </View>
                                </>
                            )}

                            {selectedTool === 'inflation' && (
                                <>
                                    <View style={styles.mainResult}>
                                        <Text style={styles.resultLabel}>Future Cost</Text>
                                        <Text style={styles.resultValueText}>₹{(results as any).futureValue?.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.warningBox}>
                                        <Text style={styles.warningText}>
                                            Today's ₹{parseFloat(p).toLocaleString()} will be worth ₹{(results as any).purchasingPower?.toLocaleString()} in {n} years.
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Precision Tools</Text>
                <Text style={styles.subtitle}>Calculators for daily micro-decisions.</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {toolCategories.map((cat, idx) => (
                    <View key={idx} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <cat.icon size={18} color={cat.color} />
                            <Text style={[styles.sectionTitle, { color: cat.color }]}>{cat.name.toUpperCase()}</Text>
                        </View>
                        {cat.tools.map((tool, tIdx) => (
                            <TouchableOpacity
                                key={tIdx}
                                style={styles.toolCard}
                                onPress={() => setSelectedTool(tool.id)}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.toolName}>{tool.name}</Text>
                                    <Text style={styles.toolDesc}>{tool.description}</Text>
                                </View>
                                <ChevronRight color="#BDC3C7" size={20} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={!!selectedTool}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedTool(null)}
            >
                <View style={styles.modalOverlay}>
                    {renderCalculator()}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 20, paddingTop: 30 },
    title: { fontSize: 24, fontWeight: '800', color: '#2C3E50' },
    subtitle: { fontSize: 14, color: '#7F8C8D', marginTop: 4 },
    scrollContent: { padding: 15 },
    section: { marginBottom: 25 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, marginLeft: 5 },
    sectionTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
    toolCard: { backgroundColor: 'white', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    toolName: { fontSize: 16, fontWeight: '700', color: '#2C3E50' },
    toolDesc: { fontSize: 12, color: '#7F8C8D', marginTop: 3 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(44, 62, 80, 0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, height: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: '#2C3E50' },
    inputSection: { marginBottom: 25 },
    inputGroup: { marginBottom: 15 },
    inputLabel: { fontSize: 14, color: '#2C3E50', fontWeight: '600', marginBottom: 8 },
    input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#D5DBDB', borderRadius: 10, padding: 12, fontSize: 16, color: '#2C3E50' },
    resultsCard: { backgroundColor: '#F2F8F5', padding: 20, borderRadius: 20, borderTopWidth: 5, borderTopColor: '#2ECC71' },
    resultsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
    resultsTitle: { fontSize: 14, fontWeight: '700', color: '#2ECC71', textTransform: 'uppercase' },
    mainResult: { alignItems: 'center', marginBottom: 20 },
    resultLabel: { fontSize: 12, color: '#7F8C8D', marginBottom: 5 },
    resultValueText: { fontSize: 32, fontWeight: '900', color: '#2ECC71' },
    resultGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    subLabel: { fontSize: 11, color: '#7F8C8D', marginBottom: 2, textAlign: 'center' },
    subValue: { fontSize: 14, fontWeight: '700', color: '#2C3E50', textAlign: 'center' },
    comparisonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 10 },
    compareItem: { alignItems: 'center' },
    warningBox: { backgroundColor: '#FDEDEC', padding: 12, borderRadius: 10, marginTop: 15 },
    warningText: { fontSize: 13, color: '#E74C3C', textAlign: 'center', lineHeight: 18 }
});

export default ToolsScreen;
