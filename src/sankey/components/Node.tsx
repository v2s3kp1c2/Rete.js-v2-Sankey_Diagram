import * as React from "react";
import styled, { css } from "styled-components";
import { ClassicScheme, Presets, RenderEmit } from "rete-react-plugin";

const { RefSocket } = Presets.classic;

type NodeExtraData = { width?: number; height?: number };

export const NodeStyles = styled.div<
  NodeExtraData & { selected: boolean; styles?: (props: any) => any }
>`
  background: rgba(110, 136, 255, 0.8);
  border: 2px solid #4e58bf;
  cursor: pointer;
  box-sizing: border-box;
  width: ${(props) =>
    Number.isFinite(props.width) ? `${props.width}px` : `${40}px`};
  height: ${(props) =>
    Number.isFinite(props.height) ? `${props.height}px` : "auto"};
  padding-bottom: 6px;
  position: relative;
  user-select: none;
  ${(props) =>
    props.selected &&
    css`
      background: #ffd92c;
      border-color: #e3c000;
    `}
  .title {
    pointer-events: none;
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 100%;
    box-sizing: border-box;
    height: 100%;
    color: black;
    font-family: sans-serif;
    font-size: 18px;
    padding: 16px;
    .text {
      pointer-events: initial;
    }
  }
  .ports {
    display: flex;
    justify-content: space-between;
  }
  .output-socket {
    margin-right: -2px;
    display: block;
    line-height: 0;
  }
  .input-socket {
    margin-left: -2px;
    display: block;
    line-height: 0;
  }
  ${(props) => props.styles && props.styles(props)}
`;

function sortByIndex<T extends [string, undefined | { index?: number }][]>(
  entries: T
) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;

    return ai - bi;
  });
}

type Props<S extends ClassicScheme> = {
  data: S["Node"] & NodeExtraData;
  styles?: () => any;
  emit: RenderEmit<S>;
};
export type SankeyNodeComponent<Scheme extends ClassicScheme> = (
  props: Props<Scheme>
) => JSX.Element;

export function SankeyNode<Scheme extends ClassicScheme>(props: Props<Scheme>) {
  const inputs = Object.entries(props.data.inputs);
  const outputs = Object.entries(props.data.outputs);
  const selected = props.data.selected || false;
  const { id, label, width, height } = props.data;

  sortByIndex(inputs);
  sortByIndex(outputs);

  return (
    <NodeStyles
      selected={selected}
      width={width}
      height={height}
      styles={props.styles}
      data-testid="node"
    >
      <div className="title" data-testid="title">
        <div className="text">{label}</div>
      </div>
      <div className="ports">
        <div className="inputs">
          {/* Inputs */}
          {inputs.map(
            ([key, input]) =>
              input && (
                <div className="input" key={key} data-testid={`input-${key}`}>
                  <RefSocket
                    name="input-socket"
                    side="input"
                    socketKey={key}
                    nodeId={id}
                    emit={props.emit}
                    payload={input.socket}
                    data-testid="input-socket"
                  />
                </div>
              )
          )}
        </div>
        {/* Outputs */}
        <div className="outputs">
          {outputs.map(
            ([key, output]) =>
              output && (
                <div className="output" key={key} data-testid={`output-${key}`}>
                  <RefSocket
                    name="output-socket"
                    side="output"
                    socketKey={key}
                    nodeId={id}
                    emit={props.emit}
                    payload={output.socket}
                    data-testid="output-socket"
                  />
                </div>
              )
          )}
        </div>
      </div>
    </NodeStyles>
  );
}
