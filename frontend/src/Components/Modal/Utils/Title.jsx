function Title({ Icon = <></>, title = "" }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {Icon}
      <h1 className="text-stone-600 text-lg font-semibold">{title}</h1>
    </div>
  );
}

export { Title };
