export default function ControlIcon(
  icon: JSX.Element,
  onClick: () => void
): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center p-[2px] hover:bg-stone-50 transition-colors"
    >
      {icon}
    </div>
  );
}
