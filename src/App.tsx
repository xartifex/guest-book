import React, { useCallback, useEffect, useState } from 'react'
import { WalletConnection } from 'nearlib'

// is this a bad idea?
import { PostedMessage } from '../assembly/model'

type AppProps = {
  contract: {
    addMessage: ({ text }: { text: string }, gas?: string, amount?: string) => Promise<void>
    getMessages: () => Promise<PostedMessage[]>
  }
  nearConfig: { // TODO: get this from config.ts
    contractName: string
  }
  wallet: WalletConnection
}

const App = ({ contract, nearConfig, wallet }: AppProps) => {
  const [messages, setMessages] = useState([])
  const [accountId, setAccountId] = useState(wallet.getAccountId())
  const [inputText, setInputText] = useState('')
  const [inputReadOnly, setinputReadOnly] = useState(false)

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(messages => {
      setMessages(messages)
    })
  }, [])

  const signIn = useCallback(() => {
    wallet.requestSignIn( // TODO: fix requestSignIn signature in nearlib
      nearConfig.contractName,
      'NEAR Guest Book'
    )
  }, [])

  const signOut = useCallback(() => {
    wallet.signOut()
    setAccountId(null)
  }, [])

  const addMessage = useCallback(async (text, isPremium) => {
    setinputReadOnly(true)
    const BOATLOAD_OF_GAS = '10000000000000000'
    const PREMIUM_COST = '10000000000000000000000'
    await contract.addMessage({ text }, BOATLOAD_OF_GAS, isPremium ? PREMIUM_COST.toString() : '0')
    setInputText('')
    const messages = await contract.getMessages()
    setMessages(messages)
    setinputReadOnly(false)
  }, [])

  return (
    <main>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1>NEAR Guest Book</h1>
        {accountId
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      {accountId && (
        <form onSubmit={e => { e.preventDefault() }}>
          <label htmlFor="message">
            Sign the guest book, { accountId }!
          </label>
          <div style={{ display: 'flex' }}>
            <input
              autoComplete="off"
              autoFocus
              value={ inputText }
              onChange={(e) => { setInputText(e.target.value) }}
              id="message"
              required
              style={{ flex: 1 }}
              readOnly={ inputReadOnly }
              className={ 'message-input' }
            />
            <button type="submit" style={{ marginLeft: '0.5em' }} onClick={(e) => {
              addMessage(inputText, false)
            }}>
              Save
            </button>
            <button className="primary" type="submit" style={{ marginLeft: '0.5em' }} onClick={(e) => {
              addMessage(inputText, true)
            }}>
              Save & Donate
            </button>
          </div>
        </form>
      )}
      {!!messages.length && (
        <>
          <h2>Messages</h2>
          {messages.map((message, i) =>
            // TODO: format as cards, add timestamp
            <p key={i} className={message.premium ? 'is-premium' : ''}>
              <strong>{message.sender}</strong>:<br/>
              {message.text}
            </p>
          )}
        </>
      )}
    </main>
  )
}

export default App
