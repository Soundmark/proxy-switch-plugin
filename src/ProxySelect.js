"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var select = document.createElement("select");
fetch("/proxy/list")
    .then(function (res) { return res.json(); })
    .then(function (data) {
    var _a;
    if ((_a = data === null || data === void 0 ? void 0 : data.list) === null || _a === void 0 ? void 0 : _a.length) {
        var innerHtml_1 = "";
        data.list.forEach(function (item) {
            innerHtml_1 += "<option value=".concat(item, ">").concat(item, "</option>");
        });
        select.innerHTML = innerHtml_1;
        var sessionProxyKey = sessionStorage.getItem("proxy-key");
        if ((data === null || data === void 0 ? void 0 : data.defaultProxy) && !sessionProxyKey) {
            sessionStorage.setItem("proxy-key", data.defaultProxy);
        }
        select.value = sessionProxyKey || (data === null || data === void 0 ? void 0 : data.defaultProxy) || data.list[0];
    }
});
select.onchange = function (e) {
    sessionStorage.setItem("proxy-key", e.target.value);
    fetch("/proxy/change?proxy=".concat(e.target.value));
};
exports.default = select;
//# sourceMappingURL=ProxySelect.js.map