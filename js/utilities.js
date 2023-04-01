class Utilities{
    isClose(x, y){
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
        const x1 = node1.x;
        const y1 = node1.y;
        const x2 = node2.x;
        const y2 = node2.y;
        const distance = Math.sqrt(
          (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
        );
        if (distance <= 20) {
          editor.iconPopup.classList.toggle("show");
          editor.x = x1;
          editor.y = y1;
          editor.openIconPopup(x1, y1);
          return true;
        }
        return false;        
    }
}
const utilities = new Utilities();
