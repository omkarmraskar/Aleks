
const helper = require("../helper");
const verifyToken = require("../services/molecule")


const authenticateUser = (req, res, next) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  const username = helper.getUsername(token);
  fetch(`http://localhost:3000/molecule/${id}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const author = data.data[0].Author;
      if (author === username) {
        next();
      } else {
        const error = new Error("You are not authorized.");
        error.status = 401; // Set the HTTP status code for the error response
        console.log("Error Authenticating User: ",error)
        throw error;
      }
    })
    .catch((error) => {
      next(error); // Pass the error object to the next middleware
    });
};

async function getUsername(token){
  try{
    const decodedToken = await verifyToken.verifyToken(token);
    const username = decodedToken
    return username;
  }
  catch(error){
    console.error("error getting username", error)
  }
};

module.exports = {
  authenticateUser,
};