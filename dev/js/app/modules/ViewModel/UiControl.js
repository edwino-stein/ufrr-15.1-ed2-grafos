App.define('ViewModel.UiControl',{

    getActions: function(){
        return this.get('ViewModel.Actions');
    },

    getCanvas: function(){
        return this.get('View.Canvas');
    },

    waitingForDelete: false,

    resetNewVerticeBtnStates: function(){
        $('#ui-controllers > #new-vertice').removeClass('active')
                                     .tooltip('enable')
                                     .popover('hide');
    },

    resetDeleteStates: function(){
        this.waitingForDelete = false;
        $('#ui-controllers > #delete-action').removeClass('active');
    },

    newVerticePopoverTpl: function(){
        return '<div>Valor Vértice:<div><form>\n\
                <input id="new-vertice-value" class="form-control" type="number" value="0" max="999999999999" min="-99999999999" />\n\
                <button type="submit" class="btn btn-primary" id="new-vertice-action"><i class="glyphicon glyphicon-ok"></i></button></form>';
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

    searchAction: function(){
        this.getActions().search();
    },

    init: function(){
        var me = this;

        $('#new-vertice').click(function(){

            var btn = $(this);
            btn.button('toggle');

            me.resetDeleteStates();

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
            me.searchAction();
            me.resetDeleteStates();
        });

        $('#delete-action').click(function(){

            me.resetNewVerticeBtnStates();

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

        $('#canvas').on('select', function(e, vertice){

            if(me.waitingForDelete)
                me.deleteAction(vertice.attr('data-value'));

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


