App.define('ViewModel.Actions',{

    animationsTimeOut: null,

    getGraph: function(){
        return this.get('Model.Graph');
    },
    
    getRaster: function(){
        return this.get('View.SvgRaster');
    },

    getTransitionTime: function(){
        return 500;
    },

    createVertice: function(value){
        
        value = parseFloat(value);
        if(isNaN(value)){
            // TODO: Erro no console e no toast
            console.log('Valor inválido');
            return false;
        }
        
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

        weight = typeof(weight) === 'number' ? weight : 1;

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
    },

    search: function(){
        var me = this,
            graph = this.getGraph(),
            raster = this.getRaster(),
            time = me.getTransitionTime(),
            count = 0, founded = [];

        me.clearAnimationsTimeOut();
        me.animationsTimeOut = [];
        me.clearClasses();

        graph.search(function(vertice, origin){
            founded.push(vertice);
            me.animationsTimeOut.push(
                setTimeout(function(){

                    if(origin !== null){
                        var edge = $('#edges > .edge[data-origin='+origin+'][data-target='+vertice+']')[0];
                        edge.classList.add('visited');
                    }

                    vertice = raster.getVertice(vertice);
                    vertice.addClass('visited');

                }, time*count)
            );
            count++;
        });

        // TODO: Erro no console apenas
        console.log('Encontrado:', founded);
    },
    
    minPath: function(origin, target){
        
        var me = this,
            graph = me.getGraph(),
            raster = me.getRaster(),
            result;
        
        result = graph.minPath(origin, target);
        
        if(result === null){
            // TODO: Erro no console e toast
            console.log("Não existe caminho");
            return;
        }
        
        me.clearAnimationsTimeOut();
        me.animationsTimeOut = [];
        me.clearClasses();
        
        var time = me.getTransitionTime(),
            count = 0,
            handle, vertices;
        
        handle = function(vertice, edge){
            
            me.animationsTimeOut.push(
                    
                setTimeout(function(){

                    if(edge !== null)
                        edge.classList.add('min-path-vertice');
    
                    vertice.addClass('min-path-vertice');
                }, time*count)
            );

            count++;
        };
        
        vertices = result.vertices;
        for(var i in vertices){
            handle(
                raster.getVertice(vertices[i]),
                vertices[i] === origin ?
                    null : $('#edges > .edge[data-origin='+vertices[i - 1]+'][data-target='+vertices[i]+']')[0]
            );
        }
        
        // TODO: Erro no console apenas
        console.log(result);
    },
    
    clearAnimationsTimeOut: function(){

        if(this.animationsTimeOut === null) return;

        for(var i in this.animationsTimeOut){
            clearTimeout(this.animationsTimeOut[i]);
        }

        this.animationsTimeOut = null;
    },

    clearClasses: function(){
        $('.visited, .min-path-vertice').each(function(i, vertice){
            vertice.classList.remove('visited');
            vertice.classList.remove('min-path-vertice');
        });
    },

    init: function(){
        var me = this;

        $('#canvas').on('select', function(){
            me.clearAnimationsTimeOut();
            me.animationsTimeOut = [];
            me.clearClasses();
        });
    }
});


