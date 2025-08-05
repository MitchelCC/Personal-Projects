
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface FishingSpot {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  productive: boolean;
  favorite: boolean;
}

export default function MapScreen() {
  const [fishingSpots, setFishingSpots] = useState<FishingSpot[]>([
    { id: '1', name: 'Hanauma Bay', coordinates: { x: 100, y: 150 }, productive: true, favorite: true },
    { id: '2', name: 'Diamond Head', coordinates: { x: 200, y: 200 }, productive: true, favorite: false },
    { id: '3', name: 'Kailua Beach', coordinates: { x: 300, y: 100 }, productive: false, favorite: true },
  ]);

  const handleAddSpot = () => {
    // In a real app, this would open a modal to add coordinates
    const newSpot: FishingSpot = {
      id: Date.now().toString(),
      name: `Spot ${fishingSpots.length + 1}`,
      coordinates: { x: Math.random() * 350, y: Math.random() * 250 },
      productive: false,
      favorite: false,
    };
    setFishingSpots([...fishingSpots, newSpot]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Fishing Spots</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddSpot}>
          <IconSymbol name="plus" size={16} color="#4A90E2" />
          <Text style={styles.addButtonText}>Add Spot</Text>
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <Image 
          source={require('@/assets/images/react-logo.png')} 
          style={styles.mapBackground}
          resizeMode="cover"
        />
        
        {/* Fishing Spot Markers */}
        {fishingSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={[
              styles.marker,
              {
                left: spot.coordinates.x,
                top: spot.coordinates.y,
                backgroundColor: spot.productive ? '#4CAF50' : '#FF6B6B'
              }
            ]}
          >
            <IconSymbol 
              name="location.fill" 
              size={20} 
              color="#fff" 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Total Spots</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Productive</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E3F2FD',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});
