// screens/Tutorials.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import type { Screen, Tutorial } from '../src/types';

const API = 'http://192.168.0.136:8000';

type Props = {
  goTo: (s: Screen) => void;             // ex.: 'home' | 'tutorials' | 'infpaciente'
  select: (id: string) => void;          // guarda o id selecionado para a próxima tela
  tutorials: Tutorial[];                 // passe [] como default no componente pai
  setTutorials: (t: Tutorial[]) => void;
};

export default function Tutorials({ goTo, select, tutorials, setTutorials }: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(tutorials.length === 0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const list = tutorials ?? []; // blindagem extra (evita length de undefined)

  const carregar = useCallback(async () => {
    setError(null);
    setLoading(list.length === 0);
    const ctrl = new AbortController();
    try {
      const r = await fetch(`${API}/tutorials`, { signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      setTutorials(Array.isArray(json) ? (json as Tutorial[]) : []);
    } catch (e: any) {
      setError(e?.message ?? 'Falha ao carregar');
      // mantém o que já existe em memória; se for primeira carga, lista vazia
      if (list.length === 0) setTutorials([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API, setTutorials]); // não depende de list para não reexecutar sem necessidade

  useEffect(() => {
    if (list.length === 0) void carregar();
  }, []); // monta 1x

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void carregar();
  }, [carregar]);

  const previewItem = useMemo(
    () => (previewId ? list.find(t => t.id === previewId) ?? null : null),
    [previewId, list]
  );

  // ======= Loading inicial =======
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  // ======= Tela de PREVIEW (no mesmo arquivo) =======
  if (previewItem) {
    const body = String(previewItem.body ?? '');
    const previewText = body.length > 240 ? body.slice(0, 240) + '…' : body;

    return (
      <ScrollView contentContainerStyle={styles.previewContainer}>
        <Text style={styles.titulo}>Perfil da vítima</Text>
        <Text style={styles.itemTitulo}>{previewItem.title}</Text>
        <Text style={styles.previewBody}>
          {body ? previewText : 'Sem conteúdo disponível.'}
        </Text>

        <View style={{ height: 16 }} />
        <Button
          title="Adulto"
          onPress={() => {select(previewItem.id);
          goTo('detail'); // navega para sua tela de detalhes
          }}
        />
        <View style={{ height: 8 }} />

        <Button
          title="Criança"
          onPress={() => {select(previewItem.id);
            goTo('detail');
          }}
        />
        <View style={{ height: 8}}/>

        <Button
          title="Recém-Nascido"
          onPress={() => {select(previewItem.id);
            goTo('detail');
          }}
        />
        <View style={{ height: 8}}/>

        <Button title="⬅️ Voltar para lista" onPress={() => setPreviewId(null)} />
      </ScrollView>
    );
  }

  // ======= Tela de LISTA =======
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📚 Tutoriais</Text>

      {!!error && (
        <Text style={styles.erro}>Erro ao carregar: {error}</Text>
      )}

      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setPreviewId(item.id)} // abre a preview
            onLongPress={() => {                  // atalho direto p/ detalhe
              select(item.id);
              goTo('infpaciente');
            }}
          >
            <Text style={styles.itemTitulo}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ paddingVertical: 12 }}>
            Nenhum tutorial disponível.
          </Text>
        }
      />

      <Button title="⬅️ Voltar" onPress={() => goTo('home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  previewContainer: { padding: 16, paddingTop: 48 },
  titulo: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  erro: { color: 'red', marginBottom: 8 },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#eee', marginBottom: 8 },
  itemTitulo: { fontSize: 16, fontWeight: '600' },
  previewBody: { fontSize: 14, lineHeight: 20, color: '#333', marginTop: 8 },
});
