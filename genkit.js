
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const ai = genkit({ plugins: [googleAI()] });

const { text } = await ai.generate({
    model: googleAI.model('gemini-1.5-flash'),
    prompt: 'Why is Genkit awesome?'
});

console.log(text());
