import { useState } from 'react';
import Home from './screens/Home';
import Tutorials from './screens/Tutorials';
import TutorialDetail from './screens/TutorialDetail';
import type { Screen, Tutorial } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

  const goTo = (s: Screen) => setScreen(s);
  const select = (id: string) => setSelectedId(id);
  const selected = tutorials.find(t => t.id === selectedId);

  if (screen === 'tutorials')
    return (
      <Tutorials
        goTo={goTo}
        select={select}
        tutorials={tutorials}
        setTutorials={setTutorials}
      />
    );

  if (screen === 'detail')
    return <TutorialDetail goTo={goTo} tutorial={selected} />;

  return <Home goTo={goTo} />;
}
