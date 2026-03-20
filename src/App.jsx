import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";

// Create AI instance once outside the component to avoid re-creating on every render
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_KEY });

// Models to try in order — each has its own separate quota on the free tier
const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

// Retry helper: tries each model with retries, falls back to next model if quota is exhausted
async function callWithRetry(contentsFn, maxRetries = 2, baseDelay = 2000) {
  for (const model of MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Trying model: ${model} (attempt ${attempt + 1})`);
        const contents = typeof contentsFn === 'function' ? contentsFn() : contentsFn;
        return await ai.models.generateContent({ model, contents });
      } catch (error) {
        const isRateLimit = error?.status === 429 ||
          error?.message?.includes('429') ||
          error?.message?.toLowerCase()?.includes('rate limit') ||
          error?.message?.toLowerCase()?.includes('quota');

        if (isRateLimit && attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Rate limited on ${model}. Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else if (isRateLimit && MODELS.indexOf(model) < MODELS.length - 1) {
          console.warn(`${model} quota exhausted. Falling back to next model...`);
          break; // break inner loop to try next model
        } else {
          throw error;
        }
      }
    }
  }
  throw new Error("All models exhausted. Please wait a few minutes or use a different API key.");
}

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      borderColor: '#3f3f46',
      color: '#fff',
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b',
      color: '#fff',
      width: "100%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#18181b',
      color: '#fff',
      cursor: 'pointer',
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa',
      width: "100%"
    }),
  };

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [fixedCodeLoading, setFixedCodeLoading] = useState(false);


  async function reviewCode() {
    setResponse("");
    setLoading(true);
    try {
      const result = await callWithRetry(() => `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}
`);
      setResponse(result.text);
    } catch (error) {
      console.error("Review failed:", error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase()?.includes('rate limit') || error?.message?.toLowerCase()?.includes('quota')) {
        setResponse("⚠️ **Rate limit exceeded.** The API quota has been exhausted even after retrying. Please wait a few minutes and try again, or use a new API key from a different Google Cloud project.");
      } else {
        setResponse(`❌ **Error:** ${error.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  }


  async function FixCode() {
    setFixedCodeLoading(true);
    try {
      const result = await callWithRetry(() => `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I'm sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

just Fixed code without any explanation but with error handling, just the code.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}
`);
      const lang = selectedOption.value;
      const regex = new RegExp("```" + lang + "|```", "g");
      setCode(result.text.replace(regex, ''));
    } catch (error) {
      console.error("Fix code failed:", error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase()?.includes('rate limit') || error?.message?.toLowerCase()?.includes('quota')) {
        setResponse("⚠️ **Rate limit exceeded.** The API quota has been exhausted even after retrying. Please wait a few minutes and try again.");
      } else {
        setResponse(`❌ **Error fixing code:** ${error.message || 'Something went wrong. Please try again.'}`);
      }
    } finally {
      setFixedCodeLoading(false);
    }
  }


  return (
    <>
      <Navbar />
      <div className="main flex flex-col md:flex-row w-full" style={{ height: "calc(100vh - 70px)", overflow: "hidden" }}>
        <div className="left flex flex-col h-[50vh] md:h-full w-full md:w-[50%]">
          <div className="tabs !mt-3 !px-3 md:!mt-5 md:!px-5 !mb-3 w-full flex items-center gap-[8px] md:gap-[10px] flex-wrap">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />
            <button onClick={() => { 
              if (code === "") {
                alert("Please enter code first")
              }
              else {
                
                FixCode()
              }
            }}
            className="btnNormal bg-zinc-900 min-w-[80px] md:min-w-[120px] transition-all hover:bg-zinc-800">{!fixedCodeLoading ? "Fix Code" : "..."}</button>
            <button onClick={() => {
              if (code === "") {
                alert("Please enter code first")
              }
              else {
                
                reviewCode()
              }
            }} className="btnNormal bg-zinc-900 min-w-[80px] md:min-w-[120px] transition-all hover:bg-zinc-800">Review</button>
          </div>
          
          <Editor height="100%" theme='vs-dark' language={selectedOption.value} value={code} onChange={(e) => { setCode(e) }} />
        </div>

        <div className="right !p-[10px] bg-zinc-900 w-full md:w-[50%]" style={{ overflowY: "auto", height: "auto" }}>
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justif-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          {loading && <RingLoader color='#9333ea'/>}
          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  )
}

export default App