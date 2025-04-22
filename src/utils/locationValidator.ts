type CountryList = {
  [key: string]: string[]; // Key: country name, Value: array of city names (or capitals)
};

type CitiesList = {
  [key: string]: string[]; // Key: country name, Value: array of city names (or capitals)
};

class LocationValidator {
  private country_list: CountryList | null = null; // Cache the country list
  private cities_list: CitiesList | null = null; // Cache the country list

  private async fetchCountriesOnce() {
    if (this.country_list) return; // If data is already fetched, return

    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();

      // Map the country data to the required structure
      this.country_list = data.reduce((acc: CountryList, country: any) => {
        const countryName = country.name.common.toLowerCase();
        const cityNames = country.capital || []; // Fallback to an empty array if no capital
        acc[countryName] = cityNames;
        return acc;
      }, {});

    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch country list');
    }
  }

  // Method to validate if the country exists (case-insensitive)
  public async validateCountry(country: string): Promise<boolean> {
    if (!country) return true; // Allow empty country value to be valid
    await this.fetchCountriesOnce(); // Fetch country data if not already done

    const normalizedCountry = country.toLowerCase();
    return !!this.country_list?.[normalizedCountry]; // Check if the country exists in the list
  }

// Private method to fetch cities for a given country
private async fetchCities(country: string) {
  if (this.cities_list && this.cities_list[country]) return; // If cities for this country are already fetched, return

  try {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    });
    
    const data = await response.json();

    if (!data.error) {
      if (!this.cities_list) {
        this.cities_list = {};
      }
      this.cities_list[country] = data.data || [];
    } else {
      throw new Error('Failed to retrieve cities');
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Failed to fetch city list');
  }
}

// Method to validate if the city exists in the specified country (case-insensitive)
public async validateCityInCountry(country: string, city: string): Promise<boolean> {
  if (!country || !city) return false; // Country and city must be provided
  
  // Fetch cities for the given country if not already fetched
  await this.fetchCities(country); 
  
  const normalizedCity = city.toLowerCase();
  const cities = this.cities_list![country] || [];

  // Check if the city exists in the list
  return cities.some(c => c.toLowerCase() === normalizedCity);
}
}

export default LocationValidator;
