
module.exports = {

  selectRandomElement: function(arr) {
    const n = parseInt(Math.random() * arr.length)
    return arr[n]
  }
}
