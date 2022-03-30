const select = document.createElement("select");
fetch("/proxy/list")
  .then((res) => res.json())
  .then((data) => {
    if (data?.list?.length) {
      let innerHtml = "";
      data.list.forEach((item) => {
        innerHtml += `<option value=${item}>${item}</option>`;
      });
      select.innerHTML = innerHtml;
      const sessionProxyKey = sessionStorage.getItem("proxy-key");
      if (data?.defaultProxy && !sessionProxyKey) {
        sessionStorage.setItem("proxy-key", data.defaultProxy);
      }
      select.value = sessionProxyKey || data?.defaultProxy || data.list[0];
    }
  });
select.onchange = (e: any) => {
  sessionStorage.setItem("proxy-key", e.target.value);
  fetch(`/proxy/change?proxy=${e.target.value}`);
};

export default select;