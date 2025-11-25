import React from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../theme';

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
            <LinearGradient
              colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
              style={[styles.progressBar, {width: `${progress}%`}]}
            />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.metrics.radii.xl,
    borderTopRightRadius: theme.metrics.radii.xl,
    padding: theme.metrics.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '40%',
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalTitle: {
    fontSize: theme.typography.fontSizes['3xl'],
    fontFamily: theme.typography.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.metrics.spacing.md,
  },
  modalText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.metrics.spacing.lg,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.metrics.spacing.md,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.text,
  },
});

export default ProgressModal;
