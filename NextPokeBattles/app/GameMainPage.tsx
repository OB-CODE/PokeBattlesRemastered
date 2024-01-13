'use client'
import { useState } from "react"
import React from 'react'
import ChooseStarterPokemon from "./component/ChooseStarterPokemon"

const GameMainPage = () => {

  const [alreadyHasFirstPokemon, setAlreadyHasFirstPokemon] = useState(false)

  return (
    <div className='w-[90%] h-[80%] mx-auto my-5 border-4 border-black bg-white bg-opacity-80'>
      {alreadyHasFirstPokemon ? <div>already selected</div> : <ChooseStarterPokemon />}
    </div>
  )
}

export default GameMainPage