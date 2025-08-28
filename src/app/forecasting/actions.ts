'use server';

import { forecastDemand, ForecastDemandInput, ForecastDemandOutput } from '@/ai/flows/fleet-and-stock-prediction';

export async function getForecast(input: ForecastDemandInput): Promise<ForecastDemandOutput> {
  try {
    const result = await forecastDemand(input);
    return result;
  } catch (error) {
    console.error('Error in getForecast server action:', error);
    throw new Error('Failed to get forecast from the AI model.');
  }
}
