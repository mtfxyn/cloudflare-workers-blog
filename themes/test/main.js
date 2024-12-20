const throttle = (e, t) => {
        let s, o, n;
        return function() {
            const i = this,
                a = arguments;
            s ? (clearTimeout(o), o = setTimeout(function() { Date.now() - n >= t && (e.apply(i, a), n = Date.now()) }, Math.max(t - (Date.now() - n), 0))) : (e.apply(i, a), n = Date.now(), s = !0)
        }
    },
    delayTime = 420;
window.addEventListener("DOMContentLoaded", e => {
    const t = document.querySelector(".header");
    if (t) {
        const e = window.getComputedStyle(t, null).getPropertyValue("height");
        document.documentElement.style.setProperty("--header-height", e)
    }
}, { once: !0 }), window.addEventListener("DOMContentLoaded", e => {
    const n = document.querySelector(".nav-toggle"),
        o = document.createElement("div");
    o.className = "nav-toggle-inner", n.appendChild(o);
    for (let e = 0; e < 3; e++) {
        const t = document.createElement("span");
        o.appendChild(t)
    }
    const s = document.getElementById("nav-toggle"),
        t = document.querySelector(".header"),
        i = document.querySelector(".nav-curtain");
    s.addEventListener("change", e => { e.target.checked ? (t.classList.add("open"), n.classList.add("open"), t.classList.remove("fade"), i.style = "display: block") : (t.classList.remove("open"), n.classList.remove("open"), t.classList.add("fade")) }), i.addEventListener("animationend", e => { s.checked || e.target.removeAttribute("style") }), window.addEventListener("scroll", throttle(function() { l() }, delayTime));
    const r = window.getComputedStyle(document.documentElement, null).getPropertyValue("--max-width");
    let c = window.matchMedia(`(max-width: ${r})`);
    c.addListener(e => { e.matches || a(!0) });

    function l() {
        const e = document.getElementById("search-input");
        if (e && e === document.activeElement) return;
        a()
    }

    function a(e) { s.checked && (s.checked = !1, t.classList.remove("open"), n.classList.remove("open"), e ? i.removeAttribute("style") : t.classList.add("fade")) }
}, { once: !0 }), window.addEventListener("DOMContentLoaded", e => {
    const t = document.getElementById("back-to-top");
    t !== null && window.addEventListener("scroll", throttle(function() { window.scrollY > 100 ? t.classList.add("show") : t.classList.remove("show") }, delayTime))
}, { once: !0 });
const userPrefers = localStorage.getItem("theme");
userPrefers === "dark" ? changeModeMeta("dark") : userPrefers === "light" && changeModeMeta("light"), window.matchMedia("(prefers-color-scheme: dark)").addListener(e => { changeMode() }), window.addEventListener("DOMContentLoaded", e => {
    changeMode();
    const t = document.getElementById("theme-switcher");
    t && t.addEventListener("click", e => { e.preventDefault(), changeModeMeta(getCurrentTheme() == "dark" ? "light" : "dark"), changeMode(), storePrefers() })
}, { once: !0 }), window.addEventListener("storage", function(e) {
    if (e.key !== "theme") return;
    changeModeMeta(e.newValue === "dark" ? "dark" : "light"), changeMode()
});

function getCurrentTheme() { return JSON.parse(window.getComputedStyle(document.documentElement, null).getPropertyValue("--theme-name")) }

function changeModeMeta(e) { document.documentElement.setAttribute("data-theme", e) }

function changeMode() {
    const e = getCurrentTheme() === "dark",
        t = e ? "#16171d" : "#fff";
    if (document.querySelector('meta[name="theme-color"]').setAttribute("content", t), typeof mermaidConfig != "undefined") {
        const t = document.querySelectorAll(".mermaid");
        t.forEach(e => { e.getAttribute("data-processed") ? (e.removeAttribute("data-processed"), e.innerHTML = e.getAttribute("data-graph")) : e.setAttribute("data-graph", e.textContent) }), e ? (mermaidConfig.theme = "dark", mermaid.initialize(mermaidConfig), mermaid.init()) : (mermaidConfig.theme = "default", mermaid.initialize(mermaidConfig), mermaid.init())
    }
}

function storePrefers() { window.localStorage.setItem("theme", getCurrentTheme()) }
window.addEventListener("DOMContentLoaded", e => {
    const t = "复制",
        s = "已复制";
    document.querySelectorAll(".post-body > pre").forEach(e => {
        const t = document.createElement("div");
        e.parentNode.replaceChild(t, e), t.appendChild(e)
    });

    function n(e) {
        const n = document.querySelectorAll("table.lntable, .highlight > pre, .post-body > div > pre");
        n.forEach(n => {
            n.parentNode.style.position = "relative";
            const o = document.createElement("button");
            o.className = "copy-button", o.type = "button", o.innerText = t;
            let i;
            n.classList.contains("lntable") ? i = n.querySelectorAll(".lntd")[1] : i = n.querySelector("code"), o.addEventListener("click", () => { e.writeText(i.innerText).then(() => { o.blur(), o.innerText = s, setTimeout(() => { o.innerText = t }, 1e3) }).catch(e => { o.innerText = "Error", console.error(e) }) }), n.appendChild(o), n.parentNode.addEventListener("mouseover", () => { o.style = "visibility: visible; opacity: 1" }), n.parentNode.addEventListener("mouseout", () => { o.style = "visibility: hidden; opacity: 0" })
        })
    }
    if (navigator && navigator.clipboard) n(navigator.clipboard);
    else {
        const e = document.createElement("script");
        e.src = "https://cdn.jsdelivr.net/npm/clipboard-polyfill@2.8.6/dist/clipboard-polyfill.min.js", e.defer = !0, e.onload = function() { n(clipboard) }, document.head.appendChild(e)
    }
}, { once: !0 })



const fieldNameMapping = {
    ip: "IP",
    colo: "|CDN",
    http: "|HTTP",
    tls: "|TLS",
    loc: "|LOC",
    sni: "|SNI"
};

// 向目标 URL 发起请求并提取数据
fetch('https://www.mtfxyn.eu.org/cdn-cgi/trace')
    .then(response => response.text())
    .then(traceData => {
        // 解析返回的 trace 数据
        const parsedData = {};
        traceData.trim().split("\n").forEach(line => {
            const [key, value] = line.split("=");
            parsedData[key.trim()] = value.trim();
        });

        // 提取需要展示的字段
        const fieldsToDisplay = Object.keys(fieldNameMapping); // 从映射中获取字段顺序
        const dataDisplay = document.getElementById("data-display");

        // 清空当前显示内容
        dataDisplay.innerHTML = '';

        // 动态生成并显示提取的字段
        fieldsToDisplay.forEach(field => {
            const value = parsedData[field] || "N/A"; // 如果没有值则显示 N/A
            const displayName = fieldNameMapping[field] || field; // 使用映射表显示自定义名称
            const dataItem = document.createElement("div");
            dataItem.className = "data-item";
            dataItem.innerHTML = `<span>${displayName}:</span> <span class="data-value">${value}</span>`;
            dataDisplay.appendChild(dataItem);
        });
    })
    .catch(error => {
        // 如果请求失败，显示错误信息
        const dataDisplay = document.getElementById("data-display");
        dataDisplay.innerHTML = '<p>无法加载数据，请稍后再试。</p>';
        console.error('Error fetching trace data:', error);
    });