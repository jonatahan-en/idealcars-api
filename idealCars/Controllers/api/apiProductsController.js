import Product from "../../models/Products.js"
import createError from "http-errors"

export async function apiProductsList(req, res, next){
    try {
        const userId = req.apiUserId
        // http://localhost:3000/api/products?brand=ford&model=focus&color=red
        const filterBrand = req.query.brand || req.query.name // Admite ambos para compatibilidad
        const filterModel = req.query.model
        const filterColor = req.query.color
        const filterYear = req.query.year
        const filterPrice = req.query.price
        const filterKilometer = req.query.kilometer
        // http://localhost:3000/api/products?limit=2&skip=0&sort=brand
        const limit = parseInt(req.query.limit, 10) || 2
        const skip = parseInt(req.query.skip, 10) || 0
        const sort = req.query.sort || "brand" // Cambiado de "name" a "brand"
        // http://localhost:3000/api/products?fields=brand  < te devuelve solo la marca >
        const fields = req.query.fields 

        const filter = {owner: userId}
        if (filterBrand) {
            filter.brand = { $regex: filterBrand, $options: "i" } 
        }
        if (filterModel) {
            filter.model = { $regex: filterModel, $options: "i" } 
        }
        if (filterColor) {
            filter.color = { $regex: filterColor, $options: "i" }
        }
        if (filterYear) {
            const year = parseInt(filterYear, 10)
            if (!isNaN(year)) {
            filter.year =  filterYear;
            }
        }
        if (filterPrice) {
            const price = parseInt(filterPrice, 10)
            if (!isNaN(price)) {
            filter.price =  filterPrice;
            }
        }
        if (filterKilometer) {
            const kilometer = parseInt(filterKilometer, 10)
            if (!isNaN(kilometer)) {
            filter.kilometer =  filterKilometer;
            }
        }

        // Comprobar que el campo de ordenación existe en el esquema
        if (!['brand', 'model', 'color', 'year', 'price', 'kilometer'].includes(sort)) {
            sort = 'brand' // Cambiado de "name" a "brand"
        }

        const products = await Product.list(filter, limit, skip, sort, fields)
        const totalCount = await Product.countDocuments(filter)
        res.json({
            results: products,
            total: totalCount
        })
    } catch (error) {
        next(error)
    }
}

export async function apiProductGetOne(req, res, next){
    try {
        const userId = req.apiUserId
        const id = req.params.id
        const product = await Product.findOne({ _id: id, owner: userId })
        res.json({ result:product })
    } catch (error) {
        next(error)
    }
}

export async function apiProductNew(req, res, next){
    try {
        const userId = req.apiUserId
        const productNew = req.body
        const product = new Product(productNew)
        product.owner = userId
        product.image = req.file?.filename
        const saveProduct = await product.save()
        res.status(201).json({ result: saveProduct})

        
    } catch (error) {
        next(error)
    }
}

export async function apiProductUpdate(req, res, next){
    try {
        const userId = req.apiUserId
        const id = req.params.id
        const productData = req.body
        productData.image = req.file?.filename
        const productUpdate = await Product.findOneAndUpdate({ _id: id, owner: userId}, productData, { new: true })
        res.json({ result: productUpdate })
    } catch (error) {
        next(error)
    }
}

export async function apiProductDelete(req, res, next){
    try {
        const userId = req.apiUserId
        const id = req.params.id

        const product = await Product.findOne({ _id: id})
        if(!product){
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto inexistente`)
            return next(createError(404))
        }
        if (product.owner.toString() !== userId) {
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto de otro usuario`)
            return next(createError(401))
        }

        await Product.deleteOne({ _id: id })
        res.json({ result: "Producto eliminado" })
    } catch (error) {
        next(error)
    }
}