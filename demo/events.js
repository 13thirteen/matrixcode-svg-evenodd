const code = document.getElementById("code");
const len = document.getElementById("len");
const text = document.getElementById("txt");
function update() { txt.innerText = code.svgSource; len.innerText = code.d.length; }
document.getElementById("inp").addEventListener("input", e => code.setAttribute("value", e.target.value));
document.getElementById("blocks").addEventListener("change", e => code.setAttribute("algo", "blocks"));
document.getElementById("runlength").addEventListener("change", e => code.setAttribute("algo", "runlength"));
document.getElementById("evenodd").addEventListener("change", e => code.setAttribute("algo", "evenodd"));
document.getElementById("fill").addEventListener("change", e => code.setAttribute("mode", "fill"));
document.getElementById("stroke").addEventListener("change", e => code.setAttribute("mode", "stroke"));
document.getElementById("separate").addEventListener("change", e => code.setAttribute("mode", "separate"));
document.getElementById("animate").addEventListener("change", e => code.setAttribute("mode", "animate"));
code.addEventListener("updated", e => { update() });
document.getElementById("button_copy").addEventListener("click", e => navigator.clipboard.writeText(txt.innerText).then(()=>{e.target.innerText="Copied! ✅";setTimeout(()=>e.target.innerText="Copy to clipboard", 1000)}));
update();