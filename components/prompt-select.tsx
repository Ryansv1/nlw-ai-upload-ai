import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

interface Prompt{
    id: string
    title: string
    template: string
}

interface PromptSelectedProps{
    onPromptSelected: (template: string) => void
}

export function Prompts(props: PromptSelectedProps){
   const [prompts, setPrompts] = useState<Prompt[] | null> (null)

   useEffect(() =>{
    api.get('/prompts').then(response =>{
        setPrompts(response.data)
    })
   },[])

   function handlePromptSelected(promptId: String){
    const selectedPrompts = prompts?.find(prompt => prompt.id === promptId)

    if(!selectedPrompts){
        return
    }

    props.onPromptSelected(selectedPrompts.template)
   }
   
    return(
    <Select onValueChange={handlePromptSelected}>
    <SelectTrigger>
      <SelectValue placeholder="Selecione um prompt"/>
    </SelectTrigger>
    <SelectContent>
        {prompts?.map(prompt =>{
            return(
                <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>)
            })}
    </SelectContent>
  </Select>
    )
}