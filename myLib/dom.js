'use strict'

var dom = (function DOM_utilities(){
    var _ = {};
        _.selectorLiteral = ''
        _.selectorText = ''

        _.selectorTypes = {
            ".": function(selector){return document.getElementsByClassName(selector)},
            "#": function(selector){return document.getElementsByClassName(selector)},
            "<": function(selector){return document.getElementsByClassName(selector)},
            "?": function(selector){return document.getElementsByClassName(selector)},
            "??": function(selector){return document.getElementsByClassName(selector)},
            "[": function(selector){return document.getElementsByName(selector)}
        },    

        _.delBrowserContextMenu = function(){
            document.getElementsByTagName('body')[0]
            .oncontextmenu = function(){
                return false
                }
        };
 
        _.get = function (selector){
            _.selectorLiteral = selector[0]
            _.selectorText = selector.substring(1)

            return _.selectorTypes[selector[0]](selector.substring(1))

            /*switch
                if (_.selectorLiteral === '.'){
                    return document.getElementsByClassName(_.selectorText)}
                if (_.selectorLiteral === '#') {
                    return document.getElementById(_.selectorText)}
                if (_.selectorLiteral === '<') {
                    return document.getElementsByTagName(_.selectorText)}
                if (_.selectorLiteral === '?') {
                    return document.querySelector(_.selectorText)}
                if (_.selectorLiteral === '??') {
                    return document.querySelectorAll(_.selectorText)}
                
                return document.getElementsByName(selector)*/
        },


        _.toggleClass = function(element, className){
            if (!element.classList.contains(className)) {
                element.classList.add(className);
            }
            else {
                element.classList.remove(className);
            }
        }
        _.new = function(nodeName,props){
            let element = document.createElement(nodeName);
                if (props) {
                    props.forProps(function(value,key){
                    if (key === "attributes"){
                        value.forEach((attribute_def)=>
                            element.setAttribute(attribute_def[0],attribute_def[1]));
                    }
                    else {
                        element[key] = value;
                    }
                });
            }
            return element
        }
        _.css = function(elem,css_classes,action){
            if (action===false){
                css_classes.forEach((_class)=>elem.classList.remove(_class))
            return element
            }
            css_classes.forEach((_class)=>elem.classList.add(_class))
            return element
        }
        _.style = function(element,definition){
            definition.forProps((value,key)=>element.style[key]=value);
        }
        _.setElementCoords = function(element,coords,shift){
            element.style.left=coords[0]+shift[0]+'px'
            element.style.top=coords[1]+shift[1]+'px'
            return _
        }
        _.getEventCoords = function(e){
            let obj = {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY
            }
            return obj;
        }
    return _
})()



export {dom}