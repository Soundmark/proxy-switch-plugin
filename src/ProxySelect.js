const select = document.createElement("select");
select.classList.add("proxy-select");

if (process.env.NODE_ENV === "development") {
  fetch("/proxy/list")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.list) {
        let innerHtml = "";
        data.list.forEach((item) => {
          innerHtml += `<option value=${item}>${item}</option>`;
        });
        select.innerHTML = innerHtml;
        const sessionProxyKey = sessionStorage.getItem("proxy-key");
        if (data.defaultProxy && !sessionProxyKey) {
          sessionStorage.setItem("proxy-key", data.defaultProxy);
        }
        select.value = sessionProxyKey || data.defaultProxy || data.list[0];
      }
    });
  select.onchange = (e) => {
    sessionStorage.setItem("proxy-key", e.target.value);
    fetch(`/proxy/change?proxy=${e.target.value}`);
  };
}

export default select;
