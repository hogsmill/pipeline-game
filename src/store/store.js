import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function features(state, statuses) {
  const features = []
  if (state.team.id) {
    for (let i = 0; i < state.team.features.length; i++) {
      for (let j = 0; j < statuses.length; j++) {
        if (state.team.features[i].status == statuses[j]) {
          features.push(state.team.features[i])
        }
      }
    }
  }
  return features
}

export const store = new Vuex.Store({
  state: {
    thisGame: 'The Pipeline Game',
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    walkThrough: false,
    currentTab: 'game',
    host: false,
    games: [],
    teams: [],
    gameId: null,
    teamId: null,
    game: {},
    team: {},
    selectedFeatures: [],
    selectedEffort: 0,
    editingGame: {},
    editingTeams: []
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getHost: (state) => {
      return state.host
    },
    getCurrentTab: (state) => {
      return state.currentTab
    },
    getConnections: (state) => {
      return state.connections
    },
    getConnectionError: (state) => {
      return state.connectionError
    },
    getLocalStorageStatus: (state) => {
      return state.localStorageStatus
    },
    getGames: (state) => {
      return state.games
    },
    getGameId: (state) => {
      return state.gameId
    },
    getGame: (state) => {
      return state.game
    },
    getTeams: (state) => {
      return state.teams
    },
    getTeamId: (state) => {
      return state.teamId
    },
    getTeam: (state) => {
      return state.team
    },
    getFeaturesToDevelop: (state) => {
      return features(state, ['To Develop', 'Fixing Bugs'])
    },
    getFeaturesInTest: (state) => {
      return features(state, ['In Test'])
    },
    getFeaturesDelivered: (state) => {
      return features(state, ['Delivered'])
    },
    getSelectedFeatures: (state) => {
      if (state.team.id) {
        const features = []
        for (let i = 0; i < state.team.features.length; i++) {
          if (state.team.features[i].status == 'To Develop' && state.team.features[i].selected) {
            features.push(state.team.features[i])
          }
        }
        return state.selectedFeatures = features
      }
    },
    getSelectedEffort: (state) => {
      if (state.team.id) {
        let effort = 0
        for (let i = 0; i < state.team.features.length; i++) {
          if (state.team.features[i].status == 'To Develop' && state.team.features[i].selected) {
            effort = effort + state.team.features[i].effort
          }
        }
        return state.selectedEffort = effort
      }
    },
    getFeatures: (state) => {
      return state.team.features
    },
    getBugValues: (state) => {
      return state.game.bugValues
    },
    getEditingGame: (state) => {
      return state.editingGame
    },
    getEditingTeams: (state) => {
      return state.editingTeams
    }
  },
  mutations: {
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    updateConnectionError: (state, payload) => {
      state.connectionError = payload
    },
    localStorageStatus: (state, payload) => {
      state.localStorageStatus = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateCurrentTab: (state, payload) => {
      state.currentTab = payload
    },
    updateGames: (state, payload) => {
      state.games = payload
    },
    updateTeams: (state, payload) => {
      state.teams = payload
    },
    updateGameId: (state, payload) => {
      state.gameId = payload
    },
    updateTeamId: (state, payload) => {
      state.teamId = payload
    },
    updateGame: (state, payload) => {
      state.game = payload
    },
    updateTeam: (state, payload) => {
      state.team = payload
    },
    updateFeatures: (state, payload) => {
      state.features = payload
    },
    updateEditingTeams: (state, payload) => {
      state.editingTeams = payload
    }
  },
  actions: {
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    },
    updateConnectionError: ({ commit }, payload) => {
      commit('updateConnectionError', payload)
    },
    localStorageStatus: ({ commit }, payload) => {
      commit('localStorageStatus', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateCurrentTab: ({ commit }, payload) => {
      commit('updateCurrentTab', payload)
    },
    updateGames: ({ commit }, payload) => {
      commit('updateGames', payload)
    },
    updateTeams: ({ commit }, payload) => {
      commit('updateTeams', payload)
    },
    updateGameId: ({ commit }, payload) => {
      commit('updateGameId', payload)
    },
    updateTeamId: ({ commit }, payload) => {
      commit('updateTeamId', payload)
    },
    updateGame: ({ commit }, payload) => {
      commit('updateGame', payload)
    },
    updateTeam: ({ commit }, payload) => {
      commit('updateTeam', payload)
    },
    updateFeatures: ({ commit }, payload) => {
      commit('updateFeatures', payload)
    },
    updateEditingTeams: ({ commit }, payload) => {
      commit('updateEditingTeams', payload)
    },
  }
})
