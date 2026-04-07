import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { BookOpen, ChevronRight, Landmark, PiggyBank, TrendingUp, ShieldCheck, Briefcase, Gem, Bitcoin, BarChart, Layers, Activity } from 'lucide-react-native';
import { LearningModule, LearningCategory } from '@finvista/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const categoryIcons: Record<LearningCategory, any> = {
  fd: Landmark,
  sip: PiggyBank,
  market: TrendingUp,
  security: ShieldCheck,
  chitfund: Briefcase,
  realestate: BookOpen,
  gold: Gem,
  crypto: Bitcoin,
  trading: BarChart,
  mutualfunds: Layers,
  etfs: Activity
};

const LearningScreen = () => {
  const { token } = useAuthStore();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_URL}/ai/learning`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(res.data);
    } catch (err) {
      console.error('Learning fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchModules();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (selectedModule) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setSelectedModule(null)}>
            <Text style={styles.backBtn}>← Back to Library</Text>
          </TouchableOpacity>
          <Text style={styles.detailTitle}>{selectedModule.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Tier {selectedModule.tier}</Text>
          </View>
        </View>
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{selectedModule.content}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Learning Hub</Text>
        <Text style={styles.subtitle}>Curated for Professionals & Students</Text>
      </View>

      <View style={styles.list}>
        {modules.map(module => {
          const Icon = categoryIcons[module.category] || BookOpen;
          return (
            <TouchableOpacity 
                key={module.id} 
                style={styles.moduleCard}
                onPress={() => setSelectedModule(module)}
            >
              <View style={styles.iconBox}>
                <Icon color="#2ECC71" size={24} />
              </View>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleMeta}>Tier {module.tier} • 5 min read</Text>
              </View>
              <ChevronRight color="#BDC3C7" size={20} />
            </TouchableOpacity>
          )
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  list: {
    padding: 20,
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E9F7EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
  },
  moduleMeta: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  detailHeader: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    color: '#2ECC71',
    fontWeight: '700',
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#EBF5FB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#3498DB',
    fontSize: 12,
    fontWeight: '800',
  },
  contentCard: {
    margin: 20,
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#34495E',
  }
});

export default LearningScreen;
