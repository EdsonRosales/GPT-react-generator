import { useState } from "react";
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader
} from "../../components";
import { orthographyUseCase } from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
};

export const OrthographyPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );
    
    const { ok, message, errors, userScore } = await orthographyUseCase(text);
    if (!ok) {
      setMessages( (prev) => [...prev, { text: 'No se pudo realizar la correción', isGptMessage: true }] );
    } else {
      setMessages( (prev) => [...prev, {
        text: message,
        isGptMessage: true,
        info: { errors, message, userScore }
      }]);
    }
    
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
                  <GptOrthographyMessage
                    key={index}
                    errors={message.info!.errors}
                    message={message.info!.message}
                    userScore={message.info!.userScore}
                  />
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
