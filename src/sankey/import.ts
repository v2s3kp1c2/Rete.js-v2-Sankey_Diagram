import { GetSchemes, NodeEditor } from "rete";
import { Connection, Node } from "./models";

export async function importGraph<
  S extends GetSchemes<Node, Connection<Node, Node>>
>(editor: NodeEditor<S>) {
  const solar = new Node("Solar energy", 80);
  const wind = new Node("Wind energy", 50);
  const main = new Node("Main energy source", 170);

  await editor.addNode(solar);
  await editor.addNode(wind);
  await editor.addNode(main);

  const drawing = new Node("Drawing room", 80);
  const bed = new Node("Bed room", 40);
  const kitchen = new Node("Kitchen", 180);

  await editor.addNode(drawing);
  await editor.addNode(bed);
  await editor.addNode(kitchen);

  const ac = new Node("AC", 105);
  const bulbs = new Node("Bulbs", 20);
  const stove = new Node("Stove", 75);
  const oven = new Node("Oven", 70);
  const fridge = new Node("Fridge", 30);

  await editor.addNode(ac);
  await editor.addNode(bulbs);
  await editor.addNode(stove);
  await editor.addNode(oven);
  await editor.addNode(fridge);

  const links = [
    [solar, drawing, 40],
    [solar, bed, 20],
    [solar, kitchen, 20],

    [wind, bed, 20],
    [wind, kitchen, 30],

    [main, drawing, 40],
    [main, kitchen, 130],

    [drawing, ac, 70],
    [bed, ac, 35],

    [drawing, bulbs, 10],
    [bed, bulbs, 5],

    [kitchen, bulbs, 5],
    [kitchen, stove, 75],
    [kitchen, oven, 70],
    [kitchen, fridge, 30]
  ] as const;

  for (const [source, target, weight] of links) {
    const connection = new Connection(source, target, { weight });

    source.addSankeyOutput(connection.sourceOutput, connection.weight);
    target.addSankeyInput(connection.targetInput, connection.weight);

    await editor.addConnection(connection);
  }
}
