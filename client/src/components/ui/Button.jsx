// Button with a few visual variants. Any other prop (onClick, disabled, type) passes straight through.
const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-600',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100',
  danger: 'bg-red-700 text-white hover:bg-red-600',
};

export default function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-lg px-4 py-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
