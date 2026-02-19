require('dotenv').config();
const cors=require('cors');
const express=require('express');
const app=express();
const port=process.env.PORT||3000;
const mongoose=require('mongoose');
const User=require('./models/userModel');

//conexion a la base de datos
mongoose.connect(process.env.DATABASE_URL).then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('Could not connect to MongoDB',err));

app.use(express.json());
app.use(cors());

const { auth, requiresAuth } = require('express-openid-connect');
app.use(
  auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    authRequired: false,
    auth0Logout: true,
  })
);


app.get('/',(req,res)=>{
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile',requiresAuth(),async(req,res)=>{
   if(req.oidc.isAuthenticated()){
        const auth0Id=req.oidc.user.sub;
        const name=req.oidc.user.name;
        const email=req.oidc.user.email;
        const role='user';
        console.log('Authenticated user:', { auth0Id, name, email });
        try{
            let user=await User.findOne({auth0Id:auth0Id});
            console.log('User found in database:', user);
            if(!user){
                user=new User({
                    auth0Id:auth0Id,
                    name:name,
                    email:email,
                    role:role
                });
                const newUser=await user.save();
                 res.send(JSON.stringify(newUser));
                 console.log('New user created:', newUser);
            }
        }catch(err){
            return res.status(500).json({message:err.message});
        }
    }

    res.send(JSON.stringify(req.oidc.user));
});




//rutas
const userRouter=require('./routes/users');
app.use('/users',requiresAuth(),userRouter);

const productRouter=require('./routes/products');
app.use('/products', requiresAuth(),productRouter);

const purchaseRouter=require('./routes/purchase');
app.use('/purchases', requiresAuth(),purchaseRouter);

const categoryRouter=require('./routes/category');
app.use('/categories',categoryRouter);

const rolRouter=require('./routes/role');
app.use('/roles',rolRouter);

//verificar conexion
const db=mongoose.connection;
db.on('error',(error)=>console.error(error));
db.once('open',()=>console.log('Connected to Database'));

//iniciar servidor
app.listen(port,()=>console.log(`Server is running on http://localhost: ${port}`));




