import { Title } from "../Utils/Title";
import { HomeIcon } from "lucide-react";

function Home(): JSX.Element {
  return (
    <>
      <Title Icon={<HomeIcon size={18} />} title="Home" />
      <span className="text-stone-400 text-sm">
        Please select a page from the sidebar
      </span>
    </>
  );
}

export default Home;
