import mongoose from "mongoose";

// Yaha ek schema define kar rahe hain user ke liye
// Schema = ek design/structure jisme decide hota hai ki MongoDB me data kaise store hoga
const userSchema = mongoose.Schema({
    // _id field (unique identifier for user)
    // type hona chahiye String, aur required hai (har user ka ek id hona zaroori hai)
    _id: { type: String, required: true },

    // name field (user ka naam)
    // String type aur required hai
    name: { type: String, required: true },

    // email field (user ka email address)
    // String type, required aur unique (matlab duplicate emails allowed nahi)
    email: { type: String, required: true, unique: true },

    // imageUrl field (user ki profile image ka URL)
    // String type aur required hai
    imageUrl: { type: String, required: true },

    // cartItems field (user ke cart me kya items hai uska data)
    // By default empty object hoga {}
    cartItems: { type: Object, default: {} }
}, { minimize: false });  
// minimize: false ka matlab: agar cartItems empty object hai {}, to MongoDB me save hote waqt usko remove mat karo.
// Default behaviour hota hai ki empty object ko store nahi karta, yaha force kiya gaya hai store karne ke liye.


// Ab ek Model banate hain 'User' ke liye
// mongoose.models.user pehle se model bana hua ho to use kar lo
// warna naya model banao schema ke saath
const User = mongoose.models.user || mongoose.model("user", userSchema);

// Is User model ko export kar dete hain taaki dusri files me use kar sake
export default User;
