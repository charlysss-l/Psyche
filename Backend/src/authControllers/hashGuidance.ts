import bcrypt from 'bcryptjs';

const passwordG = 'adminGuidance123'

async function hashPassword(){
    const hashedPassword = await bcrypt.hash(passwordG, 10);
    console.log('Hashed Password:', hashedPassword);
}

hashPassword();