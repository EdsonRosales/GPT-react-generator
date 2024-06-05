/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useState } from "react";
import { GptMessage, GptMessageImage, MyMessage, TextMessageBox, TypingLoader } from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";

export type Message = {
  text: string;
  isGptMessage: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
};

export const ImageTunningPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask.original!);
    setIsLoading(false);

    if(!resp) return;

    setMessages((prev) => [
      ...prev,
      {
        text: 'Variación',
        isGptMessage: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ]);
  }

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGptMessage: false }] );

    // Call to the matching Use Case
    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    if (!imageInfo) return setMessages((prev) => [...prev, { text: 'No se pudo generar la imagen', isGptMessage: true }]);

    setMessages((prev) => [
      ...prev,
      {
        text,
        isGptMessage: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt
        }
      }
    ])
  };
  
  return (
    <>
      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <span>Editando...</span>
            <img
              className="border rounded-xl w-36 h-36 object-contain"
              src={originalImageAndMask.original}
              alt="Imagen Original"
            />
            <button onClick={handleVariation} className="btn-primary mt-2">Generar variación</button>
          </div>
        )
      }
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">

            {/* Welcome message */}
            <GptMessage text="¿Qué imagen te gustaría generar?" />

            {
              messages.map( (message, index) => (
                message.isGptMessage
                  ? (
                    <GptMessageImage 
                      text={message.text}
                      key={index}
                      imageUrl={message.info?.imageUrl!}
                      alt={message.info?.alt!}
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
    </>
  )
};
