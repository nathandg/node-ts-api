import { AxiosStatic } from 'axios';

export interface StormGlassPointSource {
   [key: string]: number;
}

export interface StormGlassPoint {
   readonly time: string;
   readonly weaveHeight: StormGlassPointSource;
   readonly swellDirection: StormGlassPointSource;
   readonly swellHeight: StormGlassPointSource;
   readonly swellPeriod: StormGlassPointSource;
   readonly waveDirection: StormGlassPointSource;
   readonly waveHeight: StormGlassPointSource;
   readonly windDirection: StormGlassPointSource;
   readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
   hours: StormGlassPoint[];
}

export interface ForecastPoint {
   time: string;
   waveHeight: number;
   swellDirection: number;
   swellHeight: number;
   swellPeriod: number;
   waveDirection: number;
   windDirection: number;
   windSpeed: number;
}

export class StormGlass {
   readonly stormGlassAPIParams =
      'swllDirection, swellHeight, swellPeriod, waveDirection, waveHeight, windDirection, windSpeed';
   readonly stormGlassAPISource = 'noaa';

   constructor(protected request: AxiosStatic) {}

   public async fetchPoints(
      lat: number,
      lng: number
   ): Promise<ForecastPoint[]> {
      const response = await this.request.get<StormGlassForecastResponse>(
         `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
      );

      const responseNormalized = this.normalizeResponse(response.data);
      return responseNormalized;
   }

   /*
      * For comprend the code below, im explaining the code pass by pass
   
      * First, we have a method called normalizeResponse;
      * This method need a parameter called points, that is a StormGlassForecastResponse, this is a response from the API;
      * This method return a ForecastPoint[], that is more clean and easy to use;
       
      * inside the method, we have a filter, this is true when the point is valid, and false when the point is invalid;

      * When this point is valid, we have a map, that search for the point and return a new object with clean data;
      * When this point is invalid, the filter return false, and the map not return this point;
      
      * OBS: The filter inspects the all objects inside the hours array, and return true or false;
   */

   private normalizeResponse(
      points: StormGlassForecastResponse
   ): ForecastPoint[] {
      return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
         swellDirection: point.swellDirection[this.stormGlassAPISource],
         swellHeight: point.swellHeight[this.stormGlassAPISource],
         swellPeriod: point.swellPeriod[this.stormGlassAPISource],
         time: point.time,
         waveDirection: point.waveDirection[this.stormGlassAPISource],
         waveHeight: point.waveHeight[this.stormGlassAPISource],
         windDirection: point.windDirection[this.stormGlassAPISource],
         windSpeed: point.windSpeed[this.stormGlassAPISource],
      }));
   }

   public isValidPoint(point: Partial<StormGlassPoint>): boolean {
      return !!(
         point.time &&
         point.swellDirection?.[this.stormGlassAPISource] &&
         point.swellHeight?.[this.stormGlassAPISource] &&
         point.swellPeriod?.[this.stormGlassAPISource] &&
         point.waveDirection?.[this.stormGlassAPISource] &&
         point.waveHeight?.[this.stormGlassAPISource] &&
         point.windDirection?.[this.stormGlassAPISource] &&
         point.windSpeed?.[this.stormGlassAPISource]
      );
   }
}
