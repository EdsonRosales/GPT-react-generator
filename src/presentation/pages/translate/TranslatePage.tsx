import { useState } from "react";
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { translateTextUseCase } from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    setMessages( (prev) => [...prev, { text: newMessage, isGptMessage: false }] );
    
    const { ok, message } = await translateTextUseCase(text, selectedOption)
    
    setIsLoading(false);
    
    if (!ok) return alert(message);
    
    setMessages( (prev) => [...prev, { text: message, isGptMessage: true }] );
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="Hola, ¿Qué necesitas traducir?" />

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
        options={languages}
      />

    </div>
  )
};
