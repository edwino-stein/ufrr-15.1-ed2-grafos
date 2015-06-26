App.define('Util', {
    
    getMicroTime: function (){
        var time = new Date();
        return time.getTime();
    },
    
    toast: {
        
        tpl:'<div class="alert alert-{type} alert-dismissible fade in" role="alert">\n\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n\
                {text}\n\
            </div>',
        
        timeout: null,
        defaultTimeout: 2000,
        
        getTpl: function(type, text){
            return this.tpl.replace('{type}', type).replace('{text}', text);
        },
        
        close: function(){
            $('#toast .alert').remove();
            clearTimeout(this.timeout);
            this.timeout = null;
        },
        
        show: function(text, type, time){
            
            time = typeof(time) === 'number' && time >= 0 ? time : this.defaultTimeout;
            
            switch(type){
                case 'success': type = 'success'; break;
                case 'warning': type = 'warning'; break;
                case 'danger': type = 'danger'; break;
                case 'info':
                default:
                    type = 'info';
            }
            
            var me = this;
            
            me.close();
            $('#toast').append(me.getTpl(type, text));
            
            $('#toast .alert').on('closed.bs.alert', function(){
                clearTimeout(this.timeout);
                this.timeout = null;
            });
            
            if(time === 0) return true;
            
            me.timeout = setTimeout(function(){
                me.close();
            }, time);
            
            return true;
        }
    },    
});

