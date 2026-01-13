import { useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../hooks/useAuthHook";
import { SimulationDTO, SimulationType } from "../../models/simulator/SimulationDTO";
import { ISimulatorAPI, SimulationRequestDTO } from "../../api/simulator/ISimulatorAPI";

type SimulationPanelProps = {
  simulatorApi: ISimulatorAPI;
};

const typeOptions: { value: SimulationType; label: string }[] = [
  { value: "BRUTE_FORCE", label: "Brute-force" },
  { value: "PRIVILEGE_ESCALATION", label: "Privilege escalation" },
  { value: "DDOS", label: "DDoS" },
];

export function SimulationPanel({ simulatorApi }: SimulationPanelProps) {
  const { token } = useAuth();

  const [type, setType] = useState<SimulationType>("BRUTE_FORCE");
  const [intensity, setIntensity] = useState<number>(5);
  const [durationSeconds, setDurationSeconds] = useState<number>(30);
  const [target, setTarget] = useState<string>("auth-service");
  const [activeSimulation, setActiveSimulation] = useState<SimulationDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const timelineData = useMemo(() => {
    if (!activeSimulation) return [];
    return activeSimulation.timeline.map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString(),
      count: point.count,
    }));
  }, [activeSimulation]);

  const startSimulation = async () => {
    if (!token) {
      setError("No auth token available.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: SimulationRequestDTO = {
        type,
        intensity,
        durationSeconds,
        target: target.trim() ? target.trim() : undefined,
      };
      const result = await simulatorApi.startSimulation(payload, token);
      setActiveSimulation(result);
    } catch (err) {
      console.error(err);
      setError("Failed to start simulation.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopSimulation = async () => {
    if (!token || !activeSimulation) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await simulatorApi.stopSimulation(activeSimulation.id, token);
      setActiveSimulation(result);
    } catch (err) {
      console.error(err);
      setError("Failed to stop simulation.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSimulation = async () => {
    if (!token || !activeSimulation) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await simulatorApi.getSimulation(activeSimulation.id, token);
      setActiveSimulation(result);
    } catch (err) {
      console.error(err);
      setError("Failed to refresh simulation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#151515] border border-[#2f2f2f] rounded-[12px] px-8 py-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-semibold">Security Incident Simulator</h3>
        {activeSimulation && (
          <span className="text-[12px] text-[#a3a3a3]">
            ID: {activeSimulation.id}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pl-4">
        <label className="text-[12px] text-[#a3a3a3]">
          Type
          <select
            className="mt-2 w-full rounded bg-[#232323] p-2 text-[13px]"
            value={type}
            onChange={(e) => setType(e.target.value as SimulationType)}
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-[12px] text-[#a3a3a3]">
          Intensity (events/sec)
          <input
            className="mt-2 w-full rounded bg-[#232323] p-2 text-[13px]"
            type="number"
            min={1}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </label>

        <label className="text-[12px] text-[#a3a3a3]">
          Duration (sec)
          <input
            className="mt-2 w-full rounded bg-[#232323] p-2 text-[13px]"
            type="number"
            min={1}
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
          />
        </label>

        <label className="text-[12px] text-[#a3a3a3]">
          Target
          <input
            className="mt-2 w-full rounded bg-[#232323] p-2 text-[13px]"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="auth-service"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4 pl-4">
        <button
          className="px-3 py-2 rounded bg-[#4ade80] text-[#0f0f0f] text-[12px] font-semibold"
          onClick={startSimulation}
          disabled={isLoading}
        >
          Start
        </button>
        <button
          className="px-3 py-2 rounded bg-[#f87171] text-[#0f0f0f] text-[12px] font-semibold"
          onClick={stopSimulation}
          disabled={!activeSimulation || isLoading}
        >
          Stop
        </button>
        <button
          className="px-3 py-2 rounded bg-[#3b82f6] text-white text-[12px] font-semibold"
          onClick={refreshSimulation}
          disabled={!activeSimulation || isLoading}
        >
          Refresh
        </button>
        {activeSimulation && (
          <span className="text-[12px] text-[#a3a3a3]">
            Status: {activeSimulation.status} | Events: {activeSimulation.eventsGenerated}
          </span>
        )}
      </div>

      {error && <div className="text-[12px] text-red-400 mb-2">{error}</div>}

      <div className="h-[180px] bg-[#111111] rounded-[8px] p-3">
        {timelineData.length === 0 ? (
          <div className="text-[12px] text-[#666] flex items-center justify-center h-full">
            No simulation data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <XAxis dataKey="time" tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
