const cache = {
    initialized: false,
    registerKey: "",
    providerId: "",
    doors: {},
    doorlist: [],
    api:{
        token: '',
        headers: {}
    },
}

module.exports = cache;