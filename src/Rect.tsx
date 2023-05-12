import { createEffect, createSignal } from "solid-js";
import { useScenegraph } from "./SVG";
import { useName } from "./Scenegraph";

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
};

export const Rect = (props: RectProps) => {
  const [scenegraph, setScenegraph] = useScenegraph();

  const id = useName();

  setScenegraph(id, {
    bbox: {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    },
    children: new Set(),
  });

  return (
    <rect
      x={scenegraph[id]?.bbox.x}
      y={scenegraph[id]?.bbox.y}
      width={scenegraph[id]?.bbox.width}
      height={scenegraph[id]?.bbox.height}
      fill={props.fill}
    />
  );
};
