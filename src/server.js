const {app, chatserver} = require("./index");
const port = 3040;
const connect = require("./configs/db")

chatserver.listen(port+1, ()=>{
    console.log("socket connect");
})

const server = app.listen(port, async () => {
    try {
        await connect();
        console.log(`Running ${port}`)
    } catch (error) {
        console.log("err", error)
    }
});

// for socket connect use localhost:3041
// for normal api use localhost:3040