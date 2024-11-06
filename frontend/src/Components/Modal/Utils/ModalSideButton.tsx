function ModalSideButton({
  name,
  icon,
  selected = false,
  onClick = () => {},
}: {
  name: string;
  icon: JSX.Element;
  selected?: boolean;
  onClick?: (name: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`flex flex-row items-center gap-2 px-2 py-2 rounded-md text-sm outline outline-1 ${
        selected
          ? "text-blue-400 outline-blue-500 font-semibold hover:bg-blue-100 hover:text-blue-500 transition-colors duration-100"
          : "text-stone-400 outline-stone-400 font-medium hover:bg-stone-100 hover:text-stone-500 transition-colors duration-100"
      }`}
    >
      {icon}
      {name}
    </button>
  );
}

export { ModalSideButton };
