import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import type { Screen, Tutorial } from '../src/types';

type Props = { goTo: (s: Screen) => void; tutorial?: Tutorial };

export default function TutorialDetail({ goTo, tutorial }: Props) {
  if (!tutorial) {
    return (
      <View style={styles.center}>
        <Text>Tutorial não encontrado</Text>
        <Button title="⬅️ Voltar" onPress={() => goTo('tutorials')} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tutorial.title}</Text>
      <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
        {tutorial.steps.map((s, i) => (
          <Text key={i} style={styles.step}>{i+1}. {s}</Text>
        ))}
      </ScrollView>
      <Button title="⬅️ Voltar" onPress={() => goTo('tutorials')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop:36 },
  center:{ flex:1, justifyContent:'center', alignItems:'center' },
  title:{ fontSize:20, fontWeight:'700', marginBottom:12 },
  step:{ fontSize:16, marginBottom:6 }
});
