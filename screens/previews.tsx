import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import codePush from 'react-native-code-push';
import {fetchDeployments, Deployment} from '../utils/previews';
import {PreviewCard} from '../components/previews';
import ProgressModal from '../components/previews/progressModal';
import ConfirmationModal from '../components/previews/confirmationModal';
import {theme} from '../theme';

function PreviewsScreen(): React.JSX.Element {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [currentDeploymentKey, setCurrentDeploymentKey] = useState<
    string | null
  >(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedDeploymentKey, setSelectedDeploymentKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    handleFetchDeployments();
    handleFetchCurrentDeployment();
  }, []);

  const handleFetchCurrentDeployment = async () => {
    try {
      const update = await codePush.getUpdateMetadata();
      if (update) {
        setCurrentDeploymentKey(update.deploymentKey);
      }
    } catch (err) {
      console.error('Failed to get current deployment key', err);
    }
  };

  const handleFetchDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      const data = await fetchDeployments(platform);
      setDeployments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch deployments');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchDeployment = (deploymentKey: string) => {
    setSelectedDeploymentKey(deploymentKey);
    setShowConfirmation(true);
  };

  const onConfirmSwitch = () => {
    if (!selectedDeploymentKey) {
      return;
    }
    setShowConfirmation(false);
    setIsSwitching(true);
    setDownloadProgress(0);

    codePush.sync(
      {
        deploymentKey: selectedDeploymentKey,
        installMode: codePush.InstallMode.IMMEDIATE,
      },
      status => {
        if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
          setIsSwitching(false);
          // The restart is handled by CodePush's IMMEDIATE install mode.
        } else if (
          status === codePush.SyncStatus.UP_TO_DATE ||
          status === codePush.SyncStatus.UNKNOWN_ERROR
        ) {
          setIsSwitching(false);
        }
      },
      ({receivedBytes, totalBytes}) => {
        setDownloadProgress((receivedBytes / totalBytes) * 100);
      },
    );
  };

  const onCancelSwitch = () => {
    setShowConfirmation(false);
    setSelectedDeploymentKey(null);
  };

  const filteredDeployments = useMemo(() => {
    if (!searchQuery.trim()) {
      return deployments;
    }

    const query = searchQuery.toLowerCase();
    return deployments.filter(deployment => {
      // Search through all properties
      const searchableText = [
        deployment.id,
        deployment.key,
        deployment.name,
        deployment.package?.description,
        deployment.package?.appVersion,
        deployment.package?.label,
        deployment.package?.releasedBy,
        deployment.package?.packageHash,
        deployment.createdTime,
        deployment.package?.uploadTime,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [deployments, searchQuery]);

  const toggleAccordion = (deploymentId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deploymentId)) {
        newSet.delete(deploymentId);
      } else {
        newSet.add(deploymentId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading deployments...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={handleFetchDeployments}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search deployments..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.colors.placeholder}
        />
        {searchQuery.length > 0 && (
          <Text style={styles.resultCount}>
            {filteredDeployments.length} of {deployments.length} deployments
          </Text>
        )}
      </View>

      <ProgressModal visible={isSwitching} progress={downloadProgress} />
      <ConfirmationModal
        visible={showConfirmation}
        onConfirm={onConfirmSwitch}
        onCancel={onCancelSwitch}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {filteredDeployments.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No deployments found matching your search'
                : 'No deployments available'}
            </Text>
          </View>
        ) : (
          filteredDeployments.map(deployment => (
            <PreviewCard
              key={deployment.id}
              deployment={deployment}
              isExpanded={expandedCards.has(deployment.id)}
              onToggle={() => toggleAccordion(deployment.id)}
              currentDeploymentKey={currentDeploymentKey}
              onSwitchDeployment={handleSwitchDeployment}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.metrics.spacing.lg,
  },
  searchContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.metrics.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.metrics.radii.md,
    padding: theme.metrics.spacing.md,
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.text,
  },
  resultCount: {
    marginTop: theme.metrics.spacing.sm,
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.metrics.spacing.md,
  },
  loadingText: {
    marginTop: theme.metrics.spacing.md,
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.semiBold,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.metrics.spacing.md,
  },
  retryText: {
    fontSize: theme.typography.fontSizes.md,
    fontFamily: theme.typography.fonts.medium,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default PreviewsScreen;
