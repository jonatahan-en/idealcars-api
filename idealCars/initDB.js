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

    // Obtener los IDs de los usuarios
    const [ juan, jose, jorge, Ruben ] = await Promise.all([
        User.findOne({name: "juan"}),
        User.findOne({name: "jose"}),
        User.findOne({name: "jorge"}),
        User.findOne({name: "Ruben Ponce"})
    ]);

    
    const insertResult = await Product.insertMany([
        {brand: "Toyota", model: "Corolla", color: "Blanco", year: 2022, price: 23000, kilometer: 25000, images: [], owner: juan._id},
        {brand: "Volkswagen", model: "Golf", color: "Negro", year: 2021, price: 21500, kilometer: 32000, images: [], owner: juan._id}, 
        {brand: "Honda", model: "Civic", color: "Plata", year: 2020, price: 19500, kilometer: 40000, images: [], owner: jose._id},
        {brand: "BMW", model: "Serie 3", color: "Azul", year: 2023, price: 45000, kilometer: 5000, images: [], owner: Ruben._id},
        {brand: "Audi", model: "A4", color: "Rojo", year: 2021, price: 38000, kilometer: 18000, images: ["img_cars/rPonce/audi_1.png"], owner: Ruben._id},
        {brand: "Mercedes-Benz", model: "Clase C", color: "Gris", year: 2022, price: 52000, kilometer: 12000, images: ["mercedes-c-1.jpg", "mercedes-c-2.jpg"], owner: Ruben._id},
        {brand: "Ford", model: "F-150", color: "Negro", year: 2020, price: 36000, kilometer: 45000, images: ["ford-f150-1.jpg", "ford-f150-2.jpg"], owner: Ruben._id},
    ]);
    console.log(`Created ${insertResult.length} products`);
}

async function initUser(){
    const deleteResult = await User.deleteMany();
    console.log(`Deleted ${deleteResult.deletedCount} users`)
    const insertResult = await User.insertMany([
        {name:"juan",username:"juanan", email:"juan@example.com", password: await User.hashPassword("GABInico22@")},
        {name:"jose",username:"josemi", email:"jose@example.com", password: await User.hashPassword("GABInico22@")},
        {name:"jorge",username:"jorgeV", email:"jorge@example.com", password: await User.hashPassword("GABInico22@")},
        {name:"Ruben Ponce", username:"PonceR", email:"ruben@example.com", password: await User.hashPassword("GABInico22@")}
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