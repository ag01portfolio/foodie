import React from 'react';
import { View, StyleSheet } from 'react-native';
import AbhiColours from '../abhi-colours';

interface SkeletonLoaderProps {
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonInfo}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonSubtitle2} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    padding: 16,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: AbhiColours.cardBackground,
    marginBottom: 16,
    borderRadius: 12,
    padding: 8,
    overflow: 'hidden',
  },
  skeletonImage: {
    width: 100,
    height: 100,
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
  },
  skeletonInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 18,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonSubtitle: {
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
    width: '50%',
  },
  skeletonSubtitle2: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    width: '40%',
  },
});

export default SkeletonLoader;
