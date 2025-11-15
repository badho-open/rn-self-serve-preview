import api from '../api';

export interface DeploymentPackage {
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

export interface Deployment {
  id: string;
  key: string;
  name: string;
  package?: DeploymentPackage;
  createdTime?: string;
}

export interface DeploymentResponse {
  success: boolean;
  app: string;
  data: Deployment[];
}

export const fetchDeployments = async (
  platform: 'ios' | 'android',
): Promise<Deployment[]> => {
  try {
    const response = await api.post<DeploymentResponse>('/deployments/list', {
      platform,
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch deployments');
    }
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error || err.message || 'Failed to fetch deployments';
    console.error('Error fetching deployments:', err);
    throw new Error(errorMessage);
  }
};
