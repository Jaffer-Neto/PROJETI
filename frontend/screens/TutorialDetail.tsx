// screens/TutorialDetail.tsx
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import type { Screen, Tutorial } from '../src/types';

type VictimProfile = 'adult' | 'child' | 'newborn';

// Permite (opcionalmente) campos específicos por perfil sem quebrar o tipo base
type TutorialWithProfiles = Tutorial & {
  stepsAdult?: string[];
  stepsChild?: string[];
  stepsNewborn?: string[];
};

type Props = {
  goTo: (s: Screen) => void;
  tutorial?: Tutorial;
  profile: VictimProfile;
};

export default function TutorialDetail({ goTo, tutorial, profile }: Props) {
  if (!tutorial) {
    return (
      <View style={styles.center}>
        <Text>Tutorial não encontrado</Text>
        <Button title="⬅️ Voltar" onPress={() => goTo('tutorials')} />
      </View>
    );
  }

  // Escolhe o subtítulo do perfil
  const perfilLabel =
    profile === 'child' ? 'Criança' : profile === 'newborn' ? 'Recém-Nascido' : 'Adulto';

  // Escolhe a lista de passos conforme o perfil (com fallback para steps)
  const t = tutorial as TutorialWithProfiles;
  const stepsByProfile =
    profile === 'child'
      ? (t.stepsChild ?? t.steps)
      : profile === 'newborn'
      ? (t.stepsNewborn ?? t.steps)
      : (t.stepsAdult ?? t.steps);

  const steps = Array.isArray(stepsByProfile) ? stepsByProfile : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{tutorial.title}</Text>
      <Text style={styles.subtitle}>Perfil: {perfilLabel}</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {steps.length > 0 ? (
          steps.map((s, i) => (
            <Text key={i} style={styles.step}>
              {i + 1}. {s}
            </Text>
          ))
        ) : (
          <Text style={styles.empty}>Nenhuma etapa disponível para este perfil.</Text>
        )}
      </ScrollView>

      <Button title="⬅️ Voltar" onPress={() => goTo('tutorials')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 36 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 16, fontWeight: '500', color: '#555', marginBottom: 12 },
  scroll: { paddingVertical: 12 },
  step: { fontSize: 16, marginBottom: 6, lineHeight: 22 },
  empty: { fontSize: 14, color: '#666' },
});
