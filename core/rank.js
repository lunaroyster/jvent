module.exports.hot = (score, time, epoch)=> {
    score = score>1 ? score : 1;
    var logScore = Math.log(score);
};