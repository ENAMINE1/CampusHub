// Small, fixed events used by the tests, so results never depend on the real data file.
export const gitWorkshop = {
  id: 'evt-1',
  title: 'Intro to Git Workshop',
  description: 'Commits and branches.',
  category: 'workshop',
  club: { name: 'Code Club', slug: 'code-club' },
  venue: 'Lab 2',
  startsAt: '2026-11-10T16:00:00+05:30',
  endsAt: '2026-11-10T17:00:00+05:30',
  registrationDeadline: '2026-11-09T23:59:00+05:30',
  capacity: 40,
  seatsTaken: 28,
  posterUrl: '',
};

export const hackNight = {
  ...gitWorkshop,
  id: 'evt-2',
  title: 'Hack Night',
  category: 'tech',
  capacity: 30,
  seatsTaken: 30,
};

export const footballFinal = {
  ...gitWorkshop,
  id: 'evt-3',
  title: 'Football Final',
  category: 'sports',
  club: { name: 'Sports Council', slug: 'sports-council' },
};

export const sampleEvents = [gitWorkshop, hackNight, footballFinal];
