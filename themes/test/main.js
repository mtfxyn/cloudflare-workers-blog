// Throttle函数
const throttle = (fn, delay) => {
    let timeout, lastRun;
    return function() {
        const context = this;
        const args = arguments;
        if (lastRun) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if (Date.now() - lastRun >= delay) {
                    fn.apply(context, args);
                    lastRun = Date.now();
                }
            }, Math.max(delay - (Date.now() - lastRun), 0));
        } else {
            fn.apply(context, args);
            lastRun = Date.now();
        }
    };
};

// 延迟时间
const delayTime = 420;

// 页面加载完成后设置header高度
window.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    if (header) {
        const headerHeight = window.getComputedStyle(header, null).getPropertyValue("height");
        document.documentElement.style.setProperty("--header-height", headerHeight);
    }
}, { once: true });

// 设置主题切换按钮
window.addEventListener("DOMContentLoaded", () => {
    const userPrefers = localStorage.getItem("theme");

    if (userPrefers === "dark") {
        changeModeMeta("dark");
    } else if (userPrefers === "light") {
        changeModeMeta("light");
    } else {
        // 检查系统偏好
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        changeModeMeta(prefersDark ? "dark" : "light");
    }

    const themeSwitcher = document.getElementById("theme-switcher");
    if (themeSwitcher) {
        themeSwitcher.addEventListener("click", (e) => {
            e.preventDefault();
            const newTheme = getCurrentTheme() === "dark" ? "light" : "dark";
            changeModeMeta(newTheme);
            changeMode();
            storePrefers(newTheme);
        });
    }

    // 监听系统颜色偏好变化
    window.matchMedia("(prefers-color-scheme: dark)").addListener(() => {
        changeMode();
    });
}, { once: true });

// 更新当前页面主题
function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme");
}

// 设置主题
function changeMode() {
    const isDarkMode = getCurrentTheme() === "dark";
    const themeColor = isDarkMode ? "#16171d" : "#ffffff";
    document.querySelector('meta[name="theme-color"]').setAttribute("content", themeColor);
}

// 设置 meta 中的 data-theme 属性
function changeModeMeta(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}
// 存储用户偏好设置
function storePrefers(theme) {
    window.localStorage.setItem("theme", theme);
}

// 导航菜单的逻辑
window.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navCurtain = document.querySelector(".nav-curtain");
    const header = document.querySelector(".header");
    if (navToggle) {
        const innerDiv = document.createElement("div");
        innerDiv.className = "nav-toggle-inner";
        navToggle.appendChild(innerDiv);
        for (let i = 0; i < 3; i++) {
            const span = document.createElement("span");
            innerDiv.appendChild(span);
        }

        navToggle.addEventListener("change", (e) => {
            if (e.target.checked) {
                header.classList.add("open");
                navToggle.classList.add("open");
                header.classList.remove("fade");
                navCurtain.style = "display: block";
            } else {
                header.classList.remove("open");
                navToggle.classList.remove("open");
                header.classList.add("fade");
            }
        });

        navCurtain.addEventListener("animationend", (e) => {
            if (!navToggle.checked) {
                navCurtain.removeAttribute("style");
            }
        });

        window.addEventListener("scroll", throttle(() => {
            if (document.getElementById("search-input") !== document.activeElement) {
                closeNav();
            }
        }, delayTime));
    }

    const maxWidth = window.getComputedStyle(document.documentElement, null).getPropertyValue("--max-width");
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth})`);
    mediaQuery.addListener((e) => {
        if (!e.matches) closeNav(true);
    });

    function closeNav(force = false) {
        if (navToggle.checked) {
            navToggle.checked = false;
            header.classList.remove("open");
            navToggle.classList.remove("open");
            if (!force) header.classList.add("fade");
        }
    }
}, { once: true });

// 返回顶部按钮的显示逻辑
window.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById("back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", throttle(() => {
            if (window.scrollY > 100) {
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        }, delayTime));
    }
}, { once: true });

// 监听 localStorage 变化，动态更新主题
window.addEventListener("storage", (e) => {
    if (e.key !== "theme") return;
    changeModeMeta(e.newValue === "dark" ? "dark" : "light");
    changeMode();
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