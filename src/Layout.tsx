import { ParentProps, createEffect, createMemo } from "solid-js";
import { BBox, useName } from "./Scenegraph";
import { useScenegraph } from "./SVG";

export type LayoutProps = ParentProps<{
  layout: (children: Set<string>) => BBox;
}>;

export const Layout = (props: LayoutProps) => {
  const id = useName();
  const [scenegraph, setScenegraph] = useScenegraph();

  // initialize scenegraph node
  setScenegraph(id, {
    bbox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    children: new Set(),
  });

  // keep scenegraph up to date
  createEffect(() => {
    const children = () => {
      const children = scenegraph[id]?.children ?? new Set();
      // const childNodes = Array.from(children).map((child) => scenegraph[child]);
      // if any of the childNodes are undefined, return undefined
      // if (childNodes.some((child) => child === undefined)) {
      //   return undefined;
      // }
      return children;
    };

    const bbox = () => {
      return props.layout(children());
    };
    setScenegraph(id, (old) => ({
      ...old,
      bbox: bbox(),
    }));
  });

  return (
    <g
      transform={`translate(${scenegraph[id].bbox.x ?? 0}, ${
        scenegraph[id].bbox.y ?? 0
      })`}
    >
      {props.children}
    </g>
  );
};
