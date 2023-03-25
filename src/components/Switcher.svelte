<script lang="ts">
  import { twMerge } from "tailwind-merge";

  type TransitionState =
    | "Hold"
    | "Right Extend"
    | "Right Move"
    | "Right Shrink"
    | "Left Extend"
    | "Left Move"
    | "Left Shrink";
  
  const dots = [
    { id: "swap_left", index: 0 },
    { id: "left", index: 1 },
    { id: "central", index: 2 },
    { id: "right", index: 3 },
    { id: "swap_right", index: 4 },
  ] as const;

  type SelectsDots<T> = T extends { id: string; index: number } ? T : never;

  type Dot = SelectsDots<typeof dots[keyof typeof dots]>;

  export let onNext: () => void;
  export let onPrev: () => void;

  let transitionState: TransitionState = "Hold";

  const movingDots = (newState: TransitionState) => {
    let timeoutId: number;
    switch (newState) {
      case "Right Extend": {
        timeoutId = setTimeout(() => {
          transitionState = "Right Move";
        }, 500);
        break;
      }
      case "Right Move": {
        timeoutId = setTimeout(() => {
          transitionState = "Right Shrink";
        }, 300);
        break;
      }
      case "Left Shrink":
      case "Right Shrink": {
        timeoutId = setTimeout(() => {
          transitionState = "Hold";
        }, 700);
        break;
      }
      case "Left Extend": {
        timeoutId = setTimeout(() => {
          transitionState = "Left Move";
        }, 500);
        break;
      }
      case "Left Move": {
        timeoutId = setTimeout(() => {
          transitionState = "Left Shrink";
        }, 300);
        break;
      }
    }
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }

  const changeDot = (dot: Dot) => () => {
    switch (dot.id) {
      case "left": {
        onPrev();
        transitionState = "Left Extend";
        break;
      }
      case "right": {
        onNext();
        transitionState = "Right Extend";
        break;
      }
    }
  }
  $: movingDots(transitionState);
</script>

<div
  class={twMerge(
    "relative flex gap-3 justify-between items-center rounded-full bg-purple-700 p-1",
  )}
>
  {#each dots as dot (dot.id)}
   <div
    role="button"
    class={twMerge(
      "rounded-full h-5 w-5 bg-white hover:bg-orange-500 active:bg-yellow-500 active:scale-90 duration-500 cursor-pointer",
      dot.id == "central" && "bg-yellow-500",
      dot.id == "central" &&
        transitionState == "Right Extend" &&
        "absolute w-[53px] left-[40%] transition-all rounded-3xl",
      dot.id == "central" &&
        transitionState == "Right Move" &&
        "absolute w-[53px] transition-all left-[3px] duration-300",
      dot.id == "central" &&
        transitionState == "Right Shrink" &&
        "absolute transition-all w-5 left-[40%] duration-700",
      (dot.id == "swap_left" || dot.id == "swap_right") &&
        "opacity-0 absolute -z-10",
      dot.id == "swap_right" &&
        transitionState == "Right Extend" &&
        "opacity-0 static",
      dot.id == "swap_right" &&
        transitionState == "Right Move" &&
        "opacity-0 static",
      dot.id == "swap_right" &&
        transitionState == "Right Shrink" &&
        "opacity-100 static transition-opacity z-auto",
      dot.id == "central" &&
        transitionState == "Left Extend" &&
        "absolute w-[53px] -translate-x-8 left-[40%] transition-all rounded-3xl",
      dot.id == "central" &&
        transitionState == "Left Move" &&
        "absolute w-[53px] transition-all right-[3px] duration-300",
      dot.id == "central" &&
        transitionState == "Left Shrink" &&
        "absolute transition-all w-5 left-[39%] duration-700",
      dot.id == "swap_left" &&
        transitionState == "Left Extend" &&
        "opacity-0 static",
      dot.id == "swap_left" &&
        transitionState == "Left Move" &&
        "opacity-0 static",
      dot.id == "swap_left" &&
        transitionState == "Left Shrink" &&
        "opacity-100 static transition-opacity z-auto",
    )}
    on:click={changeDot(dot)}
    ></div>
  {/each}
</div>
