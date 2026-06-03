import { Flame, Info, Sparkles, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useGameStore } from "../../game/store";
import type { FeedbackToast } from "../../game/types";

const iconByTone: Record<FeedbackToast["tone"], ReactNode> = {
  info: <Info size={15} aria-hidden="true" />,
  success: <Sparkles size={15} aria-hidden="true" />,
  drama: <Flame size={15} aria-hidden="true" />,
  warning: <TriangleAlert size={15} aria-hidden="true" />,
};

function FeedbackToasts() {
  const feedbacks = useGameStore((state) => state.feedbacks);

  if (feedbacks.length === 0) return null;

  return (
    <div className="feedback-stack" aria-live="polite">
      {feedbacks.map((feedback) => (
        <article key={feedback.id} className={`feedback-toast feedback-${feedback.tone}`}>
          <span>{iconByTone[feedback.tone]}</span>
          <div>
            <strong>{feedback.title}</strong>
            <p>{feedback.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default FeedbackToasts;
