import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FirstPokemonState {
    alreadyHasFirstPokemon: boolean;
  }

  const initialState: FirstPokemonState = {
    alreadyHasFirstPokemon: false,
  };
  
  const firstPokemonSlice = createSlice({
    name: 'firstPokemon',
    initialState,
    reducers: {
      setAlreadyHasFirstPokemon: (state, action: PayloadAction<boolean>) => {
        state.alreadyHasFirstPokemon = action.payload;
      },
    },
  });

export const { setAlreadyHasFirstPokemon } = firstPokemonSlice.actions;
export default firstPokemonSlice.reducer;