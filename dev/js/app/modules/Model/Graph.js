App.define('Model.Graph',{
    
    graph: null,
    
    hasVertice: function(value){
        return this.graph.has(value);
    },
    
    createVertice: function(value){
        return this.graph.add(value);
    },
    
    removeVertice: function (value){
        return this.graph.rm(value);
    },
    
    linkVertices: function(origin, target, weight){
        return this.graph.link(origin, target, weight);
    },
    
    unlinkVerties: function(origin, target){
        return this.graph.unlink(origin, target);
    },

    search: function(handle){
        this.graph.each(handle);
    },
    
    minPath: function(origin, target){
        var minPath = this.graph.minPath(origin, target);
        
        if(!minPath || !minPath.hasVertice(origin) || !minPath.hasVertice(target))
            return null;
        
        return minPath;
    },
    
    init: function(){
        this.graph = new Graph();
    }
});

