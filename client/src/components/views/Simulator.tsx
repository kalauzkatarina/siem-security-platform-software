import { ISimulatorAPI } from "../../api/simulator/ISimulatorAPI";
import { SimulationPanel } from "../simulator/SimulationPanel";

type SimulatorProps = {
  simulatorApi: ISimulatorAPI;
};

export default function Simulator({ simulatorApi }: SimulatorProps) {
  return (
    <div className="bg-transparent border-2 border-solid rounded-[14px] border-[#282A28]">
      <h2 className="mt-[3px]! p-[5px]! m-[10px]!" >Simulator</h2>
      <div className="m-[10px]!">
        <SimulationPanel simulatorApi={simulatorApi} />
      </div>
    </div>
  );
}
