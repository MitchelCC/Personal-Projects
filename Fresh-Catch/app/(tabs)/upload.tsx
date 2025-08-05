
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddCatchModal } from '@/components/AddCatchModal';
import { useFocusEffect } from '@react-navigation/native';

interface RecentCatch {
  id: string;
  name: string;
  species: string;
  weight: string;
  image: any;
}

export default function UploadScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  // Open modal when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleSave = (newCatch: RecentCatch) => {
    // Here you would typically save to your app's state or database
    Alert.alert('Success!', `Caught ${newCatch.name}! +${newCatch.xp} XP`);
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
    // Navigate back to the previous tab or home
    // This could be implemented with navigation if needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* This screen is essentially just a container for the modal */}
      </View>

      <AddCatchModal
        visible={modalVisible}
        onClose={handleClose}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
