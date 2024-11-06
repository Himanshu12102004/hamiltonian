import { Languages } from "lucide-react";
import { Title } from "../Utils/Title";

export default function Language(): JSX.Element {
  return (
    <>
      <Title Icon={<Languages size={18} />} title="Font and Text" />
      <span className="text-stone-400 text-sm">
        Select the font and text size for the graph from this page.
      </span>
      <div className="mx-2 mt-5 grid grid-cols-4 items-center">
        <span className="text-stone-400 text-sm">Font Size</span>
        <select
          onChange={(e) => {
            console.log(e.target.value);
            const root = document.getElementById("root");
            if (root) {
              root.style.fontFamily = e.target.value;
            }
          }}
          className="col-span-3 self-stretch h-8 border bg-white border-stone-200 rounded-md px-2 text-sm"
        >
          <option value={`"Roboto", sans-serif`}>Roboto</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>
    </>
  );
}
