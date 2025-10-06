import mongoose from "mongoose";

// Global variable 'cached' ko use kar rahe hain taaki baar-baar nayi DB connection na banani pade
let cached = global.mongoose;

// Agar global.mongoose pehle se exist nahi karta toh ek object banate hain
// jisme conn (connection) aur promise (connection promise) store hoga
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Agar pehle se ek connection bana hua hai, usko directly return kar do
    if (cached.conn) {
        return cached.conn;
    }

    // Agar abhi tak koi promise (connection ka process) chal nahi raha hai
    if (!cached.promise) {
        const opts = {
            bufferCommands: false // Normal me, agar DB connect nahi hai aur aap query bhejte ho, mongoose us query ko wait me rakhta hai.Yaha hum chahte hain ki wait na ho, fail ho jaye agar DB ready nahi hai.
        };
        // Mongoose se connect karte hain aur promise store kar dete hain
        cached.promise = mongoose
            .connect(`${process.env.MONGODB_URI}/quickcart`, opts)
            .then((mongoose) => {
                return mongoose; // jab connection ban jayega tab mongoose object return karega
            });
    }

    // Connection complete hone ka wait karte hain aur conn mein store karte hain
    cached.conn = await cached.promise;
    return cached.conn; // final connection return kar dete hain
}

export default connectDB; // connectDB ko export kar rahe hain taaki kahin aur use kar sakein
// conclusion of this code 
/*
Har baar naya connection banane ki jagah, hum ek global cache banate hain.
Agar connection pehle se bana hai, usko reuse karte hain.
Agar nahi bana hai, toh ek naya connection create karke cache kar lete hain.
Ye system especially Next.js / serverless apps me helpful hai kyunki har request me program restart hota hai, aur bina cache ke bahut saare extra connections ban jate.
*/