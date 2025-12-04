
import { useState } from "react";
import { model } from "@/main"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "./ui/textarea";

export function GeminiExample() {
  const [prompt, setPrompt] = useState("Write a story about a magic backpack.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResult("");
    try {
      const response = await model.generateContent(prompt);
      const text = response.response.text();
      setResult(text);
    } catch (e) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Gemini API Example</CardTitle>
        <CardDescription>
          This is an example of how to use the Firebase AI Logic SDK to interact with the Gemini API.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="prompt">Prompt:</label>
          <Textarea 
            id="prompt"
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            className="mt-2"
          />
        </div>
        <Button onClick={run} disabled={loading}>
          {loading ? "Generating..." : "Generate Text"}
        </Button>
        {result && (
          <div>
            <label>Result:</label>
            <div className="mt-2 p-4 border rounded-md bg-gray-100 dark:bg-gray-800">
              {result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
