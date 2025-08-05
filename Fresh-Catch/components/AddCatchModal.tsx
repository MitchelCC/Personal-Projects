import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AddCatchModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (catchData: any) => void;
}

export function AddCatchModal({ visible, onClose, onSave }: AddCatchModalProps) {
  const [fishName, setFishName] = useState('');
  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const hawaiianFish = [
    // 1-Star Fish
    'Flagtail (ʻĀholehole)',
    'Bigeye Scad (Akule)',
    'Striped Mullet (ʻAmaʻama)',
    'Milkfish (Awa)',
    'Unicornfish (Kala)',
    'Yellow-eyed Surgeonfish (Kole)',
    'Convict Tang (Manini)',
    'Anchovy (Nehu)',
    'Goatfish (Weke/ʻOama)',

    // 2-Star Fish
    'Goatfish (Kūmū)',
    'Bonefish (ʻŌ\'io)',
    'Mackerel Scad (ʻŌpelu)',
    'Goatfish Varieties (Moano/Munu)',
    'Hawaiian Grouper (Uku)',

    // 3-Star Fish
    'Papio/Ulua (10-20 lbs)',
    'Parrotfish (Uhu)',
    'Bigeye Fish (Aweoweo)',
    'Triggerfish (Humuhumu)',
    'Needlefish (Aha)',
    'Skipjack Tuna (Aku)',
    'Yellowfin Tuna (Ahi)',
    'Barracuda (Kaku)',
    'Wahoo (Kawakawa)',

    // 4-Star Fish
    'Large Ulua (20-50 lbs)',
    'Island Trevally',
    'Amberjack (Kahala)',
    'Mid-size Sharks',
    'Pink Snapper (ʻŌpakapaka)',
    'Red Snapper (Ehu)',
    'Brigham Young Snapper (Gindai)',
    'Von Siebold\'s Snapper (Kalekale)',
    'Gray Snapper (Lehi)',
    'Long-tail Snapper (Onaga)',
    'Sea Bass (Hāpūʻupuʻu)',

    // 5-Star Fish
    'Trophy GT Ulua (>80 lbs)',
    'Tiger Shark',
    'Hammerhead Shark',
    'Mako Shark',
    'Sailfish (A\'u lepe)',
    'Blue Marlin (A\'u)'
  ];

  const handleSave = () => {
    if (!fishName || !weight || !species) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Determine XP based on species (matching the star system)
    const getXPForSpecies = (species: string) => {
      if (species.includes('Flagtail') || species.includes('Akule') || species.includes('Mullet') || 
          species.includes('Milkfish') || species.includes('Unicornfish') || species.includes('Surgeonfish') ||
          species.includes('Tang') || species.includes('Anchovy') || species.includes('Goatfish')) {
        return 10; // 1-star
      } else if (species.includes('Kūmū') || species.includes('Bonefish') || species.includes('Mackerel') ||
                 species.includes('Moano') || species.includes('Munu') || species.includes('Uku')) {
        return Math.random() > 0.5 ? 20 : 25; // 2-star
      } else if (species.includes('Papio') || species.includes('Ulua') || species.includes('Parrotfish') ||
                 species.includes('Tuna') || species.includes('Barracuda') || species.includes('Wahoo')) {
        return Math.floor(Math.random() * 11) + 40; // 3-star (40-50)
      } else if (species.includes('Shark') || species.includes('Snapper') || species.includes('Sea Bass')) {
        return Math.floor(Math.random() * 11) + 80; // 4-star (80-90)
      } else if (species.includes('Tiger Shark') || species.includes('Marlin') || species.includes('Sailfish')) {
        return Math.floor(Math.random() * 51) + 150; // 5-star (150-200)
      }
      return 25; // Default
    };

    const catchData = {
      id: Date.now().toString(),
      name: fishName, // This is the user's nickname for the fish
      nickname: fishName,
      weight: `${weight} lbs`,
      length: length ? `${length} inches` : '',
      species,
      location: location || 'Unknown',
      photo: photo || require('@/assets/images/react-logo.png'), // fallback to placeholder
      date: new Date().toISOString(),
      dateCaught: new Date().toISOString().split('T')[0],
      xp: getXPForSpecies(species),
    };

    onSave(catchData);

    // Reset form
    setFishName('');
    setWeight('');
    setLength('');
    setSpecies('');
    setLocation('');
    setPhoto(null);

    onClose();
  };

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are needed to add photos of your catch.'
      );
      return false;
    }
    return true;
  };

  const showImagePicker = () => {
    Alert.alert(
      'Add Photo',
      'Choose how you want to add a photo of your catch:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickFromGallery }
      ]
    );
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Catch</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Photo Section */}
          <TouchableOpacity style={styles.photoSection} onPress={showImagePicker}>
            {photo ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity 
                  style={styles.changePhotoButton}
                  onPress={showImagePicker}
                >
                  <IconSymbol name="camera.fill" size={16} color="#fff" />
                  <Text style={styles.changePhotoText}>Change</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <IconSymbol name="camera.fill" size={40} color="#999" />
                <Text style={styles.photoText}>Add Photo</Text>
                <Text style={styles.photoSubtext}>Take a photo or choose from gallery</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Fish Name *</Text>
              <TextInput
                style={styles.input}
                value={fishName}
                onChangeText={setFishName}
                placeholder="Give your catch a name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Species *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.speciesContainer}>
                  {hawaiianFish.map((fish) => (
                    <TouchableOpacity
                      key={fish}
                      style={[
                        styles.speciesChip,
                        species === fish && styles.speciesChipSelected
                      ]}
                      onPress={() => setSpecies(fish)}
                    >
                      <Text style={[
                        styles.speciesText,
                        species === fish && styles.speciesTextSelected
                      ]}>
                        {fish}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Weight (lbs) *</Text>
                <TextInput
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="0.0"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Length (inches)</Text>
                <TextInput
                  style={styles.input}
                  value={length}
                  onChangeText={setLength}
                  placeholder="0.0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Where did you catch this fish?"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoSection: {
    marginBottom: 30,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  changePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  photoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  photoSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#bbb',
  },
  form: {
    gap: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  speciesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  speciesChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  speciesChipSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  speciesText: {
    fontSize: 14,
    color: '#666',
  },
  speciesTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});