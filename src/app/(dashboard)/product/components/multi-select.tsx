"use client";

type Props<T> = {
  label: string;
  items: T[];
  selected: T[];
  setSelected: (items: T[]) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
};

export function MultiSelect<T>({ label, items, selected, setSelected, getId, getLabel }: Props<T>) {
  
  const handleSelect = (id: string) => {
    if (!id) return;

    const item = items.find((i) => getId(i) === id);
    const alreadySelected = selected.some((i) => getId(i) === id);

    if (item && !alreadySelected) {
      setSelected([...selected, item]);
    }
  };

  const remove = (id: string) => {
    setSelected(selected.filter((i) => getId(i) !== id));
  };

  return (
    <div className="w-full space-y-1">
      <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">{label}</p>

      <select
        value="" // Mantém sempre no "Selecione" após escolher
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full p-2.5 border rounded-md text-sm bg-background"
      >
        <option value="">Selecione...</option>
        {items.map((item) => (
          <option key={getId(item)} value={getId(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>

      <div className="flex flex-wrap gap-2 mt-1">
        {selected.map((item) => (
          <div
            key={getId(item)}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md flex items-center gap-2 border"
          >
            <span className="text-xs">{getLabel(item)}</span>
            <button
              type="button"
              onClick={() => remove(getId(item))}
              className="hover:text-destructive transition-colors font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}