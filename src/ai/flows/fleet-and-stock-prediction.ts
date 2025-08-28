'use server';
/**
 * @fileOverview Forecasts equipment demand per machine type and site using weather and site data.
 *
 * - forecastDemand - A function that handles the demand forecasting process.
 * - ForecastDemandInput - The input type for the forecastDemand function.
 * - ForecastDemandOutput - The return type for the forecastDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastDemandInputSchema = z.object({
  machineType: z.string().describe('The type of machine.'),
  siteType: z.string().describe('The type of site (e.g., construction, agricultural).'),
  weatherCondition: z.string().describe('The weather conditions at the site.'),
  season: z.string().describe('The season of the year.'),
});
export type ForecastDemandInput = z.infer<typeof ForecastDemandInputSchema>;

const ForecastDemandOutputSchema = z.object({
  demandForecast: z.string().describe('The forecasted demand for the equipment.'),
  reasoning: z.string().describe('The reasoning behind the demand forecast.'),
});
export type ForecastDemandOutput = z.infer<typeof ForecastDemandOutputSchema>;

export async function forecastDemand(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  return forecastDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastDemandPrompt',
  input: {schema: ForecastDemandInputSchema},
  output: {schema: ForecastDemandOutputSchema},
  prompt: `You are an expert in predicting equipment demand for rental companies.

  Based on the machine type, site type, weather conditions, and season, provide a demand forecast and the reasoning behind it.

  Machine Type: {{{machineType}}}
  Site Type: {{{siteType}}}
  Weather Conditions: {{{weatherCondition}}}
  Season: {{{season}}}
  `,
});

const forecastDemandFlow = ai.defineFlow(
  {
    name: 'forecastDemandFlow',
    inputSchema: ForecastDemandInputSchema,
    outputSchema: ForecastDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
