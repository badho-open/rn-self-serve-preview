import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

export const metrics = {
  screenWidth: width,
  screenHeight: height,
  spacing,
  radii,
};
