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
        // Asignados a Juan
        {name: "Toyota", model: "Corolla", color: "Blanco", year: 2022, price: 23000, kilometer: 25000, images: [], owner: juan._id},
        {name: "Volkswagen", model: "Golf", color: "Negro", year: 2021, price: 21500, kilometer: 32000, images: [], owner: juan._id},
        {name: "Renault", model: "Clio", color: "Azul", year: 2020, price: 14000, kilometer: 48000, images: [], owner: juan._id},
        {name: "Ford", model: "Focus", color: "Gris", year: 2021, price: 19000, kilometer: 35000, images: [], owner: juan._id},
        {name: "BMW", model: "Serie 3", color: "Negro", year: 2019, price: 35000, kilometer: 60000, images: [], owner: juan._id},
        {name: "Audi", model: "A4", color: "Blanco", year: 2018, price: 28000, kilometer: 70000, images: [], owner: juan._id},
        {name: "Hyundai", model: "Tucson", color: "Rojo", year: 2022, price: 26500, kilometer: 18000, images: [], owner: juan._id},
        // Asignados a Jose
        {name: "Honda", model: "Civic", color: "Plata", year: 2020, price: 19500, kilometer: 40000, images: [], owner: jose._id},
        {name: "Mercedes-Benz", model: "Clase C", color: "Negro", year: 2017, price: 32000, kilometer: 80000, images: [], owner: jose._id},
        {name: "Seat", model: "Ibiza", color: "Amarillo", year: 2021, price: 13000, kilometer: 30000, images: [], owner: jose._id},
        {name: "Mazda", model: "CX-5", color: "Blanco", year: 2020, price: 24000, kilometer: 45000, images: [], owner: jose._id},
        {name: "Citroën", model: "C3", color: "Verde", year: 2019, price: 11000, kilometer: 62000, images: [], owner: jose._id},
        {name: "Peugeot", model: "308", color: "Gris oscuro", year: 2020, price: 15000, kilometer: 50000, images: [], owner: jose._id},
        {name: "Nissan", model: "Qashqai", color: "Negro", year: 2021, price: 18900, kilometer: 38000, images: [], owner: jose._id},
        // Asignados a Jorge
        {name: "Volvo", model: "XC60", color: "Gris claro", year: 2019, price: 37000, kilometer: 55000, images: [], owner: jorge._id},
        {name: "Kia", model: "Sportage", color: "Naranja", year: 2022, price: 25000, kilometer: 15000, images: [], owner: jorge._id},
        {name: "Suzuki", model: "Vitara", color: "Marrón", year: 2020, price: 17000, kilometer: 42000, images: [], owner: jorge._id},
        {name: "Chevrolet", model: "Cruze", color: "Blanco", year: 2018, price: 12000, kilometer: 75000, images: [], owner: jorge._id},
        {name: "Mitsubishi", model: "Outlander", color: "Negro", year: 2021, price: 22000, kilometer: 33000, images: [], owner: jorge._id},
        {name: "Alfa Romeo", model: "Giulietta", color: "Rojo", year: 2019, price: 18000, kilometer: 47000, images: [], owner: jorge._id}
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