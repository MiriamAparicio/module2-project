# module2-project
MODELS 

user: 
- username: String, required
- password: String, required


event:
- name: String, required
- date: Date, required
- description: String, required
- location: Point. Coordinates []
- owner: ObjectId(user)
- attendants: [ObjectIdUser]


ROUTES

index
 - GET /
 
auth
  - GET /auth/signup
  - POST /auth/signup
  - GET /auth/login
  - POST /auth/login
  - POST /auth/logout
  
user 
  - GET /user/:id
  - GET /user/update
  - POST /user/update
  
event
  - GET /event/:id
  - POST /event/:id/join
  - POST /event/:id/unjoin
  - POST /event/:id/delete
  
  - GET /event/new
  - POST /event
  
  - GET /event/:id/update
  - POST /event/:id/update
  


views

    pages

      error
        not-found.hbs
        error.hbs  

      homepage.hbs 

      user
        user.hbs(partial event-card.hbs)
        user-update.hbs

      auth
        signup.hbs
        login.hbs

      event
        event-detail.hbs
        event-create.hbs
        event-update.hbs

    layout.hbs

    partials
      event-card-partial.hbs


# Try app
[Project 2](https://ironhackproject2.herokuapp.com/)
  
  




  
  
