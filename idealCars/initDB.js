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

    // Obtener los IDs de los tres usuarios
    const [ juan, jose, jorge ] = await Promise.all([
        User.findOne({name: "juan"}),
        User.findOne({name: "jose"}),
        User.findOne({name: "jorge"}), // Añadir jorge
    ]);

    // Insertar la nueva lista de 20 productos
    const insertResult = await Product.insertMany([
        {name: "Toyota", model: "Corolla", color: "Blanco", year: 2022, price: 23000, kilometer: 25000, images: [], owner: juan._id},
        {name: "Volkswagen", model: "Golf", color: "Negro", year: 2021, price: 21500, kilometer: 32000, images: [], owner: juan._id}, 
        {name: "Honda", model: "Civic", color: "Plata", year: 2020, price: 19500, kilometer: 40000, images: [], owner: jose._id},
    ]);
    console.log(`Created ${insertResult.length} products`);
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