const state = {
    token: null,
    theme: 'light',
    project_id: '0-0'
};

const mutations = {
    SetToken: (state, data) => {
        state.token = data
    },
    SetTheme: (state, data) => {
        state.theme = data
    },
    SetProjectID: (state, data) => {
        state.project_id = data
    }
};

const actions = {
    GetToken: ({commit}, data) => {
        commit('SetToken', data)
    },
    GetTheme: ({commit}, data) => {
        commit('SetTheme', data)
    },
    GetProjectID: ({commit}, data) => {
        commit('SetProjectID', data)
    }
};

const getters = {
    token: state => state.token,
    theme: state => state.theme,
    projectID: state => state.project_id
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
