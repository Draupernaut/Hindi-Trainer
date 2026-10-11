import { course as baseCourse, cards as baseCards } from './content.js';
import { units, expansionLessons, expansionCards, legacyReadings } from './curriculum.js';

const unitByLesson = Object.fromEntries(units.flatMap(unit => unit.lessonIds.map(id => [id, unit.id])));
const baseLessons = baseCourse.lessons.map(lesson => ({
  ...lesson,
  unit: unitByLesson[lesson.id],
  reading: legacyReadings[lesson.id]
}));

export const course = {
  ...baseCourse,
  version: 2,
  subtitle: 'Deutsch ↔ Hindi · Grammatik, Lesen & Spaced Repetition',
  units,
  lessons: [...baseLessons, ...expansionLessons]
};

export const cards = [...baseCards, ...expansionCards];
