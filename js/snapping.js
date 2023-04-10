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

    snapSymbol(x, y){
      const edges = graph.getRecall().edges;
      const nodes = graph.getRecall().nodes;
      
    }
  }
  const snapping = new Snapping();