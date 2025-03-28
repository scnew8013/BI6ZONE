document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("mouseover", () => {
        item.classList.add("floating");
    });
    item.addEventListener("mouseleave", () => {
        item.classList.remove("floating");
    });
});
