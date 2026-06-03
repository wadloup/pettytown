import { EyeOff, Goal, HeartHandshake, NotebookText, ShieldQuestion, X } from "lucide-react";
import type { CSSProperties } from "react";
import { getNpcVisualProfile } from "../../data/npcVisuals";
import { topRelationships } from "../../game/relationships";
import { useGameStore } from "../../game/store";

const statLabels = [
  ["mood", "Humeur"],
  ["stress", "Stress"],
  ["ego", "Ego"],
  ["aura", "Aura"],
  ["reputation", "Reputation"],
] as const;

type NPCPanelProps = {
  embedded?: boolean;
};

function NPCPanel({ embedded = false }: NPCPanelProps) {
  const selectedNpcId = useGameStore((state) => state.selectedNpcId);
  const npcs = useGameStore((state) => state.npcs);
  const clearSelection = useGameStore((state) => state.clearSelection);
  const npc = npcs.find((candidate) => candidate.id === selectedNpcId);

  if (!npc) return null;

  const visual = npc.visual ?? getNpcVisualProfile(Number(npc.id.replace("npc_", "")) || 0, npc.personality);
  const relationships = topRelationships(npc, npcs, 4);
  const secretVisible = npc.stats.suspicion > 78 || npc.stats.shame > 66;
  const secretText = secretVisible ? npc.secret : `${npc.secret.slice(0, Math.max(10, Math.floor(npc.secret.length * 0.32)))}...`;
  const className = embedded ? "npc-panel npc-panel-embedded" : "npc-panel panel-surface";

  return (
    <section className={className} aria-labelledby="npc-panel-title">
      <div className="npc-panel-head">
        <div className="npc-avatar" style={{ "--primary": visual.primary, "--secondary": visual.secondary, "--accent": visual.accent, "--skin": visual.skin } as CSSProperties} aria-hidden="true">
          <i />
          <b />
          <span />
        </div>
        <div>
          <span>PNJ selectionne</span>
          <h2 id="npc-panel-title">{npc.name}</h2>
          <small>{visual.title}</small>
        </div>
        <button type="button" className="icon-button compact" onClick={clearSelection} title="Fermer">
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="trait-row">
        {npc.personality.map((trait) => (
          <span key={trait}>{trait}</span>
        ))}
      </div>

      <div className="npc-section">
        <h3>
          <Goal size={15} aria-hidden="true" />
          Objectif
        </h3>
        <p>{npc.goal}</p>
      </div>

      <div className="npc-section secret-section">
        <h3>
          {secretVisible ? <ShieldQuestion size={15} aria-hidden="true" /> : <EyeOff size={15} aria-hidden="true" />}
          Secret
        </h3>
        <p>{secretText}</p>
      </div>

      <div className="npc-stats">
        {statLabels.map(([key, label]) => {
          const value = npc.stats[key];
          const normalized = key === "reputation" ? Math.max(0, value + 50) : value;
          return (
            <div key={key}>
              <span>{label}</span>
              <strong>{Math.round(value)}</strong>
              <i style={{ width: `${Math.max(4, Math.min(100, normalized))}%` }} aria-hidden="true" />
            </div>
          );
        })}
      </div>

      <div className="npc-section">
        <h3>
          <NotebookText size={15} aria-hidden="true" />
          Pensee
        </h3>
        <p>{npc.currentThought}</p>
        <small>{npc.currentAction}</small>
      </div>

      <div className="npc-section">
        <h3>
          <HeartHandshake size={15} aria-hidden="true" />
          Relations
        </h3>
        <div className="relationship-list">
          {relationships.map(({ relationship, target, warmth }) =>
            target ? (
              <span key={relationship.targetNpcId}>
                <b>{target.name}</b>
                <i>{warmth >= 0 ? "+" : ""}{Math.round(warmth)}</i>
              </span>
            ) : null,
          )}
        </div>
      </div>

      <div className="memory-list">
        {npc.memories.slice(0, 3).map((memory) => (
          <p key={memory.id}>{memory.description}</p>
        ))}
      </div>
    </section>
  );
}

export default NPCPanel;
