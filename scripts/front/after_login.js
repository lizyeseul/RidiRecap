$(document).ready(function() {
    initDB();
    $(document).on("click", "#load_order_list", () => getRidiHistoryHTML())
}) ;

