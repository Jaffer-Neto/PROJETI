import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Linking, FlatList, ActivityIndicator, Alert } from 'react-native';

// 👉 backend FastAPI na sua rede
const API = "http://192.168.0.136:8000";

// “duas telas” no mesmo arquivo (sem libs)
type Screen = 'home' | 'tutorials';

type Tutorial = { id: string; title: string; steps: string[]; updatedAt: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [status, setStatus] = useState('Aguardando...');
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Home actions
  const ligar = (n: string) => Linking.openURL(`tel:${n}`);

  async function testarAPI() {
    try {
      setStatus('Consultando /health...');
      const h = await fetch(`${API}/health`);
      setStatus(`/health -> ${h.status}`);
    } catch (e: any) {
      setStatus(`ERRO: ${e?.message || e}`);
    }
  }

  useEffect(() => { testarAPI(); }, []);

  // Carregar tutoriais quando entrar na tela “tutorials”
  useEffect(() => {
    if (screen !== 'tutorials') return;
    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const r = await fetch(`${API}/tutorials`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        setTutorials(json);
      } catch (e: any) {
        setErr(e?.message || 'Erro');
        Alert.alert('Erro', 'Não foi possível carregar os tutoriais.');
      } finally {
        setLoading(false);
      }
    })();
  }, [screen]);

  // Render simples de “duas telas”
  if (screen === 'tutorials') {
    return (
      <View style={styles.containerList}>
        <Text style={styles.titulo}>📚 Tutoriais</Text>
        {loading && <ActivityIndicator />}
        {err && <Text style={{ color: 'red', marginBottom: 8 }}>Erro: {err}</Text>}

        <FlatList
          contentContainerStyle={{ paddingVertical: 8, gap: 12 }}
          data={tutorials}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitulo}>{item.title}</Text>
              {item.steps.slice(0, 3).map((s, i) => (
                <Text key={i} style={styles.passo}>{i + 1}. {s}</Text>
              ))}
              <Text style={styles.meta}>Atualizado em {item.updatedAt}</Text>
            </View>
          )}
        />

        <View style={{ height: 12 }} />
        <Button title="⬅️ Voltar" onPress={() => setScreen('home')} />
      </View>
    );
  }

  // Tela Home
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🚨 Emergência</Text>

      <View style={styles.botoes}>
        <Button title="🚑 SAMU (192)" onPress={() => ligar('192')} />
        <Button title="🚒 Bombeiros (193)" onPress={() => ligar('193')} />
        <Button title="👮 Polícia (190)" onPress={() => ligar('190')} />
      </View>

      <Text style={{ marginTop: 16 }}>Status API: {status}</Text>

      <View style={{ marginTop: 24, width: 220 }}>
        <Button title="📚 Ver tutoriais" onPress={() => setScreen('tutorials')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Home
  container:{ flex:1, padding:16, justifyContent:'center', alignItems:'center' },
  titulo:{ fontSize:24, fontWeight:'bold', marginBottom:20 },
  botoes:{ gap:10, width:260 },
  // Lista
  containerList:{ flex:1, padding:16, paddingTop:48 },
  card:{ padding:12, borderRadius:8, borderWidth:1, borderColor:'#ddd', backgroundColor:'#fff', marginBottom:12 },
  itemTitulo:{ fontSize:16, fontWeight:'600', marginBottom:8 },
  passo:{ fontSize:14, marginBottom:4 },
  meta:{ fontSize:12, opacity:0.7, marginTop:8 },
});
