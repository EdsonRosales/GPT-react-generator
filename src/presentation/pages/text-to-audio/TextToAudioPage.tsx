import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

const disclaimer = `
  ## Hola, ¿Qué audio te gustaría generar?
  * Todo el audio generado es mediante AI.
`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
]

export const TextToAudioPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
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
          <GptMessage text={disclaimer} />

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
      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder="Comienza a escribir..."
        options={voices}
        selectPlaceholder="Selecciona una voz"
      />

    </div>
  )
};
