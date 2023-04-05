class Utilities{
    isCloseLine(x, y){
        let node = new Node(x, y);

        const edges = graph.getRecall().edges;
        for(let i=0; i<edges.length; i++){
            const x1 = edges[i].source.x;
            const y1 = edges[i].source.y;
            const x2 = edges[i].target.x;
            const y2 = edges[i].target.y;
            
            const start = Math.sqrt( (x - x1) ** 2 + (y - y1) ** 2 );
            const end = Math.sqrt( (x - x2) ** 2 + (y - y2) ** 2 );

            if(start <= 10){
                node = new Node(x1, y1);
            }
            else if(end <= 10){
                node = new Node(x2, y2);
            }
        }
        return node;  
    }

    deleteShortLine(node1, node2){
        if(node1 && node2){
            const x1 = node1.x;
            const y1 = node1.y;
            const x2 = node2.x;
            const y2 = node2.y;
            const distance = Math.sqrt(
              (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
            );
            if (distance <= 20) {
              if(distance === 0){
                editor.iconPopup.classList.toggle("show");
                editor.x = x1;
                editor.y = y1;
                editor.openIconPopup(x1, y1);            
              }
              return true;
            }            
        }
        return false;        
    }

    getPerpendicularDistance(x, y, node1, node2){
        let distance;
        if(node1 && node2){
            const x1 = parseInt(node1.x);
            const y1 = parseInt(node1.y);
            const x2 = parseInt(node2.x);
            const y2 = parseInt(node2.y);

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
              const projectionXDiff = projection * (x2 - x1)
              const projectionX = projectionXDiff  + x1;
              const projectionY = y1 + (projection * (y2 - y1));
              distance = Math.sqrt(((x - projectionX) ** 2) + ((y - projectionY)**2));
            }  
                      
        }
        else if (node1) {
            const x1 = node1.x;
            const y1 = node1.y;
            const dx = Math.abs(x1 - x);
            const dy = Math.abs(y1 - y);
            distance = Math.sqrt(dx * dx + dy * dy);            
        }
        return distance;
    }

    highlightLines(x, y) {
      for (const element of editor.element.children) {
        let distance = snapping.getPerpendicularDistance(x, y, element);
        if (distance <= 15) {
          element.classList.add("highlight");
        } else {
          element.classList.remove("highlight");
        }
      }
    }
}
const utilities = new Utilities();
