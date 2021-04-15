module.exports = {
    ensureAuthenticated : (req,res,next) => {
        if( req.isAuthenticated){
            return next();
        }else {
            req.flash("error_msg", "Please log in to view"); 
            res.redirect("/users/login")
        }
    }
}