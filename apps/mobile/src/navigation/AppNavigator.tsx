import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';
import RegistrationScreen from '../screens/RegistrationScreen';
import LoggingScreen from '../screens/LoggingScreen';
import VaultScreen from '../screens/VaultScreen';
import LearningScreen from '../screens/LearningScreen';
import SpendsScreen from '../screens/SpendsScreen';
import ToolsScreen from '../screens/ToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Compass, PieChart, ShieldCheck, BookOpen, User as UserIcon, LogIn } from 'lucide-react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
    <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C3E50' }}>{name}</Text>
    <Text style={{ color: '#7F8C8D', marginTop: 10 }}>Coming in Phase 2</Text>
  </View>
);

const AuthScreen = () => {
    const { setAuth } = useAuthStore();
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri(),
    });

    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleLogin(id_token);
        }
    }, [response]);

    const handleGoogleLogin = async (idToken: string) => {
        setIsLoggingIn(true);
        try {
            const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await axios.post(`${API_URL}/auth/google`, { idToken });
            await setAuth(res.data.user, res.data.token);
        } catch (error) {
            console.error('Login failed:', error);
            alert('Authentication failed. Please check your network connection.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 30 }}>
            <View style={{ alignItems: 'center', marginBottom: 50 }}>
                <View style={{ backgroundColor: '#E8F8F5', padding: 20, borderRadius: 25, marginBottom: 20 }}>
                     <Compass color="#2ECC71" size={60} />
                </View>
                <Text style={{ fontSize: 36, fontWeight: '900', color: '#2C3E50', marginBottom: 8 }}>FinVista</Text>
                <Text style={{ fontSize: 16, color: '#7F8C8D', textAlign: 'center', lineHeight: 24 }}>
                    Intelligent Financial Ecosystem for Professionals
                </Text>
            </View>

            <TouchableOpacity 
                disabled={!request || isLoggingIn}
                style={{ 
                    backgroundColor: '#FFFFFF', 
                    flexDirection: 'row',
                    borderWidth: 1, 
                    borderColor: '#D5DBDB', 
                    padding: 16, 
                    borderRadius: 12, 
                    width: '100%', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 2,
                    opacity: (!request || isLoggingIn) ? 0.6 : 1
                }}
                onPress={() => promptAsync()}
            >
                {isLoggingIn ? (
                    <ActivityIndicator color="#2ECC71" style={{ marginRight: 12 }} />
                ) : (
                    <LogIn color="#2C3E50" size={20} style={{ marginRight: 12 }} />
                )}
                <Text style={{ fontWeight: '700', color: '#2C3E50', fontSize: 16 }}>
                    {isLoggingIn ? 'Authenticating...' : 'Sign in with Google'}
                </Text>
            </TouchableOpacity>

            <Text style={{ marginTop: 24, fontSize: 13, color: '#BDC3C7', textAlign: 'center' }}>
                Secure authentication handled by Google
            </Text>
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
            if (route.name === 'Spends') return <PieChart color={color} size={iconSize} />;
            if (route.name === 'Vault') return <ShieldCheck color={color} size={iconSize} />;
            if (route.name === 'Tools') return <Compass color={color} size={iconSize} />;
            if (route.name === 'Learning') return <BookOpen color={color} size={iconSize} />;
            if (route.name === 'Profile') return <UserIcon color={color} size={iconSize} />;
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
        <Tab.Screen name="Spends" component={SpendsScreen} />
        <Tab.Screen name="Vault" component={VaultScreen} />
        <Tab.Screen name="Tools" component={ToolsScreen} />
        <Tab.Screen name="Learning" component={LearningScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
