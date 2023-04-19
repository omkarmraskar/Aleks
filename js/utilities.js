class Utilities {
  // Checks if the given coordinates are close to a node in the graph
  isCloseLine(x, y) {
    let node = new Node(x, y);

    const nodes = graph.getRecall().nodes;
    for (let i = 0; i < nodes.length; i++) {
      const x1 = nodes[i].x;
      const y1 = nodes[i].y;

      const distance = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);

      if (distance <= 10) {
        node = new Node(x1, y1);
      }
    }
    return node;
  }
  // Deletes a line if it is too short
  deleteShortLine(x1, y1, x2, y2) {
    const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    if (distance <= 20) {
      editor.iconPopup.classList.toggle("show");
      editor.x = x1;
      editor.y = y1;
      editor.openIconPopup(x1, y1);
      return true;
    }
    return false;
  }
  // Calculates the perpendicular distance between two points
  getPerpendicularDistance(x, y, x1, y1, x2, y2) {
    let distance;
    if (x1 && y1 && x2 && y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const dotProduct = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
      const projection = dotProduct / (length * length);

      //if projection is before line
      if (projection < 0) {
        distance = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
      }
      //if projection is after line
      else if (projection > 1) {
        distance = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
      }
      //if projection is on the line
      else {
        const projectionXDiff = projection * (x2 - x1);
        const projectionX = projectionXDiff + x1;
        const projectionY = y1 + projection * (y2 - y1);
        distance = Math.sqrt((x - projectionX) ** 2 + (y - projectionY) ** 2);
      }
    } else if (x1 && y1) {
      // const x1 = node1.x;
      // const y1 = node1.y;
      const dx = Math.abs(x1 - x);
      const dy = Math.abs(y1 - y);
      distance = Math.sqrt(dx * dx + dy * dy);
    }
    return distance;
  }
  // Highlights lines that are close to the given coordinates
  highlightLines(x, y) {
    for (const element of editor.element.children) {
      let distance;
      if (element.tagName === "line") {
        const x1 = parseInt(element.getAttribute("x1"));
        const y1 = parseInt(element.getAttribute("y1"));
        const x2 = parseInt(element.getAttribute("x2"));
        const y2 = parseInt(element.getAttribute("y2"));
        distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
      } else if (element.tagName === "g") {
        const htmlTag = element.getAttribute("transform");
        // Regular expression to extract the numbers inside the parentheses of the translate() function
        let pattern = /translate\((\d+),(\d+)\)/;

        // Extracting the values using the regular expression
        let match = htmlTag.match(pattern);
        // Storing the values in variables x and y
        let x1, y1;
        if (match) {
          x1 = parseInt(match[1]);
          y1 = parseInt(match[2]);
        }
        distance = this.getPerpendicularDistance(x, y, x1, y1);
      }
      // let distance = this.getPerpendicularDistance(x, y, x1, y1, x2, y2);
      if (distance <= 15) {
        element.classList.add("highlight");
      } else {
        element.classList.remove("highlight");
      }
    }
  }
}
const utilities = new Utilities();
