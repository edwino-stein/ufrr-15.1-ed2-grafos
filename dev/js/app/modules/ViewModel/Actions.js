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
            count++;
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
        });

        // TODO: Erro no console apenas
        console.log('Encontrado:', founded);
    },

    clearAnimationsTimeOut: function(){

        if(this.animationsTimeOut === null) return;

        for(var i in this.animationsTimeOut){
            clearTimeout(this.animationsTimeOut[i]);
        }

        this.animationsTimeOut = null;
    },

    clearClasses: function(){

        $('.visited').each(function(i, vertice){
            vertice.classList.remove('visited');
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


