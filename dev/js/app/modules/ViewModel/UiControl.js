App.define('ViewModel.UiControl',{
  
    resetNewVerticeBtnStates: function(){
        $('#ui-controllers > #new-vertice').removeClass('active')
                                     .tooltip('enable')
                                     .popover('hide');
    },
    
    newVerticePopoverTpl: function(){
        return '<div>Valor Vértice:<div>\n\
                <input id="new-vertice-value" class="form-control" type="number" value="0" max="999999999999" min="-99999999999" />\n\
                <button class="btn btn-primary" id="new-vertice-action" onclick="App.get(\'ViewModel.UiControl\').newVerticeAction();" ><i class="glyphicon glyphicon-ok"></i></button>';
    },
    
    newVerticeAction: function(){
        this.get('ViewModel.Actions').createVertice($('#new-vertice-value').val());
        this.resetNewVerticeBtnStates();
    },
    
    init: function(){
        var me = this;
        
        $('#new-vertice').click(function(){
            var btn = $(this);
            
            btn.button('toggle');
            
            if(btn.hasClass('active')){
                btn.popover()
                   .tooltip('disable');
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


