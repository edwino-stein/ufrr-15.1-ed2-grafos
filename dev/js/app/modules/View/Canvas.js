App.define('View.Canvas', {
   
    lastX: 0,
    lastY: 0,    
    svgEl: null,
    
    getScale: function(){
        return this.get('View.Navigation').getScale();
    },
       
    onDragStart: function(el, e){
        if(el.hasClass('vertice')){
            var circule = el.select('circle');
            this.lastX = circule.attr('cx');
            this.lastY = circule.attr('cy');
            el.addClass('dragging');
        }
    },
    
    onDrag: function(el, dx, dy, e){
        
        var scale = this.getScale();
        
        if(el.hasClass('vertice')){
            el.select('circle').attr({
                cx: +this.lastX + dx * scale,
                cy: +this.lastY + dy * scale
            });
            el.select('text').attr({
                x: +this.lastX + dx * scale,
                y: +this.lastY + dy * scale
            });
        }
    },
    
    onDragEnds: function(el, e){
        if(el.hasClass('vertice')){
            el.removeClass('dragging');
        }
    },
    
    init: function(){
        this.svgEl = $('#canvas svg')[0];
    }
});


