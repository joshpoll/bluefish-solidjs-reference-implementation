import {
  For,
  ParentProps,
  batch,
  children,
  createEffect,
  createMemo,
} from "solid-js";
import { useScenegraph } from "./SVG";
import { NameProvider, useName } from "./Scenegraph";
import { produce } from "solid-js/store";

export type RowProps = ParentProps<{
  spacing: number;
}>;

/* 
export const Row: React.FC<
  Omit<LayoutComponentProps, "layoutChildren" | "id">
> = ({ children, spacing, ...bbox }) => {
  const id = useId();

  const layoutChildren = (
    children: React.ReactElement<BBox>[] | React.ReactElement<BBox>,
    spacing: number
  ) => {
    let xOffset = 0;
    let totalHeight = 0;
    let newChildren = React.Children.map(children, (child) => {
      const childWithX = React.cloneElement(child, { x: xOffset });
      xOffset += (child.props.width ?? 0) + spacing;
      totalHeight = Math.max(totalHeight, child.props.height ?? 0);
      return childWithX;
    });
    bbox.width = xOffset - spacing;
    bbox.height = totalHeight;
    return newChildren;
  };

  return (
    <LayoutComponent
      {...bbox}
      id={id}
      spacing={spacing}
      layoutChildren={layoutChildren}
    >
      {children}
    </LayoutComponent>
  );
};
*/

export const Row = (props: RowProps) => {
  const [scenegraph, setScenegraph] = useScenegraph();

  const id = useName();

  setScenegraph(id, {
    bbox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    children: new Set(),
  });

  const children = createMemo(() => {
    return scenegraph[id]?.children ?? new Set();
  });

  // const bbox = createMemo(() => {
  //   console.log("recomputing Row");
  //   console.log("children", children());
  //   let xOffset = 0;
  //   let totalHeight = 0;

  //   // if any of the children don't exist yet, return an empty bbox
  //   for (const child of children()) {
  //     if (scenegraph[child] === undefined) {
  //       return {
  //         x: 0,
  //         y: 0,
  //         width: 0,
  //         height: 0,
  //       };
  //     }
  //   }

  //   for (const child of children()) {
  //     const childBBox = scenegraph[child]?.bbox;
  //     // console.log("before", child, scenegraph[child]);
  //     setScenegraph(child, (old) => {
  //       console.log(old.bbox.x, xOffset);
  //       return {
  //         ...old,
  //         bbox: {
  //           ...old.bbox,
  //         },
  //       };
  //     });
  //     // setScenegraph(child, (old) => {
  //     //   // fast path: if old bbox is the same as the new bbox, don't update
  //     //   if (
  //     //     old.bbox.x === xOffset &&
  //     //     old.bbox.y === 0 &&
  //     //     old.bbox.width === childBBox.width &&
  //     //     old.bbox.height === childBBox.height
  //     //   ) {
  //     //     return old;
  //     //   }
  //     //   return {
  //     //     ...old,
  //     //     bbox: {
  //     //       ...old.bbox,
  //     //       x: xOffset,
  //     //     },
  //     //   };
  //     // });
  //     // console.log("after");
  //     // xOffset += (childBBox.width ?? 0) + props.spacing;
  //     // totalHeight = Math.max(totalHeight, childBBox.height ?? 0);
  //   }

  //   return {
  //     x: 0, // TODO
  //     y: 0, // TODO
  //     width: xOffset - props.spacing,
  //     height: totalHeight,
  //   };
  // });

  // createEffect(() => {
  //   batch(() => {
  //     setScenegraph(id, (old) => ({
  //       ...old,
  //       bbox: bbox(),
  //     }));
  //   });
  // });

  // createEffect(() => {
  //   batch(() => {
  //     let xOffset = 0;
  //     let totalHeight = 0;

  //     for (const child of children()) {
  //       const childBBox = scenegraph[child]?.bbox;
  //       setScenegraph(
  //         child,
  //         produce((old) => {
  //           old.bbox.x = xOffset;
  //         })
  //       );
  //       xOffset += (childBBox.width ?? 0) + props.spacing;
  //       totalHeight = Math.max(totalHeight, childBBox.height ?? 0);
  //     }
  //     const bbox = {
  //       x: 0, // TODO
  //       y: 0, // TODO
  //       width: xOffset - props.spacing,
  //       height: totalHeight,
  //     };

  //     setScenegraph(id, (old) => ({
  //       ...old,
  //       bbox: bbox,
  //     }));
  //   });
  // });

  // perform layout
  const bbox = createMemo(() => {
    // if any of the children don't exist yet, return an empty bbox
    // this ensures that scenegraph lookups are always valid
    for (const child of children()) {
      if (scenegraph[child] === undefined) {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        };
      }
    }

    let xOffset = 0;
    let totalHeight = 0;

    for (const child of children()) {
      // TODO: I could curry this and make a setChildBBox function...
      setScenegraph(
        child,
        produce((old) => {
          old.bbox.x = xOffset;
        })
      );
      const childBBox = scenegraph[child].bbox;
      xOffset += (childBBox.width ?? 0) + props.spacing;
      totalHeight = Math.max(totalHeight, childBBox.height ?? 0);
    }

    return {
      x: 0, // TODO
      y: 0, // TODO
      width: xOffset - props.spacing,
      height: totalHeight,
    };
  });

  // keep scenegraph up to date
  createEffect(() => {
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
