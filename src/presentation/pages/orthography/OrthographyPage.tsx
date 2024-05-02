import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components";

export const OrthographyPage = () => {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Welcome message */}
          <GptMessage text="Hola, puedes escribir tu texto en español y te ayudo con las correcciones" />

          {/* The user messages */}
          <MyMessage text="Hola Mundo" />


          <TypingLoader className="fade-in" />
        </div>
      </div>

      {/* Message Box */}
      <TextMessageBox
        onSendMessage={ (message) => console.log(message) }
        placeholder="Comienza a escribir..."
        disableCorrections
      />

    </div>
  )
};
