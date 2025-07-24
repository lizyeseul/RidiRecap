$(document).ready(function() {
    initDB();
    setRidiGlobalVal();
    $(document).on("click", "#init_page_info", () => updatePageInfo())
    $(document).on("click", "#load_order_list", () => syncOrderList())
    $(document).on("click", "#load_detail_list", () => syncOrderDetail())
    // $(document).on("click", "#load_index", () => {
    //     window.location.href = "index.html"
    // })
}) ;

