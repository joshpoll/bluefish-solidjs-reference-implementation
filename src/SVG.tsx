import { ParentProps, createContext, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { Scenegraph, ScenegraphContext } from "./Scenegraph";

export type SVGProps = ParentProps<{
  width: number;
  height: number;
}>;

export const SVG = (props: SVGProps) => {
  const [scenegraph, setScenegraph] = createStore<Scenegraph>({});

  return (
    <svg width={props.width} height={props.height}>
      <ScenegraphContext.Provider value={[scenegraph, setScenegraph]}>
        {props.children}
      </ScenegraphContext.Provider>
    </svg>
  );
};

export const useScenegraph = () => {
  return useContext(ScenegraphContext);
};
