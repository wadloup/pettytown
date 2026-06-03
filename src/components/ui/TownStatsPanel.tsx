import { Activity, Archive, ChevronDown, ChevronUp, Flame, Handshake, Sparkles } from "lucide-react";
import { useState } from "react";
import { useGameStore } from "../../game/store";

const statRows = [
  { key: "chaos", label: "Chaos", icon: <Activity size={15} aria-hidden="true" /> },
  { key: "drama", label: "Drama", icon: <Flame size={15} aria-hidden="true" /> },
  { key: "trust", label: "Confiance", icon: <Handshake size={15} aria-hidden="true" /> },
  { key: "weirdness", label: "Bizarrerie", icon: <Sparkles size={15} aria-hidden="true" /> },
] as const;

function TownStatsPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const townStats = useGameStore((state) => state.townStats);
  const dramaArcs = useGameStore((state) => state.dramaArcs);
  const events = useGameStore((state) => state.events);
  const historicEvents = events.filter((event) => event.type === "historic").slice(0, 3);

  return (
    <section className={collapsed ? "stats-panel panel-surface is-collapsed" : "stats-panel panel-surface"} aria-labelledby="stats-title">
      <div className="panel-heading">
        <div>
          <span>Ville</span>
          <h2 id="stats-title">Tensions</h2>
        </div>
        <button type="button" className="icon-button compact" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Ouvrir" : "Replier"}>
          {collapsed ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </div>

      <div className="panel-collapsible">
        <div className="stat-list">
          {statRows.map((row) => {
            const value = Math.round(townStats[row.key]);
            return (
              <div key={row.key} className="stat-row">
                <span>
                  {row.icon}
                  {row.label}
                </span>
                <strong>{value}%</strong>
                <i style={{ width: `${value}%` }} aria-hidden="true" />
              </div>
            );
          })}
        </div>

        <div className="arc-list">
          <div className="mini-heading">
            <Archive size={15} aria-hidden="true" />
            <strong>Histoire de la ville</strong>
          </div>
          {dramaArcs.slice(0, 3).map((arc) => (
            <article key={arc.id} className={`arc-pill arc-${arc.stage}`}>
              <span>{arc.stage}</span>
              <strong>{arc.title}</strong>
            </article>
          ))}
          {historicEvents.map((event) => (
            <article key={event.id} className="arc-pill historic">
              <span>historique</span>
              <strong>{event.description.replace('La ville se souviendra de cette journee comme: "', "").split('"')[0]}</strong>
            </article>
          ))}
          {dramaArcs.length === 0 && historicEvents.length === 0 ? <p className="empty-note">Aucune affaire officielle.</p> : null}
        </div>
      </div>
    </section>
  );
}

export default TownStatsPanel;
