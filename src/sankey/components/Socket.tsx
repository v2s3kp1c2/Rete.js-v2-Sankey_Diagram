import * as React from "react";
import styled from "styled-components";
import { SankeySocket as Model } from "../models";

const Styles = styled.div<{ weight: number }>`
  display: inline-block;
  cursor: pointer;
  width: 2px;
  height: ${(props) => props.weight}px;
  vertical-align: middle;
  background: transparent;
  z-index: 2;
  box-sizing: border-box;
`;

const Handle = styled.div`
  background: red;
`;

export function SankeySocket<T extends Model>(props: { data: T }) {
  return (
    <Styles title={props.data.name} weight={props.data.weight}>
      <Handle />
    </Styles>
  );
}
