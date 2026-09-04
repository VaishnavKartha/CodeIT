import { runInSandbox } from "../lib/runCode.sandbox.js"
export const runCode=async(req,res)=>{
    try {
        const {language,code} = req.body;

        if(!language?.trim() || !code?.trim()){
            return res.status(400).json({message:"Invalid request"});
        }

        const result = await runInSandbox(language,code)
        console.log(result)
        return res.status(200).json(result);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error:error.message});
    }
}