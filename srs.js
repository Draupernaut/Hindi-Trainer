const DAY = 24 * 60 * 60 * 1000;

export function freshCardState() {
  return {
    phase: 'new',
    due: 0,
    interval: 0,
    ease: 2.5,
    repetitions: 0,
    lapses: 0,
    lastReviewed: null
  };
}

export function isDue(state, now = Date.now()) {
  if (!state) return false;
  return state.phase === 'new' || Number(state.due || 0) <= now;
}

export function scheduleReview(previous, rating, now = Date.now()) {
  const s = { ...freshCardState(), ...(previous || {}) };
  const reps = Number(s.repetitions || 0);
  let interval = Number(s.interval || 0);
  let ease = Number(s.ease || 2.5);
  let phase = 'review';
  let lapses = Number(s.lapses || 0);

  if (rating === 'again') {
    lapses += 1;
    interval = 0;
    ease = Math.max(1.3, ease - 0.2);
    phase = 'learning';
    return { ...s, phase, due: now + 10 * 60 * 1000, interval, ease, repetitions: reps + 1, lapses, lastReviewed: now };
  }

  if (rating === 'hard') {
    interval = Math.max(1, interval ? Math.round(interval * 1.2) : 1);
    ease = Math.max(1.3, ease - 0.05);
  } else if (rating === 'good') {
    if (reps === 0 || interval === 0) interval = 1;
    else if (reps === 1) interval = 3;
    else interval = Math.max(interval + 1, Math.round(interval * ease));
  } else if (rating === 'easy') {
    ease = Math.min(3.0, ease + 0.15);
    if (reps === 0 || interval === 0) interval = 4;
    else interval = Math.max(interval + 2, Math.round(interval * ease * 1.3));
  } else {
    throw new Error(`Unknown rating: ${rating}`);
  }

  return {
    ...s,
    phase,
    due: now + interval * DAY,
    interval,
    ease,
    repetitions: reps + 1,
    lapses,
    lastReviewed: now
  };
}

export function intervalPreview(previous) {
  const now = Date.now();
  const label = (next) => {
    const ms = next.due - now;
    if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))} Min.`;
    const days = Math.max(1, Math.round(ms / DAY));
    return days === 1 ? '1 Tag' : `${days} Tage`;
  };
  return {
    again: label(scheduleReview(previous, 'again', now)),
    hard: label(scheduleReview(previous, 'hard', now)),
    good: label(scheduleReview(previous, 'good', now)),
    easy: label(scheduleReview(previous, 'easy', now))
  };
}
