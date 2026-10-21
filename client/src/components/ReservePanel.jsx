// The side panel on the event details page: live seats, the register / cancel action and the
// favorite toggle, kept together so the main action is always in the same place.
import Card from './ui/Card.jsx';
import SeatsBadge from './SeatsBadge.jsx';
import RegisterForEvent from './RegisterForEvent.jsx';
import FavoriteButton from './FavoriteButton.jsx';

export default function ReservePanel({ event, live, onChange }) {
  return (
    <Card as="section" aria-labelledby="reserve-heading" className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h2 id="reserve-heading" className="text-lg font-semibold">
          Reserve a seat
        </h2>
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
    </Card>
  );
}
