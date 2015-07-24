//IE8 不兼容数组的indexOf方法
if (typeof Array.prototype.indexOf !== 'function') {
    Array.prototype.indexOf = function(item) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == item) {
                return i;
            }
        }
        return -1;
    }
}
/**
 * MZ 移动端框架库
 * @author Heaven
 * @E-mail lichenbuliren@gmail.com
 * @version 0.0.1
 * @return {[type]} [description]
 */
window.MZ = (function(w, d) {

    /**
     * 对dom元素封装
     * @param {[type]} els [description]
     */
    function Dom(els) {
        for (var i = 0, len = els.length; i < len; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
    }

    //=========== UTILs =============
    Dom.prototype.map = function(callback) {
        var results = [],
            i = 0;
        for (; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    }

    Dom.prototype.forEach = function(callback) {
        this.map(callback);
        // 返回this.链式调用
        return this;
    }

    /**
     * 返回一个或者多个
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    Dom.prototype.mapOne = function(callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    }

    //  TODO dom元素定位
    Dom.prototype.offset = function(){

    }

    // TODO 判断元素是否在可视区域内
    Dom.prototype.isInViewport = function(){

    }

    // ============ DOM MANIPULATION
    Dom.prototype.text = function(text) {
        if (typeof text !== 'undefined') {
            return this.forEach(function(el) {
                el[(el.textContent) ? 'textContent' : 'innerText'] = text;
            });
        } else {
            return this.mapOne(function(el) {
                return el.textContent || el.innerText;
            });
        }
    }

    Dom.prototype.html = function(html) {
        if (typeof html !== 'undefined') {
            return this.forEach(function(el) {
                el.innerHTML = html;
            });
        } else {
            return this.mapOne(function(el) {
                return el.innerHTML;
            });
        }
    }

    Dom.prototype.addClass = function(classes) {
        return this.forEach(function(el) {
            el.classList.add(classes);
        });
    }

    Dom.prototype.removeClass = function(clazz) {
        return this.forEach(function(el) {
            var cs = el.className.split(' ');
            for (var i = 0, len = cs.length; i < len; i++) {
                el.classList.remove(cs[i]);
            }
        });
    }

    Dom.prototype.attr = function(attr, val) {
        if (typeof val !== 'undefined') {
            return this.forEach(function(el) {
                el.setAttribute(attr, val);
            });
        } else {
            return this.mapOne(function(el) {
                return el.getAttribute(attr);
            });
        }
    }

    Dom.prototype.append = function(els) {
        // 当前dom对象
        this.forEach(function(parEl, i) {
            // 需要添加的子节点对象
            els.forEach(function(childEl) {
                // 当需要将子节点添加到多个父节点中，从第二个父节点开始，使用els的副本
                if (i > 0) {
                    childEl = childEl.cloneNode(true);
                }
                parEl.appendChild(childEl);
            });
        });
    }

    Dom.prototype.prepend = function(els) {
        // 当前dom对象
        this.forEach(function(parEl, i) {
            // 这里使用for循环，是为了保证插入的顺序，如果使用forEach，将会得到一个倒序的子节点
            for (var j = els.length - 1; j > -1; j--) {
                childEl = (i > 0) ? els[j].cloneNode(true) : els[j];
                parEl.insertBefore(childEl, parEl.firstChild);
            }
        });
    }

    /**
     * 删除节点
     * @return {[type]} [description]
     */
    Dom.prototype.remove = function() {
        return this.forEach(function(el) {
            return el.parentNode.removeChild(el);
        });
    }

    Dom.prototype.on = (function() {
        if (d.addEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.addEventListener(evt, fn, false);
                });
            };
        } else if (d.attachEvent) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.attachEvent('on' + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el['on' + evt] = fn;
                });
            }
        }
    }());

    Dom.prototype.off = (function() {
        if (d.addEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.removeEventListener(evt, fn, false);
                });
            };
        } else if (d.detachEvent) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.detachEvent('on' + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el['on' + evt] = null;
                });
            }
        }
    }());

    var MZ = {
        $: function(selector) {
            var els;
            if (typeof selector == 'string') {
                els = d.querySelectorAll(selector);
            } else if (selector.length) {
                els = selector;
            } else {
                els = [selector];
            }
            return new Dom(els);
        },

        create: function(tagName, attrs) {
            var el = new Dom([d.createElement(tagName)]);
            if (attrs) {
                if (attrs.className) {
                    el.addClass(attrs.className);
                    delete attrs.className;
                }

                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }

                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el.attr(key, attrs[key]);
                    }
                }
            }
            return el;
        }
    }
    return MZ;
})(window, document);