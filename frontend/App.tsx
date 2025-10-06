// App.tsx
import { useState } from 'react';
import Home from './screens/Home';
import Tutorials from './screens/Tutorials';
import TutorialDetail from './screens/TutorialDetail';
import type { Screen, Tutorial } from './src/types';

type VictimProfile = 'adult' | 'child' | 'newborn';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [profile, setProfile] = useState<VictimProfile>('adult'); // <<< novo

  const goTo = (s: Screen) => setScreen(s);
  const select = (id: string) => setSelectedId(id);

  const selected = tutorials.find(t => t.id === selectedId);

  switch (screen) {
    case 'tutorials':
      return (
        <Tutorials
          goTo={goTo}
          select={select}
          tutorials={tutorials}
          setTutorials={setTutorials}
          setProfile={setProfile} // <<< passa para decidir perfil
        />
      );

    // Agora existe apenas UMA tela de detalhe
    case 'detail':
      return (
        <TutorialDetail
          goTo={goTo}
          tutorial={selected}
          profile={profile} // <<< perfis: 'adult' | 'child' | 'newborn'
        />
      );

    case 'home':
    default:
      return <Home goTo={goTo} />;
  }
}
