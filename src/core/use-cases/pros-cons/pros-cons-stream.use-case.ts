// import type { OrthographyResponse } from "../../interfaces";

export const prosConsStreamUseCase = async ( prompt: string ) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
      // TO DO: abortSignal
    });
    
    if ( !resp.ok ) throw new Error('No se pudo realizar la comparación');

    // const data = await resp.json() as OrthographyResponse;
    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('No se pudo generar el reader')
      return null;
    }

    return reader;

    // To decode the reader
    // const decoder = new TextDecoder();

    // let text = '';

    // while(true) {
    //   const { value, done } = await reader.read();
    //   if (done) {
    //     break;
    //   }

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   text += decodedChunk;
    //   console.log(text);
    // }

  } catch (error) {
    console.error(error);
    return null;
  }
}