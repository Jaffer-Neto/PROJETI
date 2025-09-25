import { StyleSheet, Text, View, Button, Linking } from 'react-native';

export default function App() {
  const ligar = (num: string) => Linking.openURL(`tel:${num}`);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🚨 Emergência</Text>
      <Button title="🚑 SAMU (192)" onPress={() => ligar('192')} />
      <Button title="🚒 Bombeiros (193)" onPress={() => ligar('193')} />
      <Button title="👮 Polícia (190)" onPress={() => ligar('190')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
