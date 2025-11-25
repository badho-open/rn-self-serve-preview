import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {theme} from '../../theme';

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Switch Deployment</Text>
          <Text style={styles.modalText}>
            Are you sure you want to switch to this deployment? The app will
            restart.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              activeOpacity={0.8}
              style={{flex: 1}}>
              <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={[styles.button, styles.confirmButton]}>
                <Text style={[styles.buttonText, styles.confirmButtonText]}>
                  Switch
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
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
    textAlign: 'center',
  },
  modalText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.metrics.spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.metrics.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.metrics.spacing.md,
    borderRadius: theme.metrics.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  confirmButton: {
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.bold,
  },
  cancelButtonText: {
    color: theme.colors.text,
  },
  confirmButtonText: {
    color: theme.colors.white,
  },
});

export default ConfirmationModal;
