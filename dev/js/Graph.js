function Edge(origin, target, weight){

    this.origin = origin;
    this.target = target;
    this.weight = weight;

    this.free = function(){
        this.origin = null;
        this.target = null;
        this.weight = null;
    };
}

function Vertice(value){

    this.value = value;

    this.neighbors = {

        'in': [],
        'out': [],

        addIn: function(edge){
            this.in.push(edge);
        },

        addOut: function(edge){
            this.out.push(edge);
        },

        getOutByVertice: function(vertice){

            for(var i in this.out){
                if(this.out[i].target === vertice)
                    return this.out[i];
            }

            return null;
        },

        getInByVertice: function(vertice){

            for(var i in this.in){
                if(this.in[i].origin === vertice)
                    return this.in[i];
            }

            return null;
        },

        rmIn: function(pos){

            if(pos instanceof Edge){
                pos = this.in.indexOf(pos);
                if(pos <= (-1)) return false;
            }

            return this.in.splice(pos, 1) !== null;
        },

        rmOut: function(pos){

            if(pos instanceof Edge){
                pos = this.out.indexOf(pos);
                if(pos <= (-1)) return false;
            }

            return this.out.splice(pos, 1) !== null;
        },

        clearIn: function(){
            var edge;
            while(this.in.length > 0){
                edge = this.in[0];
                edge.origin.unlink(edge.target);
            }
        },

        clearOut: function(){
            var edge;
            while(this.out.length > 0){
                edge = this.out[0];
                edge.origin.unlink(edge.target);
            }
        }

    };

    this.getLink = function (target){
        return this.neighbors.getOutByVertice(target);
    };

    this.link = function(target, weight) {
        var edge = new Edge(this, target, weight);
        this.neighbors.addOut(edge);
        target.neighbors.addIn(edge);
    };

    this.unlink = function(target){

        var edge = this.neighbors.getOutByVertice(target);
        if(edge === null) return false;

        this.neighbors.rmOut(edge);
        target.neighbors.rmIn(edge);

        edge.free();
        return true;
    };

    this.each = function(handle){

        var edge, i;
        for(i in this.neighbors.out){
            edge = this.neighbors.out[i];
            handle(edge.target, edge, i);
        }
    };

    this.free = function(){
        this.value = null;
        this.neighbors.clearIn();
        this.neighbors.clearOut();
        this.neighbors.in = null;
        this.neighbors.out = null;
        this.neighbors = null;
    };
}

function Path(){

    this.vertices = [];
    this.weight = 0;

    this.addVertice = function(vertice, weight){
        this.vertices.push(vertice);
        this.weight += weight;
    };

    this.hasVertice = function(vertice){
        return this.vertices.indexOf(vertice) >= 0;
    };

    this.clone = function(){
        var p = new Path();
        p.vertices = this.vertices.slice(0);
        p.weight = this.weight;
        return p;
    };

    this.free = function(){
        this.weight = null;

        while(this.vertices.length > 0)
            this.vertices.pop();

        this.vertices = null;
    };
}

function Graph(){

    this.vertices = {};
    this.length = 0;

    this.has = function (value){
        return this.vertices[value] !== undefined && this.vertices[value] !== null;
    };

    this.isNumber = function (value){
        return typeof(value) === 'number';
    };

    this.getVertice = function(value){
        return this.vertices[value] ? this.vertices[value] : null;
    };

    this.add = function(value){

        if(!this.isNumber(value) || this.has(value)) return false;

        this.vertices[value] = new Vertice(value);
        this.length++;

        return true;
    };

    this.rm = function(value){

        if(!this.has(value)) return false;

        this.vertices[value].free();
        this.vertices[value] = null;
        delete this.vertices[value];
        this.length--;

        return true;
    };

    this.link = function(origin, target, weight){

        if(!this.isNumber(origin) || !this.isNumber(target)) return false;

        if(!this.has(origin)) this.add(origin);
        if(!this.has(target)) this.add(target);
        if(!this.isNumber(weight) || weight <= 0) weight = 1;

        origin = this.getVertice(origin);
        target = this.getVertice(target);
        var edge = origin.getLink(target);

        if(edge === null)
            origin.link(target, weight);
        else
            edge.weight = weight;

        return true;
    };

    this.unlink = function(origin, target){

        if(!this.isNumber(origin) || !this.isNumber(target)) return false;
        if(!this.has(origin)) return false;
        if(!this.has(target)) return false;

        return this.getVertice(origin).unlink(this.getVertice(target));
    };

    this.each = function(handle){
        var checked = [], index;
        var searchHandle = function(current, last){

            if(checked.indexOf(current.value) >= 0) return;

            checked.push(current.value);
            handle(
                current.value,
                last !== null ? last.value : null
            );

            current.each(function(t, e, i){
                searchHandle(t, current);
            });
        };

        for(index in this.vertices)
            searchHandle(this.vertices[index], null, 0);
    };

    this.minPath = function(origin, target){

        if(!this.has(origin) || !this.has(target))
            return false;

        var minPathHandle = function(current, edge, path){

            path.addVertice(
                current.value,
                edge === null ? 0 : edge.weight
            );

            if(current.value === target) return path;

            var temp, min = null;
            current.each(function(t, e, i){

                if(path.hasVertice(t.value)) return;

                temp = minPathHandle(t, e, path.clone());
                if(!temp.hasVertice(target)) return;

                if(min === null){
                    min = temp;
                    return;
                }
                
                if(temp.weight === min.weight){
                    min = temp.vertices.length < min.vertices.length ? temp : min;
                    return;
                }
                
                if(temp.weight < min.weight){
                  min.free();
                  min = temp;
                }
            });

            return min !== null ? min : path;
        };

        return minPathHandle(this.getVertice(origin), null, new Path());
    };
}