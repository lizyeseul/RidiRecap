$(document).ready(function() {
    initDB();
    setRidiGlobalVal();
    $(document).on("click", "#load_order_list", () => getRidiHistoryHTML())
    // $(document).on("click", "#load_index", () => {
    //     window.location.href = "index.html"
    // })
}) ;

