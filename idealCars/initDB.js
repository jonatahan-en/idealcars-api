import "dotenv/config"
import readLine from 'node:readline'
import connectMongoose from "./lib/connectMongoose.js";
import Product from "./models/Products.js";
import User from "./models/User.js"


const connection = await connectMongoose();
console.log("Connected to MongoDB:",connection.name) 

const questionResponse = await ask("Estas seguro que quieres vaciar la base de datos y crear una nueva base de datos de inicio?")
if(questionResponse.toLowerCase() !== "yes"){
    console.log("Operacion abortada!")
    process.exit()
}

await initUser()
await initproducts();

connection.close()

async function initproducts(){
    const deleteResult = await Product.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} products`);

    const [ juan, jose] = await Promise.all([
        User.findOne({name: "juan"}),
        User.findOne({name: "jose"}),
    ])

    const insertResult = await Product.insertMany([
        {name: "Toyota ", model: "Corolla",color: "gris",year: 2022, price: 20000,  kilometer: 15000, image: "toyota.jpg", owner: juan._id},
        {name: "Ford", model: "Focus", color: "gris", year: 2020, price: 18000, kilometer: 20000, image: "ford.jpg", owner: juan._id},
        {name: "Honda", model: "Civic", color: "blanco", year: 2021, price: 22000, kilometer: 10000, image: "honda.jpg", owner: juan._id},   
        {name: "Chevrolet", model: "Cruze", color: "negro", year: 2019, price: 16000, kilometer: 30000,  image: "chevrolet.jpg", owner: jose._id},
    ])
    console.log(`Create ${insertResult.length} products`);
}

async function initUser(){
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} users`)
    const insertResult = await User.insertMany([
        {name:"juan", email:"juan@example.com", password: await User.hashPassword("1234")},
        {name:"jose", email:"jose@example.com", password: await User.hashPassword("1234")},
        {name:"jorge", email:"jorge@example.com", password: await User.hashPassword("1234")}
    ])
    console.log(`Create ${insertResult.length} users`)
}

function ask(questionText){
    return new Promise((resolve, reject) => {
        const consoleInterFace = readLine.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        consoleInterFace.question(questionText, answer => {
            consoleInterFace.close()
            resolve(answer)
        })
    })
}