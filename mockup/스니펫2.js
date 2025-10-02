
var testFIlterList = resultList
// .forEach((item) => {
//     var a = item.categories;
//     a.map((i) => {
//         // delete i["id"]
//         // delete i["name"]
//         // delete i["unit_id"]
//         // i.unit_id = item.unit_id;
//     })
//     testFIlterList = [...testFIlterList, ...a];
// })
.map((item) => {
    var t = item;
    
    if(t == null || !Object.keys(t).length) return null;

    let t2 = {};
    let tit = t.title.main;
    if(tit.includes("세트")) {
        t2.ep_n = "세트"
        // t2.ep_n = "t"
    }
    else if(tit.includes("외전")) {
        //오크지만 찬양해 229화 (외전 1)
        //서브 남주가 파업하면 생기는 일 233화(외전)
        //개정판 | 하얀 늑대들 16 (완결)
        let matches = tit.match(/외전\s*(\d+부 *)*\d+[권화]+/g);
        if(UTIL.isNotEmpty(matches)) {
            t2.ep_n = matches[0];
            // t2.ep_n = "t"
        }
    }
    else {
        let matches = tit.match(/(\d+부 *)*\d+[권화]/g); //n부 n권/화
        if(UTIL.isNotEmpty(matches)) {
            t2.ep_n = matches[0];
            // if(tit.includes("외전")) {
            //     t2.ep_n = "외전 "+t2.ep_n;
            // }
            // t2.ep_n = "t"
        }
    }
    
    if(t.hasOwnProperty("series")) {
        tit = tit.replaceAll(t.series.property.title, "").trim();
    }
    else if(t.hasOwnProperty("display_title") && t.display_title != null) {
        tit = tit.replaceAll(t.display_title, "").trim();
    }

    tit = tit.replace(/[(|)|<|>]/g, "").trim();
    

    if(t2.ep_n == null) {
        t2.ep_n = null;
    }

    t2.main_tit = t.title.main;
    // if(!t.title.hasOwnProperty("sub")) return null
    // t2.t_sub = t.title.sub
    return t2;

    // return null
    // return t.hasOwnProperty("rent") && t.rent != null ? item : null;
    // return Object.keys(t).sort()
    // return t
})
// .filter((item) => {
//     if(item != null) {// && Object.keys(item).length > 1
//         return item   
//     }
// });

var testDIstinct = [...new Set(
    testFIlterList
    .map(item => JSON.stringify(item)))
]
.map(item => JSON.parse(item))
.sort(function(a,b) {
    if(a.main_tit < b.main_tit) return -1;
    if(a.main_tit > b.main_tit) return 1;
    return 0;
});