App.define('ViewModel.UiControl',{

    getActions: function(){
        return this.get('ViewModel.Actions');
    },

    getCanvas: function(){
        return this.get('View.Canvas');
    },

    waitingForDelete: false,
    waitingForLink: false,

    origin: null,

    resetNewVerticeBtnStates: function(){
        $('#ui-controllers > #new-vertice').removeClass('active')
                                           .tooltip('enable')
                                           .popover('hide');
    },

    resetDeleteStates: function(){
        this.waitingForDelete = false;
        $('#ui-controllers > #delete-action').removeClass('active');
    },

    resetLinkStates: function(){
        this.waitingForLink = false;
        this.origin = null;
        $('#ui-controllers > #link-action').removeClass('active')
                                           .tooltip('enable')
                                           .popover('hide');
    },

    newVerticePopoverTpl: function(){
        return '<div>Valor Vértice:<div><form>\n\
                <input id="new-vertice-value" class="form-control" type="number" value="0" max="999999999999" min="-99999999999" />\n\
                <button type="submit" class="btn btn-primary" id="new-vertice-action"><i class="fa fa-lg fa-check"></i></button></form>';
    },

    linkPopoverTpl: function(){
        return '<div>Custo da ligação:<div>\n\
                <input id="link-weight" class="form-control" type="number" value="1" max="999999" min="1" />';
    },

    newVerticeAction: function(){
        this.getActions().createVertice($('#new-vertice-value').val());
        this.resetNewVerticeBtnStates();
    },

    deleteAction: function(vertice){
        this.getCanvas().deselect();
        this.getActions().removeVertice(parseFloat(vertice));
        this.resetDeleteStates();
    },

    linkAction: function(origin, target, weight){
        this.getCanvas().deselect();

        this.getActions().linkVertices(
                parseFloat(origin),
                parseFloat(target),
                parseFloat(weight)
        );
        this.resetLinkStates();
    },

    searchAction: function(){
        this.getActions().search();
    },

    init: function(){
        var me = this;

        $('#new-vertice').click(function(){

            var btn = $(this);
            btn.button('toggle');

            me.resetDeleteStates();
            me.resetLinkStates();

            if(btn.hasClass('active')){

                btn.popover()
                   .tooltip('disable');

                btn.on('shown.bs.popover', function(){
                   var popoverId = btn.attr('aria-describedby');
                   $('#new-vertice-value').focus();
                   $('#'+popoverId+' form').submit(function(e){
                       e.preventDefault();
                       e.stopPropagation();
                       e.stopImmediatePropagation();
                       me.newVerticeAction();
                   });
                });
            }
            else{
                btn.tooltip('enable');
            }
        }).popover({
            html: true,
            content: me.newVerticePopoverTpl
        });

        $('#toggle-console').click(function (){
            me.resetNewVerticeBtnStates();
        });

        $('#search-action').click(function (){
            me.resetNewVerticeBtnStates();
            me.resetDeleteStates();
            me.resetLinkStates();
            me.searchAction();
        });

        $('#delete-action').click(function(){

            me.resetNewVerticeBtnStates();
            me.resetLinkStates();

            var btn = $(this);
            btn.button('toggle');

            if(me.waitingForDelete){
                me.resetDeleteStates();
                return;
            }

            if(me.getCanvas().selected !== null){
                me.deleteAction(me.getCanvas().selected.attr('data-value'));
            }
            else{
                me.waitingForDelete = !me.waitingForDelete;
                $('#canvas').trigger('alert-info', [{
                    toast: 'Selecione um vértice para ser removido.'
                }]);
            }
        });

        $('#link-action').click(function(){

            var btn = $(this);
            btn.button('toggle');

            me.resetNewVerticeBtnStates();
            me.resetDeleteStates();

            if(me.waitingForLink){
                me.resetLinkStates();
                return;
            }
            me.waitingForLink = !me.waitingForLink;

            if(btn.hasClass('active')){
                btn.popover()
                   .tooltip('disable');
            }
            else{
                btn.tooltip('enable');
            }

            if(me.getCanvas().selected !== null){
                me.origin = me.getCanvas().selected;
                $('#canvas').trigger('alert-info', [{
                    toast: 'Selecione um vértice para ser o destino.'
                }]);
            }
            else{
                $('#canvas').trigger('alert-info', [{
                    toast: 'Selecione um vértice para ser a origem.'
                }]);
            }

        }).popover({
            html: true,
            content: me.linkPopoverTpl
        });

        $('#canvas').on('select', function(e, vertice){

            if(me.waitingForDelete)
                me.deleteAction(vertice.attr('data-value'));

            if(me.waitingForLink){

                if(me.origin === null){
                    me.origin = vertice;
                    $('#canvas').trigger('alert-info', [{
                        toast: 'Selecione um vértice para ser o destino.'
                    }]);
                    return;
                }

                me.linkAction(
                    me.origin.attr('data-value'),
                    vertice.attr('data-value'),
                    $('#link-weight').val()
                );
            }

        });

        $('#canvas').dblclick(function(e){

            if(!App.get('View.Navigation').isVertice(e.target)){
                me.getCanvas().deselect();
                me.resetNewVerticeBtnStates();
                me.resetDeleteStates();
                me.resetLinkStates();
            }
        });

        //Outros Eventos
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });

        $('#canvas svg').on('positionChange',function(e, x, y){
            $('#position .x').html(x.toFixed(6));
            $('#position .y').html(y.toFixed(6));
            me.resetNewVerticeBtnStates();
        });
        
        $('#canvas').on('select deselect', function(){
            me.resetNewVerticeBtnStates();
        });
        
    }
});


