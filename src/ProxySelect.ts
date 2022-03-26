const select = document.createElement("select");
fetch("/proxy/list").then((res) => {
  console.log(res);
});
select.onchange = (e: any) => {
  console.log(e.target.value);
};

export default select;
