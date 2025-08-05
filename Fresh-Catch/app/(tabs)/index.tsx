import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, Dimensions, GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { AddCatchModal } from '@/components/AddCatchModal';

interface RecentCatch {
  id: string;
  name: string;
  species: string;
  weight: string;
  image: any;
}

interface Island {
  id: string;
  name: string;
  image: any;
}

interface CatchMarker {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  catchId: string;
  fishName: string;
  species: string;
  islandId: string; // Add island association
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedIsland, setSelectedIsland] = useState<Island>({
    id: 'oahu',
    name: 'Oahu',
    image: require('@/assets/images/oahu-map.jpg')
  });
  const [catchMarkers, setCatchMarkers] = useState<CatchMarker[]>([]);
  const [mapModalMode, setMapModalMode] = useState<'view' | 'add'>('view');

  // Fish data from collection to calculate discovered count (matches collection.tsx)
  const fishData = [
    // 1-Star fish
    { id: '1', caught: true },
    { id: '2', caught: true },
    { id: '3', caught: true },
    { id: '4', caught: false },
    { id: '5', caught: false },
    { id: '6', caught: false },
    { id: '7', caught: false },
    { id: '8', caught: false },
    { id: '9', caught: false },
    // 2-Star fish
    { id: '10', caught: false },
    { id: '11', caught: false },
    { id: '12', caught: false },
    { id: '13', caught: false },
    { id: '14', caught: false },
    // 3-Star fish
    { id: '15', caught: false },
    { id: '16', caught: true },
    { id: '17', caught: false },
    { id: '18', caught: false },
    { id: '19', caught: false },
    { id: '20', caught: false },
    { id: '21', caught: true },
    { id: '22', caught: false },
    { id: '23', caught: false },
    { id: '41', caught: false },
    { id: '42', caught: false },
    { id: '43', caught: false },
    { id: '44', caught: false },
    { id: '45', caught: false },
    // 4-Star fish
    { id: '24', caught: false },
    { id: '25', caught: false },
    { id: '26', caught: false },
    { id: '27', caught: false },
    { id: '28', caught: false },
    { id: '29', caught: false },
    { id: '30', caught: false },
    { id: '31', caught: false },
    { id: '32', caught: false },
    { id: '33', caught: false },
    { id: '34', caught: false },
    // 5-Star fish
    { id: '35', caught: false },
    { id: '36', caught: false },
    { id: '37', caught: false },
    { id: '38', caught: false },
    { id: '39', caught: false },
    { id: '40', caught: false }
  ];

  // Interactive map state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [lastPanX, setLastPanX] = useState(0);
  const [lastPanY, setLastPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const islands: Island[] = [
    { id: 'oahu', name: 'Oahu', image: require('@/assets/images/oahu-map.jpg') },
    { id: 'maui', name: 'Maui', image: require('@/assets/images/maui-map.webp') },
    { id: 'big-island', name: 'Big Island', image: require('@/assets/images/BI-map.jpg') },
    { id: 'kauai', name: 'Kauai', image: require('@/assets/images/kaui-map.webp') },
    { id: 'molokai', name: 'Molokai', image: require('@/assets/images/molo-map.webp') },
    { id: 'lanai', name: 'Lanai', image: require('@/assets/images/lanai-map.jpg') }
  ];

  const [catches, setCatches] = useState<RecentCatch[]>([
    {
      id: '1',
      name: 'Big Yellow',
      species: 'Yellowfin Tuna',
      weight: '14.2 lbs',
      image: require('@/assets/images/react-logo.png')
    },
    {
      id: '2',
      name: 'Rainbow',
      species: 'Mahi-mahi',
      weight: '21.0 lbs',
      image: require('@/assets/images/react-logo.png')
    },
    {
      id: '3',
      name: 'Splash',
      species: 'Parrotfish',
      weight: '3.1 lbs',
      image: require('@/assets/images/react-logo.png')
    }
  ]);

  // Function to get the biggest catch
  const getBiggestCatch = () => {
    if (catches.length === 0) return null;

    return catches.reduce((biggest, current) => {
      const currentWeight = parseFloat(current.weight.replace(' lbs', ''));
      const biggestWeight = parseFloat(biggest.weight.replace(' lbs', ''));
      return currentWeight > biggestWeight ? current : biggest;
    });
  };

  // Reset map transform when modal opens
  const resetMapTransform = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Pan and zoom functions
  const handlePanStart = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setLastPanX(pageX);
    setLastPanY(pageY);
    setIsPanning(false); // Don't set to true immediately
  };

  const handlePanMove = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    const deltaX = pageX - lastPanX;
    const deltaY = pageY - lastPanY;

    // Only start panning if there's significant movement
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      setIsPanning(true);
    }

    if (isPanning) {
      setTranslateX(prev => prev + deltaX);
      setTranslateY(prev => prev + deltaY);
    }

    setLastPanX(pageX);
    setLastPanY(pageY);
  };

  const handlePanEnd = () => {
    // Use a small delay to allow tap detection if no panning occurred
    setTimeout(() => {
      setIsPanning(false);
    }, 50);
  };

  // Zoom functions that zoom into the center of the visible area
  const zoomIn = () => {
    const newScale = Math.min(scale * 1.5, 3);
    const scaleFactor = newScale / scale;

    // Zoom into the center of the current view
    const centerX = screenWidth * 0.45; // Center of map container
    const centerY = screenHeight * 0.35;

    setTranslateX(prev => centerX - (centerX - prev) * scaleFactor);
    setTranslateY(prev => centerY - (centerY - prev) * scaleFactor);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale * 0.67, 0.5);
    const scaleFactor = newScale / scale;

    // Zoom out from the center of the current view
    const centerX = screenWidth * 0.45;
    const centerY = screenHeight * 0.35;

    setTranslateX(prev => centerX - (centerX - prev) * scaleFactor);
    setTranslateY(prev => centerY - (centerY - prev) * scaleFactor);
    setScale(newScale);
  };

  // Double tap to zoom function
  const handleDoubleTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;

    if (scale < 2) {
      // Zoom in to the tapped location
      const newScale = Math.min(scale * 2, 3);
      const scaleFactor = newScale / scale;

      setTranslateX(prev => locationX - (locationX - prev) * scaleFactor);
      setTranslateY(prev => locationY - (locationY - prev) * scaleFactor);
      setScale(newScale);
    } else {
      // Reset zoom
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    }
  };

  // Map style with transform
  const mapStyle = {
    transform: [
      { translateX },
      { translateY },
      { scale },
    ],
  };

  const biggestCatch = getBiggestCatch();

  // Calculate discovered count dynamically
  const discoveredCount = fishData.filter(fish => fish.caught).length;
  const totalFishCount = fishData.length;

  const handleMapPress = (event: any) => {
    // Only allow adding in add mode and if we're not panning
    if (mapModalMode !== 'add') return;

    // Extract event properties immediately before they're nullified
    const { locationX, locationY } = event.nativeEvent;

    // Small delay to ensure panning state is accurate
    setTimeout(() => {
      if (isPanning) return;

      // Get the actual map image dimensions in the modal
      const mapImageWidth = screenWidth * 0.9;
      const mapImageHeight = screenHeight * 0.7;

      // Convert screen coordinates to coordinates relative to the transformed map
      const mapRelativeX = (locationX - translateX) / scale;
      const mapRelativeY = (locationY - translateY) / scale;

      // Convert to percentages (0-100) of the map image
      const xPercent = (mapRelativeX / mapImageWidth) * 100;
      const yPercent = (mapRelativeY / mapImageHeight) * 100;

      // Ensure coordinates are within bounds
      const adjustedX = Math.max(0, Math.min(100, xPercent));
      const adjustedY = Math.max(0, Math.min(100, yPercent));

      Alert.alert(
        'Add Catch Location',
        'Select a fish from your recent catches to mark this location:',
        [
          { text: 'Cancel', style: 'cancel' },
          ...catches.slice(0, 3).map(catchItem => ({
            text: `${catchItem.name} (${catchItem.species})`,
            onPress: () => {
              const newMarker: CatchMarker = {
                id: Date.now().toString(),
                x: adjustedX,
                y: adjustedY,
                catchId: catchItem.id,
                fishName: catchItem.name,
                species: catchItem.species,
                islandId: selectedIsland.id // Associate with currently selected island
              };
              setCatchMarkers([...catchMarkers, newMarker]);
              setMapModalVisible(false);
              Alert.alert('Success!', `Added catch location for ${catchItem.name}!`);
            }
          }))
        ]
      );
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.greeting}>Aloha, Kai</Text>
              <Text style={styles.level}>Level 12 · 1250 XP</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.collectionText}>Discovered</Text>
            <Text style={styles.collectionCount}>{discoveredCount}/{totalFishCount}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="calendar" size={24} color="#4A90E2" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Fish Caught</Text>
            <Text style={styles.statPeriod}>Today</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="trophy" size={24} color="#F5A623" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Week Streak</Text>
            <Text style={styles.statPeriod}>Streak</Text>
          </View>
        </View>

        {/* Recent Catches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Catches</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catchesScroll}>
            {catches.map((catch_item) => (
              <View key={catch_item.id} style={styles.catchCard}>
                <View style={styles.catchImageContainer}>
                  <Image 
                    source={typeof catch_item.image === 'string' ? { uri: catch_item.image } : catch_item.image} 
                    style={styles.catchImage} 
                  />
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>XP</Text>
                  </View>
                </View>
                <Text style={styles.catchName}>{catch_item.name}</Text>
                <Text style={styles.catchSpecies}>{catch_item.species}</Text>
                <Text style={styles.catchWeight}>{catch_item.weight}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Freshly Caught! */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Freshly Caught!</Text>
            <TouchableOpacity 
              style={styles.addSpotButton}
              onPress={() => {
                setMapModalMode('add');
                setMapModalVisible(true);
                resetMapTransform();
              }}
            >
              <Text style={styles.addSpotText}>+ Add Catch</Text>
            </TouchableOpacity>
          </View>

          {/* Island Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.islandSelector}>
            {islands.map((island) => (
              <TouchableOpacity
                key={island.id}
                style={[
                  styles.islandChip,
                  selectedIsland.id === island.id && styles.islandChipSelected
                ]}
                onPress={() => setSelectedIsland(island)}
              >
                <Text style={[
                  styles.islandText,
                  selectedIsland.id === island.id && styles.islandTextSelected
                ]}>
                  {island.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.fishingSpotsContainer}>
            <TouchableOpacity 
              style={styles.mapContainer} 
              onPress={() => {
                setMapModalMode('view');
                setMapModalVisible(true);
                resetMapTransform();
              }}
              activeOpacity={0.8}
            >
              <Image 
                source={selectedIsland.image} 
                style={styles.mapBackground}
                resizeMode="cover"
              />

              {/* Catch Markers */}
              {catchMarkers
                .filter(marker => marker.islandId === selectedIsland.id)
                .map((marker) => {
                  // Use percentage positioning for the preview map
                  return (
                    <View 
                      key={marker.id} 
                      style={[
                        styles.catchMarker, 
                        { 
                          left: `${marker.x}%`, 
                          top: `${marker.y}%`,
                          transform: [{ translateX: -16 }, { translateY: -16 }] // Center the marker
                        }
                      ]}
                    >
                      <IconSymbol name="fish.fill" size={16} color="#fff" />
                    </View>
                  );
                })}
            </TouchableOpacity>

            {/* Stats Row */}
            <View style={styles.spotsStatsContainer}>
              <View style={styles.spotStat}>
                {biggestCatch ? (
                  <>
                    <Image 
                      source={typeof biggestCatch.image === 'string' ? { uri: biggestCatch.image } : biggestCatch.image} 
                      style={styles.biggestCatchImage} 
                    />
                    <Text style={styles.spotStatNumber}>{biggestCatch.weight}</Text>
                    <Text style={styles.spotStatLabel}>Biggest Catch</Text>
                  </>
                ) : (
                  <>
                    <IconSymbol name="fish.fill" size={20} color="#4A90E2" />
                    <Text style={styles.spotStatNumber}>-</Text>
                    <Text style={styles.spotStatLabel}>Biggest Catch</Text>
                  </>
                )}
              </View>
              <View style={styles.spotStat}>
                <Text style={[styles.spotStatNumber, { color: '#4CAF50' }]}>3</Text>
                <Text style={styles.spotStatLabel}>Total Catches</Text>
              </View>
              <View style={styles.spotStat}>
                <Text style={[styles.spotStatNumber, { color: '#FF9800' }]}>3</Text>
                <Text style={styles.spotStatLabel}>Week Streak</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <IconSymbol name="camera.fill" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Catch Modal */}
      <AddCatchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={(newCatch) => {
          // Transform the catch data to match the expected interface
          const formattedCatch = {
            id: newCatch.id,
            name: newCatch.name,
            species: newCatch.species,
            weight: newCatch.weight,
            image: newCatch.photo,
          };
          setCatches([formattedCatch, ...catches]);
          Alert.alert('Success!', `Caught ${newCatch.name}! +${newCatch.xp} XP`);
        }}
      />

      {/* Full Screen Interactive Map Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.fullMapContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setMapModalVisible(false)}
            >
              <IconSymbol name="xmark" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Interactive Map */}
            <View style={styles.interactiveMapContainer}>
              <View 
                style={styles.mapImageContainer}
                onTouchStart={handlePanStart}
                onTouchMove={handlePanMove}
                onTouchEnd={handlePanEnd}
              >
                <TouchableOpacity
                  style={styles.mapTouchArea}
                  onPress={handleMapPress}
                  onLongPress={handleDoubleTap}
                  activeOpacity={1}
                >
                  <View style={[mapStyle]}>
                    <Image 
                      source={selectedIsland.image} 
                      style={styles.fullMapImage}
                      resizeMode="contain"
                    />

                    {/* Catch Markers on Interactive Map */}
                    {catchMarkers
                      .filter(marker => marker.islandId === selectedIsland.id)
                      .map((marker) => {
                        // Use percentage positioning for the full-screen map
                        return (
                      <TouchableOpacity
                        key={marker.id}
                        style={[
                          styles.fullMapCatchMarker, 
                          { 
                            left: `${marker.x}%`, 
                            top: `${marker.y}%`,
                            transform: [{ translateX: -20 }, { translateY: -20 }] // Center the marker
                          }
                        ]}
                        onPress={() => {
                          if (!isPanning) {
                            Alert.alert(
                              'Catch Location',
                              `${marker.fishName} (${marker.species}) was caught here!`,
                              [
                                { text: 'OK' },
                                { 
                                  text: 'Remove', 
                                  style: 'destructive',
                                  onPress: () => {
                                    setCatchMarkers(catchMarkers.filter(m => m.id !== marker.id));
                                  }
                                }
                              ]
                            );
                          }
                        }}
                      >
                        <IconSymbol name="fish.fill" size={20} color="#fff" />
                      </TouchableOpacity>
                        );
                      })}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Map Controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={zoomIn}
              >
                <IconSymbol name="plus" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={zoomOut}
              >
                <IconSymbol name="minus" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={resetMapTransform}
              >
                <IconSymbol name="arrow.clockwise" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.mapTitle}>{selectedIsland.name}</Text>
            <Text style={styles.mapInstructions}>
              {mapModalMode === 'add' 
                ? 'Pan to move around. Use zoom controls or long press to zoom. Tap to add catch location' 
                : 'Pan to move around. Use zoom controls or long press to zoom. View your catch locations'
              }
            </Text>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#4A90E2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  level: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  collectionText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  collectionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statPeriod: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#4A90E2',
  },
  catchesScroll: {
    marginHorizontal: -10,
  },
  catchCard: {
    width: 120,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  catchImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  catchImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  xpBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  xpText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  catchName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  catchSpecies: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  catchWeight: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addSpotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSpotText: {
    fontSize: 14,
    color: '#4A90E2',
    marginLeft: 4,
  },
  fishingSpotsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapContainer: {
    height: 280,
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
  },
  catchMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spotsStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  spotStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  biggestCatchImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  spotStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  spotStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  islandSelector: {
    marginBottom: 15,
    marginHorizontal: -10,
  },
  islandChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  islandChipSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  islandText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  islandTextSelected: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullMapContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  interactiveMapContainer: {
    width: '90%',
    height: '70%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gestureContainer: {
    flex: 1,
  },
  fullMapImage: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  mapImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapTouchArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  mapTitle: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  mapInstructions: {
    position: 'absolute',
    bottom: 70,
    left: 20,
    right: 20,
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fullMapCatchMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -60,
    flexDirection: 'column',
    gap: 10,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});