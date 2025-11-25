import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';

interface ProgressModalProps {
  visible: boolean;
  progress: number;
}

const ProgressModal: React.FC<ProgressModalProps> = ({visible, progress}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Switching Preview</Text>
          <Text style={styles.modalText}>
            Downloading update... Please keep the app open.
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, {width: `${progress}%`}]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ProgressModal;
