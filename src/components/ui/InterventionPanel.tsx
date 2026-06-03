import {
  BadgeDollarSign,
  Bell,
  Brain,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Eye,
  Lightbulb,
  PartyPopper,
  Power,
  Siren,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { interventions } from "../../game/interventions";
import { useGameStore } from "../../game/store";
import type { Intervention } from "../../game/types";

const iconMap: Record<Intervention["id"], ReactNode> = {
  rumor: <Bell size={17} aria-hidden="true" />,
  anonymous_message: <Eye size={17} aria-hidden="true" />,
  weird_object: <Sparkles size={17} aria-hidden="true" />,
  intrusive_thought: <Brain size={17} aria-hidden="true" />,
  opportunity: <Star size={17} aria-hidden="true" />,
  jealousy: <Lightbulb size={17} aria-hidden="true" />,
  party: <PartyPopper size={17} aria-hidden="true" />,
  power_outage: <Power size={17} aria-hidden="true" />,
  money: <BadgeDollarSign size={17} aria-hidden="true" />,
  minor_disaster: <Siren size={17} aria-hidden="true" />,
};

const targetLabel: Record<Intervention["target"], string> = {
  npc: "PNJ",
  location: "Lieu",
  npc_pair: "2 PNJ",
};

function InterventionPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const selectedInterventionId = useGameStore((state) => state.selectedInterventionId);
  const pendingPairFirstNpcId = useGameStore((state) => state.pendingPairFirstNpcId);
  const influence = useGameStore((state) => state.player.influence);
  const npcs = useGameStore((state) => state.npcs);
  const chooseIntervention = useGameStore((state) => state.chooseIntervention);
  const cancelIntervention = useGameStore((state) => state.cancelIntervention);

  const selected = interventions.find((intervention) => intervention.id === selectedInterventionId);
  const firstPairNpc = npcs.find((npc) => npc.id === pendingPairFirstNpcId);

  return (
    <section className={collapsed ? "intervention-panel panel-surface is-collapsed" : "intervention-panel panel-surface"} aria-labelledby="intervention-title">
      <div className="panel-heading">
        <div>
          <span>Influence</span>
          <h2 id="intervention-title">Interventions</h2>
        </div>
        <div className="panel-actions">
          {selected ? (
            <button type="button" className="icon-button compact" onClick={cancelIntervention} title="Annuler">
              <CircleOff size={16} aria-hidden="true" />
            </button>
          ) : null}
          <button type="button" className="icon-button compact" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Ouvrir" : "Replier"}>
            {collapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronLeft size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="panel-collapsible">
        {selected ? (
          <div className="target-strip">
            <strong>{selected.name}</strong>
            <span>
              {targetLabel[selected.target]}
              {firstPairNpc ? `: ${firstPairNpc.name}` : ""}
            </span>
          </div>
        ) : null}

        <div className="intervention-grid">
          {interventions.map((intervention) => {
            const active = intervention.id === selectedInterventionId;
            const disabled = influence < intervention.cost;

            return (
              <button
                key={intervention.id}
                type="button"
                className={active ? "intervention-card is-active" : "intervention-card"}
                disabled={disabled}
                onClick={() => chooseIntervention(intervention.id)}
                title={intervention.description}
              >
                <span className="intervention-icon">{iconMap[intervention.id]}</span>
                <span className="intervention-text">
                  <strong>{intervention.name}</strong>
                  <small>
                    {targetLabel[intervention.target]} - {intervention.cost}
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default InterventionPanel;
