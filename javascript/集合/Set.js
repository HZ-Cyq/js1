let set1 = new Set([1, 2, 3, 4]);
let set2 = new Set([6, 5, 4, 2]);
set1.add()
union1(set1, set2);
/**
 * 合并两个set
 * @param {} set1 
 * @param {} set2 
 */
function union1(set1, set2) {
    let re = set1.union(set2);
    console.log(re);
}
