import { useEffect, useState } from 'react';
// Importamos TouchableOpacity para criar botões customizados com feedback visual
import { StyleSheet, Text, View, Button, Linking, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

// 👉 backend FastAPI na sua rede
const API = "http://192.168.0.66:8000";

// “duas telas” no mesmo arquivo (sem libs)
type Screen = 'home' | 'tutorials';

type Tutorial = { id: string; title: string; steps: string[]; updatedAt: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  // Ajustando a tipagem do status para garantir que ele seja string
  const [status, setStatus] = useState<string>('Aguardando...');
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
    } catch (e) {
      // Tratamento seguro de erro (melhor prática em TypeScript)
      const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido';
      setStatus(`ERRO: ${errorMessage}`);
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
      } catch (e) {
        // Tratamento seguro de erro
        const errorMessage = e instanceof Error ? e.message : 'Erro de rede';
        setErr(errorMessage);
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
        <Text style={styles.tituloList}>📚 Tutoriais</Text>
        {loading && <ActivityIndicator size="large" color="#007BFF" />}
        {err && <Text style={styles.errorText}>Erro: {err}</Text>}
        
        {/* Renderiza a lista de tutoriais, ou uma mensagem se estiver vazia e não em loading/erro */}
        {!loading && !err && tutorials.length === 0 ? (
          <Text style={styles.emptyList}>Nenhum tutorial encontrado.</Text>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingVertical: 8, gap: 12 }}
            data={tutorials}
            keyExtractor={(t) => t.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.itemTitulo}>{item.title}</Text>
                {/* Renderiza os primeiros 3 passos */}
                {item.steps.slice(0, 3).map((s, i) => (
                  <Text key={i} style={styles.passo}>{i + 1}. {s}</Text>
                ))}
                <Text style={styles.meta}>Atualizado em {item.updatedAt}</Text>
              </View>
            )}
          />
        )}

        <View style={{ height: 12 }} />
        <Button title="⬅️ Voltar" onPress={() => setScreen('home')} color="#007BFF" />
      </View>
    );
  }

  // Tela Home 
  return (
    <View style={styles.container}>
      <Text style={styles.tituloHome}>🚨 Serviço de Emergência</Text>

      {/* Botões de Chamada (Cards interativos) */}
      <View style={styles.botoesEmergencia}>
        {/* SAMU (192) */}
        <TouchableOpacity
          style={[styles.cardButton, styles.samu]}
          onPress={() => ligar('192')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>🚑 SAMU</Text>
          <Text style={styles.cardNumber}>192</Text>
        </TouchableOpacity>

        {/* Bombeiros (193) */}
        <TouchableOpacity
          style={[styles.cardButton, styles.bombeiros]}
          onPress={() => ligar('193')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>🚒 Bombeiros</Text>
          <Text style={styles.cardNumber}>193</Text>
        </TouchableOpacity>

        {/* Polícia (190) */}
        <TouchableOpacity
          style={[styles.cardButton, styles.policia]}
          onPress={() => ligar('190')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>👮 Polícia</Text>
          <Text style={styles.cardNumber}>190</Text>
        </TouchableOpacity>
      </View>

      {/* Status da API - Feedback visual claro */}
      <View
        style={[
          styles.statusContainer,
          // Condicional para destacar o erro
          status.includes('ERRO') 
            ? { backgroundColor: '#FEEEEE', borderColor: '#FF000033', borderWidth: 1 } 
            : { backgroundColor: '#EEFFEE' },
        ]}
      >
        <Text style={styles.statusText}>
          Status API: {' '}
          <Text style={status.includes('ERRO') ? styles.statusError : { color: 'green', fontWeight: 'bold' }}>
            {status}
          </Text>
        </Text>
      </View>

      {/* Link para Tutoriais */}
      <TouchableOpacity
        style={styles.linkTutorials}
        onPress={() => setScreen('tutorials')}
      >
        <Text style={styles.linkText}>📚 Ver tutoriais</Text>
      </TouchableOpacity>
    </View>
  );
}
// NOVOS ESTILOS 
const styles = StyleSheet.create({
  // HOME SCREEN 
  container: { 
    flex: 1, 
    paddingHorizontal: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#FAFAFA' // Fundo suave
  },
  tituloHome: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#333', 
    marginBottom: 40 
  },
  botoesEmergencia: { 
    gap: 15, 
    width: '100%', 
    maxWidth: 350 
  },
  cardButton: {
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // Cores de alto contraste e relevância
  samu: { backgroundColor: '#F0F3BD' }, 
  bombeiros: { backgroundColor: '#FFDADA' }, 
  policia: { backgroundColor: '#D9E6FF' }, 

  cardTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  cardNumber: { fontSize: 24, fontWeight: '900', color: '#333' },

  statusContainer: {
    marginTop: 40,
    padding: 10,
    borderRadius: 8,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  statusText: { fontSize: 14, color: '#444' },
  statusError: { color: 'red', fontWeight: 'bold' },

linkTutorials: {
    marginTop: 20,
    // Novo estilo para parecer um botão de bloco
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#E0E0E0', // Fundo cinza claro (neutro)
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    // Sombra sutil para destacar do fundo
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  linkText: { 
    fontSize: 18, // Aumentei um pouco a fonte
    color: '#333', // Cor escura para o texto
    fontWeight: '600' 
  },

  // TUTORIALS SCREEN (LISTA)
  containerList: { 
    flex: 1, 
    paddingHorizontal: 16, 
    paddingTop: 48, 
    backgroundColor: '#F7F7F7' 
  },
  tituloList: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#333'
  },
  card: { 
    padding: 15, // Aumentei o padding
    borderRadius: 10, // Arredondei mais as bordas
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    backgroundColor: '#fff', 
    // Sombra sutil para destacar o card
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemTitulo: { 
    fontSize: 18, // Aumentei o título do tutorial
    fontWeight: '700', 
    marginBottom: 8,
    color: '#007BFF' // Cor para o título
  },
  passo: { 
    fontSize: 14, 
    marginBottom: 4,
    color: '#555'
  },
  meta: { 
    fontSize: 12, 
    opacity: 0.6, // Diminui a opacidade para texto secundário
    marginTop: 8,
    fontStyle: 'italic'
  },
  errorText: { 
    color: 'red', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999'
  }
});