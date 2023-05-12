import { ParentProps, createContext, useContext } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import { v4 as uuid } from "uuid";

export type Id = string;

export type BBox = Partial<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type ScenegraphNode = {
  bbox: BBox;
  children: Set<Id>;
};

export type Scenegraph = Record<string, ScenegraphNode>;

export const ScenegraphContext = createContext<
  [get: Scenegraph, set: SetStoreFunction<Scenegraph>]
>([{}, () => {}]);

export const NameContext = createContext<string>();

export const NameProvider = (props: ParentProps) => {
  const freshName = uuid();

  const parentName = useContext(NameContext);
  const [_, setScenegraph] = useContext(ScenegraphContext);
  if (parentName !== undefined) {
    setScenegraph(parentName, (node) => {
      return {
        bbox: node.bbox,
        children: new Set([...node.children, freshName]),
      };
    });
  }

  return (
    <NameContext.Provider value={freshName}>
      {props.children}
    </NameContext.Provider>
  );
};

export const useName = () => {
  const name = useContext(NameContext);
  if (name === undefined)
    throw new Error("useName must be used within a NameProvider");
  return name;
};
