export async function* prosConsStreamFunctionGeneratorUseCase ( prompt: string ) {
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

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('No se pudo generar el reader')
      return null;
    }

    const decoder = new TextDecoder();
    let text = '';

    while(true) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      yield text;
    }

  } catch (error) {
    console.error(error);
    return null;
  }
}