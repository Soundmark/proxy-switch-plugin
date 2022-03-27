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
            innerHtml_1 += "<option value=".concat(item.value, ">").concat(item.label, "</option>");
        });
        select.innerHTML = innerHtml_1;
    }
});
select.onchange = function (e) {
    fetch("/proxy/change?proxy=".concat(e.target.value));
};
exports.default = select;
//# sourceMappingURL=ProxySelect.js.map