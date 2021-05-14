
module.exports = {

  add: function(mems, mem) {
    let found = false
    const members = []
    for (let i = 0; i < mems.length; i++) {
      const member = mems[i]
      if (mem.id == member.id) {
        found = true
        member.name = mem.name
      }
      members.push(member)
    }
    if (!found) {
      members.push(mem)
    }
    return members
  },

  remove: function(mems, mem) {
    let found = false
    const members = []
    for (let i = 0; i < mems.length; i++) {
      const member = mems[i]
      if (mem.id != member.id) {
        members.push(member)
      }
    }
    return members
  }
}
