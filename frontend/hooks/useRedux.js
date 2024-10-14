const initialState = {
    dados: null,
  };
  
  const SET_DADOS = 'SET_DADOS';
  
  export const setDados = (dados) => ({
    type: SET_DADOS,
    dados,
  });
  
  export default function dadosReducer(state = initialState, action) {
    switch (action.type) {
      case SET_DADOS:
        return {
          ...state,
          dados: action.dados,
        };
      default:
        return state;
    }
  }