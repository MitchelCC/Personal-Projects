import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Fish {
  id: string;
  name: string;
  hawaiianName: string;
  caught: boolean;
  caughtCount: number;
  rarity: number;
  defaultImage?: any;
}

interface UserCatch {
  id: string;
  nickname: string;
  species: string;
  weight: string;
  length: string;
  location: string;
  dateCaught: string;
  rarity: number;
  userPhoto?: any; // This will be the user's uploaded photo
}

export default function CollectionScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState(0);
  const [activeTab, setActiveTab] = useState<'discovery' | 'yourfish'>('discovery');

  // User's caught fish with custom details
  const caughtFish: UserCatch[] = [
    {
      id: '1',
      nickname: 'Big Yellow',
      species: 'Yellowfin Tuna (Ahi)',
      weight: '14.2 lbs',
      length: '28 inches',
      location: 'Diamond Head, Oahu',
      dateCaught: '2024-01-15',
      rarity: 3,
      userPhoto: require('@/assets/images/react-logo.png') // User's uploaded photo
    },
    {
      id: '2',
      nickname: 'Splash',
      species: 'Parrotfish (Uhu)',
      weight: '3.1 lbs',
      length: '15 inches',
      location: 'Hanauma Bay, Oahu',
      dateCaught: '2024-01-14',
      rarity: 3,
      userPhoto: require('@/assets/images/react-logo.png') // User's uploaded photo
    },
    {
      id: '3',
      nickname: 'Lucky',
      species: 'Flagtail (ʻĀholehole)',
      weight: '1.8 lbs',
      length: '12 inches',
      location: 'Kailua Beach, Oahu',
      dateCaught: '2024-01-13',
      rarity: 1,
      userPhoto: require('@/assets/images/react-logo.png') // User's uploaded photo
    }
  ];

  const fishData: Fish[] = [
    // ⭐ 1-Star (Very Common, Shore Abundant) - 10 XP
    {
      id: '1',
      name: 'Flagtail',
      hawaiianName: 'ʻĀholehole',
      caught: true,
      caughtCount: 5,
      rarity: 1,
      defaultImage: require('@/assets/images/react-logo.png') // Will be replaced with set icon
    },
    {
      id: '2',
      name: 'Bigeye Scad',
      hawaiianName: 'Akule',
      caught: true,
      caughtCount: 8,
      rarity: 1,
      defaultImage: require('@/assets/images/react-logo.png') // Will be replaced with set icon
    },
    {
      id: '3',
      name: 'Striped Mullet',
      hawaiianName: 'ʻAmaʻama',
      caught: true,
      caughtCount: 3,
      rarity: 1,
      defaultImage: require('@/assets/images/react-logo.png') // Will be replaced with set icon
    },
    {
      id: '4',
      name: 'Milkfish',
      hawaiianName: 'Awa',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },
    {
      id: '5',
      name: 'Unicornfish',
      hawaiianName: 'Kala',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },
    {
      id: '6',
      name: 'Yellow-eyed Surgeonfish',
      hawaiianName: 'Kole',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },
    {
      id: '7',
      name: 'Convict Tang',
      hawaiianName: 'Manini',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },
    {
      id: '8',
      name: 'Anchovy',
      hawaiianName: 'Nehu',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },
    {
      id: '9',
      name: 'Goatfish',
      hawaiianName: 'Weke/ʻOama',
      caught: false,
      caughtCount: 0,
      rarity: 1,
    },

    // ⭐⭐ 2-Star (Common & Moderate) - 20-25 XP
    {
      id: '10',
      name: 'Goatfish',
      hawaiianName: 'Kūmū',
      caught: false,
      caughtCount: 0,
      rarity: 2,
    },
    {
      id: '11',
      name: 'Bonefish',
      hawaiianName: 'ʻŌ\'io',
      caught: false,
      caughtCount: 0,
      rarity: 2,
    },
    {
      id: '12',
      name: 'Mackerel Scad',
      hawaiianName: 'ʻŌpelu',
      caught: false,
      caughtCount: 0,
      rarity: 2,
    },
    {
      id: '13',
      name: 'Goatfish Varieties',
      hawaiianName: 'Moano/Munu',
      caught: false,
      caughtCount: 0,
      rarity: 2,
    },
    {
      id: '14',
      name: 'Hawaiian Grouper',
      hawaiianName: 'Uku',
      caught: false,
      caughtCount: 0,
      rarity: 2,
    },

    // ⭐⭐⭐ 3-Star (Stronger Fight, Mid-Rarity) - 40-50 XP
    {
      id: '15',
      name: 'Papio/Ulua (10-20 lbs)',
      hawaiianName: 'Papio/Ulua',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '16',
      name: 'Parrotfish',
      hawaiianName: 'Uhu',
      caught: true,
      caughtCount: 2,
      rarity: 3,
      defaultImage: require('@/assets/images/react-logo.png') // Will be replaced with set icon
    },
    {
      id: '17',
      name: 'Bigeye Fish',
      hawaiianName: 'Aweoweo',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '18',
      name: 'Triggerfish',
      hawaiianName: 'Humuhumu',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '19',
      name: 'Needlefish',
      hawaiianName: 'Aha',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '20',
      name: 'Skipjack Tuna',
      hawaiianName: 'Aku',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '21',
      name: 'Yellowfin Tuna',
      hawaiianName: 'Ahi',
      caught: true,
      caughtCount: 1,
      rarity: 3,
      defaultImage: require('@/assets/images/react-logo.png') // Will be replaced with set icon
    },
    {
      id: '22',
      name: 'Barracuda',
      hawaiianName: 'Kaku',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '23',
      name: 'Wahoo',
      hawaiianName: 'Kawakawa',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '41',
      name: 'Spiny Lobster',
      hawaiianName: 'Ula',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '42',
      name: 'Slipper Lobster',
      hawaiianName: 'Ula pāpapa',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '43',
      name: 'Kona Crab',
      hawaiianName: 'Kona crab',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '44',
      name: 'Eel',
      hawaiianName: 'Unagi',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },
    {
      id: '45',
      name: 'Octopus',
      hawaiianName: 'Tako',
      caught: false,
      caughtCount: 0,
      rarity: 3,
    },

    // ⭐⭐⭐⭐ 4-Star (Rare or Big-Fighters) - 80-90 XP
    {
      id: '24',
      name: 'Large Ulua (20-50 lbs)',
      hawaiianName: 'Large Ulua',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '25',
      name: 'Island Trevally',
      hawaiianName: 'Island Trevally',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '26',
      name: 'Amberjack',
      hawaiianName: 'Kahala',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '27',
      name: 'Mid-size Sharks',
      hawaiianName: 'Juvenile Tiger/Blacktip',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '28',
      name: 'Pink Snapper',
      hawaiianName: 'ʻŌpakapaka',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '29',
      name: 'Red Snapper',
      hawaiianName: 'Ehu',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '30',
      name: 'Brigham Young Snapper',
      hawaiianName: 'Gindai',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '31',
      name: 'Von Siebold\'s Snapper',
      hawaiianName: 'Kalekale',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '32',
      name: 'Gray Snapper',
      hawaiianName: 'Lehi',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '33',
      name: 'Long-tail Snapper',
      hawaiianName: 'Onaga',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },
    {
      id: '34',
      name: 'Sea Bass',
      hawaiianName: 'Hāpūʻupuʻu',
      caught: false,
      caughtCount: 0,
      rarity: 4,
    },

    // ⭐⭐⭐⭐⭐ 5-Star (Elite Rarity / Legendary Catch) - 150-200 XP
    {
      id: '35',
      name: 'Trophy GT Ulua (>80 lbs)',
      hawaiianName: 'Trophy GT Ulua',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    },
    {
      id: '36',
      name: 'Tiger Shark',
      hawaiianName: 'Tiger Shark',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    },
    {
      id: '37',
      name: 'Hammerhead Shark',
      hawaiianName: 'Hammerhead Shark',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    },
    {
      id: '38',
      name: 'Mako Shark',
      hawaiianName: 'Mako Shark',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    },
    {
      id: '39',
      name: 'Sailfish',
      hawaiianName: 'A\'u lepe',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    },
    {
      id: '40',
      name: 'Blue Marlin',
      hawaiianName: 'A\'u',
      caught: false,
      caughtCount: 0,
      rarity: 5,
    }
  ];

  const filteredFish = fishData.filter(fish => {
    const matchesSearch = fish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fish.hawaiianName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 0 || fish.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const renderStars = (rarity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconSymbol
        key={i}
        name={i < rarity ? "star.fill" : "star"}
        size={12}
        color={i < rarity ? "#FFD700" : "#DDD"}
      />
    ));
  };

  const getProgressByRarity = (rarity: number) => {
    const fishOfRarity = fishData.filter(f => f.rarity === rarity);
    const caughtOfRarity = fishOfRarity.filter(f => f.caught);
    return `${caughtOfRarity.length}/${fishOfRarity.length}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fish Collection</Text>
        {activeTab === 'discovery' ? (
          <>
            <Text style={styles.headerSubtitle}>Hawaiian Waters • {fishData.filter(f => f.caught).length}/{fishData.length} Discovered</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(fishData.filter(f => f.caught).length / fishData.length) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{((fishData.filter(f => f.caught).length / fishData.length) * 100).toFixed(1)}% Complete</Text>
          </>
        ) : (
          <Text style={styles.headerSubtitle}>Your Personal Collection • {caughtFish.length} Fish Caught</Text>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discovery' && styles.activeTab]}
          onPress={() => setActiveTab('discovery')}
        >
          <Text style={[styles.tabText, activeTab === 'discovery' && styles.activeTabText]}>Discovery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'yourfish' && styles.activeTab]}
          onPress={() => setActiveTab('yourfish')}
        >
          <Text style={[styles.tabText, activeTab === 'yourfish' && styles.activeTabText]}>Your Fish</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'discovery' ? (
        <>
          {/* Search and Filter Combined */}
          <View style={styles.searchAndFilterContainer}>
            <View style={styles.searchContainer}>
              <IconSymbol name="magnifyingglass" size={16} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search fish species..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterChip, selectedRarity === 0 && styles.filterChipActive]}
                onPress={() => setSelectedRarity(0)}
              >
                <Text style={[styles.filterText, selectedRarity === 0 && styles.filterTextActive]}>All</Text>
              </TouchableOpacity>
              {[1, 2, 3, 4, 5].map((rarity) => (
                <TouchableOpacity
                  key={rarity}
                  style={[styles.filterChip, selectedRarity === rarity && styles.filterChipActive]}
                  onPress={() => setSelectedRarity(rarity)}
                >
                  <View style={styles.filterStars}>
                    {renderStars(rarity)}
                  </View>
                  <Text style={styles.filterCount}>{getProgressByRarity(rarity)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Fish Grid */}
          <ScrollView style={styles.fishGrid}>
            <View style={styles.gridContainer}>
              {filteredFish.map((fish) => (
                <TouchableOpacity key={fish.id} style={styles.fishCard}>
                  {fish.caught ? (
                    <View style={styles.caughtFish}>
                      <Image source={fish.defaultImage} style={styles.fishImage} />
                      <View style={styles.checkmark}>
                        <IconSymbol name="checkmark" size={16} color="#fff" />
                      </View>
                      <Text style={styles.fishName}>{fish.name}</Text>
                      <Text style={styles.fishHawaiianName}>{fish.hawaiianName}</Text>
                      <Text style={styles.caughtText}>Caught {fish.caughtCount}x</Text>
                      <View style={styles.rarity}>
                        {renderStars(fish.rarity)}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.lockedFish}>
                      <View style={styles.lockIcon}>
                        <IconSymbol name="lock.fill" size={24} color="#999" />
                      </View>
                      <Text style={styles.lockedText}>???</Text>
                      <Text style={styles.lockedSubtext}>???</Text>
                      <Text style={styles.lockedLabel}>Locked</Text>
                      <View style={styles.rarity}>
                        {renderStars(fish.rarity)}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          {/* Your Fish Section */}
          <View style={styles.searchAndFilterContainer}>
            <View style={styles.searchContainer}>
              <IconSymbol name="magnifyingglass" size={16} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search your fish..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <ScrollView style={styles.fishGrid}>
            <View style={styles.yourFishContainer}>
              {caughtFish
                .filter(fish => 
                  fish.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  fish.species.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((fish) => (
                <TouchableOpacity key={fish.id} style={styles.yourFishCard}>
                  <Image source={fish.userPhoto} style={styles.yourFishImage} />
                  <View style={styles.yourFishDetails}>
                    <View style={styles.yourFishHeader}>
                      <Text style={styles.yourFishNickname}>{fish.nickname}</Text>
                      <View style={styles.yourFishRarity}>
                        {renderStars(fish.rarity)}
                      </View>
                    </View>
                    <Text style={styles.yourFishSpecies}>{fish.species}</Text>
                    <View style={styles.yourFishStats}>
                      <View style={styles.statItem}>
                        <IconSymbol name="scalemass" size={14} color="#666" />
                        <Text style={styles.statText}>{fish.weight}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <IconSymbol name="ruler" size={14} color="#666" />
                        <Text style={styles.statText}>{fish.length}</Text>
                      </View>
                    </View>
                    <View style={styles.yourFishLocation}>
                      <IconSymbol name="location" size={14} color="#4A90E2" />
                      <Text style={styles.locationText}>{fish.location}</Text>
                    </View>
                    <Text style={styles.dateText}>Caught on {new Date(fish.dateCaught).toLocaleDateString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  searchAndFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#4A90E2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterStars: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  filterCount: {
    fontSize: 12,
    color: '#666',
  },
  fishGrid: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fishCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  caughtFish: {
    alignItems: 'center',
  },
  fishImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fishName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  fishHawaiianName: {
    fontSize: 12,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 4,
  },
  caughtText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  lockedFish: {
    alignItems: 'center',
    opacity: 0.6,
  },
  lockIcon: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    textAlign: 'center',
    marginBottom: 2,
  },
  lockedSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 8,
  },
  rarity: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  yourFishContainer: {
    paddingHorizontal: 0,
  },
  yourFishCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  yourFishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  yourFishDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  yourFishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  yourFishNickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  yourFishRarity: {
    flexDirection: 'row',
  },
  yourFishSpecies: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 8,
  },
  yourFishStats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  yourFishLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#4A90E2',
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  
});