// The side panel on the event details page: when it is, live seats, the register / cancel action,
// favorite, share and calendar, kept together so the main action is always in the same place.
import Card from './ui/Card.jsx';
import SeatsBadge from './SeatsBadge.jsx';
import RegisterForEvent from './RegisterForEvent.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import EventShareActions from './EventShareActions.jsx';
import relativeDay from '../utils/relativeDay.js';

export default function ReservePanel({ event, live, onChange }) {
  const when = relativeDay(event.startsAt, event.endsAt);

  return (
    <Card as="section" aria-labelledby="reserve-heading" className="space-y-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="reserve-heading" className="text-lg font-semibold">
            Reserve a seat
          </h2>
          <p className="text-sm text-ink-muted">{when.label}</p>
        </div>
        <FavoriteButton eventId={event.id} title={event.title} />
      </div>
      <SeatsBadge
        seatsLeft={live.seatsLeft}
        capacity={event.capacity}
        isLive={live.isConnected}
      />
      <RegisterForEvent
        event={{ ...event, seatsLeft: live.seatsLeft }}
        onChange={onChange}
      />
      <div className="border-t border-line pt-5">
        <EventShareActions event={event} />
      </div>
    </Card>
  );
}
