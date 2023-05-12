import { Component, For, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { Rect } from "./Rect";
import { SVG } from "./SVG";
import { Row } from "./Row";
import { NameProvider } from "./Scenegraph";

const App: Component = () => {
  const [spacing, setSpacing] = createSignal(10);

  const barHeights = Array.from({ length: 10 }, () => Math.random() * 100);

  return (
    <div class={styles.App}>
      <input
        type="range"
        min={0}
        max={100}
        value={spacing()}
        onInput={(e) => setSpacing(Number(e.target.value))}
      />
      <br />
      <svg width={1000} height={100}>
        <g>
          <For each={barHeights}>
            {(barHeight, i) => (
              <rect
                x={i() * (10 + spacing())}
                y={100 - barHeight}
                width={10}
                height={barHeight}
                fill="red"
              />
            )}
          </For>
        </g>
      </svg>
      {/* <SVG width={1000} height={100}>
        <g>
          <For each={barHeights}>
            {(barHeight, i) => (
              <Rect
                // id={i().toString()}
                x={i() * (10 + spacing())}
                y={100 - barHeight}
                width={10}
                height={barHeight}
                fill="red"
              />
            )}
          </For>
        </g>
      </SVG> */}
      <SVG width={1000} height={100}>
        <NameProvider>
          <Row spacing={spacing()}>
            <For each={barHeights}>
              {(barHeight, i) => (
                <NameProvider>
                  <Rect
                    y={100 - barHeight}
                    width={10}
                    height={barHeight}
                    fill="red"
                  />
                </NameProvider>
              )}
            </For>
          </Row>
        </NameProvider>
      </SVG>
      <SVG width={1000} height={100}>
        <NameProvider>
          <Row spacing={spacing() * 2}>
            <For each={Array.from({ length: 3 })}>
              {(_, _i) => (
                <NameProvider>
                  <Row spacing={spacing()}>
                    <For each={barHeights}>
                      {(barHeight, _i) => (
                        <NameProvider>
                          <Rect
                            y={100 - barHeight}
                            width={10}
                            height={barHeight}
                            fill="red"
                          />
                        </NameProvider>
                      )}
                    </For>
                  </Row>
                </NameProvider>
              )}
            </For>
          </Row>
        </NameProvider>
      </SVG>
    </div>
  );
};

export default App;
