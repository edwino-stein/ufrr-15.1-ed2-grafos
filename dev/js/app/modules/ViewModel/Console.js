App.define('ViewModel.Console',{
    
    basicFormat: '([a-zA-Z])+((\\s)?(\\+|-)?(\\d)+)+',
    availableCmds: '(t|i|c|b|T|I|C|B)',
    intFormat: '(\\+|-)?(\\d)+',
    typeFormat: '(t|T)(\\s)?(0|1|2|3)((\\s)([1-9]\\d*)+)?',
    insertFormat: '(i|I)((\\s)?(\\+|-)?(\\d)+)((\\s)(\\+|-)?(\\d)+)((\\s)(\\+|-)?(\\d)+)',
    pathFormat: '(c|C)((\\s)?(\\+|-)?(\\d)+)((\\s)(\\+|-)?(\\d)+)',
    searchFormat: '(b|B)',
    
    tpl:'<div class="alert alert-{type}" role="alert">\n\
            <div class="alert-title">\n\
                <i class="{icon}"></i>\n\
                <b>{title}</b>\n\
            </div>\n\
            {text}\n\
        </div>',
    
    getActions: function(){
        return App.get('ViewModel.Actions');
    },
    
    getTpl: function(title, text, type){
        var icon;
        
        switch(type){
            case 'success': icon = 'fa fa-lg fa-check-circle'; break;
            case 'warning': icon = 'fa fa-lg fa-exclamation-triangle'; break;
            case 'danger': icon = 'fa fa-lg fa-times-circle'; break;
            case 'info': icon = 'fa fa-lg fa-info-circle'; break;
            case 'log':
            default:
                icon = 'fa fa-lg fa-sign-in';
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
    
    encodeCommand: function(input){
        var availableCmds = new RegExp(this.availableCmds),
            intFormat = new RegExp(this.intFormat, 'g');
        
        var type = availableCmds.exec(input),
            param = intFormat.exec(input),
            extraParam = intFormat.exec(input),
            extraExtraParam = intFormat.exec(input);
        
        return {
            type: type[0].toLowerCase(),
            param: param ? parseInt(param[0]) : null,
            extraParam: extraParam ? parseInt(extraParam[0]) : null,
            extraExtraParam: extraExtraParam ? parseInt(extraExtraParam[0]) : null,
            orginal: input
        };
    },
    
    identifyCommand: function(input){
        
        var typeFormat = new RegExp(this.typeFormat),
            insertFormat = new RegExp(this.insertFormat),
            pathFormat = new RegExp(this.pathFormat),
            searchFormat = new RegExp(this.searchFormat);
        
        if(typeFormat.test(input))
            return this.encodeCommand(input);
        
        if(insertFormat.test(input))
            return this.encodeCommand(input);
        
        if(pathFormat.test(input))
            return this.encodeCommand(input);
        
        if(searchFormat.test(input))
            return this.encodeCommand(input);
        
        return null;
    },
    
    showHelp: function(){
        var tpl =   'Comandos para o grafo:<ul>\n\
                        <li><i>t 3 &lt;total&gt;</i> - Inicializa o grafo com <b>&lt;total&gt;</b> vértices.</li>\n\
                        <li><i>i &lt;origem&gt; &lt;destino&gt; &lt;custo&gt;</i> - Liga os vértices <b>&lt;origem&gt;</b> e <b>&lt;destino&gt;</b> com um custo <b>&lt;custo&gt;</b>.</li>\n\
                        <li><i>b</i> - Percorre todos os vértices do grafo.</li>\n\
                        <li><i>c &lt;origem&gt; &lt;destino&gt;</i> - Busca um caminho que partido de <b>&lt;origem&gt;</b> chegue em <b>&lt;destino&gt;</b> com o menor custo.</li>\n\
                    </ul>Outros:<ul>\n\
                        <li><i>ajuda</i> - Exibe esse menu.</li>\n\
                        <li><i>limpar</i> - Limpa o console.</li>\n\
                        <li><i>origem</i> - Posiciona a tela na origem do plano.</li>\n\
                    </ul>';
        
        this.output(
            'Menu de ajuda',
            tpl,
            'info'
        );
    },
    
    input: function(text){
        this.output(''+text+'', '', 'log');
        
        switch(text.toLowerCase()){
            
            case 'ajuda':
                this.showHelp();
                return;
            break;
            
            case 'limpar':
                this.clear();
                return;
            break;
            
            case 'origem':
                App.get('View.Navigation').toOrigin();
                return;
            break;
        }
        
        var cmd = this.identifyCommand(text);
        
        if(cmd === null){
            this.output(
                'Comando inválido',
                'O comando <b>'+text+'</b> não foi reconhecido pelo sistema.',
                'danger'
            );
            return false;
        }
        
        return this.execCommand(cmd);
    },
    
    execCommand: function(command){

        switch(command.type){
            case 't':
                if(command.param !== 3){
                    this.output(
                        'Outros tipos de estrutura de dados não são suportados',
                        'Este trabalho é apenas para grafos, então utilize apenas <b>t 3 <i>n</i></b>.',
                        'danger'
                    );
                    return false;
                }
                
                this.getActions().clearGraph();
                
                App.get('ViewModel.AlertBroadcast').disableToast();
                App.get('ViewModel.AlertBroadcast').disableConsole();
        
                
                for(var i = 1; i <= command.extraParam; i++)
                    this.getActions().createVertice(i);
                
                App.get('ViewModel.AlertBroadcast').enableToast();
                App.get('ViewModel.AlertBroadcast').enableConsole();
                
                this.output(
                    'Grafo inicializado',
                    'O grafo foi inicializado com vértices de <b>1</b> até <b>'+command.extraParam+'</b>.',
                    'success'
                );
            break;
            
            case 'i': 
                return this.getActions().linkVertices(
                    command.param,
                    command.extraParam,
                    command.extraExtraParam
                );
            break;
            
            case 'b':
                return this.getActions().search();
            break;
            
            case 'c':
                return this.getActions().minPath(
                    command.param,
                    command.extraParam
                );
            break;
        }
       
        return false;
    },
    
    clear: function(){
        $('#iu-console .output').html('');
    },
        
    init: function(){
        var me = this;
        
        $('#toggle-console').click(function (){
            $(this).button('toggle');
            $('body').toggleClass('show-console');
            
            if($(this).hasClass('active')){
                $('#iu-console .input .input-text form .form-control').focus();
            }
        });
        
        
        $('#iu-console .input .input-text form').submit(function(e){
            
            e.preventDefault();
            var input = $(this).find('.form-control');

            if(input.val() !== ''){
                me.input(input.val());
                input.val('');
                input.focus();
            }
        });
        
        $('#iu-console .input .input-text form .form-control').val('');
    }
});

