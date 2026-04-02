import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import React from 'react'

const App = () => {
  return (
    <div>
      <h1>HOME PAGE</h1>
        <Show when="signed-out">
          <SignInButton mode='modal'/>
          <SignUpButton mode='modal' />
        </Show>
        <Show when="signed-in">
          <UserButton/>
        </Show>
    </div>
  )
}

export default App