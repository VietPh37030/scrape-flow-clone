import { ExecutionPhase } from "../generated/prisma";

type Phase = Pick<ExecutionPhase, "creditsConsumed">
export function GetPhaseTotalCost(phases: Phase[]) {
    return phases.reduce((acc, phases) => acc + (phases.creditsConsumed || 0), 0);
}