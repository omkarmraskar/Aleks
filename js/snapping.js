class Snapping {

    snapSymbol(newNode){
      const edges = graph.getRecall().edges;
      const newNodex = newNode.x;
      const newNodey = newNode.y;

      let x = newNodex;
      let y = newNodey;

      for(let i=0; i<edges.length; i++){
        const x1 = edges[i].source.x;
        const y1 = edges[i].source.y;
        const x2 = edges[i].target.x;
        const y2 = edges[i].target.y;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx*dx + dy*dy);
        const unitDx = dx / length;
        const unitDy = dy / length;
        const dist = Math.abs((y2-y1)*x - (x2-x1)*y + x2*y1 - y2*x1) / length;
      
        // Check if point is within 10 pixels of line
        if (dist <= 10) {
          // Calculate candidate points on line
          const candidate1 = [x1 - unitDx * 10, y1 - unitDy * 10];
          const candidate2 = [x2 + unitDx * 10, y2 + unitDy * 10];
      
          // Choose candidate that is closer to the point
          const dist1 = Math.sqrt((x-candidate1[0])**2 + (y-candidate1[1])**2);
          const dist2 = Math.sqrt((x-candidate2[0])**2 + (y-candidate2[1])**2);
          const candidate = dist1 < dist2 ? candidate1 : candidate2;
      
          // Update point to be 10 pixels away from closest endpoint on line
          x = candidate[0];
          y = candidate[1];
        }        
      }
      newNode.x = x;
      newNode.y = y;
    }
  }
  const snapping = new Snapping();