class Snapping {
  getSine(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    let theta_x = Math.atan2(dy, dx);
    if (theta_x < 0) {
      theta_x *= -1;
    }
    const sine = Math.sin(theta_x);
    return sine;
  }

  getCosine(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const theta_y = Math.atan2(dx, dy);
    const cosine = Math.cos(theta_y);
    return cosine;
  }

  snapSymbol(newNode) {
    const edges = graph.getRecall().edges;
    const newNodex = newNode.x;
    const newNodey = newNode.y;

    let x = newNodex;
    let y = newNodey;

    for (let i = 0; i < edges.length; i++) {
      const x1 = edges[i].source.x;
      const y1 = edges[i].source.y;
      const x2 = edges[i].target.x;
      const y2 = edges[i].target.y;

      const sine = this.getSine(x1, y1, x2, y1);
      const cosine = this.getCosine(x1, y1, x2, y2);

      const distanceStart = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
      const distanceEnd = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

      if (distanceStart <= 10) {
        if (x1 < x2) {
          if (y1 < y2) {
            x = x1 - 10 * sine;
            y = y1 - 10 * cosine;
          } else {
            x = x1 - 10 * sine;
            y = y1 + 10 * cosine;
          }
        } else {
          if (y1 < y2) {
            x = x1 + 10 * sine;
            y = y1 - 10 * cosine;
          } else {
            x = x1 + 10 * sine;
            y = y1 + 10 * cosine;
          }
        }
      }
      if (distanceEnd <= 10) {
        if (x1 < x2) {
          if (y1 < y2) {
            x = x2 + 10 * sine;
            y = y2 + 10 * cosine;
          } else {
            x = x2 + 10 * sine;
            y = y2 - 10 * cosine;
          }
        } else {
          if (y1 < y2) {
            x = x2 - 10 * sine;
            y = y2 + 10 * cosine;
          } else {
            x = x2 - 10 * sine;
            y = y2 - 10 * cosine;
          }
        }
      }
    }
    newNode.x = x;
    newNode.y = y;
  }
  addGroupAtLineEnd(x1, y1, x2, y2, x, y) {
    const slope = (y2 - y1) / (x2 - x1);

    const xNew = x2 + (y1 - y2) / slope;

    const angle = Math.atan2(y2 - y1, x2 - x1);

    const xOffset = 10 * Math.cos(angle);
    const yOffset = 10 * Math.sin(angle);

    x = xNew + xOffset;
    y = y1 + yOffset;
  }
}
const snapping = new Snapping();
