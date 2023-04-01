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
}
const utilites = new Utilities();
