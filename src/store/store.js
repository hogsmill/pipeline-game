import { createStore } from 'vuex'

const features = (state, statuses) => {
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

const complete = (feature) => {
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

export const store = createStore({
  state: {
    thisGame: 'The Pipeline Game',
    connections: 0,
    connectionError: null,
    localStorageStatus: true,
    walkThrough: false,
    modals: {
      feedback: false,
      setGame: false,
      alert: false,
      customer: false
    },
    modalData: {},
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
    editingTeams: [],
    editingTeam: {}
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getHost: (state) => {
      return state.host
    },
    getModals: (state) => {
      return state.modals
    },
    getModalData: (state) => {
      return state.modalData
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
    },
    getEditingTeam: (state) => {
      return state.editingTeams.find((t) => {
        return t.editing
      })
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
    showModal: (state, payload) => {
      const modals = Object.keys(state.modals)
      for (let i = 0; i < modals.length; i++) {
        state.modals[modals[i]] = false
      }
      state.modals[payload] = true
    },
    hideModal: (state, payload) => {
      state.modals[payload] = false
    },
    setModalData: (state, payload) => {
      state.modalData = payload
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
    updateEditingGame: (state, payload) => {
      if (!payload) {
        payload = {
          game: {},
          teams: []
        }
      }
      state.editingGame = payload.game
      state.editingTeams = payload.teams
    },
    updateEditingTeamId: (state, payload) => {
      const teams = []
      for (let i = 0; i < state.editingTeams.length; i++) {
        const team = state.editingTeams[i]
        team.editing = team.id == payload
        teams.push(team)
      }
      state.editingTeams = teams
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
    showModal: ({ commit }, payload) => {
      commit('showModal', payload)
    },
    hideModal: ({ commit }, payload) => {
      commit('hideModal', payload)
    },
    setModalData: ({ commit }, payload) => {
      commit('setModalData', payload)
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
    updateEditingGame: ({ commit }, payload) => {
      commit('updateEditingGame', payload)
    },
    updateEditingTeamId: ({ commit }, payload) => {
      commit('updateEditingTeamId', payload)
    },
  }
})
