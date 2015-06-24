App.define('ViewModel.Actions',{
    
    getGraph: function(){
        return this.get('Model.Graph');
    },
    
    getRaster: function(){
        return this.get('View.SvgRaster');
    },
    
    createVertice: function(value){
        
        if(!this.getGraph().createVertice(value)){
            // TODO: Erro no console e no toast
            console.log('O vertice já existe');
            return false;
        }

        var point = App.get('View.Canvas').getFreePoint();
        this.getRaster().createVertice(value, point.x, point.y);
    },

    removeVertice: function(value){

        if(!this.getGraph().removeVertice(value)){
            // TODO: Erro no console e no toast
            console.log('O vertice não existe');
            return false;
        }
        
        var raster = this.getRaster();
        raster.removeVertice(raster.getVertice(value));
    },
    
    linkVertices: function(origin, target, weight){
        
        var graph = this.getGraph(),
            raster = this.getRaster();
        
        if(!graph.hasVertice(origin))
            this.createVertice(origin);
        
        if(!graph.hasVertice(target))
            this.createVertice(target);
        
        if(!graph.linkVertices(origin, target, weight)){
            // TODO: Erro no console e no toast
            console.log('erro');
            return false;
        }
        
        origin = raster.getVertice(origin);
        target = raster.getVertice(target);
        
        raster.removeEdge(
            origin,
            target
        );
        
        raster.createEdge(
            origin,
            target,
            weight
        );
    },
    
    unlinkVertices:function(origin, target){
        
        var graph = this.getGraph(),
            raster = this.getRaster();
        
        if(!graph.hasVertice(origin)){
            // TODO: Erro no console e no toast
            console.log('Error');
            return;
        }
        
        if(!graph.hasVertice(target)){
            // TODO: Erro no console e no toast
            console.log('Error');
            return;
        }
        
        graph.unlinkVerties(origin, target);
        raster.removeEdge(
            raster.getVertice(origin),
            raster.getVertice(target)
        );
    }
});


