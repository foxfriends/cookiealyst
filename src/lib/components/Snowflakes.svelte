<script lang="ts">
  interface Flake {
    x: number;
    y: number;
    dx: number;
    dy: number;
    size: number;
  }

  let canvas: HTMLCanvasElement | undefined = $state();
  let resetter = $state(Symbol());

  const spawnPerSecond = 2;
  const spawnDistance = 240;

  function reset() {
    resetter = Symbol();
  }

  let flakes: Flake[] = $state([]);

  $effect(() => {
    resetter;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const c = canvas;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    const c2d = canvas.getContext("2d")!;

    let next = window.requestAnimationFrame(animateSnow);
    let previousFrame: DOMHighResTimeStamp = 0;
    let previousSpawn: DOMHighResTimeStamp = 0;

    function spawn() {
      for (let i = 0; i < c.width; i += spawnDistance) {
        const x = Math.round(Math.random() * spawnDistance) - spawnDistance / 2;
        flakes.push({
          x: i + x,
          y: -16,
          size: Math.round(Math.random() * 8 + 4),
          dx: (Math.random() * 4 - 2) / 2,
          dy: (1 + Math.random() * 2) / 2,
        });
      }
    }

    function animateSnow(time: DOMHighResTimeStamp) {
      if (time - previousSpawn > 1000 / spawnPerSecond) {
        previousSpawn = time;
        spawn();
      }

      for (const flake of flakes) {
        flake.x += flake.dx;
        flake.y += flake.dy;
      }
      flakes = flakes.filter((flake) => flake.y < c.height + flake.size);

      c2d.clearRect(0, 0, c.width, c.height);
      c2d.fillStyle = "white";
      for (const { x, y, size } of flakes) {
        c2d.beginPath();
        c2d.arc(x, y, size / 2, 0, 2 * Math.PI);
        c2d.fill();
      }

      next = window.requestAnimationFrame(animateSnow);
    }

    return () => window.cancelAnimationFrame(next);
  });
</script>

<canvas bind:this={canvas}></canvas>

<svelte:window onresize={reset} />

<style>
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
