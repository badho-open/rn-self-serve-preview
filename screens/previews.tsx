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
        <ActivityIndicator size="large" color="#007AFF" />
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
          placeholderTextColor="#999"
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
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
  },
  resultCount: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PreviewsScreen;
