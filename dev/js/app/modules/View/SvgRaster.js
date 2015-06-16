App.define('View.SvgRaster',{
    
    svgEl: null,
    snapSvgRoot: null,
    
    canvasMinX: -1000,
    canvasMinY: -1000,
    canvasMaxX: 1000,
    canvasMaxY: 1000,
    
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
    
    init: function(){
        var me = this;
        me.svgEl = $('#canvas svg')[0];
        me.snapSvgRoot = new Snap(me.svgEl);
        this.rasterGrid();
    }
});


