import { BaseSchemes, GetSchemes, NodeEditor, NodeId } from 'rete'
import { AreaPlugin, NodeView } from 'rete-area-plugin'

type Schemes = GetSchemes<BaseSchemes['Node'] & { width: number, height: number }, BaseSchemes['Connection']>

async function getRects<S extends Schemes>(nodes: NodeId[], area: AreaPlugin<S, any>) {
  const editor = area.parentScope(NodeEditor<S>)

  const views = (await Promise.all(nodes.map(id => {
    return {
      node: editor.getNode(id),
      view: area.nodeViews.get(id)
    }
  }))).filter(n => n.view) as {
    node: S['Node'];
    view: NodeView;
  }[]

  return views.map(({ view, node }) => {
    return {
      position: view.position,
      width: node.width,
      height: node.height
    }
  })
}
export function createSankeyRestrictor(area: AreaPlugin<Schemes, any>) {
  const editor = area.parentScope(NodeEditor<Schemes>)
  let enabled = false

  area.addPipe(async context => {
    if (enabled && context.type === 'nodetranslate') {
      const { data } = context
      const incomers = editor.getConnections().filter(c => c.target === data.id).map(c => c.source)
      const outgoers = editor.getConnections().filter(c => c.source === data.id).map(c => c.target)
      const incomerRects = await getRects(incomers, area)
      const outgoersRects = await getRects(outgoers, area)
      const node = editor.getNode(data.id)


      const leftBorder = Math.max(...incomerRects.map(n => n.position.x + n.width))
      const rightBorder = Math.min(...outgoersRects.map(n => n.position.x))

      return {
        ...context,
        data: {
          ...data,
          position: {
            x: Math.min(Math.max(leftBorder, data.position.x), rightBorder - node.width),
            y: data.position.y
          }
        }
      }
    }
    return context
  })

  return {
    enable() {
      enabled = true
    },
    disable() {
      enabled = false
    }
  }
}
