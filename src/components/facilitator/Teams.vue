<template>
  <div class="graph-teams">
    <div v-if="!multiple">
      Select Team
      <select :id="'graph-team-' + graph + '-1'" @change="setSelectedGraphTeam(graph, 1)">
        <option value="">
          -- Select --
        </option>
        <option v-for="(team, index) in teams" :key="index" :selected="team.name == selectedGraphTeam1">
          {{ team.name }}
        </option>
      </select>
    </div>
    <div v-if="multiple" class="multiple">
      <table>
        <tr>
          <td>
            Select Team 1<br>
            <select :id="'graph-team-' + graph + '-1'" @change="setSelectedGraphTeam(graph, 1)">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, index) in teams" :key="index" :selected="team.name == selectedGraphTeam1">
                {{ team.name }}
              </option>
            </select>
          </td>
          <td>
            Select Team 2<br>
            <select :id="'graph-team-' + graph + '-2'" @change="setSelectedGraphTeam(graph, 2)" :disabled="!selectedGraphTeam1">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, index) in teams" :key="index" :selected="team.name == selectedGraphTeam2">
                {{ team.name }}
              </option>
            </select>
          </td>
          <td>
            Select Team 3<br>
            <select :id="'graph-team-' + graph + '-3'" @change="setSelectedGraphTeam(graph, 3)" :disabled="!(selectedGraphTeam1 && selectedGraphTeam2)" class="team-select">
              <option value="">
                -- Select --
              </option>
              <option v-for="(team, index) in teams" :key="index" :selected="team.name == selectedGraphTeam3">
                {{ team.name }}
              </option>
            </select>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'multiple',
    'graph'
  ],
  computed: {
    teams() {
      return this.$store.getters.getTeams
    },
    selectedGraphTeam1() {
      return this.$store.getters.getSelectedGraphTeam1
    },
    selectedGraphTeam2() {
      return this.$store.getters.getSelectedGraphTeam2
    },
    selectedGraphTeam3() {
      return this.$store.getters.getSelectedGraphTeam3
    }
  },
  methods: {
    setSelectedGraphTeam(graph, n) {
      const team = document.getElementById('graph-team-' + graph + '-' + n).value
      this.$store.dispatch('setSelectedGraphTeam', {team: team, n: n})
    }
  }
}
</script>

<style lang="scss">

.graph-teams {

  select {
    margin-left: 6px;
    width: 120px !important;
  }

  .multiple {
    table {
      border: none;
    }
  }
}

</style>
