import { visit } from 'unist-util-visit'

export function rehypeImageProcessor() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Skip non-paragraph elements, empty paragraphs, and orphaned nodes
      if (node.tagName !== 'p' || !node.children?.length || !parent) {
        return
      }

      // Collect images from paragraph
      const imgNodes = []
      for (const child of node.children) {
        if (child.tagName === 'img') {
          // Add lazy loading and async decoding
          child.properties = child.properties || {}
          child.properties.loading = 'lazy'
          child.properties.decoding = 'async'
          imgNodes.push(child)
        }
        else if (child.type !== 'text' || child.value.trim() !== '') {
          return // Skip paragraphs with non-image content
        }
      }

      if (imgNodes.length === 0) {
        return
      }

      const isInGallery = parent?.properties?.className?.includes('gallery-container')

      // Gallery container: convert images to figures
      if (isInGallery) {
        const figures = imgNodes.map(imgNode => createFigure(imgNode, true))
        parent.children.splice(index, 1, ...figures)
        return
      }

      // Single image: convert to figure in non-gallery containers
      if (imgNodes.length === 1) {
        const figure = createFigure(imgNodes[0], false)
        // Always ensure it's a figure for LQIP background
        if (node.tagName !== 'figure') {
          node.tagName = 'figure'
          node.properties = figure.properties
          node.children = figure.children
        }
        return
      }

      // Multiple images: wrap each in figure
      const figures = imgNodes.map(imgNode => createFigure(imgNode, false))
      parent.children.splice(index, 1, ...figures)
    })
  }
}

function createFigure(imgNode, isInGallery = false) {
  // Add opacity transition classes to image
  imgNode.properties = imgNode.properties || {}
  imgNode.properties.className = (imgNode.properties.className || []).concat(['opacity-0', 'transition-opacity', 'duration-500'])

  const altText = imgNode.properties?.alt
  const shouldSkipCaption = !altText || altText.startsWith('_')

  const children = [imgNode]

  if (!shouldSkipCaption && !isInGallery) {
    children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: {},
      children: [{ type: 'text', value: altText }],
    })
  }

  return {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: isInGallery ? ['gallery-item', 'relative', 'overflow-hidden'] : ['relative', 'overflow-hidden'],
    },
    children,
  }
}
