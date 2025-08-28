'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2, BarChart, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getForecast } from './actions';
import type { ForecastDemandOutput } from '@/ai/flows/fleet-and-stock-prediction';

const formSchema = z.object({
  machineType: z.string().min(1, 'Please select a machine type.'),
  siteType: z.string().min(1, 'Please select a site type.'),
  weatherCondition: z.string().min(1, 'Please select a weather condition.'),
  season: z.string().min(1, 'Please select a season.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ForecastingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ForecastDemandOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machineType: '',
      siteType: '',
      weatherCondition: '',
      season: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const forecastResult = await getForecast(values);
      setResult(forecastResult);
    } catch (error) {
      console.error('Forecast failed:', error);
      toast({
        title: 'Error',
        description:
          'Failed to generate forecast. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Demand Forecast
                </CardTitle>
                <CardDescription>
                  Use AI to predict equipment demand based on various factors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="machineType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machine Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a machine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Excavator">Excavator</SelectItem>
                            <SelectItem value="Bulldozer">Bulldozer</SelectItem>
                            <SelectItem value="Crane">Crane</SelectItem>
                            <SelectItem value="Loader">Loader</SelectItem>
                            <SelectItem value="Generator">Generator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="siteType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a site type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Urban Construction">
                              Urban Construction
                            </SelectItem>
                            <SelectItem value="Roadwork">Roadwork</SelectItem>
                            <SelectItem value="Mining">Mining</SelectItem>
                            <SelectItem value="Agricultural">Agricultural</SelectItem>
                            <SelectItem value="Landscaping">Landscaping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weatherCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weather Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select weather" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sunny">Sunny</SelectItem>
                            <SelectItem value="Rainy">Rainy</SelectItem>
                            <SelectItem value="Snowy">Snowy</SelectItem>
                            <SelectItem value="Windy">Windy</SelectItem>
                            <SelectItem value="Extreme Heat">Extreme Heat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="season"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Season</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a season" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Spring">Spring</SelectItem>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Autumn">Autumn</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Forecast
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                 <BarChart className="h-5 w-5 text-muted-foreground" />
                Forecasted Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : result ? (
                <p className="text-3xl font-bold text-primary">{result.demandForecast}</p>
              ) : (
                <p className="text-muted-foreground">
                  Results will be displayed here.
                </p>
              )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-muted-foreground" />
                AI Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                 <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                 </div>
              ) : result ? (
                <p className="text-sm text-foreground">{result.reasoning}</p>
              ) : (
                <p className="text-muted-foreground">
                  AI analysis will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
