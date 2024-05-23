import { useRef, useState } from "react";
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

  // Ref to the abortcontroller
  const abortController = useRef(new AbortController);
  const isRunning = useRef(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();  // <---- To prevent the cancellation of the new request
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    const stream = prosConsStreamFunctionGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: '', isGptMessage: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;
        return newMessages;
      })
    }

    isRunning.current = false;
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
