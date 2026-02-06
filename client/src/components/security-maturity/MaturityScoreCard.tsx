import { MaturityLevel } from "../../enums/MaturityLevel";

export default function MaturityScoreCard({level, }: {level: MaturityLevel;}) {

    const colorMap: Record<MaturityLevel, string> = {
        INITIAL: "#ef4444",
        MANAGED: "#facc15",
        DEFINED: "#22c55e",
        QUANTITATIVELY_MANAGED: "#22c55e",
        OPTIMIZING: "#22c55e",
        UNKNOWN: "#9ca3af",
    };

    return (
       <div className="rounded-lg border-2 border-[#282A28] bg-[#1f2123] p-6 text-center h-[200px] w-full flex flex-col items-center justify-center">
            <h3 className="text-sm uppercase tracking-widest text-gray-400">
                Maturity Level
            </h3>

            <div className="mt-4 text-5xl font-bold" style={{ color: colorMap[level] }}>
                {level.replace("_", " ")}
            </div>
        </div>
    );
}