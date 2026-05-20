import { UserRole } from "@/src/domain/enums/user-role.enum";
import { prisma } from "@/src/infrastructure/database/prisma/client";
import { BcryptService } from "@/src/infrastructure/services/bcrypt.service";
import { UUIDGenerator } from "@/src/infrastructure/services/uuid-generator";

// gera um usuario dev
async function main() {
  const nm = process.env.ADMIN_NICKNAME;
  if (!nm) return;

  const bcrypt = new BcryptService();
  const uuid = new UUIDGenerator();
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123");

  // 1. Em vez de upsert (que exige campo unique), usamos findFirst
  const existingUser = await prisma.user.findFirst({
    where: { nickname: nm }
  });

  if (existingUser) {
    // 2. Se já existe, usamos o ID que o findFirst trouxe para dar o update
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: process.env.ADMIN_NAME || "Admin Manutenção",
        password: hashedPassword,
      }
    });
  } else {
    // 3. Se não existe, criamos do zero
    await prisma.user.create({
      data: {
        id: uuid.generate(),
        normalizedName: "dev maintenance",
        nickname: nm,
        name: process.env.ADMIN_NAME || "Admin Manutenção",
        password: hashedPassword,
        role: UserRole.ADMIN,
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });