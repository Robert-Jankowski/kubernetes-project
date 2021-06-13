import './App.css';
import {PostButton, GetButton, PostForm, GetForm, ResultBar} from "./components"
import {useState} from "react"

function App() {

  const [resultBar, setResultBar] = useState({
    status: "info",
    message: "Send request, response will be here!"
  })
  const [pesel, setPesel] = useState("")
  const [inputData, setInputData] = useState({
    firstName: "",
    lastName: "",
    pesel: ""
  })


  return (
    <div className="App" style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{height: "40%", width: "40%"}}>
        <div >
          <PostForm inputData={inputData} setInputData={setInputData}/>
          <PostButton inputData={inputData} setResultBar={setResultBar}/>
        </div>
        <div style={{marginBottom: "5%", marginTop: "5%"}}>
          <GetForm pesel={pesel} setPesel={setPesel}/>
          <GetButton pesel={pesel} setResultBar={setResultBar}/>
        </div>
        <ResultBar resultBar={resultBar}/>
      </div>
    </div>
  );
}

export default App;
