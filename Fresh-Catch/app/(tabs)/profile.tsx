import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface Achievement {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  icon: string;
  color: string;
}

interface UserCatch {
  id: string;
  species: string;
  weight: number;
  length: number;
  location: string;
  created_at: string;
  nickname?: string;
}

export default function ProfileScreen() {
  const { user, signOut, loading, getUserCatches } = useAuth();
  const [userCatches, setUserCatches] = useState<UserCatch[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const catches = await getUserCatches();
      setUserCatches(catches);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/signin');
  };

  // Calculate user statistics
  const totalCatches = userCatches.length;
  const uniqueSpecies = new Set(userCatches.map(c => c.species)).size;
  const totalWeight = userCatches.reduce((sum, c) => sum + (c.weight || 0), 0);
  const averageWeight = totalCatches > 0 ? totalWeight / totalCatches : 0;
  const largestCatch = userCatches.reduce((max, c) => Math.max(max, c.weight || 0), 0);

  // Calculate week streak (simplified - you may want to implement a more complex calculation)
  const weekStreak = Math.min(3, Math.floor(totalCatches / 5)); // Example: 1 week streak per 5 catches

  // Generate achievements based on user data
  const achievements: Achievement[] = [
    ...(totalCatches >= 1 ? [{
      id: '1',
      title: 'First Catch!',
      description: 'Caught your first fish',
      timeAgo: userCatches[0] ? new Date(userCatches[0].created_at).toLocaleDateString() : '',
      icon: 'star.fill',
      color: '#4CAF50'
    }] : []),
    ...(weekStreak >= 1 ? [{
      id: '2',
      title: 'Week Warrior',
      description: `${weekStreak} week fishing streak!`,
      timeAgo: '1 day ago',
      icon: 'calendar',
      color: '#FF9800'
    }] : []),
    ...(uniqueSpecies >= 3 ? [{
      id: '3',
      title: 'Species Collector',
      description: `Unlocked ${uniqueSpecies} different fish species`,
      timeAgo: '3 days ago',
      icon: 'square.grid.2x2',
      color: '#9C27B0'
    }] : []),
    ...(largestCatch >= 10 ? [{
      id: '4',
      title: 'Big Fish Hunter',
      description: `Caught a ${largestCatch.toFixed(1)} lb fish!`,
      timeAgo: '2 days ago',
      icon: 'trophy',
      color: '#FFD700'
    }] : [])
  ];

  

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <IconSymbol name="person.fill" size={40} color="#fff" />
          </View>
          <Text style={styles.playerName}>{user?.name || user?.email || 'Angler'}</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol name="fish" size={24} color="#4A90E2" />
            <Text style={styles.statNumber}>{totalCatches}</Text>
            <Text style={styles.statLabel}>Total Catches</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="star" size={24} color="#FFD700" />
            <Text style={styles.statNumber}>{uniqueSpecies}</Text>
            <Text style={styles.statLabel}>Species Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="trophy" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>{weekStreak}</Text>
            <Text style={styles.statLabel}>Week Streak</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="location" size={24} color="#F44336" />
            <Text style={styles.statNumber}>{new Set(userCatches.map(c => c.location)).size}</Text>
            <Text style={styles.statLabel}>Fishing Spots</Text>
          </View>
        </View>

        {/* Fishing Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fishing Statistics</Text>
          <View style={styles.statsList}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Weight Caught</Text>
              <Text style={styles.statsValue}>{totalWeight.toFixed(1)} lbs</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Average Fish Weight</Text>
              <Text style={styles.statsValue}>{averageWeight.toFixed(1)} lbs</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Largest Catch</Text>
              <Text style={styles.statsValue}>{largestCatch.toFixed(1)} lbs</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Fish Caught</Text>
              <Text style={styles.statsValue}>{totalCatches}</Text>
            </View>
          </View>
        </View>

        {/* Recent Catches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Catches</Text>
          {userCatches.length === 0 ? (
            <View style={styles.emptyCatches}>
              <IconSymbol name="fish" size={48} color="#ccc" />
              <Text style={styles.emptyCatchesText}>No catches yet!</Text>
              <Text style={styles.emptyCatchesSubtext}>Start fishing to track your catches here.</Text>
            </View>
          ) : (
            userCatches.slice(0, 5).map((catch_item) => (
              <View key={catch_item.id} style={styles.catchCard}>
                <View style={styles.catchIcon}>
                  <IconSymbol name="fish" size={20} color="#4A90E2" />
                </View>
                <View style={styles.catchContent}>
                  <Text style={styles.catchSpecies}>{catch_item.nickname || catch_item.species}</Text>
                  <Text style={styles.catchDetails}>
                    {catch_item.weight?.toFixed(1)} lbs • {catch_item.length?.toFixed(1)}" • {catch_item.location}
                  </Text>
                  <Text style={styles.catchDate}>
                    {new Date(catch_item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.length === 0 ? (
            <View style={styles.emptyAchievements}>
              <IconSymbol name="trophy" size={48} color="#ccc" />
              <Text style={styles.emptyAchievementsText}>No achievements yet!</Text>
              <Text style={styles.emptyAchievementsSubtext}>Catch more fish to unlock achievements.</Text>
            </View>
          ) : (
            achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
                  <IconSymbol name={achievement.icon as any} size={20} color="#fff" />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  <Text style={styles.achievementTime}>{achievement.timeAgo}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    backgroundColor: '#4A90E2',
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementTime: {
    fontSize: 12,
    color: '#999',
  },
  signOutButton: {
    marginTop: 15,
    backgroundColor: '#ff3b30',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCatches: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyCatchesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyCatchesSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyAchievements: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyAchievementsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyAchievementsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  catchCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  catchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  catchContent: {
    flex: 1,
  },
  catchSpecies: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  catchDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  catchDate: {
    fontSize: 12,
    color: '#999',
  },
});