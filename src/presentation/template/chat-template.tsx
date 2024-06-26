import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../components";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

export const ChatTemplate = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    // TO DO: Call to the matching Use Case
    
    setIsLoading(false);

    // TO DO: Add the isGPTMessage in true
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />

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
      <TextMessageBox
        onSendMessage={ handlePost }
        placeholder="Comienza a escribir..."
        disableCorrections
      />

    </div>
  )
};
