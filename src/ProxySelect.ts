const select = document.createElement("select");
fetch("/proxy/list")
  .then((res) => res.json())
  .then((data) => {
    if (data?.list?.length) {
      let innerHtml = "";
      data.list.forEach((item) => {
        innerHtml += `<option value=${item.value}>${item.label}</option>`;
      });
      select.innerHTML = innerHtml;
    }
  });
select.onchange = (e: any) => {
  fetch(`/proxy/change?proxy=${e.target.value}`);
};

export default select;
