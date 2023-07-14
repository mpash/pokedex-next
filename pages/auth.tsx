import { Avatar, Flex, HStack } from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'

const Auth = () => {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <HStack>
          <Avatar src={session?.user?.image ?? ''} size="sm" />
          <div>Signed in as {session?.user?.name}</div>
        </HStack>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn('discord', { callbackUrl: '/auth' })}>Sign in</button>
    </>
  )
}

export default Auth
