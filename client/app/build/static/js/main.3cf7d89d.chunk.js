(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{455:function(t,e){},494:function(t,e,c){"use strict";c.r(e);var r=c(0),n=c.n(r),a=c(12),o=c.n(a),i=c(563),s=c(571),u=c(135),d=c(75),f=c(28),j=c(334),p=c(154),O="https://glitchhub.coffee/api/v1",l=function(t,e,c){var r=j.a.fetchJson,n=function(t,e,c){switch(t){case f.d:var r=c.pagination,n=r.page,a=r.perPage,o=c.sort,i=o.field,s=o.order,j={sort:JSON.stringify([i,s]),range:JSON.stringify([(n-1)*a,n*a-1]),filter:JSON.stringify(c.filter)};return{url:"".concat(O,"/").concat(e,"?").concat(Object(p.stringify)(j))};case f.g:return{url:"".concat(O,"/").concat(e,"/").concat(c.id)};case f.e:var l={filter:JSON.stringify({id:c.ids})};return{url:"".concat(O,"/").concat(e,"?").concat(Object(p.stringify)(l))};case f.f:var b=c.pagination,g=b.page,h=b.perPage,y=c.sort,J=y.field,S=y.order,x={sort:JSON.stringify([J,S]),range:JSON.stringify([(g-1)*h,g*h-1]),filter:JSON.stringify(Object(d.a)(Object(d.a)({},c.filter),{},Object(u.a)({},c.target,c.id)))};return{url:"".concat(O,"/").concat(e,"?").concat(Object(p.stringify)(x))};case f.h:return{url:"".concat(O,"/").concat(e,"/").concat(c.id),options:{method:"PUT",body:JSON.stringify(c.data)}};case f.a:return{url:"".concat(O,"/").concat(e),options:{method:"POST",body:JSON.stringify(c.data)}};case f.b:return{url:"".concat(O,"/").concat(e,"/").concat(c.id),options:{method:"DELETE"}};default:throw new Error("Unsupported fetch action type ".concat(t))}}(t,e,c);return r(n.url,n.options).then((function(e){return function(t,e,c,r){var n=t.headers,a=t.json;switch(e){case f.d:return{data:a.map((function(t){return t})),total:parseInt(n.get("content-range").split("/").pop(),10)};case f.a:return{data:Object(d.a)(Object(d.a)({},r.data),{},{id:a.id})};default:return{data:a}}}(e,t,0,c)}))},b=c(564),g=c(565),h=c(569),y=c(42),J=function(t){return Object(y.jsx)(b.a,Object(d.a)(Object(d.a)({},t),{},{children:Object(y.jsxs)(g.a,{rowClick:"edit",children:[Object(y.jsx)(h.a,{source:"id"}),Object(y.jsx)(h.a,{source:"customerName"}),Object(y.jsx)(h.a,{source:"date"}),Object(y.jsx)(h.a,{source:"products"})]})}))},S=function(){return Object(y.jsx)(i.a,{dataProvider:l,children:Object(y.jsx)(s.a,{name:"orders",list:J})})};o.a.render(Object(y.jsx)(n.a.StrictMode,{children:Object(y.jsx)(S,{})}),document.getElementById("root"))}},[[494,1,2]]]);
//# sourceMappingURL=main.3cf7d89d.chunk.js.map