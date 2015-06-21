App.define('View.Navigation',{
    
    svgEl: null,
    
    x: 0,
    y: 0,
    width: 500,
    height: 500,
    zoom: 1,
    
    scale: 0,
    lastX: 0,
    lastY: 0,
    mouseDown: false,
    
    limits: null,
    maxZoom: 3,
    minZoom: -2,
    
    setPosition: function (x, y){
        this.setX(x);
        this.setY(y);
        this.svgEl.setAttribute('viewBox', this.x+' '+this.y+' '+this.width+' '+this.height);
        
        $(this.svgEl).trigger('positionChange', [
            this.getCenterX(),
            this.getCenterY(),
            x,
            y
        ]);
    },
    
    toOrigin:function(){
        this.setPosition(
            (this.getWidth()/2)*(-1),
            (this.getHeight()/2)*(-1)
        );
    },
    
    setX: function(x){
        this.x = x;
    },

    setY: function(y){
        this.y = y;
    },

    getX: function(){
        return this.x;
    },

    getY: function(){
        return this.y;
    },
    
    getWidth: function(){
        return this.width;
    },
    
    getHeight: function(){
        return this.height;
    },
    
    getCenterX: function(){
        return this.getX() + this.getWidth()/2;
    },
    
    getCenterY: function(){
        return this.getY() + this.getHeight()/2;
    },
    
    calculateScale: function(){
        var viewBox = this.svgEl.viewBox.baseVal,
            scaleByHeight = viewBox.height/$(this.svgEl).height(),
            scaleByWidth = viewBox.width/$(this.svgEl).width();
        
        this.scale = scaleByHeight >= scaleByWidth ? scaleByHeight : scaleByWidth;
    },
    
    getScale: function(){       
        return this.scale;
    },
    
    onMouseDown: function(x, y, e){
        
        this.mouseDown = true;
        this.lastX = x;
        this.lastY = y;
                
        if(this.limits === null){
            var SvgRaster = this.get('View.SvgRaster');
            this.limits = {
                minX: SvgRaster.canvasMinX,
                minY: SvgRaster.canvasMinY,
                maxX: SvgRaster.canvasMaxX,
                maxY: SvgRaster.canvasMaxY
            };
        }
    },
    
    onMouseUp: function(e){
        this.mouseDown = false;
        this.lastX = 0;
        this.lastY = 0;
    },
    
    onMouseMove: function(x, y, e){

        if(!this.mouseDown)
            return;
        
        var scale = this.getScale(),
            dx = this.getX() + (this.lastX - x)*scale,
            dy = this.getY() + (this.lastY - y)*scale;
        
        dx = dx >= this.limits.minX ? dx : this.limits.minX;
        dx = dx + this.getWidth() <= this.limits.maxX ? dx : this.limits.maxX - this.getWidth();
        
        dy = dy >= this.limits.minY ? dy : this.limits.minY;
        dy = dy + this.getHeight() <= this.limits.maxY ? dy : this.limits.maxY - this.getHeight();
        
        this.setPosition(dx, dy);
        this.lastX = x;
        this.lastY = y;
        
        e.stopImmediatePropagation();
    },
    
    zoomIn: function(){
        
        if(this.zoom > this.maxZoom) return;
        
        this.zoom++;
        this.width /= 1.2;
        this.height /= 1.2;
        this.setPosition(this.getX(), this.getY());
        this.calculateScale();
    },
    
    zoomOut: function(){
        
        if(this.zoom <= this.minZoom) return;
        
        this.zoom--;
        this.width *= 1.2;
        this.height *= 1.2;
        this.setPosition(this.getX(), this.getY());
        this.calculateScale();
    },
    
    initialZoom: function(){
        this.zoom = 1;
        this.width = 500;
        this.height = 500;
        this.setPosition(this.getX(), this.getY());
    },

    isVertice: function(el){

        while(el !== this.svgEl){
            if(el.classList.contains('vertice'))
                return true;

            el = el.parentNode;
        }

        return false;
    },

    init: function(){
        var me = this;
        me.svgEl = $('#canvas svg')[0];
        me.toOrigin();
        me.calculateScale();
        
        $(window).resize(function(){
            me.calculateScale();
        });
        
        $(me.svgEl).on('mousedown', function(e){

            if(me.isVertice(e.target)) return;

            $('#canvas').addClass('moving');
            me.onMouseDown(e.pageX, e.pageY, e);
        })
        
        .on('mouseup', function(e){
            $('#canvas').removeClass('moving');
            me.onMouseUp(e);
        })
        
        .on('mousemove', function(e){
            me.onMouseMove(e.pageX, e.pageY, e);
        });
        
        $('#zoom-in').click(function(){
            me.zoomIn();
        });
        
        $('#zoom-out').click(function(){
            me.zoomOut();
        });
    }
});