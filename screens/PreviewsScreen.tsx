import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
} from 'react-native';
import api from '../utils/api';

interface DeploymentPackage {
  description: string;
  isDisabled: boolean;
  isMandatory: boolean;
  appVersion: string;
  size: number;
  uploadTime: string;
  label: string;
  releasedBy: string;
  packageHash: string;
}

interface Deployment {
  id: string;
  key: string;
  name: string;
  package?: DeploymentPackage;
  createdTime?: string;
}

interface DeploymentResponse {
  success: boolean;
  app: string;
  data: Deployment[];
}

function PreviewsScreen(): React.JSX.Element {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      setError(null);
      const platform = Platform.OS === 'ios' ? 'ios' : 'android';
      const response = await api.post<DeploymentResponse>('/deployments/list', {
        platform,
      });
      if (response.data.success) {
        setDeployments(response.data.data);
      } else {
        setError('Failed to fetch deployments');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to fetch deployments',
      );
      console.error('Error fetching deployments:', err);
    } finally {
      setLoading(false);
    }
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

  const formatSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

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

  const renderDeploymentCard = (deployment: Deployment) => {
    const isExpanded = expandedCards.has(deployment.id);
    const hasPackage = !!deployment.package;

    return (
      <View key={deployment.id} style={styles.card}>
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
              onPress={() => toggleAccordion(deployment.id)}
              activeOpacity={0.7}>
              <Text style={styles.accordionHeaderText}>View Details</Text>
              <View style={styles.accordionIconContainer}>
                <Text style={styles.accordionIcon}>
                  {isExpanded ? '▼' : '▶'}
                </Text>
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
        <Text style={styles.retryText} onPress={fetchDeployments}>
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
          filteredDeployments.map(renderDeploymentCard)
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
  cardId: {
    fontSize: 12,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 0,
  },
  cardSection: {
    marginBottom: 10,
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
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  badgeMandatory: {
    backgroundColor: '#FF3B30',
  },
  badgeOptional: {
    backgroundColor: '#34C759',
  },
  badgeDisabled: {
    backgroundColor: '#8E8E93',
  },
  badgeEnabled: {
    backgroundColor: '#007AFF',
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

export default PreviewsScreen;
