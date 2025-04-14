export async function  index(req,res,next){
    const userId = req.session.userId
    res.render('home')
}