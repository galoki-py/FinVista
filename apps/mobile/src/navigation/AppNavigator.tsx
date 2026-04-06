import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoggingScreen from '../screens/LoggingScreen';
import VaultScreen from '../screens/VaultScreen';
import LearningScreen from '../screens/LearningScreen';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Compass, PieChart, ShieldCheck, BookOpen, User } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
    <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C3E50' }}>{name}</Text>
    <Text style={{ color: '#7F8C8D', marginTop: 10 }}>Coming in Phase 2</Text>
  </View>
);

const AuthScreen = () => {
    // Basic OAuth Login UI (Actual logic with expo-auth-session to be refined in Phase 1 final)
    const { setAuth } = useAuthStore();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 30 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#2ECC71', marginBottom: 10 }}>FinVista</Text>
            <Text style={{ fontSize: 16, color: '#7F8C8D', textAlign: 'center', marginBottom: 40 }}>
                Intelligent Financial Ecosystem for Undergraduates
            </Text>
            <TouchableOpacity 
                style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D5DBDB', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' }}
                onPress={() => setAuth({ 
                    id: 'mock_id', 
                    googleId: 'mock_google_id', 
                    email: 'user@example.com', 
                    name: 'Mock User',
                    registrationStatus: { isRegistered: false },
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, 'mock_token')}
            >
                <Text style={{ fontWeight: '600', color: '#2C3E50' }}>Sign in with Google (Mock)</Text>
            </TouchableOpacity>
        </View>
    )
}

const AppNavigator = () => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  if (user && !user.registrationStatus.isRegistered) {
    return <RegistrationScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconSize = 24;
            if (route.name === 'Logging') return <Compass color={color} size={iconSize} />;
            if (route.name === 'Spends') return <PieChart color={color} size={iconSize} />;
            if (route.name === 'Vault') return <ShieldCheck color={color} size={iconSize} />;
            if (route.name === 'Learning') return <BookOpen color={color} size={iconSize} />;
            if (route.name === 'Profile') return <User color={color} size={iconSize} />;
          },
          tabBarActiveTintColor: '#2ECC71',
          tabBarInactiveTintColor: '#7F8C8D',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#D5DBDB',
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#F8F9FA',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#D5DBDB',
          },
          headerTitleStyle: {
            fontWeight: '800',
            color: '#2C3E50',
          }
        })}
      >
        <Tab.Screen name="Logging" component={LoggingScreen} />
        <Tab.Screen name="Spends" component={() => <PlaceholderScreen name="Weekly Spends" />} />
        <Tab.Screen name="Vault" component={VaultScreen} />
        <Tab.Screen name="Learning" component={LearningScreen} />
        <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="Profile" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
