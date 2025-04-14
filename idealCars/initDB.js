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

await initproducts();
await initUser()

connection.close()

async function initproducts(){
    const deleteResult = await Product.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} products`);
    const insertResult = await Product.insertMany([
        { name: "Toyota ", model: "Corolla",color: "rojo",year: 2022, price: 20000,  kilometre: 15000, color: "Blue", imageUrl: "https://example.com/toyota-corolla.jpg" },
        {name: "Ford", model: "Focus", color: "verde", year: 2020, price: 18000, kilometre: 20000, color: "Green", imageUrl: "https://example.com/ford-focus.jpg"},
        {name: "Honda", model: "Civic", color: "amarillo", year: 2021, price: 22000, kilometre: 10000, color: "Yellow", imageUrl: "https://example.com/honda-civic.jpg"},   
        {name: "Chevrolet", model: "Cruze", color: "naranja", year: 2019, price: 16000, kilometre: 30000, color: "Orange", imageUrl: "https://example.com/chevrolet-cruze.jpg"},
    ])
    console.log(`Create ${insertResult.length} products`);
}

async function initUser(){
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} users`)
    const insertResult = await User.insertMany([
        {name:"juan", email:"juan@exemplo.com", password: await User.hashPassword("1234")},
        {name:"jose", email:"jose@exemplo.com", password: await User.hashPassword("1234")},
        {name:"jorge", email:"jorge@exemplo.com", password: await User.hashPassword("1234")}
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