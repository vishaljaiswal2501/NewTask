const printDate = function () {
    let e= new Date()

let h= e.toLocaleString();
    console.log(h)
}

const printMonth = function () {
    let d= new Date()
    
    let g= d.toLocaleString("en-us",{month:"long"})
    console.log(g)
}

const getBatchinfo = function () {
    
    console.log('radon',"W3D1", 'the topic for today is Nodejs module system')
}
module.exports.printTodayDate = printDate
module.exports.printCurrentMonth = printMonth
module.exports.printBatchInformation = getBatchinfo