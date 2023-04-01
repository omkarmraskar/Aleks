class Snapping {
    getPerpendicularDistance(x, y, element) {
      let distance;
  
      if (element.tagName === "line") {
        const x1 = Number(element.getAttribute("x1"));
        const y1 = Number(element.getAttribute("y1"));
        const x2 = Number(element.getAttribute("x2"));
        const y2 = Number(element.getAttribute("y2"));
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
          const projectionX = x1 + projection * (x2 - x1);
          const projectionY = y1 + projection * (y2 - y1);
          distance = Math.sqrt(
            (x - projectionX) * (x - projectionX) +
              (y - projectionY) * (y - projectionY)
          );
        }
      } 
      else if (element.tagName === "g") {
        const txt = element.childNodes[0];
        const bbox = txt.getBoundingClientRect();
  
        const closestX = bbox.x;
        const closestY = bbox.y;
  
        // Calculate the distance to the closest point
        const dx = Math.abs(closestX - x);
        const dy = Math.abs(closestY - y);
        distance = Math.sqrt(dx * dx + dy * dy);
      }
  
      return distance;
    }
    highlightLines(x, y) {
      for (const shape of editor.shapes) {
        const element = shape.element;
  
        let distance = snapping.getPerpendicularDistance(x, y, element);
        if (distance <= 15) {
          element.classList.add("highlight");
        } 
        else {
          element.classList.remove("highlight");
        }
      }
    }
  }
  const snapping = new Snapping();