import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Deployment} from '../../utils/previews';
import {formatSize} from '../../utils/format';
import {theme} from '../../theme';

interface PreviewCardProps {
  deployment: Deployment;
  isExpanded: boolean;
  onToggle: () => void;
  currentDeploymentKey: string | null;
  onSwitchDeployment: (deploymentKey: string) => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  deployment,
  isExpanded,
  onToggle,
  currentDeploymentKey,
  onSwitchDeployment,
}) => {
  const hasPackage = !!deployment.package;
  const isCurrentDeployment = deployment.key === currentDeploymentKey;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{deployment.name}</Text>
        {isCurrentDeployment && (
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        )}
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

          {!isCurrentDeployment && (
            <TouchableOpacity
              onPress={() => onSwitchDeployment(deployment.key)}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                style={styles.switchButton}>
                <Text style={styles.switchButtonText}>
                  Switch to this Preview
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.accordionHeader,
              isExpanded && styles.accordionHeaderExpanded,
            ]}
            onPress={onToggle}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.accordionHeaderText,
                isExpanded && styles.accordionHeaderTextExpanded,
              ]}>
              View Details
            </Text>
            <View
              style={[
                styles.accordionIconContainer,
                isExpanded && styles.accordionIconContainerExpanded,
              ]}>
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.metrics.radii.lg,
    padding: theme.metrics.spacing.lg,
    marginBottom: theme.metrics.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.metrics.spacing.lg,
    paddingBottom: theme.metrics.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontFamily: theme.typography.fonts.bold,
    color: theme.colors.text,
    letterSpacing: -0.3,
  },
  activeBadge: {
    backgroundColor: theme.colors.success,
    borderRadius: theme.metrics.radii.sm,
    paddingVertical: theme.metrics.spacing.xs,
    paddingHorizontal: theme.metrics.spacing.sm,
  },
  activeBadgeText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fonts.semiBold,
  },
  infoGrid: {
    gap: theme.metrics.spacing.md,
  },
  infoItem: {
    marginBottom: 0,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.metrics.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.semiBold,
    color: theme.colors.text,
    lineHeight: 22,
  },
  switchButton: {
    marginTop: theme.metrics.spacing.lg,
    borderRadius: theme.metrics.radii.md,
    paddingVertical: theme.metrics.spacing.md,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  switchButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.bold,
  },
  noPackageContainer: {
    padding: theme.metrics.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.metrics.radii.lg,
    alignItems: 'center',
  },
  noPackageText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fonts.regular,
    fontStyle: 'italic',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.metrics.spacing.md,
    paddingHorizontal: theme.metrics.spacing.md,
    marginTop: theme.metrics.spacing.lg,
    backgroundColor: theme.colors.card,
    borderRadius: theme.metrics.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  accordionHeaderExpanded: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  accordionHeaderText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.semiBold,
    color: theme.colors.primary,
    letterSpacing: -0.2,
  },
  accordionHeaderTextExpanded: {
    color: theme.colors.white,
  },
  accordionIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionIconContainerExpanded: {
    backgroundColor: theme.colors.white,
  },
  accordionIcon: {
    fontSize: 10,
    color: theme.colors.white,
    fontFamily: theme.typography.fonts.bold,
  },
  accordionContent: {
    paddingTop: theme.metrics.spacing.lg,
    paddingHorizontal: theme.metrics.spacing.xs,
    gap: theme.metrics.spacing.md,
  },
  detailSection: {
    padding: theme.metrics.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.metrics.radii.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  detailLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.metrics.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text,
    lineHeight: 22,
  },
});

export default PreviewCard;
