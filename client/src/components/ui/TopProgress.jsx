// A thin indeterminate bar at the very top of the window, shown while a page's code downloads.
// It tells people something is happening without covering the page they are leaving.
export default function TopProgress({ label = 'Loading page…' }) {
  return (
    <div role="status" aria-label={label} className="fixed inset-x-0 top-0 z-[70] h-0.5">
      <div className="h-full w-1/3 animate-progress rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-fuchsia-500" />
    </div>
  );
}
