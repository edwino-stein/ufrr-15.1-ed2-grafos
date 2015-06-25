App.define('ViewModel.AlertBroadcast',{
    
    showToast: function(text, type){
        App.get('Util').toast.show(text, type);
    },
    
    init: function(){
        var me = this;
        
        $('#canvas')
        .on('alert-error', function(e, alert){
            if(alert['toast'])
                me.showToast(alert.toast, 'danger');
        })
        .on('alert-warning', function(e, alert){
            if(alert['toast'])
                me.showToast(alert.toast, 'warning');
        })
        .on('alert-success', function(e, alert){
            if(alert['toast'])
                me.showToast(alert.toast, 'success');
        })
        .on('alert-info', function(e, alert){
            if(alert['toast'])
                me.showToast(alert.toast, 'info');
        });
    }
});


