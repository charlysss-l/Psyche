import bcrypt from 'bcryptjs';

const password = 'adminpsychology123*';

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed Password:', hashedPassword);
}

hashPassword();
