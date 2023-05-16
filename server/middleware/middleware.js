const deleteFilter = (req, res, next) => {
    const id = req.params.id;
    fetch(`http://localhost:3000/molecule/${id}`, {
        method : "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const author = data.data[0].Author;
        if(author === 'Omkar'){
            next();
        }
        else{
            const error = new Error("You are not authorized to delete this molecule.");
            error.status = 401; // Set the HTTP status code for the error response
            next(error); // Pass the error object to the next middleware
        }
      })
}

module.exports = {
    deleteFilter
}