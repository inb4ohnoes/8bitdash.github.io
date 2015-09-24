var dat = dat || {};
dat.gui = dat.gui || {}, dat.utils = dat.utils || {}, dat.controllers = dat.controllers || {}, dat.dom = dat.dom || {}, dat.color = dat.color || {}, dat.utils.css = function() {
        return {
            load: function(t, e) {
                e = e || document;
                var i = e.createElement("link");
                i.type = "text/css", i.rel = "stylesheet", i.href = t, e.getElementsByTagName("head")[0].appendChild(i)
            },
            inject: function(t, e) {
                e = e || document;
                var i = document.createElement("style");
                i.type = "text/css", i.innerHTML = t, e.getElementsByTagName("head")[0].appendChild(i)
            }
        }
    }(), dat.utils.common = function() {
        var t = Array.prototype.forEach,
            e = Array.prototype.slice;
        return {
            BREAK: {},
            extend: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var i in e) this.isUndefined(e[i]) || (t[i] = e[i])
                }, this), t
            },
            defaults: function(t) {
                return this.each(e.call(arguments, 1), function(e) {
                    for (var i in e) this.isUndefined(t[i]) && (t[i] = e[i])
                }, this), t
            },
            compose: function() {
                var t = e.call(arguments);
                return function() {
                    for (var i = e.call(arguments), n = t.length - 1; n >= 0; n--) i = [t[n].apply(this, i)];
                    return i[0]
                }
            },
            each: function(e, i, n) {
                if (t && e.forEach === t) e.forEach(i, n);
                else if (e.length === e.length + 0)
                    for (var s = 0, o = e.length; o > s && !(s in e && i.call(n, e[s], s) === this.BREAK); s++);
                else
                    for (s in e)
                        if (i.call(n, e[s], s) === this.BREAK) break
            },
            defer: function(t) {
                setTimeout(t, 0)
            },
            toArray: function(t) {
                return t.toArray ? t.toArray() : e.call(t)
            },
            isUndefined: function(t) {
                return void 0 === t
            },
            isNull: function(t) {
                return null === t
            },
            isNaN: function(t) {
                return t !== t
            },
            isArray: Array.isArray || function(t) {
                return t.constructor === Array
            },
            isObject: function(t) {
                return t === Object(t)
            },
            isNumber: function(t) {
                return t === t + 0
            },
            isString: function(t) {
                return t === t + ""
            },
            isBoolean: function(t) {
                return !1 === t || !0 === t
            },
            isFunction: function(t) {
                return "[object Function]" === Object.prototype.toString.call(t)
            }
        }
    }(), dat.controllers.Controller = function(t) {
        var e = function(t, e) {
            this.initialValue = t[e], this.domElement = document.createElement("div"), this.object = t, this.property = e, this.__onFinishChange = this.__onChange = void 0
        };
        return t.extend(e.prototype, {
            onChange: function(t) {
                return this.__onChange = t, this
            },
            onFinishChange: function(t) {
                return this.__onFinishChange = t, this
            },
            setValue: function(t) {
                return this.object[this.property] = t, this.__onChange && this.__onChange.call(this, t), this.updateDisplay(), this
            },
            getValue: function() {
                return this.object[this.property]
            },
            updateDisplay: function() {
                return this
            },
            isModified: function() {
                return this.initialValue !== this.getValue()
            }
        }), e
    }(dat.utils.common), dat.dom.dom = function(t) {
        function e(e) {
            return "0" === e || t.isUndefined(e) ? 0 : (e = e.match(n), t.isNull(e) ? 0 : parseFloat(e[1]))
        }
        var i = {};
        t.each({
            HTMLEvents: ["change"],
            MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
            KeyboardEvents: ["keydown"]
        }, function(e, n) {
            t.each(e, function(t) {
                i[t] = n
            })
        });
        var n = /(\d+(\.\d+)?)px/,
            s = {
                makeSelectable: function(t, e) {
                    void 0 !== t && void 0 !== t.style && (t.onselectstart = e ? function() {
                        return !1
                    } : function() {}, t.style.MozUserSelect = e ? "auto" : "none", t.style.KhtmlUserSelect = e ? "auto" : "none", t.unselectable = e ? "on" : "off")
                },
                makeFullscreen: function(e, i, n) {
                    t.isUndefined(i) && (i = !0), t.isUndefined(n) && (n = !0), e.style.position = "absolute", i && (e.style.left = 0, e.style.right = 0), n && (e.style.top = 0, e.style.bottom = 0)
                },
                fakeEvent: function(e, n, s, o) {
                    s = s || {};
                    var r = i[n];
                    if (!r) throw Error("Event type " + n + " not supported.");
                    var a = document.createEvent(r);
                    switch (r) {
                        case "MouseEvents":
                            a.initMouseEvent(n, s.bubbles || !1, s.cancelable || !0, window, s.clickCount || 1, 0, 0, s.x || s.clientX || 0, s.y || s.clientY || 0, !1, !1, !1, !1, 0, null);
                            break;
                        case "KeyboardEvents":
                            r = a.initKeyboardEvent || a.initKeyEvent, t.defaults(s, {
                                cancelable: !0,
                                ctrlKey: !1,
                                altKey: !1,
                                shiftKey: !1,
                                metaKey: !1,
                                keyCode: void 0,
                                charCode: void 0
                            }), r(n, s.bubbles || !1, s.cancelable, window, s.ctrlKey, s.altKey, s.shiftKey, s.metaKey, s.keyCode, s.charCode);
                            break;
                        default:
                            a.initEvent(n, s.bubbles || !1, s.cancelable || !0)
                    }
                    t.defaults(a, o), e.dispatchEvent(a)
                },
                bind: function(t, e, i, n) {
                    return t.addEventListener ? t.addEventListener(e, i, n || !1) : t.attachEvent && t.attachEvent("on" + e, i), s
                },
                unbind: function(t, e, i, n) {
                    return t.removeEventListener ? t.removeEventListener(e, i, n || !1) : t.detachEvent && t.detachEvent("on" + e, i), s
                },
                addClass: function(t, e) {
                    if (void 0 === t.className) t.className = e;
                    else if (t.className !== e) {
                        var i = t.className.split(/ +/); - 1 == i.indexOf(e) && (i.push(e), t.className = i.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
                    }
                    return s
                },
                removeClass: function(t, e) {
                    if (e) {
                        if (void 0 !== t.className)
                            if (t.className === e) t.removeAttribute("class");
                            else {
                                var i = t.className.split(/ +/),
                                    n = i.indexOf(e); - 1 != n && (i.splice(n, 1), t.className = i.join(" "))
                            }
                    } else t.className = void 0;
                    return s
                },
                hasClass: function(t, e) {
                    return RegExp("(?:^|\\s+)" + e + "(?:\\s+|$)").test(t.className) || !1
                },
                getWidth: function(t) {
                    return t = getComputedStyle(t), e(t["border-left-width"]) + e(t["border-right-width"]) + e(t["padding-left"]) + e(t["padding-right"]) + e(t.width)
                },
                getHeight: function(t) {
                    return t = getComputedStyle(t), e(t["border-top-width"]) + e(t["border-bottom-width"]) + e(t["padding-top"]) + e(t["padding-bottom"]) + e(t.height)
                },
                getOffset: function(t) {
                    var e = {
                        left: 0,
                        top: 0
                    };
                    if (t.offsetParent)
                        do e.left += t.offsetLeft, e.top += t.offsetTop; while (t = t.offsetParent);
                    return e
                },
                isActive: function(t) {
                    return t === document.activeElement && (t.type || t.href)
                }
            };
        return s
    }(dat.utils.common), dat.controllers.OptionController = function(t, e, i) {
        var n = function(t, s, o) {
            n.superclass.call(this, t, s);
            var r = this;
            if (this.__select = document.createElement("select"), i.isArray(o)) {
                var a = {};
                i.each(o, function(t) {
                    a[t] = t
                }), o = a
            }
            i.each(o, function(t, e) {
                var i = document.createElement("option");
                i.innerHTML = e, i.setAttribute("value", t), r.__select.appendChild(i)
            }), this.updateDisplay(), e.bind(this.__select, "change", function() {
                r.setValue(this.options[this.selectedIndex].value)
            }), this.domElement.appendChild(this.__select)
        };
        return n.superclass = t, i.extend(n.prototype, t.prototype, {
            setValue: function(t) {
                return t = n.superclass.prototype.setValue.call(this, t), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), t
            },
            updateDisplay: function() {
                return this.__select.value = this.getValue(), n.superclass.prototype.updateDisplay.call(this)
            }
        }), n
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.NumberController = function(t, e) {
        var i = function(t, n, s) {
            i.superclass.call(this, t, n), s = s || {}, this.__min = s.min, this.__max = s.max, this.__step = s.step, this.__impliedStep = e.isUndefined(this.__step) ? 0 == this.initialValue ? 1 : Math.pow(10, Math.floor(Math.log(this.initialValue) / Math.LN10)) / 10 : this.__step, t = this.__impliedStep, t = t.toString(), t = -1 < t.indexOf(".") ? t.length - t.indexOf(".") - 1 : 0, this.__precision = t
        };
        return i.superclass = t, e.extend(i.prototype, t.prototype, {
            setValue: function(t) {
                return void 0 !== this.__min && t < this.__min ? t = this.__min : void 0 !== this.__max && t > this.__max && (t = this.__max), void 0 !== this.__step && 0 != t % this.__step && (t = Math.round(t / this.__step) * this.__step), i.superclass.prototype.setValue.call(this, t)
            },
            min: function(t) {
                return this.__min = t, this
            },
            max: function(t) {
                return this.__max = t, this
            },
            step: function(t) {
                return this.__step = t, this
            }
        }), i
    }(dat.controllers.Controller, dat.utils.common), dat.controllers.NumberControllerBox = function(t, e, i) {
        var n = function(t, s, o) {
            function r() {
                var t = parseFloat(h.__input.value);
                i.isNaN(t) || h.setValue(t)
            }

            function a(t) {
                var e = c - t.clientY;
                h.setValue(h.getValue() + e * h.__impliedStep), c = t.clientY
            }

            function l() {
                e.unbind(window, "mousemove", a), e.unbind(window, "mouseup", l)
            }
            this.__truncationSuspended = !1, n.superclass.call(this, t, s, o);
            var c, h = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "change", r), e.bind(this.__input, "blur", function() {
                r(), h.__onFinishChange && h.__onFinishChange.call(h, h.getValue())
            }), e.bind(this.__input, "mousedown", function(t) {
                e.bind(window, "mousemove", a), e.bind(window, "mouseup", l), c = t.clientY
            }), e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && (h.__truncationSuspended = !0, this.blur(), h.__truncationSuspended = !1)
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return n.superclass = t, i.extend(n.prototype, t.prototype, {
            updateDisplay: function() {
                var t, e = this.__input;
                if (this.__truncationSuspended) t = this.getValue();
                else {
                    t = this.getValue();
                    var i = Math.pow(10, this.__precision);
                    t = Math.round(t * i) / i
                }
                return e.value = t, n.superclass.prototype.updateDisplay.call(this)
            }
        }), n
    }(dat.controllers.NumberController, dat.dom.dom, dat.utils.common), dat.controllers.NumberControllerSlider = function(t, e, i, n, s) {
        function o(t, e, i, n, s) {
            return n + (t - e) / (i - e) * (s - n)
        }
        var r = function(t, i, n, s, a) {
            function l(t) {
                t.preventDefault();
                var i = e.getOffset(h.__background),
                    n = e.getWidth(h.__background);
                return h.setValue(o(t.clientX, i.left, i.left + n, h.__min, h.__max)), !1
            }

            function c() {
                e.unbind(window, "mousemove", l), e.unbind(window, "mouseup", c), h.__onFinishChange && h.__onFinishChange.call(h, h.getValue())
            }
            r.superclass.call(this, t, i, {
                min: n,
                max: s,
                step: a
            });
            var h = this;
            this.__background = document.createElement("div"), this.__foreground = document.createElement("div"), e.bind(this.__background, "mousedown", function(t) {
                e.bind(window, "mousemove", l), e.bind(window, "mouseup", c), l(t)
            }), e.addClass(this.__background, "slider"), e.addClass(this.__foreground, "slider-fg"), this.updateDisplay(), this.__background.appendChild(this.__foreground), this.domElement.appendChild(this.__background)
        };
        return r.superclass = t, r.useDefaultStyles = function() {
            i.inject(s)
        }, n.extend(r.prototype, t.prototype, {
            updateDisplay: function() {
                var t = (this.getValue() - this.__min) / (this.__max - this.__min);
                return this.__foreground.style.width = 100 * t + "%", r.superclass.prototype.updateDisplay.call(this)
            }
        }), r
    }(dat.controllers.NumberController, dat.dom.dom, dat.utils.css, dat.utils.common, "/**\n * dat-gui JavaScript Controller Library\n * http://code.google.com/p/dat-gui\n *\n * Copyright 2011 Data Arts Team, Google Creative Lab\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n */\n\n.slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}"), dat.controllers.FunctionController = function(t, e, i) {
        var n = function(t, i, s) {
            n.superclass.call(this, t, i);
            var o = this;
            this.__button = document.createElement("div"), this.__button.innerHTML = void 0 === s ? "Fire" : s, e.bind(this.__button, "click", function(t) {
                return t.preventDefault(), o.fire(), !1
            }), e.addClass(this.__button, "button"), this.domElement.appendChild(this.__button)
        };
        return n.superclass = t, i.extend(n.prototype, t.prototype, {
            fire: function() {
                this.__onChange && this.__onChange.call(this), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.getValue().call(this.object)
            }
        }), n
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.BooleanController = function(t, e, i) {
        var n = function(t, i) {
            n.superclass.call(this, t, i);
            var s = this;
            this.__prev = this.getValue(), this.__checkbox = document.createElement("input"), this.__checkbox.setAttribute("type", "checkbox"), e.bind(this.__checkbox, "change", function() {
                s.setValue(!s.__prev)
            }, !1), this.domElement.appendChild(this.__checkbox), this.updateDisplay()
        };
        return n.superclass = t, i.extend(n.prototype, t.prototype, {
            setValue: function(t) {
                return t = n.superclass.prototype.setValue.call(this, t), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), t
            },
            updateDisplay: function() {
                return !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0) : this.__checkbox.checked = !1, n.superclass.prototype.updateDisplay.call(this)
            }
        }), n
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.color.toString = function(t) {
        return function(e) {
            if (1 == e.a || t.isUndefined(e.a)) {
                for (e = e.hex.toString(16); 6 > e.length;) e = "0" + e;
                return "#" + e
            }
            return "rgba(" + Math.round(e.r) + "," + Math.round(e.g) + "," + Math.round(e.b) + "," + e.a + ")"
        }
    }(dat.utils.common), dat.color.interpret = function(t, e) {
        var i, n, s = [{
            litmus: e.isString,
            conversions: {
                THREE_CHAR_HEX: {
                    read: function(t) {
                        return t = t.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i), null === t ? !1 : {
                            space: "HEX",
                            hex: parseInt("0x" + t[1].toString() + t[1].toString() + t[2].toString() + t[2].toString() + t[3].toString() + t[3].toString())
                        }
                    },
                    write: t
                },
                SIX_CHAR_HEX: {
                    read: function(t) {
                        return t = t.match(/^#([A-F0-9]{6})$/i), null === t ? !1 : {
                            space: "HEX",
                            hex: parseInt("0x" + t[1].toString())
                        }
                    },
                    write: t
                },
                CSS_RGB: {
                    read: function(t) {
                        return t = t.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/), null === t ? !1 : {
                            space: "RGB",
                            r: parseFloat(t[1]),
                            g: parseFloat(t[2]),
                            b: parseFloat(t[3])
                        }
                    },
                    write: t
                },
                CSS_RGBA: {
                    read: function(t) {
                        return t = t.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/), null === t ? !1 : {
                            space: "RGB",
                            r: parseFloat(t[1]),
                            g: parseFloat(t[2]),
                            b: parseFloat(t[3]),
                            a: parseFloat(t[4])
                        }
                    },
                    write: t
                }
            }
        }, {
            litmus: e.isNumber,
            conversions: {
                HEX: {
                    read: function(t) {
                        return {
                            space: "HEX",
                            hex: t,
                            conversionName: "HEX"
                        }
                    },
                    write: function(t) {
                        return t.hex
                    }
                }
            }
        }, {
            litmus: e.isArray,
            conversions: {
                RGB_ARRAY: {
                    read: function(t) {
                        return 3 != t.length ? !1 : {
                            space: "RGB",
                            r: t[0],
                            g: t[1],
                            b: t[2]
                        }
                    },
                    write: function(t) {
                        return [t.r, t.g, t.b]
                    }
                },
                RGBA_ARRAY: {
                    read: function(t) {
                        return 4 != t.length ? !1 : {
                            space: "RGB",
                            r: t[0],
                            g: t[1],
                            b: t[2],
                            a: t[3]
                        }
                    },
                    write: function(t) {
                        return [t.r, t.g, t.b, t.a]
                    }
                }
            }
        }, {
            litmus: e.isObject,
            conversions: {
                RGBA_OBJ: {
                    read: function(t) {
                        return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) && e.isNumber(t.a) ? {
                            space: "RGB",
                            r: t.r,
                            g: t.g,
                            b: t.b,
                            a: t.a
                        } : !1
                    },
                    write: function(t) {
                        return {
                            r: t.r,
                            g: t.g,
                            b: t.b,
                            a: t.a
                        }
                    }
                },
                RGB_OBJ: {
                    read: function(t) {
                        return e.isNumber(t.r) && e.isNumber(t.g) && e.isNumber(t.b) ? {
                            space: "RGB",
                            r: t.r,
                            g: t.g,
                            b: t.b
                        } : !1
                    },
                    write: function(t) {
                        return {
                            r: t.r,
                            g: t.g,
                            b: t.b
                        }
                    }
                },
                HSVA_OBJ: {
                    read: function(t) {
                        return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) && e.isNumber(t.a) ? {
                            space: "HSV",
                            h: t.h,
                            s: t.s,
                            v: t.v,
                            a: t.a
                        } : !1
                    },
                    write: function(t) {
                        return {
                            h: t.h,
                            s: t.s,
                            v: t.v,
                            a: t.a
                        }
                    }
                },
                HSV_OBJ: {
                    read: function(t) {
                        return e.isNumber(t.h) && e.isNumber(t.s) && e.isNumber(t.v) ? {
                            space: "HSV",
                            h: t.h,
                            s: t.s,
                            v: t.v
                        } : !1
                    },
                    write: function(t) {
                        return {
                            h: t.h,
                            s: t.s,
                            v: t.v
                        }
                    }
                }
            }
        }];
        return function() {
            n = !1;
            var t = 1 < arguments.length ? e.toArray(arguments) : arguments[0];
            return e.each(s, function(s) {
                return s.litmus(t) ? (e.each(s.conversions, function(s, o) {
                    return i = s.read(t), !1 === n && !1 !== i ? (n = i, i.conversionName = o, i.conversion = s, e.BREAK) : void 0
                }), e.BREAK) : void 0
            }), n
        }
    }(dat.color.toString, dat.utils.common), dat.GUI = dat.gui.GUI = function(t, e, i, n, s, o, r, a, l, c, h, u, d, p, f) {
        function g(t, e, i, o) {
            if (void 0 === e[i]) throw Error("Object " + e + ' has no property "' + i + '"');
            o.color ? e = new h(e, i) : (e = [e, i].concat(o.factoryArgs), e = n.apply(t, e)), o.before instanceof s && (o.before = o.before.__li), b(t, e), p.addClass(e.domElement, "c"), i = document.createElement("span"), p.addClass(i, "property-name"), i.innerHTML = e.property;
            var r = document.createElement("div");
            return r.appendChild(i), r.appendChild(e.domElement), o = m(t, r, o.before), p.addClass(o, H.CLASS_CONTROLLER_ROW), p.addClass(o, typeof e.getValue()), v(t, o, e), t.__controllers.push(e), e
        }

        function m(t, e, i) {
            var n = document.createElement("li");
            return e && n.appendChild(e), i ? t.__ul.insertBefore(n, params.before) : t.__ul.appendChild(n), t.onResize(), n
        }

        function v(t, e, i) {
            if (i.__li = e, i.__gui = t, f.extend(i, {
                    options: function(e) {
                        return 1 < arguments.length ? (i.remove(), g(t, i.object, i.property, {
                            before: i.__li.nextElementSibling,
                            factoryArgs: [f.toArray(arguments)]
                        })) : f.isArray(e) || f.isObject(e) ? (i.remove(), g(t, i.object, i.property, {
                            before: i.__li.nextElementSibling,
                            factoryArgs: [e]
                        })) : void 0
                    },
                    name: function(t) {
                        return i.__li.firstElementChild.firstElementChild.innerHTML = t, i
                    },
                    listen: function() {
                        return i.__gui.listen(i), i
                    },
                    remove: function() {
                        return i.__gui.remove(i), i
                    }
                }), i instanceof l) {
                var n = new a(i.object, i.property, {
                    min: i.__min,
                    max: i.__max,
                    step: i.__step
                });
                f.each(["updateDisplay", "onChange", "onFinishChange"], function(t) {
                    var e = i[t],
                        s = n[t];
                    i[t] = n[t] = function() {
                        var t = Array.prototype.slice.call(arguments);
                        return e.apply(i, t), s.apply(n, t)
                    }
                }), p.addClass(e, "has-slider"), i.domElement.insertBefore(n.domElement, i.domElement.firstElementChild)
            } else if (i instanceof a) {
                var s = function(e) {
                    return f.isNumber(i.__min) && f.isNumber(i.__max) ? (i.remove(), g(t, i.object, i.property, {
                        before: i.__li.nextElementSibling,
                        factoryArgs: [i.__min, i.__max, i.__step]
                    })) : e
                };
                i.min = f.compose(s, i.min), i.max = f.compose(s, i.max)
            }/* else i instanceof o ? (p.bind(e, "click", function() {
                p.fakeEvent(i.__checkbox, "click")
            }), p.bind(i.__checkbox, "click", function(t) {
                t.stopPropagation()
            })) : i instanceof r ? (p.bind(e, "click", function() {
                p.fakeEvent(i.__button, "click")
            }), p.bind(e, "mouseover", function() {
                p.addClass(i.__button, "hover")
            }), p.bind(e, "mouseout", function() {
                p.removeClass(i.__button, "hover")
            })) : i instanceof h && (p.addClass(e, "color"), i.updateDisplay = f.compose(function(t) {
                return e.style.borderLeftColor = i.__color.toString(), t
            }, i.updateDisplay), i.updateDisplay());*/
            i.setValue = f.compose(function(e) {
                return t.getRoot().__preset_select && i.isModified() && C(t.getRoot(), !0), e
            }, i.setValue)
        }

        function b(t, e) {
            var i = t.getRoot(),
                n = i.__rememberedObjects.indexOf(e.object);
            if (-1 != n) {
                var s = i.__rememberedObjectIndecesToControllers[n];
                if (void 0 === s && (s = {}, i.__rememberedObjectIndecesToControllers[n] = s), s[e.property] = e, i.load && i.load.remembered) {
                    if (i = i.load.remembered, i[t.preset]) i = i[t.preset];
                    else {
                        if (!i[D]) return;
                        i = i[D]
                    }
                    i[n] && void 0 !== i[n][e.property] && (n = i[n][e.property], e.initialValue = n, e.setValue(n))
                }
            }
        }

        function y(t) {
            var e = t.__save_row = document.createElement("li");
            p.addClass(t.domElement, "has-save"), t.__ul.insertBefore(e, t.__ul.firstChild), p.addClass(e, "save-row");
            var i = document.createElement("span");
            i.innerHTML = "&nbsp;", p.addClass(i, "button gears");
            var n = document.createElement("span");
            n.innerHTML = "Save", p.addClass(n, "button"), p.addClass(n, "save");
            var s = document.createElement("span");
            s.innerHTML = "New", p.addClass(s, "button"), p.addClass(s, "save-as");
            var o = document.createElement("span");
            o.innerHTML = "Revert", p.addClass(o, "button"), p.addClass(o, "revert");
            var r = t.__preset_select = document.createElement("select");
            if (t.load && t.load.remembered ? f.each(t.load.remembered, function(e, i) {
                    k(t, i, i == t.preset)
                }) : k(t, D, !1), p.bind(r, "change", function() {
                    for (var e = 0; e < t.__preset_select.length; e++) t.__preset_select[e].innerHTML = t.__preset_select[e].value;
                    t.preset = this.value
                }), e.appendChild(r), e.appendChild(i), e.appendChild(n), e.appendChild(s), e.appendChild(o), S) {
                var e = document.getElementById("dg-save-locally"),
                    a = document.getElementById("dg-local-explain");
                e.style.display = "block", e = document.getElementById("dg-local-storage"), "true" === localStorage.getItem(document.location.href + ".isLocal") && e.setAttribute("checked", "checked");
                var l = function() {
                    a.style.display = t.useLocalStorage ? "block" : "none"
                };
                l(), p.bind(e, "change", function() {
                    t.useLocalStorage = !t.useLocalStorage, l()
                })
            }
            var c = document.getElementById("dg-new-constructor");
            p.bind(c, "keydown", function(t) {
                !t.metaKey || 67 !== t.which && 67 != t.keyCode || A.hide()
            }), p.bind(i, "click", function() {
                c.innerHTML = JSON.stringify(t.getSaveObject(), void 0, 2), A.show(), c.focus(), c.select()
            }), p.bind(n, "click", function() {
                t.save()
            }), p.bind(s, "click", function() {
                var e = prompt("Enter a new preset name.");
                e && t.saveAs(e)
            }), p.bind(o, "click", function() {
                t.revert()
            })
        }

        function _(t) {
            function e(e) {
                return e.preventDefault(), s = e.clientX, p.addClass(t.__closeButton, H.CLASS_DRAG), p.bind(window, "mousemove", i), p.bind(window, "mouseup", n), !1
            }

            function i(e) {
                return e.preventDefault(), t.width += s - e.clientX, t.onResize(), s = e.clientX, !1
            }

            function n() {
                p.removeClass(t.__closeButton, H.CLASS_DRAG), p.unbind(window, "mousemove", i), p.unbind(window, "mouseup", n)
            }
            t.__resize_handle = document.createElement("div"), f.extend(t.__resize_handle.style, {
                width: "6px",
                marginLeft: "-3px",
                height: "200px",
                cursor: "ew-resize",
                position: "absolute"
            });
            var s;
            p.bind(t.__resize_handle, "mousedown", e), p.bind(t.__closeButton, "mousedown", e), t.domElement.insertBefore(t.__resize_handle, t.domElement.firstElementChild)
        }

        function w(t, e) {
            t.domElement.style.width = e + "px", t.__save_row && t.autoPlace && (t.__save_row.style.width = e + "px"), t.__closeButton && (t.__closeButton.style.width = e + "px")
        }

        function x(t, e) {
            var i = {};
            return f.each(t.__rememberedObjects, function(n, s) {
                var o = {};
                f.each(t.__rememberedObjectIndecesToControllers[s], function(t, i) {
                    o[i] = e ? t.initialValue : t.getValue()
                }), i[s] = o
            }), i
        }

        function k(t, e, i) {
            var n = document.createElement("option");
            n.innerHTML = e, n.value = e, t.__preset_select.appendChild(n), i && (t.__preset_select.selectedIndex = t.__preset_select.length - 1)
        }

        function C(t, e) {
            var i = t.__preset_select[t.__preset_select.selectedIndex];
            i.innerHTML = e ? i.value + "*" : i.value
        }

        function T(t) {
            0 != t.length && u(function() {
                T(t)
            }), f.each(t, function(t) {
                t.updateDisplay()
            })
        }
        t.inject(i);
        var S, D = "Default";
        try {
            S = "localStorage" in window && null !== window.localStorage
        } catch (E) {
            S = !1
        }
        var A, M, N = !0,
            P = !1,
            I = [],
            H = function(t) {
                function e() {
                    //localStorage.setItem(document.location.href + ".gui", JSON.stringify(n.getSaveObject()))
                }

                function i() {
                    var t = n.getRoot();
                    t.width += 1, f.defer(function() {
                        t.width -= 1
                    })
                }
                var n = this;
                this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), p.addClass(this.domElement, "dg"), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], t = t || {}, t = f.defaults(t, {
                    autoPlace: !0,
                    width: H.DEFAULT_WIDTH
                }), t = f.defaults(t, {
                    resizable: t.autoPlace,
                    hideable: t.autoPlace
                }), f.isUndefined(t.load) ? t.load = {
                    preset: D
                } : t.preset && (t.load.preset = t.preset), f.isUndefined(t.parent) && t.hideable && I.push(this), t.resizable = f.isUndefined(t.parent) && t.resizable, t.autoPlace && f.isUndefined(t.scrollable) && (t.scrollable = !0);
                var s = S && "true"// === localStorage.getItem(document.location.href + ".isLocal");
                if (Object.defineProperties(this, {
                        parent: {
                            get: function() {
                                return t.parent
                            }
                        },
                        scrollable: {
                            get: function() {
                                return t.scrollable
                            }
                        },
                        autoPlace: {
                            get: function() {
                                return t.autoPlace
                            }
                        },
                        preset: {
                            get: function() {
                                return n.parent ? n.getRoot().preset : t.load.preset
                            },
                            set: function(e) {
                                for (n.parent ? n.getRoot().preset = e : t.load.preset = e, e = 0; e < this.__preset_select.length; e++) this.__preset_select[e].value == this.preset && (this.__preset_select.selectedIndex = e);
                                n.revert()
                            }
                        },
                        width: {
                            get: function() {
                                return t.width
                            },
                            set: function(e) {
                                t.width = e, w(n, e)
                            }
                        },
                        name: {
                            get: function() {
                                return t.name
                            },
                            set: function(e) {
                                t.name = e, r && (r.innerHTML = t.name)
                            }
                        },
                        closed: {
                            get: function() {
                                return t.closed
                            },
                            set: function(e) {
                                t.closed = e, t.closed ? p.addClass(n.__ul, H.CLASS_CLOSED) : p.removeClass(n.__ul, H.CLASS_CLOSED), this.onResize(), n.__closeButton && (n.__closeButton.innerHTML = e ? H.TEXT_OPEN : H.TEXT_CLOSED)
                            }
                        },
                        load: {
                            get: function() {
                                return t.load
                            }
                        },
                        useLocalStorage: {
                            get: function() {
                                return s
                            },
                            set: function(t) {
                                //S && ((s = t) ? p.bind(window, "unload", e) : p.unbind(window, "unload", e), localStorage.setItem(document.location.href + ".isLocal", t))
                            }
                        }
                    }), f.isUndefined(t.parent)) {
                    if (t.closed = !1, p.addClass(this.domElement, H.CLASS_MAIN), p.makeSelectable(this.domElement, !1), S && s) {
                        n.useLocalStorage = !0;
                        /*var o = localStorage.getItem(document.location.href + ".gui");
                        o && (t.load = JSON.parse(o))*/
                    }
                    this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = H.TEXT_CLOSED, p.addClass(this.__closeButton, H.CLASS_CLOSE_BUTTON), this.domElement.appendChild(this.__closeButton), p.bind(this.__closeButton, "click", function() {
                        n.closed = !n.closed
                    })
                } else {
                    void 0 === t.closed && (t.closed = !0);
                    var r = document.createTextNode(t.name);
                    p.addClass(r, "controller-name"), o = m(n, r), p.addClass(this.__ul, H.CLASS_CLOSED), p.addClass(o, "title"), p.bind(o, "click", function(t) {
                        return t.preventDefault(), n.closed = !n.closed, !1
                    }), t.closed || (this.closed = !1)
                }
                t.autoPlace && (f.isUndefined(t.parent) && (N && (M = document.createElement("div"), p.addClass(M, "dg"), p.addClass(M, H.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(M), N = !1), M.appendChild(this.domElement), p.addClass(this.domElement, H.CLASS_AUTO_PLACE)), this.parent || w(n, t.width)), p.bind(window, "resize", function() {
                    n.onResize()
                }), p.bind(this.__ul, "webkitTransitionEnd", function() {
                    n.onResize()
                }), p.bind(this.__ul, "transitionend", function() {
                    n.onResize()
                }), p.bind(this.__ul, "oTransitionEnd", function() {
                    n.onResize()
                }), this.onResize(), t.resizable && _(this), n.getRoot(), t.parent || i()
            };
        return H.toggleHide = function() {
            P = !P, f.each(I, function(t) {
                t.domElement.style.zIndex = P ? -999 : 999, t.domElement.style.opacity = P ? 0 : 1
            })
        }, H.CLASS_AUTO_PLACE = "a", H.CLASS_AUTO_PLACE_CONTAINER = "ac", H.CLASS_MAIN = "main", H.CLASS_CONTROLLER_ROW = "cr", H.CLASS_TOO_TALL = "taller-than-window", H.CLASS_CLOSED = "closed", H.CLASS_CLOSE_BUTTON = "close-button", H.CLASS_DRAG = "drag", H.DEFAULT_WIDTH = 245, H.TEXT_CLOSED = "", H.TEXT_OPEN = "Open Controls", p.bind(window, "keydown", function(t) {
            "text" === document.activeElement.type || 72 !== t.which && 72 != t.keyCode || H.toggleHide()
        }, !1), f.extend(H.prototype, {
            add: function(t, e) {
                return g(this, t, e, {
                    factoryArgs: Array.prototype.slice.call(arguments, 2)
                })
            },
            addColor: function(t, e) {
                return g(this, t, e, {
                    color: !0
                })
            },
            remove: function(t) {
                this.__ul.removeChild(t.__li), this.__controllers.slice(this.__controllers.indexOf(t), 1);
                var e = this;
                f.defer(function() {
                    e.onResize()
                })
            },
            destroy: function() {
                this.autoPlace && M.removeChild(this.domElement)
            },
            addFolder: function(t) {
                if (void 0 !== this.__folders[t]) throw Error('You already have a folder in this GUI by the name "' + t + '"');
                var e = {
                    name: t,
                    parent: this
                };
                return e.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[t] && (e.closed = this.load.folders[t].closed, e.load = this.load.folders[t]), e = new H(e), this.__folders[t] = e, t = m(this, e.domElement), p.addClass(t, "folder"), e
            },
            open: function() {
                this.closed = !1
            },
            close: function() {
                this.closed = !0
            },
            onResize: function() {
                var t = this.getRoot();
                if (t.scrollable) {
                    var e = p.getOffset(t.__ul).top,
                        i = 0;
                    f.each(t.__ul.childNodes, function(e) {
                        t.autoPlace && e === t.__save_row || (i += p.getHeight(e))
                    }), window.innerHeight - e - 20 < i ? (p.addClass(t.domElement, H.CLASS_TOO_TALL), t.__ul.style.height = window.innerHeight - e - 20 + "px") : (p.removeClass(t.domElement, H.CLASS_TOO_TALL), t.__ul.style.height = "auto")
                }
                t.__resize_handle && f.defer(function() {
                    t.__resize_handle.style.height = t.__ul.offsetHeight + "px"
                }), t.__closeButton && (t.__closeButton.style.width = t.width + "px")
            },
            remember: function() {
                if (f.isUndefined(A) && (A = new d, A.domElement.innerHTML = e), this.parent) throw Error("You can only call remember on a top level GUI.");
                var t = this;
                f.each(Array.prototype.slice.call(arguments), function(e) {
                    0 == t.__rememberedObjects.length && y(t), -1 == t.__rememberedObjects.indexOf(e) && t.__rememberedObjects.push(e)
                }), this.autoPlace && w(this, this.width)
            },
            getRoot: function() {
                for (var t = this; t.parent;) t = t.parent;
                return t
            },
            getSaveObject: function() {
                var t = this.load;
                return t.closed = this.closed, 0 < this.__rememberedObjects.length && (t.preset = this.preset, t.remembered || (t.remembered = {}), t.remembered[this.preset] = x(this)), t.folders = {}, f.each(this.__folders, function(e, i) {
                    t.folders[i] = e.getSaveObject()
                }), t
            },
            save: function() {
                this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = x(this), C(this, !1)
            },
            saveAs: function(t) {
                this.load.remembered || (this.load.remembered = {}, this.load.remembered[D] = x(this, !0)), this.load.remembered[t] = x(this), this.preset = t, k(this, t, !0)
            },
            revert: function(t) {
                f.each(this.__controllers, function(e) {
                    this.getRoot().load.remembered ? b(t || this.getRoot(), e) : e.setValue(e.initialValue)
                }, this), f.each(this.__folders, function(t) {
                    t.revert(t)
                }), t || C(this.getRoot(), !1)
            },
            listen: function(t) {
                var e = 0 == this.__listening.length;
                this.__listening.push(t), e && T(this.__listening)
            }
        }), H
    }(dat.utils.css, '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>', ".dg {\n  /** Clear list styles */\n  /* Auto-place container */\n  /* Auto-placed GUI's */\n  /* Line items that don't contain folders. */\n  /** Folder names */\n  /** Hides closed items */\n  /** Controller row */\n  /** Name-half (left) */\n  /** Controller-half (right) */\n  /** Controller placement */\n  /** Shorter number boxes when slider is present. */\n  /** Ensure the entire boolean and function row shows a hand */ }\n  .dg ul {\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    clear: both; }\n  .dg.ac {\n    position: fixed;\n    top: 0;\n    left: 0;\n    right: 0;\n    height: 0;\n    z-index: 0; }\n  .dg:not(.ac) .main {\n    /** Exclude mains in ac so that we don't hide close button */\n    overflow: hidden; }\n  .dg.main {\n    -webkit-transition: opacity 0.1s linear;\n    -o-transition: opacity 0.1s linear;\n    -moz-transition: opacity 0.1s linear;\n    transition: opacity 0.1s linear; }\n    .dg.main.taller-than-window {\n      overflow-y: auto; }\n      .dg.main.taller-than-window .close-button {\n        opacity: 0;\n        /* TODO, these are style notes */\n        margin-top: -1px;\n        border-top: 1px solid #2c2c2c; }\n    .dg.main ul.closed .close-button {\n      opacity: 0 !important; }\n    .dg.main:hover .close-button,\n    .dg.main .close-button.drag {\n      opacity: 1; }\n    .dg.main .close-button {\n      /*opacity: 0;*/\n      -webkit-transition: opacity 0.1s linear;\n      -o-transition: opacity 0.1s linear;\n      -moz-transition: opacity 0.1s linear;\n      transition: opacity 0.1s linear;\n      border: 0;\n      position: absolute;\n      line-height: 19px;\n      height: 20px;\n      /* TODO, these are style notes */\n      cursor: pointer;\n      text-align: center;\n      background-color: #000;\n      opacity: 0; }\n      .dg.main .close-button:hover {\n        background-color: #111;      opacity: 0; }\n  .dg.a {\n    float: right;\n    margin-right: 15px;\n    overflow-x: hidden; }\n    .dg.a.has-save > ul {\n      margin-top: 27px; }\n      .dg.a.has-save > ul.closed {\n        margin-top: 0; }\n    .dg.a .save-row {\n      position: fixed;\n      top: 0;\n      z-index: 1002; }\n  .dg li {\n    -webkit-transition: height 0.1s ease-out;\n    -o-transition: height 0.1s ease-out;\n    -moz-transition: height 0.1s ease-out;\n    transition: height 0.1s ease-out; }\n  .dg li:not(.folder) {\n    cursor: auto;\n    height: 27px;\n    line-height: 27px;\n    overflow: hidden;\n    padding: 0 4px 0 5px; }\n  .dg li.folder {\n    padding: 0;\n    border-left: 4px solid rgba(0, 0, 0, 0); }\n  .dg li.title {\n    cursor: pointer;\n    margin-left: -4px; }\n  .dg .closed li:not(.title),\n  .dg .closed ul li,\n  .dg .closed ul li > * {\n    height: 0;\n    overflow: hidden;\n    border: 0; }\n  .dg .cr {\n    clear: both;\n    padding-left: 3px;\n    height: 27px; }\n  .dg .property-name {\n    cursor: default;\n    float: left;\n    clear: left;\n    width: 40%;\n    overflow: hidden;\n    text-overflow: ellipsis; }\n  .dg .c {\n    float: left;\n    width: 60%; }\n  .dg .c input[type=text] {\n    border: 0;\n    margin-top: 4px;\n    padding: 3px;\n    width: 100%;\n    float: right; }\n  .dg .has-slider input[type=text] {\n    width: 30%;\n    /*display: none;*/\n    margin-left: 0; }\n  .dg .slider {\n    float: left;\n    width: 66%;\n    margin-left: -5px;\n    margin-right: 0;\n    height: 19px;\n    margin-top: 4px; }\n  .dg .slider-fg {\n    height: 100%; }\n  .dg .c input[type=checkbox] {\n    margin-top: 9px; }\n  .dg .c select {\n    margin-top: 5px; }\n  .dg .cr.function,\n  .dg .cr.function .property-name,\n  .dg .cr.function *,\n  .dg .cr.boolean,\n  .dg .cr.boolean * {\n    cursor: pointer; }\n  .dg .selector {\n    display: none;\n    position: absolute;\n    margin-left: -9px;\n    margin-top: 23px;\n    z-index: 10; }\n  .dg .c:hover .selector,\n  .dg .selector.drag {\n    display: block; }\n  .dg li.save-row {\n    padding: 0; }\n    .dg li.save-row .button {\n      display: inline-block;\n      padding: 0px 6px; }\n  .dg.dialogue {\n    background-color: #222;\n    width: 460px;\n    padding: 15px;\n    font-size: 13px;\n    line-height: 15px; }\n\n/* TODO Separate style and structure */\n#dg-new-constructor {\n  padding: 10px;\n  color: #222;\n  font-family: Monaco, monospace;\n  font-size: 10px;\n  border: 0;\n  resize: none;\n  box-shadow: inset 1px 1px 1px #888;\n  word-wrap: break-word;\n  margin: 12px 0;\n  display: block;\n  width: 440px;\n  overflow-y: scroll;\n  height: 100px;\n  position: relative; }\n\n#dg-local-explain {\n  display: none;\n  font-size: 11px;\n  line-height: 17px;\n  border-radius: 3px;\n  background-color: #333;\n  padding: 8px;\n  margin-top: 10px; }\n  #dg-local-explain code {\n    font-size: 10px; }\n\n#dat-gui-save-locally {\n  display: none; }\n\n/** Main type */\n.dg {\n  color: #eee;\n  font: 11px 'Lucida Grande', sans-serif;\n  text-shadow: 0 -1px 0 #111;\n  /** Auto place */\n  /* Controller row, <li> */\n  /** Controllers */ }\n  .dg.main {\n    /** Scrollbar */ }\n    .dg.main::-webkit-scrollbar {\n      width: 5px;\n      background: #1a1a1a; }\n    .dg.main::-webkit-scrollbar-corner {\n      height: 0;\n      display: none; }\n    .dg.main::-webkit-scrollbar-thumb {\n      border-radius: 5px;\n      background: #676767; }\n  .dg li:not(.folder) {\n    background: #1a1a1a;\n    border-bottom: 1px solid #2c2c2c; }\n  .dg li.save-row {\n    line-height: 25px;\n    background: #dad5cb;\n    border: 0; }\n    .dg li.save-row select {\n      margin-left: 5px;\n      width: 108px; }\n    .dg li.save-row .button {\n      margin-left: 5px;\n      margin-top: 1px;\n      border-radius: 2px;\n      font-size: 9px;\n      line-height: 7px;\n      padding: 4px 4px 5px 4px;\n      background: #c5bdad;\n      color: #fff;\n      text-shadow: 0 1px 0 #b0a58f;\n      box-shadow: 0 -1px 0 #b0a58f;\n      cursor: pointer; }\n      .dg li.save-row .button.gears {\n        background: #c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;\n        height: 7px;\n        width: 8px; }\n      .dg li.save-row .button:hover {\n        background-color: #bab19e;\n        box-shadow: 0 -1px 0 #b0a58f; }\n  .dg li.folder {\n    border-bottom: 0; }\n  .dg li.title {\n    padding-left: 16px;\n    background: black url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;\n    cursor: pointer;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.2); }\n  .dg .closed li.title {\n    background-image: url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==); }\n  .dg .cr.boolean {\n    border-left: 3px solid #806787; }\n  .dg .cr.function {\n    border-left: 3px solid #e61d5f; }\n  .dg .cr.number {\n    border-left: 3px solid #2fa1d6; }\n    .dg .cr.number input[type=text] {\n      color: #2fa1d6; }\n  .dg .cr.string {\n    border-left: 3px solid #1ed36f; }\n    .dg .cr.string input[type=text] {\n      color: #1ed36f; }\n  .dg .cr.function:hover, .dg .cr.boolean:hover {\n    background: #111; }\n  .dg .c input[type=text] {\n    background: #303030;\n    outline: none; }\n    .dg .c input[type=text]:hover {\n      background: #3c3c3c; }\n    .dg .c input[type=text]:focus {\n      background: #494949;\n      color: #fff; }\n  .dg .c .slider {\n    background: #303030;\n    cursor: ew-resize; }\n  .dg .c .slider-fg {\n    background: #2fa1d6; }\n  .dg .c .slider:hover {\n    background: #3c3c3c; }\n    .dg .c .slider:hover .slider-fg {\n      background: #44abda; }\n", dat.controllers.factory = function(t, e, i, n, s, o, r) {
        return function(a, l, c, h) {
            var u = a[l];
            return r.isArray(c) || r.isObject(c) ? new t(a, l, c) : r.isNumber(u) ? r.isNumber(c) && r.isNumber(h) ? new i(a, l, c, h) : new e(a, l, {
                min: c,
                max: h
            }) : r.isString(u) ? new n(a, l) : r.isFunction(u) ? new s(a, l, "") : r.isBoolean(u) ? new o(a, l) : void 0
        }
    }(dat.controllers.OptionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.StringController = function(t, e, i) {
        var n = function(t, i) {
            function s() {
                o.setValue(o.__input.value)
            }
            n.superclass.call(this, t, i);
            var o = this;
            this.__input = document.createElement("input"), this.__input.setAttribute("type", "text"), e.bind(this.__input, "keyup", s), e.bind(this.__input, "change", s), e.bind(this.__input, "blur", function() {
                o.__onFinishChange && o.__onFinishChange.call(o, o.getValue())
            }), e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && this.blur()
            }), this.updateDisplay(), this.domElement.appendChild(this.__input)
        };
        return n.superclass = t, i.extend(n.prototype, t.prototype, {
            updateDisplay: function() {
                return e.isActive(this.__input) || (this.__input.value = this.getValue()), n.superclass.prototype.updateDisplay.call(this)
            }
        }), n
    }(dat.controllers.Controller, dat.dom.dom, dat.utils.common), dat.controllers.FunctionController, dat.controllers.BooleanController, dat.utils.common), dat.controllers.Controller, dat.controllers.BooleanController, dat.controllers.FunctionController, dat.controllers.NumberControllerBox, dat.controllers.NumberControllerSlider, dat.controllers.OptionController, dat.controllers.ColorController = function(t, e, i, n, s) {
        function o(t, e, i, n) {
            t.style.background = "", s.each(l, function(s) {
                t.style.cssText += "background: " + s + "linear-gradient(" + e + ", " + i + " 0%, " + n + " 100%); "
            })
        }

        function r(t) {
            t.style.background = "", t.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", t.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", t.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"
        }
        var a = function(t, l) {
            function c(t) {
                p(t), e.bind(window, "mousemove", p), e.bind(window, "mouseup", h)
            }

            function h() {
                e.unbind(window, "mousemove", p), e.unbind(window, "mouseup", h)
            }

            function u() {
                var t = n(this.value);
                !1 !== t ? (g.__color.__state = t, g.setValue(g.__color.toOriginal())) : this.value = g.__color.toString()
            }

            function d() {
                e.unbind(window, "mousemove", f), e.unbind(window, "mouseup", d)
            }

            function p(t) {
                t.preventDefault();
                var i = e.getWidth(g.__saturation_field),
                    n = e.getOffset(g.__saturation_field),
                    s = (t.clientX - n.left + document.body.scrollLeft) / i;
                return t = 1 - (t.clientY - n.top + document.body.scrollTop) / i, t > 1 ? t = 1 : 0 > t && (t = 0), s > 1 ? s = 1 : 0 > s && (s = 0), g.__color.v = t, g.__color.s = s, g.setValue(g.__color.toOriginal()), !1
            }

            function f(t) {
                t.preventDefault();
                var i = e.getHeight(g.__hue_field),
                    n = e.getOffset(g.__hue_field);
                return t = 1 - (t.clientY - n.top + document.body.scrollTop) / i, t > 1 ? t = 1 : 0 > t && (t = 0), g.__color.h = 360 * t, g.setValue(g.__color.toOriginal()), !1
            }
            a.superclass.call(this, t, l), this.__color = new i(this.getValue()), this.__temp = new i(0);
            var g = this;
            this.domElement = document.createElement("div"), e.makeSelectable(this.domElement, !1), this.__selector = document.createElement("div"), this.__selector.className = "selector", this.__saturation_field = document.createElement("div"), this.__saturation_field.className = "saturation-field", this.__field_knob = document.createElement("div"), this.__field_knob.className = "field-knob", this.__field_knob_border = "2px solid ", this.__hue_knob = document.createElement("div"), this.__hue_knob.className = "hue-knob", this.__hue_field = document.createElement("div"), this.__hue_field.className = "hue-field", this.__input = document.createElement("input"), this.__input.type = "text", this.__input_textShadow = "0 1px 1px ", e.bind(this.__input, "keydown", function(t) {
                13 === t.keyCode && u.call(this)
            }), e.bind(this.__input, "blur", u), e.bind(this.__selector, "mousedown", function() {
                e.addClass(this, "drag").bind(window, "mouseup", function() {
                    e.removeClass(g.__selector, "drag")
                })
            });
            var m = document.createElement("div");
            s.extend(this.__selector.style, {
                width: "122px",
                height: "102px",
                padding: "3px",
                backgroundColor: "#222",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
            }), s.extend(this.__field_knob.style, {
                position: "absolute",
                width: "12px",
                height: "12px",
                border: this.__field_knob_border + (.5 > this.__color.v ? "#fff" : "#000"),
                boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                borderRadius: "12px",
                zIndex: 1
            }), s.extend(this.__hue_knob.style, {
                position: "absolute",
                width: "15px",
                height: "2px",
                borderRight: "4px solid #fff",
                zIndex: 1
            }), s.extend(this.__saturation_field.style, {
                width: "100px",
                height: "100px",
                border: "1px solid #555",
                marginRight: "3px",
                display: "inline-block",
                cursor: "pointer"
            }), s.extend(m.style, {
                width: "100%",
                height: "100%",
                background: "none"
            }), o(m, "top", "rgba(0,0,0,0)", "#000"), s.extend(this.__hue_field.style, {
                width: "15px",
                height: "100px",
                display: "inline-block",
                border: "1px solid #555",
                cursor: "ns-resize"
            }), r(this.__hue_field), s.extend(this.__input.style, {
                outline: "none",
                textAlign: "center",
                color: "#fff",
                border: 0,
                fontWeight: "bold",
                textShadow: this.__input_textShadow + "rgba(0,0,0,0.7)"
            }), e.bind(this.__saturation_field, "mousedown", c), e.bind(this.__field_knob, "mousedown", c), e.bind(this.__hue_field, "mousedown", function(t) {
                f(t), e.bind(window, "mousemove", f), e.bind(window, "mouseup", d)
            }), this.__saturation_field.appendChild(m), this.__selector.appendChild(this.__field_knob), this.__selector.appendChild(this.__saturation_field), this.__selector.appendChild(this.__hue_field), this.__hue_field.appendChild(this.__hue_knob), this.domElement.appendChild(this.__input), this.domElement.appendChild(this.__selector), this.updateDisplay()
        };
        a.superclass = t, s.extend(a.prototype, t.prototype, {
            updateDisplay: function() {
                var t = n(this.getValue());
                if (!1 !== t) {
                    var e = !1;
                    s.each(i.COMPONENTS, function(i) {
                        return s.isUndefined(t[i]) || s.isUndefined(this.__color.__state[i]) || t[i] === this.__color.__state[i] ? void 0 : (e = !0, {})
                    }, this), e && s.extend(this.__color.__state, t)
                }
                s.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                var r = .5 > this.__color.v || .5 < this.__color.s ? 255 : 0,
                    a = 255 - r;
                s.extend(this.__field_knob.style, {
                    marginLeft: 100 * this.__color.s - 7 + "px",
                    marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                    backgroundColor: this.__temp.toString(),
                    border: this.__field_knob_border + "rgb(" + r + "," + r + "," + r + ")"
                }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, o(this.__saturation_field, "left", "#fff", this.__temp.toString()), s.extend(this.__input.style, {
                    backgroundColor: this.__input.value = this.__color.toString(),
                    color: "rgb(" + r + "," + r + "," + r + ")",
                    textShadow: this.__input_textShadow + "rgba(" + a + "," + a + "," + a + ",.7)"
                })
            }
        });
        var l = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
        return a
    }(dat.controllers.Controller, dat.dom.dom, dat.color.Color = function(t, e, i, n) {
        function s(t, e, i) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "RGB" === this.__state.space ? this.__state[e] : (r(this, e, i), this.__state[e])
                },
                set: function(t) {
                    "RGB" !== this.__state.space && (r(this, e, i), this.__state.space = "RGB"), this.__state[e] = t
                }
            })
        }

        function o(t, e) {
            Object.defineProperty(t, e, {
                get: function() {
                    return "HSV" === this.__state.space ? this.__state[e] : (a(this), this.__state[e])
                },
                set: function(t) {
                    "HSV" !== this.__state.space && (a(this), this.__state.space = "HSV"), this.__state[e] = t
                }
            })
        }

        function r(t, i, s) {
            if ("HEX" === t.__state.space) t.__state[i] = e.component_from_hex(t.__state.hex, s);
            else {
                if ("HSV" !== t.__state.space) throw "Corrupted color state";
                n.extend(t.__state, e.hsv_to_rgb(t.__state.h, t.__state.s, t.__state.v))
            }
        }

        function a(t) {
            var i = e.rgb_to_hsv(t.r, t.g, t.b);
            n.extend(t.__state, {
                s: i.s,
                v: i.v
            }), n.isNaN(i.h) ? n.isUndefined(t.__state.h) && (t.__state.h = 0) : t.__state.h = i.h
        }
        var l = function() {
            if (this.__state = t.apply(this, arguments), !1 === this.__state) throw "Failed to interpret color arguments";
            this.__state.a = this.__state.a || 1
        };
        return l.COMPONENTS = "r g b h s v hex a".split(" "), n.extend(l.prototype, {
            toString: function() {
                return i(this)
            },
            toOriginal: function() {
                return this.__state.conversion.write(this)
            }
        }), s(l.prototype, "r", 2), s(l.prototype, "g", 1), s(l.prototype, "b", 0), o(l.prototype, "h"), o(l.prototype, "s"), o(l.prototype, "v"), Object.defineProperty(l.prototype, "a", {
            get: function() {
                return this.__state.a
            },
            set: function(t) {
                this.__state.a = t
            }
        }), Object.defineProperty(l.prototype, "hex", {
            get: function() {
                return "HEX" !== !this.__state.space && (this.__state.hex = e.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
            },
            set: function(t) {
                this.__state.space = "HEX", this.__state.hex = t
            }
        }), l
    }(dat.color.interpret, dat.color.math = function() {
        var t;
        return {
            hsv_to_rgb: function(t, e, i) {
                var n = t / 60 - Math.floor(t / 60),
                    s = i * (1 - e),
                    o = i * (1 - n * e);
                return e = i * (1 - (1 - n) * e), t = [
                    [i, e, s],
                    [o, i, s],
                    [s, i, e],
                    [s, o, i],
                    [e, s, i],
                    [i, s, o]
                ][Math.floor(t / 60) % 6], {
                    r: 255 * t[0],
                    g: 255 * t[1],
                    b: 255 * t[2]
                }
            },
            rgb_to_hsv: function(t, e, i) {
                var n = Math.min(t, e, i),
                    s = Math.max(t, e, i),
                    n = s - n;
                return 0 == s ? {
                    h: 0 / 0,
                    s: 0,
                    v: 0
                } : (t = (t == s ? (e - i) / n : e == s ? 2 + (i - t) / n : 4 + (t - e) / n) / 6, 0 > t && (t += 1), {
                    h: 360 * t,
                    s: n / s,
                    v: s / 255
                })
            },
            rgb_to_hex: function(t, e, i) {
                return t = this.hex_with_component(0, 2, t), t = this.hex_with_component(t, 1, e), t = this.hex_with_component(t, 0, i)
            },
            component_from_hex: function(t, e) {
                return t >> 8 * e & 255
            },
            hex_with_component: function(e, i, n) {
                return n << (t = 8 * i) | e & ~(255 << t)
            }
        }
    }(), dat.color.toString, dat.utils.common), dat.color.interpret, dat.utils.common), dat.utils.requestAnimationFrame = function() {
        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
            window.setTimeout(t, 1e3 / 60)
        }
    }(), dat.dom.CenteredDiv = function(t, e) {
        var i = function() {
            this.backgroundElement = document.createElement("div"), e.extend(this.backgroundElement.style, {
                backgroundColor: "rgba(0,0,0,0.8)",
                top: 0,
                left: 0,
                display: "none",
                zIndex: "1000",
                opacity: 0,
                WebkitTransition: "opacity 0.2s linear"
            }), t.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), e.extend(this.domElement.style, {
                position: "fixed",
                display: "none",
                zIndex: "1001",
                opacity: 0,
                WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear"
            }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
            var i = this;
            t.bind(this.backgroundElement, "click", function() {
                i.hide()
            })
        };
        return i.prototype.show = function() {
            var t = this;
            this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), e.defer(function() {
                t.backgroundElement.style.opacity = 1, t.domElement.style.opacity = 1, t.domElement.style.webkitTransform = "scale(1)"
            })
        }, i.prototype.hide = function() {
            var e = this,
                i = function() {
                    e.domElement.style.display = "none", e.backgroundElement.style.display = "none", t.unbind(e.domElement, "webkitTransitionEnd", i), t.unbind(e.domElement, "transitionend", i), t.unbind(e.domElement, "oTransitionEnd", i)
                };
            t.bind(this.domElement, "webkitTransitionEnd", i), t.bind(this.domElement, "transitionend", i), t.bind(this.domElement, "oTransitionEnd", i), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
        }, i.prototype.layout = function() {
            this.domElement.style.left = window.innerWidth / 2 - t.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - t.getHeight(this.domElement) / 2 + "px"
        }, i
    }(dat.dom.dom, dat.utils.common), dat.dom.dom, dat.utils.common), ! function(t, e) {
        "use strict";
        var i, n = t.document;
        i = function() {
            var i, s, o, r, a, l, c, h, u, d, p, f, g, m = {},
                v = {},
                b = !1,
                y = {
                    ENTER: 13,
                    ESC: 27,
                    SPACE: 32
                },
                _ = [];
            return v = {
                buttons: {
                    holder: '<nav class="alertify-buttons">{{buttons}}</nav>',
                    submit: '<button type="submit" class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
                    ok: '<button class="alertify-button alertify-button-ok" id="alertify-ok">{{ok}}</button>',
                    cancel: '<button class="alertify-button alertify-button-cancel" id="alertify-cancel">{{cancel}}</button>'
                },
                input: '<div class="alertify-text-wrapper"><input type="text" class="alertify-text" id="alertify-text"></div>',
                message: '<p class="alertify-message">{{message}}</p>',
                log: '<article class="alertify-log{{class}}">{{message}}</article>'
            }, g = function() {
                var t, i, s = !1,
                    o = n.createElement("fakeelement"),
                    r = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "otransitionend",
                        transition: "transitionend"
                    };
                for (t in r)
                    if (o.style[t] !== e) {
                        i = r[t], s = !0;
                        break
                    }
                return {
                    type: i,
                    supported: s
                }
            }, i = function(t) {
                return n.getElementById(t)
            }, m = {
                labels: {
                    ok: "OK",
                    cancel: "Cancel"
                },
                delay: 5e3,
                buttonReverse: !1,
                buttonFocus: "ok",
                transition: e,
                addListeners: function(t) {
                    var e, i, l, c, h, u = "undefined" != typeof o,
                        d = "undefined" != typeof s,
                        p = "undefined" != typeof f,
                        g = "",
                        m = this;
                    e = function(e) {
                        return "undefined" != typeof e.preventDefault && e.preventDefault(), l(e), "undefined" != typeof f && (g = f.value), "function" == typeof t && ("undefined" != typeof f ? t(!0, g) : t(!0)), !1
                    }, i = function(e) {
                        return "undefined" != typeof e.preventDefault && e.preventDefault(), l(e), "function" == typeof t && t(!1), !1
                    }, l = function() {
                        m.hide(), m.unbind(n.body, "keyup", c), m.unbind(r, "focus", h), u && m.unbind(o, "click", e), d && m.unbind(s, "click", i)
                    }, c = function(t) {
                        var n = t.keyCode;
                        (n === y.SPACE && !p || p && n === y.ENTER) && e(t), n === y.ESC && d && i(t)
                    }, h = function() {
                        p ? f.focus() : !d || m.buttonReverse ? o.focus() : s.focus()
                    }, this.bind(r, "focus", h), this.bind(a, "focus", h), u && this.bind(o, "click", e), d && this.bind(s, "click", i), this.bind(n.body, "keyup", c), this.transition.supported || this.setFocus()
                },
                bind: function(t, e, i) {
                    "function" == typeof t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent && t.attachEvent("on" + e, i)
                },
                handleErrors: function() {
                    if ("undefined" != typeof t.onerror) {
                        var e = this;
                        return t.onerror = function(t, i, n) {
                            e.error("[" + t + " on line " + n + " of " + i + "]", 0)
                        }, !0
                    }
                    return !1
                },
                appendButtons: function(t, e) {
                    return this.buttonReverse ? e + t : t + e
                },
                build: function(t) {
                    var e = "",
                        i = t.type,
                        n = t.message,
                        s = t.cssClass || "";
                    switch (e += '<div class="alertify-dialog">', e += '<a id="alertify-resetFocusBack" class="alertify-resetFocus" href="#">Reset Focus</a>', "none" === m.buttonFocus && (e += '<a href="#" id="alertify-noneFocus" class="alertify-hidden"></a>'), "prompt" === i && (e += '<div id="alertify-form">'), e += '<article class="alertify-inner">', e += v.message.replace("{{message}}", n), "prompt" === i && (e += v.input), e += v.buttons.holder, e += "</article>", "prompt" === i && (e += "</div>"), e += '<a id="alertify-resetFocus" class="alertify-resetFocus" href="#">Reset Focus</a>', e += "</div>", i) {
                        case "confirm":
                            e = e.replace("{{buttons}}", this.appendButtons(v.buttons.cancel, v.buttons.ok)), e = e.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                            break;
                        case "prompt":
                            e = e.replace("{{buttons}}", this.appendButtons(v.buttons.cancel, v.buttons.submit)), e = e.replace("{{ok}}", this.labels.ok).replace("{{cancel}}", this.labels.cancel);
                            break;
                        case "alert":
                            e = e.replace("{{buttons}}", v.buttons.ok), e = e.replace("{{ok}}", this.labels.ok)
                    }
                    return u.className = "alertify alertify-" + i + " " + s, h.className = "alertify-cover", e
                },
                close: function(t, e) {
                    var i, n, s = e && !isNaN(e) ? +e : this.delay,
                        o = this;
                    this.bind(t, "click", function() {
                        i(t)
                    }), n = function(t) {
                        t.stopPropagation(), o.unbind(this, o.transition.type, n), d.removeChild(this), d.hasChildNodes() || (d.className += " alertify-logs-hidden")
                    }, i = function(t) {
                        "undefined" != typeof t && t.parentNode === d && (o.transition.supported ? (o.bind(t, o.transition.type, n), t.className += " alertify-log-hide") : (d.removeChild(t), d.hasChildNodes() || (d.className += " alertify-logs-hidden")))
                    }, 0 !== e && setTimeout(function() {
                        i(t)
                    }, s)
                },
                dialog: function(t, e, i, s, o) {
                    c = n.activeElement;
                    var r = function() {
                        d && null !== d.scrollTop && h && null !== h.scrollTop || r()
                    };
                    if ("string" != typeof t) throw new Error("message must be a string");
                    if ("string" != typeof e) throw new Error("type must be a string");
                    if ("undefined" != typeof i && "function" != typeof i) throw new Error("fn must be a function");
                    return this.init(), r(), _.push({
                        type: e,
                        message: t,
                        callback: i,
                        placeholder: s,
                        cssClass: o
                    }), b || this.setup(), this
                },
                extend: function(t) {
                    if ("string" != typeof t) throw new Error("extend method must have exactly one parameter");
                    return function(e, i) {
                        return this.log(e, t, i), this
                    }
                },
                hide: function() {
                    var t, e = this;
                    _.splice(0, 1), _.length > 0 ? this.setup(!0) : (b = !1, t = function(i) {
                        i.stopPropagation(), e.unbind(u, e.transition.type, t)
                    }, this.transition.supported ? (this.bind(u, this.transition.type, t), u.className = "alertify alertify-hide alertify-hidden") : u.className = "alertify alertify-hide alertify-hidden alertify-isHidden", h.className = "alertify-cover alertify-cover-hidden", c.focus())
                },
                init: function() {
                    n.createElement("nav"), n.createElement("article"), n.createElement("section"), null == i("alertify-cover") && (h = n.createElement("div"), h.setAttribute("id", "alertify-cover"), h.className = "alertify-cover alertify-cover-hidden", n.body.appendChild(h)), null == i("alertify") && (b = !1, _ = [], u = n.createElement("section"), u.setAttribute("id", "alertify"), u.className = "alertify alertify-hidden", n.body.appendChild(u)), null == i("alertify-logs") && (d = n.createElement("section"), d.setAttribute("id", "alertify-logs"), d.className = "alertify-logs alertify-logs-hidden", n.body.appendChild(d)), n.body.setAttribute("tabindex", "0"), this.transition = g()
                },
                log: function(t, e, i, n) {
                    var s = function() {
                        d && null !== d.scrollTop || s()
                    };
                    return this.init(), s(), d.className = "alertify-logs", this.notify(t, e, i, n), this
                },
                notify: function(t, e, i, s) {
                    var o = n.createElement("article");
                    o.className = "alertify-log" + ("string" == typeof e && "" !== e ? " alertify-log-" + e : ""), o.innerHTML = t, console.log("notify click cb", s), "function" == typeof s && this.bind(o, "click", s), d.appendChild(o), setTimeout(function() {
                        o.className = o.className + " alertify-log-show"
                    }, 50), this.close(o, i)
                },
                set: function(t) {
                    var e;
                    if ("object" != typeof t && t instanceof Array) throw new Error("args must be an object");
                    for (e in t) t.hasOwnProperty(e) && (this[e] = t[e])
                },
                setFocus: function() {
                    f ? (f.focus(), f.select()) : l.focus()
                },
                setup: function(t) {
                    var n, c = _[0],
                        h = this;
                    b = !0, n = function(t) {
                        t.stopPropagation(), h.setFocus(), h.unbind(u, h.transition.type, n)
                    }, this.transition.supported && !t && this.bind(u, this.transition.type, n), u.innerHTML = this.build(c), r = i("alertify-resetFocus"), a = i("alertify-resetFocusBack"), o = i("alertify-ok") || e, s = i("alertify-cancel") || e, l = "cancel" === m.buttonFocus ? s : "none" === m.buttonFocus ? i("alertify-noneFocus") : o, f = i("alertify-text") || e, p = i("alertify-form") || e, "string" == typeof c.placeholder && "" !== c.placeholder && (f.value = c.placeholder), t && this.setFocus(), this.addListeners(c.callback)
                },
                unbind: function(t, e, i) {
                    "function" == typeof t.removeEventListener ? t.removeEventListener(e, i, !1) : t.detachEvent && t.detachEvent("on" + e, i)
                }
            }, {
                alert: function(t, e, i) {
                    return m.dialog(t, "alert", e, "", i), this
                },
                confirm: function(t, e, i) {
                    return m.dialog(t, "confirm", e, "", i), this
                },
                extend: m.extend,
                init: m.init,
                log: function(t, e, i, n) {
                    return m.log(t, e, i, n), this
                },
                prompt: function(t, e, i, n) {
                    return m.dialog(t, "prompt", e, i, n), this
                },
                success: function(t, e, i) {
                    return m.log(t, "success", e, i), this
                },
                error: function(t, e, i) {
                    return m.log(t, "error", e, i), this
                },
                set: function(t) {
                    m.set(t)
                },
                labels: m.labels,
                debug: m.handleErrors
            }
        }, "function" == typeof define ? define([], function() {
            return new i
        }) : "undefined" == typeof t.alertify && (t.alertify = new i)
    }(this),
    function(t, e, i) {
        function n(t, e, i) {
            t.addEventListener ? t.addEventListener(e, i, !1) : t.attachEvent("on" + e, i)
        }

        function s(t) {
            if ("keypress" == t.type) {
                var e = String.fromCharCode(t.which);
                return t.shiftKey || (e = e.toLowerCase()), e
            }
            return m[t.which] ? m[t.which] : v[t.which] ? v[t.which] : String.fromCharCode(t.which).toLowerCase()
        }

        function o(t) {
            t = t || {};
            var e, i = !1;
            for (e in x) t[e] ? i = !0 : x[e] = 0;
            i || (T = !1)
        }

        function r(t, e, i, n, s, o) {
            var r, a, l = [],
                c = i.type;
            if (!_[t]) return [];
            for ("keyup" == c && h(t) && (e = [t]), r = 0; r < _[t].length; ++r)
                if (a = _[t][r], !(!n && a.seq && x[a.seq] != a.level || c != a.action || ("keypress" != c || i.metaKey || i.ctrlKey) && e.sort().join(",") !== a.modifiers.sort().join(","))) {
                    var u = n && a.seq == n && a.level == o;
                    (!n && a.combo == s || u) && _[t].splice(r, 1), l.push(a)
                }
            return l
        }

        function a(t) {
            var e = [];
            return t.shiftKey && e.push("shift"), t.altKey && e.push("alt"), t.ctrlKey && e.push("ctrl"), t.metaKey && e.push("meta"), e
        }

        function l(t, e, i, n) {
            S.stopCallback(e, e.target || e.srcElement, i, n) || !1 !== t(e, i) || (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0)
        }

        function c(t) {
            "number" != typeof t.which && (t.which = t.keyCode);
            var e = s(t);
            e && ("keyup" == t.type && k === e ? k = !1 : S.handleKey(e, a(t), t))
        }

        function h(t) {
            return "shift" == t || "ctrl" == t || "alt" == t || "meta" == t
        }

        function u(t, e, i, n) {
            function r(e) {
                return function() {
                    T = e, ++x[t], clearTimeout(g), g = setTimeout(o, 1e3)
                }
            }

            function a(e) {
                l(i, e, t), "keyup" !== n && (k = s(e)), setTimeout(o, 10)
            }
            for (var c = x[t] = 0; c < e.length; ++c) {
                var h = c + 1 === e.length ? a : r(n || d(e[c + 1]).action);
                p(e[c], h, n, t, c)
            }
        }

        function d(t, e) {
            var i, n, s, o = [];
            for (i = "+" === t ? ["+"] : t.split("+"), s = 0; s < i.length; ++s) n = i[s], y[n] && (n = y[n]), e && "keypress" != e && b[n] && (n = b[n], o.push("shift")), h(n) && o.push(n);
            if (i = n, s = e, !s) {
                if (!f) {
                    f = {};
                    for (var r in m) r > 95 && 112 > r || m.hasOwnProperty(r) && (f[m[r]] = r)
                }
                s = f[i] ? "keydown" : "keypress"
            }
            return "keypress" == s && o.length && (s = "keydown"), {
                key: n,
                modifiers: o,
                action: s
            }
        }

        function p(t, e, i, n, s) {
            w[t + ":" + i] = e, t = t.replace(/\s+/g, " ");
            var o = t.split(" ");
            1 < o.length ? u(t, o, e, i) : (i = d(t, i), _[i.key] = _[i.key] || [], r(i.key, i.modifiers, {
                type: i.action
            }, n, t, s), _[i.key][n ? "unshift" : "push"]({
                callback: e,
                modifiers: i.modifiers,
                action: i.action,
                seq: n,
                level: s,
                combo: t
            }))
        }
        var f, g, m = {
                8: "backspace",
                9: "tab",
                13: "enter",
                16: "shift",
                17: "ctrl",
                18: "alt",
                20: "capslock",
                27: "esc",
                32: "space",
                33: "pageup",
                34: "pagedown",
                35: "end",
                36: "home",
                37: "left",
                38: "up",
                39: "right",
                40: "down",
                45: "ins",
                46: "del",
                91: "meta",
                93: "meta",
                224: "meta"
            },
            v = {
                106: "*",
                107: "+",
                109: "-",
                110: ".",
                111: "/",
                186: ";",
                187: "=",
                188: ",",
                189: "-",
                190: ".",
                191: "/",
                192: "`",
                219: "[",
                220: "\\",
                221: "]",
                222: "'"
            },
            b = {
                "~": "`",
                "!": "1",
                "@": "2",
                "#": "3",
                $: "4",
                "%": "5",
                "^": "6",
                "&": "7",
                "*": "8",
                "(": "9",
                ")": "0",
                _: "-",
                "+": "=",
                ":": ";",
                '"': "'",
                "<": ",",
                ">": ".",
                "?": "/",
                "|": "\\"
            },
            y = {
                option: "alt",
                command: "meta",
                "return": "enter",
                escape: "esc",
                mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
            },
            _ = {},
            w = {},
            x = {},
            k = !1,
            C = !1,
            T = !1;
        for (i = 1; 20 > i; ++i) m[111 + i] = "f" + i;
        for (i = 0; 9 >= i; ++i) m[i + 96] = i;
        n(e, "keypress", c), n(e, "keydown", c), n(e, "keyup", c);
        var S = {
            bind: function(t, e, i) {
                t = t instanceof Array ? t : [t];
                for (var n = 0; n < t.length; ++n) p(t[n], e, i);
                return this
            },
            unbind: function(t, e) {
                return S.bind(t, function() {}, e)
            },
            trigger: function(t, e) {
                return w[t + ":" + e] && w[t + ":" + e]({}, t), this
            },
            reset: function() {
                return _ = {}, w = {}, this
            },
            stopCallback: function(t, e) {
                return -1 < (" " + e.className + " ").indexOf(" mousetrap ") ? !1 : "INPUT" == e.tagName || "SELECT" == e.tagName || "TEXTAREA" == e.tagName || e.isContentEditable
            },
            handleKey: function(t, e, i) {
                var n, s = r(t, e, i);
                e = {};
                var a = 0,
                    c = !1;
                for (n = 0; n < s.length; ++n) s[n].seq && (a = Math.max(a, s[n].level));
                for (n = 0; n < s.length; ++n) s[n].seq ? s[n].level == a && (c = !0, e[s[n].seq] = 1, l(s[n].callback, i, s[n].combo, s[n].seq)) : c || l(s[n].callback, i, s[n].combo);
                s = "keypress" == i.type && C, i.type != T || h(t) || s || o(e), C = c && "keydown" == i.type
            }
        };
        t.Mousetrap = S, "function" == typeof define && define.amd && define(S)
    }(window, document),
    function(t, e) {
        function i(t) {
            var e = fe[t] = {};
            return J.each(t.split(ee), function(t, i) {
                e[i] = !0
            }), e
        }

        function n(t, i, n) {
            if (n === e && 1 === t.nodeType) {
                var s = "data-" + i.replace(me, "-$1").toLowerCase();
                if (n = t.getAttribute(s), "string" == typeof n) {
                    try {
                        n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : ge.test(n) ? J.parseJSON(n) : n
                    } catch (o) {}
                    J.data(t, i, n)
                } else n = e
            }
            return n
        }

        function s(t) {
            var e;
            for (e in t)
                if (("data" !== e || !J.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
            return !0
        }

        function o() {
            return !1
        }

        function r() {
            return !0
        }

        function a(t) {
            return !t || !t.parentNode || 11 === t.parentNode.nodeType
        }

        function l(t, e) {
            do t = t[e]; while (t && 1 !== t.nodeType);
            return t
        }

        function c(t, e, i) {
            if (e = e || 0, J.isFunction(e)) return J.grep(t, function(t, n) {
                var s = !!e.call(t, n, t);
                return s === i
            });
            if (e.nodeType) return J.grep(t, function(t) {
                return t === e === i
            });
            if ("string" == typeof e) {
                var n = J.grep(t, function(t) {
                    return 1 === t.nodeType
                });
                if (ze.test(e)) return J.filter(e, n, !i);
                e = J.filter(e, n)
            }
            return J.grep(t, function(t) {
                return J.inArray(t, e) >= 0 === i
            })
        }

        function h(t) {
            var e = Re.split("|"),
                i = t.createDocumentFragment();
            if (i.createElement)
                for (; e.length;) i.createElement(e.pop());
            return i
        }

        function u(t, e) {
            return t.getElementsByTagName(e)[0] || t.appendChild(t.ownerDocument.createElement(e))
        }

        function d(t, e) {
            if (1 === e.nodeType && J.hasData(t)) {
                var i, n, s, o = J._data(t),
                    r = J._data(e, o),
                    a = o.events;
                if (a) {
                    delete r.handle, r.events = {};
                    for (i in a)
                        for (n = 0, s = a[i].length; s > n; n++) J.event.add(e, i, a[i][n])
                }
                r.data && (r.data = J.extend({}, r.data))
            }
        }

        function p(t, e) {
            var i;
            1 === e.nodeType && (e.clearAttributes && e.clearAttributes(), e.mergeAttributes && e.mergeAttributes(t), i = e.nodeName.toLowerCase(), "object" === i ? (e.parentNode && (e.outerHTML = t.outerHTML), J.support.html5Clone && t.innerHTML && !J.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === i && Ke.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === i ? e.selected = t.defaultSelected : "input" === i || "textarea" === i ? e.defaultValue = t.defaultValue : "script" === i && e.text !== t.text && (e.text = t.text), e.removeAttribute(J.expando))
        }

        function f(t) {
            return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName("*") : "undefined" != typeof t.querySelectorAll ? t.querySelectorAll("*") : []
        }

        function g(t) {
            Ke.test(t.type) && (t.defaultChecked = t.checked)
        }

        function m(t, e) {
            if (e in t) return e;
            for (var i = e.charAt(0).toUpperCase() + e.slice(1), n = e, s = vi.length; s--;)
                if (e = vi[s] + i, e in t) return e;
            return n
        }

        function v(t, e) {
            return t = e || t, "none" === J.css(t, "display") || !J.contains(t.ownerDocument, t)
        }

        function b(t, e) {
            for (var i, n, s = [], o = 0, r = t.length; r > o; o++) i = t[o], i.style && (s[o] = J._data(i, "olddisplay"), e ? (!s[o] && "none" === i.style.display && (i.style.display = ""), "" === i.style.display && v(i) && (s[o] = J._data(i, "olddisplay", x(i.nodeName)))) : (n = ii(i, "display"), !s[o] && "none" !== n && J._data(i, "olddisplay", n)));
            for (o = 0; r > o; o++) i = t[o], i.style && (e && "none" !== i.style.display && "" !== i.style.display || (i.style.display = e ? s[o] || "" : "none"));
            return t
        }

        function y(t, e, i) {
            var n = hi.exec(e);
            return n ? Math.max(0, n[1] - (i || 0)) + (n[2] || "px") : e
        }

        function _(t, e, i, n) {
            for (var s = i === (n ? "border" : "content") ? 4 : "width" === e ? 1 : 0, o = 0; 4 > s; s += 2) "margin" === i && (o += J.css(t, i + mi[s], !0)), n ? ("content" === i && (o -= parseFloat(ii(t, "padding" + mi[s])) || 0), "margin" !== i && (o -= parseFloat(ii(t, "border" + mi[s] + "Width")) || 0)) : (o += parseFloat(ii(t, "padding" + mi[s])) || 0, "padding" !== i && (o += parseFloat(ii(t, "border" + mi[s] + "Width")) || 0));
            return o
        }

        function w(t, e, i) {
            var n = "width" === e ? t.offsetWidth : t.offsetHeight,
                s = !0,
                o = J.support.boxSizing && "border-box" === J.css(t, "boxSizing");
            if (0 >= n || null == n) {
                if (n = ii(t, e), (0 > n || null == n) && (n = t.style[e]), ui.test(n)) return n;
                s = o && (J.support.boxSizingReliable || n === t.style[e]), n = parseFloat(n) || 0
            }
            return n + _(t, e, i || (o ? "border" : "content"), s) + "px"
        }

        function x(t) {
            if (pi[t]) return pi[t];
            var e = J("<" + t + ">").appendTo(W.body),
                i = e.css("display");
            return e.remove(), ("none" === i || "" === i) && (ni = W.body.appendChild(ni || J.extend(W.createElement("iframe"), {
                frameBorder: 0,
                width: 0,
                height: 0
            })), si && ni.createElement || (si = (ni.contentWindow || ni.contentDocument).document, si.write("<!doctype html><html><body>"), si.close()), e = si.body.appendChild(si.createElement(t)), i = ii(e, "display"), W.body.removeChild(ni)), pi[t] = i, i
        }

        function k(t, e, i, n) {
            var s;
            if (J.isArray(e)) J.each(e, function(e, s) {
                i || _i.test(t) ? n(t, s) : k(t + "[" + ("object" == typeof s ? e : "") + "]", s, i, n)
            });
            else if (i || "object" !== J.type(e)) n(t, e);
            else
                for (s in e) k(t + "[" + s + "]", e[s], i, n)
        }

        function C(t) {
            return function(e, i) {
                "string" != typeof e && (i = e, e = "*");
                var n, s, o, r = e.toLowerCase().split(ee),
                    a = 0,
                    l = r.length;
                if (J.isFunction(i))
                    for (; l > a; a++) n = r[a], o = /^\+/.test(n), o && (n = n.substr(1) || "*"), s = t[n] = t[n] || [], s[o ? "unshift" : "push"](i)
            }
        }

        function T(t, i, n, s, o, r) {
            o = o || i.dataTypes[0], r = r || {}, r[o] = !0;
            for (var a, l = t[o], c = 0, h = l ? l.length : 0, u = t === zi; h > c && (u || !a); c++) a = l[c](i, n, s), "string" == typeof a && (!u || r[a] ? a = e : (i.dataTypes.unshift(a), a = T(t, i, n, s, a, r)));
            return (u || !a) && !r["*"] && (a = T(t, i, n, s, "*", r)), a
        }

        function S(t, i) {
            var n, s, o = J.ajaxSettings.flatOptions || {};
            for (n in i) i[n] !== e && ((o[n] ? t : s || (s = {}))[n] = i[n]);
            s && J.extend(!0, t, s)
        }

        function D(t, i, n) {
            var s, o, r, a, l = t.contents,
                c = t.dataTypes,
                h = t.responseFields;
            for (o in h) o in n && (i[h[o]] = n[o]);
            for (;
                "*" === c[0];) c.shift(), s === e && (s = t.mimeType || i.getResponseHeader("content-type"));
            if (s)
                for (o in l)
                    if (l[o] && l[o].test(s)) {
                        c.unshift(o);
                        break
                    }
            if (c[0] in n) r = c[0];
            else {
                for (o in n) {
                    if (!c[0] || t.converters[o + " " + c[0]]) {
                        r = o;
                        break
                    }
                    a || (a = o)
                }
                r = r || a
            }
            return r ? (r !== c[0] && c.unshift(r), n[r]) : void 0
        }

        function E(t, e) {
            var i, n, s, o, r = t.dataTypes.slice(),
                a = r[0],
                l = {},
                c = 0;
            if (t.dataFilter && (e = t.dataFilter(e, t.dataType)), r[1])
                for (i in t.converters) l[i.toLowerCase()] = t.converters[i];
            for (; s = r[++c];)
                if ("*" !== s) {
                    if ("*" !== a && a !== s) {
                        if (i = l[a + " " + s] || l["* " + s], !i)
                            for (n in l)
                                if (o = n.split(" "), o[1] === s && (i = l[a + " " + o[0]] || l["* " + o[0]])) {
                                    i === !0 ? i = l[n] : l[n] !== !0 && (s = o[0], r.splice(c--, 0, s));
                                    break
                                }
                        if (i !== !0)
                            if (i && t["throws"]) e = i(e);
                            else try {
                                e = i(e)
                            } catch (h) {
                                return {
                                    state: "parsererror",
                                    error: i ? h : "No conversion from " + a + " to " + s
                                }
                            }
                    }
                    a = s
                }
            return {
                state: "success",
                data: e
            }
        }

        function A() {
            try {
                return new t.XMLHttpRequest
            } catch (e) {}
        }

        function M() {
            try {
                return new t.ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
        }

        function N() {
            return setTimeout(function() {
                Vi = e
            }, 0), Vi = J.now()
        }

        function P(t, e) {
            J.each(e, function(e, i) {
                for (var n = (Zi[e] || []).concat(Zi["*"]), s = 0, o = n.length; o > s; s++)
                    if (n[s].call(t, e, i)) return
            })
        }

        function I(t, e, i) {
            var n, s = 0,
                o = Ji.length,
                r = J.Deferred().always(function() {
                    delete a.elem
                }),
                a = function() {
                    for (var e = Vi || N(), i = Math.max(0, l.startTime + l.duration - e), n = i / l.duration || 0, s = 1 - n, o = 0, a = l.tweens.length; a > o; o++) l.tweens[o].run(s);
                    return r.notifyWith(t, [l, s, i]), 1 > s && a ? i : (r.resolveWith(t, [l]), !1)
                },
                l = r.promise({
                    elem: t,
                    props: J.extend({}, e),
                    opts: J.extend(!0, {
                        specialEasing: {}
                    }, i),
                    originalProperties: e,
                    originalOptions: i,
                    startTime: Vi || N(),
                    duration: i.duration,
                    tweens: [],
                    createTween: function(e, i) {
                        var n = J.Tween(t, l.opts, e, i, l.opts.specialEasing[e] || l.opts.easing);
                        return l.tweens.push(n), n
                    },
                    stop: function(e) {
                        for (var i = 0, n = e ? l.tweens.length : 0; n > i; i++) l.tweens[i].run(1);
                        return e ? r.resolveWith(t, [l, e]) : r.rejectWith(t, [l, e]), this
                    }
                }),
                c = l.props;
            for (H(c, l.opts.specialEasing); o > s; s++)
                if (n = Ji[s].call(l, t, c, l.opts)) return n;
            return P(l, c), J.isFunction(l.opts.start) && l.opts.start.call(t, l), J.fx.timer(J.extend(a, {
                anim: l,
                queue: l.opts.queue,
                elem: t
            })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
        }

        function H(t, e) {
            var i, n, s, o, r;
            for (i in t)
                if (n = J.camelCase(i), s = e[n], o = t[i], J.isArray(o) && (s = o[1], o = t[i] = o[0]), i !== n && (t[n] = o, delete t[i]), r = J.cssHooks[n], r && "expand" in r) {
                    o = r.expand(o), delete t[n];
                    for (i in o) i in t || (t[i] = o[i], e[i] = s)
                } else e[n] = s
        }

        function O(t, e, i) {
            var n, s, o, r, a, l, c, h, u, d = this,
                p = t.style,
                f = {},
                g = [],
                m = t.nodeType && v(t);
            i.queue || (h = J._queueHooks(t, "fx"), null == h.unqueued && (h.unqueued = 0, u = h.empty.fire, h.empty.fire = function() {
                h.unqueued || u()
            }), h.unqueued++, d.always(function() {
                d.always(function() {
                    h.unqueued--, J.queue(t, "fx").length || h.empty.fire()
                })
            })), 1 === t.nodeType && ("height" in e || "width" in e) && (i.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === J.css(t, "display") && "none" === J.css(t, "float") && (J.support.inlineBlockNeedsLayout && "inline" !== x(t.nodeName) ? p.zoom = 1 : p.display = "inline-block")), i.overflow && (p.overflow = "hidden", J.support.shrinkWrapBlocks || d.done(function() {
                p.overflow = i.overflow[0], p.overflowX = i.overflow[1], p.overflowY = i.overflow[2]
            }));
            for (n in e)
                if (o = e[n], Ki.exec(o)) {
                    if (delete e[n], l = l || "toggle" === o, o === (m ? "hide" : "show")) continue;
                    g.push(n)
                }
            if (r = g.length) {
                a = J._data(t, "fxshow") || J._data(t, "fxshow", {}), "hidden" in a && (m = a.hidden), l && (a.hidden = !m), m ? J(t).show() : d.done(function() {
                    J(t).hide()
                }), d.done(function() {
                    var e;
                    J.removeData(t, "fxshow", !0);
                    for (e in f) J.style(t, e, f[e])
                });
                for (n = 0; r > n; n++) s = g[n], c = d.createTween(s, m ? a[s] : 0), f[s] = a[s] || J.style(t, s), s in a || (a[s] = c.start, m && (c.end = c.start, c.start = "width" === s || "height" === s ? 1 : 0))
            }
        }

        function z(t, e, i, n, s) {
            return new z.prototype.init(t, e, i, n, s)
        }

        function L(t, e) {
            var i, n = {
                    height: t
                },
                s = 0;
            for (e = e ? 1 : 0; 4 > s; s += 2 - e) i = mi[s], n["margin" + i] = n["padding" + i] = t;
            return e && (n.opacity = n.width = t), n
        }

        function F(t) {
            return J.isWindow(t) ? t : 9 === t.nodeType ? t.defaultView || t.parentWindow : !1
        }
        var R, j, W = t.document,
            B = t.location,
            $ = t.navigator,
            q = t.jQuery,
            Y = t.$,
            U = Array.prototype.push,
            V = Array.prototype.slice,
            G = Array.prototype.indexOf,
            K = Object.prototype.toString,
            X = Object.prototype.hasOwnProperty,
            Q = String.prototype.trim,
            J = function(t, e) {
                return new J.fn.init(t, e, R)
            },
            Z = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,
            te = /\S/,
            ee = /\s+/,
            ie = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            ne = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
            se = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            oe = /^[\],:{}\s]*$/,
            re = /(?:^|:|,)(?:\s*\[)+/g,
            ae = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            le = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,
            ce = /^-ms-/,
            he = /-([\da-z])/gi,
            ue = function(t, e) {
                return (e + "").toUpperCase()
            },
            de = function() {
                W.addEventListener ? (W.removeEventListener("DOMContentLoaded", de, !1), J.ready()) : "complete" === W.readyState && (W.detachEvent("onreadystatechange", de), J.ready())
            },
            pe = {};
        J.fn = J.prototype = {
            constructor: J,
            init: function(t, i, n) {
                var s, o, r;
                if (!t) return this;
                if (t.nodeType) return this.context = this[0] = t, this.length = 1, this;
                if ("string" == typeof t) {
                    if (s = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : ne.exec(t), s && (s[1] || !i)) {
                        if (s[1]) return i = i instanceof J ? i[0] : i, r = i && i.nodeType ? i.ownerDocument || i : W, t = J.parseHTML(s[1], r, !0), se.test(s[1]) && J.isPlainObject(i) && this.attr.call(t, i, !0), J.merge(this, t);
                        if (o = W.getElementById(s[2]), o && o.parentNode) {
                            if (o.id !== s[2]) return n.find(t);
                            this.length = 1, this[0] = o
                        }
                        return this.context = W, this.selector = t, this
                    }
                    return !i || i.jquery ? (i || n).find(t) : this.constructor(i).find(t)
                }
                return J.isFunction(t) ? n.ready(t) : (t.selector !== e && (this.selector = t.selector, this.context = t.context), J.makeArray(t, this))
            },
            selector: "",
            jquery: "1.8.3",
            length: 0,
            size: function() {
                return this.length
            },
            toArray: function() {
                return V.call(this)
            },
            get: function(t) {
                return null == t ? this.toArray() : 0 > t ? this[this.length + t] : this[t]
            },
            pushStack: function(t, e, i) {
                var n = J.merge(this.constructor(), t);
                return n.prevObject = this, n.context = this.context, "find" === e ? n.selector = this.selector + (this.selector ? " " : "") + i : e && (n.selector = this.selector + "." + e + "(" + i + ")"), n
            },
            each: function(t, e) {
                return J.each(this, t, e)
            },
            ready: function(t) {
                return J.ready.promise().done(t), this
            },
            eq: function(t) {
                return t = +t, -1 === t ? this.slice(t) : this.slice(t, t + 1)
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            slice: function() {
                return this.pushStack(V.apply(this, arguments), "slice", V.call(arguments).join(","))
            },
            map: function(t) {
                return this.pushStack(J.map(this, function(e, i) {
                    return t.call(e, i, e)
                }))
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: U,
            sort: [].sort,
            splice: [].splice
        }, J.fn.init.prototype = J.fn, J.extend = J.fn.extend = function() {
            var t, i, n, s, o, r, a = arguments[0] || {},
                l = 1,
                c = arguments.length,
                h = !1;
            for ("boolean" == typeof a && (h = a, a = arguments[1] || {}, l = 2), "object" != typeof a && !J.isFunction(a) && (a = {}), c === l && (a = this, --l); c > l; l++)
                if (null != (t = arguments[l]))
                    for (i in t) n = a[i], s = t[i], a !== s && (h && s && (J.isPlainObject(s) || (o = J.isArray(s))) ? (o ? (o = !1, r = n && J.isArray(n) ? n : []) : r = n && J.isPlainObject(n) ? n : {}, a[i] = J.extend(h, r, s)) : s !== e && (a[i] = s));
            return a
        }, J.extend({
            noConflict: function(e) {
                return t.$ === J && (t.$ = Y), e && t.jQuery === J && (t.jQuery = q), J
            },
            isReady: !1,
            readyWait: 1,
            holdReady: function(t) {
                t ? J.readyWait++ : J.ready(!0)
            },
            ready: function(t) {
                if (t === !0 ? !--J.readyWait : !J.isReady) {
                    if (!W.body) return setTimeout(J.ready, 1);
                    J.isReady = !0, t !== !0 && --J.readyWait > 0 || (j.resolveWith(W, [J]), J.fn.trigger && J(W).trigger("ready").off("ready"))
                }
            },
            isFunction: function(t) {
                return "function" === J.type(t)
            },
            isArray: Array.isArray || function(t) {
                return "array" === J.type(t)
            },
            isWindow: function(t) {
                return null != t && t == t.window
            },
            isNumeric: function(t) {
                return !isNaN(parseFloat(t)) && isFinite(t)
            },
            type: function(t) {
                return null == t ? String(t) : pe[K.call(t)] || "object"
            },
            isPlainObject: function(t) {
                if (!t || "object" !== J.type(t) || t.nodeType || J.isWindow(t)) return !1;
                try {
                    if (t.constructor && !X.call(t, "constructor") && !X.call(t.constructor.prototype, "isPrototypeOf")) return !1
                } catch (i) {
                    return !1
                }
                var n;
                for (n in t);
                return n === e || X.call(t, n)
            },
            isEmptyObject: function(t) {
                var e;
                for (e in t) return !1;
                return !0
            },
            error: function(t) {
                throw new Error(t)
            },
            parseHTML: function(t, e, i) {
                var n;
                return t && "string" == typeof t ? ("boolean" == typeof e && (i = e, e = 0), e = e || W, (n = se.exec(t)) ? [e.createElement(n[1])] : (n = J.buildFragment([t], e, i ? null : []), J.merge([], (n.cacheable ? J.clone(n.fragment) : n.fragment).childNodes))) : null
            },
            parseJSON: function(e) {
                return e && "string" == typeof e ? (e = J.trim(e), t.JSON && t.JSON.parse ? t.JSON.parse(e) : oe.test(e.replace(ae, "@").replace(le, "]").replace(re, "")) ? new Function("return " + e)() : void J.error("Invalid JSON: " + e)) : null
            },
            parseXML: function(i) {
                var n, s;
                if (!i || "string" != typeof i) return null;
                try {
                    t.DOMParser ? (s = new DOMParser, n = s.parseFromString(i, "text/xml")) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(i))
                } catch (o) {
                    n = e
                }
                return (!n || !n.documentElement || n.getElementsByTagName("parsererror").length) && J.error("Invalid XML: " + i), n
            },
            noop: function() {},
            globalEval: function(e) {
                e && te.test(e) && (t.execScript || function(e) {
                    t.eval.call(t, e)
                })(e)
            },
            camelCase: function(t) {
                return t.replace(ce, "ms-").replace(he, ue)
            },
            nodeName: function(t, e) {
                return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
            },
            each: function(t, i, n) {
                var s, o = 0,
                    r = t.length,
                    a = r === e || J.isFunction(t);
                if (n)
                    if (a) {
                        for (s in t)
                            if (i.apply(t[s], n) === !1) break
                    } else
                        for (; r > o && i.apply(t[o++], n) !== !1;);
                else if (a) {
                    for (s in t)
                        if (i.call(t[s], s, t[s]) === !1) break
                } else
                    for (; r > o && i.call(t[o], o, t[o++]) !== !1;);
                return t
            },
            trim: Q && !Q.call("﻿ ") ? function(t) {
                return null == t ? "" : Q.call(t)
            } : function(t) {
                return null == t ? "" : (t + "").replace(ie, "")
            },
            makeArray: function(t, e) {
                var i, n = e || [];
                return null != t && (i = J.type(t), null == t.length || "string" === i || "function" === i || "regexp" === i || J.isWindow(t) ? U.call(n, t) : J.merge(n, t)), n
            },
            inArray: function(t, e, i) {
                var n;
                if (e) {
                    if (G) return G.call(e, t, i);
                    for (n = e.length, i = i ? 0 > i ? Math.max(0, n + i) : i : 0; n > i; i++)
                        if (i in e && e[i] === t) return i
                }
                return -1
            },
            merge: function(t, i) {
                var n = i.length,
                    s = t.length,
                    o = 0;
                if ("number" == typeof n)
                    for (; n > o; o++) t[s++] = i[o];
                else
                    for (; i[o] !== e;) t[s++] = i[o++];
                return t.length = s, t
            },
            grep: function(t, e, i) {
                var n, s = [],
                    o = 0,
                    r = t.length;
                for (i = !!i; r > o; o++) n = !!e(t[o], o), i !== n && s.push(t[o]);
                return s
            },
            map: function(t, i, n) {
                var s, o, r = [],
                    a = 0,
                    l = t.length,
                    c = t instanceof J || l !== e && "number" == typeof l && (l > 0 && t[0] && t[l - 1] || 0 === l || J.isArray(t));
                if (c)
                    for (; l > a; a++) s = i(t[a], a, n), null != s && (r[r.length] = s);
                else
                    for (o in t) s = i(t[o], o, n), null != s && (r[r.length] = s);
                return r.concat.apply([], r)
            },
            guid: 1,
            proxy: function(t, i) {
                var n, s, o;
                return "string" == typeof i && (n = t[i], i = t, t = n), J.isFunction(t) ? (s = V.call(arguments, 2), o = function() {
                    return t.apply(i, s.concat(V.call(arguments)))
                }, o.guid = t.guid = t.guid || J.guid++, o) : e
            },
            access: function(t, i, n, s, o, r, a) {
                var l, c = null == n,
                    h = 0,
                    u = t.length;
                if (n && "object" == typeof n) {
                    for (h in n) J.access(t, i, h, n[h], 1, r, s);
                    o = 1
                } else if (s !== e) {
                    if (l = a === e && J.isFunction(s), c && (l ? (l = i, i = function(t, e, i) {
                            return l.call(J(t), i)
                        }) : (i.call(t, s), i = null)), i)
                        for (; u > h; h++) i(t[h], n, l ? s.call(t[h], h, i(t[h], n)) : s, a);
                    o = 1
                }
                return o ? t : c ? i.call(t) : u ? i(t[0], n) : r
            },
            now: function() {
                return (new Date).getTime()
            }
        }), J.ready.promise = function(e) {
            if (!j)
                if (j = J.Deferred(), "complete" === W.readyState) setTimeout(J.ready, 1);
                else if (W.addEventListener) W.addEventListener("DOMContentLoaded", de, !1), t.addEventListener("load", J.ready, !1);
            else {
                W.attachEvent("onreadystatechange", de), t.attachEvent("onload", J.ready);
                var i = !1;
                try {
                    i = null == t.frameElement && W.documentElement
                } catch (n) {}
                i && i.doScroll && function s() {
                    if (!J.isReady) {
                        try {
                            i.doScroll("left")
                        } catch (t) {
                            return setTimeout(s, 50)
                        }
                        J.ready()
                    }
                }()
            }
            return j.promise(e)
        }, J.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(t, e) {
            pe["[object " + e + "]"] = e.toLowerCase()
        }), R = J(W);
        var fe = {};
        J.Callbacks = function(t) {
            t = "string" == typeof t ? fe[t] || i(t) : J.extend({}, t);
            var n, s, o, r, a, l, c = [],
                h = !t.once && [],
                u = function(e) {
                    for (n = t.memory && e, s = !0, l = r || 0, r = 0, a = c.length, o = !0; c && a > l; l++)
                        if (c[l].apply(e[0], e[1]) === !1 && t.stopOnFalse) {
                            n = !1;
                            break
                        }
                    o = !1, c && (h ? h.length && u(h.shift()) : n ? c = [] : d.disable())
                },
                d = {
                    add: function() {
                        if (c) {
                            var e = c.length;
                            ! function i(e) {
                                J.each(e, function(e, n) {
                                    var s = J.type(n);
                                    "function" === s ? (!t.unique || !d.has(n)) && c.push(n) : n && n.length && "string" !== s && i(n)
                                })
                            }(arguments), o ? a = c.length : n && (r = e, u(n))
                        }
                        return this
                    },
                    remove: function() {
                        return c && J.each(arguments, function(t, e) {
                            for (var i;
                                (i = J.inArray(e, c, i)) > -1;) c.splice(i, 1), o && (a >= i && a--, l >= i && l--)
                        }), this
                    },
                    has: function(t) {
                        return J.inArray(t, c) > -1
                    },
                    empty: function() {
                        return c = [], this
                    },
                    disable: function() {
                        return c = h = n = e, this
                    },
                    disabled: function() {
                        return !c
                    },
                    lock: function() {
                        return h = e, n || d.disable(), this
                    },
                    locked: function() {
                        return !h
                    },
                    fireWith: function(t, e) {
                        return e = e || [], e = [t, e.slice ? e.slice() : e], c && (!s || h) && (o ? h.push(e) : u(e)), this
                    },
                    fire: function() {
                        return d.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!s
                    }
                };
            return d
        }, J.extend({
            Deferred: function(t) {
                var e = [
                        ["resolve", "done", J.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", J.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", J.Callbacks("memory")]
                    ],
                    i = "pending",
                    n = {
                        state: function() {
                            return i
                        },
                        always: function() {
                            return s.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var t = arguments;
                            return J.Deferred(function(i) {
                                J.each(e, function(e, n) {
                                    var o = n[0],
                                        r = t[e];
                                    s[n[1]](J.isFunction(r) ? function() {
                                        var t = r.apply(this, arguments);
                                        t && J.isFunction(t.promise) ? t.promise().done(i.resolve).fail(i.reject).progress(i.notify) : i[o + "With"](this === s ? i : this, [t])
                                    } : i[o])
                                }), t = null
                            }).promise()
                        },
                        promise: function(t) {
                            return null != t ? J.extend(t, n) : n
                        }
                    },
                    s = {};
                return n.pipe = n.then, J.each(e, function(t, o) {
                    var r = o[2],
                        a = o[3];
                    n[o[1]] = r.add, a && r.add(function() {
                        i = a
                    }, e[1 ^ t][2].disable, e[2][2].lock), s[o[0]] = r.fire, s[o[0] + "With"] = r.fireWith
                }), n.promise(s), t && t.call(s, s), s
            },
            when: function(t) {
                var e, i, n, s = 0,
                    o = V.call(arguments),
                    r = o.length,
                    a = 1 !== r || t && J.isFunction(t.promise) ? r : 0,
                    l = 1 === a ? t : J.Deferred(),
                    c = function(t, i, n) {
                        return function(s) {
                            i[t] = this, n[t] = arguments.length > 1 ? V.call(arguments) : s, n === e ? l.notifyWith(i, n) : --a || l.resolveWith(i, n)
                        }
                    };
                if (r > 1)
                    for (e = new Array(r), i = new Array(r), n = new Array(r); r > s; s++) o[s] && J.isFunction(o[s].promise) ? o[s].promise().done(c(s, n, o)).fail(l.reject).progress(c(s, i, e)) : --a;
                return a || l.resolveWith(n, o), l.promise()
            }
        }), J.support = function() {
            var e, i, n, s, o, r, a, l, c, h, u, d = W.createElement("div");
            if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", i = d.getElementsByTagName("*"), n = d.getElementsByTagName("a")[0], !i || !n || !i.length) return {};
            s = W.createElement("select"), o = s.appendChild(W.createElement("option")), r = d.getElementsByTagName("input")[0], n.style.cssText = "top:1px;float:left;opacity:.5", e = {
                leadingWhitespace: 3 === d.firstChild.nodeType,
                tbody: !d.getElementsByTagName("tbody").length,
                htmlSerialize: !!d.getElementsByTagName("link").length,
                style: /top/.test(n.getAttribute("style")),
                hrefNormalized: "/a" === n.getAttribute("href"),
                opacity: /^0.5/.test(n.style.opacity),
                cssFloat: !!n.style.cssFloat,
                checkOn: "on" === r.value,
                optSelected: o.selected,
                getSetAttribute: "t" !== d.className,
                enctype: !!W.createElement("form").enctype,
                html5Clone: "<:nav></:nav>" !== W.createElement("nav").cloneNode(!0).outerHTML,
                boxModel: "CSS1Compat" === W.compatMode,
                submitBubbles: !0,
                changeBubbles: !0,
                focusinBubbles: !1,
                deleteExpando: !0,
                noCloneEvent: !0,
                inlineBlockNeedsLayout: !1,
                shrinkWrapBlocks: !1,
                reliableMarginRight: !0,
                boxSizingReliable: !0,
                pixelPosition: !1
            }, r.checked = !0, e.noCloneChecked = r.cloneNode(!0).checked, s.disabled = !0, e.optDisabled = !o.disabled;
            try {
                delete d.test
            } catch (p) {
                e.deleteExpando = !1
            }
            if (!d.addEventListener && d.attachEvent && d.fireEvent && (d.attachEvent("onclick", u = function() {
                    e.noCloneEvent = !1
                }), d.cloneNode(!0).fireEvent("onclick"), d.detachEvent("onclick", u)), r = W.createElement("input"), r.value = "t", r.setAttribute("type", "radio"), e.radioValue = "t" === r.value, r.setAttribute("checked", "checked"), r.setAttribute("name", "t"), d.appendChild(r), a = W.createDocumentFragment(), a.appendChild(d.lastChild), e.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, e.appendChecked = r.checked, a.removeChild(r), a.appendChild(d), d.attachEvent)
                for (c in {
                        submit: !0,
                        change: !0,
                        focusin: !0
                    }) l = "on" + c, h = l in d, h || (d.setAttribute(l, "return;"), h = "function" == typeof d[l]), e[c + "Bubbles"] = h;
            return J(function() {
                var i, n, s, o, r = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
                    a = W.getElementsByTagName("body")[0];
                a && (i = W.createElement("div"), i.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", a.insertBefore(i, a.firstChild), n = W.createElement("div"), i.appendChild(n), n.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", s = n.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", h = 0 === s[0].offsetHeight, s[0].style.display = "", s[1].style.display = "none", e.reliableHiddenOffsets = h && 0 === s[0].offsetHeight, n.innerHTML = "", n.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", e.boxSizing = 4 === n.offsetWidth, e.doesNotIncludeMarginInBodyOffset = 1 !== a.offsetTop, t.getComputedStyle && (e.pixelPosition = "1%" !== (t.getComputedStyle(n, null) || {}).top, e.boxSizingReliable = "4px" === (t.getComputedStyle(n, null) || {
                    width: "4px"
                }).width, o = W.createElement("div"), o.style.cssText = n.style.cssText = r, o.style.marginRight = o.style.width = "0", n.style.width = "1px", n.appendChild(o), e.reliableMarginRight = !parseFloat((t.getComputedStyle(o, null) || {}).marginRight)), "undefined" != typeof n.style.zoom && (n.innerHTML = "", n.style.cssText = r + "width:1px;padding:1px;display:inline;zoom:1", e.inlineBlockNeedsLayout = 3 === n.offsetWidth, n.style.display = "block", n.style.overflow = "visible", n.innerHTML = "<div></div>", n.firstChild.style.width = "5px", e.shrinkWrapBlocks = 3 !== n.offsetWidth, i.style.zoom = 1), a.removeChild(i), i = n = s = o = null)
            }), a.removeChild(d), i = n = s = o = r = a = d = null, e
        }();
        var ge = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
            me = /([A-Z])/g;
        J.extend({
            cache: {},
            deletedIds: [],
            uuid: 0,
            expando: "jQuery" + (J.fn.jquery + Math.random()).replace(/\D/g, ""),
            noData: {
                embed: !0,
                object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                applet: !0
            },
            hasData: function(t) {
                return t = t.nodeType ? J.cache[t[J.expando]] : t[J.expando], !!t && !s(t)
            },
            data: function(t, i, n, s) {
                if (J.acceptData(t)) {
                    var o, r, a = J.expando,
                        l = "string" == typeof i,
                        c = t.nodeType,
                        h = c ? J.cache : t,
                        u = c ? t[a] : t[a] && a;
                    if (u && h[u] && (s || h[u].data) || !l || n !== e) return u || (c ? t[a] = u = J.deletedIds.pop() || J.guid++ : u = a), h[u] || (h[u] = {}, c || (h[u].toJSON = J.noop)), ("object" == typeof i || "function" == typeof i) && (s ? h[u] = J.extend(h[u], i) : h[u].data = J.extend(h[u].data, i)), o = h[u], s || (o.data || (o.data = {}), o = o.data), n !== e && (o[J.camelCase(i)] = n), l ? (r = o[i], null == r && (r = o[J.camelCase(i)])) : r = o, r
                }
            },
            removeData: function(t, e, i) {
                if (J.acceptData(t)) {
                    var n, o, r, a = t.nodeType,
                        l = a ? J.cache : t,
                        c = a ? t[J.expando] : J.expando;
                    if (l[c]) {
                        if (e && (n = i ? l[c] : l[c].data)) {
                            J.isArray(e) || (e in n ? e = [e] : (e = J.camelCase(e), e = e in n ? [e] : e.split(" ")));
                            for (o = 0, r = e.length; r > o; o++) delete n[e[o]];
                            if (!(i ? s : J.isEmptyObject)(n)) return
                        }(i || (delete l[c].data, s(l[c]))) && (a ? J.cleanData([t], !0) : J.support.deleteExpando || l != l.window ? delete l[c] : l[c] = null)
                    }
                }
            },
            _data: function(t, e, i) {
                return J.data(t, e, i, !0)
            },
            acceptData: function(t) {
                var e = t.nodeName && J.noData[t.nodeName.toLowerCase()];
                return !e || e !== !0 && t.getAttribute("classid") === e
            }
        }), J.fn.extend({
            data: function(t, i) {
                var s, o, r, a, l, c = this[0],
                    h = 0,
                    u = null;
                if (t === e) {
                    if (this.length && (u = J.data(c), 1 === c.nodeType && !J._data(c, "parsedAttrs"))) {
                        for (r = c.attributes, l = r.length; l > h; h++) a = r[h].name, a.indexOf("data-") || (a = J.camelCase(a.substring(5)), n(c, a, u[a]));
                        J._data(c, "parsedAttrs", !0)
                    }
                    return u
                }
                return "object" == typeof t ? this.each(function() {
                    J.data(this, t)
                }) : (s = t.split(".", 2), s[1] = s[1] ? "." + s[1] : "", o = s[1] + "!", J.access(this, function(i) {
                    return i === e ? (u = this.triggerHandler("getData" + o, [s[0]]), u === e && c && (u = J.data(c, t), u = n(c, t, u)), u === e && s[1] ? this.data(s[0]) : u) : (s[1] = i, void this.each(function() {
                        var e = J(this);
                        e.triggerHandler("setData" + o, s), J.data(this, t, i), e.triggerHandler("changeData" + o, s)
                    }))
                }, null, i, arguments.length > 1, null, !1))
            },
            removeData: function(t) {
                return this.each(function() {
                    J.removeData(this, t)
                })
            }
        }), J.extend({
            queue: function(t, e, i) {
                var n;
                return t ? (e = (e || "fx") + "queue", n = J._data(t, e), i && (!n || J.isArray(i) ? n = J._data(t, e, J.makeArray(i)) : n.push(i)), n || []) : void 0
            },
            dequeue: function(t, e) {
                e = e || "fx";
                var i = J.queue(t, e),
                    n = i.length,
                    s = i.shift(),
                    o = J._queueHooks(t, e),
                    r = function() {
                        J.dequeue(t, e)
                    };
                "inprogress" === s && (s = i.shift(), n--), s && ("fx" === e && i.unshift("inprogress"), delete o.stop, s.call(t, r, o)), !n && o && o.empty.fire()
            },
            _queueHooks: function(t, e) {
                var i = e + "queueHooks";
                return J._data(t, i) || J._data(t, i, {
                    empty: J.Callbacks("once memory").add(function() {
                        J.removeData(t, e + "queue", !0), J.removeData(t, i, !0)
                    })
                })
            }
        }), J.fn.extend({
            queue: function(t, i) {
                var n = 2;
                return "string" != typeof t && (i = t, t = "fx", n--), arguments.length < n ? J.queue(this[0], t) : i === e ? this : this.each(function() {
                    var e = J.queue(this, t, i);
                    J._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && J.dequeue(this, t)
                })
            },
            dequeue: function(t) {
                return this.each(function() {
                    J.dequeue(this, t)
                })
            },
            delay: function(t, e) {
                return t = J.fx ? J.fx.speeds[t] || t : t, e = e || "fx", this.queue(e, function(e, i) {
                    var n = setTimeout(e, t);
                    i.stop = function() {
                        clearTimeout(n)
                    }
                })
            },
            clearQueue: function(t) {
                return this.queue(t || "fx", [])
            },
            promise: function(t, i) {
                var n, s = 1,
                    o = J.Deferred(),
                    r = this,
                    a = this.length,
                    l = function() {
                        --s || o.resolveWith(r, [r])
                    };
                for ("string" != typeof t && (i = t, t = e), t = t || "fx"; a--;) n = J._data(r[a], t + "queueHooks"), n && n.empty && (s++, n.empty.add(l));
                return l(), o.promise(i)
            }
        });
        var ve, be, ye, _e = /[\t\r\n]/g,
            we = /\r/g,
            xe = /^(?:button|input)$/i,
            ke = /^(?:button|input|object|select|textarea)$/i,
            Ce = /^a(?:rea|)$/i,
            Te = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
            Se = J.support.getSetAttribute;
        J.fn.extend({
            attr: function(t, e) {
                return J.access(this, J.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
                return this.each(function() {
                    J.removeAttr(this, t)
                })
            },
            prop: function(t, e) {
                return J.access(this, J.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
                return t = J.propFix[t] || t, this.each(function() {
                    try {
                        this[t] = e, delete this[t]
                    } catch (i) {}
                })
            },
            addClass: function(t) {
                var e, i, n, s, o, r, a;
                if (J.isFunction(t)) return this.each(function(e) {
                    J(this).addClass(t.call(this, e, this.className))
                });
                if (t && "string" == typeof t)
                    for (e = t.split(ee), i = 0, n = this.length; n > i; i++)
                        if (s = this[i], 1 === s.nodeType)
                            if (s.className || 1 !== e.length) {
                                for (o = " " + s.className + " ", r = 0, a = e.length; a > r; r++) o.indexOf(" " + e[r] + " ") < 0 && (o += e[r] + " ");
                                s.className = J.trim(o)
                            } else s.className = t;
                return this
            },
            removeClass: function(t) {
                var i, n, s, o, r, a, l;
                if (J.isFunction(t)) return this.each(function(e) {
                    J(this).removeClass(t.call(this, e, this.className))
                });
                if (t && "string" == typeof t || t === e)
                    for (i = (t || "").split(ee), a = 0, l = this.length; l > a; a++)
                        if (s = this[a], 1 === s.nodeType && s.className) {
                            for (n = (" " + s.className + " ").replace(_e, " "), o = 0, r = i.length; r > o; o++)
                                for (; n.indexOf(" " + i[o] + " ") >= 0;) n = n.replace(" " + i[o] + " ", " ");
                            s.className = t ? J.trim(n) : ""
                        }
                return this
            },
            toggleClass: function(t, e) {
                var i = typeof t,
                    n = "boolean" == typeof e;
                return this.each(J.isFunction(t) ? function(i) {
                    J(this).toggleClass(t.call(this, i, this.className, e), e)
                } : function() {
                    if ("string" === i)
                        for (var s, o = 0, r = J(this), a = e, l = t.split(ee); s = l[o++];) a = n ? a : !r.hasClass(s), r[a ? "addClass" : "removeClass"](s);
                    else("undefined" === i || "boolean" === i) && (this.className && J._data(this, "__className__", this.className), this.className = this.className || t === !1 ? "" : J._data(this, "__className__") || "")
                })
            },
            hasClass: function(t) {
                for (var e = " " + t + " ", i = 0, n = this.length; n > i; i++)
                    if (1 === this[i].nodeType && (" " + this[i].className + " ").replace(_e, " ").indexOf(e) >= 0) return !0;
                return !1
            },
            val: function(t) {
                var i, n, s, o = this[0]; {
                    if (arguments.length) return s = J.isFunction(t), this.each(function(n) {
                        var o, r = J(this);
                        1 === this.nodeType && (o = s ? t.call(this, n, r.val()) : t, null == o ? o = "" : "number" == typeof o ? o += "" : J.isArray(o) && (o = J.map(o, function(t) {
                            return null == t ? "" : t + ""
                        })), i = J.valHooks[this.type] || J.valHooks[this.nodeName.toLowerCase()], i && "set" in i && i.set(this, o, "value") !== e || (this.value = o))
                    });
                    if (o) return i = J.valHooks[o.type] || J.valHooks[o.nodeName.toLowerCase()], i && "get" in i && (n = i.get(o, "value")) !== e ? n : (n = o.value, "string" == typeof n ? n.replace(we, "") : null == n ? "" : n)
                }
            }
        }), J.extend({
            valHooks: {
                option: {
                    get: function(t) {
                        var e = t.attributes.value;
                        return !e || e.specified ? t.value : t.text
                    }
                },
                select: {
                    get: function(t) {
                        for (var e, i, n = t.options, s = t.selectedIndex, o = "select-one" === t.type || 0 > s, r = o ? null : [], a = o ? s + 1 : n.length, l = 0 > s ? a : o ? s : 0; a > l; l++)
                            if (i = n[l], !(!i.selected && l !== s || (J.support.optDisabled ? i.disabled : null !== i.getAttribute("disabled")) || i.parentNode.disabled && J.nodeName(i.parentNode, "optgroup"))) {
                                if (e = J(i).val(), o) return e;
                                r.push(e)
                            }
                        return r
                    },
                    set: function(t, e) {
                        var i = J.makeArray(e);
                        return J(t).find("option").each(function() {
                            this.selected = J.inArray(J(this).val(), i) >= 0
                        }), i.length || (t.selectedIndex = -1), i
                    }
                }
            },
            attrFn: {},
            attr: function(t, i, n, s) {
                var o, r, a, l = t.nodeType;
                if (t && 3 !== l && 8 !== l && 2 !== l) return s && J.isFunction(J.fn[i]) ? J(t)[i](n) : "undefined" == typeof t.getAttribute ? J.prop(t, i, n) : (a = 1 !== l || !J.isXMLDoc(t), a && (i = i.toLowerCase(), r = J.attrHooks[i] || (Te.test(i) ? be : ve)), n !== e ? null === n ? void J.removeAttr(t, i) : r && "set" in r && a && (o = r.set(t, n, i)) !== e ? o : (t.setAttribute(i, n + ""), n) : r && "get" in r && a && null !== (o = r.get(t, i)) ? o : (o = t.getAttribute(i), null === o ? e : o))
            },
            removeAttr: function(t, e) {
                var i, n, s, o, r = 0;
                if (e && 1 === t.nodeType)
                    for (n = e.split(ee); r < n.length; r++) s = n[r], s && (i = J.propFix[s] || s, o = Te.test(s), o || J.attr(t, s, ""), t.removeAttribute(Se ? s : i), o && i in t && (t[i] = !1))
            },
            attrHooks: {
                type: {
                    set: function(t, e) {
                        if (xe.test(t.nodeName) && t.parentNode) J.error("type property can't be changed");
                        else if (!J.support.radioValue && "radio" === e && J.nodeName(t, "input")) {
                            var i = t.value;
                            return t.setAttribute("type", e), i && (t.value = i), e
                        }
                    }
                },
                value: {
                    get: function(t, e) {
                        return ve && J.nodeName(t, "button") ? ve.get(t, e) : e in t ? t.value : null
                    },
                    set: function(t, e, i) {
                        return ve && J.nodeName(t, "button") ? ve.set(t, e, i) : void(t.value = e)
                    }
                }
            },
            propFix: {
                tabindex: "tabIndex",
                readonly: "readOnly",
                "for": "htmlFor",
                "class": "className",
                maxlength: "maxLength",
                cellspacing: "cellSpacing",
                cellpadding: "cellPadding",
                rowspan: "rowSpan",
                colspan: "colSpan",
                usemap: "useMap",
                frameborder: "frameBorder",
                contenteditable: "contentEditable"
            },
            prop: function(t, i, n) {
                var s, o, r, a = t.nodeType;
                if (t && 3 !== a && 8 !== a && 2 !== a) return r = 1 !== a || !J.isXMLDoc(t), r && (i = J.propFix[i] || i, o = J.propHooks[i]), n !== e ? o && "set" in o && (s = o.set(t, n, i)) !== e ? s : t[i] = n : o && "get" in o && null !== (s = o.get(t, i)) ? s : t[i]
            },
            propHooks: {
                tabIndex: {
                    get: function(t) {
                        var i = t.getAttributeNode("tabindex");
                        return i && i.specified ? parseInt(i.value, 10) : ke.test(t.nodeName) || Ce.test(t.nodeName) && t.href ? 0 : e
                    }
                }
            }
        }), be = {
            get: function(t, i) {
                var n, s = J.prop(t, i);
                return s === !0 || "boolean" != typeof s && (n = t.getAttributeNode(i)) && n.nodeValue !== !1 ? i.toLowerCase() : e
            },
            set: function(t, e, i) {
                var n;
                return e === !1 ? J.removeAttr(t, i) : (n = J.propFix[i] || i, n in t && (t[n] = !0), t.setAttribute(i, i.toLowerCase())), i
            }
        }, Se || (ye = {
            name: !0,
            id: !0,
            coords: !0
        }, ve = J.valHooks.button = {
            get: function(t, i) {
                var n;
                return n = t.getAttributeNode(i), n && (ye[i] ? "" !== n.value : n.specified) ? n.value : e
            },
            set: function(t, e, i) {
                var n = t.getAttributeNode(i);
                return n || (n = W.createAttribute(i), t.setAttributeNode(n)), n.value = e + ""
            }
        }, J.each(["width", "height"], function(t, e) {
            J.attrHooks[e] = J.extend(J.attrHooks[e], {
                set: function(t, i) {
                    return "" === i ? (t.setAttribute(e, "auto"), i) : void 0
                }
            })
        }), J.attrHooks.contenteditable = {
            get: ve.get,
            set: function(t, e, i) {
                "" === e && (e = "false"), ve.set(t, e, i)
            }
        }), J.support.hrefNormalized || J.each(["href", "src", "width", "height"], function(t, i) {
            J.attrHooks[i] = J.extend(J.attrHooks[i], {
                get: function(t) {
                    var n = t.getAttribute(i, 2);
                    return null === n ? e : n
                }
            })
        }), J.support.style || (J.attrHooks.style = {
            get: function(t) {
                return t.style.cssText.toLowerCase() || e
            },
            set: function(t, e) {
                return t.style.cssText = e + ""
            }
        }), J.support.optSelected || (J.propHooks.selected = J.extend(J.propHooks.selected, {
            get: function(t) {
                var e = t.parentNode;
                return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
            }
        })), J.support.enctype || (J.propFix.enctype = "encoding"), J.support.checkOn || J.each(["radio", "checkbox"], function() {
            J.valHooks[this] = {
                get: function(t) {
                    return null === t.getAttribute("value") ? "on" : t.value
                }
            }
        }), J.each(["radio", "checkbox"], function() {
            J.valHooks[this] = J.extend(J.valHooks[this], {
                set: function(t, e) {
                    return J.isArray(e) ? t.checked = J.inArray(J(t).val(), e) >= 0 : void 0
                }
            })
        });
        var De = /^(?:textarea|input|select)$/i,
            Ee = /^([^\.]*|)(?:\.(.+)|)$/,
            Ae = /(?:^|\s)hover(\.\S+|)\b/,
            Me = /^key/,
            Ne = /^(?:mouse|contextmenu)|click/,
            Pe = /^(?:focusinfocus|focusoutblur)$/,
            Ie = function(t) {
                return J.event.special.hover ? t : t.replace(Ae, "mouseenter$1 mouseleave$1")
            };
        J.event = {
                add: function(t, i, n, s, o) {
                    var r, a, l, c, h, u, d, p, f, g, m;
                    if (3 !== t.nodeType && 8 !== t.nodeType && i && n && (r = J._data(t))) {
                        for (n.handler && (f = n, n = f.handler, o = f.selector), n.guid || (n.guid = J.guid++), l = r.events, l || (r.events = l = {}), a = r.handle, a || (r.handle = a = function(t) {
                                return "undefined" == typeof J || t && J.event.triggered === t.type ? e : J.event.dispatch.apply(a.elem, arguments)
                            }, a.elem = t), i = J.trim(Ie(i)).split(" "), c = 0; c < i.length; c++) h = Ee.exec(i[c]) || [], u = h[1], d = (h[2] || "").split(".").sort(), m = J.event.special[u] || {}, u = (o ? m.delegateType : m.bindType) || u, m = J.event.special[u] || {}, p = J.extend({
                            type: u,
                            origType: h[1],
                            data: s,
                            handler: n,
                            guid: n.guid,
                            selector: o,
                            needsContext: o && J.expr.match.needsContext.test(o),
                            namespace: d.join(".")
                        }, f), g = l[u], g || (g = l[u] = [], g.delegateCount = 0, m.setup && m.setup.call(t, s, d, a) !== !1 || (t.addEventListener ? t.addEventListener(u, a, !1) : t.attachEvent && t.attachEvent("on" + u, a))), m.add && (m.add.call(t, p), p.handler.guid || (p.handler.guid = n.guid)), o ? g.splice(g.delegateCount++, 0, p) : g.push(p), J.event.global[u] = !0;
                        t = null
                    }
                },
                global: {},
                remove: function(t, e, i, n, s) {
                    var o, r, a, l, c, h, u, d, p, f, g, m = J.hasData(t) && J._data(t);
                    if (m && (d = m.events)) {
                        for (e = J.trim(Ie(e || "")).split(" "), o = 0; o < e.length; o++)
                            if (r = Ee.exec(e[o]) || [], a = l = r[1], c = r[2], a) {
                                for (p = J.event.special[a] || {}, a = (n ? p.delegateType : p.bindType) || a, f = d[a] || [], h = f.length, c = c ? new RegExp("(^|\\.)" + c.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null, u = 0; u < f.length; u++) g = f[u], !(!s && l !== g.origType || i && i.guid !== g.guid || c && !c.test(g.namespace) || n && n !== g.selector && ("**" !== n || !g.selector) || (f.splice(u--, 1), g.selector && f.delegateCount--, !p.remove || !p.remove.call(t, g)));
                                0 === f.length && h !== f.length && ((!p.teardown || p.teardown.call(t, c, m.handle) === !1) && J.removeEvent(t, a, m.handle), delete d[a])
                            } else
                                for (a in d) J.event.remove(t, a + e[o], i, n, !0);
                        J.isEmptyObject(d) && (delete m.handle, J.removeData(t, "events", !0))
                    }
                },
                customEvent: {
                    getData: !0,
                    setData: !0,
                    changeData: !0
                },
                trigger: function(i, n, s, o) {
                    if (!s || 3 !== s.nodeType && 8 !== s.nodeType) {
                        var r, a, l, c, h, u, d, p, f, g, m = i.type || i,
                            v = [];
                        if (Pe.test(m + J.event.triggered)) return;
                        if (m.indexOf("!") >= 0 && (m = m.slice(0, -1), a = !0), m.indexOf(".") >= 0 && (v = m.split("."), m = v.shift(), v.sort()), (!s || J.event.customEvent[m]) && !J.event.global[m]) return;
                        if (i = "object" == typeof i ? i[J.expando] ? i : new J.Event(m, i) : new J.Event(m), i.type = m, i.isTrigger = !0, i.exclusive = a, i.namespace = v.join("."), i.namespace_re = i.namespace ? new RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, u = m.indexOf(":") < 0 ? "on" + m : "", !s) {
                            r = J.cache;
                            for (l in r) r[l].events && r[l].events[m] && J.event.trigger(i, n, r[l].handle.elem, !0);
                            return
                        }
                        if (i.result = e, i.target || (i.target = s), n = null != n ? J.makeArray(n) : [], n.unshift(i), d = J.event.special[m] || {}, d.trigger && d.trigger.apply(s, n) === !1) return;
                        if (f = [
                                [s, d.bindType || m]
                            ], !o && !d.noBubble && !J.isWindow(s)) {
                            for (g = d.delegateType || m, c = Pe.test(g + m) ? s : s.parentNode, h = s; c; c = c.parentNode) f.push([c, g]), h = c;
                            h === (s.ownerDocument || W) && f.push([h.defaultView || h.parentWindow || t, g])
                        }
                        for (l = 0; l < f.length && !i.isPropagationStopped(); l++) c = f[l][0], i.type = f[l][1], p = (J._data(c, "events") || {})[i.type] && J._data(c, "handle"), p && p.apply(c, n), p = u && c[u], p && J.acceptData(c) && p.apply && p.apply(c, n) === !1 && i.preventDefault();
                        return i.type = m, !(o || i.isDefaultPrevented() || d._default && d._default.apply(s.ownerDocument, n) !== !1 || "click" === m && J.nodeName(s, "a") || !J.acceptData(s) || !u || !s[m] || ("focus" === m || "blur" === m) && 0 === i.target.offsetWidth || J.isWindow(s) || (h = s[u], h && (s[u] = null), J.event.triggered = m, s[m](), J.event.triggered = e, !h || !(s[u] = h))), i.result
                    }
                },
                dispatch: function(i) {
                    i = J.event.fix(i || t.event);
                    var n, s, o, r, a, l, c, h, u, d = (J._data(this, "events") || {})[i.type] || [],
                        p = d.delegateCount,
                        f = V.call(arguments),
                        g = !i.exclusive && !i.namespace,
                        m = J.event.special[i.type] || {},
                        v = [];
                    if (f[0] = i, i.delegateTarget = this, !m.preDispatch || m.preDispatch.call(this, i) !== !1) {
                        if (p && (!i.button || "click" !== i.type))
                            for (o = i.target; o != this; o = o.parentNode || this)
                                if (o.disabled !== !0 || "click" !== i.type) {
                                    for (a = {}, c = [], n = 0; p > n; n++) h = d[n], u = h.selector, a[u] === e && (a[u] = h.needsContext ? J(u, this).index(o) >= 0 : J.find(u, this, null, [o]).length), a[u] && c.push(h);
                                    c.length && v.push({
                                        elem: o,
                                        matches: c
                                    })
                                }
                        for (d.length > p && v.push({
                                elem: this,
                                matches: d.slice(p)
                            }), n = 0; n < v.length && !i.isPropagationStopped(); n++)
                            for (l = v[n], i.currentTarget = l.elem, s = 0; s < l.matches.length && !i.isImmediatePropagationStopped(); s++) h = l.matches[s], (g || !i.namespace && !h.namespace || i.namespace_re && i.namespace_re.test(h.namespace)) && (i.data = h.data, i.handleObj = h, r = ((J.event.special[h.origType] || {}).handle || h.handler).apply(l.elem, f), r !== e && (i.result = r, r === !1 && (i.preventDefault(), i.stopPropagation())));
                        return m.postDispatch && m.postDispatch.call(this, i), i.result
                    }
                },
                props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
                fixHooks: {},
                keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function(t, e) {
                        return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
                    }
                },
                mouseHooks: {
                    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                    filter: function(t, i) {
                        var n, s, o, r = i.button,
                            a = i.fromElement;
                        return null == t.pageX && null != i.clientX && (n = t.target.ownerDocument || W, s = n.documentElement, o = n.body, t.pageX = i.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), t.pageY = i.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)), !t.relatedTarget && a && (t.relatedTarget = a === t.target ? i.toElement : a), !t.which && r !== e && (t.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), t
                    }
                },
                fix: function(t) {
                    if (t[J.expando]) return t;
                    var e, i, n = t,
                        s = J.event.fixHooks[t.type] || {},
                        o = s.props ? this.props.concat(s.props) : this.props;
                    for (t = J.Event(n), e = o.length; e;) i = o[--e], t[i] = n[i];
                    return t.target || (t.target = n.srcElement || W), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, s.filter ? s.filter(t, n) : t
                },
                special: {
                    load: {
                        noBubble: !0
                    },
                    focus: {
                        delegateType: "focusin"
                    },
                    blur: {
                        delegateType: "focusout"
                    },
                    beforeunload: {
                        setup: function(t, e, i) {
                            J.isWindow(this) && (this.onbeforeunload = i)
                        },
                        teardown: function(t, e) {
                            this.onbeforeunload === e && (this.onbeforeunload = null)
                        }
                    }
                },
                simulate: function(t, e, i, n) {
                    var s = J.extend(new J.Event, i, {
                        type: t,
                        isSimulated: !0,
                        originalEvent: {}
                    });
                    n ? J.event.trigger(s, null, e) : J.event.dispatch.call(e, s), s.isDefaultPrevented() && i.preventDefault()
                }
            }, J.event.handle = J.event.dispatch, J.removeEvent = W.removeEventListener ? function(t, e, i) {
                t.removeEventListener && t.removeEventListener(e, i, !1)
            } : function(t, e, i) {
                var n = "on" + e;
                t.detachEvent && ("undefined" == typeof t[n] && (t[n] = null), t.detachEvent(n, i))
            }, J.Event = function(t, e) {
                return this instanceof J.Event ? (t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || t.returnValue === !1 || t.getPreventDefault && t.getPreventDefault() ? r : o) : this.type = t, e && J.extend(this, e), this.timeStamp = t && t.timeStamp || J.now(), this[J.expando] = !0, void 0) : new J.Event(t, e)
            }, J.Event.prototype = {
                preventDefault: function() {
                    this.isDefaultPrevented = r;
                    var t = this.originalEvent;
                    t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
                },
                stopPropagation: function() {
                    this.isPropagationStopped = r;
                    var t = this.originalEvent;
                    t && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
                },
                stopImmediatePropagation: function() {
                    this.isImmediatePropagationStopped = r, this.stopPropagation()
                },
                isDefaultPrevented: o,
                isPropagationStopped: o,
                isImmediatePropagationStopped: o
            }, J.each({
                mouseenter: "mouseover",
                mouseleave: "mouseout"
            }, function(t, e) {
                J.event.special[t] = {
                    delegateType: e,
                    bindType: e,
                    handle: function(t) {
                        {
                            var i, n = this,
                                s = t.relatedTarget,
                                o = t.handleObj;
                            o.selector
                        }
                        return (!s || s !== n && !J.contains(n, s)) && (t.type = o.origType, i = o.handler.apply(this, arguments), t.type = e), i
                    }
                }
            }), J.support.submitBubbles || (J.event.special.submit = {
                setup: function() {
                    return J.nodeName(this, "form") ? !1 : void J.event.add(this, "click._submit keypress._submit", function(t) {
                        var i = t.target,
                            n = J.nodeName(i, "input") || J.nodeName(i, "button") ? i.form : e;
                        n && !J._data(n, "_submit_attached") && (J.event.add(n, "submit._submit", function(t) {
                            t._submit_bubble = !0
                        }), J._data(n, "_submit_attached", !0))
                    })
                },
                postDispatch: function(t) {
                    t._submit_bubble && (delete t._submit_bubble, this.parentNode && !t.isTrigger && J.event.simulate("submit", this.parentNode, t, !0))
                },
                teardown: function() {
                    return J.nodeName(this, "form") ? !1 : void J.event.remove(this, "._submit")
                }
            }), J.support.changeBubbles || (J.event.special.change = {
                setup: function() {
                    return De.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (J.event.add(this, "propertychange._change", function(t) {
                        "checked" === t.originalEvent.propertyName && (this._just_changed = !0)
                    }), J.event.add(this, "click._change", function(t) {
                        this._just_changed && !t.isTrigger && (this._just_changed = !1), J.event.simulate("change", this, t, !0)
                    })), !1) : void J.event.add(this, "beforeactivate._change", function(t) {
                        var e = t.target;
                        De.test(e.nodeName) && !J._data(e, "_change_attached") && (J.event.add(e, "change._change", function(t) {
                            this.parentNode && !t.isSimulated && !t.isTrigger && J.event.simulate("change", this.parentNode, t, !0)
                        }), J._data(e, "_change_attached", !0))
                    })
                },
                handle: function(t) {
                    var e = t.target;
                    return this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type ? t.handleObj.handler.apply(this, arguments) : void 0
                },
                teardown: function() {
                    return J.event.remove(this, "._change"), !De.test(this.nodeName)
                }
            }), J.support.focusinBubbles || J.each({
                focus: "focusin",
                blur: "focusout"
            }, function(t, e) {
                var i = 0,
                    n = function(t) {
                        J.event.simulate(e, t.target, J.event.fix(t), !0)
                    };
                J.event.special[e] = {
                    setup: function() {
                        0 === i++ && W.addEventListener(t, n, !0)
                    },
                    teardown: function() {
                        0 === --i && W.removeEventListener(t, n, !0)
                    }
                }
            }), J.fn.extend({
                on: function(t, i, n, s, r) {
                    var a, l;
                    if ("object" == typeof t) {
                        "string" != typeof i && (n = n || i, i = e);
                        for (l in t) this.on(l, i, n, t[l], r);
                        return this
                    }
                    if (null == n && null == s ? (s = i, n = i = e) : null == s && ("string" == typeof i ? (s = n, n = e) : (s = n, n = i, i = e)), s === !1) s = o;
                    else if (!s) return this;
                    return 1 === r && (a = s, s = function(t) {
                        return J().off(t), a.apply(this, arguments)
                    }, s.guid = a.guid || (a.guid = J.guid++)), this.each(function() {
                        J.event.add(this, t, s, n, i)
                    })
                },
                one: function(t, e, i, n) {
                    return this.on(t, e, i, n, 1)
                },
                off: function(t, i, n) {
                    var s, r;
                    if (t && t.preventDefault && t.handleObj) return s = t.handleObj, J(t.delegateTarget).off(s.namespace ? s.origType + "." + s.namespace : s.origType, s.selector, s.handler), this;
                    if ("object" == typeof t) {
                        for (r in t) this.off(r, i, t[r]);
                        return this
                    }
                    return (i === !1 || "function" == typeof i) && (n = i, i = e), n === !1 && (n = o), this.each(function() {
                        J.event.remove(this, t, n, i)
                    })
                },
                bind: function(t, e, i) {
                    return this.on(t, null, e, i)
                },
                unbind: function(t, e) {
                    return this.off(t, null, e)
                },
                live: function(t, e, i) {
                    return J(this.context).on(t, this.selector, e, i), this
                },
                die: function(t, e) {
                    return J(this.context).off(t, this.selector || "**", e), this
                },
                delegate: function(t, e, i, n) {
                    return this.on(e, t, i, n)
                },
                undelegate: function(t, e, i) {
                    return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", i)
                },
                trigger: function(t, e) {
                    return this.each(function() {
                        J.event.trigger(t, e, this)
                    })
                },
                triggerHandler: function(t, e) {
                    return this[0] ? J.event.trigger(t, e, this[0], !0) : void 0
                },
                toggle: function(t) {
                    var e = arguments,
                        i = t.guid || J.guid++,
                        n = 0,
                        s = function(i) {
                            var s = (J._data(this, "lastToggle" + t.guid) || 0) % n;
                            return J._data(this, "lastToggle" + t.guid, s + 1), i.preventDefault(), e[s].apply(this, arguments) || !1
                        };
                    for (s.guid = i; n < e.length;) e[n++].guid = i;
                    return this.click(s)
                },
                hover: function(t, e) {
                    return this.mouseenter(t).mouseleave(e || t)
                }
            }), J.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
                J.fn[e] = function(t, i) {
                    return null == i && (i = t, t = null), arguments.length > 0 ? this.on(e, null, t, i) : this.trigger(e)
                }, Me.test(e) && (J.event.fixHooks[e] = J.event.keyHooks), Ne.test(e) && (J.event.fixHooks[e] = J.event.mouseHooks)
            }),
            function(t, e) {
                function i(t, e, i, n) {
                    i = i || [], e = e || N;
                    var s, o, r, a, l = e.nodeType;
                    if (!t || "string" != typeof t) return i;
                    if (1 !== l && 9 !== l) return [];
                    if (r = w(e), !r && !n && (s = ie.exec(t)))
                        if (a = s[1]) {
                            if (9 === l) {
                                if (o = e.getElementById(a), !o || !o.parentNode) return i;
                                if (o.id === a) return i.push(o), i
                            } else if (e.ownerDocument && (o = e.ownerDocument.getElementById(a)) && x(e, o) && o.id === a) return i.push(o), i
                        } else {
                            if (s[2]) return z.apply(i, L.call(e.getElementsByTagName(t), 0)), i;
                            if ((a = s[3]) && de && e.getElementsByClassName) return z.apply(i, L.call(e.getElementsByClassName(a), 0)), i
                        }
                    return g(t.replace(Q, "$1"), e, i, n, r)
                }

                function n(t) {
                    return function(e) {
                        var i = e.nodeName.toLowerCase();
                        return "input" === i && e.type === t
                    }
                }

                function s(t) {
                    return function(e) {
                        var i = e.nodeName.toLowerCase();
                        return ("input" === i || "button" === i) && e.type === t
                    }
                }

                function o(t) {
                    return R(function(e) {
                        return e = +e, R(function(i, n) {
                            for (var s, o = t([], i.length, e), r = o.length; r--;) i[s = o[r]] && (i[s] = !(n[s] = i[s]))
                        })
                    })
                }

                function r(t, e, i) {
                    if (t === e) return i;
                    for (var n = t.nextSibling; n;) {
                        if (n === e) return -1;
                        n = n.nextSibling
                    }
                    return 1
                }

                function a(t, e) {
                    var n, s, o, r, a, l, c, h = B[A][t + " "];
                    if (h) return e ? 0 : h.slice(0);
                    for (a = t, l = [], c = y.preFilter; a;) {
                        (!n || (s = Z.exec(a))) && (s && (a = a.slice(s[0].length) || a), l.push(o = [])), n = !1, (s = te.exec(a)) && (o.push(n = new M(s.shift())), a = a.slice(n.length), n.type = s[0].replace(Q, " "));
                        for (r in y.filter)(s = ae[r].exec(a)) && (!c[r] || (s = c[r](s))) && (o.push(n = new M(s.shift())), a = a.slice(n.length), n.type = r, n.matches = s);
                        if (!n) break
                    }
                    return e ? a.length : a ? i.error(t) : B(t, l).slice(0)
                }

                function l(t, e, i) {
                    var n = e.dir,
                        s = i && "parentNode" === e.dir,
                        o = H++;
                    return e.first ? function(e, i, o) {
                        for (; e = e[n];)
                            if (s || 1 === e.nodeType) return t(e, i, o)
                    } : function(e, i, r) {
                        if (r) {
                            for (; e = e[n];)
                                if ((s || 1 === e.nodeType) && t(e, i, r)) return e
                        } else
                            for (var a, l = I + " " + o + " ", c = l + v; e = e[n];)
                                if (s || 1 === e.nodeType) {
                                    if ((a = e[A]) === c) return e.sizset;
                                    if ("string" == typeof a && 0 === a.indexOf(l)) {
                                        if (e.sizset) return e
                                    } else {
                                        if (e[A] = c, t(e, i, r)) return e.sizset = !0, e;
                                        e.sizset = !1
                                    }
                                }
                    }
                }

                function c(t) {
                    return t.length > 1 ? function(e, i, n) {
                        for (var s = t.length; s--;)
                            if (!t[s](e, i, n)) return !1;
                        return !0
                    } : t[0]
                }

                function h(t, e, i, n, s) {
                    for (var o, r = [], a = 0, l = t.length, c = null != e; l > a; a++)(o = t[a]) && (!i || i(o, n, s)) && (r.push(o), c && e.push(a));
                    return r
                }

                function u(t, e, i, n, s, o) {
                    return n && !n[A] && (n = u(n)), s && !s[A] && (s = u(s, o)), R(function(o, r, a, l) {
                        var c, u, d, p = [],
                            g = [],
                            m = r.length,
                            v = o || f(e || "*", a.nodeType ? [a] : a, []),
                            b = !t || !o && e ? v : h(v, p, t, a, l),
                            y = i ? s || (o ? t : m || n) ? [] : r : b;
                        if (i && i(b, y, a, l), n)
                            for (c = h(y, g), n(c, [], a, l), u = c.length; u--;)(d = c[u]) && (y[g[u]] = !(b[g[u]] = d));
                        if (o) {
                            if (s || t) {
                                if (s) {
                                    for (c = [], u = y.length; u--;)(d = y[u]) && c.push(b[u] = d);
                                    s(null, y = [], c, l)
                                }
                                for (u = y.length; u--;)(d = y[u]) && (c = s ? F.call(o, d) : p[u]) > -1 && (o[c] = !(r[c] = d))
                            }
                        } else y = h(y === r ? y.splice(m, y.length) : y), s ? s(null, r, y, l) : z.apply(r, y)
                    })
                }

                function d(t) {
                    for (var e, i, n, s = t.length, o = y.relative[t[0].type], r = o || y.relative[" "], a = o ? 1 : 0, h = l(function(t) {
                            return t === e
                        }, r, !0), p = l(function(t) {
                            return F.call(e, t) > -1
                        }, r, !0), f = [function(t, i, n) {
                            return !o && (n || i !== S) || ((e = i).nodeType ? h(t, i, n) : p(t, i, n))
                        }]; s > a; a++)
                        if (i = y.relative[t[a].type]) f = [l(c(f), i)];
                        else {
                            if (i = y.filter[t[a].type].apply(null, t[a].matches), i[A]) {
                                for (n = ++a; s > n && !y.relative[t[n].type]; n++);
                                return u(a > 1 && c(f), a > 1 && t.slice(0, a - 1).join("").replace(Q, "$1"), i, n > a && d(t.slice(a, n)), s > n && d(t = t.slice(n)), s > n && t.join(""))
                            }
                            f.push(i)
                        }
                    return c(f)
                }

                function p(t, e) {
                    var n = e.length > 0,
                        s = t.length > 0,
                        o = function(r, a, l, c, u) {
                            var d, p, f, g = [],
                                m = 0,
                                b = "0",
                                _ = r && [],
                                w = null != u,
                                x = S,
                                k = r || s && y.find.TAG("*", u && a.parentNode || a),
                                C = I += null == x ? 1 : Math.E;
                            for (w && (S = a !== N && a, v = o.el); null != (d = k[b]); b++) {
                                if (s && d) {
                                    for (p = 0; f = t[p]; p++)
                                        if (f(d, a, l)) {
                                            c.push(d);
                                            break
                                        }
                                    w && (I = C, v = ++o.el)
                                }
                                n && ((d = !f && d) && m--, r && _.push(d))
                            }
                            if (m += b, n && b !== m) {
                                for (p = 0; f = e[p]; p++) f(_, g, a, l);
                                if (r) {
                                    if (m > 0)
                                        for (; b--;) !_[b] && !g[b] && (g[b] = O.call(c));
                                    g = h(g)
                                }
                                z.apply(c, g), w && !r && g.length > 0 && m + e.length > 1 && i.uniqueSort(c)
                            }
                            return w && (I = C, S = x), _
                        };
                    return o.el = 0, n ? R(o) : o
                }

                function f(t, e, n) {
                    for (var s = 0, o = e.length; o > s; s++) i(t, e[s], n);
                    return n
                }

                function g(t, e, i, n, s) {
                    {
                        var o, r, l, c, h, u = a(t);
                        u.length
                    }
                    if (!n && 1 === u.length) {
                        if (r = u[0] = u[0].slice(0), r.length > 2 && "ID" === (l = r[0]).type && 9 === e.nodeType && !s && y.relative[r[1].type]) {
                            if (e = y.find.ID(l.matches[0].replace(re, ""), e, s)[0], !e) return i;
                            t = t.slice(r.shift().length)
                        }
                        for (o = ae.POS.test(t) ? -1 : r.length - 1; o >= 0 && (l = r[o], !y.relative[c = l.type]); o--)
                            if ((h = y.find[c]) && (n = h(l.matches[0].replace(re, ""), ne.test(r[0].type) && e.parentNode || e, s))) {
                                if (r.splice(o, 1), t = n.length && r.join(""), !t) return z.apply(i, L.call(n, 0)), i;
                                break
                            }
                    }
                    return k(t, u)(n, e, s, i, ne.test(t)), i
                }

                function m() {}
                var v, b, y, _, w, x, k, C, T, S, D = !0,
                    E = "undefined",
                    A = ("sizcache" + Math.random()).replace(".", ""),
                    M = String,
                    N = t.document,
                    P = N.documentElement,
                    I = 0,
                    H = 0,
                    O = [].pop,
                    z = [].push,
                    L = [].slice,
                    F = [].indexOf || function(t) {
                        for (var e = 0, i = this.length; i > e; e++)
                            if (this[e] === t) return e;
                        return -1
                    },
                    R = function(t, e) {
                        return t[A] = null == e || e, t
                    },
                    j = function() {
                        var t = {},
                            e = [];
                        return R(function(i, n) {
                            return e.push(i) > y.cacheLength && delete t[e.shift()], t[i + " "] = n
                        }, t)
                    },
                    W = j(),
                    B = j(),
                    $ = j(),
                    q = "[\\x20\\t\\r\\n\\f]",
                    Y = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",
                    U = Y.replace("w", "w#"),
                    V = "([*^$|!~]?=)",
                    G = "\\[" + q + "*(" + Y + ")" + q + "*(?:" + V + q + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + U + ")|)|)" + q + "*\\]",
                    K = ":(" + Y + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + G + ")|[^:]|\\\\.)*|.*))\\)|)",
                    X = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + q + "*((?:-\\d)?\\d*)" + q + "*\\)|)(?=[^-]|$)",
                    Q = new RegExp("^" + q + "+|((?:^|[^\\\\])(?:\\\\.)*)" + q + "+$", "g"),
                    Z = new RegExp("^" + q + "*," + q + "*"),
                    te = new RegExp("^" + q + "*([\\x20\\t\\r\\n\\f>+~])" + q + "*"),
                    ee = new RegExp(K),
                    ie = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,
                    ne = /[\x20\t\r\n\f]*[+~]/,
                    se = /h\d/i,
                    oe = /input|select|textarea|button/i,
                    re = /\\(?!\\)/g,
                    ae = {
                        ID: new RegExp("^#(" + Y + ")"),
                        CLASS: new RegExp("^\\.(" + Y + ")"),
                        NAME: new RegExp("^\\[name=['\"]?(" + Y + ")['\"]?\\]"),
                        TAG: new RegExp("^(" + Y.replace("w", "w*") + ")"),
                        ATTR: new RegExp("^" + G),
                        PSEUDO: new RegExp("^" + K),
                        POS: new RegExp(X, "i"),
                        CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + q + "*(even|odd|(([+-]|)(\\d*)n|)" + q + "*(?:([+-]|)" + q + "*(\\d+)|))" + q + "*\\)|)", "i"),
                        needsContext: new RegExp("^" + q + "*[>+~]|" + X, "i")
                    },
                    le = function(t) {
                        var e = N.createElement("div");
                        try {
                            return t(e)
                        } catch (i) {
                            return !1
                        } finally {
                            e = null
                        }
                    },
                    ce = le(function(t) {
                        return t.appendChild(N.createComment("")), !t.getElementsByTagName("*").length
                    }),
                    he = le(function(t) {
                        return t.innerHTML = "<a href='#'></a>", t.firstChild && typeof t.firstChild.getAttribute !== E && "#" === t.firstChild.getAttribute("href")
                    }),
                    ue = le(function(t) {
                        t.innerHTML = "<select></select>";
                        var e = typeof t.lastChild.getAttribute("multiple");
                        return "boolean" !== e && "string" !== e
                    }),
                    de = le(function(t) {
                        return t.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", t.getElementsByClassName && t.getElementsByClassName("e").length ? (t.lastChild.className = "e", 2 === t.getElementsByClassName("e").length) : !1
                    }),
                    pe = le(function(t) {
                        t.id = A + 0, t.innerHTML = "<a name='" + A + "'></a><div name='" + A + "'></div>", P.insertBefore(t, P.firstChild);
                        var e = N.getElementsByName && N.getElementsByName(A).length === 2 + N.getElementsByName(A + 0).length;
                        return b = !N.getElementById(A), P.removeChild(t), e
                    });
                try {
                    L.call(P.childNodes, 0)[0].nodeType
                } catch (fe) {
                    L = function(t) {
                        for (var e, i = []; e = this[t]; t++) i.push(e);
                        return i
                    }
                }
                i.matches = function(t, e) {
                    return i(t, null, null, e)
                }, i.matchesSelector = function(t, e) {
                    return i(e, null, null, [t]).length > 0
                }, _ = i.getText = function(t) {
                    var e, i = "",
                        n = 0,
                        s = t.nodeType;
                    if (s) {
                        if (1 === s || 9 === s || 11 === s) {
                            if ("string" == typeof t.textContent) return t.textContent;
                            for (t = t.firstChild; t; t = t.nextSibling) i += _(t)
                        } else if (3 === s || 4 === s) return t.nodeValue
                    } else
                        for (; e = t[n]; n++) i += _(e);
                    return i
                }, w = i.isXML = function(t) {
                    var e = t && (t.ownerDocument || t).documentElement;
                    return e ? "HTML" !== e.nodeName : !1
                }, x = i.contains = P.contains ? function(t, e) {
                    var i = 9 === t.nodeType ? t.documentElement : t,
                        n = e && e.parentNode;
                    return t === n || !!(n && 1 === n.nodeType && i.contains && i.contains(n))
                } : P.compareDocumentPosition ? function(t, e) {
                    return e && !!(16 & t.compareDocumentPosition(e))
                } : function(t, e) {
                    for (; e = e.parentNode;)
                        if (e === t) return !0;
                    return !1
                }, i.attr = function(t, e) {
                    var i, n = w(t);
                    return n || (e = e.toLowerCase()), (i = y.attrHandle[e]) ? i(t) : n || ue ? t.getAttribute(e) : (i = t.getAttributeNode(e), i ? "boolean" == typeof t[e] ? t[e] ? e : null : i.specified ? i.value : null : null)
                }, y = i.selectors = {
                    cacheLength: 50,
                    createPseudo: R,
                    match: ae,
                    attrHandle: he ? {} : {
                        href: function(t) {
                            return t.getAttribute("href", 2)
                        },
                        type: function(t) {
                            return t.getAttribute("type")
                        }
                    },
                    find: {
                        ID: b ? function(t, e, i) {
                            if (typeof e.getElementById !== E && !i) {
                                var n = e.getElementById(t);
                                return n && n.parentNode ? [n] : []
                            }
                        } : function(t, i, n) {
                            if (typeof i.getElementById !== E && !n) {
                                var s = i.getElementById(t);
                                return s ? s.id === t || typeof s.getAttributeNode !== E && s.getAttributeNode("id").value === t ? [s] : e : []
                            }
                        },
                        TAG: ce ? function(t, e) {
                            return typeof e.getElementsByTagName !== E ? e.getElementsByTagName(t) : void 0
                        } : function(t, e) {
                            var i = e.getElementsByTagName(t);
                            if ("*" === t) {
                                for (var n, s = [], o = 0; n = i[o]; o++) 1 === n.nodeType && s.push(n);
                                return s
                            }
                            return i
                        },
                        NAME: pe && function(t, e) {
                            return typeof e.getElementsByName !== E ? e.getElementsByName(name) : void 0
                        },
                        CLASS: de && function(t, e, i) {
                            return typeof e.getElementsByClassName === E || i ? void 0 : e.getElementsByClassName(t)
                        }
                    },
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(t) {
                            return t[1] = t[1].replace(re, ""), t[3] = (t[4] || t[5] || "").replace(re, ""), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                        },
                        CHILD: function(t) {
                            return t[1] = t[1].toLowerCase(), "nth" === t[1] ? (t[2] || i.error(t[0]), t[3] = +(t[3] ? t[4] + (t[5] || 1) : 2 * ("even" === t[2] || "odd" === t[2])), t[4] = +(t[6] + t[7] || "odd" === t[2])) : t[2] && i.error(t[0]), t
                        },
                        PSEUDO: function(t) {
                            var e, i;
                            return ae.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[3] : (e = t[4]) && (ee.test(e) && (i = a(e, !0)) && (i = e.indexOf(")", e.length - i) - e.length) && (e = e.slice(0, i), t[0] = t[0].slice(0, i)), t[2] = e), t.slice(0, 3))
                        }
                    },
                    filter: {
                        ID: b ? function(t) {
                            return t = t.replace(re, ""),
                                function(e) {
                                    return e.getAttribute("id") === t
                                }
                        } : function(t) {
                            return t = t.replace(re, ""),
                                function(e) {
                                    var i = typeof e.getAttributeNode !== E && e.getAttributeNode("id");
                                    return i && i.value === t
                                }
                        },
                        TAG: function(t) {
                            return "*" === t ? function() {
                                return !0
                            } : (t = t.replace(re, "").toLowerCase(), function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            })
                        },
                        CLASS: function(t) {
                            var e = W[A][t + " "];
                            return e || (e = new RegExp("(^|" + q + ")" + t + "(" + q + "|$)")) && W(t, function(t) {
                                return e.test(t.className || typeof t.getAttribute !== E && t.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(t, e, n) {
                            return function(s) {
                                var o = i.attr(s, t);
                                return null == o ? "!=" === e : e ? (o += "", "=" === e ? o === n : "!=" === e ? o !== n : "^=" === e ? n && 0 === o.indexOf(n) : "*=" === e ? n && o.indexOf(n) > -1 : "$=" === e ? n && o.substr(o.length - n.length) === n : "~=" === e ? (" " + o + " ").indexOf(n) > -1 : "|=" === e ? o === n || o.substr(0, n.length + 1) === n + "-" : !1) : !0
                            }
                        },
                        CHILD: function(t, e, i, n) {
                            return "nth" === t ? function(t) {
                                var e, s, o = t.parentNode;
                                if (1 === i && 0 === n) return !0;
                                if (o)
                                    for (s = 0, e = o.firstChild; e && (1 !== e.nodeType || (s++, t !== e)); e = e.nextSibling);
                                return s -= n, s === i || s % i === 0 && s / i >= 0
                            } : function(e) {
                                var i = e;
                                switch (t) {
                                    case "only":
                                    case "first":
                                        for (; i = i.previousSibling;)
                                            if (1 === i.nodeType) return !1;
                                        if ("first" === t) return !0;
                                        i = e;
                                    case "last":
                                        for (; i = i.nextSibling;)
                                            if (1 === i.nodeType) return !1;
                                        return !0
                                }
                            }
                        },
                        PSEUDO: function(t, e) {
                            var n, s = y.pseudos[t] || y.setFilters[t.toLowerCase()] || i.error("unsupported pseudo: " + t);
                            return s[A] ? s(e) : s.length > 1 ? (n = [t, t, "", e], y.setFilters.hasOwnProperty(t.toLowerCase()) ? R(function(t, i) {
                                for (var n, o = s(t, e), r = o.length; r--;) n = F.call(t, o[r]), t[n] = !(i[n] = o[r])
                            }) : function(t) {
                                return s(t, 0, n)
                            }) : s
                        }
                    },
                    pseudos: {
                        not: R(function(t) {
                            var e = [],
                                i = [],
                                n = k(t.replace(Q, "$1"));
                            return n[A] ? R(function(t, e, i, s) {
                                for (var o, r = n(t, null, s, []), a = t.length; a--;)(o = r[a]) && (t[a] = !(e[a] = o))
                            }) : function(t, s, o) {
                                return e[0] = t, n(e, null, o, i), !i.pop()
                            }
                        }),
                        has: R(function(t) {
                            return function(e) {
                                return i(t, e).length > 0
                            }
                        }),
                        contains: R(function(t) {
                            return function(e) {
                                return (e.textContent || e.innerText || _(e)).indexOf(t) > -1
                            }
                        }),
                        enabled: function(t) {
                            return t.disabled === !1
                        },
                        disabled: function(t) {
                            return t.disabled === !0
                        },
                        checked: function(t) {
                            var e = t.nodeName.toLowerCase();
                            return "input" === e && !!t.checked || "option" === e && !!t.selected
                        },
                        selected: function(t) {
                            return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
                        },
                        parent: function(t) {
                            return !y.pseudos.empty(t)
                        },
                        empty: function(t) {
                            var e;
                            for (t = t.firstChild; t;) {
                                if (t.nodeName > "@" || 3 === (e = t.nodeType) || 4 === e) return !1;
                                t = t.nextSibling
                            }
                            return !0
                        },
                        header: function(t) {
                            return se.test(t.nodeName)
                        },
                        text: function(t) {
                            var e, i;
                            return "input" === t.nodeName.toLowerCase() && "text" === (e = t.type) && (null == (i = t.getAttribute("type")) || i.toLowerCase() === e)
                        },
                        radio: n("radio"),
                        checkbox: n("checkbox"),
                        file: n("file"),
                        password: n("password"),
                        image: n("image"),
                        submit: s("submit"),
                        reset: s("reset"),
                        button: function(t) {
                            var e = t.nodeName.toLowerCase();
                            return "input" === e && "button" === t.type || "button" === e
                        },
                        input: function(t) {
                            return oe.test(t.nodeName)
                        },
                        focus: function(t) {
                            var e = t.ownerDocument;
                            return t === e.activeElement && (!e.hasFocus || e.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                        },
                        active: function(t) {
                            return t === t.ownerDocument.activeElement
                        },
                        first: o(function() {
                            return [0]
                        }),
                        last: o(function(t, e) {
                            return [e - 1]
                        }),
                        eq: o(function(t, e, i) {
                            return [0 > i ? i + e : i]
                        }),
                        even: o(function(t, e) {
                            for (var i = 0; e > i; i += 2) t.push(i);
                            return t
                        }),
                        odd: o(function(t, e) {
                            for (var i = 1; e > i; i += 2) t.push(i);
                            return t
                        }),
                        lt: o(function(t, e, i) {
                            for (var n = 0 > i ? i + e : i; --n >= 0;) t.push(n);
                            return t
                        }),
                        gt: o(function(t, e, i) {
                            for (var n = 0 > i ? i + e : i; ++n < e;) t.push(n);
                            return t
                        })
                    }
                }, C = P.compareDocumentPosition ? function(t, e) {
                    return t === e ? (T = !0, 0) : (t.compareDocumentPosition && e.compareDocumentPosition ? 4 & t.compareDocumentPosition(e) : t.compareDocumentPosition) ? -1 : 1
                } : function(t, e) {
                    if (t === e) return T = !0, 0;
                    if (t.sourceIndex && e.sourceIndex) return t.sourceIndex - e.sourceIndex;
                    var i, n, s = [],
                        o = [],
                        a = t.parentNode,
                        l = e.parentNode,
                        c = a;
                    if (a === l) return r(t, e);
                    if (!a) return -1;
                    if (!l) return 1;
                    for (; c;) s.unshift(c), c = c.parentNode;
                    for (c = l; c;) o.unshift(c), c = c.parentNode;
                    i = s.length, n = o.length;
                    for (var h = 0; i > h && n > h; h++)
                        if (s[h] !== o[h]) return r(s[h], o[h]);
                    return h === i ? r(t, o[h], -1) : r(s[h], e, 1)
                }, [0, 0].sort(C), D = !T, i.uniqueSort = function(t) {
                    var e, i = [],
                        n = 1,
                        s = 0;
                    if (T = D, t.sort(C), T) {
                        for (; e = t[n]; n++) e === t[n - 1] && (s = i.push(n));
                        for (; s--;) t.splice(i[s], 1)
                    }
                    return t
                }, i.error = function(t) {
                    throw new Error("Syntax error, unrecognized expression: " + t)
                }, k = i.compile = function(t, e) {
                    var i, n = [],
                        s = [],
                        o = $[A][t + " "];
                    if (!o) {
                        for (e || (e = a(t)), i = e.length; i--;) o = d(e[i]), o[A] ? n.push(o) : s.push(o);
                        o = $(t, p(s, n))
                    }
                    return o
                }, N.querySelectorAll && function() {
                    var t, e = g,
                        n = /'|\\/g,
                        s = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
                        o = [":focus"],
                        r = [":active"],
                        l = P.matchesSelector || P.mozMatchesSelector || P.webkitMatchesSelector || P.oMatchesSelector || P.msMatchesSelector;
                    le(function(t) {
                        t.innerHTML = "<select><option selected=''></option></select>", t.querySelectorAll("[selected]").length || o.push("\\[" + q + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), t.querySelectorAll(":checked").length || o.push(":checked")
                    }), le(function(t) {
                        t.innerHTML = "<p test=''></p>", t.querySelectorAll("[test^='']").length && o.push("[*^$]=" + q + "*(?:\"\"|'')"), t.innerHTML = "<input type='hidden'/>", t.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled")
                    }), o = new RegExp(o.join("|")), g = function(t, i, s, r, l) {
                        if (!r && !l && !o.test(t)) {
                            var c, h, u = !0,
                                d = A,
                                p = i,
                                f = 9 === i.nodeType && t;
                            if (1 === i.nodeType && "object" !== i.nodeName.toLowerCase()) {
                                for (c = a(t), (u = i.getAttribute("id")) ? d = u.replace(n, "\\$&") : i.setAttribute("id", d), d = "[id='" + d + "'] ", h = c.length; h--;) c[h] = d + c[h].join("");
                                p = ne.test(t) && i.parentNode || i, f = c.join(",")
                            }
                            if (f) try {
                                return z.apply(s, L.call(p.querySelectorAll(f), 0)), s
                            } catch (g) {} finally {
                                u || i.removeAttribute("id")
                            }
                        }
                        return e(t, i, s, r, l)
                    }, l && (le(function(e) {
                        t = l.call(e, "div");
                        try {
                            l.call(e, "[test!='']:sizzle"), r.push("!=", K)
                        } catch (i) {}
                    }), r = new RegExp(r.join("|")), i.matchesSelector = function(e, n) {
                        if (n = n.replace(s, "='$1']"), !w(e) && !r.test(n) && !o.test(n)) try {
                            var a = l.call(e, n);
                            if (a || t || e.document && 11 !== e.document.nodeType) return a
                        } catch (c) {}
                        return i(n, null, null, [e]).length > 0
                    })
                }(), y.pseudos.nth = y.pseudos.eq, y.filters = m.prototype = y.pseudos, y.setFilters = new m, i.attr = J.attr, J.find = i, J.expr = i.selectors, J.expr[":"] = J.expr.pseudos, J.unique = i.uniqueSort, J.text = i.getText, J.isXMLDoc = i.isXML, J.contains = i.contains
            }(t);
        var He = /Until$/,
            Oe = /^(?:parents|prev(?:Until|All))/,
            ze = /^.[^:#\[\.,]*$/,
            Le = J.expr.match.needsContext,
            Fe = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        J.fn.extend({
            find: function(t) {
                var e, i, n, s, o, r, a = this;
                if ("string" != typeof t) return J(t).filter(function() {
                    for (e = 0, i = a.length; i > e; e++)
                        if (J.contains(a[e], this)) return !0
                });
                for (r = this.pushStack("", "find", t), e = 0, i = this.length; i > e; e++)
                    if (n = r.length, J.find(t, this[e], r), e > 0)
                        for (s = n; s < r.length; s++)
                            for (o = 0; n > o; o++)
                                if (r[o] === r[s]) {
                                    r.splice(s--, 1);
                                    break
                                }
                return r
            },
            has: function(t) {
                var e, i = J(t, this),
                    n = i.length;
                return this.filter(function() {
                    for (e = 0; n > e; e++)
                        if (J.contains(this, i[e])) return !0
                })
            },
            not: function(t) {
                return this.pushStack(c(this, t, !1), "not", t)
            },
            filter: function(t) {
                return this.pushStack(c(this, t, !0), "filter", t)
            },
            is: function(t) {
                return !!t && ("string" == typeof t ? Le.test(t) ? J(t, this.context).index(this[0]) >= 0 : J.filter(t, this).length > 0 : this.filter(t).length > 0)
            },
            closest: function(t, e) {
                for (var i, n = 0, s = this.length, o = [], r = Le.test(t) || "string" != typeof t ? J(t, e || this.context) : 0; s > n; n++)
                    for (i = this[n]; i && i.ownerDocument && i !== e && 11 !== i.nodeType;) {
                        if (r ? r.index(i) > -1 : J.find.matchesSelector(i, t)) {
                            o.push(i);
                            break
                        }
                        i = i.parentNode
                    }
                return o = o.length > 1 ? J.unique(o) : o, this.pushStack(o, "closest", t)
            },
            index: function(t) {
                return t ? "string" == typeof t ? J.inArray(this[0], J(t)) : J.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
            },
            add: function(t, e) {
                var i = "string" == typeof t ? J(t, e) : J.makeArray(t && t.nodeType ? [t] : t),
                    n = J.merge(this.get(), i);
                return this.pushStack(a(i[0]) || a(n[0]) ? n : J.unique(n))
            },
            addBack: function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }
        }), J.fn.andSelf = J.fn.addBack, J.each({
            parent: function(t) {
                var e = t.parentNode;
                return e && 11 !== e.nodeType ? e : null
            },
            parents: function(t) {
                return J.dir(t, "parentNode")
            },
            parentsUntil: function(t, e, i) {
                return J.dir(t, "parentNode", i)
            },
            next: function(t) {
                return l(t, "nextSibling")
            },
            prev: function(t) {
                return l(t, "previousSibling")
            },
            nextAll: function(t) {
                return J.dir(t, "nextSibling")
            },
            prevAll: function(t) {
                return J.dir(t, "previousSibling")
            },
            nextUntil: function(t, e, i) {
                return J.dir(t, "nextSibling", i)
            },
            prevUntil: function(t, e, i) {
                return J.dir(t, "previousSibling", i)
            },
            siblings: function(t) {
                return J.sibling((t.parentNode || {}).firstChild, t)
            },
            children: function(t) {
                return J.sibling(t.firstChild)
            },
            contents: function(t) {
                return J.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : J.merge([], t.childNodes)
            }
        }, function(t, e) {
            J.fn[t] = function(i, n) {
                var s = J.map(this, e, i);
                return He.test(t) || (n = i), n && "string" == typeof n && (s = J.filter(n, s)), s = this.length > 1 && !Fe[t] ? J.unique(s) : s, this.length > 1 && Oe.test(t) && (s = s.reverse()), this.pushStack(s, t, V.call(arguments).join(","))
            }
        }), J.extend({
            filter: function(t, e, i) {
                return i && (t = ":not(" + t + ")"), 1 === e.length ? J.find.matchesSelector(e[0], t) ? [e[0]] : [] : J.find.matches(t, e)
            },
            dir: function(t, i, n) {
                for (var s = [], o = t[i]; o && 9 !== o.nodeType && (n === e || 1 !== o.nodeType || !J(o).is(n));) 1 === o.nodeType && s.push(o), o = o[i];
                return s
            },
            sibling: function(t, e) {
                for (var i = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && i.push(t);
                return i
            }
        });
        var Re = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            je = / jQuery\d+="(?:null|\d+)"/g,
            We = /^\s+/,
            Be = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            $e = /<([\w:]+)/,
            qe = /<tbody/i,
            Ye = /<|&#?\w+;/,
            Ue = /<(?:script|style|link)/i,
            Ve = /<(?:script|object|embed|option|style)/i,
            Ge = new RegExp("<(?:" + Re + ")[\\s/>]", "i"),
            Ke = /^(?:checkbox|radio)$/,
            Xe = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Qe = /\/(java|ecma)script/i,
            Je = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
            Ze = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                area: [1, "<map>", "</map>"],
                _default: [0, "", ""]
            },
            ti = h(W),
            ei = ti.appendChild(W.createElement("div"));
        Ze.optgroup = Ze.option, Ze.tbody = Ze.tfoot = Ze.colgroup = Ze.caption = Ze.thead, Ze.th = Ze.td, J.support.htmlSerialize || (Ze._default = [1, "X<div>", "</div>"]), J.fn.extend({
                text: function(t) {
                    return J.access(this, function(t) {
                        return t === e ? J.text(this) : this.empty().append((this[0] && this[0].ownerDocument || W).createTextNode(t))
                    }, null, t, arguments.length)
                },
                wrapAll: function(t) {
                    if (J.isFunction(t)) return this.each(function(e) {
                        J(this).wrapAll(t.call(this, e))
                    });
                    if (this[0]) {
                        var e = J(t, this[0].ownerDocument).eq(0).clone(!0);
                        this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                            for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
                            return t
                        }).append(this)
                    }
                    return this
                },
                wrapInner: function(t) {
                    return this.each(J.isFunction(t) ? function(e) {
                        J(this).wrapInner(t.call(this, e))
                    } : function() {
                        var e = J(this),
                            i = e.contents();
                        i.length ? i.wrapAll(t) : e.append(t)
                    })
                },
                wrap: function(t) {
                    var e = J.isFunction(t);
                    return this.each(function(i) {
                        J(this).wrapAll(e ? t.call(this, i) : t)
                    })
                },
                unwrap: function() {
                    return this.parent().each(function() {
                        J.nodeName(this, "body") || J(this).replaceWith(this.childNodes)
                    }).end()
                },
                append: function() {
                    return this.domManip(arguments, !0, function(t) {
                        (1 === this.nodeType || 11 === this.nodeType) && this.appendChild(t)
                    })
                },
                prepend: function() {
                    return this.domManip(arguments, !0, function(t) {
                        (1 === this.nodeType || 11 === this.nodeType) && this.insertBefore(t, this.firstChild)
                    })
                },
                before: function() {
                    if (!a(this[0])) return this.domManip(arguments, !1, function(t) {
                        this.parentNode.insertBefore(t, this)
                    });
                    if (arguments.length) {
                        var t = J.clean(arguments);
                        return this.pushStack(J.merge(t, this), "before", this.selector)
                    }
                },
                after: function() {
                    if (!a(this[0])) return this.domManip(arguments, !1, function(t) {
                        this.parentNode.insertBefore(t, this.nextSibling)
                    });
                    if (arguments.length) {
                        var t = J.clean(arguments);
                        return this.pushStack(J.merge(this, t), "after", this.selector)
                    }
                },
                remove: function(t, e) {
                    for (var i, n = 0; null != (i = this[n]); n++)(!t || J.filter(t, [i]).length) && (!e && 1 === i.nodeType && (J.cleanData(i.getElementsByTagName("*")), J.cleanData([i])), i.parentNode && i.parentNode.removeChild(i));
                    return this
                },
                empty: function() {
                    for (var t, e = 0; null != (t = this[e]); e++)
                        for (1 === t.nodeType && J.cleanData(t.getElementsByTagName("*")); t.firstChild;) t.removeChild(t.firstChild);
                    return this
                },
                clone: function(t, e) {
                    return t = null == t ? !1 : t, e = null == e ? t : e, this.map(function() {
                        return J.clone(this, t, e)
                    })
                },
                html: function(t) {
                    return J.access(this, function(t) {
                        var i = this[0] || {},
                            n = 0,
                            s = this.length;
                        if (t === e) return 1 === i.nodeType ? i.innerHTML.replace(je, "") : e;
                        if (!("string" != typeof t || Ue.test(t) || !J.support.htmlSerialize && Ge.test(t) || !J.support.leadingWhitespace && We.test(t) || Ze[($e.exec(t) || ["", ""])[1].toLowerCase()])) {
                            t = t.replace(Be, "<$1></$2>");
                            try {
                                for (; s > n; n++) i = this[n] || {}, 1 === i.nodeType && (J.cleanData(i.getElementsByTagName("*")), i.innerHTML = t);
                                i = 0
                            } catch (o) {}
                        }
                        i && this.empty().append(t)
                    }, null, t, arguments.length)
                },
                replaceWith: function(t) {
                    return a(this[0]) ? this.length ? this.pushStack(J(J.isFunction(t) ? t() : t), "replaceWith", t) : this : J.isFunction(t) ? this.each(function(e) {
                        var i = J(this),
                            n = i.html();
                        i.replaceWith(t.call(this, e, n))
                    }) : ("string" != typeof t && (t = J(t).detach()), this.each(function() {
                        var e = this.nextSibling,
                            i = this.parentNode;
                        J(this).remove(), e ? J(e).before(t) : J(i).append(t)
                    }))
                },
                detach: function(t) {
                    return this.remove(t, !0)
                },
                domManip: function(t, i, n) {
                    t = [].concat.apply([], t);
                    var s, o, r, a, l = 0,
                        c = t[0],
                        h = [],
                        d = this.length;
                    if (!J.support.checkClone && d > 1 && "string" == typeof c && Xe.test(c)) return this.each(function() {
                        J(this).domManip(t, i, n)
                    });
                    if (J.isFunction(c)) return this.each(function(s) {
                        var o = J(this);
                        t[0] = c.call(this, s, i ? o.html() : e), o.domManip(t, i, n)
                    });
                    if (this[0]) {
                        if (s = J.buildFragment(t, this, h), r = s.fragment, o = r.firstChild, 1 === r.childNodes.length && (r = o), o)
                            for (i = i && J.nodeName(o, "tr"), a = s.cacheable || d - 1; d > l; l++) n.call(i && J.nodeName(this[l], "table") ? u(this[l], "tbody") : this[l], l === a ? r : J.clone(r, !0, !0));
                        r = o = null, h.length && J.each(h, function(t, e) {
                            e.src ? J.ajax ? J.ajax({
                                url: e.src,
                                type: "GET",
                                dataType: "script",
                                async: !1,
                                global: !1,
                                "throws": !0
                            }) : J.error("no ajax") : J.globalEval((e.text || e.textContent || e.innerHTML || "").replace(Je, "")), e.parentNode && e.parentNode.removeChild(e)
                        })
                    }
                    return this
                }
            }), J.buildFragment = function(t, i, n) {
                var s, o, r, a = t[0];
                return i = i || W, i = !i.nodeType && i[0] || i, i = i.ownerDocument || i, 1 === t.length && "string" == typeof a && a.length < 512 && i === W && "<" === a.charAt(0) && !Ve.test(a) && (J.support.checkClone || !Xe.test(a)) && (J.support.html5Clone || !Ge.test(a)) && (o = !0, s = J.fragments[a], r = s !== e), s || (s = i.createDocumentFragment(), J.clean(t, i, s, n), o && (J.fragments[a] = r && s)), {
                    fragment: s,
                    cacheable: o
                }
            }, J.fragments = {}, J.each({
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith"
            }, function(t, e) {
                J.fn[t] = function(i) {
                    var n, s = 0,
                        o = [],
                        r = J(i),
                        a = r.length,
                        l = 1 === this.length && this[0].parentNode;
                    if ((null == l || l && 11 === l.nodeType && 1 === l.childNodes.length) && 1 === a) return r[e](this[0]), this;
                    for (; a > s; s++) n = (s > 0 ? this.clone(!0) : this).get(), J(r[s])[e](n), o = o.concat(n);
                    return this.pushStack(o, t, r.selector)
                }
            }), J.extend({
                clone: function(t, e, i) {
                    var n, s, o, r;
                    if (J.support.html5Clone || J.isXMLDoc(t) || !Ge.test("<" + t.nodeName + ">") ? r = t.cloneNode(!0) : (ei.innerHTML = t.outerHTML, ei.removeChild(r = ei.firstChild)), !(J.support.noCloneEvent && J.support.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || J.isXMLDoc(t)))
                        for (p(t, r), n = f(t), s = f(r), o = 0; n[o]; ++o) s[o] && p(n[o], s[o]);
                    if (e && (d(t, r), i))
                        for (n = f(t), s = f(r), o = 0; n[o]; ++o) d(n[o], s[o]);
                    return n = s = null, r
                },
                clean: function(t, e, i, n) {
                    var s, o, r, a, l, c, u, d, p, f, m, v = e === W && ti,
                        b = [];
                    for (e && "undefined" != typeof e.createDocumentFragment || (e = W), s = 0; null != (r = t[s]); s++)
                        if ("number" == typeof r && (r += ""), r) {
                            if ("string" == typeof r)
                                if (Ye.test(r)) {
                                    for (v = v || h(e), u = e.createElement("div"), v.appendChild(u), r = r.replace(Be, "<$1></$2>"), a = ($e.exec(r) || ["", ""])[1].toLowerCase(), l = Ze[a] || Ze._default, c = l[0], u.innerHTML = l[1] + r + l[2]; c--;) u = u.lastChild;
                                    if (!J.support.tbody)
                                        for (d = qe.test(r), p = "table" !== a || d ? "<table>" !== l[1] || d ? [] : u.childNodes : u.firstChild && u.firstChild.childNodes, o = p.length - 1; o >= 0; --o) J.nodeName(p[o], "tbody") && !p[o].childNodes.length && p[o].parentNode.removeChild(p[o]);
                                    !J.support.leadingWhitespace && We.test(r) && u.insertBefore(e.createTextNode(We.exec(r)[0]), u.firstChild), r = u.childNodes, u.parentNode.removeChild(u)
                                } else r = e.createTextNode(r);
                            r.nodeType ? b.push(r) : J.merge(b, r)
                        }
                    if (u && (r = u = v = null), !J.support.appendChecked)
                        for (s = 0; null != (r = b[s]); s++) J.nodeName(r, "input") ? g(r) : "undefined" != typeof r.getElementsByTagName && J.grep(r.getElementsByTagName("input"), g);
                    if (i)
                        for (f = function(t) {
                                return !t.type || Qe.test(t.type) ? n ? n.push(t.parentNode ? t.parentNode.removeChild(t) : t) : i.appendChild(t) : void 0
                            }, s = 0; null != (r = b[s]); s++) J.nodeName(r, "script") && f(r) || (i.appendChild(r), "undefined" != typeof r.getElementsByTagName && (m = J.grep(J.merge([], r.getElementsByTagName("script")), f), b.splice.apply(b, [s + 1, 0].concat(m)), s += m.length));
                    return b
                },
                cleanData: function(t, e) {
                    for (var i, n, s, o, r = 0, a = J.expando, l = J.cache, c = J.support.deleteExpando, h = J.event.special; null != (s = t[r]); r++)
                        if ((e || J.acceptData(s)) && (n = s[a], i = n && l[n])) {
                            if (i.events)
                                for (o in i.events) h[o] ? J.event.remove(s, o) : J.removeEvent(s, o, i.handle);
                            l[n] && (delete l[n], c ? delete s[a] : s.removeAttribute ? s.removeAttribute(a) : s[a] = null, J.deletedIds.push(n))
                        }
                }
            }),
            function() {
                var t, e;
                J.uaMatch = function(t) {
                    t = t.toLowerCase();
                    var e = /(chrome)[ \/]([\w.]+)/.exec(t) || /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || /(msie) ([\w.]+)/.exec(t) || t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
                    return {
                        browser: e[1] || "",
                        version: e[2] || "0"
                    }
                }, t = J.uaMatch($.userAgent), e = {}, t.browser && (e[t.browser] = !0, e.version = t.version), e.chrome ? e.webkit = !0 : e.webkit && (e.safari = !0), J.browser = e, J.sub = function() {
                    function t(e, i) {
                        return new t.fn.init(e, i)
                    }
                    J.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function(i, n) {
                        return n && n instanceof J && !(n instanceof t) && (n = t(n)), J.fn.init.call(this, i, n, e)
                    }, t.fn.init.prototype = t.fn;
                    var e = t(W);
                    return t
                }
            }();
        var ii, ni, si, oi = /alpha\([^)]*\)/i,
            ri = /opacity=([^)]*)/,
            ai = /^(top|right|bottom|left)$/,
            li = /^(none|table(?!-c[ea]).+)/,
            ci = /^margin/,
            hi = new RegExp("^(" + Z + ")(.*)$", "i"),
            ui = new RegExp("^(" + Z + ")(?!px)[a-z%]+$", "i"),
            di = new RegExp("^([-+])=(" + Z + ")", "i"),
            pi = {
                BODY: "block"
            },
            fi = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            gi = {
                letterSpacing: 0,
                fontWeight: 400
            },
            mi = ["Top", "Right", "Bottom", "Left"],
            vi = ["Webkit", "O", "Moz", "ms"],
            bi = J.fn.toggle;
        J.fn.extend({
            css: function(t, i) {
                return J.access(this, function(t, i, n) {
                    return n !== e ? J.style(t, i, n) : J.css(t, i)
                }, t, i, arguments.length > 1)
            },
            show: function() {
                return b(this, !0)
            },
            hide: function() {
                return b(this)
            },
            toggle: function(t, e) {
                var i = "boolean" == typeof t;
                return J.isFunction(t) && J.isFunction(e) ? bi.apply(this, arguments) : this.each(function() {
                    (i ? t : v(this)) ? J(this).show(): J(this).hide()
                })
            }
        }), J.extend({
            cssHooks: {
                opacity: {
                    get: function(t, e) {
                        if (e) {
                            var i = ii(t, "opacity");
                            return "" === i ? "1" : i
                        }
                    }
                }
            },
            cssNumber: {
                fillOpacity: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": J.support.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(t, i, n, s) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var o, r, a, l = J.camelCase(i),
                        c = t.style;
                    if (i = J.cssProps[l] || (J.cssProps[l] = m(c, l)), a = J.cssHooks[i] || J.cssHooks[l], n === e) return a && "get" in a && (o = a.get(t, !1, s)) !== e ? o : c[i];
                    if (r = typeof n, "string" === r && (o = di.exec(n)) && (n = (o[1] + 1) * o[2] + parseFloat(J.css(t, i)), r = "number"), !(null == n || "number" === r && isNaN(n) || ("number" === r && !J.cssNumber[l] && (n += "px"), a && "set" in a && (n = a.set(t, n, s)) === e))) try {
                        c[i] = n
                    } catch (h) {}
                }
            },
            css: function(t, i, n, s) {
                var o, r, a, l = J.camelCase(i);
                return i = J.cssProps[l] || (J.cssProps[l] = m(t.style, l)), a = J.cssHooks[i] || J.cssHooks[l], a && "get" in a && (o = a.get(t, !0, s)), o === e && (o = ii(t, i)), "normal" === o && i in gi && (o = gi[i]), n || s !== e ? (r = parseFloat(o), n || J.isNumeric(r) ? r || 0 : o) : o
            },
            swap: function(t, e, i) {
                var n, s, o = {};
                for (s in e) o[s] = t.style[s], t.style[s] = e[s];
                n = i.call(t);
                for (s in e) t.style[s] = o[s];
                return n
            }
        }), t.getComputedStyle ? ii = function(e, i) {
            var n, s, o, r, a = t.getComputedStyle(e, null),
                l = e.style;
            return a && (n = a.getPropertyValue(i) || a[i], "" === n && !J.contains(e.ownerDocument, e) && (n = J.style(e, i)), ui.test(n) && ci.test(i) && (s = l.width, o = l.minWidth, r = l.maxWidth, l.minWidth = l.maxWidth = l.width = n, n = a.width, l.width = s, l.minWidth = o, l.maxWidth = r)), n
        } : W.documentElement.currentStyle && (ii = function(t, e) {
            var i, n, s = t.currentStyle && t.currentStyle[e],
                o = t.style;
            return null == s && o && o[e] && (s = o[e]), ui.test(s) && !ai.test(e) && (i = o.left, n = t.runtimeStyle && t.runtimeStyle.left, n && (t.runtimeStyle.left = t.currentStyle.left), o.left = "fontSize" === e ? "1em" : s, s = o.pixelLeft + "px", o.left = i, n && (t.runtimeStyle.left = n)), "" === s ? "auto" : s
        }), J.each(["height", "width"], function(t, e) {
            J.cssHooks[e] = {
                get: function(t, i, n) {
                    return i ? 0 === t.offsetWidth && li.test(ii(t, "display")) ? J.swap(t, fi, function() {
                        return w(t, e, n)
                    }) : w(t, e, n) : void 0
                },
                set: function(t, i, n) {
                    return y(t, i, n ? _(t, e, n, J.support.boxSizing && "border-box" === J.css(t, "boxSizing")) : 0)
                }
            }
        }), J.support.opacity || (J.cssHooks.opacity = {
            get: function(t, e) {
                return ri.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
            },
            set: function(t, e) {
                var i = t.style,
                    n = t.currentStyle,
                    s = J.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
                    o = n && n.filter || i.filter || "";
                i.zoom = 1, e >= 1 && "" === J.trim(o.replace(oi, "")) && i.removeAttribute && (i.removeAttribute("filter"), n && !n.filter) || (i.filter = oi.test(o) ? o.replace(oi, s) : o + " " + s)
            }
        }), J(function() {
            J.support.reliableMarginRight || (J.cssHooks.marginRight = {
                get: function(t, e) {
                    return J.swap(t, {
                        display: "inline-block"
                    }, function() {
                        return e ? ii(t, "marginRight") : void 0
                    })
                }
            }), !J.support.pixelPosition && J.fn.position && J.each(["top", "left"], function(t, e) {
                J.cssHooks[e] = {
                    get: function(t, i) {
                        if (i) {
                            var n = ii(t, e);
                            return ui.test(n) ? J(t).position()[e] + "px" : n
                        }
                    }
                }
            })
        }), J.expr && J.expr.filters && (J.expr.filters.hidden = function(t) {
            return 0 === t.offsetWidth && 0 === t.offsetHeight || !J.support.reliableHiddenOffsets && "none" === (t.style && t.style.display || ii(t, "display"))
        }, J.expr.filters.visible = function(t) {
            return !J.expr.filters.hidden(t)
        }), J.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(t, e) {
            J.cssHooks[t + e] = {
                expand: function(i) {
                    var n, s = "string" == typeof i ? i.split(" ") : [i],
                        o = {};
                    for (n = 0; 4 > n; n++) o[t + mi[n] + e] = s[n] || s[n - 2] || s[0];
                    return o
                }
            }, ci.test(t) || (J.cssHooks[t + e].set = y)
        });
        var yi = /%20/g,
            _i = /\[\]$/,
            wi = /\r?\n/g,
            xi = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
            ki = /^(?:select|textarea)/i;
        J.fn.extend({
            serialize: function() {
                return J.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    return this.elements ? J.makeArray(this.elements) : this
                }).filter(function() {
                    return this.name && !this.disabled && (this.checked || ki.test(this.nodeName) || xi.test(this.type))
                }).map(function(t, e) {
                    var i = J(this).val();
                    return null == i ? null : J.isArray(i) ? J.map(i, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(wi, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: i.replace(wi, "\r\n")
                    }
                }).get()
            }
        }), J.param = function(t, i) {
            var n, s = [],
                o = function(t, e) {
                    e = J.isFunction(e) ? e() : null == e ? "" : e, s[s.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
                };
            if (i === e && (i = J.ajaxSettings && J.ajaxSettings.traditional), J.isArray(t) || t.jquery && !J.isPlainObject(t)) J.each(t, function() {
                o(this.name, this.value)
            });
            else
                for (n in t) k(n, t[n], i, o);
            return s.join("&").replace(yi, "+")
        };
        var Ci, Ti, Si = /#.*$/,
            Di = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Ei = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
            Ai = /^(?:GET|HEAD)$/,
            Mi = /^\/\//,
            Ni = /\?/,
            Pi = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            Ii = /([?&])_=[^&]*/,
            Hi = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
            Oi = J.fn.load,
            zi = {},
            Li = {},
            Fi = ["*/"] + ["*"];
        try {
            Ti = B.href
        } catch (Ri) {
            Ti = W.createElement("a"), Ti.href = "", Ti = Ti.href
        }
        Ci = Hi.exec(Ti.toLowerCase()) || [], J.fn.load = function(t, i, n) {
            if ("string" != typeof t && Oi) return Oi.apply(this, arguments);
            if (!this.length) return this;
            var s, o, r, a = this,
                l = t.indexOf(" ");
            return l >= 0 && (s = t.slice(l, t.length), t = t.slice(0, l)), J.isFunction(i) ? (n = i, i = e) : i && "object" == typeof i && (o = "POST"), J.ajax({
                url: t,
                type: o,
                dataType: "html",
                data: i,
                complete: function(t, e) {
                    n && a.each(n, r || [t.responseText, e, t])
                }
            }).done(function(t) {
                r = arguments, a.html(s ? J("<div>").append(t.replace(Pi, "")).find(s) : t)
            }), this
        }, J.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(t, e) {
            J.fn[e] = function(t) {
                return this.on(e, t)
            }
        }), J.each(["get", "post"], function(t, i) {
            J[i] = function(t, n, s, o) {
                return J.isFunction(n) && (o = o || s, s = n, n = e), J.ajax({
                    type: i,
                    url: t,
                    data: n,
                    success: s,
                    dataType: o
                })
            }
        }), J.extend({
            getScript: function(t, i) {
                return J.get(t, e, i, "script")
            },
            getJSON: function(t, e, i) {
                return J.get(t, e, i, "json")
            },
            ajaxSetup: function(t, e) {
                return e ? S(t, J.ajaxSettings) : (e = t, t = J.ajaxSettings), S(t, e), t
            },
            ajaxSettings: {
                url: Ti,
                isLocal: Ei.test(Ci[1]),
                global: !0,
                type: "GET",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                processData: !0,
                async: !0,
                accepts: {
                    xml: "application/xml, text/xml",
                    html: "text/html",
                    text: "text/plain",
                    json: "application/json, text/javascript",
                    "*": Fi
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText"
                },
                converters: {
                    "* text": t.String,
                    "text html": !0,
                    "text json": J.parseJSON,
                    "text xml": J.parseXML
                },
                flatOptions: {
                    context: !0,
                    url: !0
                }
            },
            ajaxPrefilter: C(zi),
            ajaxTransport: C(Li),
            ajax: function(t, i) {
                function n(t, i, n, r) {
                    var c, u, b, y, w, k = i;
                    2 !== _ && (_ = 2, l && clearTimeout(l), a = e, o = r || "", x.readyState = t > 0 ? 4 : 0, n && (y = D(d, x, n)), t >= 200 && 300 > t || 304 === t ? (d.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (J.lastModified[s] = w), w = x.getResponseHeader("Etag"), w && (J.etag[s] = w)), 304 === t ? (k = "notmodified", c = !0) : (c = E(d, y), k = c.state, u = c.data, b = c.error, c = !b)) : (b = k, (!k || t) && (k = "error", 0 > t && (t = 0))), x.status = t, x.statusText = (i || k) + "", c ? g.resolveWith(p, [u, k, x]) : g.rejectWith(p, [x, k, b]), x.statusCode(v), v = e, h && f.trigger("ajax" + (c ? "Success" : "Error"), [x, d, c ? u : b]), m.fireWith(p, [x, k]), h && (f.trigger("ajaxComplete", [x, d]), --J.active || J.event.trigger("ajaxStop")))
                }
                "object" == typeof t && (i = t, t = e), i = i || {};
                var s, o, r, a, l, c, h, u, d = J.ajaxSetup({}, i),
                    p = d.context || d,
                    f = p !== d && (p.nodeType || p instanceof J) ? J(p) : J.event,
                    g = J.Deferred(),
                    m = J.Callbacks("once memory"),
                    v = d.statusCode || {},
                    b = {},
                    y = {},
                    _ = 0,
                    w = "canceled",
                    x = {
                        readyState: 0,
                        setRequestHeader: function(t, e) {
                            if (!_) {
                                var i = t.toLowerCase();
                                t = y[i] = y[i] || t, b[t] = e
                            }
                            return this
                        },
                        getAllResponseHeaders: function() {
                            return 2 === _ ? o : null
                        },
                        getResponseHeader: function(t) {
                            var i;
                            if (2 === _) {
                                if (!r)
                                    for (r = {}; i = Di.exec(o);) r[i[1].toLowerCase()] = i[2];
                                i = r[t.toLowerCase()]
                            }
                            return i === e ? null : i
                        },
                        overrideMimeType: function(t) {
                            return _ || (d.mimeType = t), this
                        },
                        abort: function(t) {
                            return t = t || w, a && a.abort(t), n(0, t), this
                        }
                    };
                if (g.promise(x), x.success = x.done, x.error = x.fail, x.complete = m.add, x.statusCode = function(t) {
                        if (t) {
                            var e;
                            if (2 > _)
                                for (e in t) v[e] = [v[e], t[e]];
                            else e = t[x.status], x.always(e)
                        }
                        return this
                    }, d.url = ((t || d.url) + "").replace(Si, "").replace(Mi, Ci[1] + "//"), d.dataTypes = J.trim(d.dataType || "*").toLowerCase().split(ee), null == d.crossDomain && (c = Hi.exec(d.url.toLowerCase()), d.crossDomain = !(!c || c[1] === Ci[1] && c[2] === Ci[2] && (c[3] || ("http:" === c[1] ? 80 : 443)) == (Ci[3] || ("http:" === Ci[1] ? 80 : 443)))), d.data && d.processData && "string" != typeof d.data && (d.data = J.param(d.data, d.traditional)), T(zi, d, i, x), 2 === _) return x;
                if (h = d.global, d.type = d.type.toUpperCase(), d.hasContent = !Ai.test(d.type), h && 0 === J.active++ && J.event.trigger("ajaxStart"), !d.hasContent && (d.data && (d.url += (Ni.test(d.url) ? "&" : "?") + d.data, delete d.data), s = d.url, d.cache === !1)) {
                    var k = J.now(),
                        C = d.url.replace(Ii, "$1_=" + k);
                    d.url = C + (C === d.url ? (Ni.test(d.url) ? "&" : "?") + "_=" + k : "")
                }(d.data && d.hasContent && d.contentType !== !1 || i.contentType) && x.setRequestHeader("Content-Type", d.contentType), d.ifModified && (s = s || d.url, J.lastModified[s] && x.setRequestHeader("If-Modified-Since", J.lastModified[s]), J.etag[s] && x.setRequestHeader("If-None-Match", J.etag[s])), x.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + ("*" !== d.dataTypes[0] ? ", " + Fi + "; q=0.01" : "") : d.accepts["*"]);
                for (u in d.headers) x.setRequestHeader(u, d.headers[u]);
                if (!d.beforeSend || d.beforeSend.call(p, x, d) !== !1 && 2 !== _) {
                    w = "abort";
                    for (u in {
                            success: 1,
                            error: 1,
                            complete: 1
                        }) x[u](d[u]);
                    if (a = T(Li, d, i, x)) {
                        x.readyState = 1, h && f.trigger("ajaxSend", [x, d]), d.async && d.timeout > 0 && (l = setTimeout(function() {
                            x.abort("timeout")
                        }, d.timeout));
                        try {
                            _ = 1, a.send(b, n)
                        } catch (S) {
                            if (!(2 > _)) throw S;
                            n(-1, S)
                        }
                    } else n(-1, "No Transport");
                    return x
                }
                return x.abort()
            },
            active: 0,
            lastModified: {},
            etag: {}
        });
        var ji = [],
            Wi = /\?/,
            Bi = /(=)\?(?=&|$)|\?\?/,
            $i = J.now();
        J.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var t = ji.pop() || J.expando + "_" + $i++;
                return this[t] = !0, t
            }
        }), J.ajaxPrefilter("json jsonp", function(i, n, s) {
            var o, r, a, l = i.data,
                c = i.url,
                h = i.jsonp !== !1,
                u = h && Bi.test(c),
                d = h && !u && "string" == typeof l && !(i.contentType || "").indexOf("application/x-www-form-urlencoded") && Bi.test(l);
            return "jsonp" === i.dataTypes[0] || u || d ? (o = i.jsonpCallback = J.isFunction(i.jsonpCallback) ? i.jsonpCallback() : i.jsonpCallback, r = t[o], u ? i.url = c.replace(Bi, "$1" + o) : d ? i.data = l.replace(Bi, "$1" + o) : h && (i.url += (Wi.test(c) ? "&" : "?") + i.jsonp + "=" + o), i.converters["script json"] = function() {
                return a || J.error(o + " was not called"), a[0]
            }, i.dataTypes[0] = "json", t[o] = function() {
                a = arguments
            }, s.always(function() {
                t[o] = r, i[o] && (i.jsonpCallback = n.jsonpCallback, ji.push(o)), a && J.isFunction(r) && r(a[0]), a = r = e
            }), "script") : void 0
        }), J.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /javascript|ecmascript/
            },
            converters: {
                "text script": function(t) {
                    return J.globalEval(t), t
                }
            }
        }), J.ajaxPrefilter("script", function(t) {
            t.cache === e && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
        }), J.ajaxTransport("script", function(t) {
            if (t.crossDomain) {
                var i, n = W.head || W.getElementsByTagName("head")[0] || W.documentElement;
                return {
                    send: function(s, o) {
                        i = W.createElement("script"), i.async = "async", t.scriptCharset && (i.charset = t.scriptCharset), i.src = t.url, i.onload = i.onreadystatechange = function(t, s) {
                            (s || !i.readyState || /loaded|complete/.test(i.readyState)) && (i.onload = i.onreadystatechange = null, n && i.parentNode && n.removeChild(i), i = e, s || o(200, "success"))
                        }, n.insertBefore(i, n.firstChild)
                    },
                    abort: function() {
                        i && i.onload(0, 1)
                    }
                }
            }
        });
        var qi, Yi = t.ActiveXObject ? function() {
                for (var t in qi) qi[t](0, 1)
            } : !1,
            Ui = 0;
        J.ajaxSettings.xhr = t.ActiveXObject ? function() {
                return !this.isLocal && A() || M()
            } : A,
            function(t) {
                J.extend(J.support, {
                    ajax: !!t,
                    cors: !!t && "withCredentials" in t
                })
            }(J.ajaxSettings.xhr()), J.support.ajax && J.ajaxTransport(function(i) {
                if (!i.crossDomain || J.support.cors) {
                    var n;
                    return {
                        send: function(s, o) {
                            var r, a, l = i.xhr();
                            if (i.username ? l.open(i.type, i.url, i.async, i.username, i.password) : l.open(i.type, i.url, i.async), i.xhrFields)
                                for (a in i.xhrFields) l[a] = i.xhrFields[a];
                            i.mimeType && l.overrideMimeType && l.overrideMimeType(i.mimeType), !i.crossDomain && !s["X-Requested-With"] && (s["X-Requested-With"] = "XMLHttpRequest");
                            try {
                                for (a in s) l.setRequestHeader(a, s[a])
                            } catch (c) {}
                            l.send(i.hasContent && i.data || null), n = function(t, s) {
                                var a, c, h, u, d;
                                try {
                                    if (n && (s || 4 === l.readyState))
                                        if (n = e, r && (l.onreadystatechange = J.noop, Yi && delete qi[r]), s) 4 !== l.readyState && l.abort();
                                        else {
                                            a = l.status, h = l.getAllResponseHeaders(), u = {}, d = l.responseXML, d && d.documentElement && (u.xml = d);
                                            try {
                                                u.text = l.responseText
                                            } catch (p) {}
                                            try {
                                                c = l.statusText
                                            } catch (p) {
                                                c = ""
                                            }
                                            a || !i.isLocal || i.crossDomain ? 1223 === a && (a = 204) : a = u.text ? 200 : 404
                                        }
                                } catch (f) {
                                    s || o(-1, f)
                                }
                                u && o(a, c, u, h)
                            }, i.async ? 4 === l.readyState ? setTimeout(n, 0) : (r = ++Ui, Yi && (qi || (qi = {}, J(t).unload(Yi)), qi[r] = n), l.onreadystatechange = n) : n()
                        },
                        abort: function() {
                            n && n(0, 1)
                        }
                    }
                }
            });
        var Vi, Gi, Ki = /^(?:toggle|show|hide)$/,
            Xi = new RegExp("^(?:([-+])=|)(" + Z + ")([a-z%]*)$", "i"),
            Qi = /queueHooks$/,
            Ji = [O],
            Zi = {
                "*": [function(t, e) {
                    var i, n, s = this.createTween(t, e),
                        o = Xi.exec(e),
                        r = s.cur(),
                        a = +r || 0,
                        l = 1,
                        c = 20;
                    if (o) {
                        if (i = +o[2], n = o[3] || (J.cssNumber[t] ? "" : "px"), "px" !== n && a) {
                            a = J.css(s.elem, t, !0) || i || 1;
                            do l = l || ".5", a /= l, J.style(s.elem, t, a + n); while (l !== (l = s.cur() / r) && 1 !== l && --c)
                        }
                        s.unit = n, s.start = a, s.end = o[1] ? a + (o[1] + 1) * i : i
                    }
                    return s
                }]
            };
        J.Animation = J.extend(I, {
            tweener: function(t, e) {
                J.isFunction(t) ? (e = t, t = ["*"]) : t = t.split(" ");
                for (var i, n = 0, s = t.length; s > n; n++) i = t[n], Zi[i] = Zi[i] || [], Zi[i].unshift(e)
            },
            prefilter: function(t, e) {
                e ? Ji.unshift(t) : Ji.push(t)
            }
        }), J.Tween = z, z.prototype = {
            constructor: z,
            init: function(t, e, i, n, s, o) {
                this.elem = t, this.prop = i, this.easing = s || "swing", this.options = e, this.start = this.now = this.cur(), this.end = n, this.unit = o || (J.cssNumber[i] ? "" : "px")
            },
            cur: function() {
                var t = z.propHooks[this.prop];
                return t && t.get ? t.get(this) : z.propHooks._default.get(this)
            },
            run: function(t) {
                var e, i = z.propHooks[this.prop];
                return this.pos = e = this.options.duration ? J.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), i && i.set ? i.set(this) : z.propHooks._default.set(this), this
            }
        }, z.prototype.init.prototype = z.prototype, z.propHooks = {
            _default: {
                get: function(t) {
                    var e;
                    return null == t.elem[t.prop] || t.elem.style && null != t.elem.style[t.prop] ? (e = J.css(t.elem, t.prop, !1, ""), e && "auto" !== e ? e : 0) : t.elem[t.prop]
                },
                set: function(t) {
                    J.fx.step[t.prop] ? J.fx.step[t.prop](t) : t.elem.style && (null != t.elem.style[J.cssProps[t.prop]] || J.cssHooks[t.prop]) ? J.style(t.elem, t.prop, t.now + t.unit) : t.elem[t.prop] = t.now
                }
            }
        }, z.propHooks.scrollTop = z.propHooks.scrollLeft = {
            set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
            }
        }, J.each(["toggle", "show", "hide"], function(t, e) {
            var i = J.fn[e];
            J.fn[e] = function(n, s, o) {
                return null == n || "boolean" == typeof n || !t && J.isFunction(n) && J.isFunction(s) ? i.apply(this, arguments) : this.animate(L(e, !0), n, s, o)
            }
        }), J.fn.extend({
            fadeTo: function(t, e, i, n) {
                return this.filter(v).css("opacity", 0).show().end().animate({
                    opacity: e
                }, t, i, n)
            },
            animate: function(t, e, i, n) {
                var s = J.isEmptyObject(t),
                    o = J.speed(e, i, n),
                    r = function() {
                        var e = I(this, J.extend({}, t), o);
                        s && e.stop(!0)
                    };
                return s || o.queue === !1 ? this.each(r) : this.queue(o.queue, r)
            },
            stop: function(t, i, n) {
                var s = function(t) {
                    var e = t.stop;
                    delete t.stop, e(n)
                };
                return "string" != typeof t && (n = i, i = t, t = e), i && t !== !1 && this.queue(t || "fx", []), this.each(function() {
                    var e = !0,
                        i = null != t && t + "queueHooks",
                        o = J.timers,
                        r = J._data(this);
                    if (i) r[i] && r[i].stop && s(r[i]);
                    else
                        for (i in r) r[i] && r[i].stop && Qi.test(i) && s(r[i]);
                    for (i = o.length; i--;) o[i].elem === this && (null == t || o[i].queue === t) && (o[i].anim.stop(n), e = !1, o.splice(i, 1));
                    (e || !n) && J.dequeue(this, t)
                })
            }
        }), J.each({
            slideDown: L("show"),
            slideUp: L("hide"),
            slideToggle: L("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(t, e) {
            J.fn[t] = function(t, i, n) {
                return this.animate(e, t, i, n)
            }
        }), J.speed = function(t, e, i) {
            var n = t && "object" == typeof t ? J.extend({}, t) : {
                complete: i || !i && e || J.isFunction(t) && t,
                duration: t,
                easing: i && e || e && !J.isFunction(e) && e
            };
            return n.duration = J.fx.off ? 0 : "number" == typeof n.duration ? n.duration : n.duration in J.fx.speeds ? J.fx.speeds[n.duration] : J.fx.speeds._default, (null == n.queue || n.queue === !0) && (n.queue = "fx"), n.old = n.complete, n.complete = function() {
                J.isFunction(n.old) && n.old.call(this), n.queue && J.dequeue(this, n.queue)
            }, n
        }, J.easing = {
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            }
        }, J.timers = [], J.fx = z.prototype.init, J.fx.tick = function() {
            var t, i = J.timers,
                n = 0;
            for (Vi = J.now(); n < i.length; n++) t = i[n], !t() && i[n] === t && i.splice(n--, 1);
            i.length || J.fx.stop(), Vi = e
        }, J.fx.timer = function(t) {
            t() && J.timers.push(t) && !Gi && (Gi = setInterval(J.fx.tick, J.fx.interval))
        }, J.fx.interval = 13, J.fx.stop = function() {
            clearInterval(Gi), Gi = null
        }, J.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, J.fx.step = {}, J.expr && J.expr.filters && (J.expr.filters.animated = function(t) {
            return J.grep(J.timers, function(e) {
                return t === e.elem
            }).length
        });
        var tn = /^(?:body|html)$/i;
        J.fn.offset = function(t) {
            if (arguments.length) return t === e ? this : this.each(function(e) {
                J.offset.setOffset(this, t, e)
            });
            var i, n, s, o, r, a, l, c = {
                    top: 0,
                    left: 0
                },
                h = this[0],
                u = h && h.ownerDocument;
            if (u) return (n = u.body) === h ? J.offset.bodyOffset(h) : (i = u.documentElement, J.contains(i, h) ? ("undefined" != typeof h.getBoundingClientRect && (c = h.getBoundingClientRect()), s = F(u), o = i.clientTop || n.clientTop || 0, r = i.clientLeft || n.clientLeft || 0, a = s.pageYOffset || i.scrollTop, l = s.pageXOffset || i.scrollLeft, {
                top: c.top + a - o,
                left: c.left + l - r
            }) : c)
        }, J.offset = {
            bodyOffset: function(t) {
                var e = t.offsetTop,
                    i = t.offsetLeft;
                return J.support.doesNotIncludeMarginInBodyOffset && (e += parseFloat(J.css(t, "marginTop")) || 0, i += parseFloat(J.css(t, "marginLeft")) || 0), {
                    top: e,
                    left: i
                }
            },
            setOffset: function(t, e, i) {
                var n = J.css(t, "position");
                "static" === n && (t.style.position = "relative");
                var s, o, r = J(t),
                    a = r.offset(),
                    l = J.css(t, "top"),
                    c = J.css(t, "left"),
                    h = ("absolute" === n || "fixed" === n) && J.inArray("auto", [l, c]) > -1,
                    u = {},
                    d = {};
                h ? (d = r.position(), s = d.top, o = d.left) : (s = parseFloat(l) || 0, o = parseFloat(c) || 0), J.isFunction(e) && (e = e.call(t, i, a)), null != e.top && (u.top = e.top - a.top + s), null != e.left && (u.left = e.left - a.left + o), "using" in e ? e.using.call(t, u) : r.css(u)
            }
        }, J.fn.extend({
            position: function() {
                if (this[0]) {
                    var t = this[0],
                        e = this.offsetParent(),
                        i = this.offset(),
                        n = tn.test(e[0].nodeName) ? {
                            top: 0,
                            left: 0
                        } : e.offset();
                    return i.top -= parseFloat(J.css(t, "marginTop")) || 0, i.left -= parseFloat(J.css(t, "marginLeft")) || 0, n.top += parseFloat(J.css(e[0], "borderTopWidth")) || 0, n.left += parseFloat(J.css(e[0], "borderLeftWidth")) || 0, {
                        top: i.top - n.top,
                        left: i.left - n.left
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent || W.body; t && !tn.test(t.nodeName) && "static" === J.css(t, "position");) t = t.offsetParent;
                    return t || W.body
                })
            }
        }), J.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, i) {
            var n = /Y/.test(i);
            J.fn[t] = function(s) {
                return J.access(this, function(t, s, o) {
                    var r = F(t);
                    return o === e ? r ? i in r ? r[i] : r.document.documentElement[s] : t[s] : void(r ? r.scrollTo(n ? J(r).scrollLeft() : o, n ? o : J(r).scrollTop()) : t[s] = o)
                }, t, s, arguments.length, null)
            }
        }), J.each({
            Height: "height",
            Width: "width"
        }, function(t, i) {
            J.each({
                padding: "inner" + t,
                content: i,
                "": "outer" + t
            }, function(n, s) {
                J.fn[s] = function(s, o) {
                    var r = arguments.length && (n || "boolean" != typeof s),
                        a = n || (s === !0 || o === !0 ? "margin" : "border");
                    return J.access(this, function(i, n, s) {
                        var o;
                        return J.isWindow(i) ? i.document.documentElement["client" + t] : 9 === i.nodeType ? (o = i.documentElement, Math.max(i.body["scroll" + t], o["scroll" + t], i.body["offset" + t], o["offset" + t], o["client" + t])) : s === e ? J.css(i, n, s, a) : J.style(i, n, s, a)
                    }, i, r ? s : e, r, null)
                }
            })
        }), t.jQuery = t.$ = J, "function" == typeof define && define.amd && define.amd.jQuery && define("jquery", [], function() {
            return J
        })
    }(window),
    function(t, e) {
        function i(e, i) {
            var s, o, r, a = e.nodeName.toLowerCase();
            return "area" === a ? (s = e.parentNode, o = s.name, e.href && o && "map" === s.nodeName.toLowerCase() ? (r = t("img[usemap=#" + o + "]")[0], !!r && n(r)) : !1) : (/input|select|textarea|button|object/.test(a) ? !e.disabled : "a" === a ? e.href || i : i) && n(e)
        }

        function n(e) {
            return t.expr.filters.visible(e) && !t(e).parents().andSelf().filter(function() {
                return "hidden" === t.css(this, "visibility")
            }).length
        }
        var s = 0,
            o = /^ui-id-\d+$/;
        t.ui = t.ui || {}, t.ui.version || (t.extend(t.ui, {
            version: "1.9.1",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), t.fn.extend({
            _focus: t.fn.focus,
            focus: function(e, i) {
                return "number" == typeof e ? this.each(function() {
                    var n = this;
                    setTimeout(function() {
                        t(n).focus(), i && i.call(n)
                    }, e)
                }) : this._focus.apply(this, arguments)
            },
            scrollParent: function() {
                var e;
                return e = t.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function() {
                    return /(relative|absolute|fixed)/.test(t.css(this, "position")) && /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                }).eq(0) : this.parents().filter(function() {
                    return /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                }).eq(0), /fixed/.test(this.css("position")) || !e.length ? t(document) : e
            },
            zIndex: function(i) {
                if (i !== e) return this.css("zIndex", i);
                if (this.length)
                    for (var n, s, o = t(this[0]); o.length && o[0] !== document;) {
                        if (n = o.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(o.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
                        o = o.parent()
                    }
                return 0
            },
            uniqueId: function() {
                return this.each(function() {
                    this.id || (this.id = "ui-id-" + ++s)
                })
            },
            removeUniqueId: function() {
                return this.each(function() {
                    o.test(this.id) && t(this).removeAttr("id")
                })
            }
        }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function(i, n) {
            function s(e, i, n, s) {
                return t.each(o, function() {
                    i -= parseFloat(t.css(e, "padding" + this)) || 0, n && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), s && (i -= parseFloat(t.css(e, "margin" + this)) || 0)
                }), i
            }
            var o = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
                r = n.toLowerCase(),
                a = {
                    innerWidth: t.fn.innerWidth,
                    innerHeight: t.fn.innerHeight,
                    outerWidth: t.fn.outerWidth,
                    outerHeight: t.fn.outerHeight
                };
            t.fn["inner" + n] = function(i) {
                return i === e ? a["inner" + n].call(this) : this.each(function() {
                    t(this).css(r, s(this, i) + "px")
                })
            }, t.fn["outer" + n] = function(e, i) {
                return "number" != typeof e ? a["outer" + n].call(this, e) : this.each(function() {
                    t(this).css(r, s(this, e, !0, i) + "px")
                })
            }
        }), t.extend(t.expr[":"], {
            data: t.expr.createPseudo ? t.expr.createPseudo(function(e) {
                return function(i) {
                    return !!t.data(i, e)
                }
            }) : function(e, i, n) {
                return !!t.data(e, n[3])
            },
            focusable: function(e) {
                return i(e, !isNaN(t.attr(e, "tabindex")))
            },
            tabbable: function(e) {
                var n = t.attr(e, "tabindex"),
                    s = isNaN(n);
                return (s || n >= 0) && i(e, !s)
            }
        }), t(function() {
            var e = document.body,
                i = e.appendChild(i = document.createElement("div"));
            i.offsetHeight, t.extend(i.style, {
                minHeight: "100px",
                height: "auto",
                padding: 0,
                borderWidth: 0
            }), t.support.minHeight = 100 === i.offsetHeight, t.support.selectstart = "onselectstart" in i, e.removeChild(i).style.display = "none"
        }), function() {
            var e = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
            t.ui.ie = e.length ? !0 : !1, t.ui.ie6 = 6 === parseFloat(e[1], 10)
        }(), t.fn.extend({
            disableSelection: function() {
                return this.bind((t.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(t) {
                    t.preventDefault()
                })
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection")
            }
        }), t.extend(t.ui, {
            plugin: {
                add: function(e, i, n) {
                    var s, o = t.ui[e].prototype;
                    for (s in n) o.plugins[s] = o.plugins[s] || [], o.plugins[s].push([i, n[s]])
                },
                call: function(t, e, i) {
                    var n, s = t.plugins[e];
                    if (s && t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType)
                        for (n = 0; n < s.length; n++) t.options[s[n][0]] && s[n][1].apply(t.element, i)
                }
            },
            contains: t.contains,
            hasScroll: function(e, i) {
                if ("hidden" === t(e).css("overflow")) return !1;
                var n = i && "left" === i ? "scrollLeft" : "scrollTop",
                    s = !1;
                return e[n] > 0 ? !0 : (e[n] = 1, s = e[n] > 0, e[n] = 0, s)
            },
            isOverAxis: function(t, e, i) {
                return t > e && e + i > t
            },
            isOver: function(e, i, n, s, o, r) {
                return t.ui.isOverAxis(e, n, o) && t.ui.isOverAxis(i, s, r)
            }
        }))
    }(jQuery),
    function(t, e) {
        var i = 0,
            n = Array.prototype.slice,
            s = t.cleanData;
        t.cleanData = function(e) {
            for (var i, n = 0; null != (i = e[n]); n++) try {
                t(i).triggerHandler("remove")
            } catch (o) {}
            s(e)
        }, t.widget = function(e, i, n) {
            var s, o, r, a, l = e.split(".")[0];
            e = e.split(".")[1], s = l + "-" + e, n || (n = i, i = t.Widget), t.expr[":"][s.toLowerCase()] = function(e) {
                return !!t.data(e, s)
            }, t[l] = t[l] || {}, o = t[l][e], r = t[l][e] = function(t, e) {
                return this._createWidget ? void(arguments.length && this._createWidget(t, e)) : new r(t, e)
            }, t.extend(r, o, {
                version: n.version,
                _proto: t.extend({}, n),
                _childConstructors: []
            }), a = new i, a.options = t.widget.extend({}, a.options), t.each(n, function(e, s) {
                t.isFunction(s) && (n[e] = function() {
                    var t = function() {
                            return i.prototype[e].apply(this, arguments)
                        },
                        n = function(t) {
                            return i.prototype[e].apply(this, t)
                        };
                    return function() {
                        var e, i = this._super,
                            o = this._superApply;
                        return this._super = t, this._superApply = n, e = s.apply(this, arguments), this._super = i, this._superApply = o, e
                    }
                }())
            }), r.prototype = t.widget.extend(a, {
                widgetEventPrefix: a.widgetEventPrefix || e
            }, n, {
                constructor: r,
                namespace: l,
                widgetName: e,
                widgetBaseClass: s,
                widgetFullName: s
            }), o ? (t.each(o._childConstructors, function(e, i) {
                var n = i.prototype;
                t.widget(n.namespace + "." + n.widgetName, r, i._proto)
            }), delete o._childConstructors) : i._childConstructors.push(r), t.widget.bridge(e, r)
        }, t.widget.extend = function(i) {
            for (var s, o, r = n.call(arguments, 1), a = 0, l = r.length; l > a; a++)
                for (s in r[a]) o = r[a][s], r[a].hasOwnProperty(s) && o !== e && (i[s] = t.isPlainObject(o) ? t.isPlainObject(i[s]) ? t.widget.extend({}, i[s], o) : t.widget.extend({}, o) : o);
            return i
        }, t.widget.bridge = function(i, s) {
            var o = s.prototype.widgetFullName;
            t.fn[i] = function(r) {
                var a = "string" == typeof r,
                    l = n.call(arguments, 1),
                    c = this;
                return r = !a && l.length ? t.widget.extend.apply(null, [r].concat(l)) : r, this.each(a ? function() {
                    var n, s = t.data(this, o);
                    return s ? t.isFunction(s[r]) && "_" !== r.charAt(0) ? (n = s[r].apply(s, l), n !== s && n !== e ? (c = n && n.jquery ? c.pushStack(n.get()) : n, !1) : void 0) : t.error("no such method '" + r + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; attempted to call method '" + r + "'")
                } : function() {
                    var e = t.data(this, o);
                    e ? e.option(r || {})._init() : new s(r, this)
                }), c
            }
        }, t.Widget = function() {}, t.Widget._childConstructors = [], t.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function(e, n) {
                n = t(n || this.defaultElement || this)[0], this.element = t(n), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), n !== this && (t.data(n, this.widgetName, this), t.data(n, this.widgetFullName, this), this._on(this.element, {
                    remove: function(t) {
                        t.target === n && this.destroy()
                    }
                }), this.document = t(n.style ? n.ownerDocument : n.document || n), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: t.noop,
            _getCreateEventData: t.noop,
            _create: t.noop,
            _init: t.noop,
            destroy: function() {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: t.noop,
            widget: function() {
                return this.element
            },
            option: function(i, n) {
                var s, o, r, a = i;
                if (0 === arguments.length) return t.widget.extend({}, this.options);
                if ("string" == typeof i)
                    if (a = {}, s = i.split("."), i = s.shift(), s.length) {
                        for (o = a[i] = t.widget.extend({}, this.options[i]), r = 0; r < s.length - 1; r++) o[s[r]] = o[s[r]] || {}, o = o[s[r]];
                        if (i = s.pop(), n === e) return o[i] === e ? null : o[i];
                        o[i] = n
                    } else {
                        if (n === e) return this.options[i] === e ? null : this.options[i];
                        a[i] = n
                    }
                return this._setOptions(a), this
            },
            _setOptions: function(t) {
                var e;
                for (e in t) this._setOption(e, t[e]);
                return this
            },
            _setOption: function(t, e) {
                return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
            },
            enable: function() {
                return this._setOption("disabled", !1)
            },
            disable: function() {
                return this._setOption("disabled", !0)
            },
            _on: function(e, i) {
                var n, s = this;
                i ? (e = n = t(e), this.bindings = this.bindings.add(e)) : (i = e, e = this.element, n = this.widget()), t.each(i, function(i, o) {
                    function r() {
                        return s.options.disabled === !0 || t(this).hasClass("ui-state-disabled") ? void 0 : ("string" == typeof o ? s[o] : o).apply(s, arguments)
                    }
                    "string" != typeof o && (r.guid = o.guid = o.guid || r.guid || t.guid++);
                    var a = i.match(/^(\w+)\s*(.*)$/),
                        l = a[1] + s.eventNamespace,
                        c = a[2];
                    c ? n.delegate(c, l, r) : e.bind(l, r)
                })
            },
            _off: function(t, e) {
                e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e)
            },
            _delay: function(t, e) {
                function i() {
                    return ("string" == typeof t ? n[t] : t).apply(n, arguments)
                }
                var n = this;
                return setTimeout(i, e || 0)
            },
            _hoverable: function(e) {
                this.hoverable = this.hoverable.add(e), this._on(e, {
                    mouseenter: function(e) {
                        t(e.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function(e) {
                        t(e.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function(e) {
                this.focusable = this.focusable.add(e), this._on(e, {
                    focusin: function(e) {
                        t(e.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function(e) {
                        t(e.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function(e, i, n) {
                var s, o, r = this.options[e];
                if (n = n || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent, o)
                    for (s in o) s in i || (i[s] = o[s]);
                return this.element.trigger(i, n), !(t.isFunction(r) && r.apply(this.element[0], [i].concat(n)) === !1 || i.isDefaultPrevented())
            }
        }, t.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(e, i) {
            t.Widget.prototype["_" + e] = function(n, s, o) {
                "string" == typeof s && (s = {
                    effect: s
                });
                var r, a = s ? s === !0 || "number" == typeof s ? i : s.effect || i : e;
                s = s || {}, "number" == typeof s && (s = {
                    duration: s
                }), r = !t.isEmptyObject(s), s.complete = o, s.delay && n.delay(s.delay), r && t.effects && (t.effects.effect[a] || t.uiBackCompat !== !1 && t.effects[a]) ? n[e](s) : a !== e && n[a] ? n[a](s.duration, s.easing, o) : n.queue(function(i) {
                    t(this)[e](), o && o.call(n[0]), i()
                })
            }
        }), t.uiBackCompat !== !1 && (t.Widget.prototype._getCreateOptions = function() {
            return t.metadata && t.metadata.get(this.element[0])[this.widgetName]
        })
    }(jQuery),
    function(t) {
        var e = !1;
        t(document).mouseup(function() {
            e = !1
        }), t.widget("ui.mouse", {
            version: "1.9.1",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function() {
                var e = this;
                this.element.bind("mousedown." + this.widgetName, function(t) {
                    return e._mouseDown(t)
                }).bind("click." + this.widgetName, function(i) {
                    return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : void 0
                }), this.started = !1
            },
            _mouseDestroy: function() {
                this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function(i) {
                if (!e) {
                    this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;
                    var n = this,
                        s = 1 === i.which,
                        o = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;
                    return s && !o && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function() {
                        n.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function(t) {
                        return n._mouseMove(t)
                    }, this._mouseUpDelegate = function(t) {
                        return n._mouseUp(t)
                    }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0
                }
            },
            _mouseMove: function(e) {
                return !t.ui.ie || document.documentMode >= 9 || e.button ? this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted) : this._mouseUp(e)
            },
            _mouseUp: function(e) {
                return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1
            },
            _mouseDistanceMet: function(t) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function() {
                return this.mouseDelayMet
            },
            _mouseStart: function() {},
            _mouseDrag: function() {},
            _mouseStop: function() {},
            _mouseCapture: function() {
                return !0
            }
        })
    }(jQuery),
    function(t) {
        t.widget("ui.draggable", t.ui.mouse, {
            version: "1.9.1",
            widgetEventPrefix: "drag",
            options: {
                addClasses: !0,
                appendTo: "parent",
                axis: !1,
                connectToSortable: !1,
                containment: !1,
                cursor: "auto",
                cursorAt: !1,
                grid: !1,
                handle: !1,
                helper: "original",
                iframeFix: !1,
                opacity: !1,
                refreshPositions: !1,
                revert: !1,
                revertDuration: 500,
                scope: "default",
                scroll: !0,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                snap: !1,
                snapMode: "both",
                snapTolerance: 20,
                stack: !1,
                zIndex: !1
            },
            _create: function() {
                "original" == this.options.helper && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
            },
            _destroy: function() {
                this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy()
            },
            _mouseCapture: function(e) {
                var i = this.options;
                return this.helper || i.disabled || t(e.target).is(".ui-resizable-handle") ? !1 : (this.handle = this._getHandle(e), this.handle ? (t(i.iframeFix === !0 ? "iframe" : i.iframeFix).each(function() {
                    t('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
                        width: this.offsetWidth + "px",
                        height: this.offsetHeight + "px",
                        position: "absolute",
                        opacity: "0.001",
                        zIndex: 1e3
                    }).css(t(this).offset()).appendTo("body")
                }), !0) : !1)
            },
            _mouseStart: function(e) {
                var i = this.options;
                return this.helper = this._createHelper(e), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), t.ui.ddmanager && (t.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {
                    top: this.offset.top - this.margins.top,
                    left: this.offset.left - this.margins.left
                }, t.extend(this.offset, {
                    click: {
                        left: e.pageX - this.offset.left,
                        top: e.pageY - this.offset.top
                    },
                    parent: this._getParentOffset(),
                    relative: this._getRelativeOffset()
                }), this.originalPosition = this.position = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), i.containment && this._setContainment(), this._trigger("start", e) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this._mouseDrag(e, !0), t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e), !0)
            },
            _mouseDrag: function(e, i) {
                if (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), !i) {
                    var n = this._uiHash();
                    if (this._trigger("drag", e, n) === !1) return this._mouseUp({}), !1;
                    this.position = n.position
                }
                return this.options.axis && "y" == this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" == this.options.axis || (this.helper[0].style.top = this.position.top + "px"), t.ui.ddmanager && t.ui.ddmanager.drag(this, e), !1
            },
            _mouseStop: function(e) {
                var i = !1;
                t.ui.ddmanager && !this.options.dropBehaviour && (i = t.ui.ddmanager.drop(this, e)), this.dropped && (i = this.dropped, this.dropped = !1);
                for (var n = this.element[0], s = !1; n && (n = n.parentNode);) n == document && (s = !0);
                if (!s && "original" === this.options.helper) return !1;
                if ("invalid" == this.options.revert && !i || "valid" == this.options.revert && i || this.options.revert === !0 || t.isFunction(this.options.revert) && this.options.revert.call(this.element, i)) {
                    var o = this;
                    t(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
                        o._trigger("stop", e) !== !1 && o._clear()
                    })
                } else this._trigger("stop", e) !== !1 && this._clear();
                return !1
            },
            _mouseUp: function(e) {
                return t("div.ui-draggable-iframeFix").each(function() {
                    this.parentNode.removeChild(this)
                }), t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e), t.ui.mouse.prototype._mouseUp.call(this, e)
            },
            cancel: function() {
                return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
            },
            _getHandle: function(e) {
                var i = this.options.handle && t(this.options.handle, this.element).length ? !1 : !0;
                return t(this.options.handle, this.element).find("*").andSelf().each(function() {
                    this == e.target && (i = !0)
                }), i
            },
            _createHelper: function(e) {
                var i = this.options,
                    n = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e])) : "clone" == i.helper ? this.element.clone().removeAttr("id") : this.element;
                return n.parents("body").length || n.appendTo("parent" == i.appendTo ? this.element[0].parentNode : i.appendTo), n[0] != this.element[0] && !/(fixed|absolute)/.test(n.css("position")) && n.css("position", "absolute"), n
            },
            _adjustOffsetFromHelper: function(e) {
                "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                    left: +e[0],
                    top: +e[1] || 0
                }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
            },
            _getParentOffset: function() {
                this.offsetParent = this.helper.offsetParent();
                var e = this.offsetParent.offset();
                return "absolute" == this.cssPosition && this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && "html" == this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
                    top: 0,
                    left: 0
                }), {
                    top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
            },
            _getRelativeOffset: function() {
                if ("relative" == this.cssPosition) {
                    var t = this.element.position();
                    return {
                        top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                        left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                    }
                }
                return {
                    top: 0,
                    left: 0
                }
            },
            _cacheMargins: function() {
                this.margins = {
                    left: parseInt(this.element.css("marginLeft"), 10) || 0,
                    top: parseInt(this.element.css("marginTop"), 10) || 0,
                    right: parseInt(this.element.css("marginRight"), 10) || 0,
                    bottom: parseInt(this.element.css("marginBottom"), 10) || 0
                }
            },
            _cacheHelperProportions: function() {
                this.helperProportions = {
                    width: this.helper.outerWidth(),
                    height: this.helper.outerHeight()
                }
            },
            _setContainment: function() {
                var e = this.options;
                if ("parent" == e.containment && (e.containment = this.helper[0].parentNode), ("document" == e.containment || "window" == e.containment) && (this.containment = ["document" == e.containment ? 0 : t(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, "document" == e.containment ? 0 : t(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, ("document" == e.containment ? 0 : t(window).scrollLeft()) + t("document" == e.containment ? document : window).width() - this.helperProportions.width - this.margins.left, ("document" == e.containment ? 0 : t(window).scrollTop()) + (t("document" == e.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), /^(document|window|parent)$/.test(e.containment) || e.containment.constructor == Array) e.containment.constructor == Array && (this.containment = e.containment);
                else {
                    var i = t(e.containment),
                        n = i[0];
                    if (!n) return;
                    var s = (i.offset(), "hidden" != t(n).css("overflow"));
                    this.containment = [(parseInt(t(n).css("borderLeftWidth"), 10) || 0) + (parseInt(t(n).css("paddingLeft"), 10) || 0), (parseInt(t(n).css("borderTopWidth"), 10) || 0) + (parseInt(t(n).css("paddingTop"), 10) || 0), (s ? Math.max(n.scrollWidth, n.offsetWidth) : n.offsetWidth) - (parseInt(t(n).css("borderLeftWidth"), 10) || 0) - (parseInt(t(n).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (s ? Math.max(n.scrollHeight, n.offsetHeight) : n.offsetHeight) - (parseInt(t(n).css("borderTopWidth"), 10) || 0) - (parseInt(t(n).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = i
                }
            },
            _convertPositionTo: function(e, i) {
                i || (i = this.position);
                var n = "absolute" == e ? 1 : -1,
                    s = (this.options, "absolute" != this.cssPosition || this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent),
                    o = /(html|body)/i.test(s[0].tagName);
                return {
                    top: i.top + this.offset.relative.top * n + this.offset.parent.top * n - ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * n,
                    left: i.left + this.offset.relative.left * n + this.offset.parent.left * n - ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * n
                }
            },
            _generatePosition: function(e) {
                var i = this.options,
                    n = "absolute" != this.cssPosition || this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                    s = /(html|body)/i.test(n[0].tagName),
                    o = e.pageX,
                    r = e.pageY;
                if (this.originalPosition) {
                    var a;
                    if (this.containment) {
                        if (this.relative_container) {
                            var l = this.relative_container.offset();
                            a = [this.containment[0] + l.left, this.containment[1] + l.top, this.containment[2] + l.left, this.containment[3] + l.top]
                        } else a = this.containment;
                        e.pageX - this.offset.click.left < a[0] && (o = a[0] + this.offset.click.left), e.pageY - this.offset.click.top < a[1] && (r = a[1] + this.offset.click.top), e.pageX - this.offset.click.left > a[2] && (o = a[2] + this.offset.click.left), e.pageY - this.offset.click.top > a[3] && (r = a[3] + this.offset.click.top)
                    }
                    if (i.grid) {
                        var c = i.grid[1] ? this.originalPageY + Math.round((r - this.originalPageY) / i.grid[1]) * i.grid[1] : this.originalPageY;
                        r = a && (c - this.offset.click.top < a[1] || c - this.offset.click.top > a[3]) ? c - this.offset.click.top < a[1] ? c + i.grid[1] : c - i.grid[1] : c;
                        var h = i.grid[0] ? this.originalPageX + Math.round((o - this.originalPageX) / i.grid[0]) * i.grid[0] : this.originalPageX;
                        o = a && (h - this.offset.click.left < a[0] || h - this.offset.click.left > a[2]) ? h - this.offset.click.left < a[0] ? h + i.grid[0] : h - i.grid[0] : h
                    }
                }
                return {
                    top: r - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : n.scrollTop()),
                    left: o - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : n.scrollLeft())
                }
            },
            _clear: function() {
                this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
            },
            _trigger: function(e, i, n) {
                return n = n || this._uiHash(), t.ui.plugin.call(this, e, [i, n]), "drag" == e && (this.positionAbs = this._convertPositionTo("absolute")), t.Widget.prototype._trigger.call(this, e, i, n)
            },
            plugins: {},
            _uiHash: function() {
                return {
                    helper: this.helper,
                    position: this.position,
                    originalPosition: this.originalPosition,
                    offset: this.positionAbs
                }
            }
        }), t.ui.plugin.add("draggable", "connectToSortable", {
            start: function(e, i) {
                var n = t(this).data("draggable"),
                    s = n.options,
                    o = t.extend({}, i, {
                        item: n.element
                    });
                n.sortables = [], t(s.connectToSortable).each(function() {
                    var i = t.data(this, "sortable");
                    i && !i.options.disabled && (n.sortables.push({
                        instance: i,
                        shouldRevert: i.options.revert
                    }), i.refreshPositions(), i._trigger("activate", e, o))
                })
            },
            stop: function(e, i) {
                var n = t(this).data("draggable"),
                    s = t.extend({}, i, {
                        item: n.element
                    });
                t.each(n.sortables, function() {
                    this.instance.isOver ? (this.instance.isOver = 0, n.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(e), this.instance.options.helper = this.instance.options._helper, "original" == n.options.helper && this.instance.currentItem.css({
                        top: "auto",
                        left: "auto"
                    })) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", e, s))
                })
            },
            drag: function(e, i) {
                var n = t(this).data("draggable"),
                    s = this;
                t.each(n.sortables, function() {
                    var o = !1,
                        r = this;
                    this.instance.positionAbs = n.positionAbs, this.instance.helperProportions = n.helperProportions, this.instance.offset.click = n.offset.click, this.instance._intersectsWith(this.instance.containerCache) && (o = !0, t.each(n.sortables, function() {
                        return this.instance.positionAbs = n.positionAbs, this.instance.helperProportions = n.helperProportions, this.instance.offset.click = n.offset.click, this != r && this.instance._intersectsWith(this.instance.containerCache) && t.ui.contains(r.instance.element[0], this.instance.element[0]) && (o = !1), o
                    })), o ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = t(s).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function() {
                        return i.helper[0]
                    }, e.target = this.instance.currentItem[0], this.instance._mouseCapture(e, !0), this.instance._mouseStart(e, !0, !0), this.instance.offset.click.top = n.offset.click.top, this.instance.offset.click.left = n.offset.click.left, this.instance.offset.parent.left -= n.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= n.offset.parent.top - this.instance.offset.parent.top, n._trigger("toSortable", e), n.dropped = this.instance.element, n.currentItem = n.element, this.instance.fromOutside = n), this.instance.currentItem && this.instance._mouseDrag(e)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", e, this.instance._uiHash(this.instance)), this.instance._mouseStop(e, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), n._trigger("fromSortable", e), n.dropped = !1)
                })
            }
        }), t.ui.plugin.add("draggable", "cursor", {
            start: function() {
                var e = t("body"),
                    i = t(this).data("draggable").options;
                e.css("cursor") && (i._cursor = e.css("cursor")), e.css("cursor", i.cursor)
            },
            stop: function() {
                var e = t(this).data("draggable").options;
                e._cursor && t("body").css("cursor", e._cursor)
            }
        }), t.ui.plugin.add("draggable", "opacity", {
            start: function(e, i) {
                var n = t(i.helper),
                    s = t(this).data("draggable").options;
                n.css("opacity") && (s._opacity = n.css("opacity")), n.css("opacity", s.opacity)
            },
            stop: function(e, i) {
                var n = t(this).data("draggable").options;
                n._opacity && t(i.helper).css("opacity", n._opacity)
            }
        }), t.ui.plugin.add("draggable", "scroll", {
            start: function() {
                var e = t(this).data("draggable");
                e.scrollParent[0] != document && "HTML" != e.scrollParent[0].tagName && (e.overflowOffset = e.scrollParent.offset())
            },
            drag: function(e) {
                var i = t(this).data("draggable"),
                    n = i.options,
                    s = !1;
                i.scrollParent[0] != document && "HTML" != i.scrollParent[0].tagName ? (n.axis && "x" == n.axis || (i.overflowOffset.top + i.scrollParent[0].offsetHeight - e.pageY < n.scrollSensitivity ? i.scrollParent[0].scrollTop = s = i.scrollParent[0].scrollTop + n.scrollSpeed : e.pageY - i.overflowOffset.top < n.scrollSensitivity && (i.scrollParent[0].scrollTop = s = i.scrollParent[0].scrollTop - n.scrollSpeed)), n.axis && "y" == n.axis || (i.overflowOffset.left + i.scrollParent[0].offsetWidth - e.pageX < n.scrollSensitivity ? i.scrollParent[0].scrollLeft = s = i.scrollParent[0].scrollLeft + n.scrollSpeed : e.pageX - i.overflowOffset.left < n.scrollSensitivity && (i.scrollParent[0].scrollLeft = s = i.scrollParent[0].scrollLeft - n.scrollSpeed))) : (n.axis && "x" == n.axis || (e.pageY - t(document).scrollTop() < n.scrollSensitivity ? s = t(document).scrollTop(t(document).scrollTop() - n.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < n.scrollSensitivity && (s = t(document).scrollTop(t(document).scrollTop() + n.scrollSpeed))), n.axis && "y" == n.axis || (e.pageX - t(document).scrollLeft() < n.scrollSensitivity ? s = t(document).scrollLeft(t(document).scrollLeft() - n.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < n.scrollSensitivity && (s = t(document).scrollLeft(t(document).scrollLeft() + n.scrollSpeed)))), s !== !1 && t.ui.ddmanager && !n.dropBehaviour && t.ui.ddmanager.prepareOffsets(i, e)
            }
        }), t.ui.plugin.add("draggable", "snap", {
            start: function() {
                var e = t(this).data("draggable"),
                    i = e.options;
                e.snapElements = [], t(i.snap.constructor != String ? i.snap.items || ":data(draggable)" : i.snap).each(function() {
                    var i = t(this),
                        n = i.offset();
                    this != e.element[0] && e.snapElements.push({
                        item: this,
                        width: i.outerWidth(),
                        height: i.outerHeight(),
                        top: n.top,
                        left: n.left
                    })
                })
            },
            drag: function(e, i) {
                for (var n = t(this).data("draggable"), s = n.options, o = s.snapTolerance, r = i.offset.left, a = r + n.helperProportions.width, l = i.offset.top, c = l + n.helperProportions.height, h = n.snapElements.length - 1; h >= 0; h--) {
                    var u = n.snapElements[h].left,
                        d = u + n.snapElements[h].width,
                        p = n.snapElements[h].top,
                        f = p + n.snapElements[h].height;
                    if (r > u - o && d + o > r && l > p - o && f + o > l || r > u - o && d + o > r && c > p - o && f + o > c || a > u - o && d + o > a && l > p - o && f + o > l || a > u - o && d + o > a && c > p - o && f + o > c) {
                        if ("inner" != s.snapMode) {
                            var g = Math.abs(p - c) <= o,
                                m = Math.abs(f - l) <= o,
                                v = Math.abs(u - a) <= o,
                                b = Math.abs(d - r) <= o;
                            g && (i.position.top = n._convertPositionTo("relative", {
                                top: p - n.helperProportions.height,
                                left: 0
                            }).top - n.margins.top), m && (i.position.top = n._convertPositionTo("relative", {
                                top: f,
                                left: 0
                            }).top - n.margins.top), v && (i.position.left = n._convertPositionTo("relative", {
                                top: 0,
                                left: u - n.helperProportions.width
                            }).left - n.margins.left), b && (i.position.left = n._convertPositionTo("relative", {
                                top: 0,
                                left: d
                            }).left - n.margins.left)
                        }
                        var y = g || m || v || b;
                        if ("outer" != s.snapMode) {
                            var g = Math.abs(p - l) <= o,
                                m = Math.abs(f - c) <= o,
                                v = Math.abs(u - r) <= o,
                                b = Math.abs(d - a) <= o;
                            g && (i.position.top = n._convertPositionTo("relative", {
                                top: p,
                                left: 0
                            }).top - n.margins.top), m && (i.position.top = n._convertPositionTo("relative", {
                                top: f - n.helperProportions.height,
                                left: 0
                            }).top - n.margins.top), v && (i.position.left = n._convertPositionTo("relative", {
                                top: 0,
                                left: u
                            }).left - n.margins.left), b && (i.position.left = n._convertPositionTo("relative", {
                                top: 0,
                                left: d - n.helperProportions.width
                            }).left - n.margins.left)
                        }!n.snapElements[h].snapping && (g || m || v || b || y) && n.options.snap.snap && n.options.snap.snap.call(n.element, e, t.extend(n._uiHash(), {
                            snapItem: n.snapElements[h].item
                        })), n.snapElements[h].snapping = g || m || v || b || y
                    } else n.snapElements[h].snapping && n.options.snap.release && n.options.snap.release.call(n.element, e, t.extend(n._uiHash(), {
                        snapItem: n.snapElements[h].item
                    })), n.snapElements[h].snapping = !1
                }
            }
        }), t.ui.plugin.add("draggable", "stack", {
            start: function() {
                var e = t(this).data("draggable").options,
                    i = t.makeArray(t(e.stack)).sort(function(e, i) {
                        return (parseInt(t(e).css("zIndex"), 10) || 0) - (parseInt(t(i).css("zIndex"), 10) || 0)
                    });
                if (i.length) {
                    var n = parseInt(i[0].style.zIndex) || 0;
                    t(i).each(function(t) {
                        this.style.zIndex = n + t
                    }), this[0].style.zIndex = n + i.length
                }
            }
        }), t.ui.plugin.add("draggable", "zIndex", {
            start: function(e, i) {
                var n = t(i.helper),
                    s = t(this).data("draggable").options;
                n.css("zIndex") && (s._zIndex = n.css("zIndex")), n.css("zIndex", s.zIndex)
            },
            stop: function(e, i) {
                var n = t(this).data("draggable").options;
                n._zIndex && t(i.helper).css("zIndex", n._zIndex)
            }
        })
    }(jQuery),
    function(t) {
        t.widget("ui.droppable", {
            version: "1.9.1",
            widgetEventPrefix: "drop",
            options: {
                accept: "*",
                activeClass: !1,
                addClasses: !0,
                greedy: !1,
                hoverClass: !1,
                scope: "default",
                tolerance: "intersect"
            },
            _create: function() {
                var e = this.options,
                    i = e.accept;
                this.isover = 0, this.isout = 1, this.accept = t.isFunction(i) ? i : function(t) {
                    return t.is(i)
                }, this.proportions = {
                    width: this.element[0].offsetWidth,
                    height: this.element[0].offsetHeight
                }, t.ui.ddmanager.droppables[e.scope] = t.ui.ddmanager.droppables[e.scope] || [], t.ui.ddmanager.droppables[e.scope].push(this), e.addClasses && this.element.addClass("ui-droppable")
            },
            _destroy: function() {
                for (var e = t.ui.ddmanager.droppables[this.options.scope], i = 0; i < e.length; i++) e[i] == this && e.splice(i, 1);
                this.element.removeClass("ui-droppable ui-droppable-disabled")
            },
            _setOption: function(e, i) {
                "accept" == e && (this.accept = t.isFunction(i) ? i : function(t) {
                    return t.is(i)
                }), t.Widget.prototype._setOption.apply(this, arguments)
            },
            _activate: function(e) {
                var i = t.ui.ddmanager.current;
                this.options.activeClass && this.element.addClass(this.options.activeClass), i && this._trigger("activate", e, this.ui(i))
            },
            _deactivate: function(e) {
                var i = t.ui.ddmanager.current;
                this.options.activeClass && this.element.removeClass(this.options.activeClass), i && this._trigger("deactivate", e, this.ui(i))
            },
            _over: function(e) {
                var i = t.ui.ddmanager.current;
                i && (i.currentItem || i.element)[0] != this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", e, this.ui(i)))
            },
            _out: function(e) {
                var i = t.ui.ddmanager.current;
                i && (i.currentItem || i.element)[0] != this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", e, this.ui(i)))
            },
            _drop: function(e, i) {
                var n = i || t.ui.ddmanager.current;
                if (!n || (n.currentItem || n.element)[0] == this.element[0]) return !1;
                var s = !1;
                return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
                    var e = t.data(this, "droppable");
                    return e.options.greedy && !e.options.disabled && e.options.scope == n.options.scope && e.accept.call(e.element[0], n.currentItem || n.element) && t.ui.intersect(n, t.extend(e, {
                        offset: e.element.offset()
                    }), e.options.tolerance) ? (s = !0, !1) : void 0
                }), s ? !1 : this.accept.call(this.element[0], n.currentItem || n.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", e, this.ui(n)), this.element) : !1
            },
            ui: function(t) {
                return {
                    draggable: t.currentItem || t.element,
                    helper: t.helper,
                    position: t.position,
                    offset: t.positionAbs
                }
            }
        }), t.ui.intersect = function(e, i, n) {
            if (!i.offset) return !1;
            var s = (e.positionAbs || e.position.absolute).left,
                o = s + e.helperProportions.width,
                r = (e.positionAbs || e.position.absolute).top,
                a = r + e.helperProportions.height,
                l = i.offset.left,
                c = l + i.proportions.width,
                h = i.offset.top,
                u = h + i.proportions.height;
            switch (n) {
                case "fit":
                    return s >= l && c >= o && r >= h && u >= a;
                case "intersect":
                    return l < s + e.helperProportions.width / 2 && o - e.helperProportions.width / 2 < c && h < r + e.helperProportions.height / 2 && a - e.helperProportions.height / 2 < u;
                case "pointer":
                    var d = (e.positionAbs || e.position.absolute).left + (e.clickOffset || e.offset.click).left,
                        p = (e.positionAbs || e.position.absolute).top + (e.clickOffset || e.offset.click).top,
                        f = t.ui.isOver(p, d, h, l, i.proportions.height, i.proportions.width);
                    return f;
                case "touch":
                    return (r >= h && u >= r || a >= h && u >= a || h > r && a > u) && (s >= l && c >= s || o >= l && c >= o || l > s && o > c);
                default:
                    return !1
            }
        }, t.ui.ddmanager = {
            current: null,
            droppables: {
                "default": []
            },
            prepareOffsets: function(e, i) {
                var n = t.ui.ddmanager.droppables[e.options.scope] || [],
                    s = i ? i.type : null,
                    o = (e.currentItem || e.element).find(":data(droppable)").andSelf();
                t: for (var r = 0; r < n.length; r++)
                    if (!(n[r].options.disabled || e && !n[r].accept.call(n[r].element[0], e.currentItem || e.element))) {
                        for (var a = 0; a < o.length; a++)
                            if (o[a] == n[r].element[0]) {
                                n[r].proportions.height = 0;
                                continue t
                            }
                        n[r].visible = "none" != n[r].element.css("display"), n[r].visible && ("mousedown" == s && n[r]._activate.call(n[r], i), n[r].offset = n[r].element.offset(), n[r].proportions = {
                            width: n[r].element[0].offsetWidth,
                            height: n[r].element[0].offsetHeight
                        })
                    }
            },
            drop: function(e, i) {
                var n = !1;
                return t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function() {
                    this.options && (!this.options.disabled && this.visible && t.ui.intersect(e, this, this.options.tolerance) && (n = this._drop.call(this, i) || n), !this.options.disabled && this.visible && this.accept.call(this.element[0], e.currentItem || e.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, i)))
                }), n
            },
            dragStart: function(e, i) {
                e.element.parentsUntil("body").bind("scroll.droppable", function() {
                    e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
                })
            },
            drag: function(e, i) {
                e.options.refreshPositions && t.ui.ddmanager.prepareOffsets(e, i), t.each(t.ui.ddmanager.droppables[e.options.scope] || [], function() {
                    if (!this.options.disabled && !this.greedyChild && this.visible) {
                        var n = t.ui.intersect(e, this, this.options.tolerance),
                            s = n || 1 != this.isover ? n && 0 == this.isover ? "isover" : null : "isout";
                        if (s) {
                            var o;
                            if (this.options.greedy) {
                                var r = this.options.scope,
                                    a = this.element.parents(":data(droppable)").filter(function() {
                                        return t.data(this, "droppable").options.scope === r
                                    });
                                a.length && (o = t.data(a[0], "droppable"), o.greedyChild = "isover" == s ? 1 : 0)
                            }
                            o && "isover" == s && (o.isover = 0, o.isout = 1, o._out.call(o, i)), this[s] = 1, this["isout" == s ? "isover" : "isout"] = 0, this["isover" == s ? "_over" : "_out"].call(this, i), o && "isout" == s && (o.isout = 0, o.isover = 1, o._over.call(o, i))
                        }
                    }
                })
            },
            dragStop: function(e, i) {
                e.element.parentsUntil("body").unbind("scroll.droppable"), e.options.refreshPositions || t.ui.ddmanager.prepareOffsets(e, i)
            }
        }
    }(jQuery),
    function(t) {
        t.widget("ui.resizable", t.ui.mouse, {
            version: "1.9.1",
            widgetEventPrefix: "resize",
            options: {
                alsoResize: !1,
                animate: !1,
                animateDuration: "slow",
                animateEasing: "swing",
                aspectRatio: !1,
                autoHide: !1,
                containment: !1,
                ghost: !1,
                grid: !1,
                handles: "e,s,se",
                helper: !1,
                maxHeight: null,
                maxWidth: null,
                minHeight: 10,
                minWidth: 10,
                zIndex: 1e3
            },
            _create: function() {
                var e = this,
                    i = this.options;
                if (this.element.addClass("ui-resizable"), t.extend(this, {
                        _aspectRatio: !!i.aspectRatio,
                        aspectRatio: i.aspectRatio,
                        originalElement: this.element,
                        _proportionallyResizeElements: [],
                        _helper: i.helper || i.ghost || i.animate ? i.helper || "ui-resizable-helper" : null
                    }), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(t('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
                        position: this.element.css("position"),
                        width: this.element.outerWidth(),
                        height: this.element.outerHeight(),
                        top: this.element.css("top"),
                        left: this.element.css("left")
                    })), this.element = this.element.parent().data("resizable", this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({
                        marginLeft: this.originalElement.css("marginLeft"),
                        marginTop: this.originalElement.css("marginTop"),
                        marginRight: this.originalElement.css("marginRight"),
                        marginBottom: this.originalElement.css("marginBottom")
                    }), this.originalElement.css({
                        marginLeft: 0,
                        marginTop: 0,
                        marginRight: 0,
                        marginBottom: 0
                    }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
                        position: "static",
                        zoom: 1,
                        display: "block"
                    })), this.originalElement.css({
                        margin: this.originalElement.css("margin")
                    }), this._proportionallyResize()), this.handles = i.handles || (t(".ui-resizable-handle", this.element).length ? {
                        n: ".ui-resizable-n",
                        e: ".ui-resizable-e",
                        s: ".ui-resizable-s",
                        w: ".ui-resizable-w",
                        se: ".ui-resizable-se",
                        sw: ".ui-resizable-sw",
                        ne: ".ui-resizable-ne",
                        nw: ".ui-resizable-nw"
                    } : "e,s,se"), this.handles.constructor == String) {
                    "all" == this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw");
                    var n = this.handles.split(",");
                    this.handles = {};
                    for (var s = 0; s < n.length; s++) {
                        var o = t.trim(n[s]),
                            r = "ui-resizable-" + o,
                            a = t('<div class="ui-resizable-handle ' + r + '"></div>');
                        a.css({
                            zIndex: i.zIndex
                        }), "se" == o && a.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[o] = ".ui-resizable-" + o, this.element.append(a)
                    }
                }
                this._renderAxis = function(e) {
                    e = e || this.element;
                    for (var i in this.handles) {
                        if (this.handles[i].constructor == String && (this.handles[i] = t(this.handles[i], this.element).show()), this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                            var n = t(this.handles[i], this.element),
                                s = 0;
                            s = /sw|ne|nw|se|n|s/.test(i) ? n.outerHeight() : n.outerWidth();
                            var o = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join("");
                            e.css(o, s), this._proportionallyResize()
                        }
                        t(this.handles[i]).length
                    }
                }, this._renderAxis(this.element), this._handles = t(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function() {
                    if (!e.resizing) {
                        if (this.className) var t = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                        e.axis = t && t[1] ? t[1] : "se"
                    }
                }), i.autoHide && (this._handles.hide(), t(this.element).addClass("ui-resizable-autohide").mouseenter(function() {
                    i.disabled || (t(this).removeClass("ui-resizable-autohide"), e._handles.show())
                }).mouseleave(function() {
                    i.disabled || e.resizing || (t(this).addClass("ui-resizable-autohide"), e._handles.hide())
                })), this._mouseInit()
            },
            _destroy: function() {
                this._mouseDestroy();
                var e = function(e) {
                    t(e).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
                };
                if (this.elementIsWrapper) {
                    e(this.element);
                    var i = this.element;
                    this.originalElement.css({
                        position: i.css("position"),
                        width: i.outerWidth(),
                        height: i.outerHeight(),
                        top: i.css("top"),
                        left: i.css("left")
                    }).insertAfter(i), i.remove()
                }
                return this.originalElement.css("resize", this.originalResizeStyle), e(this.originalElement), this
            },
            _mouseCapture: function(e) {
                var i = !1;
                for (var n in this.handles) t(this.handles[n])[0] == e.target && (i = !0);
                return !this.options.disabled && i
            },
            _mouseStart: function(i) {
                var n = this.options,
                    s = this.element.position(),
                    o = this.element;
                this.resizing = !0, this.documentScroll = {
                    top: t(document).scrollTop(),
                    left: t(document).scrollLeft()
                }, (o.is(".ui-draggable") || /absolute/.test(o.css("position"))) && o.css({
                    position: "absolute",
                    top: s.top,
                    left: s.left
                }), this._renderProxy();
                var r = e(this.helper.css("left")),
                    a = e(this.helper.css("top"));
                n.containment && (r += t(n.containment).scrollLeft() || 0, a += t(n.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
                    left: r,
                    top: a
                }, this.size = this._helper ? {
                    width: o.outerWidth(),
                    height: o.outerHeight()
                } : {
                    width: o.width(),
                    height: o.height()
                }, this.originalSize = this._helper ? {
                    width: o.outerWidth(),
                    height: o.outerHeight()
                } : {
                    width: o.width(),
                    height: o.height()
                }, this.originalPosition = {
                    left: r,
                    top: a
                }, this.sizeDiff = {
                    width: o.outerWidth() - o.width(),
                    height: o.outerHeight() - o.height()
                }, this.originalMousePosition = {
                    left: i.pageX,
                    top: i.pageY
                }, this.aspectRatio = "number" == typeof n.aspectRatio ? n.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
                var l = t(".ui-resizable-" + this.axis).css("cursor");
                return t("body").css("cursor", "auto" == l ? this.axis + "-resize" : l), o.addClass("ui-resizable-resizing"), this._propagate("start", i), !0
            },
            _mouseDrag: function(t) {
                var e = this.helper,
                    i = (this.options, this.originalMousePosition),
                    n = this.axis,
                    s = t.pageX - i.left || 0,
                    o = t.pageY - i.top || 0,
                    r = this._change[n];
                if (!r) return !1;
                var a = r.apply(this, [t, s, o]);
                return this._updateVirtualBoundaries(t.shiftKey), (this._aspectRatio || t.shiftKey) && (a = this._updateRatio(a, t)), a = this._respectSize(a, t), this._propagate("resize", t), e.css({
                    top: this.position.top + "px",
                    left: this.position.left + "px",
                    width: this.size.width + "px",
                    height: this.size.height + "px"
                }), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(a), this._trigger("resize", t, this.ui()), !1
            },
            _mouseStop: function(e) {
                this.resizing = !1;
                var i = this.options,
                    n = this;
                if (this._helper) {
                    var s = this._proportionallyResizeElements,
                        o = s.length && /textarea/i.test(s[0].nodeName),
                        r = o && t.ui.hasScroll(s[0], "left") ? 0 : n.sizeDiff.height,
                        a = o ? 0 : n.sizeDiff.width,
                        l = {
                            width: n.helper.width() - a,
                            height: n.helper.height() - r
                        },
                        c = parseInt(n.element.css("left"), 10) + (n.position.left - n.originalPosition.left) || null,
                        h = parseInt(n.element.css("top"), 10) + (n.position.top - n.originalPosition.top) || null;
                    i.animate || this.element.css(t.extend(l, {
                        top: h,
                        left: c
                    })), n.helper.height(n.size.height), n.helper.width(n.size.width), this._helper && !i.animate && this._proportionallyResize()
                }
                return t("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", e), this._helper && this.helper.remove(), !1
            },
            _updateVirtualBoundaries: function(t) {
                var e, n, s, o, r, a = this.options;
                r = {
                    minWidth: i(a.minWidth) ? a.minWidth : 0,
                    maxWidth: i(a.maxWidth) ? a.maxWidth : 1 / 0,
                    minHeight: i(a.minHeight) ? a.minHeight : 0,
                    maxHeight: i(a.maxHeight) ? a.maxHeight : 1 / 0
                }, (this._aspectRatio || t) && (e = r.minHeight * this.aspectRatio, s = r.minWidth / this.aspectRatio, n = r.maxHeight * this.aspectRatio, o = r.maxWidth / this.aspectRatio, e > r.minWidth && (r.minWidth = e), s > r.minHeight && (r.minHeight = s), n < r.maxWidth && (r.maxWidth = n), o < r.maxHeight && (r.maxHeight = o)), this._vBoundaries = r
            },
            _updateCache: function(t) {
                this.options;
                this.offset = this.helper.offset(), i(t.left) && (this.position.left = t.left), i(t.top) && (this.position.top = t.top), i(t.height) && (this.size.height = t.height), i(t.width) && (this.size.width = t.width)
            },
            _updateRatio: function(t) {
                var e = (this.options, this.position),
                    n = this.size,
                    s = this.axis;
                return i(t.height) ? t.width = t.height * this.aspectRatio : i(t.width) && (t.height = t.width / this.aspectRatio), "sw" == s && (t.left = e.left + (n.width - t.width), t.top = null), "nw" == s && (t.top = e.top + (n.height - t.height), t.left = e.left + (n.width - t.width)), t
            },
            _respectSize: function(t, e) {
                var n = (this.helper, this._vBoundaries),
                    s = (this._aspectRatio || e.shiftKey, this.axis),
                    o = i(t.width) && n.maxWidth && n.maxWidth < t.width,
                    r = i(t.height) && n.maxHeight && n.maxHeight < t.height,
                    a = i(t.width) && n.minWidth && n.minWidth > t.width,
                    l = i(t.height) && n.minHeight && n.minHeight > t.height;
                a && (t.width = n.minWidth), l && (t.height = n.minHeight), o && (t.width = n.maxWidth), r && (t.height = n.maxHeight);
                var c = this.originalPosition.left + this.originalSize.width,
                    h = this.position.top + this.size.height,
                    u = /sw|nw|w/.test(s),
                    d = /nw|ne|n/.test(s);
                a && u && (t.left = c - n.minWidth), o && u && (t.left = c - n.maxWidth), l && d && (t.top = h - n.minHeight), r && d && (t.top = h - n.maxHeight);
                var p = !t.width && !t.height;
                return p && !t.left && t.top ? t.top = null : p && !t.top && t.left && (t.left = null), t
            },
            _proportionallyResize: function() {
                this.options;
                if (this._proportionallyResizeElements.length)
                    for (var e = this.helper || this.element, i = 0; i < this._proportionallyResizeElements.length; i++) {
                        var n = this._proportionallyResizeElements[i];
                        if (!this.borderDif) {
                            var s = [n.css("borderTopWidth"), n.css("borderRightWidth"), n.css("borderBottomWidth"), n.css("borderLeftWidth")],
                                o = [n.css("paddingTop"), n.css("paddingRight"), n.css("paddingBottom"), n.css("paddingLeft")];
                            this.borderDif = t.map(s, function(t, e) {
                                var i = parseInt(t, 10) || 0,
                                    n = parseInt(o[e], 10) || 0;
                                return i + n
                            })
                        }
                        n.css({
                            height: e.height() - this.borderDif[0] - this.borderDif[2] || 0,
                            width: e.width() - this.borderDif[1] - this.borderDif[3] || 0
                        })
                    }
            },
            _renderProxy: function() {
                var e = this.element,
                    i = this.options;
                if (this.elementOffset = e.offset(), this._helper) {
                    this.helper = this.helper || t('<div style="overflow:hidden;"></div>');
                    var n = t.ui.ie6 ? 1 : 0,
                        s = t.ui.ie6 ? 2 : -1;
                    this.helper.addClass(this._helper).css({
                        width: this.element.outerWidth() + s,
                        height: this.element.outerHeight() + s,
                        position: "absolute",
                        left: this.elementOffset.left - n + "px",
                        top: this.elementOffset.top - n + "px",
                        zIndex: ++i.zIndex
                    }), this.helper.appendTo("body").disableSelection()
                } else this.helper = this.element
            },
            _change: {
                e: function(t, e) {
                    return {
                        width: this.originalSize.width + e
                    }
                },
                w: function(t, e) {
                    var i = (this.options, this.originalSize),
                        n = this.originalPosition;
                    return {
                        left: n.left + e,
                        width: i.width - e
                    }
                },
                n: function(t, e, i) {
                    var n = (this.options, this.originalSize),
                        s = this.originalPosition;
                    return {
                        top: s.top + i,
                        height: n.height - i
                    }
                },
                s: function(t, e, i) {
                    return {
                        height: this.originalSize.height + i
                    }
                },
                se: function(e, i, n) {
                    return t.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [e, i, n]))
                },
                sw: function(e, i, n) {
                    return t.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [e, i, n]))
                },
                ne: function(e, i, n) {
                    return t.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [e, i, n]))
                },
                nw: function(e, i, n) {
                    return t.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [e, i, n]))
                }
            },
            _propagate: function(e, i) {
                t.ui.plugin.call(this, e, [i, this.ui()]), "resize" != e && this._trigger(e, i, this.ui())
            },
            plugins: {},
            ui: function() {
                return {
                    originalElement: this.originalElement,
                    element: this.element,
                    helper: this.helper,
                    position: this.position,
                    size: this.size,
                    originalSize: this.originalSize,
                    originalPosition: this.originalPosition
                }
            }
        }), t.ui.plugin.add("resizable", "alsoResize", {
            start: function() {
                var e = t(this).data("resizable"),
                    i = e.options,
                    n = function(e) {
                        t(e).each(function() {
                            var e = t(this);
                            e.data("resizable-alsoresize", {
                                width: parseInt(e.width(), 10),
                                height: parseInt(e.height(), 10),
                                left: parseInt(e.css("left"), 10),
                                top: parseInt(e.css("top"), 10)
                            })
                        })
                    };
                "object" != typeof i.alsoResize || i.alsoResize.parentNode ? n(i.alsoResize) : i.alsoResize.length ? (i.alsoResize = i.alsoResize[0], n(i.alsoResize)) : t.each(i.alsoResize, function(t) {
                    n(t)
                })
            },
            resize: function(e, i) {
                var n = t(this).data("resizable"),
                    s = n.options,
                    o = n.originalSize,
                    r = n.originalPosition,
                    a = {
                        height: n.size.height - o.height || 0,
                        width: n.size.width - o.width || 0,
                        top: n.position.top - r.top || 0,
                        left: n.position.left - r.left || 0
                    },
                    l = function(e, n) {
                        t(e).each(function() {
                            var e = t(this),
                                s = t(this).data("resizable-alsoresize"),
                                o = {},
                                r = n && n.length ? n : e.parents(i.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                            t.each(r, function(t, e) {
                                var i = (s[e] || 0) + (a[e] || 0);
                                i && i >= 0 && (o[e] = i || null)
                            }), e.css(o)
                        })
                    };
                "object" != typeof s.alsoResize || s.alsoResize.nodeType ? l(s.alsoResize) : t.each(s.alsoResize, function(t, e) {
                    l(t, e)
                })
            },
            stop: function() {
                t(this).removeData("resizable-alsoresize")
            }
        }), t.ui.plugin.add("resizable", "animate", {
            stop: function(e) {
                var i = t(this).data("resizable"),
                    n = i.options,
                    s = i._proportionallyResizeElements,
                    o = s.length && /textarea/i.test(s[0].nodeName),
                    r = o && t.ui.hasScroll(s[0], "left") ? 0 : i.sizeDiff.height,
                    a = o ? 0 : i.sizeDiff.width,
                    l = {
                        width: i.size.width - a,
                        height: i.size.height - r
                    },
                    c = parseInt(i.element.css("left"), 10) + (i.position.left - i.originalPosition.left) || null,
                    h = parseInt(i.element.css("top"), 10) + (i.position.top - i.originalPosition.top) || null;
                i.element.animate(t.extend(l, h && c ? {
                    top: h,
                    left: c
                } : {}), {
                    duration: n.animateDuration,
                    easing: n.animateEasing,
                    step: function() {
                        var n = {
                            width: parseInt(i.element.css("width"), 10),
                            height: parseInt(i.element.css("height"), 10),
                            top: parseInt(i.element.css("top"), 10),
                            left: parseInt(i.element.css("left"), 10)
                        };
                        s && s.length && t(s[0]).css({
                            width: n.width,
                            height: n.height
                        }), i._updateCache(n), i._propagate("resize", e)
                    }
                })
            }
        }), t.ui.plugin.add("resizable", "containment", {
            start: function() {
                var i = t(this).data("resizable"),
                    n = i.options,
                    s = i.element,
                    o = n.containment,
                    r = o instanceof t ? o.get(0) : /parent/.test(o) ? s.parent().get(0) : o;
                if (r)
                    if (i.containerElement = t(r), /document/.test(o) || o == document) i.containerOffset = {
                        left: 0,
                        top: 0
                    }, i.containerPosition = {
                        left: 0,
                        top: 0
                    }, i.parentData = {
                        element: t(document),
                        left: 0,
                        top: 0,
                        width: t(document).width(),
                        height: t(document).height() || document.body.parentNode.scrollHeight
                    };
                    else {
                        var a = t(r),
                            l = [];
                        t(["Top", "Right", "Left", "Bottom"]).each(function(t, i) {
                            l[t] = e(a.css("padding" + i))
                        }), i.containerOffset = a.offset(), i.containerPosition = a.position(), i.containerSize = {
                            height: a.innerHeight() - l[3],
                            width: a.innerWidth() - l[1]
                        };
                        var c = i.containerOffset,
                            h = i.containerSize.height,
                            u = i.containerSize.width,
                            d = t.ui.hasScroll(r, "left") ? r.scrollWidth : u,
                            p = t.ui.hasScroll(r) ? r.scrollHeight : h;
                        i.parentData = {
                            element: r,
                            left: c.left,
                            top: c.top,
                            width: d,
                            height: p
                        }
                    }
            },
            resize: function(e) {
                var i = t(this).data("resizable"),
                    n = i.options,
                    s = (i.containerSize, i.containerOffset),
                    o = (i.size, i.position),
                    r = i._aspectRatio || e.shiftKey,
                    a = {
                        top: 0,
                        left: 0
                    },
                    l = i.containerElement;
                l[0] != document && /static/.test(l.css("position")) && (a = s), o.left < (i._helper ? s.left : 0) && (i.size.width = i.size.width + (i._helper ? i.position.left - s.left : i.position.left - a.left), r && (i.size.height = i.size.width / i.aspectRatio), i.position.left = n.helper ? s.left : 0), o.top < (i._helper ? s.top : 0) && (i.size.height = i.size.height + (i._helper ? i.position.top - s.top : i.position.top), r && (i.size.width = i.size.height * i.aspectRatio), i.position.top = i._helper ? s.top : 0), i.offset.left = i.parentData.left + i.position.left, i.offset.top = i.parentData.top + i.position.top;
                var c = Math.abs((i._helper ? i.offset.left - a.left : i.offset.left - a.left) + i.sizeDiff.width),
                    h = Math.abs((i._helper ? i.offset.top - a.top : i.offset.top - s.top) + i.sizeDiff.height),
                    u = i.containerElement.get(0) == i.element.parent().get(0),
                    d = /relative|absolute/.test(i.containerElement.css("position"));
                u && d && (c -= i.parentData.left), c + i.size.width >= i.parentData.width && (i.size.width = i.parentData.width - c, r && (i.size.height = i.size.width / i.aspectRatio)), h + i.size.height >= i.parentData.height && (i.size.height = i.parentData.height - h, r && (i.size.width = i.size.height * i.aspectRatio))
            },
            stop: function() {
                var e = t(this).data("resizable"),
                    i = e.options,
                    n = (e.position, e.containerOffset),
                    s = e.containerPosition,
                    o = e.containerElement,
                    r = t(e.helper),
                    a = r.offset(),
                    l = r.outerWidth() - e.sizeDiff.width,
                    c = r.outerHeight() - e.sizeDiff.height;
                e._helper && !i.animate && /relative/.test(o.css("position")) && t(this).css({
                    left: a.left - s.left - n.left,
                    width: l,
                    height: c
                }), e._helper && !i.animate && /static/.test(o.css("position")) && t(this).css({
                    left: a.left - s.left - n.left,
                    width: l,
                    height: c
                })
            }
        }), t.ui.plugin.add("resizable", "ghost", {
            start: function() {
                var e = t(this).data("resizable"),
                    i = e.options,
                    n = e.size;
                e.ghost = e.originalElement.clone(), e.ghost.css({
                    opacity: .25,
                    display: "block",
                    position: "relative",
                    height: n.height,
                    width: n.width,
                    margin: 0,
                    left: 0,
                    top: 0
                }).addClass("ui-resizable-ghost").addClass("string" == typeof i.ghost ? i.ghost : ""), e.ghost.appendTo(e.helper)
            },
            resize: function() {
                {
                    var e = t(this).data("resizable");
                    e.options
                }
                e.ghost && e.ghost.css({
                    position: "relative",
                    height: e.size.height,
                    width: e.size.width
                })
            },
            stop: function() {
                {
                    var e = t(this).data("resizable");
                    e.options
                }
                e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0))
            }
        }), t.ui.plugin.add("resizable", "grid", {
            resize: function(e) {
                {
                    var i = t(this).data("resizable"),
                        n = i.options,
                        s = i.size,
                        o = i.originalSize,
                        r = i.originalPosition,
                        a = i.axis;
                    n._aspectRatio || e.shiftKey
                }
                n.grid = "number" == typeof n.grid ? [n.grid, n.grid] : n.grid;
                var l = Math.round((s.width - o.width) / (n.grid[0] || 1)) * (n.grid[0] || 1),
                    c = Math.round((s.height - o.height) / (n.grid[1] || 1)) * (n.grid[1] || 1);
                /^(se|s|e)$/.test(a) ? (i.size.width = o.width + l, i.size.height = o.height + c) : /^(ne)$/.test(a) ? (i.size.width = o.width + l, i.size.height = o.height + c, i.position.top = r.top - c) : /^(sw)$/.test(a) ? (i.size.width = o.width + l, i.size.height = o.height + c, i.position.left = r.left - l) : (i.size.width = o.width + l, i.size.height = o.height + c, i.position.top = r.top - c, i.position.left = r.left - l)
            }
        });
        var e = function(t) {
                return parseInt(t, 10) || 0
            },
            i = function(t) {
                return !isNaN(parseInt(t, 10))
            }
    }(jQuery),
    function(t) {
        t.widget("ui.selectable", t.ui.mouse, {
            version: "1.9.1",
            options: {
                appendTo: "body",
                autoRefresh: !0,
                distance: 0,
                filter: "*",
                tolerance: "touch"
            },
            _create: function() {
                var e = this;
                this.element.addClass("ui-selectable"), this.dragged = !1;
                var i;
                this.refresh = function() {
                    i = t(e.options.filter, e.element[0]), i.addClass("ui-selectee"), i.each(function() {
                        var e = t(this),
                            i = e.offset();
                        t.data(this, "selectable-item", {
                            element: this,
                            $element: e,
                            left: i.left,
                            top: i.top,
                            right: i.left + e.outerWidth(),
                            bottom: i.top + e.outerHeight(),
                            startselected: !1,
                            selected: e.hasClass("ui-selected"),
                            selecting: e.hasClass("ui-selecting"),
                            unselecting: e.hasClass("ui-unselecting")
                        })
                    })
                }, this.refresh(), this.selectees = i.addClass("ui-selectee"), this._mouseInit(), this.helper = t("<div class='ui-selectable-helper'></div>")
            },
            _destroy: function() {
                this.selectees.removeClass("ui-selectee").removeData("selectable-item"), this.element.removeClass("ui-selectable ui-selectable-disabled"), this._mouseDestroy()
            },
            _mouseStart: function(e) {
                var i = this;
                if (this.opos = [e.pageX, e.pageY], !this.options.disabled) {
                    var n = this.options;
                    this.selectees = t(n.filter, this.element[0]), this._trigger("start", e), t(n.appendTo).append(this.helper), this.helper.css({
                        left: e.clientX,
                        top: e.clientY,
                        width: 0,
                        height: 0
                    }), n.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function() {
                        var n = t.data(this, "selectable-item");
                        n.startselected = !0, !e.metaKey && !e.ctrlKey && (n.$element.removeClass("ui-selected"), n.selected = !1, n.$element.addClass("ui-unselecting"), n.unselecting = !0, i._trigger("unselecting", e, {
                            unselecting: n.element
                        }))
                    }), t(e.target).parents().andSelf().each(function() {
                        var n = t.data(this, "selectable-item");
                        if (n) {
                            var s = !e.metaKey && !e.ctrlKey || !n.$element.hasClass("ui-selected");
                            return n.$element.removeClass(s ? "ui-unselecting" : "ui-selected").addClass(s ? "ui-selecting" : "ui-unselecting"), n.unselecting = !s, n.selecting = s, n.selected = s, s ? i._trigger("selecting", e, {
                                selecting: n.element
                            }) : i._trigger("unselecting", e, {
                                unselecting: n.element
                            }), !1
                        }
                    })
                }
            },
            _mouseDrag: function(e) {
                var i = this;
                if (this.dragged = !0, !this.options.disabled) {
                    var n = this.options,
                        s = this.opos[0],
                        o = this.opos[1],
                        r = e.pageX,
                        a = e.pageY;
                    if (s > r) {
                        var l = r;
                        r = s, s = l
                    }
                    if (o > a) {
                        var l = a;
                        a = o, o = l
                    }
                    return this.helper.css({
                        left: s,
                        top: o,
                        width: r - s,
                        height: a - o
                    }), this.selectees.each(function() {
                        var l = t.data(this, "selectable-item");
                        if (l && l.element != i.element[0]) {
                            var c = !1;
                            "touch" == n.tolerance ? c = !(l.left > r || l.right < s || l.top > a || l.bottom < o) : "fit" == n.tolerance && (c = l.left > s && l.right < r && l.top > o && l.bottom < a), c ? (l.selected && (l.$element.removeClass("ui-selected"), l.selected = !1), l.unselecting && (l.$element.removeClass("ui-unselecting"), l.unselecting = !1), l.selecting || (l.$element.addClass("ui-selecting"), l.selecting = !0, i._trigger("selecting", e, {
                                selecting: l.element
                            }))) : (l.selecting && ((e.metaKey || e.ctrlKey) && l.startselected ? (l.$element.removeClass("ui-selecting"), l.selecting = !1, l.$element.addClass("ui-selected"), l.selected = !0) : (l.$element.removeClass("ui-selecting"), l.selecting = !1, l.startselected && (l.$element.addClass("ui-unselecting"), l.unselecting = !0), i._trigger("unselecting", e, {
                                unselecting: l.element
                            }))), l.selected && !e.metaKey && !e.ctrlKey && !l.startselected && (l.$element.removeClass("ui-selected"), l.selected = !1, l.$element.addClass("ui-unselecting"), l.unselecting = !0, i._trigger("unselecting", e, {
                                unselecting: l.element
                            })))
                        }
                    }), !1
                }
            },
            _mouseStop: function(e) {
                var i = this;
                this.dragged = !1;
                this.options;
                return t(".ui-unselecting", this.element[0]).each(function() {
                    var n = t.data(this, "selectable-item");
                    n.$element.removeClass("ui-unselecting"), n.unselecting = !1, n.startselected = !1, i._trigger("unselected", e, {
                        unselected: n.element
                    })
                }), t(".ui-selecting", this.element[0]).each(function() {
                    var n = t.data(this, "selectable-item");
                    n.$element.removeClass("ui-selecting").addClass("ui-selected"), n.selecting = !1, n.selected = !0, n.startselected = !0, i._trigger("selected", e, {
                        selected: n.element
                    })
                }), this._trigger("stop", e), this.helper.remove(), !1
            }
        })
    }(jQuery),
    function(t) {
        t.widget("ui.sortable", t.ui.mouse, {
            version: "1.9.1",
            widgetEventPrefix: "sort",
            ready: !1,
            options: {
                appendTo: "parent",
                axis: !1,
                connectWith: !1,
                containment: !1,
                cursor: "auto",
                cursorAt: !1,
                dropOnEmpty: !0,
                forcePlaceholderSize: !1,
                forceHelperSize: !1,
                grid: !1,
                handle: !1,
                helper: "original",
                items: "> *",
                opacity: !1,
                placeholder: !1,
                revert: !1,
                scroll: !0,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                scope: "default",
                tolerance: "intersect",
                zIndex: 1e3
            },
            _create: function() {
                var t = this.options;
                this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? "x" === t.axis || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0
            },
            _destroy: function() {
                this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy();
                for (var t = this.items.length - 1; t >= 0; t--) this.items[t].item.removeData(this.widgetName + "-item");
                return this
            },
            _setOption: function(e, i) {
                "disabled" === e ? (this.options[e] = i, this.widget().toggleClass("ui-sortable-disabled", !!i)) : t.Widget.prototype._setOption.apply(this, arguments)
            },
            _mouseCapture: function(e, i) {
                var n = this;
                if (this.reverting) return !1;
                if (this.options.disabled || "static" == this.options.type) return !1;
                this._refreshItems(e); {
                    var s = null;
                    t(e.target).parents().each(function() {
                        return t.data(this, n.widgetName + "-item") == n ? (s = t(this), !1) : void 0
                    })
                }
                if (t.data(e.target, n.widgetName + "-item") == n && (s = t(e.target)), !s) return !1;
                if (this.options.handle && !i) {
                    var o = !1;
                    if (t(this.options.handle, s).find("*").andSelf().each(function() {
                            this == e.target && (o = !0)
                        }), !o) return !1
                }
                return this.currentItem = s, this._removeCurrentsFromItems(), !0
            },
            _mouseStart: function(e, i, n) {
                var s = this.options;
                if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(e), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                        top: this.offset.top - this.margins.top,
                        left: this.offset.left - this.margins.left
                    }, t.extend(this.offset, {
                        click: {
                            left: e.pageX - this.offset.left,
                            top: e.pageY - this.offset.top
                        },
                        parent: this._getParentOffset(),
                        relative: this._getRelativeOffset()
                    }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(e), this.originalPageX = e.pageX, this.originalPageY = e.pageY, s.cursorAt && this._adjustOffsetFromHelper(s.cursorAt), this.domPosition = {
                        prev: this.currentItem.prev()[0],
                        parent: this.currentItem.parent()[0]
                    }, this.helper[0] != this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), s.containment && this._setContainment(), s.cursor && (t("body").css("cursor") && (this._storedCursor = t("body").css("cursor")), t("body").css("cursor", s.cursor)), s.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", s.opacity)), s.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", s.zIndex)), this.scrollParent[0] != document && "HTML" != this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", e, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !n)
                    for (var o = this.containers.length - 1; o >= 0; o--) this.containers[o]._trigger("activate", e, this._uiHash(this));
                return t.ui.ddmanager && (t.ui.ddmanager.current = this), t.ui.ddmanager && !s.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(e), !0
            },
            _mouseDrag: function(e) {
                if (this.position = this._generatePosition(e), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll) {
                    var i = this.options,
                        n = !1;
                    this.scrollParent[0] != document && "HTML" != this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - e.pageY < i.scrollSensitivity ? this.scrollParent[0].scrollTop = n = this.scrollParent[0].scrollTop + i.scrollSpeed : e.pageY - this.overflowOffset.top < i.scrollSensitivity && (this.scrollParent[0].scrollTop = n = this.scrollParent[0].scrollTop - i.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - e.pageX < i.scrollSensitivity ? this.scrollParent[0].scrollLeft = n = this.scrollParent[0].scrollLeft + i.scrollSpeed : e.pageX - this.overflowOffset.left < i.scrollSensitivity && (this.scrollParent[0].scrollLeft = n = this.scrollParent[0].scrollLeft - i.scrollSpeed)) : (e.pageY - t(document).scrollTop() < i.scrollSensitivity ? n = t(document).scrollTop(t(document).scrollTop() - i.scrollSpeed) : t(window).height() - (e.pageY - t(document).scrollTop()) < i.scrollSensitivity && (n = t(document).scrollTop(t(document).scrollTop() + i.scrollSpeed)), e.pageX - t(document).scrollLeft() < i.scrollSensitivity ? n = t(document).scrollLeft(t(document).scrollLeft() - i.scrollSpeed) : t(window).width() - (e.pageX - t(document).scrollLeft()) < i.scrollSensitivity && (n = t(document).scrollLeft(t(document).scrollLeft() + i.scrollSpeed))), n !== !1 && t.ui.ddmanager && !i.dropBehaviour && t.ui.ddmanager.prepareOffsets(this, e)
                }
                this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" == this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" == this.options.axis || (this.helper[0].style.top = this.position.top + "px");
                for (var s = this.items.length - 1; s >= 0; s--) {
                    var o = this.items[s],
                        r = o.item[0],
                        a = this._intersectsWithPointer(o);
                    if (a && o.instance === this.currentContainer && r != this.currentItem[0] && this.placeholder[1 == a ? "next" : "prev"]()[0] != r && !t.contains(this.placeholder[0], r) && ("semi-dynamic" == this.options.type ? !t.contains(this.element[0], r) : !0)) {
                        if (this.direction = 1 == a ? "down" : "up", "pointer" != this.options.tolerance && !this._intersectsWithSides(o)) break;
                        this._rearrange(e, o), this._trigger("change", e, this._uiHash());
                        break
                    }
                }
                return this._contactContainers(e), t.ui.ddmanager && t.ui.ddmanager.drag(this, e), this._trigger("sort", e, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
            },
            _mouseStop: function(e, i) {
                if (e) {
                    if (t.ui.ddmanager && !this.options.dropBehaviour && t.ui.ddmanager.drop(this, e), this.options.revert) {
                        var n = this,
                            s = this.placeholder.offset();
                        this.reverting = !0, t(this.helper).animate({
                            left: s.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
                            top: s.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
                        }, parseInt(this.options.revert, 10) || 500, function() {
                            n._clear(e)
                        })
                    } else this._clear(e, i);
                    return !1
                }
            },
            cancel: function() {
                if (this.dragging) {
                    this._mouseUp({
                        target: null
                    }), "original" == this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                    for (var e = this.containers.length - 1; e >= 0; e--) this.containers[e]._trigger("deactivate", null, this._uiHash(this)), this.containers[e].containerCache.over && (this.containers[e]._trigger("out", null, this._uiHash(this)), this.containers[e].containerCache.over = 0)
                }
                return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" != this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), t.extend(this, {
                    helper: null,
                    dragging: !1,
                    reverting: !1,
                    _noFinalSort: null
                }), this.domPosition.prev ? t(this.domPosition.prev).after(this.currentItem) : t(this.domPosition.parent).prepend(this.currentItem)), this
            },
            serialize: function(e) {
                var i = this._getItemsAsjQuery(e && e.connected),
                    n = [];
                return e = e || {}, t(i).each(function() {
                    var i = (t(e.item || this).attr(e.attribute || "id") || "").match(e.expression || /(.+)[-=_](.+)/);
                    i && n.push((e.key || i[1] + "[]") + "=" + (e.key && e.expression ? i[1] : i[2]))
                }), !n.length && e.key && n.push(e.key + "="), n.join("&")
            },
            toArray: function(e) {
                var i = this._getItemsAsjQuery(e && e.connected),
                    n = [];
                return e = e || {}, i.each(function() {
                    n.push(t(e.item || this).attr(e.attribute || "id") || "")
                }), n
            },
            _intersectsWith: function(t) {
                var e = this.positionAbs.left,
                    i = e + this.helperProportions.width,
                    n = this.positionAbs.top,
                    s = n + this.helperProportions.height,
                    o = t.left,
                    r = o + t.width,
                    a = t.top,
                    l = a + t.height,
                    c = this.offset.click.top,
                    h = this.offset.click.left,
                    u = n + c > a && l > n + c && e + h > o && r > e + h;
                return "pointer" == this.options.tolerance || this.options.forcePointerForContainers || "pointer" != this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > t[this.floating ? "width" : "height"] ? u : o < e + this.helperProportions.width / 2 && i - this.helperProportions.width / 2 < r && a < n + this.helperProportions.height / 2 && s - this.helperProportions.height / 2 < l
            },
            _intersectsWithPointer: function(e) {
                var i = "x" === this.options.axis || t.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, e.top, e.height),
                    n = "y" === this.options.axis || t.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, e.left, e.width),
                    s = i && n,
                    o = this._getDragVerticalDirection(),
                    r = this._getDragHorizontalDirection();
                return s ? this.floating ? r && "right" == r || "down" == o ? 2 : 1 : o && ("down" == o ? 2 : 1) : !1
            },
            _intersectsWithSides: function(e) {
                var i = t.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height),
                    n = t.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width),
                    s = this._getDragVerticalDirection(),
                    o = this._getDragHorizontalDirection();
                return this.floating && o ? "right" == o && n || "left" == o && !n : s && ("down" == s && i || "up" == s && !i)
            },
            _getDragVerticalDirection: function() {
                var t = this.positionAbs.top - this.lastPositionAbs.top;
                return 0 != t && (t > 0 ? "down" : "up")
            },
            _getDragHorizontalDirection: function() {
                var t = this.positionAbs.left - this.lastPositionAbs.left;
                return 0 != t && (t > 0 ? "right" : "left")
            },
            refresh: function(t) {
                return this._refreshItems(t), this.refreshPositions(), this
            },
            _connectWith: function() {
                var t = this.options;
                return t.connectWith.constructor == String ? [t.connectWith] : t.connectWith
            },
            _getItemsAsjQuery: function(e) {
                var i = [],
                    n = [],
                    s = this._connectWith();
                if (s && e)
                    for (var o = s.length - 1; o >= 0; o--)
                        for (var r = t(s[o]), a = r.length - 1; a >= 0; a--) {
                            var l = t.data(r[a], this.widgetName);
                            l && l != this && !l.options.disabled && n.push([t.isFunction(l.options.items) ? l.options.items.call(l.element) : t(l.options.items, l.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), l])
                        }
                n.push([t.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                    options: this.options,
                    item: this.currentItem
                }) : t(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
                for (var o = n.length - 1; o >= 0; o--) n[o][0].each(function() {
                    i.push(this)
                });
                return t(i)
            },
            _removeCurrentsFromItems: function() {
                var e = this.currentItem.find(":data(" + this.widgetName + "-item)");
                this.items = t.grep(this.items, function(t) {
                    for (var i = 0; i < e.length; i++)
                        if (e[i] == t.item[0]) return !1;
                    return !0
                })
            },
            _refreshItems: function(e) {
                this.items = [], this.containers = [this];
                var i = this.items,
                    n = [
                        [t.isFunction(this.options.items) ? this.options.items.call(this.element[0], e, {
                            item: this.currentItem
                        }) : t(this.options.items, this.element), this]
                    ],
                    s = this._connectWith();
                if (s && this.ready)
                    for (var o = s.length - 1; o >= 0; o--)
                        for (var r = t(s[o]), a = r.length - 1; a >= 0; a--) {
                            var l = t.data(r[a], this.widgetName);
                            l && l != this && !l.options.disabled && (n.push([t.isFunction(l.options.items) ? l.options.items.call(l.element[0], e, {
                                item: this.currentItem
                            }) : t(l.options.items, l.element), l]), this.containers.push(l))
                        }
                for (var o = n.length - 1; o >= 0; o--)
                    for (var c = n[o][1], h = n[o][0], a = 0, u = h.length; u > a; a++) {
                        var d = t(h[a]);
                        d.data(this.widgetName + "-item", c), i.push({
                            item: d,
                            instance: c,
                            width: 0,
                            height: 0,
                            left: 0,
                            top: 0
                        })
                    }
            },
            refreshPositions: function(e) {
                this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
                for (var i = this.items.length - 1; i >= 0; i--) {
                    var n = this.items[i];
                    if (n.instance == this.currentContainer || !this.currentContainer || n.item[0] == this.currentItem[0]) {
                        var s = this.options.toleranceElement ? t(this.options.toleranceElement, n.item) : n.item;
                        e || (n.width = s.outerWidth(), n.height = s.outerHeight());
                        var o = s.offset();
                        n.left = o.left, n.top = o.top
                    }
                }
                if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this);
                else
                    for (var i = this.containers.length - 1; i >= 0; i--) {
                        var o = this.containers[i].element.offset();
                        this.containers[i].containerCache.left = o.left, this.containers[i].containerCache.top = o.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight()
                    }
                return this
            },
            _createPlaceholder: function(e) {
                e = e || this;
                var i = e.options;
                if (!i.placeholder || i.placeholder.constructor == String) {
                    var n = i.placeholder;
                    i.placeholder = {
                        element: function() {
                            var i = t(document.createElement(e.currentItem[0].nodeName)).addClass(n || e.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                            return n || (i.style.visibility = "hidden"), i
                        },
                        update: function(t, s) {
                            (!n || i.forcePlaceholderSize) && (s.height() || s.height(e.currentItem.innerHeight() - parseInt(e.currentItem.css("paddingTop") || 0, 10) - parseInt(e.currentItem.css("paddingBottom") || 0, 10)), s.width() || s.width(e.currentItem.innerWidth() - parseInt(e.currentItem.css("paddingLeft") || 0, 10) - parseInt(e.currentItem.css("paddingRight") || 0, 10)))
                        }
                    }
                }
                e.placeholder = t(i.placeholder.element.call(e.element, e.currentItem)), e.currentItem.after(e.placeholder), i.placeholder.update(e, e.placeholder)
            },
            _contactContainers: function(e) {
                for (var i = null, n = null, s = this.containers.length - 1; s >= 0; s--)
                    if (!t.contains(this.currentItem[0], this.containers[s].element[0]))
                        if (this._intersectsWith(this.containers[s].containerCache)) {
                            if (i && t.contains(this.containers[s].element[0], i.element[0])) continue;
                            i = this.containers[s], n = s
                        } else this.containers[s].containerCache.over && (this.containers[s]._trigger("out", e, this._uiHash(this)), this.containers[s].containerCache.over = 0);
                if (i)
                    if (1 === this.containers.length) this.containers[n]._trigger("over", e, this._uiHash(this)), this.containers[n].containerCache.over = 1;
                    else {
                        for (var o = 1e4, r = null, a = this.containers[n].floating ? "left" : "top", l = this.containers[n].floating ? "width" : "height", c = this.positionAbs[a] + this.offset.click[a], h = this.items.length - 1; h >= 0; h--)
                            if (t.contains(this.containers[n].element[0], this.items[h].item[0]) && this.items[h].item[0] != this.currentItem[0]) {
                                var u = this.items[h].item.offset()[a],
                                    d = !1;
                                Math.abs(u - c) > Math.abs(u + this.items[h][l] - c) && (d = !0, u += this.items[h][l]), Math.abs(u - c) < o && (o = Math.abs(u - c), r = this.items[h], this.direction = d ? "up" : "down")
                            }
                        if (!r && !this.options.dropOnEmpty) return;
                        this.currentContainer = this.containers[n], r ? this._rearrange(e, r, null, !0) : this._rearrange(e, null, this.containers[n].element, !0), this._trigger("change", e, this._uiHash()), this.containers[n]._trigger("change", e, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[n]._trigger("over", e, this._uiHash(this)), this.containers[n].containerCache.over = 1
                    }
            },
            _createHelper: function(e) {
                var i = this.options,
                    n = t.isFunction(i.helper) ? t(i.helper.apply(this.element[0], [e, this.currentItem])) : "clone" == i.helper ? this.currentItem.clone() : this.currentItem;
                return n.parents("body").length || t("parent" != i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(n[0]), n[0] == this.currentItem[0] && (this._storedCSS = {
                    width: this.currentItem[0].style.width,
                    height: this.currentItem[0].style.height,
                    position: this.currentItem.css("position"),
                    top: this.currentItem.css("top"),
                    left: this.currentItem.css("left")
                }), ("" == n[0].style.width || i.forceHelperSize) && n.width(this.currentItem.width()), ("" == n[0].style.height || i.forceHelperSize) && n.height(this.currentItem.height()), n
            },
            _adjustOffsetFromHelper: function(e) {
                "string" == typeof e && (e = e.split(" ")), t.isArray(e) && (e = {
                    left: +e[0],
                    top: +e[1] || 0
                }), "left" in e && (this.offset.click.left = e.left + this.margins.left), "right" in e && (this.offset.click.left = this.helperProportions.width - e.right + this.margins.left), "top" in e && (this.offset.click.top = e.top + this.margins.top), "bottom" in e && (this.offset.click.top = this.helperProportions.height - e.bottom + this.margins.top)
            },
            _getParentOffset: function() {
                this.offsetParent = this.helper.offsetParent();
                var e = this.offsetParent.offset();
                return "absolute" == this.cssPosition && this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) && (e.left += this.scrollParent.scrollLeft(), e.top += this.scrollParent.scrollTop()), (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && "html" == this.offsetParent[0].tagName.toLowerCase() && t.ui.ie) && (e = {
                    top: 0,
                    left: 0
                }), {
                    top: e.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: e.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
            },
            _getRelativeOffset: function() {
                if ("relative" == this.cssPosition) {
                    var t = this.currentItem.position();
                    return {
                        top: t.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                        left: t.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                    }
                }
                return {
                    top: 0,
                    left: 0
                }
            },
            _cacheMargins: function() {
                this.margins = {
                    left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                    top: parseInt(this.currentItem.css("marginTop"), 10) || 0
                }
            },
            _cacheHelperProportions: function() {
                this.helperProportions = {
                    width: this.helper.outerWidth(),
                    height: this.helper.outerHeight()
                }
            },
            _setContainment: function() {
                var e = this.options;
                if ("parent" == e.containment && (e.containment = this.helper[0].parentNode), ("document" == e.containment || "window" == e.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, t("document" == e.containment ? document : window).width() - this.helperProportions.width - this.margins.left, (t("document" == e.containment ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]), !/^(document|window|parent)$/.test(e.containment)) {
                    var i = t(e.containment)[0],
                        n = t(e.containment).offset(),
                        s = "hidden" != t(i).css("overflow");
                    this.containment = [n.left + (parseInt(t(i).css("borderLeftWidth"), 10) || 0) + (parseInt(t(i).css("paddingLeft"), 10) || 0) - this.margins.left, n.top + (parseInt(t(i).css("borderTopWidth"), 10) || 0) + (parseInt(t(i).css("paddingTop"), 10) || 0) - this.margins.top, n.left + (s ? Math.max(i.scrollWidth, i.offsetWidth) : i.offsetWidth) - (parseInt(t(i).css("borderLeftWidth"), 10) || 0) - (parseInt(t(i).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, n.top + (s ? Math.max(i.scrollHeight, i.offsetHeight) : i.offsetHeight) - (parseInt(t(i).css("borderTopWidth"), 10) || 0) - (parseInt(t(i).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
                }
            },
            _convertPositionTo: function(e, i) {
                i || (i = this.position);
                var n = "absolute" == e ? 1 : -1,
                    s = (this.options, "absolute" != this.cssPosition || this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent),
                    o = /(html|body)/i.test(s[0].tagName);
                return {
                    top: i.top + this.offset.relative.top * n + this.offset.parent.top * n - ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * n,
                    left: i.left + this.offset.relative.left * n + this.offset.parent.left * n - ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * n
                }
            },
            _generatePosition: function(e) {
                var i = this.options,
                    n = "absolute" != this.cssPosition || this.scrollParent[0] != document && t.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                    s = /(html|body)/i.test(n[0].tagName);
                "relative" == this.cssPosition && (this.scrollParent[0] == document || this.scrollParent[0] == this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset());
                var o = e.pageX,
                    r = e.pageY;
                if (this.originalPosition && (this.containment && (e.pageX - this.offset.click.left < this.containment[0] && (o = this.containment[0] + this.offset.click.left), e.pageY - this.offset.click.top < this.containment[1] && (r = this.containment[1] + this.offset.click.top), e.pageX - this.offset.click.left > this.containment[2] && (o = this.containment[2] + this.offset.click.left), e.pageY - this.offset.click.top > this.containment[3] && (r = this.containment[3] + this.offset.click.top)), i.grid)) {
                    var a = this.originalPageY + Math.round((r - this.originalPageY) / i.grid[1]) * i.grid[1];
                    r = this.containment && (a - this.offset.click.top < this.containment[1] || a - this.offset.click.top > this.containment[3]) ? a - this.offset.click.top < this.containment[1] ? a + i.grid[1] : a - i.grid[1] : a;
                    var l = this.originalPageX + Math.round((o - this.originalPageX) / i.grid[0]) * i.grid[0];
                    o = this.containment && (l - this.offset.click.left < this.containment[0] || l - this.offset.click.left > this.containment[2]) ? l - this.offset.click.left < this.containment[0] ? l + i.grid[0] : l - i.grid[0] : l
                }
                return {
                    top: r - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" == this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : n.scrollTop()),
                    left: o - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" == this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : n.scrollLeft())
                }
            },
            _rearrange: function(t, e, i, n) {
                i ? i[0].appendChild(this.placeholder[0]) : e.item[0].parentNode.insertBefore(this.placeholder[0], "down" == this.direction ? e.item[0] : e.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
                var s = this.counter;
                this._delay(function() {
                    s == this.counter && this.refreshPositions(!n)
                })
            },
            _clear: function(e, i) {
                this.reverting = !1;
                var n = [];
                if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] == this.currentItem[0]) {
                    for (var s in this._storedCSS)("auto" == this._storedCSS[s] || "static" == this._storedCSS[s]) && (this._storedCSS[s] = "");
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
                } else this.currentItem.show();
                this.fromOutside && !i && n.push(function(t) {
                    this._trigger("receive", t, this._uiHash(this.fromOutside))
                }), (this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !i && n.push(function(t) {
                    this._trigger("update", t, this._uiHash())
                }), this !== this.currentContainer && (i || (n.push(function(t) {
                    this._trigger("remove", t, this._uiHash())
                }), n.push(function(t) {
                    return function(e) {
                        t._trigger("receive", e, this._uiHash(this))
                    }
                }.call(this, this.currentContainer)), n.push(function(t) {
                    return function(e) {
                        t._trigger("update", e, this._uiHash(this))
                    }
                }.call(this, this.currentContainer))));
                for (var s = this.containers.length - 1; s >= 0; s--) i || n.push(function(t) {
                    return function(e) {
                        t._trigger("deactivate", e, this._uiHash(this))
                    }
                }.call(this, this.containers[s])), this.containers[s].containerCache.over && (n.push(function(t) {
                    return function(e) {
                        t._trigger("out", e, this._uiHash(this))
                    }
                }.call(this, this.containers[s])), this.containers[s].containerCache.over = 0);
                if (this._storedCursor && t("body").css("cursor", this._storedCursor), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" == this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, this.cancelHelperRemoval) {
                    if (!i) {
                        this._trigger("beforeStop", e, this._uiHash());
                        for (var s = 0; s < n.length; s++) n[s].call(this, e);
                        this._trigger("stop", e, this._uiHash())
                    }
                    return this.fromOutside = !1, !1
                }
                if (i || this._trigger("beforeStop", e, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] != this.currentItem[0] && this.helper.remove(), this.helper = null, !i) {
                    for (var s = 0; s < n.length; s++) n[s].call(this, e);
                    this._trigger("stop", e, this._uiHash())
                }
                return this.fromOutside = !1, !0
            },
            _trigger: function() {
                t.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
            },
            _uiHash: function(e) {
                var i = e || this;
                return {
                    helper: i.helper,
                    placeholder: i.placeholder || t([]),
                    position: i.position,
                    originalPosition: i.originalPosition,
                    offset: i.positionAbs,
                    item: i.currentItem,
                    sender: e ? e.element : null
                }
            }
        })
    }(jQuery), jQuery.effects || function(t, e) {
        var i = t.uiBackCompat !== !1,
            n = "ui-effects-";
        t.effects = {
                effect: {}
            },
            function(e, i) {
                function n(t, e, i) {
                    var n = d[e.type] || {};
                    return null == t ? i || !e.def ? null : e.def : (t = n.floor ? ~~t : parseFloat(t), isNaN(t) ? e.def : n.mod ? (t + n.mod) % n.mod : 0 > t ? 0 : n.max < t ? n.max : t)
                }

                function s(t) {
                    var i = h(),
                        n = i._rgba = [];
                    return t = t.toLowerCase(), g(c, function(e, s) {
                        var o, r = s.re.exec(t),
                            a = r && s.parse(r),
                            l = s.space || "rgba";
                        return a ? (o = i[l](a), i[u[l].cache] = o[u[l].cache], n = i._rgba = o._rgba, !1) : void 0
                    }), n.length ? ("0,0,0,0" === n.join() && e.extend(n, r.transparent), i) : r[t]
                }

                function o(t, e, i) {
                    return i = (i + 1) % 1, 1 > 6 * i ? t + (e - t) * i * 6 : 1 > 2 * i ? e : 2 > 3 * i ? t + (e - t) * (2 / 3 - i) * 6 : t
                }
                var r, a = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),
                    l = /^([\-+])=\s*(\d+\.?\d*)/,
                    c = [{
                        re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                        parse: function(t) {
                            return [t[1], t[2], t[3], t[4]]
                        }
                    }, {
                        re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                        parse: function(t) {
                            return [2.55 * t[1], 2.55 * t[2], 2.55 * t[3], t[4]]
                        }
                    }, {
                        re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
                        parse: function(t) {
                            return [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)]
                        }
                    }, {
                        re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
                        parse: function(t) {
                            return [parseInt(t[1] + t[1], 16), parseInt(t[2] + t[2], 16), parseInt(t[3] + t[3], 16)]
                        }
                    }, {
                        re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
                        space: "hsla",
                        parse: function(t) {
                            return [t[1], t[2] / 100, t[3] / 100, t[4]]
                        }
                    }],
                    h = e.Color = function(t, i, n, s) {
                        return new e.Color.fn.parse(t, i, n, s)
                    },
                    u = {
                        rgba: {
                            props: {
                                red: {
                                    idx: 0,
                                    type: "byte"
                                },
                                green: {
                                    idx: 1,
                                    type: "byte"
                                },
                                blue: {
                                    idx: 2,
                                    type: "byte"
                                }
                            }
                        },
                        hsla: {
                            props: {
                                hue: {
                                    idx: 0,
                                    type: "degrees"
                                },
                                saturation: {
                                    idx: 1,
                                    type: "percent"
                                },
                                lightness: {
                                    idx: 2,
                                    type: "percent"
                                }
                            }
                        }
                    },
                    d = {
                        "byte": {
                            floor: !0,
                            max: 255
                        },
                        percent: {
                            max: 1
                        },
                        degrees: {
                            mod: 360,
                            floor: !0
                        }
                    },
                    p = h.support = {},
                    f = e("<p>")[0],
                    g = e.each;
                f.style.cssText = "background-color:rgba(1,1,1,.5)", p.rgba = f.style.backgroundColor.indexOf("rgba") > -1, g(u, function(t, e) {
                    e.cache = "_" + t, e.props.alpha = {
                        idx: 3,
                        type: "percent",
                        def: 1
                    }
                }), h.fn = e.extend(h.prototype, {
                    parse: function(o, a, l, c) {
                        if (o === i) return this._rgba = [null, null, null, null], this;
                        (o.jquery || o.nodeType) && (o = e(o).css(a), a = i);
                        var d = this,
                            p = e.type(o),
                            f = this._rgba = [];
                        return a !== i && (o = [o, a, l, c], p = "array"), "string" === p ? this.parse(s(o) || r._default) : "array" === p ? (g(u.rgba.props, function(t, e) {
                            f[e.idx] = n(o[e.idx], e)
                        }), this) : "object" === p ? (o instanceof h ? g(u, function(t, e) {
                            o[e.cache] && (d[e.cache] = o[e.cache].slice())
                        }) : g(u, function(e, i) {
                            var s = i.cache;
                            g(i.props, function(t, e) {
                                if (!d[s] && i.to) {
                                    if ("alpha" === t || null == o[t]) return;
                                    d[s] = i.to(d._rgba)
                                }
                                d[s][e.idx] = n(o[t], e, !0)
                            }), d[s] && t.inArray(null, d[s].slice(0, 3)) < 0 && (d[s][3] = 1, i.from && (d._rgba = i.from(d[s])))
                        }), this) : void 0
                    },
                    is: function(t) {
                        var e = h(t),
                            i = !0,
                            n = this;
                        return g(u, function(t, s) {
                            var o, r = e[s.cache];
                            return r && (o = n[s.cache] || s.to && s.to(n._rgba) || [], g(s.props, function(t, e) {
                                return null != r[e.idx] ? i = r[e.idx] === o[e.idx] : void 0
                            })), i
                        }), i
                    },
                    _space: function() {
                        var t = [],
                            e = this;
                        return g(u, function(i, n) {
                            e[n.cache] && t.push(i)
                        }), t.pop()
                    },
                    transition: function(t, e) {
                        var i = h(t),
                            s = i._space(),
                            o = u[s],
                            r = 0 === this.alpha() ? h("transparent") : this,
                            a = r[o.cache] || o.to(r._rgba),
                            l = a.slice();
                        return i = i[o.cache], g(o.props, function(t, s) {
                            var o = s.idx,
                                r = a[o],
                                c = i[o],
                                h = d[s.type] || {};
                            null !== c && (null === r ? l[o] = c : (h.mod && (c - r > h.mod / 2 ? r += h.mod : r - c > h.mod / 2 && (r -= h.mod)), l[o] = n((c - r) * e + r, s)))
                        }), this[s](l)
                    },
                    blend: function(t) {
                        if (1 === this._rgba[3]) return this;
                        var i = this._rgba.slice(),
                            n = i.pop(),
                            s = h(t)._rgba;
                        return h(e.map(i, function(t, e) {
                            return (1 - n) * s[e] + n * t
                        }))
                    },
                    toRgbaString: function() {
                        var t = "rgba(",
                            i = e.map(this._rgba, function(t, e) {
                                return null == t ? e > 2 ? 1 : 0 : t
                            });
                        return 1 === i[3] && (i.pop(), t = "rgb("), t + i.join() + ")"
                    },
                    toHslaString: function() {
                        var t = "hsla(",
                            i = e.map(this.hsla(), function(t, e) {
                                return null == t && (t = e > 2 ? 1 : 0), e && 3 > e && (t = Math.round(100 * t) + "%"), t
                            });
                        return 1 === i[3] && (i.pop(), t = "hsl("), t + i.join() + ")"
                    },
                    toHexString: function(t) {
                        var i = this._rgba.slice(),
                            n = i.pop();
                        return t && i.push(~~(255 * n)), "#" + e.map(i, function(t) {
                            return t = (t || 0).toString(16), 1 === t.length ? "0" + t : t
                        }).join("")
                    },
                    toString: function() {
                        return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
                    }
                }), h.fn.parse.prototype = h.fn, u.hsla.to = function(t) {
                    if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                    var e, i, n = t[0] / 255,
                        s = t[1] / 255,
                        o = t[2] / 255,
                        r = t[3],
                        a = Math.max(n, s, o),
                        l = Math.min(n, s, o),
                        c = a - l,
                        h = a + l,
                        u = .5 * h;
                    return e = l === a ? 0 : n === a ? 60 * (s - o) / c + 360 : s === a ? 60 * (o - n) / c + 120 : 60 * (n - s) / c + 240, i = 0 === u || 1 === u ? u : .5 >= u ? c / h : c / (2 - h), [Math.round(e) % 360, i, u, null == r ? 1 : r]
                }, u.hsla.from = function(t) {
                    if (null == t[0] || null == t[1] || null == t[2]) return [null, null, null, t[3]];
                    var e = t[0] / 360,
                        i = t[1],
                        n = t[2],
                        s = t[3],
                        r = .5 >= n ? n * (1 + i) : n + i - n * i,
                        a = 2 * n - r;
                    return [Math.round(255 * o(a, r, e + 1 / 3)), Math.round(255 * o(a, r, e)), Math.round(255 * o(a, r, e - 1 / 3)), s]
                }, g(u, function(t, s) {
                    var o = s.props,
                        r = s.cache,
                        a = s.to,
                        c = s.from;
                    h.fn[t] = function(t) {
                        if (a && !this[r] && (this[r] = a(this._rgba)), t === i) return this[r].slice();
                        var s, l = e.type(t),
                            u = "array" === l || "object" === l ? t : arguments,
                            d = this[r].slice();
                        return g(o, function(t, e) {
                            var i = u["object" === l ? t : e.idx];
                            null == i && (i = d[e.idx]), d[e.idx] = n(i, e)
                        }), c ? (s = h(c(d)), s[r] = d, s) : h(d)
                    }, g(o, function(i, n) {
                        h.fn[i] || (h.fn[i] = function(s) {
                            var o, r = e.type(s),
                                a = "alpha" === i ? this._hsla ? "hsla" : "rgba" : t,
                                c = this[a](),
                                h = c[n.idx];
                            return "undefined" === r ? h : ("function" === r && (s = s.call(this, h), r = e.type(s)), null == s && n.empty ? this : ("string" === r && (o = l.exec(s), o && (s = h + parseFloat(o[2]) * ("+" === o[1] ? 1 : -1))), c[n.idx] = s, this[a](c)))
                        })
                    })
                }), g(a, function(t, i) {
                    e.cssHooks[i] = {
                        set: function(t, n) {
                            var o, r, a = "";
                            if ("string" !== e.type(n) || (o = s(n))) {
                                if (n = h(o || n), !p.rgba && 1 !== n._rgba[3]) {
                                    for (r = "backgroundColor" === i ? t.parentNode : t;
                                        ("" === a || "transparent" === a) && r && r.style;) try {
                                        a = e.css(r, "backgroundColor"), r = r.parentNode
                                    } catch (l) {}
                                    n = n.blend(a && "transparent" !== a ? a : "_default")
                                }
                                n = n.toRgbaString()
                            }
                            try {
                                t.style[i] = n
                            } catch (c) {}
                        }
                    }, e.fx.step[i] = function(t) {
                        t.colorInit || (t.start = h(t.elem, i), t.end = h(t.end), t.colorInit = !0), e.cssHooks[i].set(t.elem, t.start.transition(t.end, t.pos))
                    }
                }), e.cssHooks.borderColor = {
                    expand: function(t) {
                        var e = {};
                        return g(["Top", "Right", "Bottom", "Left"], function(i, n) {
                            e["border" + n + "Color"] = t
                        }), e
                    }
                }, r = e.Color.names = {
                    aqua: "#00ffff",
                    black: "#000000",
                    blue: "#0000ff",
                    fuchsia: "#ff00ff",
                    gray: "#808080",
                    green: "#008000",
                    lime: "#00ff00",
                    maroon: "#800000",
                    navy: "#000080",
                    olive: "#808000",
                    purple: "#800080",
                    red: "#ff0000",
                    silver: "#c0c0c0",
                    teal: "#008080",
                    white: "#ffffff",
                    yellow: "#ffff00",
                    transparent: [null, null, null, 0],
                    _default: "#ffffff"
                }
            }(jQuery),
            function() {
                function i() {
                    var e, i, n = this.ownerDocument.defaultView ? this.ownerDocument.defaultView.getComputedStyle(this, null) : this.currentStyle,
                        s = {};
                    if (n && n.length && n[0] && n[n[0]])
                        for (i = n.length; i--;) e = n[i], "string" == typeof n[e] && (s[t.camelCase(e)] = n[e]);
                    else
                        for (e in n) "string" == typeof n[e] && (s[e] = n[e]);
                    return s
                }

                function n(e, i) {
                    var n, s, r = {};
                    for (n in i) s = i[n], e[n] !== s && !o[n] && (t.fx.step[n] || !isNaN(parseFloat(s))) && (r[n] = s);
                    return r
                }
                var s = ["add", "remove", "toggle"],
                    o = {
                        border: 1,
                        borderBottom: 1,
                        borderColor: 1,
                        borderLeft: 1,
                        borderRight: 1,
                        borderTop: 1,
                        borderWidth: 1,
                        margin: 1,
                        padding: 1
                    };
                t.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(e, i) {
                    t.fx.step[i] = function(t) {
                        ("none" !== t.end && !t.setAttr || 1 === t.pos && !t.setAttr) && (jQuery.style(t.elem, i, t.end), t.setAttr = !0)
                    }
                }), t.effects.animateClass = function(e, o, r, a) {
                    var l = t.speed(o, r, a);
                    return this.queue(function() {
                        var o, r = t(this),
                            a = r.attr("class") || "",
                            c = l.children ? r.find("*").andSelf() : r;
                        c = c.map(function() {
                            var e = t(this);
                            return {
                                el: e,
                                start: i.call(this)
                            }
                        }), o = function() {
                            t.each(s, function(t, i) {
                                e[i] && r[i + "Class"](e[i])
                            })
                        }, o(), c = c.map(function() {
                            return this.end = i.call(this.el[0]), this.diff = n(this.start, this.end), this
                        }), r.attr("class", a), c = c.map(function() {
                            var e = this,
                                i = t.Deferred(),
                                n = jQuery.extend({}, l, {
                                    queue: !1,
                                    complete: function() {
                                        i.resolve(e)
                                    }
                                });
                            return this.el.animate(this.diff, n), i.promise()
                        }), t.when.apply(t, c.get()).done(function() {
                            o(), t.each(arguments, function() {
                                var e = this.el;
                                t.each(this.diff, function(t) {
                                    e.css(t, "")
                                })
                            }), l.complete.call(r[0])
                        })
                    })
                }, t.fn.extend({
                    _addClass: t.fn.addClass,
                    addClass: function(e, i, n, s) {
                        return i ? t.effects.animateClass.call(this, {
                            add: e
                        }, i, n, s) : this._addClass(e)
                    },
                    _removeClass: t.fn.removeClass,
                    removeClass: function(e, i, n, s) {
                        return i ? t.effects.animateClass.call(this, {
                            remove: e
                        }, i, n, s) : this._removeClass(e)
                    },
                    _toggleClass: t.fn.toggleClass,
                    toggleClass: function(i, n, s, o, r) {
                        return "boolean" == typeof n || n === e ? s ? t.effects.animateClass.call(this, n ? {
                            add: i
                        } : {
                            remove: i
                        }, s, o, r) : this._toggleClass(i, n) : t.effects.animateClass.call(this, {
                            toggle: i
                        }, n, s, o)
                    },
                    switchClass: function(e, i, n, s, o) {
                        return t.effects.animateClass.call(this, {
                            add: i,
                            remove: e
                        }, n, s, o)
                    }
                })
            }(),
            function() {
                function s(e, i, n, s) {
                    return t.isPlainObject(e) && (i = e, e = e.effect), e = {
                        effect: e
                    }, null == i && (i = {}), t.isFunction(i) && (s = i, n = null, i = {}), ("number" == typeof i || t.fx.speeds[i]) && (s = n, n = i, i = {}), t.isFunction(n) && (s = n, n = null), i && t.extend(e, i), n = n || i.duration, e.duration = t.fx.off ? 0 : "number" == typeof n ? n : n in t.fx.speeds ? t.fx.speeds[n] : t.fx.speeds._default, e.complete = s || i.complete, e
                }

                function o(e) {
                    return !e || "number" == typeof e || t.fx.speeds[e] ? !0 : "string" != typeof e || t.effects.effect[e] ? !1 : i && t.effects[e] ? !1 : !0
                }
                t.extend(t.effects, {
                    version: "1.9.1",
                    save: function(t, e) {
                        for (var i = 0; i < e.length; i++) null !== e[i] && t.data(n + e[i], t[0].style[e[i]])
                    },
                    restore: function(t, i) {
                        var s, o;
                        for (o = 0; o < i.length; o++) null !== i[o] && (s = t.data(n + i[o]), s === e && (s = ""), t.css(i[o], s))
                    },
                    setMode: function(t, e) {
                        return "toggle" === e && (e = t.is(":hidden") ? "show" : "hide"), e
                    },
                    getBaseline: function(t, e) {
                        var i, n;
                        switch (t[0]) {
                            case "top":
                                i = 0;
                                break;
                            case "middle":
                                i = .5;
                                break;
                            case "bottom":
                                i = 1;
                                break;
                            default:
                                i = t[0] / e.height
                        }
                        switch (t[1]) {
                            case "left":
                                n = 0;
                                break;
                            case "center":
                                n = .5;
                                break;
                            case "right":
                                n = 1;
                                break;
                            default:
                                n = t[1] / e.width
                        }
                        return {
                            x: n,
                            y: i
                        }
                    },
                    createWrapper: function(e) {
                        if (e.parent().is(".ui-effects-wrapper")) return e.parent();
                        var i = {
                                width: e.outerWidth(!0),
                                height: e.outerHeight(!0),
                                "float": e.css("float")
                            },
                            n = t("<div></div>").addClass("ui-effects-wrapper").css({
                                fontSize: "100%",
                                background: "transparent",
                                border: "none",
                                margin: 0,
                                padding: 0
                            }),
                            s = {
                                width: e.width(),
                                height: e.height()
                            },
                            o = document.activeElement;
                        try {
                            o.id
                        } catch (r) {
                            o = document.body
                        }
                        return e.wrap(n), (e[0] === o || t.contains(e[0], o)) && t(o).focus(), n = e.parent(), "static" === e.css("position") ? (n.css({
                            position: "relative"
                        }), e.css({
                            position: "relative"
                        })) : (t.extend(i, {
                            position: e.css("position"),
                            zIndex: e.css("z-index")
                        }), t.each(["top", "left", "bottom", "right"], function(t, n) {
                            i[n] = e.css(n), isNaN(parseInt(i[n], 10)) && (i[n] = "auto")
                        }), e.css({
                            position: "relative",
                            top: 0,
                            left: 0,
                            right: "auto",
                            bottom: "auto"
                        })), e.css(s), n.css(i).show()
                    },
                    removeWrapper: function(e) {
                        var i = document.activeElement;
                        return e.parent().is(".ui-effects-wrapper") && (e.parent().replaceWith(e), (e[0] === i || t.contains(e[0], i)) && t(i).focus()), e
                    },
                    setTransition: function(e, i, n, s) {
                        return s = s || {}, t.each(i, function(t, i) {
                            var o = e.cssUnit(i);
                            o[0] > 0 && (s[i] = o[0] * n + o[1])
                        }), s
                    }
                }), t.fn.extend({
                    effect: function() {
                        function e(e) {
                            function i() {
                                t.isFunction(o) && o.call(s[0]), t.isFunction(e) && e()
                            }
                            var s = t(this),
                                o = n.complete,
                                r = n.mode;
                            (s.is(":hidden") ? "hide" === r : "show" === r) ? i(): a.call(s[0], n, i)
                        }
                        var n = s.apply(this, arguments),
                            o = n.mode,
                            r = n.queue,
                            a = t.effects.effect[n.effect],
                            l = !a && i && t.effects[n.effect];
                        return t.fx.off || !a && !l ? o ? this[o](n.duration, n.complete) : this.each(function() {
                            n.complete && n.complete.call(this)
                        }) : a ? r === !1 ? this.each(e) : this.queue(r || "fx", e) : l.call(this, {
                            options: n,
                            duration: n.duration,
                            callback: n.complete,
                            mode: n.mode
                        })
                    },
                    _show: t.fn.show,
                    show: function(t) {
                        if (o(t)) return this._show.apply(this, arguments);
                        var e = s.apply(this, arguments);
                        return e.mode = "show", this.effect.call(this, e)
                    },
                    _hide: t.fn.hide,
                    hide: function(t) {
                        if (o(t)) return this._hide.apply(this, arguments);
                        var e = s.apply(this, arguments);
                        return e.mode = "hide", this.effect.call(this, e)
                    },
                    __toggle: t.fn.toggle,
                    toggle: function(e) {
                        if (o(e) || "boolean" == typeof e || t.isFunction(e)) return this.__toggle.apply(this, arguments);
                        var i = s.apply(this, arguments);
                        return i.mode = "toggle", this.effect.call(this, i)
                    },
                    cssUnit: function(e) {
                        var i = this.css(e),
                            n = [];
                        return t.each(["em", "px", "%", "pt"], function(t, e) {
                            i.indexOf(e) > 0 && (n = [parseFloat(i), e])
                        }), n
                    }
                })
            }(),
            function() {
                var e = {};
                t.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(t, i) {
                    e[i] = function(e) {
                        return Math.pow(e, t + 2)
                    }
                }), t.extend(e, {
                    Sine: function(t) {
                        return 1 - Math.cos(t * Math.PI / 2)
                    },
                    Circ: function(t) {
                        return 1 - Math.sqrt(1 - t * t)
                    },
                    Elastic: function(t) {
                        return 0 === t || 1 === t ? t : -Math.pow(2, 8 * (t - 1)) * Math.sin((80 * (t - 1) - 7.5) * Math.PI / 15)
                    },
                    Back: function(t) {
                        return t * t * (3 * t - 2)
                    },
                    Bounce: function(t) {
                        for (var e, i = 4; t < ((e = Math.pow(2, --i)) - 1) / 11;);
                        return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * e - 2) / 22 - t, 2)
                    }
                }), t.each(e, function(e, i) {
                    t.easing["easeIn" + e] = i, t.easing["easeOut" + e] = function(t) {
                        return 1 - i(1 - t)
                    }, t.easing["easeInOut" + e] = function(t) {
                        return .5 > t ? i(2 * t) / 2 : 1 - i(-2 * t + 2) / 2
                    }
                })
            }()
    }(jQuery),
    function(t) {
        var e = 0,
            i = {},
            n = {};
        i.height = i.paddingTop = i.paddingBottom = i.borderTopWidth = i.borderBottomWidth = "hide", n.height = n.paddingTop = n.paddingBottom = n.borderTopWidth = n.borderBottomWidth = "show", t.widget("ui.accordion", {
            version: "1.9.1",
            options: {
                active: 0,
                animate: {},
                collapsible: !1,
                event: "click",
                header: "> li > :first-child,> :not(li):even",
                heightStyle: "auto",
                icons: {
                    activeHeader: "ui-icon-triangle-1-s",
                    header: "ui-icon-triangle-1-e"
                },
                activate: null,
                beforeActivate: null
            },
            _create: function() {
                var i = this.accordionId = "ui-accordion-" + (this.element.attr("id") || ++e),
                    n = this.options;
                this.prevShow = this.prevHide = t(), this.element.addClass("ui-accordion ui-widget ui-helper-reset"), this.headers = this.element.find(n.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"), this._hoverable(this.headers), this._focusable(this.headers), this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide(), !n.collapsible && (n.active === !1 || null == n.active) && (n.active = 0), n.active < 0 && (n.active += this.headers.length), this.active = this._findActive(n.active).addClass("ui-accordion-header-active ui-state-active").toggleClass("ui-corner-all ui-corner-top"), this.active.next().addClass("ui-accordion-content-active").show(), this._createIcons(), this.refresh(), this.element.attr("role", "tablist"), this.headers.attr("role", "tab").each(function(e) {
                    var n = t(this),
                        s = n.attr("id"),
                        o = n.next(),
                        r = o.attr("id");
                    s || (s = i + "-header-" + e, n.attr("id", s)), r || (r = i + "-panel-" + e, o.attr("id", r)), n.attr("aria-controls", r), o.attr("aria-labelledby", s)
                }).next().attr("role", "tabpanel"), this.headers.not(this.active).attr({
                    "aria-selected": "false",
                    tabIndex: -1
                }).next().attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }).hide(), this.active.length ? this.active.attr({
                    "aria-selected": "true",
                    tabIndex: 0
                }).next().attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                }) : this.headers.eq(0).attr("tabIndex", 0), this._on(this.headers, {
                    keydown: "_keydown"
                }), this._on(this.headers.next(), {
                    keydown: "_panelKeyDown"
                }), this._setupEvents(n.event)
            },
            _getCreateEventData: function() {
                return {
                    header: this.active,
                    content: this.active.length ? this.active.next() : t()
                }
            },
            _createIcons: function() {
                var e = this.options.icons;
                e && (t("<span>").addClass("ui-accordion-header-icon ui-icon " + e.header).prependTo(this.headers), this.active.children(".ui-accordion-header-icon").removeClass(e.header).addClass(e.activeHeader), this.headers.addClass("ui-accordion-icons"))
            },
            _destroyIcons: function() {
                this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()
            },
            _destroy: function() {
                var t;
                this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"), this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function() {
                    /^ui-accordion/.test(this.id) && this.removeAttribute("id")
                }), this._destroyIcons(), t = this.headers.next().css("display", "").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function() {
                    /^ui-accordion/.test(this.id) && this.removeAttribute("id")
                }), "content" !== this.options.heightStyle && t.css("height", "")
            },
            _setOption: function(t, e) {
                return "active" === t ? void this._activate(e) : ("event" === t && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(e)), this._super(t, e), "collapsible" === t && !e && this.options.active === !1 && this._activate(0), "icons" === t && (this._destroyIcons(), e && this._createIcons()), "disabled" === t && this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!e), void 0)
            },
            _keydown: function(e) {
                if (!e.altKey && !e.ctrlKey) {
                    var i = t.ui.keyCode,
                        n = this.headers.length,
                        s = this.headers.index(e.target),
                        o = !1;
                    switch (e.keyCode) {
                        case i.RIGHT:
                        case i.DOWN:
                            o = this.headers[(s + 1) % n];
                            break;
                        case i.LEFT:
                        case i.UP:
                            o = this.headers[(s - 1 + n) % n];
                            break;
                        case i.SPACE:
                        case i.ENTER:
                            this._eventHandler(e);
                            break;
                        case i.HOME:
                            o = this.headers[0];
                            break;
                        case i.END:
                            o = this.headers[n - 1]
                    }
                    o && (t(e.target).attr("tabIndex", -1), t(o).attr("tabIndex", 0), o.focus(), e.preventDefault())
                }
            },
            _panelKeyDown: function(e) {
                e.keyCode === t.ui.keyCode.UP && e.ctrlKey && t(e.currentTarget).prev().focus()
            },
            refresh: function() {
                var e, i, n = this.options.heightStyle,
                    s = this.element.parent();
                "fill" === n ? (t.support.minHeight || (i = s.css("overflow"), s.css("overflow", "hidden")), e = s.height(), this.element.siblings(":visible").each(function() {
                    var i = t(this),
                        n = i.css("position");
                    "absolute" !== n && "fixed" !== n && (e -= i.outerHeight(!0))
                }), i && s.css("overflow", i), this.headers.each(function() {
                    e -= t(this).outerHeight(!0)
                }), this.headers.next().each(function() {
                    t(this).height(Math.max(0, e - t(this).innerHeight() + t(this).height()))
                }).css("overflow", "auto")) : "auto" === n && (e = 0, this.headers.next().each(function() {
                    e = Math.max(e, t(this).height("").height())
                }).height(e))
            },
            _activate: function(e) {
                var i = this._findActive(e)[0];
                i !== this.active[0] && (i = i || this.active[0], this._eventHandler({
                    target: i,
                    currentTarget: i,
                    preventDefault: t.noop
                }))
            },
            _findActive: function(e) {
                return "number" == typeof e ? this.headers.eq(e) : t()
            },
            _setupEvents: function(e) {
                var i = {};
                e && (t.each(e.split(" "), function(t, e) {
                    i[e] = "_eventHandler"
                }), this._on(this.headers, i))
            },
            _eventHandler: function(e) {
                var i = this.options,
                    n = this.active,
                    s = t(e.currentTarget),
                    o = s[0] === n[0],
                    r = o && i.collapsible,
                    a = r ? t() : s.next(),
                    l = n.next(),
                    c = {
                        oldHeader: n,
                        oldPanel: l,
                        newHeader: r ? t() : s,
                        newPanel: a
                    };
                e.preventDefault(), o && !i.collapsible || this._trigger("beforeActivate", e, c) === !1 || (i.active = r ? !1 : this.headers.index(s), this.active = o ? t() : s, this._toggle(c), n.removeClass("ui-accordion-header-active ui-state-active"), i.icons && n.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header), o || (s.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"), i.icons && s.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader), s.next().addClass("ui-accordion-content-active")))
            },
            _toggle: function(e) {
                var i = e.newPanel,
                    n = this.prevShow.length ? this.prevShow : e.oldPanel;
                this.prevShow.add(this.prevHide).stop(!0, !0), this.prevShow = i, this.prevHide = n, this.options.animate ? this._animate(i, n, e) : (n.hide(), i.show(), this._toggleComplete(e)), n.attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }), n.prev().attr("aria-selected", "false"), i.length && n.length ? n.prev().attr("tabIndex", -1) : i.length && this.headers.filter(function() {
                    return 0 === t(this).attr("tabIndex")
                }).attr("tabIndex", -1), i.attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                }).prev().attr({
                    "aria-selected": "true",
                    tabIndex: 0
                })
            },
            _animate: function(t, e, s) {
                var o, r, a, l = this,
                    c = 0,
                    h = t.length && (!e.length || t.index() < e.index()),
                    u = this.options.animate || {},
                    d = h && u.down || u,
                    p = function() {
                        l._toggleComplete(s)
                    };
                return "number" == typeof d && (a = d), "string" == typeof d && (r = d), r = r || d.easing || u.easing, a = a || d.duration || u.duration, e.length ? t.length ? (o = t.show().outerHeight(), e.animate(i, {
                    duration: a,
                    easing: r,
                    step: function(t, e) {
                        e.now = Math.round(t)
                    }
                }), t.hide().animate(n, {
                    duration: a,
                    easing: r,
                    complete: p,
                    step: function(t, i) {
                        i.now = Math.round(t), "height" !== i.prop ? c += i.now : "content" !== l.options.heightStyle && (i.now = Math.round(o - e.outerHeight() - c), c = 0)
                    }
                }), void 0) : e.animate(i, a, r, p) : t.animate(n, a, r, p)
            },
            _toggleComplete: function(t) {
                var e = t.oldPanel;
                e.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"), e.length && (e.parent()[0].className = e.parent()[0].className), this._trigger("activate", null, t)
            }
        }), t.uiBackCompat !== !1 && (function(t, e) {
            t.extend(e.options, {
                navigation: !1,
                navigationFilter: function() {
                    return this.href.toLowerCase() === location.href.toLowerCase()
                }
            });
            var i = e._create;
            e._create = function() {
                if (this.options.navigation) {
                    var e = this,
                        n = this.element.find(this.options.header),
                        s = n.next(),
                        o = n.add(s).find("a").filter(this.options.navigationFilter)[0];
                    o && n.add(s).each(function(i) {
                        return t.contains(this, o) ? (e.options.active = Math.floor(i / 2), !1) : void 0
                    })
                }
                i.call(this)
            }
        }(jQuery, jQuery.ui.accordion.prototype), function(t, e) {
            t.extend(e.options, {
                heightStyle: null,
                autoHeight: !0,
                clearStyle: !1,
                fillSpace: !1
            });
            var i = e._create,
                n = e._setOption;
            t.extend(e, {
                _create: function() {
                    this.options.heightStyle = this.options.heightStyle || this._mergeHeightStyle(), i.call(this)
                },
                _setOption: function(t) {
                    ("autoHeight" === t || "clearStyle" === t || "fillSpace" === t) && (this.options.heightStyle = this._mergeHeightStyle()), n.apply(this, arguments)
                },
                _mergeHeightStyle: function() {
                    var t = this.options;
                    return t.fillSpace ? "fill" : t.clearStyle ? "content" : t.autoHeight ? "auto" : void 0
                }
            })
        }(jQuery, jQuery.ui.accordion.prototype), function(t, e) {
            t.extend(e.options.icons, {
                activeHeader: null,
                headerSelected: "ui-icon-triangle-1-s"
            });
            var i = e._createIcons;
            e._createIcons = function() {
                this.options.icons && (this.options.icons.activeHeader = this.options.icons.activeHeader || this.options.icons.headerSelected), i.call(this)
            }
        }(jQuery, jQuery.ui.accordion.prototype), function(t, e) {
            e.activate = e._activate;
            var i = e._findActive;
            e._findActive = function(t) {
                return -1 === t && (t = !1), t && "number" != typeof t && (t = this.headers.index(this.headers.filter(t)), -1 === t && (t = !1)), i.call(this, t)
            }
        }(jQuery, jQuery.ui.accordion.prototype), jQuery.ui.accordion.prototype.resize = jQuery.ui.accordion.prototype.refresh, function(t, e) {
            t.extend(e.options, {
                change: null,
                changestart: null
            });
            var i = e._trigger;
            e._trigger = function(t, e, n) {
                var s = i.apply(this, arguments);
                return s ? ("beforeActivate" === t ? s = i.call(this, "changestart", e, {
                    oldHeader: n.oldHeader,
                    oldContent: n.oldPanel,
                    newHeader: n.newHeader,
                    newContent: n.newPanel
                }) : "activate" === t && (s = i.call(this, "change", e, {
                    oldHeader: n.oldHeader,
                    oldContent: n.oldPanel,
                    newHeader: n.newHeader,
                    newContent: n.newPanel
                })), s) : !1
            }
        }(jQuery, jQuery.ui.accordion.prototype), function(t, e) {
            t.extend(e.options, {
                animate: null,
                animated: "slide"
            });
            var i = e._create;
            e._create = function() {
                var t = this.options;
                null === t.animate && (t.animate = t.animated ? "slide" === t.animated ? 300 : "bounceslide" === t.animated ? {
                    duration: 200,
                    down: {
                        easing: "easeOutBounce",
                        duration: 1e3
                    }
                } : t.animated : !1), i.call(this)
            }
        }(jQuery, jQuery.ui.accordion.prototype))
    }(jQuery),
    function(t) {
        var e = 0;
        t.widget("ui.autocomplete", {
            version: "1.9.1",
            defaultElement: "<input>",
            options: {
                appendTo: "body",
                autoFocus: !1,
                delay: 300,
                minLength: 1,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "none"
                },
                source: null,
                change: null,
                close: null,
                focus: null,
                open: null,
                response: null,
                search: null,
                select: null
            },
            pending: 0,
            _create: function() {
                var e, i, n;
                this.isMultiLine = this._isMultiLine(), this.valueMethod = this.element[this.element.is("input,textarea") ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, {
                    keydown: function(s) {
                        if (this.element.prop("readOnly")) return e = !0, n = !0, i = !0, void 0;
                        e = !1, n = !1, i = !1;
                        var o = t.ui.keyCode;
                        switch (s.keyCode) {
                            case o.PAGE_UP:
                                e = !0, this._move("previousPage", s);
                                break;
                            case o.PAGE_DOWN:
                                e = !0, this._move("nextPage", s);
                                break;
                            case o.UP:
                                e = !0, this._keyEvent("previous", s);
                                break;
                            case o.DOWN:
                                e = !0, this._keyEvent("next", s);
                                break;
                            case o.ENTER:
                            case o.NUMPAD_ENTER:
                                this.menu.active && (e = !0, s.preventDefault(), this.menu.select(s));
                                break;
                            case o.TAB:
                                this.menu.active && this.menu.select(s);
                                break;
                            case o.ESCAPE:
                                this.menu.element.is(":visible") && (this._value(this.term), this.close(s), s.preventDefault());
                                break;
                            default:
                                i = !0, this._searchTimeout(s)
                        }
                    },
                    keypress: function(n) {
                        if (e) return e = !1, void n.preventDefault();
                        if (!i) {
                            var s = t.ui.keyCode;
                            switch (n.keyCode) {
                                case s.PAGE_UP:
                                    this._move("previousPage", n);
                                    break;
                                case s.PAGE_DOWN:
                                    this._move("nextPage", n);
                                    break;
                                case s.UP:
                                    this._keyEvent("previous", n);
                                    break;
                                case s.DOWN:
                                    this._keyEvent("next", n)
                            }
                        }
                    },
                    input: function(t) {
                        return n ? (n = !1, void t.preventDefault()) : void this._searchTimeout(t)
                    },
                    focus: function() {
                        this.selectedItem = null, this.previous = this._value()
                    },
                    blur: function(t) {
                        return this.cancelBlur ? void delete this.cancelBlur : (clearTimeout(this.searching), this.close(t), this._change(t), void 0)
                    }
                }), this._initSource(), this.menu = t("<ul>").addClass("ui-autocomplete").appendTo(this.document.find(this.options.appendTo || "body")[0]).menu({
                    input: t(),
                    role: null
                }).zIndex(this.element.zIndex() + 1).hide().data("menu"), this._on(this.menu.element, {
                    mousedown: function(e) {
                        e.preventDefault(), this.cancelBlur = !0, this._delay(function() {
                            delete this.cancelBlur
                        });
                        var i = this.menu.element[0];
                        t(e.target).closest(".ui-menu-item").length || this._delay(function() {
                            var e = this;
                            this.document.one("mousedown", function(n) {
                                n.target !== e.element[0] && n.target !== i && !t.contains(i, n.target) && e.close()
                            })
                        })
                    },
                    menufocus: function(e, i) {
                        if (this.isNewMenu && (this.isNewMenu = !1, e.originalEvent && /^mouse/.test(e.originalEvent.type))) return this.menu.blur(), void this.document.one("mousemove", function() {
                            t(e.target).trigger(e.originalEvent)
                        });
                        var n = i.item.data("ui-autocomplete-item") || i.item.data("item.autocomplete");
                        !1 !== this._trigger("focus", e, {
                            item: n
                        }) ? e.originalEvent && /^key/.test(e.originalEvent.type) && this._value(n.value) : this.liveRegion.text(n.value)
                    },
                    menuselect: function(t, e) {
                        var i = e.item.data("ui-autocomplete-item") || e.item.data("item.autocomplete"),
                            n = this.previous;
                        this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = n, this._delay(function() {
                            this.previous = n, this.selectedItem = i
                        })), !1 !== this._trigger("select", t, {
                            item: i
                        }) && this._value(i.value), this.term = this._value(), this.close(t), this.selectedItem = i
                    }
                }), this.liveRegion = t("<span>", {
                    role: "status",
                    "aria-live": "polite"
                }).addClass("ui-helper-hidden-accessible").insertAfter(this.element), t.fn.bgiframe && this.menu.element.bgiframe(), this._on(this.window, {
                    beforeunload: function() {
                        this.element.removeAttr("autocomplete")
                    }
                })
            },
            _destroy: function() {
                clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove()
            },
            _setOption: function(t, e) {
                this._super(t, e), "source" === t && this._initSource(), "appendTo" === t && this.menu.element.appendTo(this.document.find(e || "body")[0]), "disabled" === t && e && this.xhr && this.xhr.abort()
            },
            _isMultiLine: function() {
                return this.element.is("textarea") ? !0 : this.element.is("input") ? !1 : this.element.prop("isContentEditable")
            },
            _initSource: function() {
                var e, i, n = this;
                t.isArray(this.options.source) ? (e = this.options.source, this.source = function(i, n) {
                    n(t.ui.autocomplete.filter(e, i.term))
                }) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function(e, s) {
                    n.xhr && n.xhr.abort(), n.xhr = t.ajax({
                        url: i,
                        data: e,
                        dataType: "json",
                        success: function(t) {
                            s(t)
                        },
                        error: function() {
                            s([])
                        }
                    })
                }) : this.source = this.options.source
            },
            _searchTimeout: function(t) {
                clearTimeout(this.searching), this.searching = this._delay(function() {
                    this.term !== this._value() && (this.selectedItem = null, this.search(null, t))
                }, this.options.delay)
            },
            search: function(t, e) {
                return t = null != t ? t : this._value(), this.term = this._value(), t.length < this.options.minLength ? this.close(e) : this._trigger("search", e) !== !1 ? this._search(t) : void 0
            },
            _search: function(t) {
                this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({
                    term: t
                }, this._response())
            },
            _response: function() {
                var t = this,
                    i = ++e;
                return function(n) {
                    i === e && t.__response(n), t.pending--, t.pending || t.element.removeClass("ui-autocomplete-loading")
                }
            },
            __response: function(t) {
                t && (t = this._normalize(t)), this._trigger("response", null, {
                    content: t
                }), !this.options.disabled && t && t.length && !this.cancelSearch ? (this._suggest(t), this._trigger("open")) : this._close()
            },
            close: function(t) {
                this.cancelSearch = !0, this._close(t)
            },
            _close: function(t) {
                this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", t))
            },
            _change: function(t) {
                this.previous !== this._value() && this._trigger("change", t, {
                    item: this.selectedItem
                })
            },
            _normalize: function(e) {
                return e.length && e[0].label && e[0].value ? e : t.map(e, function(e) {
                    return "string" == typeof e ? {
                        label: e,
                        value: e
                    } : t.extend({
                        label: e.label || e.value,
                        value: e.value || e.label
                    }, e)
                })
            },
            _suggest: function(e) {
                var i = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
                this._renderMenu(i, e), this.menu.refresh(), i.show(), this._resizeMenu(), i.position(t.extend({
                    of: this.element
                }, this.options.position)), this.options.autoFocus && this.menu.next()
            },
            _resizeMenu: function() {
                var t = this.menu.element;
                t.outerWidth(Math.max(t.width("").outerWidth() + 1, this.element.outerWidth()))
            },
            _renderMenu: function(e, i) {
                var n = this;
                t.each(i, function(t, i) {
                    n._renderItemData(e, i)
                })
            },
            _renderItemData: function(t, e) {
                return this._renderItem(t, e).data("ui-autocomplete-item", e)
            },
            _renderItem: function(e, i) {
                return t("<li>").append(t("<a>").text(i.label)).appendTo(e)
            },
            _move: function(t, e) {
                return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(t) || this.menu.isLastItem() && /^next/.test(t) ? (this._value(this.term), void this.menu.blur()) : void this.menu[t](e) : void this.search(null, e)
            },
            widget: function() {
                return this.menu.element
            },
            _value: function() {
                return this.valueMethod.apply(this.element, arguments)
            },
            _keyEvent: function(t, e) {
                (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(t, e), e.preventDefault())
            }
        }), t.extend(t.ui.autocomplete, {
            escapeRegex: function(t) {
                return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
            },
            filter: function(e, i) {
                var n = new RegExp(t.ui.autocomplete.escapeRegex(i), "i");
                return t.grep(e, function(t) {
                    return n.test(t.label || t.value || t)
                })
            }
        }), t.widget("ui.autocomplete", t.ui.autocomplete, {
            options: {
                messages: {
                    noResults: "No search results.",
                    results: function(t) {
                        return t + (t > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                    }
                }
            },
            __response: function(t) {
                var e;
                this._superApply(arguments), this.options.disabled || this.cancelSearch || (e = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults, this.liveRegion.text(e))
            }
        })
    }(jQuery),
    function(t) {
        var e, i, n, s, o = "ui-button ui-widget ui-state-default ui-corner-all",
            r = "ui-state-hover ui-state-active ",
            a = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
            l = function() {
                var e = t(this).find(":ui-button");
                setTimeout(function() {
                    e.button("refresh")
                }, 1)
            },
            c = function(e) {
                var i = e.name,
                    n = e.form,
                    s = t([]);
                return i && (s = n ? t(n).find("[name='" + i + "']") : t("[name='" + i + "']", e.ownerDocument).filter(function() {
                    return !this.form
                })), s
            };
        t.widget("ui.button", {
            version: "1.9.1",
            defaultElement: "<button>",
            options: {
                disabled: null,
                text: !0,
                label: null,
                icons: {
                    primary: null,
                    secondary: null
                }
            },
            _create: function() {
                this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, l), "boolean" != typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title");
                var r = this,
                    a = this.options,
                    h = "checkbox" === this.type || "radio" === this.type,
                    u = "ui-state-hover" + (h ? "" : " ui-state-active"),
                    d = "ui-state-focus";
                null === a.label && (a.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html()), this.buttonElement.addClass(o).attr("role", "button").bind("mouseenter" + this.eventNamespace, function() {
                    a.disabled || (t(this).addClass("ui-state-hover"), this === e && t(this).addClass("ui-state-active"))
                }).bind("mouseleave" + this.eventNamespace, function() {
                    a.disabled || t(this).removeClass(u)
                }).bind("click" + this.eventNamespace, function(t) {
                    a.disabled && (t.preventDefault(), t.stopImmediatePropagation())
                }), this.element.bind("focus" + this.eventNamespace, function() {
                    r.buttonElement.addClass(d)
                }).bind("blur" + this.eventNamespace, function() {
                    r.buttonElement.removeClass(d)
                }), h && (this.element.bind("change" + this.eventNamespace, function() {
                    s || r.refresh()
                }), this.buttonElement.bind("mousedown" + this.eventNamespace, function(t) {
                    a.disabled || (s = !1, i = t.pageX, n = t.pageY)
                }).bind("mouseup" + this.eventNamespace, function(t) {
                    a.disabled || (i !== t.pageX || n !== t.pageY) && (s = !0)
                })), "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                    return a.disabled || s ? !1 : (t(this).toggleClass("ui-state-active"), void r.buttonElement.attr("aria-pressed", r.element[0].checked))
                }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function() {
                    if (a.disabled || s) return !1;
                    t(this).addClass("ui-state-active"), r.buttonElement.attr("aria-pressed", "true");
                    var e = r.element[0];
                    c(e).not(e).map(function() {
                        return t(this).button("widget")[0]
                    }).removeClass("ui-state-active").attr("aria-pressed", "false")
                }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function() {
                    return a.disabled ? !1 : (t(this).addClass("ui-state-active"), e = this, r.document.one("mouseup", function() {
                        e = null
                    }), void 0)
                }).bind("mouseup" + this.eventNamespace, function() {
                    return a.disabled ? !1 : void t(this).removeClass("ui-state-active")
                }).bind("keydown" + this.eventNamespace, function(e) {
                    return a.disabled ? !1 : void((e.keyCode === t.ui.keyCode.SPACE || e.keyCode === t.ui.keyCode.ENTER) && t(this).addClass("ui-state-active"))
                }).bind("keyup" + this.eventNamespace, function() {
                    t(this).removeClass("ui-state-active")
                }), this.buttonElement.is("a") && this.buttonElement.keyup(function(e) {
                    e.keyCode === t.ui.keyCode.SPACE && t(this).click()
                })), this._setOption("disabled", a.disabled), this._resetButton()
            },
            _determineButtonType: function() {
                var t, e, i;
                this.type = this.element.is("[type=checkbox]") ? "checkbox" : this.element.is("[type=radio]") ? "radio" : this.element.is("input") ? "input" : "button", "checkbox" === this.type || "radio" === this.type ? (t = this.element.parents().last(), e = "label[for='" + this.element.attr("id") + "']", this.buttonElement = t.find(e), this.buttonElement.length || (t = t.length ? t.siblings() : this.element.siblings(), this.buttonElement = t.filter(e), this.buttonElement.length || (this.buttonElement = t.find(e))), this.element.addClass("ui-helper-hidden-accessible"), i = this.element.is(":checked"), i && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", i)) : this.buttonElement = this.element
            },
            widget: function() {
                return this.buttonElement
            },
            _destroy: function() {
                this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(o + " " + r + " " + a).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title")
            },
            _setOption: function(t, e) {
                return this._super(t, e), "disabled" === t ? void(e ? this.element.prop("disabled", !0) : this.element.prop("disabled", !1)) : void this._resetButton()
            },
            refresh: function() {
                var e = this.element.is(":disabled") || this.element.hasClass("ui-button-disabled");
                e !== this.options.disabled && this._setOption("disabled", e), "radio" === this.type ? c(this.element[0]).each(function() {
                    t(this).is(":checked") ? t(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : t(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
                }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
            },
            _resetButton: function() {
                if ("input" === this.type) return void(this.options.label && this.element.val(this.options.label));
                var e = this.buttonElement.removeClass(a),
                    i = t("<span></span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(e.empty()).text(),
                    n = this.options.icons,
                    s = n.primary && n.secondary,
                    o = [];
                n.primary || n.secondary ? (this.options.text && o.push("ui-button-text-icon" + (s ? "s" : n.primary ? "-primary" : "-secondary")), n.primary && e.prepend("<span class='ui-button-icon-primary ui-icon " + n.primary + "'></span>"), n.secondary && e.append("<span class='ui-button-icon-secondary ui-icon " + n.secondary + "'></span>"), this.options.text || (o.push(s ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || e.attr("title", t.trim(i)))) : o.push("ui-button-text-only"), e.addClass(o.join(" "))
            }
        }), t.widget("ui.buttonset", {
            version: "1.9.1",
            options: {
                items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(button)"
            },
            _create: function() {
                this.element.addClass("ui-buttonset")
            },
            _init: function() {
                this.refresh()
            },
            _setOption: function(t, e) {
                "disabled" === t && this.buttons.button("option", t, e), this._super(t, e)
            },
            refresh: function() {
                var e = "rtl" === this.element.css("direction");
                this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function() {
                    return t(this).button("widget")[0]
                }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(e ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(e ? "ui-corner-left" : "ui-corner-right").end().end()
            },
            _destroy: function() {
                this.element.removeClass("ui-buttonset"), this.buttons.map(function() {
                    return t(this).button("widget")[0]
                }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
            }
        })
    }(jQuery),
    function($, undefined) {
        function Datepicker() {
            this.debug = !1, this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
                closeText: "Done",
                prevText: "Prev",
                nextText: "Next",
                currentText: "Today",
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                weekHeader: "Wk",
                dateFormat: "mm/dd/yy",
                firstDay: 0,
                isRTL: !1,
                showMonthAfterYear: !1,
                yearSuffix: ""
            }, this._defaults = {
                showOn: "focus",
                showAnim: "fadeIn",
                showOptions: {},
                defaultDate: null,
                appendText: "",
                buttonText: "...",
                buttonImage: "",
                buttonImageOnly: !1,
                hideIfNoPrevNext: !1,
                navigationAsDateFormat: !1,
                gotoCurrent: !1,
                changeMonth: !1,
                changeYear: !1,
                yearRange: "c-10:c+10",
                showOtherMonths: !1,
                selectOtherMonths: !1,
                showWeek: !1,
                calculateWeek: this.iso8601Week,
                shortYearCutoff: "+10",
                minDate: null,
                maxDate: null,
                duration: "fast",
                beforeShowDay: null,
                beforeShow: null,
                onSelect: null,
                onChangeMonthYear: null,
                onClose: null,
                numberOfMonths: 1,
                showCurrentAtPos: 0,
                stepMonths: 1,
                stepBigMonths: 12,
                altField: "",
                altFormat: "",
                constrainInput: !0,
                showButtonPanel: !1,
                autoSize: !1,
                disabled: !1
            }, $.extend(this._defaults, this.regional[""]), this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
        }

        function bindHover(t) {
            var e = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
            return t.delegate(e, "mouseout", function() {
                $(this).removeClass("ui-state-hover"), -1 != this.className.indexOf("ui-datepicker-prev") && $(this).removeClass("ui-datepicker-prev-hover"), -1 != this.className.indexOf("ui-datepicker-next") && $(this).removeClass("ui-datepicker-next-hover")
            }).delegate(e, "mouseover", function() {
                $.datepicker._isDisabledDatepicker(instActive.inline ? t.parent()[0] : instActive.input[0]) || ($(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), $(this).addClass("ui-state-hover"), -1 != this.className.indexOf("ui-datepicker-prev") && $(this).addClass("ui-datepicker-prev-hover"), -1 != this.className.indexOf("ui-datepicker-next") && $(this).addClass("ui-datepicker-next-hover"))
            })
        }

        function extendRemove(t, e) {
            $.extend(t, e);
            for (var i in e)(null == e[i] || e[i] == undefined) && (t[i] = e[i]);
            return t
        }
        $.extend($.ui, {
            datepicker: {
                version: "1.9.1"
            }
        });
        var PROP_NAME = "datepicker",
            dpuuid = (new Date).getTime(),
            instActive;
        $.extend(Datepicker.prototype, {
            markerClassName: "hasDatepicker",
            maxRows: 4,
            log: function() {
                this.debug && console.log.apply("", arguments)
            },
            _widgetDatepicker: function() {
                return this.dpDiv
            },
            setDefaults: function(t) {
                return extendRemove(this._defaults, t || {}), this
            },
            _attachDatepicker: function(target, settings) {
                var inlineSettings = null;
                for (var attrName in this._defaults) {
                    var attrValue = target.getAttribute("date:" + attrName);
                    if (attrValue) {
                        inlineSettings = inlineSettings || {};
                        try {
                            inlineSettings[attrName] = eval(attrValue)
                        } catch (err) {
                            inlineSettings[attrName] = attrValue
                        }
                    }
                }
                var nodeName = target.nodeName.toLowerCase(),
                    inline = "div" == nodeName || "span" == nodeName;
                target.id || (this.uuid += 1, target.id = "dp" + this.uuid);
                var inst = this._newInst($(target), inline);
                inst.settings = $.extend({}, settings || {}, inlineSettings || {}), "input" == nodeName ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst)
            },
            _newInst: function(t, e) {
                var i = t[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1");
                return {
                    id: i,
                    input: t,
                    selectedDay: 0,
                    selectedMonth: 0,
                    selectedYear: 0,
                    drawMonth: 0,
                    drawYear: 0,
                    inline: e,
                    dpDiv: e ? bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) : this.dpDiv
                }
            },
            _connectDatepicker: function(t, e) {
                var i = $(t);
                e.append = $([]), e.trigger = $([]), i.hasClass(this.markerClassName) || (this._attachments(i, e), i.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function(t, i, n) {
                    e.settings[i] = n
                }).bind("getData.datepicker", function(t, i) {
                    return this._get(e, i)
                }), this._autoSize(e), $.data(t, PROP_NAME, e), e.settings.disabled && this._disableDatepicker(t))
            },
            _attachments: function(t, e) {
                var i = this._get(e, "appendText"),
                    n = this._get(e, "isRTL");
                e.append && e.append.remove(), i && (e.append = $('<span class="' + this._appendClass + '">' + i + "</span>"), t[n ? "before" : "after"](e.append)), t.unbind("focus", this._showDatepicker), e.trigger && e.trigger.remove();
                var s = this._get(e, "showOn");
                if (("focus" == s || "both" == s) && t.focus(this._showDatepicker), "button" == s || "both" == s) {
                    var o = this._get(e, "buttonText"),
                        r = this._get(e, "buttonImage");
                    e.trigger = $(this._get(e, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({
                        src: r,
                        alt: o,
                        title: o
                    }) : $('<button type="button"></button>').addClass(this._triggerClass).html("" == r ? o : $("<img/>").attr({
                        src: r,
                        alt: o,
                        title: o
                    }))), t[n ? "before" : "after"](e.trigger), e.trigger.click(function() {
                        return $.datepicker._datepickerShowing && $.datepicker._lastInput == t[0] ? $.datepicker._hideDatepicker() : $.datepicker._datepickerShowing && $.datepicker._lastInput != t[0] ? ($.datepicker._hideDatepicker(), $.datepicker._showDatepicker(t[0])) : $.datepicker._showDatepicker(t[0]), !1
                    })
                }
            },
            _autoSize: function(t) {
                if (this._get(t, "autoSize") && !t.inline) {
                    var e = new Date(2009, 11, 20),
                        i = this._get(t, "dateFormat");
                    if (i.match(/[DM]/)) {
                        var n = function(t) {
                            for (var e = 0, i = 0, n = 0; n < t.length; n++) t[n].length > e && (e = t[n].length, i = n);
                            return i
                        };
                        e.setMonth(n(this._get(t, i.match(/MM/) ? "monthNames" : "monthNamesShort"))), e.setDate(n(this._get(t, i.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - e.getDay())
                    }
                    t.input.attr("size", this._formatDate(t, e).length)
                }
            },
            _inlineDatepicker: function(t, e) {
                var i = $(t);
                i.hasClass(this.markerClassName) || (i.addClass(this.markerClassName).append(e.dpDiv).bind("setData.datepicker", function(t, i, n) {
                    e.settings[i] = n
                }).bind("getData.datepicker", function(t, i) {
                    return this._get(e, i)
                }), $.data(t, PROP_NAME, e), this._setDate(e, this._getDefaultDate(e), !0), this._updateDatepicker(e), this._updateAlternate(e), e.settings.disabled && this._disableDatepicker(t), e.dpDiv.css("display", "block"))
            },
            _dialogDatepicker: function(t, e, i, n, s) {
                var o = this._dialogInst;
                if (!o) {
                    this.uuid += 1;
                    var r = "dp" + this.uuid;
                    this._dialogInput = $('<input type="text" id="' + r + '" style="position: absolute; top: -100px; width: 0px;"/>'), this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), o = this._dialogInst = this._newInst(this._dialogInput, !1), o.settings = {}, $.data(this._dialogInput[0], PROP_NAME, o)
                }
                if (extendRemove(o.settings, n || {}), e = e && e.constructor == Date ? this._formatDate(o, e) : e, this._dialogInput.val(e), this._pos = s ? s.length ? s : [s.pageX, s.pageY] : null, !this._pos) {
                    var a = document.documentElement.clientWidth,
                        l = document.documentElement.clientHeight,
                        c = document.documentElement.scrollLeft || document.body.scrollLeft,
                        h = document.documentElement.scrollTop || document.body.scrollTop;
                    this._pos = [a / 2 - 100 + c, l / 2 - 150 + h]
                }
                return this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), o.settings.onSelect = i, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], PROP_NAME, o), this
            },
            _destroyDatepicker: function(t) {
                var e = $(t),
                    i = $.data(t, PROP_NAME);
                if (e.hasClass(this.markerClassName)) {
                    var n = t.nodeName.toLowerCase();
                    $.removeData(t, PROP_NAME), "input" == n ? (i.append.remove(), i.trigger.remove(), e.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" == n || "span" == n) && e.removeClass(this.markerClassName).empty()
                }
            },
            _enableDatepicker: function(t) {
                var e = $(t),
                    i = $.data(t, PROP_NAME);
                if (e.hasClass(this.markerClassName)) {
                    var n = t.nodeName.toLowerCase();
                    if ("input" == n) t.disabled = !1, i.trigger.filter("button").each(function() {
                        this.disabled = !1
                    }).end().filter("img").css({
                        opacity: "1.0",
                        cursor: ""
                    });
                    else if ("div" == n || "span" == n) {
                        var s = e.children("." + this._inlineClass);
                        s.children().removeClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)
                    }
                    this._disabledInputs = $.map(this._disabledInputs, function(e) {
                        return e == t ? null : e
                    })
                }
            },
            _disableDatepicker: function(t) {
                var e = $(t),
                    i = $.data(t, PROP_NAME);
                if (e.hasClass(this.markerClassName)) {
                    var n = t.nodeName.toLowerCase();
                    if ("input" == n) t.disabled = !0, i.trigger.filter("button").each(function() {
                        this.disabled = !0
                    }).end().filter("img").css({
                        opacity: "0.5",
                        cursor: "default"
                    });
                    else if ("div" == n || "span" == n) {
                        var s = e.children("." + this._inlineClass);
                        s.children().addClass("ui-state-disabled"), s.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)
                    }
                    this._disabledInputs = $.map(this._disabledInputs, function(e) {
                        return e == t ? null : e
                    }), this._disabledInputs[this._disabledInputs.length] = t
                }
            },
            _isDisabledDatepicker: function(t) {
                if (!t) return !1;
                for (var e = 0; e < this._disabledInputs.length; e++)
                    if (this._disabledInputs[e] == t) return !0;
                return !1
            },
            _getInst: function(t) {
                try {
                    return $.data(t, PROP_NAME)
                } catch (e) {
                    throw "Missing instance data for this datepicker"
                }
            },
            _optionDatepicker: function(t, e, i) {
                var n = this._getInst(t);
                if (2 == arguments.length && "string" == typeof e) return "defaults" == e ? $.extend({}, $.datepicker._defaults) : n ? "all" == e ? $.extend({}, n.settings) : this._get(n, e) : null;
                var s = e || {};
                if ("string" == typeof e && (s = {}, s[e] = i), n) {
                    this._curInst == n && this._hideDatepicker();
                    var o = this._getDateDatepicker(t, !0),
                        r = this._getMinMaxDate(n, "min"),
                        a = this._getMinMaxDate(n, "max");
                    extendRemove(n.settings, s), null !== r && s.dateFormat !== undefined && s.minDate === undefined && (n.settings.minDate = this._formatDate(n, r)), null !== a && s.dateFormat !== undefined && s.maxDate === undefined && (n.settings.maxDate = this._formatDate(n, a)), this._attachments($(t), n), this._autoSize(n), this._setDate(n, o), this._updateAlternate(n), this._updateDatepicker(n)
                }
            },
            _changeDatepicker: function(t, e, i) {
                this._optionDatepicker(t, e, i)
            },
            _refreshDatepicker: function(t) {
                var e = this._getInst(t);
                e && this._updateDatepicker(e)
            },
            _setDateDatepicker: function(t, e) {
                var i = this._getInst(t);
                i && (this._setDate(i, e), this._updateDatepicker(i), this._updateAlternate(i))
            },
            _getDateDatepicker: function(t, e) {
                var i = this._getInst(t);
                return i && !i.inline && this._setDateFromField(i, e), i ? this._getDate(i) : null
            },
            _doKeyDown: function(t) {
                var e = $.datepicker._getInst(t.target),
                    i = !0,
                    n = e.dpDiv.is(".ui-datepicker-rtl");
                if (e._keyEvent = !0, $.datepicker._datepickerShowing) switch (t.keyCode) {
                    case 9:
                        $.datepicker._hideDatepicker(), i = !1;
                        break;
                    case 13:
                        var s = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", e.dpDiv);
                        s[0] && $.datepicker._selectDay(t.target, e.selectedMonth, e.selectedYear, s[0]);
                        var o = $.datepicker._get(e, "onSelect");
                        if (o) {
                            var r = $.datepicker._formatDate(e);
                            o.apply(e.input ? e.input[0] : null, [r, e])
                        } else $.datepicker._hideDatepicker();
                        return !1;
                    case 27:
                        $.datepicker._hideDatepicker();
                        break;
                    case 33:
                        $.datepicker._adjustDate(t.target, t.ctrlKey ? -$.datepicker._get(e, "stepBigMonths") : -$.datepicker._get(e, "stepMonths"), "M");
                        break;
                    case 34:
                        $.datepicker._adjustDate(t.target, t.ctrlKey ? +$.datepicker._get(e, "stepBigMonths") : +$.datepicker._get(e, "stepMonths"), "M");
                        break;
                    case 35:
                        (t.ctrlKey || t.metaKey) && $.datepicker._clearDate(t.target), i = t.ctrlKey || t.metaKey;
                        break;
                    case 36:
                        (t.ctrlKey || t.metaKey) && $.datepicker._gotoToday(t.target), i = t.ctrlKey || t.metaKey;
                        break;
                    case 37:
                        (t.ctrlKey || t.metaKey) && $.datepicker._adjustDate(t.target, n ? 1 : -1, "D"), i = t.ctrlKey || t.metaKey, t.originalEvent.altKey && $.datepicker._adjustDate(t.target, t.ctrlKey ? -$.datepicker._get(e, "stepBigMonths") : -$.datepicker._get(e, "stepMonths"), "M");
                        break;
                    case 38:
                        (t.ctrlKey || t.metaKey) && $.datepicker._adjustDate(t.target, -7, "D"), i = t.ctrlKey || t.metaKey;
                        break;
                    case 39:
                        (t.ctrlKey || t.metaKey) && $.datepicker._adjustDate(t.target, n ? -1 : 1, "D"), i = t.ctrlKey || t.metaKey, t.originalEvent.altKey && $.datepicker._adjustDate(t.target, t.ctrlKey ? +$.datepicker._get(e, "stepBigMonths") : +$.datepicker._get(e, "stepMonths"), "M");
                        break;
                    case 40:
                        (t.ctrlKey || t.metaKey) && $.datepicker._adjustDate(t.target, 7, "D"), i = t.ctrlKey || t.metaKey;
                        break;
                    default:
                        i = !1
                } else 36 == t.keyCode && t.ctrlKey ? $.datepicker._showDatepicker(this) : i = !1;
                i && (t.preventDefault(), t.stopPropagation())
            },
            _doKeyPress: function(t) {
                var e = $.datepicker._getInst(t.target);
                if ($.datepicker._get(e, "constrainInput")) {
                    var i = $.datepicker._possibleChars($.datepicker._get(e, "dateFormat")),
                        n = String.fromCharCode(t.charCode == undefined ? t.keyCode : t.charCode);
                    return t.ctrlKey || t.metaKey || " " > n || !i || i.indexOf(n) > -1
                }
            },
            _doKeyUp: function(t) {
                var e = $.datepicker._getInst(t.target);
                if (e.input.val() != e.lastVal) try {
                    var i = $.datepicker.parseDate($.datepicker._get(e, "dateFormat"), e.input ? e.input.val() : null, $.datepicker._getFormatConfig(e));
                    i && ($.datepicker._setDateFromField(e), $.datepicker._updateAlternate(e), $.datepicker._updateDatepicker(e))
                } catch (n) {
                    $.datepicker.log(n)
                }
                return !0
            },
            _showDatepicker: function(t) {
                if (t = t.target || t, "input" != t.nodeName.toLowerCase() && (t = $("input", t.parentNode)[0]), !$.datepicker._isDisabledDatepicker(t) && $.datepicker._lastInput != t) {
                    var e = $.datepicker._getInst(t);
                    $.datepicker._curInst && $.datepicker._curInst != e && ($.datepicker._curInst.dpDiv.stop(!0, !0), e && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0]));
                    var i = $.datepicker._get(e, "beforeShow"),
                        n = i ? i.apply(t, [t, e]) : {};
                    if (n !== !1) {
                        extendRemove(e.settings, n), e.lastVal = null, $.datepicker._lastInput = t, $.datepicker._setDateFromField(e), $.datepicker._inDialog && (t.value = ""), $.datepicker._pos || ($.datepicker._pos = $.datepicker._findPos(t), $.datepicker._pos[1] += t.offsetHeight);
                        var s = !1;
                        $(t).parents().each(function() {
                            return s |= "fixed" == $(this).css("position"), !s
                        });
                        var o = {
                            left: $.datepicker._pos[0],
                            top: $.datepicker._pos[1]
                        };
                        if ($.datepicker._pos = null, e.dpDiv.empty(), e.dpDiv.css({
                                position: "absolute",
                                display: "block",
                                top: "-1000px"
                            }), $.datepicker._updateDatepicker(e), o = $.datepicker._checkOffset(e, o, s), e.dpDiv.css({
                                position: $.datepicker._inDialog && $.blockUI ? "static" : s ? "fixed" : "absolute",
                                display: "none",
                                left: o.left + "px",
                                top: o.top + "px"
                            }), !e.inline) {
                            var r = $.datepicker._get(e, "showAnim"),
                                a = $.datepicker._get(e, "duration"),
                                l = function() {
                                    var t = e.dpDiv.find("iframe.ui-datepicker-cover");
                                    if (t.length) {
                                        var i = $.datepicker._getBorders(e.dpDiv);
                                        t.css({
                                            left: -i[0],
                                            top: -i[1],
                                            width: e.dpDiv.outerWidth(),
                                            height: e.dpDiv.outerHeight()
                                        })
                                    }
                                };
                            e.dpDiv.zIndex($(t).zIndex() + 1), $.datepicker._datepickerShowing = !0, $.effects && ($.effects.effect[r] || $.effects[r]) ? e.dpDiv.show(r, $.datepicker._get(e, "showOptions"), a, l) : e.dpDiv[r || "show"](r ? a : null, l), (!r || !a) && l(), e.input.is(":visible") && !e.input.is(":disabled") && e.input.focus(), $.datepicker._curInst = e
                        }
                    }
                }
            },
            _updateDatepicker: function(t) {
                this.maxRows = 4;
                var e = $.datepicker._getBorders(t.dpDiv);
                instActive = t, t.dpDiv.empty().append(this._generateHTML(t)), this._attachHandlers(t);
                var i = t.dpDiv.find("iframe.ui-datepicker-cover");
                !i.length || i.css({
                    left: -e[0],
                    top: -e[1],
                    width: t.dpDiv.outerWidth(),
                    height: t.dpDiv.outerHeight()
                }), t.dpDiv.find("." + this._dayOverClass + " a").mouseover();
                var n = this._getNumberOfMonths(t),
                    s = n[1],
                    o = 17;
                if (t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), s > 1 && t.dpDiv.addClass("ui-datepicker-multi-" + s).css("width", o * s + "em"), t.dpDiv[(1 != n[0] || 1 != n[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi"), t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), t == $.datepicker._curInst && $.datepicker._datepickerShowing && t.input && t.input.is(":visible") && !t.input.is(":disabled") && t.input[0] != document.activeElement && t.input.focus(), t.yearshtml) {
                    var r = t.yearshtml;
                    setTimeout(function() {
                        r === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml), r = t.yearshtml = null
                    }, 0)
                }
            },
            _getBorders: function(t) {
                var e = function(t) {
                    return {
                        thin: 1,
                        medium: 2,
                        thick: 3
                    }[t] || t
                };
                return [parseFloat(e(t.css("border-left-width"))), parseFloat(e(t.css("border-top-width")))]
            },
            _checkOffset: function(t, e, i) {
                var n = t.dpDiv.outerWidth(),
                    s = t.dpDiv.outerHeight(),
                    o = t.input ? t.input.outerWidth() : 0,
                    r = t.input ? t.input.outerHeight() : 0,
                    a = document.documentElement.clientWidth + (i ? 0 : $(document).scrollLeft()),
                    l = document.documentElement.clientHeight + (i ? 0 : $(document).scrollTop());
                return e.left -= this._get(t, "isRTL") ? n - o : 0, e.left -= i && e.left == t.input.offset().left ? $(document).scrollLeft() : 0, e.top -= i && e.top == t.input.offset().top + r ? $(document).scrollTop() : 0, e.left -= Math.min(e.left, e.left + n > a && a > n ? Math.abs(e.left + n - a) : 0), e.top -= Math.min(e.top, e.top + s > l && l > s ? Math.abs(s + r) : 0), e
            },
            _findPos: function(t) {
                for (var e = this._getInst(t), i = this._get(e, "isRTL"); t && ("hidden" == t.type || 1 != t.nodeType || $.expr.filters.hidden(t));) t = t[i ? "previousSibling" : "nextSibling"];
                var n = $(t).offset();
                return [n.left, n.top]
            },
            _hideDatepicker: function(t) {
                var e = this._curInst;
                if (e && (!t || e == $.data(t, PROP_NAME)) && this._datepickerShowing) {
                    var i = this._get(e, "showAnim"),
                        n = this._get(e, "duration"),
                        s = function() {
                            $.datepicker._tidyDialog(e)
                        };
                    $.effects && ($.effects.effect[i] || $.effects[i]) ? e.dpDiv.hide(i, $.datepicker._get(e, "showOptions"), n, s) : e.dpDiv["slideDown" == i ? "slideUp" : "fadeIn" == i ? "fadeOut" : "hide"](i ? n : null, s), i || s(), this._datepickerShowing = !1;
                    var o = this._get(e, "onClose");
                    o && o.apply(e.input ? e.input[0] : null, [e.input ? e.input.val() : "", e]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                        position: "absolute",
                        left: "0",
                        top: "-100px"
                    }), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))), this._inDialog = !1
                }
            },
            _tidyDialog: function(t) {
                t.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
            },
            _checkExternalClick: function(t) {
                if ($.datepicker._curInst) {
                    var e = $(t.target),
                        i = $.datepicker._getInst(e[0]);
                    (e[0].id != $.datepicker._mainDivId && 0 == e.parents("#" + $.datepicker._mainDivId).length && !e.hasClass($.datepicker.markerClassName) && !e.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && (!$.datepicker._inDialog || !$.blockUI) || e.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != i) && $.datepicker._hideDatepicker()
                }
            },
            _adjustDate: function(t, e, i) {
                var n = $(t),
                    s = this._getInst(n[0]);
                this._isDisabledDatepicker(n[0]) || (this._adjustInstDate(s, e + ("M" == i ? this._get(s, "showCurrentAtPos") : 0), i), this._updateDatepicker(s))
            },
            _gotoToday: function(t) {
                var e = $(t),
                    i = this._getInst(e[0]);
                if (this._get(i, "gotoCurrent") && i.currentDay) i.selectedDay = i.currentDay, i.drawMonth = i.selectedMonth = i.currentMonth, i.drawYear = i.selectedYear = i.currentYear;
                else {
                    var n = new Date;
                    i.selectedDay = n.getDate(), i.drawMonth = i.selectedMonth = n.getMonth(), i.drawYear = i.selectedYear = n.getFullYear()
                }
                this._notifyChange(i), this._adjustDate(e)
            },
            _selectMonthYear: function(t, e, i) {
                var n = $(t),
                    s = this._getInst(n[0]);
                s["selected" + ("M" == i ? "Month" : "Year")] = s["draw" + ("M" == i ? "Month" : "Year")] = parseInt(e.options[e.selectedIndex].value, 10), this._notifyChange(s), this._adjustDate(n)
            },
            _selectDay: function(t, e, i, n) {
                var s = $(t);
                if (!$(n).hasClass(this._unselectableClass) && !this._isDisabledDatepicker(s[0])) {
                    var o = this._getInst(s[0]);
                    o.selectedDay = o.currentDay = $("a", n).html(), o.selectedMonth = o.currentMonth = e, o.selectedYear = o.currentYear = i, this._selectDate(t, this._formatDate(o, o.currentDay, o.currentMonth, o.currentYear))
                }
            },
            _clearDate: function(t) {
                {
                    var e = $(t);
                    this._getInst(e[0])
                }
                this._selectDate(e, "")
            },
            _selectDate: function(t, e) {
                var i = $(t),
                    n = this._getInst(i[0]);
                e = null != e ? e : this._formatDate(n), n.input && n.input.val(e), this._updateAlternate(n);
                var s = this._get(n, "onSelect");
                s ? s.apply(n.input ? n.input[0] : null, [e, n]) : n.input && n.input.trigger("change"), n.inline ? this._updateDatepicker(n) : (this._hideDatepicker(), this._lastInput = n.input[0], "object" != typeof n.input[0] && n.input.focus(), this._lastInput = null)
            },
            _updateAlternate: function(t) {
                var e = this._get(t, "altField");
                if (e) {
                    var i = this._get(t, "altFormat") || this._get(t, "dateFormat"),
                        n = this._getDate(t),
                        s = this.formatDate(i, n, this._getFormatConfig(t));
                    $(e).each(function() {
                        $(this).val(s)
                    })
                }
            },
            noWeekends: function(t) {
                var e = t.getDay();
                return [e > 0 && 6 > e, ""]
            },
            iso8601Week: function(t) {
                var e = new Date(t.getTime());
                e.setDate(e.getDate() + 4 - (e.getDay() || 7));
                var i = e.getTime();
                return e.setMonth(0), e.setDate(1), Math.floor(Math.round((i - e) / 864e5) / 7) + 1
            },
            parseDate: function(t, e, i) {
                if (null == t || null == e) throw "Invalid arguments";
                if (e = "object" == typeof e ? e.toString() : e + "", "" == e) return null;
                var n = (i ? i.shortYearCutoff : null) || this._defaults.shortYearCutoff;
                n = "string" != typeof n ? n : (new Date).getFullYear() % 100 + parseInt(n, 10);
                for (var s = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort, o = (i ? i.dayNames : null) || this._defaults.dayNames, r = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort, a = (i ? i.monthNames : null) || this._defaults.monthNames, l = -1, c = -1, h = -1, u = -1, d = !1, p = function(e) {
                        var i = b + 1 < t.length && t.charAt(b + 1) == e;
                        return i && b++, i
                    }, f = function(t) {
                        var i = p(t),
                            n = "@" == t ? 14 : "!" == t ? 20 : "y" == t && i ? 4 : "o" == t ? 3 : 2,
                            s = new RegExp("^\\d{1," + n + "}"),
                            o = e.substring(v).match(s);
                        if (!o) throw "Missing number at position " + v;
                        return v += o[0].length, parseInt(o[0], 10)
                    }, g = function(t, i, n) {
                        var s = $.map(p(t) ? n : i, function(t, e) {
                                return [
                                    [e, t]
                                ]
                            }).sort(function(t, e) {
                                return -(t[1].length - e[1].length)
                            }),
                            o = -1;
                        if ($.each(s, function(t, i) {
                                var n = i[1];
                                return e.substr(v, n.length).toLowerCase() == n.toLowerCase() ? (o = i[0], v += n.length, !1) : void 0
                            }), -1 != o) return o + 1;
                        throw "Unknown name at position " + v
                    }, m = function() {
                        if (e.charAt(v) != t.charAt(b)) throw "Unexpected literal at position " + v;
                        v++
                    }, v = 0, b = 0; b < t.length; b++)
                    if (d) "'" != t.charAt(b) || p("'") ? m() : d = !1;
                    else switch (t.charAt(b)) {
                        case "d":
                            h = f("d");
                            break;
                        case "D":
                            g("D", s, o);
                            break;
                        case "o":
                            u = f("o");
                            break;
                        case "m":
                            c = f("m");
                            break;
                        case "M":
                            c = g("M", r, a);
                            break;
                        case "y":
                            l = f("y");
                            break;
                        case "@":
                            var y = new Date(f("@"));
                            l = y.getFullYear(), c = y.getMonth() + 1, h = y.getDate();
                            break;
                        case "!":
                            var y = new Date((f("!") - this._ticksTo1970) / 1e4);
                            l = y.getFullYear(), c = y.getMonth() + 1, h = y.getDate();
                            break;
                        case "'":
                            p("'") ? m() : d = !0;
                            break;
                        default:
                            m()
                    }
                    if (v < e.length) {
                        var _ = e.substr(v);
                        if (!/^\s+/.test(_)) throw "Extra/unparsed characters found in date: " + _
                    }
                if (-1 == l ? l = (new Date).getFullYear() : 100 > l && (l += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (n >= l ? 0 : -100)), u > -1)
                    for (c = 1, h = u;;) {
                        var w = this._getDaysInMonth(l, c - 1);
                        if (w >= h) break;
                        c++, h -= w
                    }
                var y = this._daylightSavingAdjust(new Date(l, c - 1, h));
                if (y.getFullYear() != l || y.getMonth() + 1 != c || y.getDate() != h) throw "Invalid date";
                return y
            },
            ATOM: "yy-mm-dd",
            COOKIE: "D, dd M yy",
            ISO_8601: "yy-mm-dd",
            RFC_822: "D, d M y",
            RFC_850: "DD, dd-M-y",
            RFC_1036: "D, d M y",
            RFC_1123: "D, d M yy",
            RFC_2822: "D, d M yy",
            RSS: "D, d M y",
            TICKS: "!",
            TIMESTAMP: "@",
            W3C: "yy-mm-dd",
            _ticksTo1970: 24 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 60 * 60 * 1e7,
            formatDate: function(t, e, i) {
                if (!e) return "";
                var n = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
                    s = (i ? i.dayNames : null) || this._defaults.dayNames,
                    o = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
                    r = (i ? i.monthNames : null) || this._defaults.monthNames,
                    a = function(e) {
                        var i = d + 1 < t.length && t.charAt(d + 1) == e;
                        return i && d++, i
                    },
                    l = function(t, e, i) {
                        var n = "" + e;
                        if (a(t))
                            for (; n.length < i;) n = "0" + n;
                        return n
                    },
                    c = function(t, e, i, n) {
                        return a(t) ? n[e] : i[e]
                    },
                    h = "",
                    u = !1;
                if (e)
                    for (var d = 0; d < t.length; d++)
                        if (u) "'" != t.charAt(d) || a("'") ? h += t.charAt(d) : u = !1;
                        else switch (t.charAt(d)) {
                            case "d":
                                h += l("d", e.getDate(), 2);
                                break;
                            case "D":
                                h += c("D", e.getDay(), n, s);
                                break;
                            case "o":
                                h += l("o", Math.round((new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime() - new Date(e.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                                break;
                            case "m":
                                h += l("m", e.getMonth() + 1, 2);
                                break;
                            case "M":
                                h += c("M", e.getMonth(), o, r);
                                break;
                            case "y":
                                h += a("y") ? e.getFullYear() : (e.getYear() % 100 < 10 ? "0" : "") + e.getYear() % 100;
                                break;
                            case "@":
                                h += e.getTime();
                                break;
                            case "!":
                                h += 1e4 * e.getTime() + this._ticksTo1970;
                                break;
                            case "'":
                                a("'") ? h += "'" : u = !0;
                                break;
                            default:
                                h += t.charAt(d)
                        }
                        return h
            },
            _possibleChars: function(t) {
                for (var e = "", i = !1, n = function(e) {
                        var i = s + 1 < t.length && t.charAt(s + 1) == e;
                        return i && s++, i
                    }, s = 0; s < t.length; s++)
                    if (i) "'" != t.charAt(s) || n("'") ? e += t.charAt(s) : i = !1;
                    else switch (t.charAt(s)) {
                        case "d":
                        case "m":
                        case "y":
                        case "@":
                            e += "0123456789";
                            break;
                        case "D":
                        case "M":
                            return null;
                        case "'":
                            n("'") ? e += "'" : i = !0;
                            break;
                        default:
                            e += t.charAt(s)
                    }
                    return e
            },
            _get: function(t, e) {
                return t.settings[e] !== undefined ? t.settings[e] : this._defaults[e]
            },
            _setDateFromField: function(t, e) {
                if (t.input.val() != t.lastVal) {
                    var i, n, s = this._get(t, "dateFormat"),
                        o = t.lastVal = t.input ? t.input.val() : null;
                    i = n = this._getDefaultDate(t);
                    var r = this._getFormatConfig(t);
                    try {
                        i = this.parseDate(s, o, r) || n
                    } catch (a) {
                        this.log(a), o = e ? "" : o
                    }
                    t.selectedDay = i.getDate(), t.drawMonth = t.selectedMonth = i.getMonth(), t.drawYear = t.selectedYear = i.getFullYear(), t.currentDay = o ? i.getDate() : 0, t.currentMonth = o ? i.getMonth() : 0, t.currentYear = o ? i.getFullYear() : 0, this._adjustInstDate(t)
                }
            },
            _getDefaultDate: function(t) {
                return this._restrictMinMax(t, this._determineDate(t, this._get(t, "defaultDate"), new Date))
            },
            _determineDate: function(t, e, i) {
                var n = function(t) {
                        var e = new Date;
                        return e.setDate(e.getDate() + t), e
                    },
                    s = function(e) {
                        try {
                            return $.datepicker.parseDate($.datepicker._get(t, "dateFormat"), e, $.datepicker._getFormatConfig(t))
                        } catch (i) {}
                        for (var n = (e.toLowerCase().match(/^c/) ? $.datepicker._getDate(t) : null) || new Date, s = n.getFullYear(), o = n.getMonth(), r = n.getDate(), a = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, l = a.exec(e); l;) {
                            switch (l[2] || "d") {
                                case "d":
                                case "D":
                                    r += parseInt(l[1], 10);
                                    break;
                                case "w":
                                case "W":
                                    r += 7 * parseInt(l[1], 10);
                                    break;
                                case "m":
                                case "M":
                                    o += parseInt(l[1], 10), r = Math.min(r, $.datepicker._getDaysInMonth(s, o));
                                    break;
                                case "y":
                                case "Y":
                                    s += parseInt(l[1], 10), r = Math.min(r, $.datepicker._getDaysInMonth(s, o))
                            }
                            l = a.exec(e)
                        }
                        return new Date(s, o, r)
                    },
                    o = null == e || "" === e ? i : "string" == typeof e ? s(e) : "number" == typeof e ? isNaN(e) ? i : n(e) : new Date(e.getTime());
                return o = o && "Invalid Date" == o.toString() ? i : o, o && (o.setHours(0), o.setMinutes(0), o.setSeconds(0), o.setMilliseconds(0)), this._daylightSavingAdjust(o)
            },
            _daylightSavingAdjust: function(t) {
                return t ? (t.setHours(t.getHours() > 12 ? t.getHours() + 2 : 0), t) : null
            },
            _setDate: function(t, e, i) {
                var n = !e,
                    s = t.selectedMonth,
                    o = t.selectedYear,
                    r = this._restrictMinMax(t, this._determineDate(t, e, new Date));
                t.selectedDay = t.currentDay = r.getDate(), t.drawMonth = t.selectedMonth = t.currentMonth = r.getMonth(), t.drawYear = t.selectedYear = t.currentYear = r.getFullYear(), (s != t.selectedMonth || o != t.selectedYear) && !i && this._notifyChange(t), this._adjustInstDate(t), t.input && t.input.val(n ? "" : this._formatDate(t))
            },
            _getDate: function(t) {
                var e = !t.currentYear || t.input && "" == t.input.val() ? null : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
                return e
            },
            _attachHandlers: function(t) {
                var e = this._get(t, "stepMonths"),
                    i = "#" + t.id.replace(/\\\\/g, "\\");
                t.dpDiv.find("[data-handler]").map(function() {
                    var t = {
                        prev: function() {
                            window["DP_jQuery_" + dpuuid].datepicker._adjustDate(i, -e, "M")
                        },
                        next: function() {
                            window["DP_jQuery_" + dpuuid].datepicker._adjustDate(i, +e, "M")
                        },
                        hide: function() {
                            window["DP_jQuery_" + dpuuid].datepicker._hideDatepicker()
                        },
                        today: function() {
                            window["DP_jQuery_" + dpuuid].datepicker._gotoToday(i)
                        },
                        selectDay: function() {
                            return window["DP_jQuery_" + dpuuid].datepicker._selectDay(i, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                        },
                        selectMonth: function() {
                            return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(i, this, "M"), !1
                        },
                        selectYear: function() {
                            return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(i, this, "Y"), !1
                        }
                    };
                    $(this).bind(this.getAttribute("data-event"), t[this.getAttribute("data-handler")])
                })
            },
            _generateHTML: function(t) {
                var e = new Date;
                e = this._daylightSavingAdjust(new Date(e.getFullYear(), e.getMonth(), e.getDate()));
                var i = this._get(t, "isRTL"),
                    n = this._get(t, "showButtonPanel"),
                    s = this._get(t, "hideIfNoPrevNext"),
                    o = this._get(t, "navigationAsDateFormat"),
                    r = this._getNumberOfMonths(t),
                    a = this._get(t, "showCurrentAtPos"),
                    l = this._get(t, "stepMonths"),
                    c = 1 != r[0] || 1 != r[1],
                    h = this._daylightSavingAdjust(t.currentDay ? new Date(t.currentYear, t.currentMonth, t.currentDay) : new Date(9999, 9, 9)),
                    u = this._getMinMaxDate(t, "min"),
                    d = this._getMinMaxDate(t, "max"),
                    p = t.drawMonth - a,
                    f = t.drawYear;
                if (0 > p && (p += 12, f--), d) {
                    var g = this._daylightSavingAdjust(new Date(d.getFullYear(), d.getMonth() - r[0] * r[1] + 1, d.getDate()));
                    for (g = u && u > g ? u : g; this._daylightSavingAdjust(new Date(f, p, 1)) > g;) p--, 0 > p && (p = 11, f--)
                }
                t.drawMonth = p, t.drawYear = f;
                var m = this._get(t, "prevText");
                m = o ? this.formatDate(m, this._daylightSavingAdjust(new Date(f, p - l, 1)), this._getFormatConfig(t)) : m;
                var v = this._canAdjustMonth(t, -1, f, p) ? '<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (i ? "e" : "w") + '">' + m + "</span></a>" : s ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (i ? "e" : "w") + '">' + m + "</span></a>",
                    b = this._get(t, "nextText");
                b = o ? this.formatDate(b, this._daylightSavingAdjust(new Date(f, p + l, 1)), this._getFormatConfig(t)) : b;
                var y = this._canAdjustMonth(t, 1, f, p) ? '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="' + b + '"><span class="ui-icon ui-icon-circle-triangle-' + (i ? "w" : "e") + '">' + b + "</span></a>" : s ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + b + '"><span class="ui-icon ui-icon-circle-triangle-' + (i ? "w" : "e") + '">' + b + "</span></a>",
                    _ = this._get(t, "currentText"),
                    w = this._get(t, "gotoCurrent") && t.currentDay ? h : e;
                _ = o ? this.formatDate(_, w, this._getFormatConfig(t)) : _;
                var x = t.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' + this._get(t, "closeText") + "</button>",
                    k = n ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (i ? x : "") + (this._isInRange(t, w) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">' + _ + "</button>" : "") + (i ? "" : x) + "</div>" : "",
                    C = parseInt(this._get(t, "firstDay"), 10);
                C = isNaN(C) ? 0 : C;
                for (var T = this._get(t, "showWeek"), S = this._get(t, "dayNames"), D = (this._get(t, "dayNamesShort"), this._get(t, "dayNamesMin")), E = this._get(t, "monthNames"), A = this._get(t, "monthNamesShort"), M = this._get(t, "beforeShowDay"), N = this._get(t, "showOtherMonths"), P = this._get(t, "selectOtherMonths"), I = (this._get(t, "calculateWeek") || this.iso8601Week, this._getDefaultDate(t)), H = "", O = 0; O < r[0]; O++) {
                    var z = "";
                    this.maxRows = 4;
                    for (var L = 0; L < r[1]; L++) {
                        var F = this._daylightSavingAdjust(new Date(f, p, t.selectedDay)),
                            R = " ui-corner-all",
                            j = "";
                        if (c) {
                            if (j += '<div class="ui-datepicker-group', r[1] > 1) switch (L) {
                                case 0:
                                    j += " ui-datepicker-group-first", R = " ui-corner-" + (i ? "right" : "left");
                                    break;
                                case r[1] - 1:
                                    j += " ui-datepicker-group-last", R = " ui-corner-" + (i ? "left" : "right");
                                    break;
                                default:
                                    j += " ui-datepicker-group-middle", R = ""
                            }
                            j += '">'
                        }
                        j += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + R + '">' + (/all|left/.test(R) && 0 == O ? i ? y : v : "") + (/all|right/.test(R) && 0 == O ? i ? v : y : "") + this._generateMonthYearHeader(t, p, f, u, d, O > 0 || L > 0, E, A) + '</div><table class="ui-datepicker-calendar"><thead><tr>';
                        for (var W = T ? '<th class="ui-datepicker-week-col">' + this._get(t, "weekHeader") + "</th>" : "", B = 0; 7 > B; B++) {
                            var q = (B + C) % 7;
                            W += "<th" + ((B + C + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + '><span title="' + S[q] + '">' + D[q] + "</span></th>"
                        }
                        j += W + "</tr></thead><tbody>";
                        var Y = this._getDaysInMonth(f, p);
                        f == t.selectedYear && p == t.selectedMonth && (t.selectedDay = Math.min(t.selectedDay, Y));
                        var U = (this._getFirstDayOfMonth(f, p) - C + 7) % 7,
                            V = Math.ceil((U + Y) / 7),
                            G = c && this.maxRows > V ? this.maxRows : V;
                        this.maxRows = G;
                        for (var K = this._daylightSavingAdjust(new Date(f, p, 1 - U)), X = 0; G > X; X++) {
                            j += "<tr>";
                            for (var Q = T ? '<td class="ui-datepicker-week-col">' + this._get(t, "calculateWeek")(K) + "</td>" : "", B = 0; 7 > B; B++) {
                                var J = M ? M.apply(t.input ? t.input[0] : null, [K]) : [!0, ""],
                                    Z = K.getMonth() != p,
                                    te = Z && !P || !J[0] || u && u > K || d && K > d;
                                Q += '<td class="' + ((B + C + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (Z ? " ui-datepicker-other-month" : "") + (K.getTime() == F.getTime() && p == t.selectedMonth && t._keyEvent || I.getTime() == K.getTime() && I.getTime() == F.getTime() ? " " + this._dayOverClass : "") + (te ? " " + this._unselectableClass + " ui-state-disabled" : "") + (Z && !N ? "" : " " + J[1] + (K.getTime() == h.getTime() ? " " + this._currentClass : "") + (K.getTime() == e.getTime() ? " ui-datepicker-today" : "")) + '"' + (Z && !N || !J[2] ? "" : ' title="' + J[2] + '"') + (te ? "" : ' data-handler="selectDay" data-event="click" data-month="' + K.getMonth() + '" data-year="' + K.getFullYear() + '"') + ">" + (Z && !N ? "&#xa0;" : te ? '<span class="ui-state-default">' + K.getDate() + "</span>" : '<a class="ui-state-default' + (K.getTime() == e.getTime() ? " ui-state-highlight" : "") + (K.getTime() == h.getTime() ? " ui-state-active" : "") + (Z ? " ui-priority-secondary" : "") + '" href="#">' + K.getDate() + "</a>") + "</td>", K.setDate(K.getDate() + 1), K = this._daylightSavingAdjust(K)
                            }
                            j += Q + "</tr>"
                        }
                        p++, p > 11 && (p = 0, f++), j += "</tbody></table>" + (c ? "</div>" + (r[0] > 0 && L == r[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""), z += j
                    }
                    H += z
                }
                return H += k + ($.ui.ie6 && !t.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""), t._keyEvent = !1, H
            },
            _generateMonthYearHeader: function(t, e, i, n, s, o, r, a) {
                var l = this._get(t, "changeMonth"),
                    c = this._get(t, "changeYear"),
                    h = this._get(t, "showMonthAfterYear"),
                    u = '<div class="ui-datepicker-title">',
                    d = "";
                if (o || !l) d += '<span class="ui-datepicker-month">' + r[e] + "</span>";
                else {
                    var p = n && n.getFullYear() == i,
                        f = s && s.getFullYear() == i;
                    d += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
                    for (var g = 0; 12 > g; g++)(!p || g >= n.getMonth()) && (!f || g <= s.getMonth()) && (d += '<option value="' + g + '"' + (g == e ? ' selected="selected"' : "") + ">" + a[g] + "</option>");
                    d += "</select>"
                }
                if (h || (u += d + (!o && l && c ? "" : "&#xa0;")), !t.yearshtml)
                    if (t.yearshtml = "", o || !c) u += '<span class="ui-datepicker-year">' + i + "</span>";
                    else {
                        var m = this._get(t, "yearRange").split(":"),
                            v = (new Date).getFullYear(),
                            b = function(t) {
                                var e = t.match(/c[+-].*/) ? i + parseInt(t.substring(1), 10) : t.match(/[+-].*/) ? v + parseInt(t, 10) : parseInt(t, 10);
                                return isNaN(e) ? v : e
                            },
                            y = b(m[0]),
                            _ = Math.max(y, b(m[1] || ""));
                        for (y = n ? Math.max(y, n.getFullYear()) : y, _ = s ? Math.min(_, s.getFullYear()) : _, t.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">'; _ >= y; y++) t.yearshtml += '<option value="' + y + '"' + (y == i ? ' selected="selected"' : "") + ">" + y + "</option>";
                        t.yearshtml += "</select>", u += t.yearshtml, t.yearshtml = null
                    }
                return u += this._get(t, "yearSuffix"), h && (u += (!o && l && c ? "" : "&#xa0;") + d), u += "</div>"
            },
            _adjustInstDate: function(t, e, i) {
                var n = t.drawYear + ("Y" == i ? e : 0),
                    s = t.drawMonth + ("M" == i ? e : 0),
                    o = Math.min(t.selectedDay, this._getDaysInMonth(n, s)) + ("D" == i ? e : 0),
                    r = this._restrictMinMax(t, this._daylightSavingAdjust(new Date(n, s, o)));
                t.selectedDay = r.getDate(), t.drawMonth = t.selectedMonth = r.getMonth(), t.drawYear = t.selectedYear = r.getFullYear(), ("M" == i || "Y" == i) && this._notifyChange(t)
            },
            _restrictMinMax: function(t, e) {
                var i = this._getMinMaxDate(t, "min"),
                    n = this._getMinMaxDate(t, "max"),
                    s = i && i > e ? i : e;
                return s = n && s > n ? n : s
            },
            _notifyChange: function(t) {
                var e = this._get(t, "onChangeMonthYear");
                e && e.apply(t.input ? t.input[0] : null, [t.selectedYear, t.selectedMonth + 1, t])
            },
            _getNumberOfMonths: function(t) {
                var e = this._get(t, "numberOfMonths");
                return null == e ? [1, 1] : "number" == typeof e ? [1, e] : e
            },
            _getMinMaxDate: function(t, e) {
                return this._determineDate(t, this._get(t, e + "Date"), null)
            },
            _getDaysInMonth: function(t, e) {
                return 32 - this._daylightSavingAdjust(new Date(t, e, 32)).getDate()
            },
            _getFirstDayOfMonth: function(t, e) {
                return new Date(t, e, 1).getDay()
            },
            _canAdjustMonth: function(t, e, i, n) {
                var s = this._getNumberOfMonths(t),
                    o = this._daylightSavingAdjust(new Date(i, n + (0 > e ? e : s[0] * s[1]), 1));
                return 0 > e && o.setDate(this._getDaysInMonth(o.getFullYear(), o.getMonth())), this._isInRange(t, o)
            },
            _isInRange: function(t, e) {
                var i = this._getMinMaxDate(t, "min"),
                    n = this._getMinMaxDate(t, "max");
                return (!i || e.getTime() >= i.getTime()) && (!n || e.getTime() <= n.getTime())
            },
            _getFormatConfig: function(t) {
                var e = this._get(t, "shortYearCutoff");
                return e = "string" != typeof e ? e : (new Date).getFullYear() % 100 + parseInt(e, 10), {
                    shortYearCutoff: e,
                    dayNamesShort: this._get(t, "dayNamesShort"),
                    dayNames: this._get(t, "dayNames"),
                    monthNamesShort: this._get(t, "monthNamesShort"),
                    monthNames: this._get(t, "monthNames")
                }
            },
            _formatDate: function(t, e, i, n) {
                e || (t.currentDay = t.selectedDay, t.currentMonth = t.selectedMonth, t.currentYear = t.selectedYear);
                var s = e ? "object" == typeof e ? e : this._daylightSavingAdjust(new Date(n, i, e)) : this._daylightSavingAdjust(new Date(t.currentYear, t.currentMonth, t.currentDay));
                return this.formatDate(this._get(t, "dateFormat"), s, this._getFormatConfig(t))
            }
        }), $.fn.datepicker = function(t) {
            if (!this.length) return this;
            $.datepicker.initialized || ($(document).mousedown($.datepicker._checkExternalClick).find(document.body).append($.datepicker.dpDiv), $.datepicker.initialized = !0);
            var e = Array.prototype.slice.call(arguments, 1);
            return "string" != typeof t || "isDisabled" != t && "getDate" != t && "widget" != t ? "option" == t && 2 == arguments.length && "string" == typeof arguments[1] ? $.datepicker["_" + t + "Datepicker"].apply($.datepicker, [this[0]].concat(e)) : this.each(function() {
                "string" == typeof t ? $.datepicker["_" + t + "Datepicker"].apply($.datepicker, [this].concat(e)) : $.datepicker._attachDatepicker(this, t)
            }) : $.datepicker["_" + t + "Datepicker"].apply($.datepicker, [this[0]].concat(e))
        }, $.datepicker = new Datepicker, $.datepicker.initialized = !1, $.datepicker.uuid = (new Date).getTime(), $.datepicker.version = "1.9.1", window["DP_jQuery_" + dpuuid] = $
    }(jQuery),
    function(t, e) {
        var i = "ui-dialog ui-widget ui-widget-content ui-corner-all ",
            n = {
                buttons: !0,
                height: !0,
                maxHeight: !0,
                maxWidth: !0,
                minHeight: !0,
                minWidth: !0,
                width: !0
            },
            s = {
                maxHeight: !0,
                maxWidth: !0,
                minHeight: !0,
                minWidth: !0
            };
        t.widget("ui.dialog", {
            version: "1.9.1",
            options: {
                autoOpen: !0,
                buttons: {},
                closeOnEscape: !0,
                closeText: "close",
                dialogClass: "",
                draggable: !0,
                hide: null,
                height: "auto",
                maxHeight: !1,
                maxWidth: !1,
                minHeight: 150,
                minWidth: 150,
                modal: !1,
                position: {
                    my: "center",
                    at: "center",
                    of: window,
                    collision: "fit",
                    using: function(e) {
                        var i = t(this).css(e).offset().top;
                        0 > i && t(this).css("top", e.top - i)
                    }
                },
                resizable: !0,
                show: null,
                stack: !0,
                title: "",
                width: 300,
                zIndex: 1e3
            },
            _create: function() {
                this.originalTitle = this.element.attr("title"), "string" != typeof this.originalTitle && (this.originalTitle = ""), this.oldPosition = {
                    parent: this.element.parent(),
                    index: this.element.parent().children().index(this.element)
                }, this.options.title = this.options.title || this.originalTitle;
                var e, n, s, o, r, a = this,
                    l = this.options,
                    c = l.title || "&#160;";
                e = (this.uiDialog = t("<div>")).addClass(i + l.dialogClass).css({
                    display: "none",
                    outline: 0,
                    zIndex: l.zIndex
                }).attr("tabIndex", -1).keydown(function(e) {
                    l.closeOnEscape && !e.isDefaultPrevented() && e.keyCode && e.keyCode === t.ui.keyCode.ESCAPE && (a.close(e), e.preventDefault())
                }).mousedown(function(t) {
                    a.moveToTop(!1, t)
                }).appendTo("body"), this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(e), n = (this.uiDialogTitlebar = t("<div>")).addClass("ui-dialog-titlebar  ui-widget-header  ui-corner-all  ui-helper-clearfix").bind("mousedown", function() {
                    e.focus()
                }).prependTo(e), s = t("<a href='#'></a>").addClass("ui-dialog-titlebar-close  ui-corner-all").attr("role", "button").click(function(t) {
                    t.preventDefault(), a.close(t)
                }).appendTo(n), (this.uiDialogTitlebarCloseText = t("<span>")).addClass("ui-icon ui-icon-closethick").text(l.closeText).appendTo(s), o = t("<span>").uniqueId().addClass("ui-dialog-title").html(c).prependTo(n), r = (this.uiDialogButtonPane = t("<div>")).addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), (this.uiButtonSet = t("<div>")).addClass("ui-dialog-buttonset").appendTo(r), e.attr({
                    role: "dialog",
                    "aria-labelledby": o.attr("id")
                }), n.find("*").add(n).disableSelection(), this._hoverable(s), this._focusable(s), l.draggable && t.fn.draggable && this._makeDraggable(), l.resizable && t.fn.resizable && this._makeResizable(), this._createButtons(l.buttons), this._isOpen = !1, t.fn.bgiframe && e.bgiframe(), this._on(e, {
                    keydown: function(i) {
                        if (l.modal && i.keyCode === t.ui.keyCode.TAB) {
                            var n = t(":tabbable", e),
                                s = n.filter(":first"),
                                o = n.filter(":last");
                            return i.target !== o[0] || i.shiftKey ? i.target === s[0] && i.shiftKey ? (o.focus(1), !1) : void 0 : (s.focus(1), !1)
                        }
                    }
                })
            },
            _init: function() {
                this.options.autoOpen && this.open()
            },
            _destroy: function() {
                var t, e = this.oldPosition;
                this.overlay && this.overlay.destroy(), this.uiDialog.hide(), this.element.removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), this.uiDialog.remove(), this.originalTitle && this.element.attr("title", this.originalTitle), t = e.parent.children().eq(e.index), t.length && t[0] !== this.element[0] ? t.before(this.element) : e.parent.append(this.element)
            },
            widget: function() {
                return this.uiDialog
            },
            close: function(e) {
                var i, n, s = this;
                if (this._isOpen && !1 !== this._trigger("beforeClose", e)) return this._isOpen = !1, this.overlay && this.overlay.destroy(), this.options.hide ? this._hide(this.uiDialog, this.options.hide, function() {
                    s._trigger("close", e)
                }) : (this.uiDialog.hide(), this._trigger("close", e)), t.ui.dialog.overlay.resize(), this.options.modal && (i = 0, t(".ui-dialog").each(function() {
                    this !== s.uiDialog[0] && (n = t(this).css("z-index"), isNaN(n) || (i = Math.max(i, n)))
                }), t.ui.dialog.maxZ = i), this
            },
            isOpen: function() {
                return this._isOpen
            },
            moveToTop: function(e, i) {
                var n, s = this.options;
                return s.modal && !e || !s.stack && !s.modal ? this._trigger("focus", i) : (s.zIndex > t.ui.dialog.maxZ && (t.ui.dialog.maxZ = s.zIndex), this.overlay && (t.ui.dialog.maxZ += 1, t.ui.dialog.overlay.maxZ = t.ui.dialog.maxZ, this.overlay.$el.css("z-index", t.ui.dialog.overlay.maxZ)), n = {
                    scrollTop: this.element.scrollTop(),
                    scrollLeft: this.element.scrollLeft()
                }, t.ui.dialog.maxZ += 1, this.uiDialog.css("z-index", t.ui.dialog.maxZ), this.element.attr(n), this._trigger("focus", i), this)
            },
            open: function() {
                if (!this._isOpen) {
                    var e, i = this.options,
                        n = this.uiDialog;
                    return this._size(), this._position(i.position), n.show(i.show), this.overlay = i.modal ? new t.ui.dialog.overlay(this) : null, this.moveToTop(!0), e = this.element.find(":tabbable"), e.length || (e = this.uiDialogButtonPane.find(":tabbable"), e.length || (e = n)), e.eq(0).focus(), this._isOpen = !0, this._trigger("open"), this
                }
            },
            _createButtons: function(e) {
                var i = this,
                    n = !1;
                this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), "object" == typeof e && null !== e && t.each(e, function() {
                    return !(n = !0)
                }), n ? (t.each(e, function(e, n) {
                    n = t.isFunction(n) ? {
                        click: n,
                        text: e
                    } : n;
                    var s = t("<button type='button'></button>").attr(n, !0).unbind("click").click(function() {
                        n.click.apply(i.element[0], arguments)
                    }).appendTo(i.uiButtonSet);
                    t.fn.button && s.button()
                }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog)) : this.uiDialog.removeClass("ui-dialog-buttons")
            },
            _makeDraggable: function() {
                function e(t) {
                    return {
                        position: t.position,
                        offset: t.offset
                    }
                }
                var i = this,
                    n = this.options;
                this.uiDialog.draggable({
                    cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                    handle: ".ui-dialog-titlebar",
                    containment: "document",
                    start: function(n, s) {
                        t(this).addClass("ui-dialog-dragging"), i._trigger("dragStart", n, e(s))
                    },
                    drag: function(t, n) {
                        i._trigger("drag", t, e(n))
                    },
                    stop: function(s, o) {
                        n.position = [o.position.left - i.document.scrollLeft(), o.position.top - i.document.scrollTop()], t(this).removeClass("ui-dialog-dragging"), i._trigger("dragStop", s, e(o)), t.ui.dialog.overlay.resize()
                    }
                })
            },
            _makeResizable: function(i) {
                function n(t) {
                    return {
                        originalPosition: t.originalPosition,
                        originalSize: t.originalSize,
                        position: t.position,
                        size: t.size
                    }
                }
                i = i === e ? this.options.resizable : i;
                var s = this,
                    o = this.options,
                    r = this.uiDialog.css("position"),
                    a = "string" == typeof i ? i : "n,e,s,w,se,sw,ne,nw";
                this.uiDialog.resizable({
                    cancel: ".ui-dialog-content",
                    containment: "document",
                    alsoResize: this.element,
                    maxWidth: o.maxWidth,
                    maxHeight: o.maxHeight,
                    minWidth: o.minWidth,
                    minHeight: this._minHeight(),
                    handles: a,
                    start: function(e, i) {
                        t(this).addClass("ui-dialog-resizing"), s._trigger("resizeStart", e, n(i))
                    },
                    resize: function(t, e) {
                        s._trigger("resize", t, n(e))
                    },
                    stop: function(e, i) {
                        t(this).removeClass("ui-dialog-resizing"), o.height = t(this).height(), o.width = t(this).width(), s._trigger("resizeStop", e, n(i)), t.ui.dialog.overlay.resize()
                    }
                }).css("position", r).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
            },
            _minHeight: function() {
                var t = this.options;
                return "auto" === t.height ? t.minHeight : Math.min(t.minHeight, t.height)
            },
            _position: function(e) {
                var i, n = [],
                    s = [0, 0];
                e ? (("string" == typeof e || "object" == typeof e && "0" in e) && (n = e.split ? e.split(" ") : [e[0], e[1]], 1 === n.length && (n[1] = n[0]), t.each(["left", "top"], function(t, e) {
                    +n[t] === n[t] && (s[t] = n[t], n[t] = e)
                }), e = {
                    my: n[0] + (s[0] < 0 ? s[0] : "+" + s[0]) + " " + n[1] + (s[1] < 0 ? s[1] : "+" + s[1]),
                    at: n.join(" ")
                }), e = t.extend({}, t.ui.dialog.prototype.options.position, e)) : e = t.ui.dialog.prototype.options.position, i = this.uiDialog.is(":visible"), i || this.uiDialog.show(), this.uiDialog.position(e), i || this.uiDialog.hide()
            },
            _setOptions: function(e) {
                var i = this,
                    o = {},
                    r = !1;
                t.each(e, function(t, e) {
                    i._setOption(t, e), t in n && (r = !0), t in s && (o[t] = e)
                }), r && this._size(), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", o)
            },
            _setOption: function(e, n) {
                var s, o, r = this.uiDialog;
                switch (e) {
                    case "buttons":
                        this._createButtons(n);
                        break;
                    case "closeText":
                        this.uiDialogTitlebarCloseText.text("" + n);
                        break;
                    case "dialogClass":
                        r.removeClass(this.options.dialogClass).addClass(i + n);
                        break;
                    case "disabled":
                        n ? r.addClass("ui-dialog-disabled") : r.removeClass("ui-dialog-disabled");
                        break;
                    case "draggable":
                        s = r.is(":data(draggable)"), s && !n && r.draggable("destroy"), !s && n && this._makeDraggable();
                        break;
                    case "position":
                        this._position(n);
                        break;
                    case "resizable":
                        o = r.is(":data(resizable)"), o && !n && r.resizable("destroy"), o && "string" == typeof n && r.resizable("option", "handles", n), !o && n !== !1 && this._makeResizable(n);
                        break;
                    case "title":
                        t(".ui-dialog-title", this.uiDialogTitlebar).html("" + (n || "&#160;"))
                }
                this._super(e, n)
            },
            _size: function() {
                var e, i, n, s = this.options,
                    o = this.uiDialog.is(":visible");
                this.element.show().css({
                    width: "auto",
                    minHeight: 0,
                    height: 0
                }), s.minWidth > s.width && (s.width = s.minWidth), e = this.uiDialog.css({
                    height: "auto",
                    width: s.width
                }).outerHeight(), i = Math.max(0, s.minHeight - e), "auto" === s.height ? t.support.minHeight ? this.element.css({
                    minHeight: i,
                    height: "auto"
                }) : (this.uiDialog.show(), n = this.element.css("height", "auto").height(), o || this.uiDialog.hide(), this.element.height(Math.max(n, i))) : this.element.height(Math.max(s.height - e, 0)), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
            }
        }), t.extend(t.ui.dialog, {
            uuid: 0,
            maxZ: 0,
            getTitleId: function(t) {
                var e = t.attr("id");
                return e || (this.uuid += 1, e = this.uuid), "ui-dialog-title-" + e
            },
            overlay: function(e) {
                this.$el = t.ui.dialog.overlay.create(e)
            }
        }), t.extend(t.ui.dialog.overlay, {
            instances: [],
            oldInstances: [],
            maxZ: 0,
            events: t.map("focus,mousedown,mouseup,keydown,keypress,click".split(","), function(t) {
                return t + ".dialog-overlay"
            }).join(" "),
            create: function(e) {
                0 === this.instances.length && (setTimeout(function() {
                    t.ui.dialog.overlay.instances.length && t(document).bind(t.ui.dialog.overlay.events, function(e) {
                        return t(e.target).zIndex() < t.ui.dialog.overlay.maxZ ? !1 : void 0
                    })
                }, 1), t(window).bind("resize.dialog-overlay", t.ui.dialog.overlay.resize));
                var i = this.oldInstances.pop() || t("<div>").addClass("ui-widget-overlay");
                return t(document).bind("keydown.dialog-overlay", function(n) {
                    var s = t.ui.dialog.overlay.instances;
                    0 !== s.length && s[s.length - 1] === i && e.options.closeOnEscape && !n.isDefaultPrevented() && n.keyCode && n.keyCode === t.ui.keyCode.ESCAPE && (e.close(n), n.preventDefault())
                }), i.appendTo(document.body).css({
                    width: this.width(),
                    height: this.height()
                }), t.fn.bgiframe && i.bgiframe(), this.instances.push(i), i
            },
            destroy: function(e) {
                var i = t.inArray(e, this.instances),
                    n = 0; - 1 !== i && this.oldInstances.push(this.instances.splice(i, 1)[0]), 0 === this.instances.length && t([document, window]).unbind(".dialog-overlay"), e.height(0).width(0).remove(), t.each(this.instances, function() {
                    n = Math.max(n, this.css("z-index"))
                }), this.maxZ = n
            },
            height: function() {
                var e, i;
                return t.ui.ie ? (e = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), i = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight), i > e ? t(window).height() + "px" : e + "px") : t(document).height() + "px"
            },
            width: function() {
                var e, i;
                return t.ui.ie ? (e = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), i = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth), i > e ? t(window).width() + "px" : e + "px") : t(document).width() + "px"
            },
            resize: function() {
                var e = t([]);
                t.each(t.ui.dialog.overlay.instances, function() {
                    e = e.add(this)
                }), e.css({
                    width: 0,
                    height: 0
                }).css({
                    width: t.ui.dialog.overlay.width(),
                    height: t.ui.dialog.overlay.height()
                })
            }
        }), t.extend(t.ui.dialog.overlay.prototype, {
            destroy: function() {
                t.ui.dialog.overlay.destroy(this.$el)
            }
        })
    }(jQuery),
    function(t) {
        var e = /up|down|vertical/,
            i = /up|left|vertical|horizontal/;
        t.effects.effect.blind = function(n, s) {
            var o, r, a, l = t(this),
                c = ["position", "top", "bottom", "left", "right", "height", "width"],
                h = t.effects.setMode(l, n.mode || "hide"),
                u = n.direction || "up",
                d = e.test(u),
                p = d ? "height" : "width",
                f = d ? "top" : "left",
                g = i.test(u),
                m = {},
                v = "show" === h;
            l.parent().is(".ui-effects-wrapper") ? t.effects.save(l.parent(), c) : t.effects.save(l, c), l.show(), o = t.effects.createWrapper(l).css({
                overflow: "hidden"
            }), r = o[p](), a = parseFloat(o.css(f)) || 0, m[p] = v ? r : 0, g || (l.css(d ? "bottom" : "right", 0).css(d ? "top" : "left", "auto").css({
                position: "absolute"
            }), m[f] = v ? a : r + a), v && (o.css(p, 0), g || o.css(f, a + r)), o.animate(m, {
                duration: n.duration,
                easing: n.easing,
                queue: !1,
                complete: function() {
                    "hide" === h && l.hide(), t.effects.restore(l, c), t.effects.removeWrapper(l), s()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.bounce = function(e, i) {
            var n, s, o, r = t(this),
                a = ["position", "top", "bottom", "left", "right", "height", "width"],
                l = t.effects.setMode(r, e.mode || "effect"),
                c = "hide" === l,
                h = "show" === l,
                u = e.direction || "up",
                d = e.distance,
                p = e.times || 5,
                f = 2 * p + (h || c ? 1 : 0),
                g = e.duration / f,
                m = e.easing,
                v = "up" === u || "down" === u ? "top" : "left",
                b = "up" === u || "left" === u,
                y = r.queue(),
                _ = y.length;
            for ((h || c) && a.push("opacity"), t.effects.save(r, a), r.show(), t.effects.createWrapper(r), d || (d = r["top" === v ? "outerHeight" : "outerWidth"]() / 3), h && (o = {
                    opacity: 1
                }, o[v] = 0, r.css("opacity", 0).css(v, b ? 2 * -d : 2 * d).animate(o, g, m)), c && (d /= Math.pow(2, p - 1)), o = {}, o[v] = 0, n = 0; p > n; n++) s = {}, s[v] = (b ? "-=" : "+=") + d, r.animate(s, g, m).animate(o, g, m), d = c ? 2 * d : d / 2;
            c && (s = {
                opacity: 0
            }, s[v] = (b ? "-=" : "+=") + d, r.animate(s, g, m)), r.queue(function() {
                c && r.hide(), t.effects.restore(r, a), t.effects.removeWrapper(r), i()
            }), _ > 1 && y.splice.apply(y, [1, 0].concat(y.splice(_, f + 1))), r.dequeue()
        }
    }(jQuery),
    function(t) {
        t.effects.effect.clip = function(e, i) {
            var n, s, o, r = t(this),
                a = ["position", "top", "bottom", "left", "right", "height", "width"],
                l = t.effects.setMode(r, e.mode || "hide"),
                c = "show" === l,
                h = e.direction || "vertical",
                u = "vertical" === h,
                d = u ? "height" : "width",
                p = u ? "top" : "left",
                f = {};
            t.effects.save(r, a), r.show(), n = t.effects.createWrapper(r).css({
                overflow: "hidden"
            }), s = "IMG" === r[0].tagName ? n : r, o = s[d](), c && (s.css(d, 0), s.css(p, o / 2)), f[d] = c ? o : 0, f[p] = c ? 0 : o / 2, s.animate(f, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: function() {
                    c || r.hide(), t.effects.restore(r, a), t.effects.removeWrapper(r), i()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.drop = function(e, i) {
            var n, s = t(this),
                o = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
                r = t.effects.setMode(s, e.mode || "hide"),
                a = "show" === r,
                l = e.direction || "left",
                c = "up" === l || "down" === l ? "top" : "left",
                h = "up" === l || "left" === l ? "pos" : "neg",
                u = {
                    opacity: a ? 1 : 0
                };
            t.effects.save(s, o), s.show(), t.effects.createWrapper(s), n = e.distance || s["top" === c ? "outerHeight" : "outerWidth"](!0) / 2, a && s.css("opacity", 0).css(c, "pos" === h ? -n : n), u[c] = (a ? "pos" === h ? "+=" : "-=" : "pos" === h ? "-=" : "+=") + n, s.animate(u, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: function() {
                    "hide" === r && s.hide(), t.effects.restore(s, o), t.effects.removeWrapper(s), i()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.explode = function(e, i) {
            function n() {
                y.push(this), y.length === u * d && s()
            }

            function s() {
                p.css({
                    visibility: "visible"
                }), t(y).remove(), g || p.hide(), i()
            }
            var o, r, a, l, c, h, u = e.pieces ? Math.round(Math.sqrt(e.pieces)) : 3,
                d = u,
                p = t(this),
                f = t.effects.setMode(p, e.mode || "hide"),
                g = "show" === f,
                m = p.show().css("visibility", "hidden").offset(),
                v = Math.ceil(p.outerWidth() / d),
                b = Math.ceil(p.outerHeight() / u),
                y = [];
            for (o = 0; u > o; o++)
                for (l = m.top + o * b, h = o - (u - 1) / 2, r = 0; d > r; r++) a = m.left + r * v, c = r - (d - 1) / 2, p.clone().appendTo("body").wrap("<div></div>").css({
                    position: "absolute",
                    visibility: "visible",
                    left: -r * v,
                    top: -o * b
                }).parent().addClass("ui-effects-explode").css({
                    position: "absolute",
                    overflow: "hidden",
                    width: v,
                    height: b,
                    left: a + (g ? c * v : 0),
                    top: l + (g ? h * b : 0),
                    opacity: g ? 0 : 1
                }).animate({
                    left: a + (g ? 0 : c * v),
                    top: l + (g ? 0 : h * b),
                    opacity: g ? 1 : 0
                }, e.duration || 500, e.easing, n)
        }
    }(jQuery),
    function(t) {
        t.effects.effect.fade = function(e, i) {
            var n = t(this),
                s = t.effects.setMode(n, e.mode || "toggle");
            n.animate({
                opacity: s
            }, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: i
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.fold = function(e, i) {
            var n, s, o = t(this),
                r = ["position", "top", "bottom", "left", "right", "height", "width"],
                a = t.effects.setMode(o, e.mode || "hide"),
                l = "show" === a,
                c = "hide" === a,
                h = e.size || 15,
                u = /([0-9]+)%/.exec(h),
                d = !!e.horizFirst,
                p = l !== d,
                f = p ? ["width", "height"] : ["height", "width"],
                g = e.duration / 2,
                m = {},
                v = {};
            t.effects.save(o, r), o.show(), n = t.effects.createWrapper(o).css({
                overflow: "hidden"
            }), s = p ? [n.width(), n.height()] : [n.height(), n.width()], u && (h = parseInt(u[1], 10) / 100 * s[c ? 0 : 1]), l && n.css(d ? {
                height: 0,
                width: h
            } : {
                height: h,
                width: 0
            }), m[f[0]] = l ? s[0] : h, v[f[1]] = l ? s[1] : 0, n.animate(m, g, e.easing).animate(v, g, e.easing, function() {
                c && o.hide(), t.effects.restore(o, r), t.effects.removeWrapper(o), i()
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.highlight = function(e, i) {
            var n = t(this),
                s = ["backgroundImage", "backgroundColor", "opacity"],
                o = t.effects.setMode(n, e.mode || "show"),
                r = {
                    backgroundColor: n.css("backgroundColor")
                };
            "hide" === o && (r.opacity = 0), t.effects.save(n, s), n.show().css({
                backgroundImage: "none",
                backgroundColor: e.color || "#ffff99"
            }).animate(r, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: function() {
                    "hide" === o && n.hide(), t.effects.restore(n, s), i()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.pulsate = function(e, i) {
            var n, s = t(this),
                o = t.effects.setMode(s, e.mode || "show"),
                r = "show" === o,
                a = "hide" === o,
                l = r || "hide" === o,
                c = 2 * (e.times || 5) + (l ? 1 : 0),
                h = e.duration / c,
                u = 0,
                d = s.queue(),
                p = d.length;
            for ((r || !s.is(":visible")) && (s.css("opacity", 0).show(), u = 1), n = 1; c > n; n++) s.animate({
                opacity: u
            }, h, e.easing), u = 1 - u;
            s.animate({
                opacity: u
            }, h, e.easing), s.queue(function() {
                a && s.hide(), i()
            }), p > 1 && d.splice.apply(d, [1, 0].concat(d.splice(p, c + 1))), s.dequeue()
        }
    }(jQuery),
    function(t) {
        t.effects.effect.puff = function(e, i) {
            var n = t(this),
                s = t.effects.setMode(n, e.mode || "hide"),
                o = "hide" === s,
                r = parseInt(e.percent, 10) || 150,
                a = r / 100,
                l = {
                    height: n.height(),
                    width: n.width()
                };
            t.extend(e, {
                effect: "scale",
                queue: !1,
                fade: !0,
                mode: s,
                complete: i,
                percent: o ? r : 100,
                from: o ? l : {
                    height: l.height * a,
                    width: l.width * a
                }
            }), n.effect(e)
        }, t.effects.effect.scale = function(e, i) {
            var n = t(this),
                s = t.extend(!0, {}, e),
                o = t.effects.setMode(n, e.mode || "effect"),
                r = parseInt(e.percent, 10) || (0 === parseInt(e.percent, 10) ? 0 : "hide" === o ? 0 : 100),
                a = e.direction || "both",
                l = e.origin,
                c = {
                    height: n.height(),
                    width: n.width(),
                    outerHeight: n.outerHeight(),
                    outerWidth: n.outerWidth()
                },
                h = {
                    y: "horizontal" !== a ? r / 100 : 1,
                    x: "vertical" !== a ? r / 100 : 1
                };
            s.effect = "size", s.queue = !1, s.complete = i, "effect" !== o && (s.origin = l || ["middle", "center"], s.restore = !0), s.from = e.from || ("show" === o ? {
                height: 0,
                width: 0
            } : c), s.to = {
                height: c.height * h.y,
                width: c.width * h.x,
                outerHeight: c.outerHeight * h.y,
                outerWidth: c.outerWidth * h.x
            }, s.fade && ("show" === o && (s.from.opacity = 0, s.to.opacity = 1), "hide" === o && (s.from.opacity = 1, s.to.opacity = 0)), n.effect(s)
        }, t.effects.effect.size = function(e, i) {
            var n, s, o, r = t(this),
                a = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
                l = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
                c = ["width", "height", "overflow"],
                h = ["fontSize"],
                u = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
                d = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
                p = t.effects.setMode(r, e.mode || "effect"),
                f = e.restore || "effect" !== p,
                g = e.scale || "both",
                m = e.origin || ["middle", "center"],
                v = r.css("position"),
                b = f ? a : l,
                y = {
                    height: 0,
                    width: 0
                };
            "show" === p && r.show(), n = {
                height: r.height(),
                width: r.width(),
                outerHeight: r.outerHeight(),
                outerWidth: r.outerWidth()
            }, "toggle" === e.mode && "show" === p ? (r.from = e.to || y, r.to = e.from || n) : (r.from = e.from || ("show" === p ? y : n), r.to = e.to || ("hide" === p ? y : n)), o = {
                from: {
                    y: r.from.height / n.height,
                    x: r.from.width / n.width
                },
                to: {
                    y: r.to.height / n.height,
                    x: r.to.width / n.width
                }
            }, ("box" === g || "both" === g) && (o.from.y !== o.to.y && (b = b.concat(u), r.from = t.effects.setTransition(r, u, o.from.y, r.from), r.to = t.effects.setTransition(r, u, o.to.y, r.to)), o.from.x !== o.to.x && (b = b.concat(d), r.from = t.effects.setTransition(r, d, o.from.x, r.from), r.to = t.effects.setTransition(r, d, o.to.x, r.to))), ("content" === g || "both" === g) && o.from.y !== o.to.y && (b = b.concat(h).concat(c), r.from = t.effects.setTransition(r, h, o.from.y, r.from), r.to = t.effects.setTransition(r, h, o.to.y, r.to)), t.effects.save(r, b), r.show(), t.effects.createWrapper(r), r.css("overflow", "hidden").css(r.from), m && (s = t.effects.getBaseline(m, n), r.from.top = (n.outerHeight - r.outerHeight()) * s.y, r.from.left = (n.outerWidth - r.outerWidth()) * s.x, r.to.top = (n.outerHeight - r.to.outerHeight) * s.y, r.to.left = (n.outerWidth - r.to.outerWidth) * s.x), r.css(r.from), ("content" === g || "both" === g) && (u = u.concat(["marginTop", "marginBottom"]).concat(h), d = d.concat(["marginLeft", "marginRight"]), c = a.concat(u).concat(d), r.find("*[width]").each(function() {
                var i = t(this),
                    n = {
                        height: i.height(),
                        width: i.width()
                    };
                f && t.effects.save(i, c), i.from = {
                    height: n.height * o.from.y,
                    width: n.width * o.from.x
                }, i.to = {
                    height: n.height * o.to.y,
                    width: n.width * o.to.x
                }, o.from.y !== o.to.y && (i.from = t.effects.setTransition(i, u, o.from.y, i.from), i.to = t.effects.setTransition(i, u, o.to.y, i.to)), o.from.x !== o.to.x && (i.from = t.effects.setTransition(i, d, o.from.x, i.from), i.to = t.effects.setTransition(i, d, o.to.x, i.to)), i.css(i.from), i.animate(i.to, e.duration, e.easing, function() {
                    f && t.effects.restore(i, c)
                })
            })), r.animate(r.to, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: function() {
                    0 === r.to.opacity && r.css("opacity", r.from.opacity), "hide" === p && r.hide(), t.effects.restore(r, b), f || ("static" === v ? r.css({
                        position: "relative",
                        top: r.to.top,
                        left: r.to.left
                    }) : t.each(["top", "left"], function(t, e) {
                        r.css(e, function(e, i) {
                            var n = parseInt(i, 10),
                                s = t ? r.to.left : r.to.top;
                            return "auto" === i ? s + "px" : n + s + "px"
                        })
                    })), t.effects.removeWrapper(r), i()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.shake = function(e, i) {
            var n, s = t(this),
                o = ["position", "top", "bottom", "left", "right", "height", "width"],
                r = t.effects.setMode(s, e.mode || "effect"),
                a = e.direction || "left",
                l = e.distance || 20,
                c = e.times || 3,
                h = 2 * c + 1,
                u = Math.round(e.duration / h),
                d = "up" === a || "down" === a ? "top" : "left",
                p = "up" === a || "left" === a,
                f = {},
                g = {},
                m = {},
                v = s.queue(),
                b = v.length;
            for (t.effects.save(s, o), s.show(), t.effects.createWrapper(s), f[d] = (p ? "-=" : "+=") + l, g[d] = (p ? "+=" : "-=") + 2 * l, m[d] = (p ? "-=" : "+=") + 2 * l, s.animate(f, u, e.easing), n = 1; c > n; n++) s.animate(g, u, e.easing).animate(m, u, e.easing);
            s.animate(g, u, e.easing).animate(f, u / 2, e.easing).queue(function() {
                "hide" === r && s.hide(), t.effects.restore(s, o), t.effects.removeWrapper(s), i()
            }), b > 1 && v.splice.apply(v, [1, 0].concat(v.splice(b, h + 1))), s.dequeue()
        }
    }(jQuery),
    function(t) {
        t.effects.effect.slide = function(e, i) {
            var n, s = t(this),
                o = ["position", "top", "bottom", "left", "right", "width", "height"],
                r = t.effects.setMode(s, e.mode || "show"),
                a = "show" === r,
                l = e.direction || "left",
                c = "up" === l || "down" === l ? "top" : "left",
                h = "up" === l || "left" === l,
                u = {};
            t.effects.save(s, o), s.show(), n = e.distance || s["top" === c ? "outerHeight" : "outerWidth"](!0), t.effects.createWrapper(s).css({
                overflow: "hidden"
            }), a && s.css(c, h ? isNaN(n) ? "-" + n : -n : n), u[c] = (a ? h ? "+=" : "-=" : h ? "-=" : "+=") + n, s.animate(u, {
                queue: !1,
                duration: e.duration,
                easing: e.easing,
                complete: function() {
                    "hide" === r && s.hide(), t.effects.restore(s, o), t.effects.removeWrapper(s), i()
                }
            })
        }
    }(jQuery),
    function(t) {
        t.effects.effect.transfer = function(e, i) {
            var n = t(this),
                s = t(e.to),
                o = "fixed" === s.css("position"),
                r = t("body"),
                a = o ? r.scrollTop() : 0,
                l = o ? r.scrollLeft() : 0,
                c = s.offset(),
                h = {
                    top: c.top - a,
                    left: c.left - l,
                    height: s.innerHeight(),
                    width: s.innerWidth()
                },
                u = n.offset(),
                d = t('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(e.className).css({
                    top: u.top - a,
                    left: u.left - l,
                    height: n.innerHeight(),
                    width: n.innerWidth(),
                    position: o ? "fixed" : "absolute"
                }).animate(h, e.duration, e.easing, function() {
                    d.remove(), i()
                })
        }
    }(jQuery),
    function(t) {
        var e = !1;
        t.widget("ui.menu", {
            version: "1.9.1",
            defaultElement: "<ul>",
            delay: 300,
            options: {
                icons: {
                    submenu: "ui-icon-carat-1-e"
                },
                menus: "ul",
                position: {
                    my: "left top",
                    at: "right top"
                },
                role: "menu",
                blur: null,
                focus: null,
                select: null
            },
            _create: function() {
                this.activeMenu = this.element, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                    role: this.options.role,
                    tabIndex: 0
                }).bind("click" + this.eventNamespace, t.proxy(function(t) {
                    this.options.disabled && t.preventDefault()
                }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({
                    "mousedown .ui-menu-item > a": function(t) {
                        t.preventDefault()
                    },
                    "click .ui-state-disabled > a": function(t) {
                        t.preventDefault()
                    },
                    "click .ui-menu-item:has(a)": function(i) {
                        var n = t(i.target).closest(".ui-menu-item");
                        !e && n.not(".ui-state-disabled").length && (e = !0, this.select(i), n.has(".ui-menu").length ? this.expand(i) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                    },
                    "mouseenter .ui-menu-item": function(e) {
                        var i = t(e.currentTarget);
                        i.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(e, i)
                    },
                    mouseleave: "collapseAll",
                    "mouseleave .ui-menu": "collapseAll",
                    focus: function(t, e) {
                        var i = this.active || this.element.children(".ui-menu-item").eq(0);
                        e || this.focus(t, i)
                    },
                    blur: function(e) {
                        this._delay(function() {
                            t.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(e)
                        })
                    },
                    keydown: "_keydown"
                }), this.refresh(), this._on(this.document, {
                    click: function(i) {
                        t(i.target).closest(".ui-menu").length || this.collapseAll(i), e = !1
                    }
                })
            },
            _destroy: function() {
                this.element.removeAttr("aria-activedescendant").find(".ui-menu").andSelf().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function() {
                    var e = t(this);
                    e.data("ui-menu-submenu-carat") && e.remove()
                }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
            },
            _keydown: function(e) {
                function i(t) {
                    return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
                }
                var n, s, o, r, a, l = !0;
                switch (e.keyCode) {
                    case t.ui.keyCode.PAGE_UP:
                        this.previousPage(e);
                        break;
                    case t.ui.keyCode.PAGE_DOWN:
                        this.nextPage(e);
                        break;
                    case t.ui.keyCode.HOME:
                        this._move("first", "first", e);
                        break;
                    case t.ui.keyCode.END:
                        this._move("last", "last", e);
                        break;
                    case t.ui.keyCode.UP:
                        this.previous(e);
                        break;
                    case t.ui.keyCode.DOWN:
                        this.next(e);
                        break;
                    case t.ui.keyCode.LEFT:
                        this.collapse(e);
                        break;
                    case t.ui.keyCode.RIGHT:
                        this.active && !this.active.is(".ui-state-disabled") && this.expand(e);
                        break;
                    case t.ui.keyCode.ENTER:
                    case t.ui.keyCode.SPACE:
                        this._activate(e);
                        break;
                    case t.ui.keyCode.ESCAPE:
                        this.collapse(e);
                        break;
                    default:
                        l = !1, s = this.previousFilter || "", o = String.fromCharCode(e.keyCode), r = !1, clearTimeout(this.filterTimer), o === s ? r = !0 : o = s + o, a = new RegExp("^" + i(o), "i"), n = this.activeMenu.children(".ui-menu-item").filter(function() {
                            return a.test(t(this).children("a").text())
                        }), n = r && -1 !== n.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : n, n.length || (o = String.fromCharCode(e.keyCode), a = new RegExp("^" + i(o), "i"), n = this.activeMenu.children(".ui-menu-item").filter(function() {
                            return a.test(t(this).children("a").text())
                        })), n.length ? (this.focus(e, n), n.length > 1 ? (this.previousFilter = o, this.filterTimer = this._delay(function() {
                            delete this.previousFilter
                        }, 1e3)) : delete this.previousFilter) : delete this.previousFilter
                }
                l && e.preventDefault()
            },
            _activate: function(t) {
                this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(t) : this.select(t))
            },
            refresh: function() {
                var e, i = this.options.icons.submenu,
                    n = this.element.find(this.options.menus + ":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({
                        role: this.options.role,
                        "aria-hidden": "true",
                        "aria-expanded": "false"
                    });
                e = n.add(this.element), e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({
                    tabIndex: -1,
                    role: this._itemRole()
                }), e.children(":not(.ui-menu-item)").each(function() {
                    var e = t(this);
                    /[^\-—–\s]/.test(e.text()) || e.addClass("ui-widget-content ui-menu-divider")
                }), e.children(".ui-state-disabled").attr("aria-disabled", "true"), n.each(function() {
                    var e = t(this),
                        n = e.prev("a"),
                        s = t("<span>").addClass("ui-menu-icon ui-icon " + i).data("ui-menu-submenu-carat", !0);
                    n.attr("aria-haspopup", "true").prepend(s), e.attr("aria-labelledby", n.attr("id"))
                }), this.active && !t.contains(this.element[0], this.active[0]) && this.blur()
            },
            _itemRole: function() {
                return {
                    menu: "menuitem",
                    listbox: "option"
                }[this.options.role]
            },
            focus: function(t, e) {
                var i, n;
                this.blur(t, t && "focus" === t.type), this._scrollIntoView(e), this.active = e.first(), n = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", n.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), t && "keydown" === t.type ? this._close() : this.timer = this._delay(function() {
                    this._close()
                }, this.delay), i = e.children(".ui-menu"), i.length && /^mouse/.test(t.type) && this._startOpening(i), this.activeMenu = e.parent(), this._trigger("focus", t, {
                    item: e
                })
            },
            _scrollIntoView: function(e) {
                var i, n, s, o, r, a;
                this._hasScroll() && (i = parseFloat(t.css(this.activeMenu[0], "borderTopWidth")) || 0, n = parseFloat(t.css(this.activeMenu[0], "paddingTop")) || 0, s = e.offset().top - this.activeMenu.offset().top - i - n, o = this.activeMenu.scrollTop(), r = this.activeMenu.height(), a = e.height(), 0 > s ? this.activeMenu.scrollTop(o + s) : s + a > r && this.activeMenu.scrollTop(o + s - r + a))
            },
            blur: function(t, e) {
                e || clearTimeout(this.timer), this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", t, {
                    item: this.active
                }))
            },
            _startOpening: function(t) {
                clearTimeout(this.timer), "true" === t.attr("aria-hidden") && (this.timer = this._delay(function() {
                    this._close(), this._open(t)
                }, this.delay))
            },
            _open: function(e) {
                var i = t.extend({
                    of: this.active
                }, this.options.position);
                clearTimeout(this.timer), this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden", "true"), e.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
            },
            collapseAll: function(e, i) {
                clearTimeout(this.timer), this.timer = this._delay(function() {
                    var n = i ? this.element : t(e && e.target).closest(this.element.find(".ui-menu"));
                    n.length || (n = this.element), this._close(n), this.blur(e), this.activeMenu = n
                }, this.delay)
            },
            _close: function(t) {
                t || (t = this.active ? this.active.parent() : this.element), t.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active")
            },
            collapse: function(t) {
                var e = this.active && this.active.parent().closest(".ui-menu-item", this.element);
                e && e.length && (this._close(), this.focus(t, e))
            },
            expand: function(t) {
                var e = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first();
                e && e.length && (this._open(e.parent()), this._delay(function() {
                    this.focus(t, e)
                }))
            },
            next: function(t) {
                this._move("next", "first", t)
            },
            previous: function(t) {
                this._move("prev", "last", t)
            },
            isFirstItem: function() {
                return this.active && !this.active.prevAll(".ui-menu-item").length
            },
            isLastItem: function() {
                return this.active && !this.active.nextAll(".ui-menu-item").length
            },
            _move: function(t, e, i) {
                var n;
                this.active && (n = "first" === t || "last" === t ? this.active["first" === t ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[t + "All"](".ui-menu-item").eq(0)), n && n.length && this.active || (n = this.activeMenu.children(".ui-menu-item")[e]()), this.focus(i, n)
            },
            nextPage: function(e) {
                var i, n, s;
                return this.active ? void(this.isLastItem() || (this._hasScroll() ? (n = this.active.offset().top, s = this.element.height(), this.active.nextAll(".ui-menu-item").each(function() {
                    return i = t(this), i.offset().top - n - s < 0
                }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]()))) : void this.next(e)
            },
            previousPage: function(e) {
                var i, n, s;
                return this.active ? void(this.isFirstItem() || (this._hasScroll() ? (n = this.active.offset().top, s = this.element.height(), this.active.prevAll(".ui-menu-item").each(function() {
                    return i = t(this), i.offset().top - n + s > 0
                }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item").first()))) : void this.next(e)
            },
            _hasScroll: function() {
                return this.element.outerHeight() < this.element.prop("scrollHeight")
            },
            select: function(e) {
                this.active = this.active || t(e.target).closest(".ui-menu-item");
                var i = {
                    item: this.active
                };
                this.active.has(".ui-menu").length || this.collapseAll(e, !0), this._trigger("select", e, i)
            }
        })
    }(jQuery),
    function(t, e) {
        function i(t, e, i) {
            return [parseInt(t[0], 10) * (d.test(t[0]) ? e / 100 : 1), parseInt(t[1], 10) * (d.test(t[1]) ? i / 100 : 1)]
        }

        function n(e, i) {
            return parseInt(t.css(e, i), 10) || 0
        }
        t.ui = t.ui || {};
        var s, o = Math.max,
            r = Math.abs,
            a = Math.round,
            l = /left|center|right/,
            c = /top|center|bottom/,
            h = /[\+\-]\d+%?/,
            u = /^\w+/,
            d = /%$/,
            p = t.fn.position;
        t.position = {
                scrollbarWidth: function() {
                    if (s !== e) return s;
                    var i, n, o = t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                        r = o.children()[0];
                    return t("body").append(o), i = r.offsetWidth, o.css("overflow", "scroll"), n = r.offsetWidth, i === n && (n = o[0].clientWidth), o.remove(), s = i - n
                },
                getScrollInfo: function(e) {
                    var i = e.isWindow ? "" : e.element.css("overflow-x"),
                        n = e.isWindow ? "" : e.element.css("overflow-y"),
                        s = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth,
                        o = "scroll" === n || "auto" === n && e.height < e.element[0].scrollHeight;
                    return {
                        width: s ? t.position.scrollbarWidth() : 0,
                        height: o ? t.position.scrollbarWidth() : 0
                    }
                },
                getWithinInfo: function(e) {
                    var i = t(e || window),
                        n = t.isWindow(i[0]);
                    return {
                        element: i,
                        isWindow: n,
                        offset: i.offset() || {
                            left: 0,
                            top: 0
                        },
                        scrollLeft: i.scrollLeft(),
                        scrollTop: i.scrollTop(),
                        width: n ? i.width() : i.outerWidth(),
                        height: n ? i.height() : i.outerHeight()
                    }
                }
            }, t.fn.position = function(e) {
                if (!e || !e.of) return p.apply(this, arguments);
                e = t.extend({}, e);
                var s, d, f, g, m, v = t(e.of),
                    b = t.position.getWithinInfo(e.within),
                    y = t.position.getScrollInfo(b),
                    _ = v[0],
                    w = (e.collision || "flip").split(" "),
                    x = {};
                return 9 === _.nodeType ? (d = v.width(), f = v.height(), g = {
                    top: 0,
                    left: 0
                }) : t.isWindow(_) ? (d = v.width(), f = v.height(), g = {
                    top: v.scrollTop(),
                    left: v.scrollLeft()
                }) : _.preventDefault ? (e.at = "left top", d = f = 0, g = {
                    top: _.pageY,
                    left: _.pageX
                }) : (d = v.outerWidth(), f = v.outerHeight(), g = v.offset()), m = t.extend({}, g), t.each(["my", "at"], function() {
                    var t, i, n = (e[this] || "").split(" ");
                    1 === n.length && (n = l.test(n[0]) ? n.concat(["center"]) : c.test(n[0]) ? ["center"].concat(n) : ["center", "center"]), n[0] = l.test(n[0]) ? n[0] : "center", n[1] = c.test(n[1]) ? n[1] : "center", t = h.exec(n[0]), i = h.exec(n[1]), x[this] = [t ? t[0] : 0, i ? i[0] : 0], e[this] = [u.exec(n[0])[0], u.exec(n[1])[0]]
                }), 1 === w.length && (w[1] = w[0]), "right" === e.at[0] ? m.left += d : "center" === e.at[0] && (m.left += d / 2), "bottom" === e.at[1] ? m.top += f : "center" === e.at[1] && (m.top += f / 2), s = i(x.at, d, f), m.left += s[0], m.top += s[1], this.each(function() {
                    var l, c, h = t(this),
                        u = h.outerWidth(),
                        p = h.outerHeight(),
                        _ = n(this, "marginLeft"),
                        k = n(this, "marginTop"),
                        C = u + _ + n(this, "marginRight") + y.width,
                        T = p + k + n(this, "marginBottom") + y.height,
                        S = t.extend({}, m),
                        D = i(x.my, h.outerWidth(), h.outerHeight());
                    "right" === e.my[0] ? S.left -= u : "center" === e.my[0] && (S.left -= u / 2), "bottom" === e.my[1] ? S.top -= p : "center" === e.my[1] && (S.top -= p / 2), S.left += D[0], S.top += D[1], t.support.offsetFractions || (S.left = a(S.left), S.top = a(S.top)), l = {
                        marginLeft: _,
                        marginTop: k
                    }, t.each(["left", "top"], function(i, n) {
                        t.ui.position[w[i]] && t.ui.position[w[i]][n](S, {
                            targetWidth: d,
                            targetHeight: f,
                            elemWidth: u,
                            elemHeight: p,
                            collisionPosition: l,
                            collisionWidth: C,
                            collisionHeight: T,
                            offset: [s[0] + D[0], s[1] + D[1]],
                            my: e.my,
                            at: e.at,
                            within: b,
                            elem: h
                        })
                    }), t.fn.bgiframe && h.bgiframe(), e.using && (c = function(t) {
                        var i = g.left - S.left,
                            n = i + d - u,
                            s = g.top - S.top,
                            a = s + f - p,
                            l = {
                                target: {
                                    element: v,
                                    left: g.left,
                                    top: g.top,
                                    width: d,
                                    height: f
                                },
                                element: {
                                    element: h,
                                    left: S.left,
                                    top: S.top,
                                    width: u,
                                    height: p
                                },
                                horizontal: 0 > n ? "left" : i > 0 ? "right" : "center",
                                vertical: 0 > a ? "top" : s > 0 ? "bottom" : "middle"
                            };
                        u > d && r(i + n) < d && (l.horizontal = "center"), p > f && r(s + a) < f && (l.vertical = "middle"), l.important = o(r(i), r(n)) > o(r(s), r(a)) ? "horizontal" : "vertical", e.using.call(this, t, l)
                    }), h.offset(t.extend(S, {
                        using: c
                    }))
                })
            }, t.ui.position = {
                fit: {
                    left: function(t, e) {
                        var i, n = e.within,
                            s = n.isWindow ? n.scrollLeft : n.offset.left,
                            r = n.width,
                            a = t.left - e.collisionPosition.marginLeft,
                            l = s - a,
                            c = a + e.collisionWidth - r - s;
                        e.collisionWidth > r ? l > 0 && 0 >= c ? (i = t.left + l + e.collisionWidth - r - s, t.left += l - i) : t.left = c > 0 && 0 >= l ? s : l > c ? s + r - e.collisionWidth : s : l > 0 ? t.left += l : c > 0 ? t.left -= c : t.left = o(t.left - a, t.left)
                    },
                    top: function(t, e) {
                        var i, n = e.within,
                            s = n.isWindow ? n.scrollTop : n.offset.top,
                            r = e.within.height,
                            a = t.top - e.collisionPosition.marginTop,
                            l = s - a,
                            c = a + e.collisionHeight - r - s;
                        e.collisionHeight > r ? l > 0 && 0 >= c ? (i = t.top + l + e.collisionHeight - r - s, t.top += l - i) : t.top = c > 0 && 0 >= l ? s : l > c ? s + r - e.collisionHeight : s : l > 0 ? t.top += l : c > 0 ? t.top -= c : t.top = o(t.top - a, t.top)
                    }
                },
                flip: {
                    left: function(t, e) {
                        var i, n, s = e.within,
                            o = s.offset.left + s.scrollLeft,
                            a = s.width,
                            l = s.isWindow ? s.scrollLeft : s.offset.left,
                            c = t.left - e.collisionPosition.marginLeft,
                            h = c - l,
                            u = c + e.collisionWidth - a - l,
                            d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0,
                            p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0,
                            f = -2 * e.offset[0];
                        0 > h ? (i = t.left + d + p + f + e.collisionWidth - a - o, (0 > i || i < r(h)) && (t.left += d + p + f)) : u > 0 && (n = t.left - e.collisionPosition.marginLeft + d + p + f - l, (n > 0 || r(n) < u) && (t.left += d + p + f))
                    },
                    top: function(t, e) {
                        var i, n, s = e.within,
                            o = s.offset.top + s.scrollTop,
                            a = s.height,
                            l = s.isWindow ? s.scrollTop : s.offset.top,
                            c = t.top - e.collisionPosition.marginTop,
                            h = c - l,
                            u = c + e.collisionHeight - a - l,
                            d = "top" === e.my[1],
                            p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
                            f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0,
                            g = -2 * e.offset[1];
                        0 > h ? (n = t.top + p + f + g + e.collisionHeight - a - o, t.top + p + f + g > h && (0 > n || n < r(h)) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, t.top + p + f + g > u && (i > 0 || r(i) < u) && (t.top += p + f + g))
                    }
                },
                flipfit: {
                    left: function() {
                        t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments)
                    },
                    top: function() {
                        t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments)
                    }
                }
            },
            function() {
                var e, i, n, s, o, r = document.getElementsByTagName("body")[0],
                    a = document.createElement("div");
                e = document.createElement(r ? "div" : "body"), n = {
                    visibility: "hidden",
                    width: 0,
                    height: 0,
                    border: 0,
                    margin: 0,
                    background: "none"
                }, r && t.extend(n, {
                    position: "absolute",
                    left: "-1000px",
                    top: "-1000px"
                });
                for (o in n) e.style[o] = n[o];
                e.appendChild(a), i = r || document.documentElement, i.insertBefore(e, i.firstChild), a.style.cssText = "position: absolute; left: 10.7432222px;", s = t(a).offset().left, t.support.offsetFractions = s > 10 && 11 > s, e.innerHTML = "", i.removeChild(e)
            }(), t.uiBackCompat !== !1 && function(t) {
                var i = t.fn.position;
                t.fn.position = function(n) {
                    if (!n || !n.offset) return i.call(this, n);
                    var s = n.offset.split(" "),
                        o = n.at.split(" ");
                    return 1 === s.length && (s[1] = s[0]), /^\d/.test(s[0]) && (s[0] = "+" + s[0]), /^\d/.test(s[1]) && (s[1] = "+" + s[1]), 1 === o.length && (/left|center|right/.test(o[0]) ? o[1] = "center" : (o[1] = o[0], o[0] = "center")), i.call(this, t.extend(n, {
                        at: o[0] + s[0] + " " + o[1] + s[1],
                        offset: e
                    }))
                }
            }(jQuery)
    }(jQuery),
    function(t, e) {
        t.widget("ui.progressbar", {
            version: "1.9.1",
            options: {
                value: 0,
                max: 100
            },
            min: 0,
            _create: function() {
                this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                    role: "progressbar",
                    "aria-valuemin": this.min,
                    "aria-valuemax": this.options.max,
                    "aria-valuenow": this._value()
                }), this.valueDiv = t("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), this.oldValue = this._value(), this._refreshValue()
            },
            _destroy: function() {
                this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.valueDiv.remove()
            },
            value: function(t) {
                return t === e ? this._value() : (this._setOption("value", t), this)
            },
            _setOption: function(t, e) {
                "value" === t && (this.options.value = e, this._refreshValue(), this._value() === this.options.max && this._trigger("complete")), this._super(t, e)
            },
            _value: function() {
                var t = this.options.value;
                return "number" != typeof t && (t = 0), Math.min(this.options.max, Math.max(this.min, t))
            },
            _percentage: function() {
                return 100 * this._value() / this.options.max
            },
            _refreshValue: function() {
                var t = this.value(),
                    e = this._percentage();
                this.oldValue !== t && (this.oldValue = t, this._trigger("change")), this.valueDiv.toggle(t > this.min).toggleClass("ui-corner-right", t === this.options.max).width(e.toFixed(0) + "%"), this.element.attr("aria-valuenow", t)
            }
        })
    }(jQuery),
    function(t) {
        var e = 5;
        t.widget("ui.slider", t.ui.mouse, {
            version: "1.9.1",
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null
            },
            _create: function() {
                var i, n, s = this.options,
                    o = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                    r = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                    a = [];
                for (this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all" + (s.disabled ? " ui-slider-disabled ui-disabled" : "")), this.range = t([]), s.range && (s.range === !0 && (s.values || (s.values = [this._valueMin(), this._valueMin()]), s.values.length && 2 !== s.values.length && (s.values = [s.values[0], s.values[0]])), this.range = t("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + ("min" === s.range || "max" === s.range ? " ui-slider-range-" + s.range : ""))), n = s.values && s.values.length || 1, i = o.length; n > i; i++) a.push(r);
                this.handles = o.add(t(a.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.add(this.range).filter("a").click(function(t) {
                    t.preventDefault()
                }).mouseenter(function() {
                    s.disabled || t(this).addClass("ui-state-hover")
                }).mouseleave(function() {
                    t(this).removeClass("ui-state-hover")
                }).focus(function() {
                    s.disabled ? t(this).blur() : (t(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), t(this).addClass("ui-state-focus"))
                }).blur(function() {
                    t(this).removeClass("ui-state-focus")
                }), this.handles.each(function(e) {
                    t(this).data("ui-slider-handle-index", e)
                }), this._on(this.handles, {
                    keydown: function(i) {
                        var n, s, o, r, a = t(i.target).data("ui-slider-handle-index");
                        switch (i.keyCode) {
                            case t.ui.keyCode.HOME:
                            case t.ui.keyCode.END:
                            case t.ui.keyCode.PAGE_UP:
                            case t.ui.keyCode.PAGE_DOWN:
                            case t.ui.keyCode.UP:
                            case t.ui.keyCode.RIGHT:
                            case t.ui.keyCode.DOWN:
                            case t.ui.keyCode.LEFT:
                                if (i.preventDefault(), !this._keySliding && (this._keySliding = !0, t(i.target).addClass("ui-state-active"), n = this._start(i, a), n === !1)) return
                        }
                        switch (r = this.options.step, s = o = this.options.values && this.options.values.length ? this.values(a) : this.value(), i.keyCode) {
                            case t.ui.keyCode.HOME:
                                o = this._valueMin();
                                break;
                            case t.ui.keyCode.END:
                                o = this._valueMax();
                                break;
                            case t.ui.keyCode.PAGE_UP:
                                o = this._trimAlignValue(s + (this._valueMax() - this._valueMin()) / e);
                                break;
                            case t.ui.keyCode.PAGE_DOWN:
                                o = this._trimAlignValue(s - (this._valueMax() - this._valueMin()) / e);
                                break;
                            case t.ui.keyCode.UP:
                            case t.ui.keyCode.RIGHT:
                                if (s === this._valueMax()) return;
                                o = this._trimAlignValue(s + r);
                                break;
                            case t.ui.keyCode.DOWN:
                            case t.ui.keyCode.LEFT:
                                if (s === this._valueMin()) return;
                                o = this._trimAlignValue(s - r)
                        }
                        this._slide(i, a, o)
                    },
                    keyup: function(e) {
                        var i = t(e.target).data("ui-slider-handle-index");
                        this._keySliding && (this._keySliding = !1, this._stop(e, i), this._change(e, i), t(e.target).removeClass("ui-state-active"))
                    }
                }), this._refreshValue(), this._animateOff = !1
            },
            _destroy: function() {
                this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
            },
            _mouseCapture: function(e) {
                var i, n, s, o, r, a, l, c, h = this,
                    u = this.options;
                return u.disabled ? !1 : (this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
                }, this.elementOffset = this.element.offset(), i = {
                    x: e.pageX,
                    y: e.pageY
                }, n = this._normValueFromMouse(i), s = this._valueMax() - this._valueMin() + 1, this.handles.each(function(e) {
                    var i = Math.abs(n - h.values(e));
                    s > i && (s = i, o = t(this), r = e)
                }), u.range === !0 && this.values(1) === u.min && (r += 1, o = t(this.handles[r])), a = this._start(e, r), a === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = r, o.addClass("ui-state-active").focus(), l = o.offset(), c = !t(e.target).parents().andSelf().is(".ui-slider-handle"), this._clickOffset = c ? {
                    left: 0,
                    top: 0
                } : {
                    left: e.pageX - l.left - o.width() / 2,
                    top: e.pageY - l.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0)
                }, this.handles.hasClass("ui-state-hover") || this._slide(e, r, n), this._animateOff = !0, !0))
            },
            _mouseStart: function() {
                return !0
            },
            _mouseDrag: function(t) {
                var e = {
                        x: t.pageX,
                        y: t.pageY
                    },
                    i = this._normValueFromMouse(e);
                return this._slide(t, this._handleIndex, i), !1
            },
            _mouseStop: function(t) {
                return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
            },
            _detectOrientation: function() {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
            },
            _normValueFromMouse: function(t) {
                var e, i, n, s, o;
                return "horizontal" === this.orientation ? (e = this.elementSize.width, i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), n = i / e, n > 1 && (n = 1), 0 > n && (n = 0), "vertical" === this.orientation && (n = 1 - n), s = this._valueMax() - this._valueMin(), o = this._valueMin() + n * s, this._trimAlignValue(o)
            },
            _start: function(t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i)
            },
            _slide: function(t, e, i) {
                var n, s, o;
                this.options.values && this.options.values.length ? (n = this.values(e ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === e && i > n || 1 === e && n > i) && (i = n), i !== this.values(e) && (s = this.values(), s[e] = i, o = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i,
                    values: s
                }), n = this.values(e ? 0 : 1), o !== !1 && this.values(e, i, !0))) : i !== this.value() && (o = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i
                }), o !== !1 && this.value(i))
            },
            _stop: function(t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i)
            },
            _change: function(t, e) {
                if (!this._keySliding && !this._mouseSliding) {
                    var i = {
                        handle: this.handles[e],
                        value: this.value()
                    };
                    this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("change", t, i)
                }
            },
            value: function(t) {
                return arguments.length ? (this.options.value = this._trimAlignValue(t), this._refreshValue(), this._change(null, 0), void 0) : this._value()
            },
            values: function(e, i) {
                var n, s, o;
                if (arguments.length > 1) return this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), this._change(null, e), void 0;
                if (!arguments.length) return this._values();
                if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value();
                for (n = this.options.values, s = arguments[0], o = 0; o < n.length; o += 1) n[o] = this._trimAlignValue(s[o]), this._change(null, o);
                this._refreshValue()
            },
            _setOption: function(e, i) {
                var n, s = 0;
                switch (t.isArray(this.options.values) && (s = this.options.values.length), t.Widget.prototype._setOption.apply(this, arguments), e) {
                    case "disabled":
                        i ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.prop("disabled", !0), this.element.addClass("ui-disabled")) : (this.handles.prop("disabled", !1), this.element.removeClass("ui-disabled"));
                        break;
                    case "orientation":
                        this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();
                        break;
                    case "value":
                        this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), n = 0; s > n; n += 1) this._change(null, n);
                        this._animateOff = !1;
                        break;
                    case "min":
                    case "max":
                        this._animateOff = !0, this._refreshValue(), this._animateOff = !1
                }
            },
            _value: function() {
                var t = this.options.value;
                return t = this._trimAlignValue(t)
            },
            _values: function(t) {
                var e, i, n;
                if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e);
                for (i = this.options.values.slice(), n = 0; n < i.length; n += 1) i[n] = this._trimAlignValue(i[n]);
                return i
            },
            _trimAlignValue: function(t) {
                if (t <= this._valueMin()) return this._valueMin();
                if (t >= this._valueMax()) return this._valueMax();
                var e = this.options.step > 0 ? this.options.step : 1,
                    i = (t - this._valueMin()) % e,
                    n = t - i;
                return 2 * Math.abs(i) >= e && (n += i > 0 ? e : -e), parseFloat(n.toFixed(5))
            },
            _valueMin: function() {
                return this.options.min
            },
            _valueMax: function() {
                return this.options.max
            },
            _refreshValue: function() {
                var e, i, n, s, o, r = this.options.range,
                    a = this.options,
                    l = this,
                    c = this._animateOff ? !1 : a.animate,
                    h = {};
                this.options.values && this.options.values.length ? this.handles.each(function(n) {
                    i = (l.values(n) - l._valueMin()) / (l._valueMax() - l._valueMin()) * 100, h["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", t(this).stop(1, 1)[c ? "animate" : "css"](h, a.animate), l.options.range === !0 && ("horizontal" === l.orientation ? (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        left: i + "%"
                    }, a.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        width: i - e + "%"
                    }, {
                        queue: !1,
                        duration: a.animate
                    })) : (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        bottom: i + "%"
                    }, a.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        height: i - e + "%"
                    }, {
                        queue: !1,
                        duration: a.animate
                    }))), e = i
                }) : (n = this.value(), s = this._valueMin(), o = this._valueMax(), i = o !== s ? (n - s) / (o - s) * 100 : 0, h["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[c ? "animate" : "css"](h, a.animate), "min" === r && "horizontal" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    width: i + "%"
                }, a.animate), "max" === r && "horizontal" === this.orientation && this.range[c ? "animate" : "css"]({
                    width: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: a.animate
                }), "min" === r && "vertical" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    height: i + "%"
                }, a.animate), "max" === r && "vertical" === this.orientation && this.range[c ? "animate" : "css"]({
                    height: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: a.animate
                }))
            }
        })
    }(jQuery),
    function(t) {
        function e(t) {
            return function() {
                var e = this.element.val();
                t.apply(this, arguments), this._refresh(), e !== this.element.val() && this._trigger("change")
            }
        }
        t.widget("ui.spinner", {
            version: "1.9.1",
            defaultElement: "<input>",
            widgetEventPrefix: "spin",
            options: {
                culture: null,
                icons: {
                    down: "ui-icon-triangle-1-s",
                    up: "ui-icon-triangle-1-n"
                },
                incremental: !0,
                max: null,
                min: null,
                numberFormat: null,
                page: 10,
                step: 1,
                change: null,
                spin: null,
                start: null,
                stop: null
            },
            _create: function() {
                this._setOption("max", this.options.max), this._setOption("min", this.options.min), this._setOption("step", this.options.step), this._value(this.element.val(), !0), this._draw(), this._on(this._events), this._refresh(), this._on(this.window, {
                    beforeunload: function() {
                        this.element.removeAttr("autocomplete")
                    }
                })
            },
            _getCreateOptions: function() {
                var e = {},
                    i = this.element;
                return t.each(["min", "max", "step"], function(t, n) {
                    var s = i.attr(n);
                    void 0 !== s && s.length && (e[n] = s)
                }), e
            },
            _events: {
                keydown: function(t) {
                    this._start(t) && this._keydown(t) && t.preventDefault()
                },
                keyup: "_stop",
                focus: function() {
                    this.previous = this.element.val()
                },
                blur: function(t) {
                    return this.cancelBlur ? void delete this.cancelBlur : (this._refresh(), void(this.previous !== this.element.val() && this._trigger("change", t)))
                },
                mousewheel: function(t, e) {
                    return e ? this.spinning || this._start(t) ? (this._spin((e > 0 ? 1 : -1) * this.options.step, t), clearTimeout(this.mousewheelTimer), this.mousewheelTimer = this._delay(function() {
                        this.spinning && this._stop(t)
                    }, 100), t.preventDefault(), void 0) : !1 : void 0
                },
                "mousedown .ui-spinner-button": function(e) {
                    function i() {
                        var t = this.element[0] === this.document[0].activeElement;
                        t || (this.element.focus(), this.previous = n, this._delay(function() {
                            this.previous = n
                        }))
                    }
                    var n;
                    n = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val(), e.preventDefault(), i.call(this), this.cancelBlur = !0, this._delay(function() {
                        delete this.cancelBlur, i.call(this)
                    }), this._start(e) !== !1 && this._repeat(null, t(e.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, e)
                },
                "mouseup .ui-spinner-button": "_stop",
                "mouseenter .ui-spinner-button": function(e) {
                    return t(e.currentTarget).hasClass("ui-state-active") ? this._start(e) === !1 ? !1 : void this._repeat(null, t(e.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, e) : void 0
                },
                "mouseleave .ui-spinner-button": "_stop"
            },
            _draw: function() {
                var t = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
                this.element.attr("role", "spinbutton"), this.buttons = t.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all"), this.buttons.height() > Math.ceil(.5 * t.height()) && t.height() > 0 && t.height(t.height()), this.options.disabled && this.disable()
            },
            _keydown: function(e) {
                var i = this.options,
                    n = t.ui.keyCode;
                switch (e.keyCode) {
                    case n.UP:
                        return this._repeat(null, 1, e), !0;
                    case n.DOWN:
                        return this._repeat(null, -1, e), !0;
                    case n.PAGE_UP:
                        return this._repeat(null, i.page, e), !0;
                    case n.PAGE_DOWN:
                        return this._repeat(null, -i.page, e), !0
                }
                return !1
            },
            _uiSpinnerHtml: function() {
                return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>"
            },
            _buttonHtml: function() {
                return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;</span></a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon " + this.options.icons.down + "'>&#9660;</span></a>"
            },
            _start: function(t) {
                return this.spinning || this._trigger("start", t) !== !1 ? (this.counter || (this.counter = 1), this.spinning = !0, !0) : !1
            },
            _repeat: function(t, e, i) {
                t = t || 500, clearTimeout(this.timer), this.timer = this._delay(function() {
                    this._repeat(40, e, i)
                }, t), this._spin(e * this.options.step, i)
            },
            _spin: function(t, e) {
                var i = this.value() || 0;
                this.counter || (this.counter = 1), i = this._adjustValue(i + t * this._increment(this.counter)), this.spinning && this._trigger("spin", e, {
                    value: i
                }) === !1 || (this._value(i), this.counter++)
            },
            _increment: function(e) {
                var i = this.options.incremental;
                return i ? t.isFunction(i) ? i(e) : Math.floor(e * e * e / 5e4 - e * e / 500 + 17 * e / 200 + 1) : 1
            },
            _precision: function() {
                var t = this._precisionOf(this.options.step);
                return null !== this.options.min && (t = Math.max(t, this._precisionOf(this.options.min))), t
            },
            _precisionOf: function(t) {
                var e = t.toString(),
                    i = e.indexOf(".");
                return -1 === i ? 0 : e.length - i - 1
            },
            _adjustValue: function(t) {
                var e, i, n = this.options;
                return e = null !== n.min ? n.min : 0, i = t - e, i = Math.round(i / n.step) * n.step, t = e + i, t = parseFloat(t.toFixed(this._precision())), null !== n.max && t > n.max ? n.max : null !== n.min && t < n.min ? n.min : t
            },
            _stop: function(t) {
                this.spinning && (clearTimeout(this.timer), clearTimeout(this.mousewheelTimer), this.counter = 0, this.spinning = !1, this._trigger("stop", t))
            },
            _setOption: function(t, e) {
                if ("culture" === t || "numberFormat" === t) {
                    var i = this._parse(this.element.val());
                    return this.options[t] = e, void this.element.val(this._format(i))
                }("max" === t || "min" === t || "step" === t) && "string" == typeof e && (e = this._parse(e)), this._super(t, e), "disabled" === t && (e ? (this.element.prop("disabled", !0), this.buttons.button("disable")) : (this.element.prop("disabled", !1), this.buttons.button("enable")))
            },
            _setOptions: e(function(t) {
                this._super(t), this._value(this.element.val())
            }),
            _parse: function(t) {
                return "string" == typeof t && "" !== t && (t = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(t, 10, this.options.culture) : +t), "" === t || isNaN(t) ? null : t
            },
            _format: function(t) {
                return "" === t ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(t, this.options.numberFormat, this.options.culture) : t
            },
            _refresh: function() {
                this.element.attr({
                    "aria-valuemin": this.options.min,
                    "aria-valuemax": this.options.max,
                    "aria-valuenow": this._parse(this.element.val())
                })
            },
            _value: function(t, e) {
                var i;
                "" !== t && (i = this._parse(t), null !== i && (e || (i = this._adjustValue(i)), t = this._format(i))), this.element.val(t), this._refresh()
            },
            _destroy: function() {
                this.element.removeClass("ui-spinner-input").prop("disabled", !1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.uiSpinner.replaceWith(this.element)
            },
            stepUp: e(function(t) {
                this._stepUp(t)
            }),
            _stepUp: function(t) {
                this._spin((t || 1) * this.options.step)
            },
            stepDown: e(function(t) {
                this._stepDown(t)
            }),
            _stepDown: function(t) {
                this._spin((t || 1) * -this.options.step)
            },
            pageUp: e(function(t) {
                this._stepUp((t || 1) * this.options.page)
            }),
            pageDown: e(function(t) {
                this._stepDown((t || 1) * this.options.page)
            }),
            value: function(t) {
                return arguments.length ? void e(this._value).call(this, t) : this._parse(this.element.val())
            },
            widget: function() {
                return this.uiSpinner
            }
        })
    }(jQuery),
    function(t, e) {
        function i() {
            return ++s
        }

        function n(t) {
            return t.hash.length > 1 && t.href.replace(o, "") === location.href.replace(o, "")
        }
        var s = 0,
            o = /#.*$/;
        t.widget("ui.tabs", {
            version: "1.9.1",
            delay: 300,
            options: {
                active: null,
                collapsible: !1,
                event: "click",
                heightStyle: "content",
                hide: null,
                show: null,
                activate: null,
                beforeActivate: null,
                beforeLoad: null,
                load: null
            },
            _create: function() {
                var e = this,
                    i = this.options,
                    n = i.active,
                    s = location.hash.substring(1);
                this.running = !1, this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", i.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(e) {
                    t(this).is(".ui-state-disabled") && e.preventDefault()
                }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
                    t(this).closest("li").is(".ui-state-disabled") && this.blur()
                }), this._processTabs(), null === n && (s && this.tabs.each(function(e, i) {
                    return t(i).attr("aria-controls") === s ? (n = e, !1) : void 0
                }), null === n && (n = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === n || -1 === n) && (n = this.tabs.length ? 0 : !1)), n !== !1 && (n = this.tabs.index(this.tabs.eq(n)), -1 === n && (n = i.collapsible ? !1 : 0)), i.active = n, !i.collapsible && i.active === !1 && this.anchors.length && (i.active = 0), t.isArray(i.disabled) && (i.disabled = t.unique(i.disabled.concat(t.map(this.tabs.filter(".ui-state-disabled"), function(t) {
                    return e.tabs.index(t)
                }))).sort()), this.active = this.options.active !== !1 && this.anchors.length ? this._findActive(this.options.active) : t(), this._refresh(), this.active.length && this.load(i.active)
            },
            _getCreateEventData: function() {
                return {
                    tab: this.active,
                    panel: this.active.length ? this._getPanelForTab(this.active) : t()
                }
            },
            _tabKeydown: function(e) {
                var i = t(this.document[0].activeElement).closest("li"),
                    n = this.tabs.index(i),
                    s = !0;
                if (!this._handlePageNav(e)) {
                    switch (e.keyCode) {
                        case t.ui.keyCode.RIGHT:
                        case t.ui.keyCode.DOWN:
                            n++;
                            break;
                        case t.ui.keyCode.UP:
                        case t.ui.keyCode.LEFT:
                            s = !1, n--;
                            break;
                        case t.ui.keyCode.END:
                            n = this.anchors.length - 1;
                            break;
                        case t.ui.keyCode.HOME:
                            n = 0;
                            break;
                        case t.ui.keyCode.SPACE:
                            return e.preventDefault(), clearTimeout(this.activating), this._activate(n), void 0;
                        case t.ui.keyCode.ENTER:
                            return e.preventDefault(), clearTimeout(this.activating), this._activate(n === this.options.active ? !1 : n), void 0;
                        default:
                            return
                    }
                    e.preventDefault(), clearTimeout(this.activating), n = this._focusNextTab(n, s), e.ctrlKey || (i.attr("aria-selected", "false"), this.tabs.eq(n).attr("aria-selected", "true"), this.activating = this._delay(function() {
                        this.option("active", n)
                    }, this.delay))
                }
            },
            _panelKeydown: function(e) {
                this._handlePageNav(e) || e.ctrlKey && e.keyCode === t.ui.keyCode.UP && (e.preventDefault(), this.active.focus())
            },
            _handlePageNav: function(e) {
                return e.altKey && e.keyCode === t.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : e.altKey && e.keyCode === t.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : void 0
            },
            _findNextTab: function(e, i) {
                function n() {
                    return e > s && (e = 0), 0 > e && (e = s), e
                }
                for (var s = this.tabs.length - 1; - 1 !== t.inArray(n(), this.options.disabled);) e = i ? e + 1 : e - 1;
                return e
            },
            _focusNextTab: function(t, e) {
                return t = this._findNextTab(t, e), this.tabs.eq(t).focus(), t
            },
            _setOption: function(t, e) {
                return "active" === t ? void this._activate(e) : "disabled" === t ? void this._setupDisabled(e) : (this._super(t, e), "collapsible" === t && (this.element.toggleClass("ui-tabs-collapsible", e), !e && this.options.active === !1 && this._activate(0)), "event" === t && this._setupEvents(e), "heightStyle" === t && this._setupHeightStyle(e), void 0)
            },
            _tabId: function(t) {
                return t.attr("aria-controls") || "ui-tabs-" + i()
            },
            _sanitizeSelector: function(t) {
                return t ? t.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
            },
            refresh: function() {
                var e = this.options,
                    i = this.tablist.children(":has(a[href])");
                e.disabled = t.map(i.filter(".ui-state-disabled"), function(t) {
                    return i.index(t)
                }), this._processTabs(), e.active !== !1 && this.anchors.length ? this.active.length && !t.contains(this.tablist[0], this.active[0]) ? this.tabs.length === e.disabled.length ? (e.active = !1, this.active = t()) : this._activate(this._findNextTab(Math.max(0, e.active - 1), !1)) : e.active = this.tabs.index(this.active) : (e.active = !1, this.active = t()), this._refresh()
            },
            _refresh: function() {
                this._setupDisabled(this.options.disabled), this._setupEvents(this.options.event), this._setupHeightStyle(this.options.heightStyle), this.tabs.not(this.active).attr({
                    "aria-selected": "false",
                    tabIndex: -1
                }), this.panels.not(this._getPanelForTab(this.active)).hide().attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }), this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                    "aria-selected": "true",
                    tabIndex: 0
                }), this._getPanelForTab(this.active).show().attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                })) : this.tabs.eq(0).attr("tabIndex", 0)
            },
            _processTabs: function() {
                var e = this;
                this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist"), this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                    role: "tab",
                    tabIndex: -1
                }), this.anchors = this.tabs.map(function() {
                    return t("a", this)[0]
                }).addClass("ui-tabs-anchor").attr({
                    role: "presentation",
                    tabIndex: -1
                }), this.panels = t(), this.anchors.each(function(i, s) {
                    var o, r, a, l = t(s).uniqueId().attr("id"),
                        c = t(s).closest("li"),
                        h = c.attr("aria-controls");
                    n(s) ? (o = s.hash, r = e.element.find(e._sanitizeSelector(o))) : (a = e._tabId(c), o = "#" + a, r = e.element.find(o), r.length || (r = e._createPanel(a), r.insertAfter(e.panels[i - 1] || e.tablist)), r.attr("aria-live", "polite")), r.length && (e.panels = e.panels.add(r)), h && c.data("ui-tabs-aria-controls", h), c.attr({
                        "aria-controls": o.substring(1),
                        "aria-labelledby": l
                    }), r.attr("aria-labelledby", l)
                }), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel")
            },
            _getList: function() {
                return this.element.find("ol,ul").eq(0)
            },
            _createPanel: function(e) {
                return t("<div>").attr("id", e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
            },
            _setupDisabled: function(e) {
                t.isArray(e) && (e.length ? e.length === this.anchors.length && (e = !0) : e = !1);
                for (var i, n = 0; i = this.tabs[n]; n++) e === !0 || -1 !== t.inArray(n, e) ? t(i).addClass("ui-state-disabled").attr("aria-disabled", "true") : t(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");
                this.options.disabled = e
            },
            _setupEvents: function(e) {
                var i = {
                    click: function(t) {
                        t.preventDefault()
                    }
                };
                e && t.each(e.split(" "), function(t, e) {
                    i[e] = "_eventHandler"
                }), this._off(this.anchors.add(this.tabs).add(this.panels)), this._on(this.anchors, i), this._on(this.tabs, {
                    keydown: "_tabKeydown"
                }), this._on(this.panels, {
                    keydown: "_panelKeydown"
                }), this._focusable(this.tabs), this._hoverable(this.tabs)
            },
            _setupHeightStyle: function(e) {
                var i, n, s = this.element.parent();
                "fill" === e ? (t.support.minHeight || (n = s.css("overflow"), s.css("overflow", "hidden")), i = s.height(), this.element.siblings(":visible").each(function() {
                    var e = t(this),
                        n = e.css("position");
                    "absolute" !== n && "fixed" !== n && (i -= e.outerHeight(!0))
                }), n && s.css("overflow", n), this.element.children().not(this.panels).each(function() {
                    i -= t(this).outerHeight(!0)
                }), this.panels.each(function() {
                    t(this).height(Math.max(0, i - t(this).innerHeight() + t(this).height()))
                }).css("overflow", "auto")) : "auto" === e && (i = 0, this.panels.each(function() {
                    i = Math.max(i, t(this).height("").height())
                }).height(i))
            },
            _eventHandler: function(e) {
                var i = this.options,
                    n = this.active,
                    s = t(e.currentTarget),
                    o = s.closest("li"),
                    r = o[0] === n[0],
                    a = r && i.collapsible,
                    l = a ? t() : this._getPanelForTab(o),
                    c = n.length ? this._getPanelForTab(n) : t(),
                    h = {
                        oldTab: n,
                        oldPanel: c,
                        newTab: a ? t() : o,
                        newPanel: l
                    };
                e.preventDefault(), o.hasClass("ui-state-disabled") || o.hasClass("ui-tabs-loading") || this.running || r && !i.collapsible || this._trigger("beforeActivate", e, h) === !1 || (i.active = a ? !1 : this.tabs.index(o), this.active = r ? t() : o, this.xhr && this.xhr.abort(), !c.length && !l.length && t.error("jQuery UI Tabs: Mismatching fragment identifier."), l.length && this.load(this.tabs.index(o), e), this._toggle(e, h))
            },
            _toggle: function(e, i) {
                function n() {
                    o.running = !1, o._trigger("activate", e, i)
                }

                function s() {
                    i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), r.length && o.options.show ? o._show(r, o.options.show, n) : (r.show(), n())
                }
                var o = this,
                    r = i.newPanel,
                    a = i.oldPanel;
                this.running = !0, a.length && this.options.hide ? this._hide(a, this.options.hide, function() {
                    i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), s()
                }) : (i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), a.hide(), s()), a.attr({
                    "aria-expanded": "false",
                    "aria-hidden": "true"
                }), i.oldTab.attr("aria-selected", "false"), r.length && a.length ? i.oldTab.attr("tabIndex", -1) : r.length && this.tabs.filter(function() {
                    return 0 === t(this).attr("tabIndex")
                }).attr("tabIndex", -1), r.attr({
                    "aria-expanded": "true",
                    "aria-hidden": "false"
                }), i.newTab.attr({
                    "aria-selected": "true",
                    tabIndex: 0
                })
            },
            _activate: function(e) {
                var i, n = this._findActive(e);
                n[0] !== this.active[0] && (n.length || (n = this.active), i = n.find(".ui-tabs-anchor")[0], this._eventHandler({
                    target: i,
                    currentTarget: i,
                    preventDefault: t.noop
                }))
            },
            _findActive: function(e) {
                return e === !1 ? t() : this.tabs.eq(e)
            },
            _getIndex: function(t) {
                return "string" == typeof t && (t = this.anchors.index(this.anchors.filter("[href$='" + t + "']"))), t
            },
            _destroy: function() {
                this.xhr && this.xhr.abort(), this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"), this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"), this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeData("href.tabs").removeData("load.tabs").removeUniqueId(), this.tabs.add(this.panels).each(function() {
                    t.data(this, "ui-tabs-destroy") ? t(this).remove() : t(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
                }), this.tabs.each(function() {
                    var e = t(this),
                        i = e.data("ui-tabs-aria-controls");
                    i ? e.attr("aria-controls", i) : e.removeAttr("aria-controls")
                }), "content" !== this.options.heightStyle && this.panels.css("height", "")
            },
            enable: function(i) {
                var n = this.options.disabled;
                n !== !1 && (i === e ? n = !1 : (i = this._getIndex(i), n = t.isArray(n) ? t.map(n, function(t) {
                    return t !== i ? t : null
                }) : t.map(this.tabs, function(t, e) {
                    return e !== i ? e : null
                })), this._setupDisabled(n))
            },
            disable: function(i) {
                var n = this.options.disabled;
                if (n !== !0) {
                    if (i === e) n = !0;
                    else {
                        if (i = this._getIndex(i), -1 !== t.inArray(i, n)) return;
                        n = t.isArray(n) ? t.merge([i], n).sort() : [i]
                    }
                    this._setupDisabled(n)
                }
            },
            load: function(e, i) {
                e = this._getIndex(e);
                var s = this,
                    o = this.tabs.eq(e),
                    r = o.find(".ui-tabs-anchor"),
                    a = this._getPanelForTab(o),
                    l = {
                        tab: o,
                        panel: a
                    };
                n(r[0]) || (this.xhr = t.ajax(this._ajaxSettings(r, i, l)), this.xhr && "canceled" !== this.xhr.statusText && (o.addClass("ui-tabs-loading"), a.attr("aria-busy", "true"), this.xhr.success(function(t) {
                    setTimeout(function() {
                        a.html(t), s._trigger("load", i, l)
                    }, 1)
                }).complete(function(t, e) {
                    setTimeout(function() {
                        "abort" === e && s.panels.stop(!1, !0), o.removeClass("ui-tabs-loading"), a.removeAttr("aria-busy"), t === s.xhr && delete s.xhr
                    }, 1)
                })))
            },
            _ajaxSettings: function(e, i, n) {
                var s = this;
                return {
                    url: e.attr("href"),
                    beforeSend: function(e, o) {
                        return s._trigger("beforeLoad", i, t.extend({
                            jqXHR: e,
                            ajaxSettings: o
                        }, n))
                    }
                }
            },
            _getPanelForTab: function(e) {
                var i = t(e).attr("aria-controls");
                return this.element.find(this._sanitizeSelector("#" + i))
            }
        }), t.uiBackCompat !== !1 && (t.ui.tabs.prototype._ui = function(t, e) {
            return {
                tab: t,
                panel: e,
                index: this.anchors.index(t)
            }
        }, t.widget("ui.tabs", t.ui.tabs, {
            url: function(t, e) {
                this.anchors.eq(t).attr("href", e)
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                ajaxOptions: null,
                cache: !1
            },
            _create: function() {
                this._super();
                var e = this;
                this._on({
                    tabsbeforeload: function(i, n) {
                        return t.data(n.tab[0], "cache.tabs") ? void i.preventDefault() : void n.jqXHR.success(function() {
                            e.options.cache && t.data(n.tab[0], "cache.tabs", !0)
                        })
                    }
                })
            },
            _ajaxSettings: function(e, i, n) {
                var s = this.options.ajaxOptions;
                return t.extend({}, s, {
                    error: function(t, e) {
                        try {
                            s.error(t, e, n.tab.closest("li").index(), n.tab[0])
                        } catch (i) {}
                    }
                }, this._superApply(arguments))
            },
            _setOption: function(t, e) {
                "cache" === t && e === !1 && this.anchors.removeData("cache.tabs"), this._super(t, e)
            },
            _destroy: function() {
                this.anchors.removeData("cache.tabs"), this._super()
            },
            url: function(t) {
                this.anchors.eq(t).removeData("cache.tabs"), this._superApply(arguments)
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            abort: function() {
                this.xhr && this.xhr.abort()
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                spinner: "<em>Loading&#8230;</em>"
            },
            _create: function() {
                this._super(), this._on({
                    tabsbeforeload: function(t, e) {
                        if (t.target === this.element[0] && this.options.spinner) {
                            var i = e.tab.find("span"),
                                n = i.html();
                            i.html(this.options.spinner), e.jqXHR.complete(function() {
                                i.html(n)
                            })
                        }
                    }
                })
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                enable: null,
                disable: null
            },
            enable: function(e) {
                var i, n = this.options;
                (e && n.disabled === !0 || t.isArray(n.disabled) && -1 !== t.inArray(e, n.disabled)) && (i = !0), this._superApply(arguments), i && this._trigger("enable", null, this._ui(this.anchors[e], this.panels[e]))
            },
            disable: function(e) {
                var i, n = this.options;
                (e && n.disabled === !1 || t.isArray(n.disabled) && -1 === t.inArray(e, n.disabled)) && (i = !0), this._superApply(arguments), i && this._trigger("disable", null, this._ui(this.anchors[e], this.panels[e]))
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                add: null,
                remove: null,
                tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"
            },
            add: function(i, n, s) {
                s === e && (s = this.anchors.length);
                var o, r, a = this.options,
                    l = t(a.tabTemplate.replace(/#\{href\}/g, i).replace(/#\{label\}/g, n)),
                    c = i.indexOf("#") ? this._tabId(l) : i.replace("#", "");
                return l.addClass("ui-state-default ui-corner-top").data("ui-tabs-destroy", !0), l.attr("aria-controls", c), o = s >= this.tabs.length, r = this.element.find("#" + c), r.length || (r = this._createPanel(c), o ? s > 0 ? r.insertAfter(this.panels.eq(-1)) : r.appendTo(this.element) : r.insertBefore(this.panels[s])), r.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").hide(), o ? l.appendTo(this.tablist) : l.insertBefore(this.tabs[s]), a.disabled = t.map(a.disabled, function(t) {
                    return t >= s ? ++t : t
                }), this.refresh(), 1 === this.tabs.length && a.active === !1 && this.option("active", 0), this._trigger("add", null, this._ui(this.anchors[s], this.panels[s])), this
            },
            remove: function(e) {
                e = this._getIndex(e);
                var i = this.options,
                    n = this.tabs.eq(e).remove(),
                    s = this._getPanelForTab(n).remove();
                return n.hasClass("ui-tabs-active") && this.anchors.length > 2 && this._activate(e + (e + 1 < this.anchors.length ? 1 : -1)), i.disabled = t.map(t.grep(i.disabled, function(t) {
                    return t !== e
                }), function(t) {
                    return t >= e ? --t : t
                }), this.refresh(), this._trigger("remove", null, this._ui(n.find("a")[0], s[0])), this
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            length: function() {
                return this.anchors.length
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                idPrefix: "ui-tabs-"
            },
            _tabId: function(e) {
                var n = e.is("li") ? e.find("a[href]") : e;
                return n = n[0], t(n).closest("li").attr("aria-controls") || n.title && n.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF\-]/g, "") || this.options.idPrefix + i()
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                panelTemplate: "<div></div>"
            },
            _createPanel: function(e) {
                return t(this.options.panelTemplate).attr("id", e).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            _create: function() {
                var t = this.options;
                null === t.active && t.selected !== e && (t.active = -1 === t.selected ? !1 : t.selected), this._super(), t.selected = t.active, t.selected === !1 && (t.selected = -1)
            },
            _setOption: function(t, e) {
                if ("selected" !== t) return this._super(t, e);
                var i = this.options;
                this._super("active", -1 === e ? !1 : e), i.selected = i.active, i.selected === !1 && (i.selected = -1)
            },
            _eventHandler: function() {
                this._superApply(arguments), this.options.selected = this.options.active, this.options.selected === !1 && (this.options.selected = -1)
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                show: null,
                select: null
            },
            _create: function() {
                this._super(), this.options.active !== !1 && this._trigger("show", null, this._ui(this.active.find(".ui-tabs-anchor")[0], this._getPanelForTab(this.active)[0]))
            },
            _trigger: function(t, e, i) {
                var n = this._superApply(arguments);
                return n ? ("beforeActivate" === t && i.newTab.length ? n = this._super("select", e, {
                    tab: i.newTab.find(".ui-tabs-anchor")[0],
                    panel: i.newPanel[0],
                    index: i.newTab.closest("li").index()
                }) : "activate" === t && i.newTab.length && (n = this._super("show", e, {
                    tab: i.newTab.find(".ui-tabs-anchor")[0],
                    panel: i.newPanel[0],
                    index: i.newTab.closest("li").index()
                })), n) : !1
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            select: function(t) {
                if (t = this._getIndex(t), -1 === t) {
                    if (!this.options.collapsible || -1 === this.options.selected) return;
                    t = this.options.selected
                }
                this.anchors.eq(t).trigger(this.options.event + this.eventNamespace)
            }
        }), function() {
            var e = 0;
            t.widget("ui.tabs", t.ui.tabs, {
                options: {
                    cookie: null
                },
                _create: function() {
                    var t, e = this.options;
                    null == e.active && e.cookie && (t = parseInt(this._cookie(), 10), -1 === t && (t = !1), e.active = t), this._super()
                },
                _cookie: function(i) {
                    var n = [this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + ++e)];
                    return arguments.length && (n.push(i === !1 ? -1 : i), n.push(this.options.cookie)), t.cookie.apply(null, n)
                },
                _refresh: function() {
                    this._super(), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
                },
                _eventHandler: function() {
                    this._superApply(arguments), this.options.cookie && this._cookie(this.options.active, this.options.cookie)
                },
                _destroy: function() {
                    this._super(), this.options.cookie && this._cookie(null, this.options.cookie)
                }
            })
        }(), t.widget("ui.tabs", t.ui.tabs, {
            _trigger: function(e, i, n) {
                var s = t.extend({}, n);
                return "load" === e && (s.panel = s.panel[0], s.tab = s.tab.find(".ui-tabs-anchor")[0]), this._super(e, i, s)
            }
        }), t.widget("ui.tabs", t.ui.tabs, {
            options: {
                fx: null
            },
            _getFx: function() {
                var e, i, n = this.options.fx;
                return n && (t.isArray(n) ? (e = n[0], i = n[1]) : e = i = n), n ? {
                    show: i,
                    hide: e
                } : null
            },
            _toggle: function(t, e) {
                function i() {
                    s.running = !1, s._trigger("activate", t, e)
                }

                function n() {
                    e.newTab.closest("li").addClass("ui-tabs-active ui-state-active"), o.length && a.show ? o.animate(a.show, a.show.duration, function() {
                        i()
                    }) : (o.show(), i())
                }
                var s = this,
                    o = e.newPanel,
                    r = e.oldPanel,
                    a = this._getFx();
                return a ? (s.running = !0, void(r.length && a.hide ? r.animate(a.hide, a.hide.duration, function() {
                    e.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), n()
                }) : (e.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), r.hide(), n()))) : this._super(t, e)
            }
        }))
    }(jQuery),
    function(t) {
        function e(e, i) {
            var n = (e.attr("aria-describedby") || "").split(/\s+/);
            n.push(i), e.data("ui-tooltip-id", i).attr("aria-describedby", t.trim(n.join(" ")))
        }

        function i(e) {
            var i = e.data("ui-tooltip-id"),
                n = (e.attr("aria-describedby") || "").split(/\s+/),
                s = t.inArray(i, n); - 1 !== s && n.splice(s, 1), e.removeData("ui-tooltip-id"), n = t.trim(n.join(" ")), n ? e.attr("aria-describedby", n) : e.removeAttr("aria-describedby")
        }
        var n = 0;
        t.widget("ui.tooltip", {
            version: "1.9.1",
            options: {
                content: function() {
                    return t(this).attr("title")
                },
                hide: !0,
                items: "[title]:not([disabled])",
                position: {
                    my: "left top+15",
                    at: "left bottom",
                    collision: "flipfit flipfit"
                },
                show: !0,
                tooltipClass: null,
                track: !1,
                close: null,
                open: null
            },
            _create: function() {
                this._on({
                    mouseover: "open",
                    focusin: "open"
                }), this.tooltips = {}, this.parents = {}, this.options.disabled && this._disable()
            },
            _setOption: function(e, i) {
                var n = this;
                return "disabled" === e ? (this[i ? "_disable" : "_enable"](), void(this.options[e] = i)) : (this._super(e, i), void("content" === e && t.each(this.tooltips, function(t, e) {
                    n._updateContent(e)
                })))
            },
            _disable: function() {
                var e = this;
                t.each(this.tooltips, function(i, n) {
                    var s = t.Event("blur");
                    s.target = s.currentTarget = n[0], e.close(s, !0)
                }), this.element.find(this.options.items).andSelf().each(function() {
                    var e = t(this);
                    e.is("[title]") && e.data("ui-tooltip-title", e.attr("title")).attr("title", "")
                })
            },
            _enable: function() {
                this.element.find(this.options.items).andSelf().each(function() {
                    var e = t(this);
                    e.data("ui-tooltip-title") && e.attr("title", e.data("ui-tooltip-title"))
                })
            },
            open: function(e) {
                var i = this,
                    n = t(e ? e.target : this.element).closest(this.options.items);
                if (n.length) return this.options.track && n.data("ui-tooltip-id") ? (this._find(n).position(t.extend({
                    of: n
                }, this.options.position)), void this._off(this.document, "mousemove")) : (n.attr("title") && n.data("ui-tooltip-title", n.attr("title")), n.data("tooltip-open", !0), e && "mouseover" === e.type && n.parents().each(function() {
                    var e;
                    t(this).data("tooltip-open") && (e = t.Event("blur"), e.target = e.currentTarget = this, i.close(e, !0)), this.title && (t(this).uniqueId(), i.parents[this.id] = {
                        element: this,
                        title: this.title
                    }, this.title = "")
                }), this._updateContent(n, e), void 0)
            },
            _updateContent: function(t, e) {
                var i, n = this.options.content,
                    s = this;
                return "string" == typeof n ? this._open(e, t, n) : (i = n.call(t[0], function(i) {
                    t.data("tooltip-open") && s._delay(function() {
                        this._open(e, t, i)
                    })
                }), void(i && this._open(e, t, i)))
            },
            _open: function(i, n, s) {
                function o(t) {
                    c.of = t, r.is(":hidden") || r.position(c)
                }
                var r, a, l, c = t.extend({}, this.options.position);
                if (s) {
                    if (r = this._find(n), r.length) return void r.find(".ui-tooltip-content").html(s);
                    n.is("[title]") && (i && "mouseover" === i.type ? n.attr("title", "") : n.removeAttr("title")), r = this._tooltip(n), e(n, r.attr("id")), r.find(".ui-tooltip-content").html(s), this.options.track && i && /^mouse/.test(i.originalEvent.type) ? (this._on(this.document, {
                        mousemove: o
                    }), o(i)) : r.position(t.extend({
                        of: n
                    }, this.options.position)), r.hide(), this._show(r, this.options.show), this.options.show && this.options.show.delay && (l = setInterval(function() {
                        r.is(":visible") && (o(c.of), clearInterval(l))
                    }, t.fx.interval)), this._trigger("open", i, {
                        tooltip: r
                    }), a = {
                        keyup: function(e) {
                            if (e.keyCode === t.ui.keyCode.ESCAPE) {
                                var i = t.Event(e);
                                i.currentTarget = n[0], this.close(i, !0)
                            }
                        },
                        remove: function() {
                            this._removeTooltip(r)
                        }
                    }, i && "mouseover" !== i.type || (a.mouseleave = "close"), i && "focusin" !== i.type || (a.focusout = "close"), this._on(n, a)
                }
            },
            close: function(e) {
                var n = this,
                    s = t(e ? e.currentTarget : this.element),
                    o = this._find(s);
                this.closing || (s.data("ui-tooltip-title") && s.attr("title", s.data("ui-tooltip-title")), i(s), o.stop(!0), this._hide(o, this.options.hide, function() {
                    n._removeTooltip(t(this))
                }), s.removeData("tooltip-open"), this._off(s, "mouseleave focusout keyup"), s[0] !== this.element[0] && this._off(s, "remove"), this._off(this.document, "mousemove"), e && "mouseleave" === e.type && t.each(this.parents, function(t, e) {
                    e.element.title = e.title, delete n.parents[t]
                }), this.closing = !0, this._trigger("close", e, {
                    tooltip: o
                }), this.closing = !1)
            },
            _tooltip: function(e) {
                var i = "ui-tooltip-" + n++,
                    s = t("<div>").attr({
                        id: i,
                        role: "tooltip"
                    }).addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || ""));
                return t("<div>").addClass("ui-tooltip-content").appendTo(s), s.appendTo(this.document[0].body), t.fn.bgiframe && s.bgiframe(), this.tooltips[i] = e, s
            },
            _find: function(e) {
                var i = e.data("ui-tooltip-id");
                return i ? t("#" + i) : t()
            },
            _removeTooltip: function(t) {
                t.remove(), delete this.tooltips[t.attr("id")]
            },
            _destroy: function() {
                var e = this;
                t.each(this.tooltips, function(i, n) {
                    var s = t.Event("blur");
                    s.target = s.currentTarget = n[0], e.close(s, !0), t("#" + i).remove(), n.data("ui-tooltip-title") && (n.attr("title", n.data("ui-tooltip-title")), n.removeData("ui-tooltip-title"))
                })
            }
        })
    }(jQuery),
    function(t) {
        t.fn.fullpage = function(e) {
            function i(t) {
                t.find(".fp-slides").after('<div class="fp-controlArrow fp-prev"></div><div class="fp-controlArrow fp-next"></div>'), "#fff" != e.controlArrowColor && (t.find(".fp-controlArrow.fp-next").css("border-color", "transparent transparent transparent " + e.controlArrowColor), t.find(".fp-controlArrow.fp-prev").css("border-color", "transparent " + e.controlArrowColor + " transparent transparent")), e.loopHorizontal || t.find(".fp-controlArrow.fp-prev").hide()
            }

            function n() {
                t("body").append('<div id="fp-nav"><ul></ul></div>'), ce = t("#fp-nav"), ce.css("color", e.navigationColor), ce.addClass(e.navigationPosition);
                for (var i = 0; i < t(".fp-section").length; i++) {
                    var n = "";
                    e.anchors.length && (n = e.anchors[i]);
                    var s = '<li><a href="#' + n + '"><span></span></a>',
                        o = e.navigationTooltips[i];
                    void 0 !== o && "" != o && (s += '<div class="fp-tooltip ' + e.navigationPosition + '">' + o + "</div>"), s += "</li>", ce.find("ul").append(s)
                }
            }

            function s() {
                t(".fp-section").each(function() {
                    var e = t(this).find(".fp-slide");
                    e.length ? e.each(function() {
                        H(t(this))
                    }) : H(t(this))
                }), t.isFunction(e.afterRender) && e.afterRender.call(this)
            }

            function o() {
                var i;
                if (!e.autoScrolling || e.scrollBar) {
                    var n = t(window).scrollTop(),
                        s = 0,
                        o = Math.abs(n - t(".fp-section").first().offset().top);
                    t(".fp-section").each(function(e) {
                        var i = Math.abs(n - t(this).offset().top);
                        o > i && (s = e, o = i)
                    }), i = t(".fp-section").eq(s)
                }
                if ((!e.autoScrolling || e.scrollBar) && !i.hasClass("active")) {
                    xe = !0;
                    var r = t(".fp-section.active"),
                        a = r.index(".fp-section") + 1,
                        l = P(i),
                        c = i.data("anchor"),
                        h = i.index(".fp-section") + 1,
                        u = i.find(".fp-slide.active");
                    if (u.length) var d = u.data("anchor"),
                        p = u.index();
                    i.addClass("active").siblings().removeClass("active"), ge || (t.isFunction(e.onLeave) && e.onLeave.call(r, a, h, l), t.isFunction(e.afterLoad) && e.afterLoad.call(i, c, h)), M(c, 0), e.anchors.length && !ge && (ae = c, B(p, d, c, h)), clearTimeout(_e), _e = setTimeout(function() {
                        xe = !1
                    }, 100)
                }
                e.scrollBar && (clearTimeout(we), we = setTimeout(function() {
                    ge || (t(".fp-section.active").is(i) && (me = !0), f(i), me = !1)
                }, 1e3))
            }

            function r(t) {
                return t.find(".fp-slides").length ? t.find(".fp-slide.active").find(".fp-scrollable") : t.find(".fp-scrollable")
            }

            function a(e, i) {
                if (be[e]) {
                    var n, s;
                    if ("down" == e ? (n = "bottom", s = t.fn.fullpage.moveSectionDown) : (n = "top", s = t.fn.fullpage.moveSectionUp), i.length > 0) {
                        if (!N(n, i)) return !0;
                        s()
                    } else s()
                }
            }

            function l(i) {
                var n = i.originalEvent;
                if (!c(i.target)) {
                    e.autoScrolling && i.preventDefault();
                    var s = t(".fp-section.active"),
                        o = r(s);
                    if (!ge && !he) {
                        var l = Q(n);
                        Te = l.y, Se = l.x, s.find(".fp-slides").length && Math.abs(Ce - Se) > Math.abs(ke - Te) ? Math.abs(Ce - Se) > t(window).width() / 100 * e.touchSensitivity && (Ce > Se ? be.right && t.fn.fullpage.moveSlideRight() : be.left && t.fn.fullpage.moveSlideLeft()) : e.autoScrolling && Math.abs(ke - Te) > t(window).height() / 100 * e.touchSensitivity && (ke > Te ? a("down", o) : Te > ke && a("up", o))
                    }
                }
            }

            function c(i, n) {
                n = n || 0;
                var s = t(i).parent();
                return n < e.normalScrollElementTouchThreshold && s.is(e.normalScrollElements) ? !0 : n == e.normalScrollElementTouchThreshold ? !1 : c(s, ++n)
            }

            function h(i) {
                var n = i.originalEvent;
                e.scrollBar && t("html,body").stop();
                var s = Q(n);
                ke = s.y, Ce = s.x
            }

            function u(i) {
                if (e.autoScrolling) {
                    i = window.event || i;
                    var n = Math.max(-1, Math.min(1, i.wheelDelta || -i.deltaY || -i.detail));
                    e.scrollBar && (i.preventDefault ? i.preventDefault() : i.returnValue = !1);
                    var s = t(".fp-section.active"),
                        o = r(s);
                    return ge || (0 > n ? a("down", o) : a("up", o)), !1
                }
                e.scrollBar && t("html,body").stop()
            }

            function d(i) {
                var n = t(".fp-section.active"),
                    s = n.find(".fp-slides");
                if (s.length && !he) {
                    var o = s.find(".fp-slide.active"),
                        r = null;
                    if (r = "prev" === i ? o.prev(".fp-slide") : o.next(".fp-slide"), !r.length) {
                        if (!e.loopHorizontal) return;
                        r = o.siblings("prev" === i ? ":last" : ":first")
                    }
                    he = !0, x(s, r)
                }
            }

            function p() {
                t(".fp-slide.active").each(function() {
                    J(t(this))
                })
            }

            function f(i, n, s) {
                var o = i.position();
                if ("undefined" != typeof o) {
                    var r = {
                        element: i,
                        callback: n,
                        isMovementUp: s,
                        dest: o,
                        dtop: o.top,
                        yMovement: P(i),
                        anchorLink: i.data("anchor"),
                        sectionIndex: i.index(".fp-section"),
                        activeSlide: i.find(".fp-slide.active"),
                        activeSection: t(".fp-section.active"),
                        leavingSection: t(".fp-section.active").index(".fp-section") + 1,
                        localIsResizing: me
                    };
                    if (!(r.activeSection.is(i) && !me || e.scrollBar && t(window).scrollTop() === r.dtop)) {
                        if (r.activeSlide.length) var a = r.activeSlide.data("anchor"),
                            l = r.activeSlide.index();
                        e.autoScrolling && e.continuousVertical && "undefined" != typeof r.isMovementUp && (!r.isMovementUp && "up" == r.yMovement || r.isMovementUp && "down" == r.yMovement) && (r = v(r)), i.addClass("active").siblings().removeClass("active"), ge = !0, B(l, a, r.anchorLink, r.sectionIndex), t.isFunction(e.onLeave) && !r.localIsResizing && e.onLeave.call(r.activeSection, r.leavingSection, r.sectionIndex + 1, r.yMovement), g(r), ae = r.anchorLink, e.autoScrolling && M(r.anchorLink, r.sectionIndex)
                    }
                }
            }

            function g(i) {
                if (e.css3 && e.autoScrolling && !e.scrollBar) {
                    var n = "translate3d(0px, -" + i.dtop + "px, 0px)";
                    F(n, !0), setTimeout(function() {
                        y(i)
                    }, e.scrollingSpeed)
                } else {
                    var s = m(i);
                    t(s.element).animate(s.options, e.scrollingSpeed, e.easing).promise().done(function() {
                        y(i)
                    })
                }
            }

            function m(t) {
                var i = {};
                return e.autoScrolling && !e.scrollBar ? (i.options = {
                    top: -t.dtop
                }, i.element = "." + ve) : (i.options = {
                    scrollTop: t.dtop
                }, i.element = "html, body"), i
            }

            function v(e) {
                return e.isMovementUp ? t(".fp-section.active").before(e.activeSection.nextAll(".fp-section")) : t(".fp-section.active").after(e.activeSection.prevAll(".fp-section").get().reverse()), Z(t(".fp-section.active").position().top), p(), e.wrapAroundElements = e.activeSection, e.dest = e.element.position(), e.dtop = e.dest.top, e.yMovement = P(e.element), e
            }

            function b(e) {
                e.wrapAroundElements && e.wrapAroundElements.length && (e.isMovementUp ? t(".fp-section:first").before(e.wrapAroundElements) : t(".fp-section:last").after(e.wrapAroundElements), Z(t(".fp-section.active").position().top), p())
            }

            function y(i) {
                b(i), t.isFunction(e.afterLoad) && !i.localIsResizing && e.afterLoad.call(i.element, i.anchorLink, i.sectionIndex + 1), setTimeout(function() {
                    ge = !1, t.isFunction(i.callback) && i.callback.call(this)
                }, re)
            }

            function _() {
                var t = window.location.hash.replace("#", "").split("/"),
                    e = t[0],
                    i = t[1];
                e && R(e, i)
            }

            function w() {
                if (!xe) {
                    var t = window.location.hash.replace("#", "").split("/"),
                        e = t[0],
                        i = t[1];
                    if (e.length) {
                        var n = "undefined" == typeof ae,
                            s = "undefined" == typeof ae && "undefined" == typeof i && !he;
                        (e && e !== ae && !n || s || !he && le != i) && R(e, i)
                    }
                }
            }

            function x(i, n) {
                var s = n.position(),
                    o = i.find(".fp-slidesContainer").parent(),
                    r = n.index(),
                    a = i.closest(".fp-section"),
                    l = a.index(".fp-section"),
                    c = a.data("anchor"),
                    h = a.find(".fp-slidesNav"),
                    u = n.data("anchor"),
                    d = me;
                if (e.onSlideLeave) {
                    var p = a.find(".fp-slide.active"),
                        f = p.index(),
                        g = I(f, r);
                    d || "none" === g || t.isFunction(e.onSlideLeave) && e.onSlideLeave.call(p, c, l + 1, f, g)
                }
                n.addClass("active").siblings().removeClass("active"), "undefined" == typeof u && (u = r), !e.loopHorizontal && e.controlArrows && (a.find(".fp-controlArrow.fp-prev").toggle(0 != r), a.find(".fp-controlArrow.fp-next").toggle(!n.is(":last-child"))), a.hasClass("active") && B(r, u, c, l);
                var m = function() {
                    d || t.isFunction(e.afterSlideLoad) && e.afterSlideLoad.call(n, c, l + 1, u, r), he = !1
                };
                if (e.css3) {
                    var v = "translate3d(-" + s.left + "px, 0px, 0px)";
                    T(i.find(".fp-slidesContainer"), e.scrollingSpeed > 0).css(te(v)), setTimeout(function() {
                        m()
                    }, e.scrollingSpeed, e.easing)
                } else o.animate({
                    scrollLeft: s.left
                }, e.scrollingSpeed, e.easing, function() {
                    m()
                });
                h.find(".active").removeClass("active"), h.find("li").eq(r).find("a").addClass("active")
            }

            function k() {
                if (C(), ue) {
                    if ("text" !== t(document.activeElement).attr("type")) {
                        var e = t(window).height();
                        Math.abs(e - Ee) > 20 * Math.max(Ee, e) / 100 && (t.fn.fullpage.reBuild(!0), Ee = e)
                    }
                } else clearTimeout(De), De = setTimeout(function() {
                    t.fn.fullpage.reBuild(!0)
                }, 500)
            }

            function C() {
                if (e.responsive) {
                    var i = pe.hasClass("fp-responsive");
                    t(window).width() < e.responsive ? i || (t.fn.fullpage.setAutoScrolling(!1, "internal"), t("#fp-nav").hide(), pe.addClass("fp-responsive")) : i && (t.fn.fullpage.setAutoScrolling(ye.autoScrolling, "internal"), t("#fp-nav").show(), pe.removeClass("fp-responsive"))
                }
            }

            function T(t) {
                var i = "all " + e.scrollingSpeed + "ms " + e.easingcss3;
                return t.removeClass("fp-notransition"), t.css({
                    "-webkit-transition": i,
                    transition: i
                })
            }

            function S(t) {
                return t.addClass("fp-notransition")
            }

            function D(e, i) {
                var n = 825,
                    s = 900;
                if (n > e || s > i) {
                    var o = 100 * e / n,
                        r = 100 * i / s,
                        a = Math.min(o, r),
                        l = a.toFixed(2);
                    t("body").css("font-size", l + "%")
                } else t("body").css("font-size", "100%")
            }

            function E(i, n) {
                e.navigation && (t("#fp-nav").find(".active").removeClass("active"), i ? t("#fp-nav").find('a[href="#' + i + '"]').addClass("active") : t("#fp-nav").find("li").eq(n).find("a").addClass("active"))
            }

            function A(i) {
                e.menu && (t(e.menu).find(".active").removeClass("active"), t(e.menu).find('[data-menuanchor="' + i + '"]').addClass("active"))
            }

            function M(t, e) {
                A(t), E(t, e)
            }

            function N(t, e) {
                return "top" === t ? !e.scrollTop() : "bottom" === t ? e.scrollTop() + 1 + e.innerHeight() >= e[0].scrollHeight : void 0
            }

            function P(e) {
                var i = t(".fp-section.active").index(".fp-section"),
                    n = e.index(".fp-section");
                return i == n ? "none" : i > n ? "up" : "down"
            }

            function I(t, e) {
                return t == e ? "none" : t > e ? "left" : "right"
            }

            function H(t) {
                t.css("overflow", "hidden");
                var i, n = t.closest(".fp-section"),
                    s = t.find(".fp-scrollable");
                s.length ? i = s.get(0).scrollHeight : (i = t.get(0).scrollHeight, e.verticalCentered && (i = t.find(".fp-tableCell").get(0).scrollHeight));
                var o = fe - parseInt(n.css("padding-bottom")) - parseInt(n.css("padding-top"));
                i > o ? s.length ? s.css("height", o + "px").parent().css("height", o + "px") : (e.verticalCentered ? t.find(".fp-tableCell").wrapInner('<div class="fp-scrollable" />') : t.wrapInner('<div class="fp-scrollable" />'), t.find(".fp-scrollable").slimScroll({
                    allowPageScroll: !0,
                    height: o + "px",
                    size: "10px",
                    alwaysVisible: !0
                })) : O(t), t.css("overflow", "")
            }

            function O(t) {
                t.find(".fp-scrollable").children().first().unwrap().unwrap(), t.find(".slimScrollBar").remove(), t.find(".slimScrollRail").remove()
            }

            function z(t) {
                t.addClass("fp-table").wrapInner('<div class="fp-tableCell" style="height:' + L(t) + 'px;" />')
            }

            function L(t) {
                var i = fe;
                if (e.paddingTop || e.paddingBottom) {
                    var n = t;
                    n.hasClass("fp-section") || (n = t.closest(".fp-section"));
                    var s = parseInt(n.css("padding-top")) + parseInt(n.css("padding-bottom"));
                    i = fe - s
                }
                return i
            }

            function F(t, e) {
                e ? T(pe) : S(pe), pe.css(te(t)), setTimeout(function() {
                    pe.removeClass("fp-notransition")
                }, 10)
            }

            function R(e, i) {
                var n;
                "undefined" == typeof i && (i = 0), n = isNaN(e) ? t('[data-anchor="' + e + '"]') : t(".fp-section").eq(e - 1), e === ae || n.hasClass("active") ? j(n, i) : f(n, function() {
                    j(n, i)
                })
            }

            function j(t, e) {
                if ("undefined" != typeof e) {
                    var i = t.find(".fp-slides"),
                        n = i.find('[data-anchor="' + e + '"]');
                    n.length || (n = i.find(".fp-slide").eq(e)), n.length && x(i, n)
                }
            }

            function W(t, i) {
                t.append('<div class="fp-slidesNav"><ul></ul></div>');
                var n = t.find(".fp-slidesNav");
                n.addClass(e.slidesNavPosition);
                for (var s = 0; i > s; s++) n.find("ul").append('<li><a href="#"><span></span></a></li>');
                n.css("margin-left", "-" + n.width() / 2 + "px"), n.find("li").first().find("a").addClass("active")
            }

            function B(t, i, n, s) {
                var o = "";
                e.anchors.length ? (t ? ("undefined" != typeof n && (o = n), "undefined" == typeof i && (i = t), le = i, $(o + "/" + i)) : "undefined" != typeof t ? (le = i, $(n)) : $(n), q(location.hash)) : q("undefined" != typeof t ? s + "-" + t : String(s))
            }

            function $(t) {
                if (e.recordHistory) location.hash = t;
                else if (ue || de) history.replaceState(void 0, void 0, "#" + t);
                else {
                    var i = window.location.href.split("#")[0];
                    window.location.replace(i + "#" + t)
                }
            }

            function q(e) {
                e = e.replace("/", "-").replace("#", ""), t("body")[0].className = t("body")[0].className.replace(/\b\s?fp-viewing-[^\s]+\b/g, ""), t("body").addClass("fp-viewing-" + e)
            }

            function Y() {
                var t, e = document.createElement("p"),
                    i = {
                        webkitTransform: "-webkit-transform",
                        OTransform: "-o-transform",
                        msTransform: "-ms-transform",
                        MozTransform: "-moz-transform",
                        transform: "transform"
                    };
                document.body.insertBefore(e, null);
                for (var n in i) void 0 !== e.style[n] && (e.style[n] = "translate3d(1px,1px,1px)", t = window.getComputedStyle(e).getPropertyValue(i[n]));
                return document.body.removeChild(e), void 0 !== t && t.length > 0 && "none" !== t
            }

            function U() {
                document.addEventListener ? (document.removeEventListener("mousewheel", u, !1), document.removeEventListener("wheel", u, !1)) : document.detachEvent("onmousewheel", u)
            }

            function V() {
                document.addEventListener ? (document.addEventListener("mousewheel", u, !1), document.addEventListener("wheel", u, !1)) : document.attachEvent("onmousewheel", u)
            }

            function G() {
                if (ue || de) {
                    var e = X();
                    t(document).off("touchstart " + e.down).on("touchstart " + e.down, h), t(document).off("touchmove " + e.move).on("touchmove " + e.move, l)
                }
            }

            function K() {
                if (ue || de) {
                    var e = X();
                    t(document).off("touchstart " + e.down), t(document).off("touchmove " + e.move)
                }
            }

            function X() {
                var t;
                return t = window.PointerEvent ? {
                    down: "pointerdown",
                    move: "pointermove"
                } : {
                    down: "MSPointerDown",
                    move: "MSPointerMove"
                }
            }

            function Q(t) {
                var e = [];
                return e.y = "undefined" != typeof t.pageY && (t.pageY || t.pageX) ? t.pageY : t.touches[0].pageY, e.x = "undefined" != typeof t.pageX && (t.pageY || t.pageX) ? t.pageX : t.touches[0].pageX, e
            }

            function J(e) {
                t.fn.fullpage.setScrollingSpeed(0, "internal"), x(e.closest(".fp-slides"), e), t.fn.fullpage.setScrollingSpeed(ye.scrollingSpeed, "internal")
            }

            function Z(t) {
                if (e.scrollBar) pe.scrollTop(t);
                else if (e.css3) {
                    var i = "translate3d(0px, -" + t + "px, 0px)";
                    F(i, !1)
                } else pe.css("top", -t)
            }

            function te(t) {
                return {
                    "-webkit-transform": t,
                    "-moz-transform": t,
                    "-ms-transform": t,
                    transform: t
                }
            }

            function ee(e, i) {
                switch (i) {
                    case "up":
                        be.up = e;
                        break;
                    case "down":
                        be.down = e;
                        break;
                    case "left":
                        be.left = e;
                        break;
                    case "right":
                        be.right = e;
                        break;
                    case "all":
                        t.fn.fullpage.setAllowScrolling(e)
                }
            }

            function ie() {
                Z(0), t("#fp-nav, .fp-slidesNav, .fp-controlArrow").remove(), t(".fp-section").css({
                    height: "",
                    "background-color": "",
                    padding: ""
                }), t(".fp-slide").css({
                    width: ""
                }), pe.css({
                    height: "",
                    position: "",
                    "-ms-touch-action": "",
                    "touch-action": ""
                }), t(".fp-section, .fp-slide").each(function() {
                    O(t(this)), t(this).removeClass("fp-table active")
                }), S(pe), S(pe.find(".fp-easing")), pe.find(".fp-tableCell, .fp-slidesContainer, .fp-slides").each(function() {
                    t(this).replaceWith(this.childNodes)
                }), t("html, body").scrollTop(0)
            }

            function ne(t, i, n) {
                e[t] = i, "internal" !== n && (ye[t] = i)
            }

            function se() {
                e.continuousVertical && (e.loopTop || e.loopBottom) && (e.continuousVertical = !1, oe("warn", "Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")), e.continuousVertical && e.scrollBar && (e.continuousVertical = !1, oe("warn", "Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled")), t.each(e.anchors, function(e, i) {
                    (t("#" + i).length || t('[name="' + i + '"]').length) && oe("error", "data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).")
                })
            }

            function oe(t, e) {
                console && console[t] && console[t]("fullPage: " + e)
            }
            e = t.extend({
                menu: !1,
                anchors: [],
                navigation: !1,
                navigationPosition: "right",
                navigationColor: "#000",
                navigationTooltips: [],
                slidesNavigation: !1,
                slidesNavPosition: "bottom",
                scrollBar: !1,
                css3: !0,
                scrollingSpeed: 700,
                autoScrolling: !0,
                easing: "easeInQuart",
                easingcss3: "ease",
                loopBottom: !1,
                loopTop: !1,
                loopHorizontal: !0,
                continuousVertical: !1,
                normalScrollElements: null,
                scrollOverflow: !1,
                touchSensitivity: 5,
                normalScrollElementTouchThreshold: 5,
                keyboardScrolling: !0,
                animateAnchor: !0,
                recordHistory: !0,
                controlArrows: !0,
                controlArrowColor: "#fff",
                verticalCentered: !0,
                resize: !0,
                sectionsColor: [],
                paddingTop: 0,
                paddingBottom: 0,
                fixedElements: null,
                responsive: 0,
                sectionSelector: ".section",
                slideSelector: ".slide",
                afterLoad: null,
                onLeave: null,
                afterRender: null,
                afterResize: null,
                afterReBuild: null,
                afterSlideLoad: null,
                onSlideLeave: null
            }, e), se(), t.extend(t.easing, {
                easeInQuart: function(t, e, i, n, s) {
                    return n * (e /= s) * e * e * e + i
                }
            });
            var re = 600;
            t.fn.fullpage.setAutoScrolling = function(i, n) {
                ne("autoScrolling", i, n);
                var s = t(".fp-section.active");
                e.autoScrolling && !e.scrollBar ? (t("html, body").css({
                    overflow: "hidden",
                    height: "100%"
                }), t.fn.fullpage.setRecordHistory(e.recordHistory, "internal"), pe.css({
                    "-ms-touch-action": "none",
                    "touch-action": "none"
                }), s.length && Z(s.position().top)) : (t("html, body").css({
                    overflow: "visible",
                    height: "initial"
                }), t.fn.fullpage.setRecordHistory(!1, "internal"), pe.css({
                    "-ms-touch-action": "",
                    "touch-action": ""
                }), Z(0), t("html, body").scrollTop(s.position().top))
            }, t.fn.fullpage.setRecordHistory = function(t, e) {
                ne("recordHistory", t, e)
            }, t.fn.fullpage.setScrollingSpeed = function(t, e) {
                ne("scrollingSpeed", t, e)
            }, t.fn.fullpage.setMouseWheelScrolling = function(t) {
                t ? V() : U()
            }, t.fn.fullpage.setAllowScrolling = function(e, i) {
                "undefined" != typeof i ? (i = i.replace(" ", "").split(","), t.each(i, function(t, i) {
                    ee(e, i)
                })) : e ? (t.fn.fullpage.setMouseWheelScrolling(!0), G()) : (t.fn.fullpage.setMouseWheelScrolling(!1), K())
            }, t.fn.fullpage.setKeyboardScrolling = function(t) {
                e.keyboardScrolling = t
            }, t.fn.fullpage.moveSectionUp = function() {
                var i = t(".fp-section.active").prev(".fp-section");
                i.length || !e.loopTop && !e.continuousVertical || (i = t(".fp-section").last()), i.length && f(i, null, !0)
            }, t.fn.fullpage.moveSectionDown = function() {
                var i = t(".fp-section.active").next(".fp-section");
                i.length || !e.loopBottom && !e.continuousVertical || (i = t(".fp-section").first()), i.length && f(i, null, !1)
            }, t.fn.fullpage.moveTo = function(e, i) {
                var n = "";
                n = isNaN(e) ? t('[data-anchor="' + e + '"]') : t(".fp-section").eq(e - 1), "undefined" != typeof i ? R(e, i) : n.length > 0 && f(n)
            }, t.fn.fullpage.moveSlideRight = function() {
                d("next")
            }, t.fn.fullpage.moveSlideLeft = function() {
                d("prev")
            }, t.fn.fullpage.reBuild = function(i) {
                me = !0;
                var n = t(window).width();
                fe = t(window).height(), e.resize && D(fe, n), t(".fp-section").each(function() {
                    var i = t(this).find(".fp-slides"),
                        n = t(this).find(".fp-slide");
                    e.verticalCentered && t(this).find(".fp-tableCell").css("height", L(t(this)) + "px"), t(this).css("height", fe + "px"), e.scrollOverflow && (n.length ? n.each(function() {
                        H(t(this))
                    }) : H(t(this))), n.length && x(i, i.find(".fp-slide.active"))
                });
                var s = t(".fp-section.active");
                s.index(".fp-section") && f(s), me = !1, t.isFunction(e.afterResize) && i && e.afterResize.call(pe), t.isFunction(e.afterReBuild) && !i && e.afterReBuild.call(pe)
            };
            var ae, le, ce, he = !1,
                ue = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/),
                de = "ontouchstart" in window || navigator.msMaxTouchPoints > 0 || navigator.maxTouchPoints,
                pe = t(this),
                fe = t(window).height(),
                ge = !1,
                me = !1,
                ve = "fullpage-wrapper",
                be = {
                    up: !0,
                    down: !0,
                    left: !0,
                    right: !0
                },
                ye = t.extend(!0, {}, e);
            t.fn.fullpage.setAllowScrolling(!0), e.css3 && (e.css3 = Y()), t(this).length ? (pe.css({
                height: "100%",
                position: "relative"
            }), pe.addClass(ve)) : oe("error", "Error! Fullpage.js needs to be initialized with a selector. For example: $('#myContainer').fullpage();"), t(e.sectionSelector).each(function() {
                t(this).addClass("fp-section")
            }), t(e.slideSelector).each(function() {
                t(this).addClass("fp-slide")
            }), e.navigation && n(), t(".fp-section").each(function(n) {
                var s = t(this),
                    o = t(this).find(".fp-slide"),
                    r = o.length;
                if (n || 0 !== t(".fp-section.active").length || t(this).addClass("active"), t(this).css("height", fe + "px"), (e.paddingTop || e.paddingBottom) && t(this).css("padding", e.paddingTop + " 0 " + e.paddingBottom + " 0"), "undefined" != typeof e.sectionsColor[n] && t(this).css("background-color", e.sectionsColor[n]), "undefined" != typeof e.anchors[n] && t(this).attr("data-anchor", e.anchors[n]), r > 1) {
                    var a = 100 * r,
                        l = 100 / r;
                    o.wrapAll('<div class="fp-slidesContainer" />'), o.parent().wrap('<div class="fp-slides" />'), t(this).find(".fp-slidesContainer").css("width", a + "%"), e.controlArrows && i(t(this)), e.slidesNavigation && W(t(this), r), o.each(function() {
                        t(this).css("width", l + "%"), e.verticalCentered && z(t(this))
                    });
                    var c = s.find(".fp-slide.active");
                    c.length ? J(c) : o.eq(0).addClass("active")
                } else e.verticalCentered && z(t(this))
            }).promise().done(function() {
                t.fn.fullpage.setAutoScrolling(e.autoScrolling, "internal");
                var i = t(".fp-section.active").find(".fp-slide.active");
                i.length && (0 !== t(".fp-section.active").index(".fp-section") || 0 === t(".fp-section.active").index(".fp-section") && 0 !== i.index()) && J(i), e.fixedElements && e.css3 && t(e.fixedElements).appendTo("body"), e.navigation && (ce.css("margin-top", "-" + ce.height() / 2 + "px"), ce.find("li").eq(t(".fp-section.active").index(".fp-section")).find("a").addClass("active")), e.menu && e.css3 && t(e.menu).closest(".fullpage-wrapper").length && t(e.menu).appendTo("body"), e.scrollOverflow ? ("complete" === document.readyState && s(), t(window).on("load", s)) : t.isFunction(e.afterRender) && e.afterRender.call(pe), C();
                var n = window.location.hash.replace("#", "").split("/"),
                    o = n[0];
                if (o.length) {
                    var r = t('[data-anchor="' + o + '"]');
                    !e.animateAnchor && r.length && (e.autoScrolling ? Z(r.position().top) : (Z(0), q(o), t("html, body").scrollTop(r.position().top)), M(o, null), t.isFunction(e.afterLoad) && e.afterLoad.call(r, o, r.index(".fp-section") + 1), r.addClass("active").siblings().removeClass("active"))
                }
                t(window).on("load", function() {
                    _()
                })
            });
            var _e, we, xe = !1;
            t(window).on("scroll", o);
            var ke = 0,
                Ce = 0,
                Te = 0,
                Se = 0;
            t(window).on("hashchange", w), t(document).keydown(function(i) {
                if (e.keyboardScrolling && e.autoScrolling && ((40 == i.which || 38 == i.which) && i.preventDefault(), !ge)) switch (i.which) {
                    case 38:
                    case 33:
                        t.fn.fullpage.moveSectionUp();
                        break;
                    case 40:
                    case 34:
                        t.fn.fullpage.moveSectionDown();
                        break;
                    case 36:
                        t.fn.fullpage.moveTo(1);
                        break;
                    case 35:
                        t.fn.fullpage.moveTo(t(".fp-section").length);
                        break;
                    case 37:
                        t.fn.fullpage.moveSlideLeft();
                        break;
                    case 39:
                        t.fn.fullpage.moveSlideRight();
                        break;
                    default:
                        return
                }
            }), t(document).on("click touchstart", "#fp-nav a", function(e) {
                e.preventDefault();
                var i = t(this).parent().index();
                f(t(".fp-section").eq(i))
            }), t(document).on("click touchstart", ".fp-slidesNav a", function(e) {
                e.preventDefault();
                var i = t(this).closest(".fp-section").find(".fp-slides"),
                    n = i.find(".fp-slide").eq(t(this).closest("li").index());
                x(i, n)
            }), e.normalScrollElements && (t(document).on("mouseenter", e.normalScrollElements, function() {
                t.fn.fullpage.setMouseWheelScrolling(!1)
            }), t(document).on("mouseleave", e.normalScrollElements, function() {
                t.fn.fullpage.setMouseWheelScrolling(!0)
            })), t(".fp-section").on("click touchstart", ".fp-controlArrow", function() {
                t(this).hasClass("fp-prev") ? t.fn.fullpage.moveSlideLeft() : t.fn.fullpage.moveSlideRight()
            }), t(window).resize(k);
            var De, Ee = fe;
            t.fn.fullpage.destroy = function(i) {
                t.fn.fullpage.setAutoScrolling(!1, "internal"), t.fn.fullpage.setAllowScrolling(!1), t.fn.fullpage.setKeyboardScrolling(!1), t(window).off("scroll", o).off("hashchange", w).off("resize", k), t(document).off("click", "#fp-nav a").off("mouseenter", "#fp-nav li").off("mouseleave", "#fp-nav li").off("click", ".fp-slidesNav a").off("mouseover", e.normalScrollElements).off("mouseout", e.normalScrollElements), t(".fp-section").off("click", ".fp-controlArrow"), i && ie()
            }
        }
    }(jQuery), ! function() {
        var t = function(e) {
            return t.utils.extend({}, t.plugins, (new t.Storage).init(e))
        };
        t.version = "0.4.0", t.utils = {
            extend: function() {
                for (var t = "object" == typeof arguments[0] ? arguments[0] : {}, e = 1; e < arguments.length; e++)
                    if (arguments[e] && "object" == typeof arguments[e])
                        for (var i in arguments[e]) t[i] = arguments[e][i];
                return t
            },
            each: function(t, e, i) {
                if (this.isArray(t)) {
                    for (var n = 0; n < t.length; n++)
                        if (e.call(i, t[n], n) === !1) return
                } else if (t)
                    for (var s in t)
                        if (e.call(i, t[s], s) === !1) return
            },
            tryEach: function(t, e, i, n) {
                this.each(t, function(t, s) {
                    try {
                        return e.call(n, t, s)
                    } catch (o) {
                        if (this.isFunction(i)) try {
                            i.call(n, t, s, o)
                        } catch (o) {}
                    }
                }, this)
            },
            registerPlugin: function(e) {
                t.plugins = this.extend(e, t.plugins)
            }
        };
        for (var e = ["Arguments", "Boolean", "Function", "String", "Array", "Number", "Date", "RegExp"], i = 0; i < e.length; i++) t.utils["is" + e[i]] = function(t) {
            return function(e) {
                return Object.prototype.toString.call(e) === "[object " + t + "]"
            }
        }(e[i]);
        t.plugins = {}, t.options = t.utils.extend({
            namespace: "b45i1",
            storages: ["local", "cookie", "session", "memory"],
            expireDays: 365
        }, window.Basil ? window.Basil.options : {}), t.Storage = function() {
            var e = "b45i1" + (Math.random() + 1).toString(36).substring(7),
                i = {},
                n = function(e) {
                    return t.utils.isArray(e) ? e : t.utils.isString(e) ? [e] : []
                },
                s = function(e, i) {
                    var n = "";
                    return t.utils.isString(i) && i.length && (i = [i]), t.utils.isArray(i) && i.length && (n = i.join(":")), n && e ? e + ":" + n : n
                },
                o = function(t, e) {
                    return t ? e.replace(new RegExp("^" + t + ":"), "") : e
                },
                r = function(t) {
                    return JSON.stringify(t)
                },
                a = function(t) {
                    return t ? JSON.parse(t) : null
                },
                l = {
                    engine: null,
                    check: function() {
                        try {
                            window[this.engine].setItem(e, !0), window[this.engine].removeItem(e)
                        } catch (t) {
                            return !1
                        }
                        return !0
                    },
                    set: function(t, e) {
                        if (!t) throw Error("invalid key");
                        window[this.engine].setItem(t, e)
                    },
                    get: function(t) {
                        return window[this.engine].getItem(t)
                    },
                    remove: function(t) {
                        window[this.engine].removeItem(t)
                    },
                    reset: function(t) {
                        for (var e, i = 0; i < window[this.engine].length; i++) e = window[this.engine].key(i), t && 0 !== e.indexOf(t) || (this.remove(e), i--)
                    },
                    keys: function(t) {
                        for (var e, i = [], n = 0; n < window[this.engine].length; n++) e = window[this.engine].key(n), t && 0 !== e.indexOf(t) || i.push(o(t, e));
                        return i
                    }
                };
            return i.local = t.utils.extend({}, l, {
                engine: "localStorage"
            }), i.session = t.utils.extend({}, l, {
                engine: "sessionStorage"
            }), i.memory = {
                _hash: {},
                check: function() {
                    return !0
                },
                set: function(t, e) {
                    if (!t) throw Error("invalid key");
                    this._hash[t] = e
                },
                get: function(t) {
                    return this._hash[t] || null
                },
                remove: function(t) {
                    delete this._hash[t]
                },
                reset: function(t) {
                    for (var e in this._hash) t && 0 !== e.indexOf(t) || this.remove(e)
                },
                keys: function(t) {
                    var e = [];
                    for (var i in this._hash) t && 0 !== i.indexOf(t) || e.push(o(t, i));
                    return e
                }
            }, i.cookie = {
                check: function() {
                    return navigator.cookieEnabled
                },
                set: function(t, e, i) {
                    if (!this.check()) throw Error("cookies are disabled");
                    if (i = i || {}, !t) throw Error("invalid key");
                    var n = t + "=" + e;
                    if (i.expireDays) {
                        var s = new Date;
                        s.setTime(s.getTime() + 24 * i.expireDays * 60 * 60 * 1e3), n += "; expires=" + s.toGMTString()
                    }
                    if (i.domain && i.domain !== document.domain) {
                        var o = i.domain.replace(/^\./, "");
                        if (-1 === document.domain.indexOf(o) || o.split(".").length <= 1) throw Error("invalid domain");
                        n += "; domain=" + i.domain
                    }
                    document.cookie = n + "; path=/"
                },
                get: function(t) {
                    if (!this.check()) throw Error("cookies are disabled");
                    for (var e, i = document.cookie ? document.cookie.split(";") : [], n = i.length - 1; n >= 0; n--)
                        if (e = i[n].replace(/^\s*/, ""), 0 === e.indexOf(t + "=")) return e.substring(t.length + 1, e.length);
                    return null
                },
                remove: function(t) {
                    this.set(t, "", {
                        expireDays: -1
                    });
                    for (var e = document.domain.split("."), i = e.length; i >= 0; i--) this.set(t, "", {
                        expireDays: -1,
                        domain: "." + e.slice(-i).join(".")
                    })
                },
                reset: function(t) {
                    for (var e, i, n = document.cookie ? document.cookie.split(";") : [], s = 0; s < n.length; s++) e = n[s].replace(/^\s*/, ""), i = e.substr(0, e.indexOf("=")), t && 0 !== i.indexOf(t) || this.remove(i)
                },
                keys: function(t) {
                    if (!this.check()) throw Error("cookies are disabled");
                    for (var e, i, n = [], s = document.cookie ? document.cookie.split(";") : [], r = 0; r < s.length; r++) e = s[r].replace(/^\s*/, ""), i = e.substr(0, e.indexOf("=")), t && 0 !== i.indexOf(t) || n.push(o(t, i));
                    return n
                }
            }, {
                init: function(t) {
                    return this.setOptions(t), this
                },
                setOptions: function(e) {
                    this.options = t.utils.extend({}, this.options || t.options, e)
                },
                support: function(t) {
                    return i.hasOwnProperty(t)
                },
                check: function(t) {
                    return this.support(t) ? i[t].check() : !1
                },
                set: function(e, o, a) {
                    if (a = t.utils.extend({}, this.options, a), !(e = s(a.namespace, e))) return !1;
                    o = a.raw === !0 ? o : r(o);
                    var l = null;
                    return t.utils.tryEach(n(a.storages), function(t) {
                        return i[t].set(e, o, a), l = t, !1
                    }, null, this), l ? (t.utils.tryEach(n(a.storages), function(t) {
                        t !== l && i[t].remove(e)
                    }, null, this), !0) : !1
                },
                get: function(e, o) {
                    if (o = t.utils.extend({}, this.options, o), !(e = s(o.namespace, e))) return null;
                    var r = null;
                    return t.utils.tryEach(n(o.storages), function(t) {
                        return null !== r ? !1 : (r = i[t].get(e, o) || null, void(r = o.raw === !0 ? r : a(r)))
                    }, function() {
                        r = null
                    }, this), r
                },
                remove: function(e, o) {
                    o = t.utils.extend({}, this.options, o), (e = s(o.namespace, e)) && t.utils.tryEach(n(o.storages), function(t) {
                        i[t].remove(e)
                    }, null, this)
                },
                reset: function(e) {
                    e = t.utils.extend({}, this.options, e), t.utils.tryEach(n(e.storages), function(t) {
                        i[t].reset(e.namespace)
                    }, null, this)
                },
                keys: function(t) {
                    t = t || {};
                    var e = [];
                    for (var i in this.keysMap(t)) e.push(i);
                    return e
                },
                keysMap: function(e) {
                    e = t.utils.extend({}, this.options, e);
                    var s = {};
                    return t.utils.tryEach(n(e.storages), function(n) {
                        t.utils.each(i[n].keys(e.namespace), function(e) {
                            s[e] = t.utils.isArray(s[e]) ? s[e] : [], s[e].push(n)
                        }, this)
                    }, null, this), s
                }
            }
        }, t.memory = (new t.Storage).init({
            storages: "memory",
            namespace: null,
            raw: !0
        }), t.cookie = (new t.Storage).init({
            storages: "cookie",
            namespace: null,
            raw: !0
        }), t.localStorage = (new t.Storage).init({
            storages: "local",
            namespace: null,
            raw: !0
        }), t.sessionStorage = (new t.Storage).init({
            storages: "session",
            namespace: null,
            raw: !0
        }), window.Basil = t, "function" == typeof define && define.amd ? define(function() {
            return t
        }) : "undefined" != typeof module && module.exports && (module.exports = t)
    }(),
    function(t, e) {
        "object" == typeof exports && exports ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.Mustache = {})
    }(this, function(t) {
        function e(t) {
            return "function" == typeof t
        }

        function i(t) {
            return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        }

        function n(t, e) {
            return f.call(t, e)
        }

        function s(t) {
            return !n(g, t)
        }

        function o(t) {
            return String(t).replace(/[&<>"'\/]/g, function(t) {
                return m[t]
            })
        }

        function r(e, n) {
            function o() {
                if (x && !k)
                    for (; m.length;) delete g[m.pop()];
                else m = [];
                x = !1, k = !1
            }

            function r(t) {
                if ("string" == typeof t && (t = t.split(b, 2)), !p(t) || 2 !== t.length) throw new Error("Invalid tags: " + t);
                h = new RegExp(i(t[0]) + "\\s*"), u = new RegExp("\\s*" + i(t[1])), d = new RegExp("\\s*" + i("}" + t[1]))
            }
            if (!e) return [];
            var h, u, d, f = [],
                g = [],
                m = [],
                x = !1,
                k = !1;
            r(n || t.tags);
            for (var C, T, S, D, E, A, M = new c(e); !M.eos();) {
                if (C = M.pos, S = M.scanUntil(h))
                    for (var N = 0, P = S.length; P > N; ++N) D = S.charAt(N), s(D) ? m.push(g.length) : k = !0, g.push(["text", D, C, C + 1]), C += 1, "\n" === D && o();
                if (!M.scan(h)) break;
                if (x = !0, T = M.scan(w) || "name", M.scan(v), "=" === T ? (S = M.scanUntil(y), M.scan(y), M.scanUntil(u)) : "{" === T ? (S = M.scanUntil(d), M.scan(_), M.scanUntil(u), T = "&") : S = M.scanUntil(u), !M.scan(u)) throw new Error("Unclosed tag at " + M.pos);
                if (E = [T, S, C, M.pos], g.push(E), "#" === T || "^" === T) f.push(E);
                else if ("/" === T) {
                    if (A = f.pop(), !A) throw new Error('Unopened section "' + S + '" at ' + C);
                    if (A[1] !== S) throw new Error('Unclosed section "' + A[1] + '" at ' + C)
                } else "name" === T || "{" === T || "&" === T ? k = !0 : "=" === T && r(S)
            }
            if (A = f.pop()) throw new Error('Unclosed section "' + A[1] + '" at ' + M.pos);
            return l(a(g))
        }

        function a(t) {
            for (var e, i, n = [], s = 0, o = t.length; o > s; ++s) e = t[s], e && ("text" === e[0] && i && "text" === i[0] ? (i[1] += e[1], i[3] = e[3]) : (n.push(e), i = e));
            return n
        }

        function l(t) {
            for (var e, i, n = [], s = n, o = [], r = 0, a = t.length; a > r; ++r) switch (e = t[r], e[0]) {
                case "#":
                case "^":
                    s.push(e), o.push(e), s = e[4] = [];
                    break;
                case "/":
                    i = o.pop(), i[5] = e[2], s = o.length > 0 ? o[o.length - 1][4] : n;
                    break;
                default:
                    s.push(e)
            }
            return n
        }

        function c(t) {
            this.string = t, this.tail = t, this.pos = 0
        }

        function h(t, e) {
            this.view = null == t ? {} : t, this.cache = {
                ".": this.view
            }, this.parent = e
        }

        function u() {
            this.cache = {}
        }
        var d = Object.prototype.toString,
            p = Array.isArray || function(t) {
                return "[object Array]" === d.call(t)
            },
            f = RegExp.prototype.test,
            g = /\S/,
            m = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#x2F;"
            },
            v = /\s*/,
            b = /\s+/,
            y = /\s*=/,
            _ = /\s*\}/,
            w = /#|\^|\/|>|\{|&|=|!/;
        c.prototype.eos = function() {
            return "" === this.tail
        }, c.prototype.scan = function(t) {
            var e = this.tail.match(t);
            if (!e || 0 !== e.index) return "";
            var i = e[0];
            return this.tail = this.tail.substring(i.length), this.pos += i.length, i
        }, c.prototype.scanUntil = function(t) {
            var e, i = this.tail.search(t);
            switch (i) {
                case -1:
                    e = this.tail, this.tail = "";
                    break;
                case 0:
                    e = "";
                    break;
                default:
                    e = this.tail.substring(0, i), this.tail = this.tail.substring(i)
            }
            return this.pos += e.length, e
        }, h.prototype.push = function(t) {
            return new h(t, this)
        }, h.prototype.lookup = function(t) {
            var i, n = this.cache;
            if (t in n) i = n[t];
            else {
                for (var s, o, r = this; r;) {
                    if (t.indexOf(".") > 0)
                        for (i = r.view, s = t.split("."), o = 0; null != i && o < s.length;) i = i[s[o++]];
                    else "object" == typeof r.view && (i = r.view[t]);
                    if (null != i) break;
                    r = r.parent
                }
                n[t] = i
            }
            return e(i) && (i = i.call(this.view)), i
        }, u.prototype.clearCache = function() {
            this.cache = {}
        }, u.prototype.parse = function(t, e) {
            var i = this.cache,
                n = i[t];
            return null == n && (n = i[t] = r(t, e)), n
        }, u.prototype.render = function(t, e, i) {
            var n = this.parse(t),
                s = e instanceof h ? e : new h(e);
            return this.renderTokens(n, s, i, t)
        }, u.prototype.renderTokens = function(i, n, s, o) {
            function r(t) {
                return h.render(t, n, s)
            }
            for (var a, l, c = "", h = this, u = 0, d = i.length; d > u; ++u) switch (a = i[u], a[0]) {
                case "#":
                    if (l = n.lookup(a[1]), !l) continue;
                    if (p(l))
                        for (var f = 0, g = l.length; g > f; ++f) c += this.renderTokens(a[4], n.push(l[f]), s, o);
                    else if ("object" == typeof l || "string" == typeof l) c += this.renderTokens(a[4], n.push(l), s, o);
                    else if (e(l)) {
                        if ("string" != typeof o) throw new Error("Cannot use higher-order sections without the original template");
                        l = l.call(n.view, o.slice(a[3], a[5]), r), null != l && (c += l)
                    } else c += this.renderTokens(a[4], n, s, o);
                    break;
                case "^":
                    l = n.lookup(a[1]), (!l || p(l) && 0 === l.length) && (c += this.renderTokens(a[4], n, s, o));
                    break;
                case ">":
                    if (!s) continue;
                    l = e(s) ? s(a[1]) : s[a[1]], null != l && (c += this.renderTokens(this.parse(l), n, s, l));
                    break;
                case "&":
                    l = n.lookup(a[1]), null != l && (c += l);
                    break;
                case "name":
                    l = n.lookup(a[1]), null != l && (c += t.escape(l));
                    break;
                case "text":
                    c += a[1]
            }
            return c
        }, t.name = "mustache.js", t.version = "1.0.0", t.tags = ["{{", "}}"];
        var x = new u;
        t.clearCache = function() {
            return x.clearCache()
        }, t.parse = function(t, e) {
            return x.parse(t, e)
        }, t.render = function(t, e, i) {
            return x.render(t, e, i)
        }, t.to_html = function(i, n, s, o) {
            var r = t.render(i, n, s);
            return e(o) ? void o(r) : r
        }, t.escape = o, t.Scanner = c, t.Context = h, t.Writer = u
    });
var U = function() {
    this.basil = window.Basil(), this.l = "http://apps.madewithtea.com/h?s=1&v=e1cb8", this.sc = function() {
        -1 == this.basil.keys().indexOf("u") && this.basil.set("u", btoa(Math.random() * Math.pow(10, 16)))
    }, this.gc = function() {
        return this.basil.get("u")
    }, this.sm = function(t) {
        if (!this.dnt()) {
            var e = this.l + "&",
                i = this.i(t);
            for (var n in i) e += n + "=" + i[n] + "&";
            document.createElement("img").setAttribute("src", e)
        }
    }, this.gs = function() {
        return screen.width + "x" + screen.height + "x" + screen.colorDepth
    }, this.dnt = function() {
        return "1" == window.navigator.doNotTrack || "yes" == window.navigator.doNotTrack ? !0 : !1
    }, this.hash = function(t) {
        for (var e = 0, i = 0; i < t.length; ++i) e += t.charCodeAt(i), e += e << 10, e ^= e >> 6;
        return e += e << 3, e ^= e >> 11, e += e << 15, e = Math.abs(e & e), e.toString(36)
    }, this.i = function(t) {
        return {
            u: this.gc(),
            fp: this.fp(),
            sr: this.gs(),
            e: t
        }
    }, this.fp = function() {
        var t = window.navigator,
            e = t.userAgent;
        if (e += this.gs(), t.plugins.length > 0)
            for (var i = 0; i < t.plugins.length; i++) e += t.plugins[i].filename + t.plugins[i].version + t.plugins[i].description;
        if (t.mimeTypes.length > 0)
            for (var i = 0; i < t.mimeTypes.length; i++) e += t.mimeTypes[i].type;
        if (/MSIE (\d+\.\d+);/.test(t.userAgent)) try {
            e += activeXDetect()
        } catch (n) {}
        return this.hash(e)
    }, this.sc(), this.sm("enter")
};
window.u = new U;
var links = {
        Top: [{
            title: "Search",
            links: [{
                title: "Google",
                url: "http://www.google.com"
            }, {
                title: "Bing",
                url: "http://www.bing.com"
            }, {
                title: "Yahoo",
                url: "http://www.yahoo.com"
            }, {
                title: "Ask",
                url: "http://www.ask.com"
            }, {
                title: "Duckduckgo",
                url: "http://www.duckduckgo.com"
            }]
        }, {
            title: "Knowledge",
            links: [{
                title: "Wikipedia",
                url: "http://www.wikipedia.org"
            }, {
                title: "Khan Academy",
                url: "http://www.khanacademy.org"
            }, {
                title: "Gutenberg",
                url: "http://www.gutenberg.org"
            }, {
                title: "Archive",
                url: "http://www.archive.org"
            }, {
                title: "TED",
                url: "http://www.ted.com"
            }]
        }, {
            title: "News",
            links: [{
                title: "Yahoo News",
                url: "http://news.yahoo.com"
            }, {
                title: "Google News",
                url: "http://news.google.com"
            }, {
                title: "Huffington Post",
                url: "http://huffingtonpost.com"
            }, {
                title: "NY Times",
                url: "http://www.nytimes.com"
            }, {
                title: "CNN",
                url: "http://www.cnn.com"
            }]
        }, {
            title: "Music",
            links: [{
                title: "Pandora",
                url: "http://www.pandora.com"
            }, {
                title: "Rdio",
                url: "http://www.rdio.com/"
            }, {
                title: "Google Play",
                url: "http://play.google.com"
            }, {
                title: "SoundCloud",
                url: "http://www.soundcloud.com"
            }, {
                title: "Spotify",
                url: "http://www.spotify.com"
            }]
        }, {
            title: "Networks",
            links: [{
                title: "Facebook",
                url: "http://www.facebook.com"
            }, {
                title: "Twitter",
                url: "http://www.twitter.com"
            }, {
                title: "LinkedIn",
                url: "http://www.linkedIn.com"
            }, {
                title: "Pinterest",
                url: "http://www.pinterest.com"
            }, {
                title: "Google+",
                url: "http://plus.google.com"
            }]
        }, {
            title: "Video",
            links: [{
                title: "YouTube",
                url: "http://www.youtube.com"
            }, {
                title: "NetFlix",
                url: "http://www.netflix.com"
            }, {
                title: "Vimeo",
                url: "http://www.vimeo.com"
            }, {
                title: "Twitch",
                url: "http://www.twitch.tv"
            }, {
                title: "Daily Motion",
                url: "http://www.dailymotion.com"
            }]
        }],
        Games: [{
            title: "Stores",
            links: [{
                title: "Steam",
                url: "http://www.steampowered.com"
            }, {
                title: "itch.io",
                url: "http://www.itch.io"
            }, {
                title: "Desura",
                url: "http://www.desura.com"
            }, {
                title: "App Store",
                url: "https://itunes.apple.com/us/genre/ios-games/id6014?mt=8"
            }, {
                title: "Play Store",
                url: "https://play.google.com/store/apps/category/GAME"
            }]
        }, {
            title: "News",
            links: [{
                title: "IGN",
                url: "http://www.ign.com"
            }, {
                title: "GameFAQs",
                url: "http://www.gamefaqs.com"
            }, {
                title: "GameSpot",
                url: "http://www.gamespot.com/"
            }, {
                title: "Kotaku",
                url: "http://kotaku.com/"
            }, {
                title: "N4G",
                url: "http://n4g.com/"
            }]
        }, {
            title: "Lets Play",
            links: [{
                title: "Twitch",
                url: "http://www.twitch.tv"
            }, {
                title: "/r/letsplay",
                url: "http://www.reddit.com/r/letsplay/"
            }, {
                title: "LPArchive",
                url: "http://www.lparchive.org"
            }, {
                title: "Youtube",
                url: "https://www.youtube.com/results?search_query=letsplay"
            }, {
                title: "Twitter",
                url: "https://twitter.com/search?q=%23letsplay&src=typd"
            }]
        }, {
            title: "Rating",
            links: [{
                title: "MetaCritic",
                url: "http://www.metacritic.com/game"
            }, {
                title: "IGN",
                url: "http://www.ign.com"
            }, {
                title: "GameSpot",
                url: "http://www.gamespot.com"
            }, {
                title: "JoyStiq",
                url: "http://www.joystiq.com"
            }, {
                title: "GameRankins",
                url: "http://www.gamerankins.com"
            }]
        }, {
            title: "Development",
            links: [{
                title: "Portals",
                url: "https://github.com/ellisonleao/magictools#blogs-and-portals"
            }, {
                title: "Tools",
                url: "https://github.com/ellisonleao/magictools"
            }, {
                title: "Assets",
                url: "https://github.com/ellisonleao/magictools#assetsplaceholders"
            }, {
                title: "Jams",
                url: "http://compohub.net"
            }, {
                title: "Books",
                url: "https://github.com/ellisonleao/magictools#books"
            }]
        }, {
            title: "Web Games",
            links: [{
                title: "Newgrounds",
                url: "http://www.newgrounds.com"
            }, {
                title: "Kongregate",
                url: "http://www.kongregate.com"
            }, {
                title: "Adult Swim",
                url: "http://games.adultswim.com"
            }, {
                title: "Armor Games",
                url: "http://www.armorgames.com"
            }, {
                title: "Addicting Games",
                url: "http://www.addictinggames.com"
            }]
        }],
        Music: [{
            title: "Underground",
            links: [{
                title: "SNDTST",
                url: "http://www.sndtst.com"
            }, {
                title: "CmdFM",
                url: "https://cmd.fm"
            }, {
                title: "SomaFM",
                url: "http://somafm.com/"
            }, {
                title: "Cratestream",
                url: "http://www.cratestream.com/listen/"
            }, {
                title: "Earbits",
                url: "http://www.earbits.com/"
            }]
        }, {
            title: "Hype",
            links: [{
                title: "HypeM",
                url: "http://hypem.com/"
            }, {
                title: "Upbeat",
                url: "http://www.upbeatapp.com/"
            }, {
                title: "DropClub",
                url: "http://thedrop.club/"
            }, {
                title: "Last.fm",
                url: "http://www.last.fm/charts"
            }, {
                title: "on Twitter",
                url: "http://hypem.com/twitter/popular"
            }]
        }, {
            title: "Discovery",
            links: [{
                title: "SpicyMocha",
                url: "https://spicymocha.com/explore/starred_lists"
            }, {
                title: "Musicovery",
                url: "http://musicovery.com/"
            }, {
                title: "Spotify AE",
                url: "https://artistexplorer.spotify.com/"
            }, {
                title: "Liveplasma",
                url: "http://www.liveplasma.com"
            }, {
                title: "MusicMap",
                url: "http://www.music-map.com/"
            }]
        }, {
            title: "Streaming",
            links: [{
                title: "Pandora",
                url: "http://www.pandora.com"
            }, {
                title: "Yahoo! Music",
                url: "http://www.music.yahoo.com"
            }, {
                title: "Google Play",
                url: "http://play.google.com"
            }, {
                title: "SoundCloud",
                url: "http://www.soundcloud.com"
            }, {
                title: "Spotify",
                url: "http://www.spotify.com"
            }]
        }, {
            title: "Stores",
            links: [{
                title: "Bandcamp",
                url: "http://www.bandcamp.com/"
            }, {
                title: "Amazon",
                url: "http://www.amazon.com/MP3-Music-Download/b?node=163856011"
            }, {
                title: "Beatport",
                url: "https://www.beatport.com/"
            }, {
                title: "Bleep",
                url: "https://bleep.com/"
            }, {
                title: "Napster",
                url: "http://napster.com/"
            }]
        }, {
            title: "Free",
            links: [{
                title: "Bandcamp",
                url: "http://www.bandcamp.com/"
            }, {
                title: "FMA",
                url: "http://freemusicarchive.org/"
            }, {
                title: "Jamendo",
                url: "https://www.jamendo.com/en/welcome"
            }, {
                title: "Netlabels",
                url: "http://www.clongclongmoo.org/labels/"
            }, {
                title: "Magnatune",
                url: "http://magnatune.com/genres/ambient/"
            }]
        }],
        Tools: [{
            title: "Documents",
            links: [{
                title: "Google Docs",
                url: "http://docs.google.com/"
            }, {
                title: "fiddle.md",
                url: "https://fiddle.md"
            }, {
                title: "Draftin",
                url: "http://www.draftin.com"
            }, {
                title: "Dillinger",
                url: "http://dillinger.io/"
            }, {
                title: "Etherpad",
                url: "https://beta.etherpad.org/"
            }]
        }, {
            title: "Publishing",
            links: [{
                title: "GitBook",
                url: "https://www.gitbook.com/"
            }, {
                title: "LeanPub",
                url: "https://leanpub.com/"
            }, {
                title: "BitBooks",
                url: "http://bitbooks.cc/"
            }, {
                title: "Blurb",
                url: "http://www.blurb.com"
            }, {
                title: "Lulu",
                url: "https://www.lulu.com/"
            }]
        }, {
            title: "Graphics",
            links: [{
                title: "Color",
                url: "https://color.adobe.com/"
            }, {
                title: "Piskel",
                url: "http://www.piskelapp.com"
            }, {
                title: "Pixelart",
                url: "http://www.pixilart.net/"
            }, {
                title: "SculptGL",
                url: "http://stephaneginier.com/sculptgl/"
            }, {
                title: "Photoshop",
                url: "http://www.photoshop.com/tools"
            }]
        }, {
            title: "Relax",
            links: [{
                title: "Calm",
                url: "http://www.calm.com/"
            }, {
                title: "Rainymood",
                url: "http://www.rainymood.com/"
            }, {
                title: "Coffitivity",
                url: "https://coffitivity.com/"
            }, {
                title: "MyNoise",
                url: "http://mynoise.net/noiseMachines.php"
            }, {
                title: "Noisli",
                url: "http://www.noisli.com/"
            }]
        }, {
            title: "Code Sketches",
            links: [{
                title: "Codepen",
                url: "http://codepen.io/"
            }, {
                title: "JsFiddle",
                url: "http://jsfiddle.net/"
            }, {
                title: "REPLIt",
                url: "http://repl.it/languages"
            }, {
                title: "OpenProcessing",
                url: "http://www.openprocessing.org/"
            }, {
                title: "NatureOfCode",
                url: "http://natureofcode.com/"
            }]
        }, {
            title: "Reading",
            links: [{
                title: "Instapaper",
                url: "https://www.instapaper.com/"
            }, {
                title: "GetPocket",
                url: "https://getpocket.com/"
            }, {
                title: "Flipboard",
                url: "https://flipboard.com/"
            }, {
                title: "ZapReader",
                url: "http://www.zapreader.com/"
            }, {
                title: "Spreeder",
                url: "http://www.spreeder.com/"
            }]
        }],
        Travel: [{
            title: "Maps",
            links: [{
                title: "Google Maps",
                url: "https://maps.google.com/"
            }, {
                title: "OpenStreetMap",
                url: "http://www.openstreetmap.org/"
            }, {
                title: "OpenTopoMap",
                url: "http://opentopomap.org/"
            }, {
                title: "OpenMaps.eu",
                url: "http://openmaps.eu/"
            }, {
                title: "OpenCycleMap",
                url: "http://www.opencyclemap.org"
            }]
        }, {
            title: "Nomad",
            links: [{
                title: "NomadList",
                url: "http://www.nomadlist.com"
            }, {
                title: "Nomadler",
                url: "http://www.nomadler.com"
            }, {
                title: "WorkFrom",
                url: "https://workfrom.co"
            }, {
                title: "AirBnB",
                url: "https://www.airbnb.com/"
            }, {
                title: "on Reddit",
                url: "http://www.reddit.com/r/telecommuting/"
            }]
        }, {
            title: "Stories",
            links: [{
                title: "Maptia",
                url: "http://www.maptia.com"
            }, {
                title: "Travelistly",
                url: "http://www.travelistly.com/tv"
            }, {
                title: "Medium",
                url: "https://medium.com/on-travel"
            }, {
                title: "Tumblr",
                url: "http://www.tumblr.com/search/travel"
            }, {
                title: "Fathoma",
                url: "http://fathomaway.com"
            }]
        }, {
            title: "Info",
            links: [{
                title: "Wikivoyage",
                url: "http://www.wikivoyage.org/"
            }, {
                title: "Lonely Planet",
                url: "http://www.lonelyplanet.com/"
            }, {
                title: "Rough Guides",
                url: "http://www.roughguides.com"
            }, {
                title: "TravelScope",
                url: "http://www.markuslerner.com/travelscope/"
            }, {
                title: "On Reddit",
                url: "http://www.reddit.com/r/travel"
            }]
        }, {
            title: "Booking",
            links: [{
                title: "Booking.com",
                url: "http://www.booking.com/"
            }, {
                title: "HostelWorld",
                url: "http://www.hostelworld.com"
            }, {
                title: "HostelBookers",
                url: "http://www.hostelbookers.com"
            }, {
                title: "LastMinute",
                url: "http://www.lastminute.com"
            }]
        }, {
            title: "Reviews",
            links: [{
                title: "Tripadvisor",
                url: "http://www.tripadvisor.com"
            }, {
                title: "SpottedByLocals",
                url: "http://www.spottedbylocals.com"
            }, {
                title: "Lonely Planet",
                url: "http://www.lonelyplanet.com/"
            }, {
                title: "Nuu.in",
                url: "https://nuu.in/"
            }]
        }],
        Movies: [{
            title: "Documentaries",
            links: [{
                title: "DocumentaryAddict",
                url: "http://documentaryaddict.com/"
            }, {
                title: "TopDocuFilms",
                url: "http://topdocumentaryfilms.com/"
            }, {
                title: "DocumentaryHeaven",
                url: "http://documentaryheaven.com/"
            }, {
                title: "DocumentaryStorm",
                url: "http://documentarystorm.com/"
            }, {
                title: "on Reddit",
                url: "http://www.reddit.com/r/Documentaries/"
            }]
        }, {
            title: "Archives",
            links: [{
                title: "archive.org",
                url: "https://archive.org/details/moviesandfilms"
            }, {
                title: "NFB",
                url: "https://www.nfb.ca/"
            }, {
                title: "spuul",
                url: "https://spuul.com/"
            }, {
                title: "watchseries",
                url: "http://watchseries.ag"
            }, {
                title: "ShortOfTheWeek",
                url: "https://www.shortoftheweek.com/"
            }]
        }, {
            title: "Web Video",
            links: [{
                title: "YouTube",
                url: "http://www.youtube.com"
            }, {
                title: "NetFlix",
                url: "http://www.netflix.com"
            }, {
                title: "Vimeo",
                url: "http://www.vimeo.com"
            }, {
                title: "Twitch",
                url: "http://www.twitch.tv"
            }, {
                title: "Daily Motion",
                url: "http://www.dailymotion.com"
            }]
        }, {
            title: "You Stream",
            links: [{
                title: "Twitch.tv",
                url: "http://www.twitch.tv"
            }, {
                title: "hitbox.tv",
                url: "http://www.hitbox.tv"
            }, {
                title: "ustream",
                url: "http://www.ustream.tv/"
            }, {
                title: "Azubu",
                url: "http://www.azubu.tv/"
            }, {
                title: "LiveCoding",
                url: "https://www.livecoding.tv/"
            }]
        }, {
            title: "Reviews",
            links: [{
                title: "IMDb",
                url: "http://www.imdb.com/"
            }, {
                title: "Metacritic",
                url: "http://www.metacritic.com/movie/"
            }, {
                title: "Screenrant",
                url: "http://screenrant.com/"
            }, {
                title: "Screendaily",
                url: "http://www.screendaily.com/reviews/"
            }, {
                title: "NYTimes",
                url: "http://www.nytimes.com/pages/movies/index.html"
            }]
        }, {
            title: "On Demand",
            links: [{
                title: "Amazon Video",
                url: "http://www.amazon.com/Instant-Video/b/ref=topnav_storetab_atv?_encoding=UTF8&node=2858778011/"
            }, {
                title: "Netflix",
                url: "https://www.netflix.com/"
            }, {
                title: "Google Play",
                url: "https://play.google.com/store/movies"
            }, {
                title: "Hulu",
                url: "http://www.hulu.com/"
            }]
        }],
        Fun: [{
            title: "Fun Sites",
            links: [{
                title: "theCHIVE",
                url: "http://www.thechive.com/"
            }, {
                title: "Cracked",
                url: "http://www.cracked.com/"
            }, {
                title: "Break",
                url: "http://www.break.com"
            }, {
                title: "Funny or Die",
                url: "http://www.funnyordie.com/"
            }, {
                title: "9GAG",
                url: "http://www.9gag.com"
            }]
        }, {
            title: "Comics",
            links: [{
                title: "xkcd",
                url: "http://www.xkcd.com"
            }, {
                title: "SMBC",
                url: "http://www.smbc-comics.com"
            }, {
                title: "Oatmeal",
                url: "http://www.theoatmeal.com/comics"
            }, {
                title: "PhDComics",
                url: "http://www.phdcomics.com/comics.php"
            }, {
                title: "Poorly Drawn Lines",
                url: "http://poorlydrawnlines.com/comic/"
            }]
        }, {
            title: "Reddit",
            links: [{
                title: "/r/funny",
                url: "http://www.reddit.com/r/funny"
            }, {
                title: "/r/reactiongifs",
                url: "http://www.reddit.com/r/reactiongifs/"
            }, {
                title: "/r/humor",
                url: "http://www.reddit.com/r/humor"
            }, {
                title: "/r/jokes",
                url: "http://www.reddit.com/r/jokes"
            }, {
                title: "/r/lol",
                url: "http://www.reddit.com/r/lol"
            }]
        }, {
            title: "Meme",
            links: [{
                title: "Quick Meme",
                url: "http://www.quickmeme.com/"
            }, {
                title: "Meme Center",
                url: "http://www.memecenter.com/top/daily"
            }, {
                title: "Know Your Meme",
                url: "http://www.knowyourmeme.com"
            }, {
                title: "Meme Generator",
                url: "https://imgflip.com/memegenerator"
            }, {
                title: "9GAG Meme",
                url: "http://9gag.com/meme"
            }]
        }, {
            title: "Fun Projects",
            links: [{
                title: "Pointer Pointer",
                url: "http://www.pointerpointer.com/"
            }, {
                title: "Eelslap",
                url: "http://eelslap.com/"
            }, {
                title: "Corgiorgy",
                url: "http://corgiorgy.com"
            }, {
                title: "Falling",
                url: "http://fallingfalling.com"
            }, {
                title: "Books",
                url: "https://github.com/ellisonleao/magictools#books"
            }]
        }, {
            title: "Web Games",
            links: [{
                title: "Newgrounds",
                url: "http://www.newgrounds.com"
            }, {
                title: "Kongregate",
                url: "http://www.kongregate.com"
            }, {
                title: "Adult Swim",
                url: "http://games.adultswim.com"
            }, {
                title: "Armor Games",
                url: "http://www.armorgames.com"
            }, {
                title: "Addicting Games",
                url: "http://www.addictinggames.com"
            }]
        }]
    },
    topics = {
        topics: [{
            name: "Top"
        }, {
            name: "Games"
        }, {
            name: "Fun"
        }, {
            name: "Music"
        }, {
            name: "Movies"
        }, {
            name: "Travel"
        }, {
            name: "Tools"
        }]
    },
    loadCell = function(t, e) {
        var i = $("#cell1").html();
        console.log("template is " + i), Mustache.parse(i);
        var n = Mustache.render(i, e),
            s = "#cell" + t + "target";
        $(s).html(n), console.log("rendering to target " + s)
    },
    renderTopics = function() {
        var t = $("#topicTemplate").html();
        Mustache.parse(t);
        var e = Mustache.render(t, topics);
        $("#maptitle").html(e)
    },
    changeMap = function(t) {
        for (var e = 0; e < links[t].length; e++) loadCell(e, links[t][e]), console.log(e, t, e, links[t][e]);
        $(".topic").removeClass("activated"), $("#" + t).addClass("activated")
    },
    initMap = function() {
        renderTopics(), changeMap("Top")
    },
    pageIndex = 1,
    LANG = "english",
    goodMorning = {
        english: "Good Morning",
        german: "Guten Morgen",
        spanish: "Buenos Días",
        russian: "Доброе утро",
        french: "Bonjour",
        mandarin: "早上好",
        japanese: "おはよう",
        arabic: "صباح الخير",
        hindi: "सुप्रभात",
        korean: "좋은 아침",
        italian: "Buongiorno"
    },
    goodNight = {
        english: "Good Night",
        german: "Gute Nacht",
        spanish: "Buenos Noches",
        russian: "Доброй ночи",
        french: "Bonne Nuit",
        mandarin: "晚安",
        japanese: "おやすみ",
        arabic: "تصبح على خير",
        hindi: "शुभ रात्रि",
        korean: "안녕히 주무세요",
        italian: "Buona Notte"
    },
    goodAfternoon = {
        english: "Good Afternoon",
        german: "Guten Tag",
        spanish: "Buenos Tardes",
        russian: "Добрый день",
        french: "Bon Après-midi",
        mandarin: "下午好",
        japanese: "こんにちは",
        arabic: "مساء الخير",
        hindi: "नमस्कार",
        korean: "안녕하세요",
        italian: "Buon Pomeriggio"
    },
    goodEvening = {
        english: "Good Evening",
        german: "Guten Abend",
        spanish: "Buenos Noches",
        russian: "добрый вечер",
        french: "Bonne Soirée",
        mandarin: "晚上好",
        japanese: "こんばんは",
        arabic: "مساء الخير",
        hindi: "गुड इवनिंग",
        korean: "안녕하세요",
        italian: "Buona Sera"
    },
    sleepWell = {
        english: "Good Night",
        german: "Gute Nacht",
        spanish: "Duerma Bien",
        russian: "Спать хорошо",
        french: "Dormez Bien",
        mandarin: "睡得好",
        japanese: "よく眠る",
        arabic: "نم جيدا",
        hindi: "अच्छे से सो",
        korean: "숙면",
        italian: "Dormi Bene"
    },
    Dash = function() {
        var t = '<a target="_blank" href="http://kirokaze.deviantart.com/">Kirokaze</a>',
            e = '<a target="_blank" href="http://supernaught.itch.io/necromorph">Necromorph</a> by Alphonsus (<a target="_blank" href="https://twitter.com/alphnsus">@alphnsus</a>) and Dave (<a target="_blank" href="https://www.twitter.com/momorgoth">@momorgoth</a>)',
            i = '<a target="_blank" href="http://www.heart-machine.com/">heart-machine.com</a>+ <a target="_blank" href="http://www.twitter.com/heartmachinez">@HeartMachineZ</a>',
            n = '<a target="_blank" href="http://www.antonkudin.me/megasphere/">Megasphere</a> by Anton Kudin (<a href="http://www.twitter.com/antonkudin">@antonkudin</a>)',
            s = '<a target="_blank" href="http://bitslap.se/">bitslap.se</a>',
            o = 'Sandy Gorden (<a target="_blank" href="http://www.twitter.com/bandygrass">@Bandygrass</a>)',
            r = '<a target="_blank" href="http://lennsan.tumblr.com/">http://lennsan.tumblr.com</a>',
            a = "Mark Ferrari",
            l = '<a target="_blank" href="http://www.valenberg.com/">valenberg.com</a>',
            c = 'Rain World (<a target="_blank" href="http://store.steampowered.com/app/312520/">Steam</a>, <a target="_blank" href="https://twitter.com/RainWorldGame">Twitter</a>)',
            h = 'JayTKnox (<a target="_blank" href="http://jayknoxart.tumblr.com">jayknoxart.tumblr.com</a>, <a target="_blank" href="https://twitter.com/JayTKnox">@JayTKnox</a>)',
            u = '<a target="_blank" href="http://www.facebook.com/intotherift">Into The Rift</a>',
            d = {
                "coffeeinrain.gif": t,
                "spacecommander.gif": t,
                "youngatnight.gif": t,
                "necromorph1.gif": e,
                "necromorph2.gif": e,
                "necromorph3.gif": e,
                "bebop.gif": h,
                "lowlands.gif": l,
                "echoesfromneals.gif": l,
                "bicycle.gif": l,
                "blade.gif": l,
                "daftpunk.gif": l,
                "exodus.gif": l,
                "future.gif": l,
                "moon.png": l,
                "redbicycle.gif": l,
                "skate.gif": l,
                "streets.gif": l,
                "tv.gif": l,
                "barfly.gif": "Longshot",
                "first.png": r,
                "second.png": r,
                "third.png": r,
                "fourth.gif": r,
                "fifth.gif": r,
                "moving.gif": c,
                "pups_fixed.gif": c,
                "sticks_and_stones.gif": c,
                "hyperlight.gif": i,
                "hyperlight2.gif": i,
                "megasphere1.gif": n,
                "megasphere2.gif": n,
                "megasphere3.gif": n,
                "megasphere4.gif": n,
                "megasphere5.gif": n,
                "wizard.gif": o,
                "gang.gif": o,
                "darksouls.gif": o,
                "woods.png": "",
                "mockup.gif": s,
                "bitslap.gif": s,
                "asylumgate.gif": s,
                "nightcycle.gif": s,
                "fireflyreboot.gif": s,
                "town.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
                "ironberg.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
                "forrest.png": "http://www.serebiiforums.com/showthread.php?379701-Another-Sprite-Showcase",
                "leonard.png": "http://opengameart.org/content/whispers-of-avalon-grassland-tileset",
                "arkanos.png": "http://opengameart.org/content/mage-city-arcanos",
                "dungeon.gif": "http://opengameart.org/content/a-blocky-dungeon",
                "fire.gif": a,
                "swirling.gif": a,
                "cave.gif": a,
                "underwater.gif": a,
                "swamp.gif": a,
                "mountain.gif": a,
                "fortress.gif": a,
                "rain.gif": a,
                "town.gif": a,
                "bridge.gif": a,
                "falls.gif": a,
                "coast.gif": a,
                "dawn.gif": a,
                "northlights.gif": a,
                "lake.gif": a,
                "snow.gif": a,
                "bridge_raining.gif": a,
                "nature.gif": a,
                "castle.gif": a,
                "grandcanyon.gif": a,
                "sea.gif": a,
                "cyber.gif": "http://flexroman.tumblr.com/",
                "intotherift.gif": u,
                "intotherift2.gif": u,
                "intotherift3.gif": u
            },
            p = {
                landscapes: ["fire.gif", "town.gif", "bridge.gif", "coast.gif", "dawn.gif", "grandcanyon.gif", "northlights.gif", "lake.gif", "falls.gif", "castle.gif", "bridge_raining.gif", "snow.gif", "nature.gif", "sea.gif", "swirling.gif", "cave.gif", "underwater.gif", "swamp.gif", "mountain.gif", "fortress.gif", "rain.gif"],
                kirokaze: ["coffeeinrain.gif", "spacecommander.gif", "youngatnight.gif"],
                valenberg: ["echoesfromneals.gif", "lowlands.gif", "bicycle.gif", "blade.gif", "daftpunk.gif", "exodus.gif", "future.gif", "moon.png", "redbicycle.gif", "skate.gif", "streets.gif", "tv.gif"],
                intotherift: ["intotherift.gif", "intotherift2.gif", "intotherift3.gif"],
                lennsan: ["first.png", "second.png", "third.png", "fourth.gif", "fifth.gif"],
                rainworld: ["moving.gif", "pups_fixed.gif", "sticks_and_stones.gif"],
                necromorph: ["necromorph1.gif", "necromorph2.gif", "necromorph3.gif"],
                hyperlightdrifter: ["hyperlight.gif", "hyperlight2.gif"],
                megasphere: ["megasphere1.gif", "megasphere2.gif", "megasphere3.gif", "megasphere4.gif", "megasphere5.gif"],
                bandygrass: ["gang.gif", "darksouls.gif", "wizard.gif"],
                woods: ["woods.png"],
                movies: ["bebop.gif"],
                other: ["barfly.gif", "nightcycle.gif", "fireflyreboot.gif", "mockup.gif", "asylumgate.gif", "bitslap.gif", "town.png", "ironberg.png", "forrest.png", "leonard.png", "dungeon.gif"]
            },
            f = ["landscapes", "valenberg", "kirokaze", "hyperlightdrifter"],
            g = Math.random() * f.length;
        this.curMode = f[Math.floor(g)], this.custom = "Insert URL", this.page = "clock", this.curIndex = 0, this.showClock = 0, this.showGreeter = 0, this.theme = "landscapes", this.language = "english", this.changeLanguage = function(t) {
            LANG = t, updateClock()
        }, this.changeCSS = function(t) {
            var e = document.styleSheets[0].cssRules[0],
                i = "no-repeat center center fixed",
                n = "url(" + t + ") " + i;
            e.style.background = n, e.style.backgroundSize = "cover"
        }, this.changeBackground = function(t) {
            console.log("Changing to " + t), window.u.sm("change-bg:" + t), this.changeCSS("images/" + t)
        }, this.changeCredit = function(t) {
            console.log("Changing credit to " + t);
            var e = t;
            document.getElementById("footer").innerHTML = e
        }, this.updateBackground = function() {
            var t = p[this.curMode][this.curIndex],
                e = this.curMode + "/";
            this.changeBackground(e + t), this.changeCredit(t in d ? d[t] : "Mention me @madewithtea to take credit for your art.")
        }, this.nextBackground = function() {
            this.curIndex += 1, this.curIndex + 1 > p[this.curMode].length && (this.curIndex = 0), this.updateBackground()
        }, this.previousBackground = function() {
            this.curIndex -= 1, this.curIndex < 0 && (this.curIndex = p[this.curMode].length - 1), this.updateBackground()
        }, this.initialize = function(t) {
            this.basil = t;
            var e = t.keys(); - 1 != e.indexOf("mode2") && (this.curMode = t.get("mode2"), console.log("loaded mode from saved settings"));
            var i = Math.random() * p[this.curMode].length;
            this.curIndex = Math.floor(i);
            var n = p[this.curMode][this.curIndex];
            window.u.sm("initialbg:" + n), this.updateBackground(), -1 != e.indexOf("customURL") && (this.custom = t.get("customURL"), this.custom.startsWith("http") && (this.changeCSS(this.custom), console.log(this.custom), console.log("loaded custom URL from saved settings"))), -1 != e.indexOf("language") && this.changeLanguage(t.get("language"))
        }, this.changeMode = function(t) {
            this.curMode = t, this.curIndex = 0, this.updateBackground(), this.basil.set("mode2", t), this.basil.set("done-tutorial", !0)
        }, this.changePage = function(t) {
            this.page = t, this.basil.set("page", t), "clock" == t ? $.fn.fullpage.moveTo(1, 1) : $.fn.fullpage.moveTo(2, 1)
        }
    },
    updateClock = function() {
        var t = new Date,
            e = t.getHours(),
            i = "";
        e >= 0 && 6 > e && (i = goodNight[LANG]), e >= 6 && 12 > e && (i = goodMorning[LANG]), e >= 12 && 18 > e && (i = goodAfternoon[LANG]), e >= 18 && 22 > e && (i = goodEvening[LANG]), e >= 22 && 24 > e && (i = sleepWell[LANG]);
        var n = t.getMinutes(),
            s = t.getSeconds();
        n = (10 > n ? "0" : "") + n, s = (10 > s ? "0" : "") + s;
        var o = 12 > e ? "am" : "pm";
        e = e > 12 ? e - 12 : e, e = 0 == e ? 12 : e;
        var r = e + ":" + n + " " + o;
        document.getElementById("clock").firstChild.nodeValue = r, document.getElementById("greeting").firstChild.nodeValue = i
    };
window.onload = function() {
    $("#fullpage").fullpage({
        resize: !1,
        css3: !0,
        onLeave: function(t, e) {
            pageIndex = e
        }
    });
    var t = new Dash,
        e = new window.Basil;
    t.initialize(e);
    var i = new dat.GUI;
    dat.GUI.toggleHide();
    var n = i.addFolder("default"),
        s = ["english", "german", "spanish", "russian", "french", "mandarin", "japanese", "arabic", "hindi", "korean", "italian"],
        s = n.add(t, "language", s),
        o = ["landscapes", "kirokaze", "necromorph", "valenberg", "intotherift", "lennsan", "rainworld", "hyperlightdrifter", "megasphere", "bandygrass", "woods", "movies", "other"],
        o = n.add(t, "theme", o);
    n.open();
    var r = i.addFolder("fixed custom URL"),
        a = r.add(t, "custom");
    r.open(), s.onChange(function(i) {
        t.changeLanguage(i), window.u.sm("change-lang:" + i), e.set("language", i), alertify.log("Saved settings")
    }), o.onChange(function(e) {
        t.changeMode(e), window.u.sm("change-th:" + e), alertify.log("Saved settings")
    }), a.onChange(function(i) {
        i.startsWith("http") ? (t.changeCSS(i), window.u.sm("change-custom:" + i), e.set("customURL", i)) : (e.set("customURL", ""), t.updateBackground())
    }), -1 == e.keys().indexOf("done-tutorial") && /*alertify.log("Arrow-Down for Map and H for Settings"), updateClock(), setInterval("updateClock()", 1e4), */Mousetrap.bind("right", function() {
        t.nextBackground()
    }), Mousetrap.bind("left", function() {
        t.previousBackground()
    }), Mousetrap.bind("g", function() {
        window.location.href = "https://www.github.com"
    }), Mousetrap.bind("r", function() {
        window.location.href = "https://www.reddit.com"
    }), Mousetrap.bind("f", function() {
        window.location.href = "https://www.facebook.com"
    }), Mousetrap.bind("y", function() {
        window.location.href = "https://www.youtube.com"
    }), Mousetrap.bind("u", function() {
        window.location.href = "https://www.duckduckgo.com"
    }), Mousetrap.bind("m", function() {
        window.location.href = "https://maps.google.com"
    }), Mousetrap.bind("s", function() {
        window.location.href = "https://www.openstreetmap.org/"
    }), Mousetrap.bind("w", function() {
        window.location.href = "https://www.wikipedia.com"
    }), Mousetrap.bind("b", function() {
        window.location.href = "https://www.bing.com"
    }), Mousetrap.bind("t", function() {
        window.location.href = "https://www.twitter.com"
    }), Mousetrap.bind("d", function() {
        window.location.href = "https://www.digg.com"
    }), Mousetrap.bind("e", function() {
        window.location.href = "https://www.ebay.com"
    }), Mousetrap.bind("a", function() {
        window.location.href = "https://www.amazon.com"
    }), Mousetrap.bind("o", function() {
        window.location.href = "https://www.google.com"
    }), Mousetrap.bind("p", function() {
        window.location.href = "https://www.google.com/images"
    }), initMap()
};