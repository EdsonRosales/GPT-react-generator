import { useEffect, useState } from "react";
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { askQuestionUseCase, createThreadUseCase } from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
};

export const AssistantPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  // Get the thread and if it not exists, create a new one
  useEffect(() => {
    const threadId = localStorage.getItem('threadId');
    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase()
      .then( (id) => {
        setThreadId(id);
        localStorage.setItem('threadId', id);
      })
    }
  }, []);
  
  useEffect(() => {
    if (threadId) {
      setMessages( (prev) => [...prev, { text: `Número de thread: ${threadId}`, isGptMessage: true }] );
    }
  }, [threadId]);
  
  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    // Call to the matching Use Case
    const replies = await askQuestionUseCase(threadId, text);
    
    // Add the isGPTMessage in true
    setIsLoading(false);
    
  };
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="Buen día, soy Clarissa. ¿En qué puedo ayudarte? :)" />  {/* TO DO: Change the message greeting based on day hour */}

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

