const Rayconnect = require("rayconnect-client").default

const rayconnect = new Rayconnect({
    scopes: 'user,chat', // example : chats,apps,users
    appID: 'anonymousechat', // your app id from registration process
    space: 'main', // main or debug
    type: 'micros' // micros for server and client for browsers (or cli client)
});

const tokens = [];

rayconnect.OnConnect(async () => {


    console.log("connected to bus");
    await rayconnect.GetUserAccess({
        username: "anonymousechat_admin_system",
        password: "x26akOx4XYPFbeVWa5wKOdJiFPOvQmUXb6Ys77FRRIS"
    })
    await rayconnect.changePermissions({
        mode: "add",
        method: "GET",
        address: "send",
        scope: 'chat',
        uid: "guest"
    })

    await rayconnect.changePermissions({
        mode: "add",
        method: "GET",
        address: "join",
        scope: 'user',
        uid: "guest"
    })

    await rayconnect.changePermissions({
        mode: "add",
        method: "GET",
        address: "get",
        scope: 'user',
        uid: "guest"
    })
})



rayconnect.Query({
    scope: "user",
    address: "join",
    method: "GET"
}, (req) => {
    tokens.push(req.token)
})


rayconnect.Query({
    scope: "user",
    address: "get",
    method: "GET"
}, (req) => {
    const token = tokens.pop()
    if (token == req.token) {
        tokens.push(token)
        return req.send({
            user: undefined
        })
    }
    req.send({
        user: token
    })
})
