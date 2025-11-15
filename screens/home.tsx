import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

function HomeScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SELF SERVE PREVIEW DEMO APP</Text>
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
