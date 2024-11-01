import { getDOMSocketPosition } from "rete-render-utils";

export function getSankeySocketPosition() {
  return getDOMSocketPosition({
    offset(position, nodeId, side, key) {
      return {
        x: position.x + (side === "input" ? -1 : 1),
        y: position.y
      };
    }
  });
}
