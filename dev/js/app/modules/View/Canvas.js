App.define('View.Canvas', {
   
    lastX: 0,
    lastY: 0,
    svgEl: null,
    selected: null,

    getScale: function(){
        return this.get('View.Navigation').getScale();
    },

    getVertice: function(value){
        return this.get('View.SvgRaster').getVertice(value);
    },

    isInArea: function(point, reference, range){
        return (point.x >= reference.x - range && point.x <= reference.x + range) &&
               (point.y >= reference.y - range && point.y <= reference.y + range);
    },

    getFreePoint: function(){

        var me = this,
            points = [],
            point = new Point(0, 0),
            p, f;

        var r = 100,
            d = r/2,
            x = r,
            y = 0;

        $('#vertices .vertice circle').each(function(i, e){
            p = new Point(e.getAttribute('cx'), e.getAttribute('cy'));

            if(me.isInArea(new Point(0, 0), p, r/2)){
                point = null;
            }

            points.push(p);
        });

        //Na origem
        if(point !== null) return point;

        while(r <= 1000){

            //Primeiro quadrante
            x = r;
            y = 0;

            while(x >= 0 && y >= r*(-1)){

                p = new Point(x, y);
                f = true;

                for(var i in points){
                    if(me.isInArea(points[i], p, d)){
                        f = false;
                        break;
                    }
                }

                if(f) return new Point(x, y);

                x -= d;
                y -= d;
            }

            //Segundo quadrante
            x = 0;
            y = r*(-1);

            while(x >= r*(-1) && y <= 0){

                p = new Point(x, y);
                f = true;

                for(var i in points){
                    if(me.isInArea(points[i], p, d)){
                        f = false;
                        break;
                    }
                }

                if(f) return new Point(x, y);

                x -= d;
                y += d;
            }

            //Terceiro quadrante
            x = r*(-1);
            y = 0;

            while(x <= 0 && y <= r){

                p = new Point(x, y);
                f = true;

                for(var i in points){
                    if(me.isInArea(points[i], p, d)){
                        f = false;
                        break;
                    }
                }

                if(f) return new Point(x, y);

                x += d;
                y += d;
            }

            //Quarto quadrante
            x = 0;
            y = r;

            while(x <= r && y >= 0){

                p = new Point(x, y)
                f = true;

                for(var i in points){
                    if(me.isInArea(points[i], p, d)){
                        f = false;
                        break;
                    }
                }

                if(f) return new Point(x, y);

                x += d;
                y -= d;
            }


            r += r/2;
        }

        return new Point(0, 0);
    },

    enableDraggable: function(e){
        var me = this;
        e.drag(
            function(dx, dy, pageX, pageY, event){
                me.onDrag(this, dx, dy, event);
            },
            function() {
                me.onDragStart(this, arguments[2]);
            },
            function(e){
                me.onDragEnds(this, e);
            }
        );
    },
    
    calculateEdgePosition: function(origin, target){
        
        var originR = parseFloat(origin.attr('r')) + parseFloat(origin.attr('stroke-width')),
            targetR = parseFloat(target.attr('r')) + parseFloat(target.attr('stroke-width')),
            vector;
    
        origin = new Point(origin.attr('cx'), origin.attr('cy'));
        target = new Point(target.attr('cx'), target.attr('cy'));
        vector = new Vector(origin, target);
        
        return [
            new Point(origin.x + vector.unity.x*originR, origin.y + vector.unity.y*originR),
            new Point(target.x - vector.unity.x*targetR, target.y - vector.unity.y*targetR)
        ];
    },
   
    onDragStart: function(el, e){
        if(el.hasClass('vertice')){
            var circule = el.select('circle');
            this.lastX = circule.attr('cx');
            this.lastY = circule.attr('cy');
            el.addClass('dragging');
            this.hideEdgeWeight(el);

            this.selectVertice(el);
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
            
            this.updateEdges(el);
        }
    },
    
    onDragEnds: function(el, e){
        if(el.hasClass('vertice')){
            el.removeClass('dragging');
            this.updateEdgeWeightPosition(el);
            this.showEdgeWeight(el);
        }
    },
    
    updateEdges: function(vertice){
        var me = this,
            value = vertice.attr('data-value');
        
        $('#edges > .edge[data-origin='+value+'], #edges > .edge[data-target='+value+']').each(function(i, edge){
            
            var points, line = edge.querySelectorAll('line, path')[0];
            
            if(line.nodeName === 'line'){
                points = me.calculateEdgePosition(
                    me.getVertice(edge.getAttribute('data-origin')).select('circle'),
                    me.getVertice(edge.getAttribute('data-target')).select('circle')
                );

                line.setAttribute('x1', points[0].x);
                line.setAttribute('y1', points[0].y);
                line.setAttribute('x2', points[1].x);
                line.setAttribute('y2', points[1].y);
            }
            
            else if(line.nodeName === 'path'){
                
                var circle = vertice.select('circle'),
                    radius = parseFloat(circle.attr('r'));
                
                points = new Point(circle.attr('cx'), circle.attr('cy'));
                line.setAttribute('d', 'M '+(points.x+radius)+' '+points.y+' A 1 1, 0, 0, 0, '+(points.x+7)+' '+(points.y-radius-5));
            }
        });
    },
    
    hideEdgeWeight: function(vertice){
        
        var value = vertice.attr('data-value');
        
        $('#edges > .edge[data-origin='+value+'] > circle, #edges > .edge[data-target='+value+'] > circle').hide();
        $('#edges > .edge[data-origin='+value+'] > text, #edges > .edge[data-target='+value+'] > text').hide();
    },
    
    showEdgeWeight: function(vertice){
        
        var value = vertice.attr('data-value');
        
        $('#edges > .edge[data-origin='+value+'] > circle, #edges > .edge[data-target='+value+'] > circle').show();
        $('#edges > .edge[data-origin='+value+'] > text, #edges > .edge[data-target='+value+'] > text').show();
    },
    
    updateEdgeWeightPosition: function(vertice){
        
        var me = this,
            value = vertice.attr('data-value');
        
        $('#edges > .edge[data-origin='+value+'], #edges > .edge[data-target='+value+']').each(function(i, edge){
                    
            var line = edge.querySelectorAll('line, path')[0],
                circle = edge.querySelectorAll('circle')[0],
                text = edge.querySelectorAll('text')[0];
            
            
            if(line.nodeName === 'line'){
                
                var x = (parseFloat(line.getAttribute('x1')) + parseFloat(line.getAttribute('x2')))/2,
                    y = (parseFloat(line.getAttribute('y1')) + parseFloat(line.getAttribute('y2')))/2;

                circle.setAttribute('cx', x);
                circle.setAttribute('cy', y);
                text.setAttribute('x', x);
                text.setAttribute('y', y);
            }
            
            else if(line.nodeName === 'path'){
                
                var vCircle = vertice.select('circle'),
                    radius = parseFloat(vCircle.attr('r')),
                    point = new Point(vCircle.attr('cx'), vCircle.attr('cy'));
                
                point.x += radius;
                point.y -= radius;
                
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                text.setAttribute('x', point.x);
                text.setAttribute('y', point.y);
            }
        });
    },

    selectVertice: function(vertice){

        this.deselect();
        vertice.addClass('selected');

        $('#vertices').append(vertice.node);
        this.selected = vertice;

        var value = this.selected.attr('data-value');
        $('#edges').append($('#edges > .edge[data-origin='+value+'], #edges > .edge[data-target='+value+']'));

        $('#canvas').trigger('select', [vertice]);
    },

    deselect: function(){
        if(this.selected === null) return;
        $('#canvas').trigger('deselect', [this.selected]);
        this.selected.removeClass('selected');
    },

    init: function(){
        this.svgEl = $('#canvas svg')[0];
    }
});


