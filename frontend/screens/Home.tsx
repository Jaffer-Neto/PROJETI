import { View, Text, Button, StyleSheet, Linking } from 'react-native';
import type { Screen } from '../src/types';

export default function Home({ goTo }: { goTo: (s: Screen) => void }) {
  const ligar = (n: string) => Linking.openURL(`tel:${n}`);
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem Vindo!</Text>
      <Text style={styles.subtitle}>Como posso ajudar?</Text>

      <View style={styles.botoes}>
        <Button title="🚨Emergência agora🚨" onPress={() => ligar('193') } />
        <Button title="📚Treinamento📚" onPress={() => goTo('tutorials')} />
      </View>

    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding:16, justifyContent:'center', alignItems:'center' },
  titulo:{ fontSize:24, fontWeight:'bold', marginBottom:20 },
  subtitle:{fontSize: 24, fontWeight: 'bold', marginBottom:20},
  botoes:{ gap:10, width:260 }
});

