import { Clock, CopyCheck, Eye, EyeOff, Pause, Play, RefreshCw, Save, Sparkles, Timer } from "lucide-react";
import { formatGameTime } from "../../game/constants";
import { useGameStore } from "../../game/store";

type TopBarProps = {
  isImmersive: boolean;
  onToggleImmersion: () => void;
};

function TopBar({ isImmersive, onToggleImmersion }: TopBarProps) {
  const time = useGameStore((state) => state.time);
  const player = useGameStore((state) => state.player);
  const townStats = useGameStore((state) => state.townStats);
  const isPaused = useGameStore((state) => state.isPaused);
  const speed = useGameStore((state) => state.speed);
  const togglePause = useGameStore((state) => state.togglePause);
  const toggleSpeed = useGameStore((state) => state.toggleSpeed);
  const saveNow = useGameStore((state) => state.saveNow);
  const newTown = useGameStore((state) => state.newTown);
  const toggleSummary = useGameStore((state) => state.toggleSummary);

  const resetTown = () => {
    if (window.confirm("Creer une nouvelle ville et remplacer la sauvegarde locale ?")) {
      newTown();
    }
  };

  return (
    <header className="top-bar">
      <div className="brand-mark" aria-label="PettyTown">
        <span>PT</span>
        <div>
          <strong>PettyTown</strong>
          <small>Aquarium social</small>
        </div>
      </div>

      <div className="top-metrics" aria-label="Statistiques principales">
        <span title="Heure locale de la simulation">
          <Clock size={16} aria-hidden="true" />
          {formatGameTime(time)}
        </span>
        <span title="Influence disponible">
          <Sparkles size={16} aria-hidden="true" />
          {Math.round(player.influence)}/{player.maxInfluence}
        </span>
        <span>Chaos {Math.round(townStats.chaos)}%</span>
        <span>Drama {Math.round(townStats.drama)}%</span>
      </div>

      <nav className="top-actions" aria-label="Commandes de session">
        <button type="button" className="icon-button" onClick={togglePause} title={isPaused ? "Reprendre" : "Pause"}>
          {isPaused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
        <button type="button" className="text-button" onClick={toggleSpeed} title="Vitesse">
          <Timer size={17} aria-hidden="true" />
          x{speed}
        </button>
        <button type="button" className="icon-button" onClick={saveNow} title="Sauvegarder">
          <Save size={17} aria-hidden="true" />
        </button>
        <button type="button" className="icon-button" onClick={toggleSummary} title="Resume de la journee">
          <CopyCheck size={17} aria-hidden="true" />
        </button>
        <button type="button" className="icon-button" onClick={onToggleImmersion} title={isImmersive ? "Afficher l'interface" : "Mode immersion"}>
          {isImmersive ? <Eye size={17} aria-hidden="true" /> : <EyeOff size={17} aria-hidden="true" />}
        </button>
        <button type="button" className="icon-button danger" onClick={resetTown} title="Nouvelle ville">
          <RefreshCw size={17} aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}

export default TopBar;
