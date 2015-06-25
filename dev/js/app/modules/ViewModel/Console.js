App.define('ViewModel.Console',{
    
    tpl:'<div class="alert alert-{type}" role="alert">\n\
            <div class="alert-title">\n\
                <i class="{icon}"></i>\n\
                <b>{title}</b>\n\
            </div>\n\
            {text}\n\
        </div>',
    
    getTpl: function(title, text, type){
        var icon;
        
        switch(type){
            case 'success': icon = 'glyphicon glyphicon-ok-sign'; break;
            case 'warning': icon = 'glyphicon glyphicon-exclamation-sign'; break;
            case 'danger': icon = 'glyphicon glyphicon-remove-sign'; break;
            case 'info': icon = 'glyphicon glyphicon-info-sign'; break;
            case 'log':
            default:
                icon = 'glyphicon glyphicon-log-in';
        }
        
        return this.tpl.replace('{type}', type)
                       .replace('{icon}', icon)
                       .replace('{title}', title)
                       .replace('{text}', text === '' ? text : '<div class="alert-body">'+text+'</div>');
                       
    },
    
    output: function(title, text, type){
        
        switch(type){
            case 'success': type = 'success'; break;
            case 'warning': type = 'warning'; break;
            case 'danger': type = 'danger'; break;
            case 'info': type = 'info'; break;
            case 'log':
            default:
                type = 'log';
        }
        
        var output = $('#iu-console .output');
        
        if(output[0].scrollHeight - output.height() <= output.scrollTop()){
            output.append(this.getTpl(title, text, type));
            output.scrollTop(output[0].scrollHeight);
        }
        else{
            output.append(this.getTpl(title, text, type));
        }
    },
    
    clear: function(){
        $('#iu-console .output').html('');
    },
    
    init: function(){
        var me = this;
        
        $('#toggle-console').click(function (){
            $(this).button('toggle');
            $('body').toggleClass('show-console');
        });
    }
});

