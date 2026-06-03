import { ChevronLeft, ChevronRight, Flame, History, MessageCircle, Zap } from "lucide-react";
import { useState } from "react";
import { formatGameTime } from "../../game/constants";
import { useGameStore } from "../../game/store";
import type { GameEvent } from "../../game/types";

type EventLogProps = {
  embedded?: boolean;
};

const eventIcon = (event: GameEvent) => {
  if (event.type === "historic") return <History size={16} aria-hidden="true" />;
  if (event.type === "drama") return <Flame size={16} aria-hidden="true" />;
  if (event.type === "rumor") return <MessageCircle size={16} aria-hidden="true" />;
  return <Zap size={16} aria-hidden="true" />;
};

function EventLog({ embedded = false }: EventLogProps) {
  const [collapsed, setCollapsed] = useState(false);
  const events = useGameStore((state) => state.events);
  const npcs = useGameStore((state) => state.npcs);
  const isCollapsed = !embedded && collapsed;
  const className = embedded
    ? "event-log event-log-embedded"
    : isCollapsed
      ? "event-log panel-surface is-collapsed"
      : "event-log panel-surface";

  return (
    <section className={className} aria-labelledby="event-log-title">
      {!embedded ? (
        <div className="panel-heading">
          <div>
            <span>Journal</span>
            <h2 id="event-log-title">Evenements</h2>
          </div>
          <button type="button" className="icon-button compact" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Ouvrir" : "Replier"}>
            {collapsed ? <ChevronLeft size={16} aria-hidden="true" /> : <ChevronRight size={16} aria-hidden="true" />}
          </button>
        </div>
      ) : null}
      <div className="event-list panel-collapsible">
        {events.map((event) => {
          const names = event.involvedNpcIds
            .map((id) => npcs.find((npc) => npc.id === id)?.name)
            .filter(Boolean)
            .slice(0, 4)
            .join(", ");

          return (
            <article key={event.id} className={`event-item event-${event.type} ${event.type === "minor" ? "event-compact" : ""}`}>
              <header>
                <span>
                  {eventIcon(event)}
                  {formatGameTime(event.timestamp)}
                </span>
                <b>{event.intensity}</b>
              </header>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              {names ? <small>{names}</small> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default EventLog;
