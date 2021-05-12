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

function complete(feature) {
  let complete
  switch(feature.status) {
    case 'To Develop':
      complete = feature.effortDone + feature.selectedBy.length * 10 == feature.effort
      break
    case 'Fixing Bugs':
      complete = feature.bugEffortDone + feature.selectedBy.length * 10  == feature.bugEffort
      break
  }
  return complete
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
    myName: {},
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
    getMyName: (state) => {
      return state.myName
    },
    getFeaturesToDevelop: (state) => {
      return features(state, ['To Develop', 'Fixing Bugs'])
    },
    getFeaturesInTest: (state) => {
      return features(state, ['In Test'])
    },
    getFeaturesDelivered: (state) => {
      const fs = features(state, ['Delivered'])
      const feats = []
      for (let i = 0; i < fs.length; i++) {
        if (fs[i].customer) {
          feats.push(fs[i])
        }
      }
      return feats
    },
    getFeaturesNotWanted: (state) => {
      const fs = features(state, ['Delivered'])
      const feats = []
      for (let i = 0; i < fs.length; i++) {
        if (!fs[i].customer) {
          feats.push(fs[i])
        }
      }
      return feats
    },
    getSelectedFeatures: (state) => {
      const features = []
      if (state.team.id) {
        for (let i = 0; i < state.team.features.length; i++) {
          if (complete(state.team.features[i])) {
            features.push(state.team.features[i])
          }
        }
      }
      return features
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
    updateMyName: (state, payload) => {
      state.myName = payload
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
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateFeatures: ({ commit }, payload) => {
      commit('updateFeatures', payload)
    },
    updateEditingTeams: ({ commit }, payload) => {
      commit('updateEditingTeams', payload)
    },
  }
})
