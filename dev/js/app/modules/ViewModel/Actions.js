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
    
    clearGraph: function(){
        
        var graph = this.getGraph(),
            vertices = [];
        
        for(var i in graph.graph.vertices)
            vertices.push(i);
        
        if(vertices.length <= 0) return;
        
        App.get('ViewModel.AlertBroadcast').disableToast();
        App.get('ViewModel.AlertBroadcast').disableConsole();
                
        while(vertices.length > 0)
            this.removeVertice(parseFloat(vertices.pop()));
       
        App.get('ViewModel.AlertBroadcast').enableToast();
        App.get('ViewModel.AlertBroadcast').enableConsole();
        
        $('#canvas').trigger('alert-info', [{
            console: {
                title: 'O Grafo foi limpo!'
            }
        }]);
    },
    
    createVertice: function(value){
        
        this.clearAnimationsTimeOut();
        this.animationsTimeOut = [];
        this.clearClasses();
        
        value = parseFloat(value);
        if(isNaN(value)){
            
            $('#canvas').trigger('alert-error', [{
                toast: 'Valor informado é inválido!',
                console: {
                    title: 'Valor informado é inválido!',
                    body: '<p>Utilize apenas <b>números</b></p>Exemplo: 123, 123.456, etc.'
                }
            }]);
        
            return false;
        }
        
        if(!this.getGraph().createVertice(value)){
            
            $('#canvas').trigger('alert-warning', [{
                toast: 'O vértice já existe no grafo!',
                console: {
                    title: 'O vértice já existe no grafo!',
                    body: 'Já existe um vértice com o valor <b>'+value+'</b> no grafo.'
                }
            }]);
        
            return false;
        }

        var point = App.get('View.Canvas').getFreePoint();
        this.getRaster().createVertice(value, point.x, point.y);
        
        $('#canvas').trigger('alert-success', [{
            toast: 'O vértice foi criado!',
            console: {
                title: 'O vértice foi criado!',
                body: 'O vértice com o valor <b>'+value+'</b> foi adicionado ao grafo.'
            }
        }]);
    
        return true;
    },

    removeVertice: function(value){
        
        this.clearAnimationsTimeOut();
        this.animationsTimeOut = [];
        this.clearClasses();
        
        if(!this.getGraph().removeVertice(value)){
            
            $('#canvas').trigger('alert-warning', [{
                toast: 'O vértice não existe no grafo!',
                console: {
                    title: 'O vértice não existe no grafo!',
                    body: 'O vértice com o valor <b>'+value+'</b> não está presente no grafo.'
                }
            }]);
        
            return false;
        }
        
        var raster = this.getRaster();
        raster.removeVertice(raster.getVertice(value));
        
        $('#canvas').trigger('alert-success', [{
            toast: 'O vértice foi removido!',
            console: {
                title: 'O vértice foi removido!',
                body: 'O vértice com o valor <b>'+value+'</b> foi removido do grafo.'
            }
        }]);
        
        return true;
    },

    linkVertices: function(origin, target, weight){
        
        this.clearAnimationsTimeOut();
        this.animationsTimeOut = [];
        this.clearClasses();
        
        var graph = this.getGraph(),
            raster = this.getRaster();

        if(!graph.hasVertice(origin)){
            
            $('#canvas').trigger('alert-info', [{
                console: {
                    title: 'Criando vértice <b>'+origin+'...</b>'
                }
            }]);
            
            this.createVertice(origin);
        }

        if(!graph.hasVertice(target)){
            
            $('#canvas').trigger('alert-info', [{
                console: {
                    title: 'Criando vértice <b>'+target+'</b>...'
                }
            }]);
        
            this.createVertice(target);
        }

        weight = typeof(weight) === 'number' ? weight : 1;

        if(!graph.linkVertices(origin, target, weight)){
            
            $('#canvas').trigger('alert-error', [{
                toast: 'Não foi possível ligar os vértices!',
                console: {
                    title: 'Não foi possível ligar os vértices!',
                    body: '<p>Houve um erro duarante a ligação dos vértices <b>'+origin+'</b> e <b>'+target+'</b> com custo <b>'+weight+'</b>.</p>\n\
                            Verifique os tipos de dados informados.'
                }
            }]);
        
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

        $('#canvas').trigger('alert-success', [{
            toast: 'Ligação entre vértices criada!',
            console: {
                title: 'Ligação entre vértices criada!',
                body: 'A ligação entre os vértices <b>'+origin.attr('data-value')+'</b> e <b>'+target.attr('data-value')+'</b> foi estabelecida com custo <b>'+weight+'</b>.'
            }
        }]);
    
        return true;
    },
    
    unlinkVertices:function(origin, target){
        
        this.clearAnimationsTimeOut();
        this.animationsTimeOut = [];
        this.clearClasses();
        
        var graph = this.getGraph(),
            raster = this.getRaster();
        
        if(!graph.hasVertice(origin)){
            
            $('#canvas').trigger('alert-error', [{
                toast: 'Não foi possível desligar os vértices!',
                console: {
                    title: 'Não foi possível desligar os vértices!',
                    body: 'O vértice <b>'+origin+'</b> não existe no grafo.'
                }
            }]);
        
            return false;
        }
        
        if(!graph.hasVertice(target)){
            
            $('#canvas').trigger('alert-error', [{
                toast: 'Não foi possível desligar os vértices!',
                console: {
                    title: 'Não foi possível desligar os vértices!',
                    body: 'O vértice <b>'+target+'</b> não existe no grafo.'
                }
            }]);
        
            return false;
        }
        
        if(!graph.unlinkVerties(origin, target)){
            
            $('#canvas').trigger('alert-info', [{
                console: {
                    title: 'Não existia ligação entre <b>'+origin+'</b> e <b>'+target+'</b>.'
                }
            }]);
        
            return false;
        }
        
        raster.removeEdge(
            raster.getVertice(origin),
            raster.getVertice(target)
        );

        $('#canvas').trigger('alert-success', [{
            toast: 'Ligação entre vértices removida!',
            console: {
                title: 'Ligação entre vértices removida!',
                body: 'A ligação entre os vértices <b>'+origin+'</b> e <b>'+target+'</b> foi desfeita.'
            }
        }]);
    
        return true;
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
        
        $('#canvas').trigger('alert-success', [{
            console: {
                title: 'Os vértices encontrados:',
                body: 'Na ordem: '+founded.toString()+'.'
            }
        }]);
    
        return founded;
    },
    
    minPath: function(origin, target){
        
        var me = this,
            graph = me.getGraph(),
            raster = me.getRaster(),
            result;
        
        result = graph.minPath(origin, target);
        
        if(result === null){
            
            $('#canvas').trigger('alert-warning', [{
                toast: 'Não existe caminho entre os vértices!',
                console: {
                    title: 'Não existe caminho entre os vértices!',
                    body: 'Não existe um caminho que partindo de <b>'+origin+'</b> chegue em  <b>'+target+'</b>.'
                }
            }]);
        
            return null;
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
        
        //TODO: colocar os pessoas de cada aresta
        console.log('<p>'+vertices.toString()+'.</p>Custo total: <b>'+result.weight+'</b>.');
        $('#canvas').trigger('alert-info', [{
            console: {
                title: 'O menor caminho encontrado:',
                body: '<p>'+vertices.toString()+'.</p>Custo total: <b>'+result.weight+'</b>.'
            }
        }]);
    
        return result;
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


