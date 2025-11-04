import { useEffect, useRef } from "react";
import kaplay from "kaplay";
import { crew } from "@kaplayjs/crew";

export function Game() {
  const canvasRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const k = kaplay({
      width: 800,
      height: 200,
      plugins: [crew],
      global: false,
      canvas: canvasRef.current,
    });

    k.loadCrew("sprite", "bean");

    let direction = 1;
    let speed = 6.0;

    const bean = k.add([k.sprite("bean"), k.pos(80, 40), k.area()]);

    const spawnTree = () => {
      k.add([k.rect(40, 20), k.area(), k.outline(4), k.pos(k.width(), k.rand(0, k.height() - 20)), k.color(255, 180, 255), k.move(k.Vec2.LEFT, speed * 60), "tree"]);
      k.wait(k.rand(0.2, 0.8), () => {
        spawnTree();
      });
    };

    k.onKeyDown("space", () => (direction = -1));
    k.onKeyRelease("space", () => (direction = 1));

    k.onUpdate(() => (bean.pos.y = k.clamp(bean.pos.y + speed * direction, 0, k.height() - bean.height)));

    bean.onCollide("tree", () => {
      k.addKaboom(bean.pos);
      k.shake();
    });

    spawnTree();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
