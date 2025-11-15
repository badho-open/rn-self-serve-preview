import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Deployment} from '../../utils/previews';
import {formatSize} from '../../utils/format';

interface PreviewCardProps {
  deployment: Deployment;
  isExpanded: boolean;
  onToggle: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  deployment,
  isExpanded,
  onToggle,
}) => {
  const hasPackage = !!deployment.package;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{deployment.name}</Text>
      </View>

      {hasPackage ? (
        <>
          <View style={styles.infoGrid}>
            {deployment.package?.appVersion && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>Version</Text>
                <Text style={styles.value}>
                  {deployment.package.appVersion}
                </Text>
              </View>
            )}

            {deployment.package?.label && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>Target Version</Text>
                <Text style={styles.value}>{deployment.package.label}</Text>
              </View>
            )}

            {deployment.package?.uploadTime && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>Date of Release</Text>
                <Text style={styles.value}>
                  {deployment.package.uploadTime}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.accordionHeader,
              isExpanded && styles.accordionHeaderExpanded,
            ]}
            onPress={onToggle}
            activeOpacity={0.7}>
            <Text style={styles.accordionHeaderText}>View Details</Text>
            <View style={styles.accordionIconContainer}>
              <Text style={styles.accordionIcon}>{isExpanded ? '▼' : '▶'}</Text>
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.accordionContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Size</Text>
                <Text style={styles.detailValue}>
                  {formatSize(deployment.package?.size)}
                </Text>
              </View>

              {deployment.package?.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>
                    {deployment.package.description}
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.noPackageContainer}>
          <Text style={styles.noPackageText}>No package available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#f5f5f5',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 0,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  noPackageContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  noPackageText: {
    fontSize: 14,
    color: '#8e8e93',
    fontStyle: 'italic',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginTop: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  accordionHeaderExpanded: {
    backgroundColor: '#f0f7ff',
    borderColor: '#007AFF',
  },
  accordionHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
    letterSpacing: -0.2,
  },
  accordionIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionIcon: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  accordionContent: {
    paddingTop: 16,
    paddingHorizontal: 4,
    gap: 16,
  },
  detailSection: {
    padding: 14,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 22,
  },
});

export default PreviewCard;
