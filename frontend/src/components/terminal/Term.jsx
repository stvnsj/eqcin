import React from 'react'
import Terminal from 'react-console-emulator'
import axios from "axios";




const edit_despido_fecha_handler = async function (contrato_id, new_date) {



    const data ={
        
        contrato_id : contrato_id,
        new_date: new_date

    };

    const url = "http://localhost:8000/contrato/safe-edit-fire";
    try{
        //return contrato_id + " " + new_date
        const res = await axios.put(url,data);
        return <span style={{ color: '#67c461', fontWeight: 'bold' }}>
        ✔ {res.data.message}
        </span>
    } catch(e) {

        return <span style={{ color: 'salmon', fontWeight: 'bold' }}>
        ✖ {e.response.data.message}
        </span>
         
    }
};


const commands = {
    edit_despido_fecha: {
        description: 'Edita la fecha de despido de un contrato. Recibe id de contrato y fecha en formato aaaa-mm-dd',
        usage: 'edit_despido_fecha <contrato_id> <termino>',
        fn: edit_despido_fecha_handler
    }
}




export  function FakeTerminal() {
  return (
    <div
      style={{
        height: 200,            // fix the terminal’s height
        width:  '100%',
        border: '5px solid #5297d6',
        borderRadius : "5px",
        overflowY: 'auto',      // scroll internally when content grows
      }}
    >
      <Terminal
        promptLabel="EQC>>"
        style={{ 
            backgroundColor: '#232323',
                borderRadius: 0,           // no rounding on the inner pane
        }}
        contentStyle={{ 
            color:      '#dbdbdb', 
            background: '#232323', 
            fontFamily: 'monospace',
            textAlign: 'left',
                borderRadius: 0,           // no rounding on the inner pane
        }}
        // the prompt+input wrapper
        inputAreaStyle={{ 
            backgroundColor: '#444444' 
        }}
        // just the prompt label itself (“$”)
        promptLabelStyle={{ 
            color: '#268bd2',
            fontWeight:"bold",
            verticalAlign:'middle',
            fontFamily: 'monospace',
        }}
        // the text you type
        inputStyle={{ 
            color: '#268bd2',
            fontWeight: 'bold',
            verticalAlign:'middle',
            fontFamily: 'monospace',
        }}
        
        commands={commands}
        welcomeMessage={"EQCin"}     // optional: disable the welcome banner
        noAutomaticStdout={true}   // ← turn off the “echo” of the last command :contentReference[oaicite:0]{index=0}
        // noHistory={true}        // ← optionally disable history entirely
        // you can also style the inner content via className/contentClassName if you prefer
      />
    </div>
  )
}

