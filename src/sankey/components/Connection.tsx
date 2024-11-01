import * as React from "react";
import { ClassicScheme, Position, Presets } from "rete-react-plugin";
import styled from "styled-components";

function sankeyConnectionPath(
  points: [Position, Position],
  weight: number,
  curvature: number
) {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points;
  const hx1 = x1 + Math.abs(x2 - x1) * curvature;
  const hx2 = x2 - Math.abs(x2 - x1) * curvature;
  const halfweight = weight / 2;

  return `
    M ${x1} ${y1 - halfweight} C ${hx1} ${y1 - halfweight} ${hx2} ${
    y2 - halfweight
  } ${x2} ${y2 - halfweight}
    L ${x2} ${y2 + halfweight} C ${hx2} ${y2 + halfweight} ${hx1} ${
    y1 + halfweight
  } ${x1} ${y1 + halfweight}
  `;
}

const { useConnection } = Presets.classic;

const Svg = styled.svg`
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
`;

const Path = styled.path`
  fill: rgb(0 137 255 / 35%);
  pointer-events: auto;
`;

export function SankeyConnection(props: {
  data: ClassicScheme["Connection"] & { weight: number };
}) {
  const { start, end } = useConnection();

  return (
    start &&
    end && (
      <Svg data-testid="connection">
        <Path
          d={sankeyConnectionPath([start, end], props.data.weight || 50, 0.5)}
        />
      </Svg>
    )
  );
}
