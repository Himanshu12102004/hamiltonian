import { CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { getSocket } from "../socket";

// const MAX_HISTORY = 6;

export default function GraphLoading({
  abortController = new AbortController(),
  onClose = () => {},
  socketKey = "GenKey",
}): JSX.Element {
  const [loadingHistory, setLoadingHistory] = useState([] as string[]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const socket = getSocket();

  function closeWindow() {
    setIsFadingOut(true);
    setTimeout(() => {
      setLoadingHistory([]);
      abortController.abort();
      onClose();
    }, 1000);
  }

  useEffect(() => {
    if (socket.disconnected) socket.connect();

    socket.on(socketKey, (data: string) => {
      setLoadingHistory((prev: string[]) => {
        if (prev.length > 5) {
          prev.shift();
        }
        return [...prev, data];
      });
    });

    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 3000);

    return () => {
      socket.off("HamiltonianCycle");
      socket.disconnect();
    };
  }, [socket, onClose, socketKey]);

  return (
    <div
      className={`absolute top-2 left-2 bottom-2 right-2 bg-stone-800/40 backdrop-blur-md z-20 transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0" : "opacity-100"
      } ${isVisible ? "" : "hidden"}`}
    >
      <div className="flex flex-col gap-8 items-center h-full">
        <div className="flex flex-col items-center gap-4 mt-auto">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-stone-600"></div>
          <div className="flex flex-col-reverse gap-0 items-center max-h-32 p-2">
            {loadingHistory.map((item, index) => (
              <p
                key={index}
                style={{
                  opacity: index * 0.3,
                }}
                className="text-stone-200 text-xs tracking-wider animate-pulse"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <button
          onClick={closeWindow}
          className="flex mb-auto flex-row items-center gap-2 px-4 py-2 rounded-lg bg-stone-900/50 outline outline-1 outline-stone-700 text-stone-200 hover:bg-stone-600/70 transition-colors"
        >
          <span className="text-sm">Cancel</span>
        </button>
        <button className="absolute top-2 right-2 p-2 rounded-lg bg-stone-600/50 text-stone-600 hover:bg-stone-600/70 transition-colors">
          <CircleX onClick={closeWindow} size={18} className="stroke-red-400" />
        </button>
      </div>
    </div>
  );
}
