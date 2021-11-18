const config = {
    providerId: "webpass_1",
    doors: ["my door"],
    server:{
        cors: {
            enabled: true,
            origin: []
        },
        https: {
            enabled: false,
            key: "",
            cert: "",
            port: 443
        },
        http:{
            enabled: true,
            port: 83
        }
    },
    token:{
        fetch: false,
        key: "Authorization",
        refresh: 0
    },
    authentication:{
        username: "",
        password: "",
        headers: {"Authorization": "Basic YWRtaW46YWRtaW4="}
    },
    target:{
        url: "http://118.189.22.111:1027/"
    },
    master:{
        url: "http://127.0.0.1:8080/"
    }
}

module.exports = config;