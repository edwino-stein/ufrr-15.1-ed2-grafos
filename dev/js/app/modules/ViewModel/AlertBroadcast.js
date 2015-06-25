App.define('ViewModel.AlertBroadcast',{
    
    toast: true,
    console: true,
    
    showToast: function(text, type){
        App.get('Util').toast.show(text, type);
    },
    
    logConsole: function(title, text, type){
        App.get('ViewModel.Console').output(title, text, type);
    },
    
    broadcast: function(alert, type){
        
        if(alert['toast'] && this.toast){
            this.showToast(alert.toast, type);
        }
            
        if(alert['console'] && this.console){

            this.logConsole(
                alert.console.title ? alert.console.title : '',
                alert.console.body ? alert.console.body : '',
                type
            );
        }
    },
    
    enableToast: function(){
        this.toast = true;
    },
    
    disableToast: function(){
        this.toast = false;
    },
    
    enableConsole: function(){
        this.console = true;
    },
    
    disableConsole: function(){
        this.console = false;
    },
    
    init: function(){
        var me = this;
        
        $('#canvas')
        .on('alert-error', function(e, alert){
            me.broadcast(alert, 'danger');
        })
        .on('alert-warning', function(e, alert){
            me.broadcast(alert, 'warning');
        })
        .on('alert-success', function(e, alert){
            me.broadcast(alert, 'success');
        })
        .on('alert-info', function(e, alert){
            me.broadcast(alert, 'info');
        });
    }
});


