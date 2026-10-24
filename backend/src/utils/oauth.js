
export async function getUserWithOauthId({ email, provider }) {
  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isEmailValid: true,
      oauthAccount: {
        select: {
          providerAccountId: true,
          provider: true
        }
      }
    }
  })

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    providerAccountId: user.oauthAccount?.providerAccountId || null,
    provider: user.oauthAccount?.provider || null
  }
}

export async function linkUserWithOauth(userId, provider, providerAccountId) {
  await prisma.oauthAccount.create({
    data:{
      userId,
      provider,
      providerAccountId
    }
  })
}

export async function createUserWithOauth({ email, provider, providerAccountId }) {
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        passwordHash: null,   // OAuth user ka password nahi hota
        verified: true,
        isEmailValid: true
      }
    })

    // Step 2: usi transaction ke andar, OauthAccount bhi banao
    await tx.oauthAccount.create({
      data: {
        userId: newUser.id,
        provider,
        providerAccountId
      }
    })

  return {
    id: newUser.id,
    email,
    isEmailValid: true,
    provider,
    providerAccountId 
  }
})

  return user
}
