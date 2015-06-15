 /**
  * Application Loader
  */

 var App = {

    require: [
        'Util'
    ],

    modules:{},
    modulesPath: 'js/app/modules/',

    load: function (module) {
        var head = document.getElementsByTagName('head')[0],
            script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = this.modulesPath+module.replace('.', '/')+'.js';
        head.appendChild(script);
    },

    define: function (namespace, config){

        namespace = namespace.split('.');
        var name = namespace.pop(),
            current = this.modules;

        for(var i in namespace){
            if(!current[namespace[i]]) current[namespace[i]] = {};
            current = current[namespace[i]];
        }

        if(!current[name]) current[name] = config;
        if(current[name].initted) return;
        if(current[name].init) current[name].init();
        current[name].initted = true;
    },

    get: function(namespace){

        namespace = namespace.split('.');
        var name = namespace.pop(),
            current = this.modules;

        for(var i in namespace){
            if(!current[namespace[i]]) return null;
            current = current[namespace[i]];
        }

        return current[name] ? current[name] : null;
    },

    onReady: function(){
        for (var index in this.require){
            this.load(this.require[index]);
        }
    }
};

jQuery(document).ready(function(){App.onReady();});