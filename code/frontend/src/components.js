import axios from 'axios'
import { Button, Input, Alert, AlertIcon} from "@chakra-ui/react";
import Config from "./config"

const pathBase = Config.backend_path

export const PostButton = ({inputData, setResultBar}) => {

    function handlePost() {
      axios.post(pathBase, inputData)
      .then(response => {
        setResultBar({
          status: "success", 
          message:`[${response.status}]: CREATED PERSON ${response.data.person}`})
      })
      .catch(error => {
        setResultBar({
          status: "error", 
          message:`[${error.response.status}]: ${error.response.data.error}`})
      })
    }
    
    if(inputData.pesel.length !== 11 || inputData.firstName.length < 1 || inputData.lastName.length < 1)
      return(<Button disabled colorScheme="teal" size="md" width="100%">ADD PERSON</Button>)
    else
      return (<Button colorScheme="teal" size="md" width="100%" onClick={() => handlePost()}>POST</Button>)
    }

export const PostForm = ({inputData, setInputData}) => (
    <div>
      <h3>Under development</h3>
      <Input size="md"
             name="firstName"
             placeholder="First name"
             value={inputData.firstName} 
             onChange={e => setInputData({...inputData, firstName: e.target.value})}/>
      <Input size="md"
             name="lastName"
             placeholder="Last name"
             value={inputData.lastName}
             onChange={e => setInputData({...inputData, lastName:  e.target.value})}/>
      <Input size="md" 
             name="pesel"
             placeholder="PESEL"
             value={inputData.pesel}
             onChange={e => setInputData({...inputData, pesel:     e.target.value})}/>
    </div>
  )

export const GetForm = ({pesel, setPesel}) => (
    <Input size="md"
           name="getpesel"
           placeholder="Find person by PESEL"
           value={pesel} 
           onChange={e => setPesel(e.target.value)}/>
  )


export const GetButton = ({pesel, setResultBar}) => {
  
  function handleGet() {
    axios.get(`${pathBase}${pesel}`)
      .then(response => {
        if(!response.data.cache.inCache)
          setResultBar({
            status: "success", 
            message:`[${response.status}]: GET PERSON ${response.data.person}`})
        else
          setResultBar({
            status: "success",
            message:`[${response.status}]: GET PERSON ${response.data.person} [FROM CACHE (${response.data.cache.time}s)]`})
      })
      .catch(error => {
        setResultBar({
          status: "error", 
          message:`[${error.response.status}]: ${error.response.data.error}`})
      })
  }

  if(pesel.length !== 11)
    return(<Button disabled colorScheme="teal" size="md" width="100%">FIND PERSON</Button>)
  else
    return (
      <Button colorScheme="teal" size="md"  width="100%" onClick={() => handleGet()}>GET</Button>
    )}


export const ResultBar = ({resultBar}) => (
  <Alert status={resultBar.status}>
    <AlertIcon />
    {resultBar.message}
  </Alert>
)