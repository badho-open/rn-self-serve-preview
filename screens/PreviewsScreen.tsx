import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function PreviewsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previews</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default PreviewsScreen;
