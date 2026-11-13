import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface DeleteConfirmModalProps {
  visible: boolean;
  title: string;
  itemName: string;
  itemSubtitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  title,
  itemName,
  itemSubtitle,
  onCancel,
  onConfirm,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: theme.dangerLight,
                borderColor: theme.dangerBorder,
              },
            ]}
          >
            <Text style={styles.iconText}>⚠️</Text>
          </View>

          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.warningMessage, { color: theme.textSecondary }]}>
            Are you sure you want to permanently delete this record? This action cannot be undone.
          </Text>

          <View
            style={[
              styles.itemBox,
              {
                backgroundColor: theme.surfaceMuted,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.itemName, { color: theme.textPrimary }]} numberOfLines={1}>
              {itemName}
            </Text>
            {itemSubtitle && (
              <Text style={[styles.itemSub, { color: theme.textMuted }]} numberOfLines={1}>
                {itemSubtitle}
              </Text>
            )}
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.cancelBtn,
                {
                  backgroundColor: theme.surfaceMuted,
                  borderColor: theme.border,
                },
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.deleteBtn,
                { backgroundColor: theme.danger },
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.deleteText}>Delete Record</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  warningMessage: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  itemBox: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 18,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '700',
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  btnPressed: {
    opacity: 0.8,
  },
});
