import { useEffect, useState } from "react";
import GameCanvas from "./components/three/GameCanvas";
import EventLog from "./components/ui/EventLog";
import FeedbackToasts from "./components/ui/FeedbackToasts";
import InstructionPanel from "./components/ui/InstructionPanel";
import InterventionPanel from "./components/ui/InterventionPanel";
import NPCPanel from "./components/ui/NPCPanel";
import SessionSummary from "./components/ui/SessionSummary";
import TopBar from "./components/ui/TopBar";
import TownStatsPanel from "./components/ui/TownStatsPanel";
import TutorialOverlay from "./components/ui/TutorialOverlay";
import { useGameStore } from "./game/store";

function App() {
  const [isImmersive, setIsImmersive] = useState(false);
  const tick = useGameStore((state) => state.tick);
  const speed = useGameStore((state) => state.speed);
  const isPaused = useGameStore((state) => state.isPaused);

  useEffect(() => {
    const interval = window.setInterval(tick, speed === 2 ? 650 : 1200);
    return () => window.clearInterval(interval);
  }, [speed, tick]);

  return (
    <main className="app-shell" data-paused={isPaused} data-immersive={isImmersive}>
      <GameCanvas />
      <TopBar isImmersive={isImmersive} onToggleImmersion={() => setIsImmersive((current) => !current)} />
      <aside className="left-dock">
        <InterventionPanel />
        <TownStatsPanel />
      </aside>
      <aside className="right-dock">
        <EventLog />
      </aside>
      <NPCPanel />
      <InstructionPanel />
      <FeedbackToasts />
      <TutorialOverlay />
      <SessionSummary />
    </main>
  );
}

export default App;
