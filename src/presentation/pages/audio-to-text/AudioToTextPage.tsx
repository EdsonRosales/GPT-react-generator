import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoader } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

export const AudioToTextPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp) return;

    console.log({resp});
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="Hola, qué audio deseas transcribir?" />

          {
            messages.map( (message, index) => (
              message.isGptMessage
                ? (
                  <GptMessage text="Esto es un mensaje de GPT" key={index} />
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
      <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder="Comienza a escribir..."
        acceptedFiles="audio/*"
      />

    </div>
  )
};

