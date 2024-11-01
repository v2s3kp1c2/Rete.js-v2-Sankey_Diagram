import { ClassicPreset as Classic, ConnectionBase, getUID } from 'rete';

export class SankeySocket extends Classic.Socket {
  constructor(public weight: number) {
    super('')
  }
}


type S = {
  [key in string]?: SankeySocket;
}

export class Node extends Classic.Node<S, S, {}> {
  width = 30;
  height = 200;

  constructor(label: string, private capacity: number) {
    super(label)

    this.setCapacity(this.capacity)
  }

  addSankeyInput(key: string, weight: number): void {
    if (this.getUsedCapacity(this.inputs) + weight > this.capacity) throw new Error('capacity overload')
    super.addInput(key, new Classic.Input(new SankeySocket(weight)))
  }

  addSankeyOutput(key: string, weight: number): void {
    if (this.getUsedCapacity(this.outputs) + weight > this.capacity) throw new Error('capacity overload')
    super.addOutput(key, new Classic.Output(new SankeySocket(weight)))
  }

  private getUsedCapacity(ports: Record<string, Classic.Input<SankeySocket> | undefined> | Record<string, Classic.Output<SankeySocket> | undefined>) {
    const weights = Object.values(ports).map(item => item?.socket.weight || 0)
    const sum = (list: number[]) => list.reduce((a, b) => a + b, 0)

    return sum(weights)
  }

  setCapacity(capacity: number) {
    const bordersSpacing = 2

    this.capacity = capacity
    this.height = capacity + bordersSpacing
  }
}

export class Connection<Source extends Node, Target extends Node> implements ConnectionBase {
  id: ConnectionBase['id']
  source: Source['id']
  target: Target['id']
  sourceOutput: string
  targetInput: string
  weight: number

  constructor(source: Source, target: Target, options: { weight: number }) {
    this.id = getUID()
    this.sourceOutput = getUID()
    this.targetInput = getUID()
    this.source = source.id
    this.target = target.id

    this.weight = options.weight
  }
}
