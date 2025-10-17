
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
    
    if(t.title.main.includes("외전")) return null;
    if(t.title.main.includes("세트")) return null;

    //TODO t.title.main.includes("삽화")
    
    //case1. 세트
    //1-1. <제목> 세트
    //1-2.[nn%▼] <제목> 세트
    //1-3.[완결세트] 제목
    let titRegexCase1 = [/*{
        regex: /(세트)/,
        handler: (groupStr) => { const[_, res] = groupStr; return res;}
    },*/{
        regex: /^<.+?> (세트)$/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "c11"; 
                                return res;}
    },{
        regex: /^\[\d+%▼\] <.+?> (세트)$/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "c12"; 
                                return res;}
    },{
        regex: /^\[완결세트\] (.+?)$/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "c13"; 
                                return res;}
    }];
    
    //case2. 외전
    //unit_id 4993761 프롤로그스토리
    //unit_id 77667 '나 혼자만 레벨업 244화 (외전 1)'
    //unit_id 1829772 '백작가의 망나니가 되었다 외전 1. 신입사원 김록수 1'
    //book_id 3049018439 '그믐밤에 달이 뜬다 7권+외전 1 (완결)' ...
    //2-4. nn화 (외전)
    //2-1. {특별}? 외전 nn화
    //2-2. 외전 상하{권}? 
    //2-3. {특별}? 외전
    let titRegexCase2 = [//749
    {//78
        unitId: 4993761,
        regex: /외전([Ⅰ|Ⅱ|Ⅲ|Ⅳ|Ⅴ])\. (\d+[권화]?)/,
        handler: (groupStr) => { const[_, res1, res2] = groupStr; 
                                return "unit"; 
                                return '외전'+(res1.charCodeAt()-8543) +". "+ res2;}
    },
    {//21
        unitId: 77667,
        regex: /(\d+[권화]?\s* \(외전 \d+[권화]?\))/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "unit"; 
                                return res;}
    },
    {//22
        unitId: 1829772,
        regex: /(외전\s*\d+[권화]?.*?\d+)$/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "unit"; 
                                return res;}
    },
    {//5
        bookId: [3049018439,2065018053,2065032436,2065034933,2065034954],
        handler: (bookId) => { switch(bookId) {
                                // case 3049018439: return "7권+외전 1";
                                // case 2065018053: return "221화(+ 외전 1, 2화)";
                                // case 2065018053: return "438화 (+ 문현아 외전)";
                                // case 2065034933: return "500화(+ 수능 외전)";
                                // case 2065034954: return "501화(+ 수능 외전 (2))";
                                default: return "book";
                            }}
    },
    {//99
        regex: /((?:\d+[권화])+\s*\(외전\))/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "unit"; 
                                return res;}
    },
    {//471
        regex: /((?:특별\s*)?외전\s*(?:\d+부*)?\s*\d+[권화]?)/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "c21"; 
                                return res;}
    },
    {//4
        regex: /(외전\s*[상하]+[권화]?)/,
        handler: (groupStr) => { const[_, res] = groupStr; 
                                return "c22"; 
                                return res;}
    },
    {//49 예외처리 남긴 했는데..
        regex: /((?:스페셜\s*)?(?:특별\s*)?외전)/,
        handler: (groupStr) => { const[_, res] = groupStr;
                                return "t"; 
                                return res;}
    },
    ];

    // case3 n부 n화
    let titRegexCase3 = [//
    {//해리포터
        unitId: [3778645],
        regex: /(.*)/,
        handler: (groupStr) => { const[res] = groupStr; 
                                return "unit"; 
                                return res;}
    },
    {//5
        bookId: [3010017294],
        handler: (bookId) => { switch(bookId) {
                                // case 3010017294: return "16화 (리디 한정판)";
                                default: return "book";
                            }}
    },
    {
        regex: /((?:\d+부 *)*\d+[권화]+)/,
        handler: (groupStr) => { const[_, res] = groupStr;
                                // return "t"; 
                                return res;}
    },
    ];
    
    function processText(t) {
        let tit = t.title.main;
        if(tit.includes("세트")) {
            for(const {regex, handler} of titRegexCase1) {
                let match = tit.match(regex);
                if(match) {
                    return handler(match);
                }
            }
        }
        if(tit.includes("외전")) {
            for(const {regex, handler, unitId, bookId} of titRegexCase2) {
                if(UTIL.isNotEmpty(bookId)) {
                    if(bookId.indexOf(t.book_id) > -1) {
                        return handler(t.book_id); 
                    }
                }
                else if(UTIL.isNotEmpty(unitId)) {
                    if(unitId == t.unit_id) {
                        let match = tit.match(regex);
                        if(match) {
                            return handler(match);
                        }
                    }
                }
                else {
                    let match = tit.match(regex);
                    if(match) {
                        return handler(match);
                    }
                }
            }
        }
        for(const {regex, handler, unitId, bookId} of titRegexCase3) {
            if(UTIL.isNotEmpty(bookId)) {
                if(bookId.indexOf(t.book_id) > -1) {
                    return handler(t.book_id); 
                }
            }
            else if(UTIL.isNotEmpty(unitId)) {
                if(unitId.indexOf(t.unit_id) > -1) {
                    let match = tit.match(regex);
                    if(match) {
                        return handler(match);
                    }
                }
            }
            else {
                let match = tit.match(regex);
                if(match) {
                    // t2.unit_id = t.unit_id;
                    if([5539720,5022808].indexOf(t.unit_id) > -1) {
                        return handler(match);
                    }
                    else if([6322951,2147066,3396974,6711657,2450344,
                             5186352,6911694,5467573,4477105,5811725,
                             4109034,5917486,3577312,4200850,2108832,
                             4071987].indexOf(t.unit_id) > -1) {
                        return "t";
                    }
                    return "t";
                    return handler(match);
                }
            }
        }
        return "t";
    }
    t2.ep_n = processText(t);
    if(["c11","c12","c13","unit","c21","c22","book"].indexOf(t2.ep_n) > -1)  return null;

    // if(tit.includes("세트")) {
    //     //소제목에 세트 라는 단어가 포함된 경우가 있어서 고려해야 됨
    //     t2.ep_n = "세트"
    //     // t2.ep_n = "t"
    // }
    // else if(tit.includes("외전")) {
    //     //오크지만 찬양해 229화 (외전 1)
    //     //서브 남주가 파업하면 생기는 일 233화(외전)
    //     //개정판 | 하얀 늑대들 16 (완결)
    //     let matches = tit.match(/외전\s*(\d+부 *)*\d+[권화]+/g);
    //     if(UTIL.isNotEmpty(matches)) {
    //         t2.ep_n = matches[0];
    //         t2.ep_n = "t"
    //     }
    // }
    // else {
    //     let matches = tit.match(/(\d+부 *)*\d+[권화]/g); //n부 n권/화
    //     if(UTIL.isNotEmpty(matches)) {
    //         t2.ep_n = matches[0];
    //         // if(tit.includes("외전")) {
    //         //     t2.ep_n = "외전 "+t2.ep_n;
    //         // }
    //         t2.ep_n = "t"
    //     }
    // }
    // else {
    //         t2.ep_n = "t"
    // }
    
    // if(t.hasOwnProperty("series")) {
    //     tit = tit.replaceAll(t.series.property.title, "").trim();
    // }
    // else if(t.hasOwnProperty("display_title") && t.display_title != null) {
    //     tit = tit.replaceAll(t.display_title, "").trim();
    // }
    // tit = tit.replace(/[(|)|<|>]/g, "").trim();
    

    if(t2.ep_n == null) {
        return null
    }

    t2.main_tit = t.title.main;
    // if(!t.title.hasOwnProperty("sub")) return null
    // t2.t_sub = t.title.sub
    
    if(t2.ep_n == 't') {
        return null
    }
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
    if(a == null || b == null) return 0;
    if(a.main_tit < b.main_tit) return -1;
    if(a.main_tit > b.main_tit) return 1;
    return 0;
});
console.clear()