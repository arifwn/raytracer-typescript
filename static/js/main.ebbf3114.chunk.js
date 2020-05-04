(this["webpackJsonpraytracer-typescript"]=this["webpackJsonpraytracer-typescript"]||[]).push([[0],{25:function(t,e,a){t.exports=a(37)},30:function(t,e,a){},35:function(t,e,a){},37:function(t,e,a){"use strict";a.r(e);var i=a(0),n=a.n(i),r=a(7),o=a.n(r),c=(a(30),a(52)),s=a(4),h=a(54),l=a(14),u=a(15),f=function(){function t(e){Object(l.a)(this,t),this.canvas=void 0,this.context=void 0,this.canvas=e,this.context=null===e||void 0===e?void 0:e.getContext("2d")}return Object(u.a)(t,[{key:"dimension",value:function(){return{width:this.canvas.width,height:this.canvas.height}}},{key:"fill",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;if(this.context){var r=this.context.fillStyle;n&&(this.context.fillStyle=n),this.context.fillRect(t,e,null==a?this.canvas.width:a,null==i?this.canvas.height:i),this.context.fillStyle=r}}},{key:"at",value:function(t,e,a){this.fill(t,e,1,1,a)}}]),t}(),d={white:"#ffffff",black:"#000000",sky:"#2196f3",highlight:"#b71c1c"},v=function(){function t(e){Object(l.a)(this,t),this.drawer=void 0,this.colors=d,this.camera={x:0,y:0,z:200,rx:0,ry:0,rz:0,fov:Math.PI/2},this.tileWidth=30,this.floorWidth=1e3,this.maxRenderDistance=1e4,this.pillars=[{position:{x:80,y:345,z:0},width:this.tileWidth/2,height:120}],this.spheres=[{position:{x:0,y:100,z:30},radius:30}],e&&(this.drawer=e)}return Object(u.a)(t,[{key:"execute",value:function(){var t=this,e=this.drawer;if(e){var a=e.dimension(),i=this.camera.fov,n={x:this.camera.x,y:this.camera.y,z:this.camera.z};Array.from(Array(a.height).keys()).forEach((function(r){window.setTimeout((function(){Array.from(Array(a.width).keys()).forEach((function(o){var c=-i/2+o*(i/a.width),s=i/2-r*(i/a.height);e.at(o,r,t.rayPixel(n,{rx:t.camera.rx+s,ry:t.camera.ry+0,rz:t.camera.rz+c}))}))}),0)}))}}},{key:"lightenColor",value:function(t,e){var a=!1;"#"==t[0]&&(t=t.slice(1),a=!0);var i=parseInt(t,16),n=(i>>16)+e;n>255?n=255:n<0&&(n=0);var r=(i>>8&255)+e;r>255?r=255:r<0&&(r=0);var o=(255&i)+e;return o>255?o=255:o<0&&(o=0),(a?"#":"")+(o|r<<8|n<<16).toString(16)}},{key:"rayPixel",value:function(t,e){var a=this.shoot(t,e),i=Object(s.a)(a,3);i[0],i[1];return i[2]}},{key:"shoot",value:function(t,e){for(var a=0;a<this.pillars.length;a++){var i=this.pillars[a],n={x:i.position.x-t.x,y:i.position.y-t.y,z:i.position.z-t.z},r=(Math.atan(n.x/n.y),Math.atan((n.x-i.width)/n.y)),o=Math.atan((n.x+i.width)/n.y),c=Math.atan(n.z/n.y),h=Math.atan((i.position.z+i.height-t.z)/n.y);if(e.rz>r&&e.rz<o&&e.rx>c&&e.rx<h){var l=(i.position.y-t.y)/Math.cos(e.rz),u={x:Math.tan(e.rz)*(i.position.y-t.y)+t.x,y:i.position.y,z:Math.tan(e.rx)*l+t.z},f={rx:e.rx-.05,ry:0,rz:Math.PI-e.rz},d=this.shoot(u,f),v=Object(s.a)(d,3),y=v[0],m=v[1],x=v[2];return[y,m,this.lightenColor(x,100)]}}if(e.rx>0&&e.rx<Math.PI)return[{x:0,y:1/0,z:1/0},1/0,this.colors.sky];var g=t.z/Math.cos(Math.PI/2-e.rx),b=isNaN(g)?1/0:Math.abs(g),z=t.z/Math.tan(-e.rx),k=t.y+Math.cos(e.rz)*z,w=t.x+Math.sin(e.rz)*z,p={x:isNaN(w)?1/0:w,y:isNaN(k)?1/0:k,z:0},M=this.colors.black,j=!1;if(Math.abs(Math.round(p.x%(2*this.tileWidth)))<this.tileWidth&&Math.abs(Math.round(p.y%(2*this.tileWidth)))<this.tileWidth&&(j=!0),Math.abs(Math.round(p.x%(2*this.tileWidth)))>=this.tileWidth&&Math.abs(Math.round(p.y%(2*this.tileWidth)))>=this.tileWidth&&(j=!0),p.x<0&&(j=!j),j){var E=(b>this.maxRenderDistance?this.maxRenderDistance:b)/this.maxRenderDistance*200;M=this.lightenColor(this.colors.black,E)}else M=this.colors.white;return p.x!=1/0&&p.y!=1/0&&p.z!=1/0||(M=this.colors.sky),[p,b,M]}}]),t}();var y=function(t){if(!t)return null;var e=new f(t);return new v(e)},m=Object(c.a)((function(t){return{root:{position:"relative"},renderedImageContainer:{marginLeft:"auto",marginRight:"auto"}}}));var x=function(t){t.siteSetting,t.design,t.topBannerShown;var e=m(),a=Object(i.useRef)(null),r=Object(i.useState)(500),o=Object(s.a)(r,2),c=o[0],l=(o[1],Object(i.useState)(500)),u=Object(s.a)(l,2),f=u[0],d=(u[1],Object(i.useState)(0)),v=Object(s.a)(d,2),x=v[0],g=v[1],b=Object(i.useState)(0),z=Object(s.a)(b,2),k=z[0],w=z[1],p=Object(i.useState)(100),M=Object(s.a)(p,2),j=M[0],E=M[1],O=Object(i.useState)(0),C=Object(s.a)(O,2),S=C[0],R=C[1],W=Object(i.useState)(0),I=Object(s.a)(W,2),N=I[0],P=I[1];return Object(i.useEffect)((function(){var t=y(a.current);t&&(t.camera={x:x,y:k,z:j,rx:S,ry:0,rz:N,fov:Math.PI/4},t.execute())})),n.a.createElement("div",{className:e.root},n.a.createElement("div",{className:e.renderedImageContainer,style:{width:c,zoom:500/c}},n.a.createElement("canvas",{width:c,height:f,ref:a})),n.a.createElement("div",{className:e.renderedImageContainer,style:{width:500}},n.a.createElement("div",null,n.a.createElement(h.a,{onClick:function(){return g(x-10)}},"Left"),n.a.createElement(h.a,{onClick:function(){return w(k+10)}},"Front"),n.a.createElement(h.a,{onClick:function(){return w(k-10)}},"Back"),n.a.createElement(h.a,{onClick:function(){return g(x+10)}},"Right")),n.a.createElement("div",null,n.a.createElement(h.a,{onClick:function(){return P(N-.1)}},"Rt Left"),n.a.createElement(h.a,{onClick:function(){return P(N+.1)}},"Rt Right"),n.a.createElement(h.a,{onClick:function(){return R(S+.1)}},"Rt Up"),n.a.createElement(h.a,{onClick:function(){return R(S-.1)}},"Rt Down"),n.a.createElement(h.a,{onClick:function(){return E(j+10)}},"Top"),n.a.createElement(h.a,{onClick:function(){return E(j-10)}},"Bottom"))))},g=(a(35),a(36),Object(c.a)((function(t){return{root:{flexGrow:1,backgroundColor:"#ffffff"}}})));var b=function(){var t=g();return n.a.createElement("div",{className:t.root},n.a.createElement(x,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(b,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[25,1,2]]]);
//# sourceMappingURL=main.ebbf3114.chunk.js.map