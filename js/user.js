var U = function() {
  this.basil = window.Basil();
  this.l = "http://apps.madewithtea.com/h?s=1&v=e1cb8"
  this.sc = function() { 
    if(this.basil.keys().indexOf("u") == -1) {
      this.basil.set("u",btoa(Math.random()*Math.pow(10,16)));
    }; 
  };
  this.gc = function() { return this.basil.get("u") }
  this.sm = function(eventdata) { 
    if(this.dnt()) { 
      return;
    }
    var q = this.l + "&";
    var props = this.i(eventdata);
    for(var k in props) {
      q += k + "=" + props[k] + "&";
    }
    document.createElement("img").setAttribute("src", q);
  };
  
  this.gs = function() { return screen.width + "x" + screen.height + "x" + screen.colorDepth; };
  this.dnt = function() { 
    if(window.navigator.doNotTrack == "1" || window.navigator.doNotTrack == "yes") {  
      return true;
    } else { 
      return false;
    }
  };
  this.hash = function(k) {
     var hash = 0;
    for (var i=0; i<k.length; ++i) {
      hash += k.charCodeAt(i);
      hash += (hash << 10);
      hash ^= (hash >> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >> 11);
    hash += (hash << 15);
    hash = Math.abs(hash & hash);
    return hash.toString(36); 
  };
  this.i = function(eventdata) { 
    return {"u": this.gc(),
     "fp": this.fp(),
     "sr": this.gs(),
     "e": eventdata};
  }
  this.fp = function() { 
    var nav = window.navigator, t = nav.userAgent;
    t += this.gs();
    if (nav.plugins.length > 0 ) {
      for (var i = 0; i < nav.plugins.length; i++ ) {
        t += nav.plugins[i].filename + nav.plugins[i].version + nav.plugins[i].description;
      }
    }
    if (nav.mimeTypes.length > 0 ) {
      for (var i = 0; i < nav.mimeTypes.length; i++ ) {
        t += nav.mimeTypes[i].type;
      }
    }
    if ( /MSIE (\d+\.\d+);/.test(nav.userAgent) ) {
      try {
        t += activeXDetect();
      }
      catch(e) {
        //ignore
      }
    }        
    return this.hash(t);
  }
  this.sc();
  this.sm("enter");
}
window.u = new U();
