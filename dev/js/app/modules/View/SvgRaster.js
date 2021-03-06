App.define('View.SvgRaster',{
    
    svgEl: null,
    snapSvgRoot: null,
    
    canvasMinX: -1000,
    canvasMinY: -1000,
    canvasMaxX: 1000,
    canvasMaxY: 1000,
    
    verticeTextAttr:{
        'font-size': 20,
        'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'text-align': 'center',
        filter:'url(#drop-shadow-vertice-text)',
        'unselectable': 'on'
    },

    verticeCircleAttr:{
        'stroke-width': '1px',
        filter: "url(#drop-shadow-vertice)"
    },
    
    edgeLineAttr: {
        'stroke': '#000',
        'stroke-width': '1px',
        'style': 'marker-start: url(#edge-origin); marker-end:url(#edge-target)'
    },
    
    edgeSelfLineAttr: {
        'stroke': '#000',
        'fill': 'transparent',
        'stroke-width': '1px',
        'style': 'marker-start: url(#edge-origin); marker-end:url(#edge-target-self)'
    },
    
    edgeTextAttr: {
        'font-size': 12,
        'font-family': '"Helvetica Neue",Helvetica,Arial,sans-serif',
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'text-align': 'center',
        'unselectable': 'on'
    },
    
    edgeCircleAttr: {
        'stroke-width': '1px'
    },
    
    maxTextLength: 12,
    textMargin: 10,
    
    edgeTextMargin: 5,
    maxEdgeTextLength: 6,
    
    store:{},

    rasterGrid: function(){

        var x = this.canvasMinX,
            y = this.canvasMinY,
            variation = 20,
            grid = this.snapSvgRoot.g();
        
        grid.attr('id', 'bg-grid');
        
        for(x *= 2; x <= this.canvasMaxX*2; x += variation){
            grid.add(
                this.snapSvgRoot.line(
                    x, this.canvasMinY*2,
                    x, this.canvasMaxY*2
                )
            );
        }
        
        for(y *= 2; y <= this.canvasMaxY*2; y += variation){
            grid.add(
                this.snapSvgRoot.line(
                    this.canvasMinX*2, y,
                    this.canvasMaxX*2, y
                )
            );
        }

        this.store['grid-bg'] = grid;
    },

    createVerticeTextValue: function(value, x, y){

        value = typeof(value) === 'number' ? value.toString() : value;
        
        var fontSize = this.verticeTextAttr['font-size'],
            length = value.length,
            text = this.snapSvgRoot.text(x, y, value);

        if(length >= 5) fontSize -= 5;
        if(length >= 7) fontSize -= 5;
        if(length >= 10) fontSize -= 2;

        for(var i in this.verticeTextAttr){
            if(i === 'font-size'){
                text.attr('font-size', fontSize);
                continue;
            }

            text.attr(i, this.verticeTextAttr[i]);
        }

        return text;
    },

    createVertice: function(value, x, y){

        value = typeof(value) === 'number' ? value.toString() : value;
        if(value.length > this.maxTextLength) return null;
        
        var g = this.snapSvgRoot.g(),
            text = this.createVerticeTextValue(value, x, y),
            circle, radius;

        radius = (parseInt(text.attr('font-size'))/2) * value.length/2 + this.textMargin;
        circle = this.snapSvgRoot.circle(x, y, radius);

        for(var i in this.verticeCircleAttr){
            circle.attr(i, this.verticeCircleAttr[i]);
        }

        g.add(circle, text);
        g.addClass('vertice');
        g.attr('data-value', value);
        this.get('View.Canvas').enableDraggable(g);
        
        this.store['vertices'].add(g);
        return g;
    },
    
    removeVertice: function(vertice){
        
        var me = this,
            value = vertice.attr('data-value');
        
        $('#edges > .edge[data-origin='+value+'], #edges > .edge[data-target='+value+']').each(function(i, edge){
            me.store['edges'].node.removeChild(edge);
        });
        
        me.store['vertices'].node.removeChild(vertice.node);
    },
    
    getVertice: function(value){
        return this.store.vertices.select('.vertice[data-value="'+value+'"]');
    },
    
    createEdgeText: function(value, x, y){
        value = typeof(value) === 'number' ? value.toString() : value;
        
        var fontSize = this.edgeTextAttr['font-size'],
            length = value.length,
            text = this.snapSvgRoot.text(x, y, value);
            
        if(length >= 2) fontSize -= 3.5;
        if(length >= 3) fontSize -= 0.5;
        if(length >= 4) fontSize -= 1;
        if(length >= 5) fontSize -= 1;
        if(length >= 6) fontSize -= 1;
        
        for(var i in this.edgeTextAttr){
            
            if(i === 'font-size'){
                text.attr('font-size', fontSize);
                continue;
            }

            text.attr(i, this.edgeTextAttr[i]);
        }

        return text;
    },

    createEdge: function (origin, target, weight){

        weight = typeof(weight) === 'number' ? weight.toString() : weight;
        if(weight.length > this.maxEdgeTextLength) return null;

        var points, line, circle, radius, text, g;

        g = this.snapSvgRoot.g();
        g.addClass('edge');
        g.attr({
            'data-origin': origin.attr('data-value'),
            'data-target': target.attr('data-value'),
            'data-weight': weight
        });


        if(origin === target){

            origin = origin.select('circle');
            radius = parseFloat(origin.attr('r'));
            points = new Point(origin.attr('cx'), origin.attr('cy'));
            
            line = this.snapSvgRoot.path('M '+(points.x+radius)+' '+points.y+' A 1 1, 0, 0, 0, '+(points.x+7)+' '+(points.y-radius-5));
            line.attr(this.edgeSelfLineAttr);
            
            points.x += radius;
            points.y -= radius;
            
            text = this.createEdgeText(
                weight,
                points.x,
                points.y
            );
            
            radius = (parseFloat(text.attr('font-size'))/2) * weight.length/2 + this.edgeTextMargin;
            circle = this.snapSvgRoot.circle(
                points.x,
                points.y,
                radius
            );
            circle.attr(this.edgeCircleAttr);
    
            text.attr('transform', 'translate('+(radius)+', -'+(radius*0.2)+')');
            circle.attr('transform', 'translate('+(radius)+', -'+(radius*0.2)+')');
        }
        
        else{
            
            points = this.get('View.Canvas').calculateEdgePosition(
                origin.select('circle'),
                target.select('circle')
            );

            line = this.snapSvgRoot.line(
                points[0].x,
                points[0].y,
                points[1].x,
                points[1].y
            );
            line.attr(this.edgeLineAttr);


            text = this.createEdgeText(
                weight,
                (points[0].x + points[1].x)/2,
                (points[0].y + points[1].y)/2
            );

            radius = (parseFloat(text.attr('font-size'))/2) * weight.length/2 + this.edgeTextMargin;
            circle = this.snapSvgRoot.circle(
                (points[0].x + points[1].x)/2,
                (points[0].y + points[1].y)/2,
                radius
            );
            circle.attr(this.edgeCircleAttr);
        }

        g.add(line, circle,text);
        this.store['edges'].add(g);
    },
    
    removeEdge: function(origin, target){
        
        origin = origin.attr('data-value');
        target = target.attr('data-value');
        var edge = $('#edges .edge[data-origin='+origin+'][data-target='+target+']')[0];
        
        if(!edge) return;
        this.store['edges'].node.removeChild(edge);
    },
    
    checkEdge: function(edge, type){
        
        var line = edge.querySelectorAll('line, path')[0];
        
        if(type === 'visited'){
            
            if(line.nodeName === 'line')
                line.setAttribute('style', 'marker-start: url(#edge-origin-visited); marker-end:url(#edge-target-visited)');
            
            else if(line.nodeName === 'path')
                line.setAttribute('style', 'marker-start: url(#edge-origin-visited); marker-end:url(#edge-target-self-visited)');
        }
        else if(type === 'min-path'){
            
            if(line.nodeName === 'line')
                line.setAttribute('style', 'marker-start: url(#edge-origin-min-path); marker-end:url(#edge-target-min-path)');
            
            else if(line.nodeName === 'path')
                line.setAttribute('style', 'marker-start: url(#edge-origin-min-path); marker-end:url(#edge-target-self-min-path)');
        }
    },
    
    uncheckEdge: function(edge){
        
        var line = edge.querySelectorAll('line, path')[0];
            
        if(line.nodeName === 'line'){
            line.setAttribute('style', 'marker-start: url(#edge-origin); marker-end:url(#edge-target)');
        }
        else if(line.nodeName === 'path'){
            line.setAttribute('style', 'marker-start: url(#edge-origin); marker-end:url(#edge-target-self)');
        }
    },
    
    init: function(){
        var me = this;
        me.svgEl = $('#canvas svg')[0];
        me.snapSvgRoot = new Snap(me.svgEl);
        
        me.rasterGrid();
        me.store['edges'] = this.snapSvgRoot.g();
        me.store['edges'].attr('id', 'edges');
        me.store['vertices'] = this.snapSvgRoot.g();
        me.store['vertices'].attr('id', 'vertices');
        
        $('#canvas').on('check-edge', function(e, edge, type){
            me.checkEdge(edge, type);
        }).on('uncheck-edge', function(e, edge){
           me.uncheckEdge(edge);
        });
    }
});


