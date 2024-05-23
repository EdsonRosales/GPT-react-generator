import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { 
  prosConsStreamFunctionGeneratorUseCase,
  // prosConsStreamUseCase
} from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

export const ProsConsStreamPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    const stream = await prosConsStreamFunctionGeneratorUseCase(text);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: '', isGptMessage: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      })
    }

    // const reader = await prosConsStreamUseCase(text);
    
    // if (!reader) return alert('No se pudo generar el reader');

    // // Generate the last message
    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages((messages) => [...messages, { text: message, isGptMessage: true }])

    // while(true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   message += decodedChunk;

    //   // Update the last message as OpenAI emits the messages of his response
    //   setMessages((messages) => {
    //     const newMessages = [...messages];
    //     newMessages[newMessages.length - 1].text = message;
    //     return newMessages;
    //   })
    // }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="¿Qué cosas deseas que compare?" />

          {
            messages.map( (message, index) => (
              message.isGptMessage
                ? (
                  <GptMessage text={message.text} key={index} />
                ) : (
                  <MyMessage text={message.text} key={index} />
                )
            ))
          }
          
          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader />
              </div>
            )
          }
        </div>
      </div>

      {/* Message Box */}
      <TextMessageBox
        onSendMessage={ handlePost }
        placeholder="Comienza a escribir..."
        disableCorrections
      />

    </div>
  )
};
