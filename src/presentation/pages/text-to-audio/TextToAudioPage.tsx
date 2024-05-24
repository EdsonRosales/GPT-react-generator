import { useState } from "react";
import { GptMessage, GptMessageAudio, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

export type TextMessage = {
  text: string;
  isGptMessage: boolean;
  type: 'text';
};

export type AudioMessage = {
  text: string;
  isGptMessage: boolean;
  audio: string;
  type: 'audio'
};

type Message = TextMessage | AudioMessage;

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
    setMessages( (prev) => [...prev, { text, isGptMessage: false, type: 'text' }] );

    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);
    setIsLoading(false);

    if (!ok) {
      alert('No se pudo generar el audio');
      throw new Error('No se pudo generar el audio')
    }

    setMessages( (prev) => [...prev, { text: `${selectedVoice} - ${message}`, isGptMessage: true, type: 'audio', audio: audioUrl! }] );
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
                  message.type === 'audio'
                  ? (
                    <GptMessageAudio
                      key={index}
                      text={message.text}
                      audio={message.audio}
                    />
                  ) : (
                    <GptMessage text={message.text} key={index} />
                  )
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
