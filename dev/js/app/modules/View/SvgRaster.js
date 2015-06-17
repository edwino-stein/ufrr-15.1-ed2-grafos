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
        'text-align': 'center'
    },

    verticeCircleAttr:{
        'fill': '#fff',
        'stroke': '#000',
        'stroke-width': '1px'
    },

    maxTextLength: 12,
    textMargin: 10,

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

        if(value.length > this.maxTextLength) return null;

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

        this.store['vertices'].add(g);
        return g;
    },

    getVertice: function(value){
        return this.store.vertices.select('.vertice[data-value="'+value+'"]');
    },

    init: function(){
        var me = this;
        me.svgEl = $('#canvas svg')[0];
        me.snapSvgRoot = new Snap(me.svgEl);
        this.rasterGrid();

        this.store['edges'] = this.snapSvgRoot.g();
        this.store['edges'].attr('id', 'edges');
        this.store['vertices'] = this.snapSvgRoot.g();
        this.store['vertices'].attr('id', 'vertices');
    }
});


